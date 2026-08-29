import React from "react";
import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="text-center max-w-800 mx-auto mb-5">
        <h1 className="display-5 fw-bold mb-3">📘 About EduMind AI</h1>
        <p className="lead text-muted">
          EduMind AI is an interactive, smart student learning portal designed to personalize education for students with AI assistance, curriculum quizzes, and progress analytics.
        </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
            <div className="fs-1 text-primary mb-3">🎯</div>
            <h4 className="fw-bold">Curriculum Aligned</h4>
            <p className="text-muted">Structured syllabus for Day Care Centre School, Guru Gobind Singh Public School, and State Boards.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
            <div className="fs-1 text-success mb-3">🤖</div>
            <h4 className="fw-bold">Powered by Gemini AI</h4>
            <p className="text-muted">Generate instant custom practice tests, question explanations, and study assistance dynamically.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 text-center">
            <div className="fs-1 text-warning mb-3">📊</div>
            <h4 className="fw-bold">Progress Tracking</h4>
            <p className="text-muted">Real-time performance analytics, subject completion metrics, and score history.</p>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4 p-5 bg-primary text-white text-center">
        <h2 className="fw-bold mb-3">Ready to boost your learning?</h2>
        <p className="lead mb-4">Join EduMind AI today and start practicing with smart interactive quizzes.</p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/register" className="btn btn-light btn-lg fw-bold px-4">
            🚀 Create Free Account
          </Link>
          <Link to="/login" className="btn btn-outline-light btn-lg px-4">
            Login
          </Link>
        </div>
      </div>
    </main>
  );
}
