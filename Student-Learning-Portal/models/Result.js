const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    studentName: {
      type: String,
      required: true
    },
    school: {
      type: String,
      default: "School"
    },
    className: {
      type: String,
      default: "Class"
    },
    subject: {
      type: String,
      required: true
    },
    chapter: {
      type: String,
      required: true
    },
    marks: {
      type: String,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    date: {
      type: String,
      default: () => new Date().toLocaleDateString()
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Result", resultSchema);
