const dns = require("dns");
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {}

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const { router: authRouter } = require("./routes/auth");
const resultsRouter = require("./routes/results");
const subjectsRouter = require("./routes/subjects");

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/edumind";

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname)));

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/results", resultsRouter);
app.use("/api/subjects", subjectsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    mongoState: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date()
  });
});

// Start Express server
const server = app.listen(PORT, () => {
  console.log(`🚀 EduMind AI Server running at http://localhost:${PORT}`);
});

// Connect to MongoDB Atlas
mongoose
  .connect(MONGODB_URI, {
    family: 4,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Database!");
  })
  .catch((err) => {
    console.warn("⚠️ MongoDB Atlas connection notice:", err.message);
  });
