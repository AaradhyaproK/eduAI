// Central storage helpers for students, passwords, results, and school content.

const STUDENT_STORAGE_KEY = "smartStudentPortalStudents";
const CURRENT_STUDENT_KEY = "smartStudentPortalCurrentStudent";
const RESULTS_KEY = "smartStudentPortalResults";
const THEME_KEY = "smartStudentPortalTheme";

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
}

function getResults() {
  const stored = localStorage.getItem(RESULTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveResults(results) {
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

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
