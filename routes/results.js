const express = require("express");
const Result = require("../models/Result");
const { authMiddleware } = require("./auth");

const router = express.Router();

// Save quiz result
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { studentName, school, className, subject, chapter, marks, percentage, date } = req.body;

    if (!subject || !chapter || percentage === undefined) {
      return res.status(400).json({ message: "Missing required quiz result data." });
    }

    const newResult = new Result({
      userId: req.user.id,
      studentName: studentName || req.user.username,
      school: school || "School",
      className: className || "Class",
      subject,
      chapter,
      marks: String(marks),
      percentage: Number(percentage),
      date: date || new Date().toLocaleDateString()
    });

    await newResult.save();
    res.status(201).json({ message: "Result saved successfully to MongoDB", result: newResult });
  } catch (error) {
    console.error("Save result error:", error);
    res.status(500).json({ message: "Failed to save quiz result" });
  }
});

// Fetch all results for current student
router.get("/", authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch quiz results" });
  }
});

// Summary stats
router.get("/summary", authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ userId: req.user.id });
    const completedSubjects = new Set(results.map((r) => r.subject)).size;
    const bestScore = results.length ? Math.max(...results.map((r) => r.percentage)) : 0;
    const averageScore = results.length
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

    res.json({
      totalQuizzes: results.length,
      completedSubjects,
      bestScore: `${bestScore}%`,
      averageScore: `${averageScore}%`,
      results
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch progress summary" });
  }
});

module.exports = router;
