import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { saveQuizResultApi } from "../services/api";
import daycareData from "../../data/daycarecentre.json";
import ggspsData from "../../data/ggsps.json";

export default function QuizPage() {
  const [searchParams] = useSearchParams();
  const subject = searchParams.get("subject") || "General Science";
  const school = searchParams.get("school") || "Day Care Centre School";

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(300); // 5 minute timer
  const [quizFinished, setQuizFinished] = useState(false);
  const [scoreData, setScoreData] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const dataSource = school.includes("Guru Gobind") ? ggspsData : daycareData;
    const subjectChapters = dataSource.subjects?.[subject] || [];
    let allMcqs = [];
    subjectChapters.forEach((ch) => {
      if (ch.mcqs && Array.isArray(ch.mcqs)) {
        ch.mcqs.forEach((m) => {
          allMcqs.push({ ...m, chapter: ch.chapter });
        });
      }
    });

    if (allMcqs.length === 0) {
      allMcqs = [
        {
          question: `What is the primary topic studied in ${subject}?`,
          options: [`Fundamental principles of ${subject}`, "Practical Applications", "Historical context", "None of the above"],
          answer: `Fundamental principles of ${subject}`,
          chapter: "General Overview"
        },
        {
          question: `Why is ${subject} important in student learning?`,
          options: ["Develops critical thinking", "Improves problem solving", "Enhances knowledge", "All of the above"],
          answer: "All of the above",
          chapter: "General Overview"
        }
      ];
    }
    setQuestions(allMcqs);
  }, [subject, school]);

  useEffect(() => {
    if (quizFinished || questions.length === 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizFinished, questions]);

  const handleOptionSelect = (option) => {
    setUserAnswers({ ...userAnswers, [currentIdx]: option });
  };

  const handleSubmitQuiz = async () => {
    if (quizFinished) return;
    setQuizFinished(true);

    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correctCount++;
      }
    });

    const total = questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const marks = `${correctCount}/${total}`;
    const chapterName = questions[0]?.chapter || "General Chapter";

    const resultPayload = {
      subject,
      chapter: chapterName,
      school,
      className: "Class 5",
      marks,
      percentage,
      date: new Date().toLocaleDateString()
    };

    await saveQuizResultApi(resultPayload);
    setScoreData({ correctCount, total, percentage, marks });
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (questions.length === 0) {
    return (
      <main className="container py-5 text-center" style={{ marginTop: "70px" }}>
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading quiz questions...</p>
      </main>
    );
  }

  if (quizFinished && scoreData) {
    return (
      <main className="container py-5 text-center" style={{ marginTop: "70px" }}>
        <div className="card shadow-lg border-0 rounded-4 p-5 max-w-600 mx-auto">
          <div className="fs-1 mb-2">🎉</div>
          <h2 className="fw-bold mb-1">Quiz Completed!</h2>
          <p className="text-muted">Subject: <strong>{subject}</strong></p>

          <div className="my-4">
            <span className={`badge fs-2 p-3 bg-${scoreData.percentage >= 70 ? "success" : scoreData.percentage >= 50 ? "warning" : "danger"}`}>
              {scoreData.percentage}% Score
            </span>
            <h4 className="mt-3 fw-bold">Marks: {scoreData.marks}</h4>
          </div>

          <div className="d-flex justify-content-center gap-3">
            <button className="btn btn-primary px-4" onClick={() => window.location.reload()}>
              🔄 Retake Quiz
            </button>
            <button className="btn btn-outline-secondary px-4" onClick={() => navigate("/dashboard")}>
              🏠 Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  const currentQ = questions[currentIdx];

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <span className="badge bg-primary fs-6 mb-1">{subject}</span>
          <h2 className="fw-bold mb-0">Interactive MCQ Quiz</h2>
        </div>
        <div className="bg-warning text-dark fw-bold px-3 py-2 rounded-3 shadow-sm">
          ⏱ Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      <div className="card border-0 shadow-lg rounded-4 p-4">
        <div className="d-flex justify-content-between text-muted small mb-3">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>Chapter: {currentQ.chapter}</span>
        </div>

        <h3 className="fw-bold mb-4">{currentIdx + 1}. {currentQ.question}</h3>

        <div className="row g-3 mb-4">
          {currentQ.options.map((opt, idx) => {
            const isSelected = userAnswers[currentIdx] === opt;
            return (
              <div className="col-12" key={idx}>
                <button
                  type="button"
                  className={`btn w-100 text-start p-3 fw-semibold rounded-3 border ${
                    isSelected ? "btn-primary" : "btn-outline-secondary"
                  }`}
                  onClick={() => handleOptionSelect(opt)}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                </button>
              </div>
            );
          })}
        </div>

        <div className="d-flex justify-content-between align-items-center pt-3 border-top">
          <button
            className="btn btn-outline-secondary px-4"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
          >
            ← Previous
          </button>

          {currentIdx < questions.length - 1 ? (
            <button
              className="btn btn-primary px-4"
              onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
            >
              Next Question →
            </button>
          ) : (
            <button className="btn btn-success px-4 fw-bold" onClick={handleSubmitQuiz}>
              ✅ Submit Quiz
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
