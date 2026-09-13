import React from "react";
import { useLocation } from "react-router-dom";

export default function Footer() {
  const location = useLocation();

  if (location.pathname.startsWith("/erp")) {
    return null;
  }

  return (
    <footer className="footer py-4 mt-5">
      <div className="container text-center">
        <h5 className="fw-bold">EduMind AI</h5>
        <p className="mb-1">© 2026 EduMind AI. Learn Smarter with AI.</p>
        <p className="mb-0 text-muted small">
          Contact: support@smartportal.com | Instagram • Facebook • YouTube
        </p>
      </div>
    </footer>
  );
}
