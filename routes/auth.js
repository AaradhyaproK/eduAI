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

// Step 1: Send Registration Email OTP (NO account saved in MongoDB yet)
router.post("/register-send-otp", async (req, res) => {
  try {
    const { name, username, email, password, schoolName, className } = req.body;
    const sendEmail = require("../utils/sendEmail");

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Name, Username, Email, and Password are required." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Check if username or email already exists in MongoDB
    const existingUsername = await User.findOne({ username: username.toLowerCase().trim() });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already registered. Please choose another username or log in." });
    }

    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({ message: "An account with this email already exists. Please log in." });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a temporary JWT registration token holding pending registration payload + OTP
    const regToken = jwt.sign(
      {
        pendingUser: {
          name: name.trim(),
          username: username.toLowerCase().trim(),
          email: email.toLowerCase().trim(),
          password,
          schoolName: schoolName || "Day Care Centre School",
          className: className || "Class 5"
        },
        otp
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Send OTP email via Nodemailer
    await sendEmail({
      to: email.trim(),
      subject: "🎉 EduMind AI - Verify Email to Complete Registration",
      text: `Hello ${name},\n\nYour 6-digit OTP code to verify your email and create your EduMind AI account is: ${otp}\n\nThis OTP is valid for 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h2 style="color: #2b6cb0; text-align: center;">📘 Welcome to EduMind AI!</h2>
          <p>Hello <strong>${name}</strong>,</p>
          <p>Your 6-digit OTP code to verify your email and complete account setup is:</p>
          <div style="background: #edf2f7; font-size: 28px; font-weight: bold; letter-spacing: 5px; text-align: center; padding: 15px; border-radius: 8px; margin: 20px 0; color: #2d3748;">
            ${otp}
          </div>
          <p style="font-size: 13px; color: #718096;">Please enter this code on the registration page to create your account. Valid for 15 minutes.</p>
        </div>
      `
    });

    res.json({
      message: `OTP sent to ${email}`,
      regToken,
      email: email.trim(),
      demoOtp: process.env.EMAIL_USER ? undefined : otp
    });
  } catch (error) {
    console.error("Register send OTP error:", error);
    res.status(500).json({ message: "Failed to send registration OTP email." });
  }
});

// Step 2: Verify OTP and ONLY THEN save User Account to MongoDB Atlas
router.post("/register-verify-otp", async (req, res) => {
  try {
    const { regToken, otp } = req.body;

    if (!regToken || !otp) {
      return res.status(400).json({ message: "Registration session and 6-digit OTP code are required." });
    }

    let decoded;
    try {
      decoded = jwt.verify(regToken, JWT_SECRET);
    } catch (e) {
      return res.status(400).json({ message: "Registration session expired. Please submit registration form again." });
    }

    if (!decoded.otp || decoded.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid OTP code. Please check your email and try again." });
    }

    const { pendingUser } = decoded;

    // Double check duplicate in MongoDB
    const existing = await User.findOne({
      $or: [{ username: pendingUser.username }, { email: pendingUser.email }]
    });
    if (existing) {
      return res.status(400).json({ message: "Account already exists in MongoDB." });
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(pendingUser.password, salt);

    // SAVE USER ACCOUNT TO MONGODB NOW THAT OTP IS VERIFIED
    const user = new User({
      name: pendingUser.name,
      username: pendingUser.username,
      email: pendingUser.email,
      password: hashedPassword,
      schoolName: pendingUser.schoolName,
      className: pendingUser.className,
      isVerified: true
    });

    await user.save();

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "🎉 Email verified & account successfully saved to MongoDB!",
      token,
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
    console.error("Register verify OTP error:", error);
    res.status(500).json({ message: "Failed to verify OTP and save account." });
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
