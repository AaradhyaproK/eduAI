const dns = require("dns");
if (!process.env.VERCEL) {
  try {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  } catch (e) {}
}

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const { router: authRouter } = require("./routes/auth");
const resultsRouter = require("./routes/results");
const subjectsRouter = require("./routes/subjects");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edumind";

// Serverless MongoDB connection helper
let isConnected = false;
async function connectDB() {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }
  try {
    const db = await mongoose.connect(MONGODB_URI, {
      family: 4,
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Successfully connected to MongoDB Database!");
  } catch (err) {
    console.warn("⚠️ MongoDB Atlas connection notice:", err.message);
  }
}

// Connect to DB immediately on load
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connection for API calls
app.use(async (req, res, next) => {
  if (req.path.startsWith("/api")) {
    await connectDB();
  }
  next();
});

// Config endpoint for client-side API keys
app.get("/api/config", (req, res) => {
  res.json({
    geminiApiKey: process.env.GEMINI_API_KEY || ""
  });
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    mongoState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date()
  });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/results", resultsRouter);
app.use("/api/subjects", subjectsRouter);

// Serve static frontend files with automatic .html extension resolution
app.use(express.static(path.join(__dirname), { extensions: ["html", "htm"] }));

// Wildcard fallback for clean routes or unhandled paths
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ message: "API endpoint not found." });
  }

  // Favicon handler
  if (req.path === "/favicon.ico") {
    const faviconPath = path.join(__dirname, "favicon.ico");
    if (fs.existsSync(faviconPath)) {
      return res.sendFile(faviconPath);
    }
    return res.status(204).end();
  }

  // Never return index.html for non-HTML static assets (.js, .css, .json, .png, etc.)
  const ext = path.extname(req.path);
  if (ext && ext !== ".html" && ext !== ".htm") {
    return res.status(404).send("Asset not found");
  }

  const requestedFile = req.path === "/" ? "index.html" : (req.path.endsWith(".html") ? req.path : `${req.path}.html`);
  const filePath = path.join(__dirname, requestedFile);
  if (fs.existsSync(filePath)) {
    return res.sendFile(filePath);
  }
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start Express server only if executed directly (e.g. node server.js)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 EduMind AI Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
