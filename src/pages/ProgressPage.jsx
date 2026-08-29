import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchUserResultsApi, getLocalResults } from "../services/api";

export default function ProgressPage() {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    completedSubjects: 0,
    bestScore: "0%",
    averageScore: "0%",
    results: []
  });

  useEffect(() => {
    async function loadStats() {
      const apiData = await fetchUserResultsApi();
      if (apiData) {
        setStats({
          totalQuizzes: apiData.totalQuizzes || 0,
          completedSubjects: apiData.completedSubjects || 0,
          bestScore: apiData.bestScore || "0%",
          averageScore: apiData.averageScore || "0%",
          results: apiData.results || []
        });
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
          averageScore: `${avg}%`,
          results: local
        });
      }
    }
    loadStats();
  }, []);

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="fw-bold mb-1">📈 Student Progress Analytics</h1>
          <p className="text-muted mb-0">Track your subject mastery and learning performance overtime.</p>
        </div>
        <Link to="/subjects" className="btn btn-primary fw-semibold">
          📚 Continue Learning
        </Link>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
            <div className="fs-1 text-primary mb-2">📑</div>
            <h2 className="fw-bold mb-0">{stats.totalQuizzes}</h2>
            <p className="text-muted small mb-0">Total Quizzes Attempted</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
            <div className="fs-1 text-success mb-2">⭐</div>
            <h2 className="fw-bold mb-0">{stats.bestScore}</h2>
            <p className="text-muted small mb-0">Highest Score</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
            <div className="fs-1 text-info mb-2">📊</div>
            <h2 className="fw-bold mb-0">{stats.averageScore}</h2>
            <p className="text-muted small mb-0">Overall Average</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 text-center h-100">
            <div className="fs-1 text-warning mb-2">🎯</div>
            <h2 className="fw-bold mb-0">{stats.completedSubjects}</h2>
            <p className="text-muted small mb-0">Active Subjects</p>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        <h4 className="fw-bold mb-3">📋 Subject Performance Breakdown</h4>
        {stats.results.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <p>No progress records available. Take your first quiz to generate progress metrics.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Subject</th>
                  <th>Recent Marks</th>
                  <th>Percentage</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.results.map((r, idx) => (
                  <tr key={idx}>
                    <td className="fw-bold">{r.subject}</td>
                    <td>{r.marks}</td>
                    <td>{r.percentage}%</td>
                    <td>
                      <span className={`badge bg-${r.percentage >= 70 ? "success" : r.percentage >= 50 ? "warning" : "danger"}`}>
                        {r.percentage >= 70 ? "Mastered" : r.percentage >= 50 ? "Satisfactory" : "Needs Review"}
                      </span>
                    </td>
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
