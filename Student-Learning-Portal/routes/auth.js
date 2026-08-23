const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "edumind_secret_key_2026";

// Auth middleware
const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ message: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password, schoolName, className } = req.body;
    const sendEmail = require("../utils/sendEmail");

    if (!name || !username || !password) {
      return res.status(400).json({ message: "Name, Username, and Password are required." });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists. Please choose another or login." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 6-digit OTP code for new user
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = new User({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email ? email.trim() : "",
      password: hashedPassword,
      schoolName: schoolName || "Day Care Centre School",
      className: className || "Class 5",
      otp: otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await user.save();

    const targetEmail = user.email || `${user.username}@schoolportal.com`;

    // Send OTP email
    if (targetEmail && targetEmail.includes("@")) {
      await sendEmail({
        to: targetEmail,
        subject: "🎉 EduMind AI - Welcome & Your Account Verification OTP",
        text: `Welcome to EduMind AI Portal, ${user.name}!\n\nYour 6-digit account verification OTP code is: ${otp}\n\nThis code is valid for 10 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
            <h2 style="color: #2b6cb0; text-align: center;">📘 Welcome to EduMind AI!</h2>
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>Thank you for registering. Your 6-digit account verification OTP code is:</p>
            <div style="background: #edf2f7; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0; color: #2d3748;">
              ${otp}
            </div>
            <p style="font-size: 13px; color: #718096;">Please enter this OTP to complete your account setup.</p>
          </div>
        `
      }).catch(err => console.error("Registration email sending notice:", err.message));
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: `Account created! OTP sent to ${targetEmail}`,
      token,
      demoOtp: process.env.EMAIL_USER ? undefined : otp,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        schoolName: user.schoolName,
        className: user.className
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Please enter both username and password." });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password." });
    }

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        schoolName: user.schoolName,
        className: user.className
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

// Send OTP for Forgot Password or Account Verification
router.post("/send-otp", async (req, res) => {
  try {
    const { username, email } = req.body;
    const sendEmail = require("../utils/sendEmail");

    if (!username && !email) {
      return res.status(400).json({ message: "Username or Email is required." });
    }

    const query = email
      ? { email: email.toLowerCase().trim() }
      : { username: username.toLowerCase().trim() };

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ message: "No student account found with these details." });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes valid
    await user.save();

    const targetEmail = user.email || email || `${user.username}@schoolportal.com`;

    await sendEmail({
      to: targetEmail,
      subject: "🔒 EduMind AI - Your Password Reset OTP",
      text: `Hello ${user.name},\n\nYour 6-digit OTP code to reset your EduMind AI portal password is: ${otp}\n\nThis OTP is valid for 10 minutes. Do not share it with anyone.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; rounded: 10px;">
          <h2 style="color: #2b6cb0; text-align: center;">📘 EduMind AI Portal</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>Your 6-digit OTP code for password reset is:</p>
          <div style="background: #edf2f7; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0; color: #2d3748;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #718096;">This code is valid for <strong>10 minutes</strong>. If you did not request a password reset, please ignore this email.</p>
        </div>
      `
    });

    res.json({
      message: `OTP sent successfully to ${targetEmail}`,
      username: user.username,
      demoOtp: process.env.EMAIL_USER ? undefined : otp // Expose OTP in response for easy local testing if email credentials not set
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ message: "Failed to send OTP email." });
  }
});

// Reset Password using OTP
router.post("/reset-password", async (req, res) => {
  try {
    const { username, otp, newPassword } = req.body;

    if (!username || !otp || !newPassword) {
      return res.status(400).json({ message: "Username, OTP, and New Password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: "User account not found." });
    }

    if (!user.otp || user.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP code. Please check and try again." });
    }

    if (user.otpExpiresAt && new Date() > user.otpExpiresAt) {
      return res.status(400).json({ message: "OTP has expired. Please request a new OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    res.json({ message: "Password updated successfully! You can now log in." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
});

// Current User Profile
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile" });
  }
});

module.exports = { router, authMiddleware };
