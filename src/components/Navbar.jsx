import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg fixed-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to={currentUser ? "/dashboard" : "/login"}>
          📘 EduMind AI
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/dashboard") ? "active" : ""}`} to="/dashboard">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/subjects") ? "active" : ""}`} to="/subjects">
                    Subjects
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/progress") ? "active" : ""}`} to="/progress">
                    Progress
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/question-generator") ? "active" : ""}`} to="/question-generator">
                    🤖 AI Quiz Gen
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/profile") ? "active" : ""}`} to="/profile">
                    👤 Profile ({currentUser.name || currentUser.username})
                  </Link>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-danger fw-semibold cursor-pointer" href="#logout" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/login") || isActive("/") ? "active" : ""}`} to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/register") ? "active" : ""}`} to="/register">
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/about") ? "active" : ""}`} to="/about">
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive("/contact") ? "active" : ""}`} to="/contact">
                    Contact
                  </Link>
                </li>
              </>
            )}
            <li className="nav-item">
              <button
                id="themeToggle"
                className="btn btn-sm btn-outline-dark ms-lg-3"
                onClick={toggleTheme}
              >
                {isDarkMode ? "☀️ Light" : "🌙 Dark"}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
