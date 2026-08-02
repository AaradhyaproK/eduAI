// Shared site behavior for navigation, theme toggle, loader, and logout.

const storageKey = "studentLearningPortal";

function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("d-none");
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("d-none");
}

function getStoredStudent() {
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : null;
}

function setStoredStudent(student) {
  localStorage.setItem(storageKey, JSON.stringify(student));
}

function clearStoredStudent() {
  localStorage.removeItem(storageKey);
}

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");
  const button = document.getElementById("themeToggle");
  if (button) {
    button.textContent = theme === "dark" ? "☀️ Light" : "🌙 Dark";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("portalTheme") || "light";
  applyTheme(savedTheme);
}

function initLogout() {
  const logoutLink = document.getElementById("logoutLink");
  if (logoutLink) {
    logoutLink.addEventListener("click", (event) => {
      event.preventDefault();
      clearStoredStudent();
      window.location.href = "index.html";
    });
  }
}

function highlightActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link").forEach((link) => {
    const page = link.getAttribute("data-page") || "";
    link.classList.toggle("active", page === currentPage);
  });
}

function initCommonUI() {
  initTheme();
  initLogout();
  highlightActiveNav();

  const themeButton = document.getElementById("themeToggle");
  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
      localStorage.setItem("portalTheme", nextTheme);
      applyTheme(nextTheme);
    });
  }

  setTimeout(hideLoader, 600);
}

document.addEventListener("DOMContentLoaded", initCommonUI);
