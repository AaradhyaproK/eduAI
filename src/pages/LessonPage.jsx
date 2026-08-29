import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import daycareData from "../../data/daycarecentre.json";
import ggspsData from "../../data/ggsps.json";

export default function LessonPage() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get("subject") || "General";
  const chapterName = searchParams.get("chapter") || "";
  const school = searchParams.get("school") || "Day Care Centre School";

  const [chapterData, setChapterData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const dataSource = school.includes("Guru Gobind") ? ggspsData : daycareData;
    const chaptersList = dataSource.subjects?.[subject] || [];
    const found = chaptersList.find((ch) => ch.chapter === chapterName) || chaptersList[0];
    setChapterData(found || null);
  }, [subject, chapterName, school]);

  const handleTakeQuiz = () => {
    navigate(`/quiz?subject=${encodeURIComponent(subject)}&school=${encodeURIComponent(school)}`);
  };

  if (!chapterData) {
    return (
      <main className="container py-5 text-center" style={{ marginTop: "70px" }}>
        <h2>Lesson Not Found</h2>
        <Link to="/subjects" className="btn btn-primary mt-3">Back to Subjects</Link>
      </main>
    );
  }

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="badge bg-primary fs-6 mb-2">{subject}</span>
          <h1 className="fw-bold">{chapterData.chapter}</h1>
        </div>
        <div className="d-flex gap-2">
          <Link to="/subjects" className="btn btn-outline-secondary">← Back to Subjects</Link>
          <button className="btn btn-success fw-semibold" onClick={handleTakeQuiz}>
            ⚡ Take Quiz on {subject}
          </button>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <h3 className="fw-bold text-primary mb-3">📖 Chapter Theory & Explanations</h3>
            <p className="lead" style={{ lineHeight: "1.8" }}>{chapterData.theory}</p>
          </div>

          {chapterData.notes && (
            <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-light">
              <h4 className="fw-bold mb-2">📌 Key Notes</h4>
              <p className="mb-0">{chapterData.notes}</p>
            </div>
          )}

          {chapterData.examples && chapterData.examples.length > 0 && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h4 className="fw-bold mb-3">💡 Practical Examples</h4>
              <ul className="list-group list-group-flush">
                {chapterData.examples.map((ex, idx) => (
                  <li className="list-group-item bg-transparent" key={idx}>
                    <strong>Example {idx + 1}:</strong> {ex}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="col-lg-4">
          {chapterData.image && (
            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <img src={chapterData.image} alt={chapterData.chapter} className="img-fluid" style={{ maxHeight: "250px", objectFit: "cover" }} />
            </div>
          )}

          <div className="card border-0 shadow-sm rounded-4 p-4 bg-primary text-white text-center">
            <h4 className="fw-bold mb-2">Ready to test yourself?</h4>
            <p className="small mb-3">Attempt standard practice questions or generate custom AI questions.</p>
            <button className="btn btn-light fw-bold w-100 mb-2" onClick={handleTakeQuiz}>
              🎯 Start MCQ Quiz
            </button>
            <Link to="/question-generator" className="btn btn-outline-light w-100">
              🤖 AI Question Generator
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
