require("dotenv").config();
const dns = require("dns");

// Configure public DNS resolution for reliable MongoDB Atlas SRV connection on macOS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Fallback to system default DNS
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const { router: authRouter } = require("./routes/auth");
const resultsRouter = require("./routes/results");

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
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB Database!");
  })
  .catch((err) => {
    console.warn("⚠️ MongoDB Atlas connection pending URI password setup:", err.message);
  });
