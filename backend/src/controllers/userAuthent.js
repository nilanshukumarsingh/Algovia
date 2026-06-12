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

    let emailSent = true;
    try {
      await sendEmail({
        email: emailId,
        subject: "Verify your Algovia Account",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirm your Algovia Account</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #030014; margin: 0; padding: 40px 0; color: #e2e8f0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #09090f; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);">
            <!-- Logo Header -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #ef4444 0%, #3b82f6 100%); padding: 10px 14px; border-radius: 12px; font-weight: 900; color: #ffffff; font-size: 18px; font-family: monospace; letter-spacing: -1px; box-shadow: 0 0 15px rgba(239, 68, 68, 0.25);">
                      &lt;/&gt;
                    </td>
                    <td style="padding-left: 12px; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      Algovia
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Divider -->
            <tr>
              <td style="padding: 0 40px;">
                <div style="height: 1px; background: linear-gradient(90deg, rgba(30,41,59,0), #1e293b, rgba(30,41,59,0));"></div>
              </td>
            </tr>
            <!-- Body Content -->
            <tr>
              <td style="padding: 30px 40px 40px 40px; text-align: center;">
                <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 10px 0; letter-spacing: -0.5px;">Verify your identity</h2>
                <p style="font-size: 14px; line-height: 22px; color: #94a3b8; margin: 0 0 30px 0;">
                  A request was made to sign up for an Algovia account. Please use the verification code below to authorize your registration:
                </p>
                
                <!-- Verification Code Block -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto; width: 100%;">
                  <tr>
                    <td style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 16px; padding: 24px 10px; text-align: center; box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.05);">
                      <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #ef4444; padding-left: 8px;">${otp}</span>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 12px; line-height: 18px; color: #64748b; margin: 0 0 12px 0;">
                  This code is valid for <strong>10 minutes</strong> and should not be shared with anyone.
                </p>
                <p style="font-size: 11px; line-height: 16px; color: #475569; margin: 0;">
                  If you did not initiate this request, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #05050a; padding: 24px 40px; text-align: center; border-top: 1px solid #121824;">
                <p style="font-size: 11px; color: #475569; margin: 0; line-height: 16px;">
                  Build, practice, and master DSA with AI assistance.<br>
                  &copy; 2026 Algovia. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `,
      });
    } catch (emailErr) {
      console.error("❌ sendEmail failed:", emailErr.message);
      console.log(`🔑 [LOCAL DEV / DEBUG] OTP for ${emailId} is: ${otp}`);
      emailSent = false;
    }

    res.status(200).json({
      message: emailSent ? "OTP sent to email" : "OTP generated (Failed to deliver email. Check developer logs.)",
      devOtp: !emailSent ? otp : undefined
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

const resendOTP = async (req, res) => {
  try {
    const { emailId } = req.body;

    if (!emailId) {
      return res.status(400).json({
        message: "Email is required"
      });
    }

    const data = await redisClient.get(`otp:${emailId}`);
    if (!data) {
      return res.status(400).json({
        message: "Session expired or invalid email. Please register again."
      });
    }

    const cooldown = await redisClient.get(`otp_cooldown:${emailId}`);
    if (cooldown) {
      return res.status(400).json({
        message: "Wait 30 seconds before retry"
      });
    }

    await redisClient.set(`otp_cooldown:${emailId}`, "1", { EX: 30 });

    const parsedData = JSON.parse(data);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    parsedData.otp = otp;

    await redisClient.set(
      `otp:${emailId}`,
      JSON.stringify(parsedData),
      { EX: 600 }
    );

    let emailSent = true;
    try {
      await sendEmail({
        email: emailId,
        subject: "Verify your Algovia Account",
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Confirm your Algovia Account</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #030014; margin: 0; padding: 40px 0; color: #e2e8f0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #09090f; border: 1px solid #1e293b; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);">
            <!-- Logo Header -->
            <tr>
              <td style="padding: 40px 40px 20px 40px; text-align: center;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto;">
                  <tr>
                    <td style="background: linear-gradient(135deg, #ef4444 0%, #3b82f6 100%); padding: 10px 14px; border-radius: 12px; font-weight: 900; color: #ffffff; font-size: 18px; font-family: monospace; letter-spacing: -1px; box-shadow: 0 0 15px rgba(239, 68, 68, 0.25);">
                      &lt;/&gt;
                    </td>
                    <td style="padding-left: 12px; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      Algovia
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Divider -->
            <tr>
              <td style="padding: 0 40px;">
                <div style="height: 1px; background: linear-gradient(90deg, rgba(30,41,59,0), #1e293b, rgba(30,41,59,0));"></div>
              </td>
            </tr>
            <!-- Body Content -->
            <tr>
              <td style="padding: 30px 40px 40px 40px; text-align: center;">
                <h2 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0 0 10px 0; letter-spacing: -0.5px;">Verify your identity</h2>
                <p style="font-size: 14px; line-height: 22px; color: #94a3b8; margin: 0 0 30px 0;">
                  A request was made to sign up for an Algovia account. Please use the verification code below to authorize your registration:
                </p>
                
                <!-- Verification Code Block -->
                <table align="center" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 30px auto; width: 100%;">
                  <tr>
                    <td style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(239, 68, 68, 0.2); border-radius: 16px; padding: 24px 10px; text-align: center; box-shadow: inset 0 0 20px rgba(239, 68, 68, 0.05);">
                      <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace; font-size: 38px; font-weight: 800; letter-spacing: 8px; color: #ef4444; padding-left: 8px;">${otp}</span>
                    </td>
                  </tr>
                </table>

                <p style="font-size: 12px; line-height: 18px; color: #64748b; margin: 0 0 12px 0;">
                  This code is valid for <strong>10 minutes</strong> and should not be shared with anyone.
                </p>
                <p style="font-size: 11px; line-height: 16px; color: #475569; margin: 0;">
                  If you did not initiate this request, you can safely ignore this email.
                </p>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="background-color: #05050a; padding: 24px 40px; text-align: center; border-top: 1px solid #121824;">
                <p style="font-size: 11px; color: #475569; margin: 0; line-height: 16px;">
                  Build, practice, and master DSA with AI assistance.<br>
                  &copy; 2026 Algovia. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
        </html>
        `,
      });
    } catch (emailErr) {
      console.error("❌ sendEmail failed:", emailErr.message);
      console.log(`🔑 [LOCAL DEV / DEBUG] OTP for ${emailId} is: ${otp}`);
      emailSent = false;
    }

    res.status(200).json({
      message: emailSent ? "OTP sent to email" : "OTP generated (Failed to deliver email. Check developer logs.)",
      devOtp: !emailSent ? otp : undefined
    });

  } catch (err) {
    res.status(500).json({
      message: "Resend OTP failed"
    });
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

module.exports = { register, login, logout, adminRegister, deleteProfile, verifyOTP, resendOTP };