const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    schoolName: {
      type: String,
      default: "Day Care Centre School"
    },
    className: {
      type: String,
      default: "Class 5"
    },
    otp: {
      type: String,
      default: null
    },
    otpExpiresAt: {
      type: Date,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
