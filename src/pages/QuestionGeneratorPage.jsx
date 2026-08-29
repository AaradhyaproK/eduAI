import React, { useState } from "react";
import { generateQuestionsWithGemini } from "../services/gemini";
import { saveQuizResultApi } from "../services/api";

export default function QuestionGeneratorPage() {
  const [subject, setSubject] = useState("Science");
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(5);
  const [contextText, setContextText] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);

  const [userAnswers, setUserAnswers] = useState({});
  const [scoreResult, setScoreResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setScoreResult(null);
    setUserAnswers({});

    try {
      const qList = await generateQuestionsWithGemini({
        subject,
        chapterTitle: topic,
        textContent: contextText,
        count: Number(count),
        type: "mcq"
      });
      setGeneratedQuestions(qList || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIdx, opt) => {
    setUserAnswers({ ...userAnswers, [qIdx]: opt });
  };

  const handleSubmitAnswers = async () => {
    let correct = 0;
    generatedQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.answer) {
        correct++;
      }
    });

    const total = generatedQuestions.length;
    const percentage = Math.round((correct / total) * 100);
    const marks = `${correct}/${total}`;

    setScoreResult({ correct, total, percentage, marks });

    await saveQuizResultApi({
      subject,
      chapter: topic || "AI Generated Quiz",
      marks,
      percentage,
      date: new Date().toLocaleDateString()
    });
  };

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="text-center mb-4">
        <h1 className="display-6 fw-bold mb-2">🤖 Gemini AI Question & Practice Quiz Generator</h1>
        <p className="text-muted">Generate instant custom MCQs with Google Gemini AI for any subject or custom topic text.</p>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-lg rounded-4 p-4">
            <h4 className="fw-bold mb-3">⚙️ Generator Configuration</h4>
            <form onSubmit={handleGenerate}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Subject</label>
                <select className="form-select" value={subject} onChange={(e) => setSubject(e.target.value)}>
                  <option value="Science">Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="English">English</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="General Knowledge">General Knowledge</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Topic / Chapter Title (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Solar System, Fractions, Photosynthesis"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Number of Questions</label>
                <select className="form-select" value={count} onChange={(e) => setCount(e.target.value)}>
                  <option value="3">3 Questions</option>
                  <option value="5">5 Questions</option>
                  <option value="10">10 Questions</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Text Context / Notes (Optional)</label>
                <textarea
                  className="form-control"
                  rows="4"
                  placeholder="Paste lesson text or notes to generate questions directly from your content..."
                  value={contextText}
                  onChange={(e) => setContextText(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                {loading ? "✨ Generating with Gemini AI..." : "⚡ Generate Practice Quiz"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-lg rounded-4 p-4 h-100">
            <h4 className="fw-bold mb-3">📝 Generated Practice Test</h4>

            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
                <p className="mt-3 fw-semibold">Gemini AI is analyzing topic & creating questions...</p>
              </div>
            )}

            {!loading && generatedQuestions.length === 0 && (
              <div className="text-center py-5 text-muted">
                <div className="fs-1 mb-2">💡</div>
                <p>Configure parameters on the left and click <strong>Generate Practice Quiz</strong> to start.</p>
              </div>
            )}

            {!loading && generatedQuestions.length > 0 && (
              <div>
                {scoreResult && (
                  <div className="alert alert-success text-center mb-4">
                    <h4 className="fw-bold">🎉 Score: {scoreResult.percentage}% ({scoreResult.marks})</h4>
                    <p className="mb-0">Quiz results saved to your profile!</p>
                  </div>
                )}

                {generatedQuestions.map((q, qIdx) => (
                  <div className="card border mb-3 p-3 rounded-3" key={qIdx}>
                    <h5 className="fw-bold mb-3">{qIdx + 1}. {q.question}</h5>
                    <div className="d-flex flex-column gap-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = userAnswers[qIdx] === opt;
                        const isCorrect = scoreResult && opt === q.answer;
                        const isWrongSelected = scoreResult && isSelected && opt !== q.answer;

                        let btnStyle = "btn-outline-secondary";
                        if (scoreResult) {
                          if (isCorrect) btnStyle = "btn-success";
                          else if (isWrongSelected) btnStyle = "btn-danger";
                        } else if (isSelected) {
                          btnStyle = "btn-primary";
                        }

                        return (
                          <button
                            key={oIdx}
                            type="button"
                            className={`btn text-start p-2 rounded-3 ${btnStyle}`}
                            onClick={() => !scoreResult && handleOptionSelect(qIdx, opt)}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {!scoreResult && (
                  <button className="btn btn-success w-100 py-2 fw-bold mt-3" onClick={handleSubmitAnswers}>
                    ✅ Submit AI Quiz Answers
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
