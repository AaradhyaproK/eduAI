const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      required: true,
      default: "Day Care Centre School"
    },
    subject: {
      type: String,
      required: true
    },
    chapter: {
      type: String,
      required: true
    },
    theory: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80"
    },
    examples: {
      type: [String],
      default: []
    },
    notes: {
      type: String,
      default: ""
    },
    mcqs: [
      {
        question: String,
        options: [String],
        answer: String
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Chapter", chapterSchema);
