import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLocalResults, fetchUserResultsApi } from "../services/api";

export default function ResultPage() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function loadResults() {
      const apiData = await fetchUserResultsApi();
      if (apiData && apiData.results) {
        setResults(apiData.results);
      } else {
        setResults(getLocalResults());
      }
    }
    loadResults();
  }, []);

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <h1 className="fw-bold mb-1">📊 Quiz Score History</h1>
          <p className="text-muted mb-0">Detailed breakdown of all completed quizzes.</p>
        </div>
        <Link to="/subjects" className="btn btn-primary fw-semibold">
          ⚡ Take New Quiz
        </Link>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-4">
        {results.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h4>No score records found</h4>
            <p>Take a subject quiz or generate a quiz with AI to see your performance here.</p>
            <Link to="/subjects" className="btn btn-primary">Start Quiz</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Subject</th>
                  <th>Chapter</th>
                  <th>School</th>
                  <th>Marks</th>
                  <th>Percentage</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td className="fw-bold text-primary">{r.subject}</td>
                    <td>{r.chapter}</td>
                    <td>{r.school || "School"}</td>
                    <td>{r.marks}</td>
                    <td>
                      <span className={`badge bg-${r.percentage >= 70 ? "success" : r.percentage >= 50 ? "warning" : "danger"}`}>
                        {r.percentage}%
                      </span>
                    </td>
                    <td className="text-muted small">{r.date || "Recent"}</td>
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
