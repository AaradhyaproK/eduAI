// Central storage helpers for students, passwords, results, theme, and MongoDB API integration.

function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("d-none");
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("d-none");
}

const STUDENT_STORAGE_KEY = "smartStudentPortalStudents";
const CURRENT_STUDENT_KEY = "smartStudentPortalCurrentStudent";
const RESULTS_KEY = "smartStudentPortalResults";
const THEME_KEY = "smartStudentPortalTheme";
const AUTH_TOKEN_KEY = "edumindAuthToken";

// Dynamic API Base URL resolver (Routes requests to Express server on port 3000 if opened via Live Server, file://, or secondary ports)
const API_BASE_URL = (typeof window !== "undefined" && (
  window.location.protocol === "file:" || 
  (window.location.port && window.location.port !== "3000")
))
  ? "http://localhost:3000"
  : "";

// Helper to safely parse API responses
async function parseJsonResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(`Server returned non-JSON response. Please ensure Express server is running on port 3000.`);
  }
  return await res.json();
}

// Token Management
function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || "";
}

function setAuthToken(token) {
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

// Student profile management
function getStudents() {
  const stored = localStorage.getItem(STUDENT_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveStudents(students) {
  localStorage.setItem(STUDENT_STORAGE_KEY, JSON.stringify(students));
}

function getCurrentStudent() {
  const current = localStorage.getItem(CURRENT_STUDENT_KEY);
  return current ? JSON.parse(current) : null;
}

function setCurrentStudent(student) {
  localStorage.setItem(CURRENT_STUDENT_KEY, JSON.stringify(student));
}

function clearCurrentStudent() {
  localStorage.removeItem(CURRENT_STUDENT_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

function getResults() {
  const stored = localStorage.getItem(RESULTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveResults(results) {
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

// MongoDB API Functions
async function registerUserWithMongo(userData) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data.message || "Registration failed");
    if (data.token) setAuthToken(data.token);
    if (data.user) setCurrentStudent(data.user);
    return data;
  } catch (err) {
    console.warn("MongoDB Register API notice:", err.message);
    if (err.message.includes("Server returned non-JSON")) throw err;
    // Local fallback
    const students = getStudents();
    const existing = students.find(s => s.username?.toLowerCase() === userData.username?.toLowerCase());
    if (existing) throw new Error("Username already exists.");
    const newStudent = { ...userData, password: userData.password };
    students.push(newStudent);
    saveStudents(students);
    setCurrentStudent(newStudent);
    return { user: newStudent };
  }
}

async function loginUserWithMongo({ username, password }) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await parseJsonResponse(res);
    if (!res.ok) throw new Error(data.message || "Login failed");
    if (data.token) setAuthToken(data.token);
    if (data.user) setCurrentStudent(data.user);
    return data;
  } catch (err) {
    console.warn("MongoDB Login API notice:", err.message);
    if (err.message.includes("Server returned non-JSON")) throw err;
    // Local fallback
    const students = getStudents();
    const student = students.find(s => s.name === username || s.username === username);
    if (!student || student.password !== password) {
      throw new Error("Invalid username or password.");
    }
    setCurrentStudent(student);
    return { user: student };
  }
}

async function saveQuizResultToMongo(resultData) {
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(resultData)
    });
    if (res.ok) {
      const data = await parseJsonResponse(res);
      console.log("Quiz result saved to MongoDB Atlas!");
    }
  } catch (err) {
    console.warn("Could not save to MongoDB server, saving locally:", err);
  }
  // Also save to localStorage
  const results = getResults();
  results.push(resultData);
  saveResults(results);
}

async function fetchSubjectsFromMongo(school) {
  try {
    const url = school ? `${API_BASE_URL}/api/subjects?school=${encodeURIComponent(school)}` : `${API_BASE_URL}/api/subjects`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed fetching subjects");
    const data = await parseJsonResponse(res);
    return data.subjects || {};
  } catch (err) {
    console.warn("Could not fetch subjects from MongoDB API, falling back to static files:", err);
    return null;
  }
}

async function fetchUserResultsFromMongo() {
  try {
    const token = getAuthToken();
    const res = await fetch(`${API_BASE_URL}/api/results/summary`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed fetching results");
    return await parseJsonResponse(res);
  } catch (err) {
    console.warn("Could not fetch user results from MongoDB API:", err);
    return null;
  }
}

async function sendOtpWithMongo({ username, email }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email })
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) throw new Error(data.message || "Failed to send OTP");
  return data;
}

async function resetPasswordWithMongo({ username, otp, newPassword }) {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, otp, newPassword })
  });
  const data = await parseJsonResponse(res);
  if (!res.ok) throw new Error(data.message || "Failed to reset password");
  return data;
}

// UI Theme & Logout Handlers
function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  const button = document.getElementById("themeToggle");
  if (button) {
    button.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || "light";
  applyTheme(savedTheme);
  const button = document.getElementById("themeToggle");
  if (button) {
    button.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      localStorage.setItem(THEME_KEY, nextTheme);
      applyTheme(nextTheme);
    });
  }
}

function initLogout() {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      clearCurrentStudent();
      window.location.href = "index.html";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initLogout();
});
