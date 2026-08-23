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

const API_BASE_URL = window.location.origin.includes("localhost") || window.location.origin.includes("127.0.0.1")
  ? ""
  : "";

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
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    if (data.token) setAuthToken(data.token);
    if (data.user) setCurrentStudent(data.user);
    return data;
  } catch (err) {
    console.warn("MongoDB Register API fallback:", err.message);
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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    if (data.token) setAuthToken(data.token);
    if (data.user) setCurrentStudent(data.user);
    return data;
  } catch (err) {
    console.warn("MongoDB Login API fallback:", err.message);
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
    const res = await fetch("/api/results", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(resultData)
    });
    if (res.ok) {
      const data = await res.json();
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
    const url = school ? `/api/subjects?school=${encodeURIComponent(school)}` : "/api/subjects";
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed fetching subjects");
    const data = await res.json();
    return data.subjects || {};
  } catch (err) {
    console.warn("Could not fetch subjects from MongoDB API, falling back to static files:", err);
    return null;
  }
}

async function fetchUserResultsFromMongo() {
  try {
    const token = getAuthToken();
    const res = await fetch("/api/results/summary", {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed fetching results");
    return await res.json();
  } catch (err) {
    console.warn("Could not fetch user results from MongoDB API:", err);
    return null;
  }
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
