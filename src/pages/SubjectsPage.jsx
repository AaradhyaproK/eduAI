import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchSubjectsApi } from "../services/api";
import daycareData from "../../data/daycarecentre.json";
import ggspsData from "../../data/ggsps.json";

export default function SubjectsPage() {
  const [selectedSchool, setSelectedSchool] = useState("Day Care Centre School");
  const [subjectsMap, setSubjectsMap] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadSubjects() {
      setLoading(true);
      const apiSubjects = await fetchSubjectsApi(selectedSchool);
      if (apiSubjects && Object.keys(apiSubjects).length > 0) {
        setSubjectsMap(apiSubjects);
      } else {
        // Fallback local JSON data
        const localData = selectedSchool.includes("Guru Gobind") ? ggspsData : daycareData;
        setSubjectsMap(localData.subjects || {});
      }
      setLoading(false);
    }
    loadSubjects();
  }, [selectedSchool]);

  const handleStartQuiz = (subject) => {
    navigate(`/quiz?subject=${encodeURIComponent(subject)}&school=${encodeURIComponent(selectedSchool)}`);
  };

  const handleOpenLesson = (subject, chapterTitle) => {
    navigate(`/lesson?subject=${encodeURIComponent(subject)}&chapter=${encodeURIComponent(chapterTitle)}&school=${encodeURIComponent(selectedSchool)}`);
  };

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="text-center mb-4">
        <h1 className="display-6 fw-bold mb-2">📚 Select Your School & Subject</h1>
        <p className="text-muted">Choose your school board to view curriculum chapters, study theory, or take MCQs.</p>

        <div className="d-flex justify-content-center gap-3 mt-3 flex-wrap">
          <button
            className={`btn px-4 py-2 fw-semibold ${selectedSchool === "Day Care Centre School" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedSchool("Day Care Centre School")}
          >
            🏫 Day Care Centre School
          </button>
          <button
            className={`btn px-4 py-2 fw-semibold ${selectedSchool === "Guru Gobind Singh Public School" ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setSelectedSchool("Guru Gobind Singh Public School")}
          >
            🏫 Guru Gobind Singh Public School
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading subjects...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {Object.entries(subjectsMap).map(([subjectName, chapters]) => (
            <div className="col-lg-6" key={subjectName}>
              <div className="card shadow-sm border-0 rounded-4 h-100 p-3">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h4 fw-bold text-primary mb-0">📖 {subjectName}</h3>
                    <button
                      className="btn btn-sm btn-success fw-semibold"
                      onClick={() => handleStartQuiz(subjectName)}
                    >
                      ⚡ Start Subject Quiz
                    </button>
                  </div>
                  <p className="text-muted small mb-3">Total Chapters: {chapters.length}</p>

                  <div className="list-group list-group-flush mb-3 flex-grow-1">
                    {chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        className="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0 py-2 border-bottom"
                      >
                        <div>
                          <span className="fw-semibold">{idx + 1}. {ch.chapter}</span>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleOpenLesson(subjectName, ch.chapter)}
                        >
                          📖 Read Lesson
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
