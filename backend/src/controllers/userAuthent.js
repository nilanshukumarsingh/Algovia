const redisClient = require("../config/redis");
const User = require("../models/user");
const validate = require('../utils/validator');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const Submission = require("../models/submission");
const sendEmail = require("../utils/sendEmail");

const register = async (req, res) => {
  try {
    const { firstName, lastName, age, emailId, password } = req.body;

    if (!firstName || !emailId || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ emailId });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered"
      });
    }

    const cooldown = await redisClient.get(`otp_cooldown:${emailId}`);
    if (cooldown) {
      return res.status(400).json({
        message: "Wait 30 seconds before retry"
      });
    }

    await redisClient.set(`otp_cooldown:${emailId}`, "1", { EX: 30 });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await redisClient.set(
      `otp:${emailId}`,
      JSON.stringify({
        firstName,
        lastName,
        age,
        emailId,
        hashedPassword,
        otp,
      }),
      { EX: 600 }
    );

    try {
      await sendEmail({
        email: emailId,
        subject: "Verify your email",
        html: `<h2>Your OTP: ${otp}</h2>`,
      });
    } catch (emailErr) {
      console.error("❌ sendEmail failed:", emailErr.message);
      console.log(`🔑 [LOCAL DEV / DEBUG] OTP for ${emailId} is: ${otp}`);
    }

    res.status(200).json({
      message: "OTP sent to email"
    });

  } catch (err) {
    res.status(500).json({
      message: "Registration failed"
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { emailId, otp } = req.body;

    const data = await redisClient.get(`otp:${emailId}`);
    if (!data) {
      return res.status(400).json({
        message: "OTP expired"
      });
    }

    const parsedData = JSON.parse(data);

    if (parsedData.otp !== otp.toString()) {
      return res.status(400).json({
        message: "Invalid OTP"
      });
    }

    const user = await User.create({
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      age: parsedData.age,
      emailId: parsedData.emailId,
      password: parsedData.hashedPassword,
      role: "user",
    });

    const token = jwt.sign(
      { _id: user._id, emailId: user.emailId, role: "user" },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
      path: "/"
    });

    await redisClient.del(`otp:${emailId}`);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        emailId: user.emailId,
        _id: user._id,
        role: user.role,
      }
    });

  } catch (err) {
    res.status(500).json({
      message: "OTP verification failed"
    });
  }
};

const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      throw new Error("Invalid Credentials");

    const reply = {
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      emailId: user.emailId,
      _id: user._id,
      role: user.role,
    };

    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
      path: "/"
    });

    res.status(201).json({
      user: reply,
      message: "Login Successfully"
    });
  }
  catch (err) {
    res.status(401).json({
      message: "Invalid credentials"
    });
  }
};

const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    if (payload && payload.exp) {
      await redisClient.set(`token:${token}`, 'Blocked');
      await redisClient.expireAt(`token:${token}`, payload.exp);
    } else {
      await redisClient.set(`token:${token}`, 'Blocked', { EX: 60 * 60 });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/"
    });
    res.send("Logged Out Successfully");
  }
  catch (err) {
    res.status(503).json({ message: "Logout failed. Please try again." });
  }
};

const adminRegister = async (req, res) => {
  try {
    validate(req.body);
    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    const user = await User.create(req.body);
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      process.env.JWT_KEY,
      { expiresIn: 60 * 60 }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 60 * 60 * 1000,
      path: "/"
    });

    res.status(201).send("User Registered Successfully");
  }
  catch (err) {
    res.status(400).json({ message: "Registration failed. Please check your input." });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userId = req.result._id;
    await User.findByIdAndDelete(userId);
    res.status(200).send("Deleted Successfully");
  }
  catch (err) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = { register, login, logout, adminRegister, deleteProfile, verifyOTP };