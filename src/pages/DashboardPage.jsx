import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { fetchUserResultsApi, getLocalResults } from "../services/api";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedSubjects: 0,
    bestScore: "0%",
    averageScore: "0%"
  });
  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    async function loadData() {
      const apiData = await fetchUserResultsApi();
      if (apiData) {
        setStats({
          totalQuizzes: apiData.totalQuizzes || 0,
          completedSubjects: apiData.completedSubjects || 0,
          bestScore: apiData.bestScore || "0%",
          averageScore: apiData.averageScore || "0%"
        });
        setRecentResults(apiData.results || []);
      } else {
        const local = getLocalResults();
        const best = local.length ? Math.max(...local.map((r) => r.percentage || 0)) : 0;
        const avg = local.length
          ? Math.round(local.reduce((sum, r) => sum + (r.percentage || 0), 0) / local.length)
          : 0;
        const subCount = new Set(local.map((r) => r.subject)).size;

        setStats({
          totalQuizzes: local.length,
          completedSubjects: subCount,
          bestScore: `${best}%`,
          averageScore: `${avg}%`
        });
        setRecentResults(local);
      }
    }
    loadData();
  }, []);

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      {/* Welcome Banner */}
      <div className="card border-0 rounded-4 shadow-sm bg-primary text-white p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h2 className="fw-bold mb-1">
              Welcome Back, {currentUser?.name || currentUser?.username || "Student"}! 👋
            </h2>
            <p className="mb-0 opacity-90">
              School: <strong>{currentUser?.schoolName || "Day Care Centre School"}</strong> | Class: <strong>{currentUser?.className || "Class 5"}</strong>
            </p>
          </div>
          <Link to="/subjects" className="btn btn-light btn-lg fw-semibold shadow-sm">
            📚 Start Learning
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
            <div className="fs-1 text-primary mb-2">📝</div>
            <h3 className="fw-bold mb-0">{stats.totalQuizzes}</h3>
            <p className="text-muted small mb-0">Quizzes Completed</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
            <div className="fs-1 text-success mb-2">🏆</div>
            <h3 className="fw-bold mb-0">{stats.bestScore}</h3>
            <p className="text-muted small mb-0">Best Score</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
            <div className="fs-1 text-info mb-2">📊</div>
            <h3 className="fw-bold mb-0">{stats.averageScore}</h3>
            <p className="text-muted small mb-0">Average Score</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-3 text-center h-100">
            <div className="fs-1 text-warning mb-2">📘</div>
            <h3 className="fw-bold mb-0">{stats.completedSubjects}</h3>
            <p className="text-muted small mb-0">Subjects Covered</p>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <h3 className="fw-bold mb-3">🚀 Quick Actions</h3>
      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 hover-card text-center">
            <div className="fs-1 mb-3">📚</div>
            <h4 className="fw-bold">Browse Subjects</h4>
            <p className="text-muted">Explore all syllabus chapters, theory notes, and MCQs.</p>
            <Link to="/subjects" className="btn btn-outline-primary mt-auto">View Subjects</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 hover-card text-center">
            <div className="fs-1 mb-3">🤖</div>
            <h4 className="fw-bold">AI Quiz Generator</h4>
            <p className="text-muted">Generate instant custom quizzes with Gemini AI for any topic.</p>
            <Link to="/question-generator" className="btn btn-outline-primary mt-auto">Generate Quiz</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 hover-card text-center">
            <div className="fs-1 mb-3">📈</div>
            <h4 className="fw-bold">View Analytics</h4>
            <p className="text-muted">Check detailed progress reports, subject breakdown, and history.</p>
            <Link to="/progress" className="btn btn-outline-primary mt-auto">Progress Report</Link>
          </div>
        </div>
      </div>

      {/* Recent Quiz History */}
      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h4 className="fw-bold mb-3">⏱ Recent Quiz Results</h4>
        {recentResults.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <p className="mb-2">No quiz attempts recorded yet.</p>
            <Link to="/subjects" className="btn btn-sm btn-primary">Take First Quiz</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Subject</th>
                  <th>Chapter</th>
                  <th>Marks</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentResults.slice(0, 5).map((item, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold text-primary">{item.subject}</td>
                    <td>{item.chapter}</td>
                    <td>{item.marks}</td>
                    <td>
                      <span className={`badge bg-${item.percentage >= 70 ? "success" : item.percentage >= 50 ? "warning" : "danger"}`}>
                        {item.percentage}%
                      </span>
                    </td>
                    <td className="text-muted small">{item.date || "Recent"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
