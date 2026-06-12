const express = require('express');
const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const redisClient = require("../config/redis");
const { register, login, logout, adminRegister, deleteProfile, verifyOTP, resendOTP } = require('../controllers/userAuthent');
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require('../middleware/adminMiddleware');

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', userMiddleware, logout);
authRouter.post("/verify-otp", verifyOTP);
authRouter.post("/resend-otp", resendOTP);
authRouter.post('/admin/register', adminMiddleware, adminRegister);
authRouter.delete('/deleteProfile', userMiddleware, deleteProfile);


authRouter.get('/check', async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(200).json({ user: null, message: "No token" });

    const payload = jwt.verify(token, process.env.JWT_KEY);
    if (!payload._id) return res.status(200).json({ user: null, message: "Invalid payload" });

    const user = await User.findById(payload._id);
    if (!user) return res.status(200).json({ user: null, message: "User not found" });

    try {
      const isBlocked = await redisClient.exists(`token:${token}`);
      if (isBlocked) return res.status(200).json({ user: null, message: "Token blocked" });
    } catch (redisErr) {
      // Fail open if Redis is down
    }

    res.status(200).json({
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        emailId: user.emailId,
        _id: user._id,
        role: user.role,
      },
      message: "Valid User"
    });
  } catch (err) {
    res.status(200).json({ user: null, message: "Invalid token" });
  }
});

module.exports = authRouter;
