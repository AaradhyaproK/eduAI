const express = require("express");
const path = require("path");
const fs = require("fs");
const Chapter = require("../models/Chapter");

const router = express.Router();

// Auto-seed initial subjects/chapters into MongoDB Atlas if empty
async function seedInitialChaptersIfNeeded() {
  try {
    const count = await Chapter.countDocuments();
    if (count > 0) return;

    console.log("🌱 Seeding initial subjects and chapters into MongoDB Atlas...");
    const daycarePath = path.join(__dirname, "../data/daycarecentre.json");
    const ggspsPath = path.join(__dirname, "../data/ggsps.json");

    const chaptersToInsert = [];

    if (fs.existsSync(daycarePath)) {
      const daycareData = JSON.parse(fs.readFileSync(daycarePath, "utf8"));
      const school = daycareData.school || "Day Care Centre School";
      for (const [subject, list] of Object.entries(daycareData.subjects || {})) {
        list.forEach((item) => {
          chaptersToInsert.push({ ...item, school, subject });
        });
      }
    }

    if (fs.existsSync(ggspsPath)) {
      const ggspsData = JSON.parse(fs.readFileSync(ggspsPath, "utf8"));
      const school = ggspsData.school || "Guru Gobind Singh Public School";
      for (const [subject, list] of Object.entries(ggspsData.subjects || {})) {
        list.forEach((item) => {
          chaptersToInsert.push({ ...item, school, subject });
        });
      }
    }

    if (chaptersToInsert.length > 0) {
      await Chapter.insertMany(chaptersToInsert);
      console.log(`✅ Successfully seeded ${chaptersToInsert.length} chapters into MongoDB Atlas!`);
    }
  } catch (err) {
    console.error("Error seeding chapters:", err);
  }
}

// Get all subjects and chapters (filtered by school if specified)
router.get("/", async (req, res) => {
  try {
    await seedInitialChaptersIfNeeded();

    const { school, subject } = req.query;
    const filter = {};
    if (school) filter.school = school;
    if (subject) filter.subject = subject;

    const chapters = await Chapter.find(filter);

    // Group by subject
    const subjectsMap = {};
    chapters.forEach((item) => {
      if (!subjectsMap[item.subject]) {
        subjectsMap[item.subject] = [];
      }
      subjectsMap[item.subject].push(item);
    });

    res.json({
      school: school || "All Schools",
      subjects: subjectsMap,
      rawChapters: chapters
    });
  } catch (error) {
    console.error("Fetch subjects error:", error);
    res.status(500).json({ message: "Failed to fetch subjects from MongoDB Atlas" });
  }
});

// Add new chapter dynamically to MongoDB
router.post("/chapter", async (req, res) => {
  try {
    const { school, subject, chapter, theory, image, examples, notes, mcqs } = req.body;

    if (!subject || !chapter) {
      return res.status(400).json({ message: "Subject and Chapter title are required." });
    }

    const newChapter = new Chapter({
      school: school || "Day Care Centre School",
      subject,
      chapter,
      theory: theory || "",
      image: image || "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
      examples: Array.isArray(examples) ? examples : [],
      notes: notes || "",
      mcqs: Array.isArray(mcqs) ? mcqs : []
    });

    await newChapter.save();
    res.status(201).json({ message: "Chapter added dynamically to MongoDB!", chapter: newChapter });
  } catch (error) {
    console.error("Add chapter error:", error);
    res.status(500).json({ message: "Failed to create new chapter" });
  }
});

module.exports = router;
