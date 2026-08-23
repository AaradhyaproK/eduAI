// Quiz page logic: load school-specific content, render chapter list, generate fresh questions, and save results.

const schoolDataMap = {
  "Day Care Centre School": "data/daycarecentre.json",
  "Guru Gobind Singh Public School": "data/ggsps.json"
};

document.addEventListener("DOMContentLoaded", async () => {
  const student = getCurrentStudent();
  if (!student) {
    window.location.href = "index.html";
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const subject = params.get("subject") || "Science";
  const school = student.school || student.schoolName || "Day Care Centre School";
  const quizHeading = document.getElementById("quizHeading");
  const quizIntro = document.getElementById("quizIntro");
  const quizContainer = document.getElementById("quizContainer");
  const submitButton = document.getElementById("submitQuiz");

  quizHeading.textContent = `${subject} Quiz`;
  quizIntro.textContent = `Interactive AI-style quiz for ${school}. Select a chapter and choose how many questions to generate.`;

  let selectedChapter = null;
  let generatedQuestions = [];

  try {
    const response = await fetch(schoolDataMap[school]);
    const data = await response.json();
    const chapters = data.subjects?.[subject] || [];

    if (!chapters.length) {
      quizContainer.innerHTML = "<div class='alert alert-warning'>No quiz content available for this subject yet.</div>";
      return;
    }

    selectedChapter = chapters[0];

    quizContainer.innerHTML = `
      <div class='mb-4'>
        <label class='form-label fw-semibold'>Select Chapter</label>
        <div id='chapterList' class='row g-2'></div>
      </div>

      <div class='mb-4 row g-3 align-items-end'>
        <div class='col-md-6'>
          <label class='form-label fw-semibold'>How many questions?</label>
          <input id='questionCount' type='number' class='form-control' min='1' max='20' value='5' />
        </div>
        <div class='col-md-6'>
          <button id='generateQuestionsBtn' class='btn btn-success w-100'>Generate Questions</button>
        </div>
      </div>

      <div id='chapterPreview' class='mb-4 p-3 rounded-4 bg-light'></div>
      <div id='questionsArea'></div>
    `;

    const chapterList = document.getElementById("chapterList");
    const chapterPreview = document.getElementById("chapterPreview");
    const questionCountInput = document.getElementById("questionCount");
    const questionArea = document.getElementById("questionsArea");
    const generateBtn = document.getElementById("generateQuestionsBtn");

    function renderChapterPreview(chapter) {
      chapterPreview.innerHTML = `
        <h4 class='mb-2'>${chapter.chapter}</h4>
        <p class='text-muted mb-2'>${chapter.theory}</p>
        <img src='${chapter.image}' class='img-fluid rounded-4 mb-3' alt='${chapter.chapter}' />
        <p><strong>Examples:</strong> ${chapter.examples.join(", ")}</p>
        <p><strong>Notes:</strong> ${chapter.notes}</p>
      `;
    }

    function renderChapterButtons() {
      chapterList.innerHTML = chapters.map((chapter) => `
        <div class='col-md-4'>
          <button type='button' class='btn w-100 ${selectedChapter.chapter === chapter.chapter ? "btn-primary" : "btn-outline-primary"} chapter-button' data-chapter='${chapter.chapter}'>
            ${chapter.chapter}
          </button>
        </div>
      `).join("");

      chapterList.querySelectorAll(".chapter-button").forEach((button) => {
        button.addEventListener("click", () => {
          const match = chapters.find((chapter) => chapter.chapter === button.dataset.chapter);
          if (match) {
            selectedChapter = match;
            renderChapterButtons();
            renderChapterPreview(selectedChapter);
            questionArea.innerHTML = "";
          }
        });
      });
    }

    function renderQuestions(questions) {
      generatedQuestions = questions;
      questionArea.innerHTML = `
        <div class="d-flex align-items-center justify-content-between mb-3">
          <span class="badge bg-primary fs-6 px-3 py-2">✨ Powered by Gemini AI</span>
          <span class="text-muted small">${questions.length} Questions</span>
        </div>
      ` + questions.map((question, index) => `
        <div class='card p-3 mb-3 border-0 shadow-sm rounded-4'>
          <p class='fw-semibold mb-2'>${index + 1}. ${escapeHtml(question.question)}</p>
          <div class='form-check'>${question.options.map((option) => `
            <label class='d-block mb-2 cursor-pointer'>
              <input type='radio' name='q${index}' value='${escapeHtml(option)}' /> ${escapeHtml(option)}
            </label>
          `).join("")}</div>
        </div>
      `).join("");
    }

    async function loadAndRenderQuestions(chapter, count) {
      questionArea.innerHTML = `
        <div class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
          <p class="fw-semibold text-primary mb-1">Generating AI Questions with Gemini Flash...</p>
          <p class="text-muted small">Tailoring questions for subject: ${escapeHtml(subject)} (${escapeHtml(chapter.chapter)})</p>
        </div>
      `;
      if (generateBtn) generateBtn.disabled = true;

      try {
        const textContext = `${chapter.theory || ""} ${chapter.notes || ""}`;
        const questions = await window.generateQuestionsWithGemini({
          subject: subject,
          chapterTitle: chapter.chapter,
          textContent: textContext,
          count: count,
          type: "mcq"
        });
        renderQuestions(questions);
      } catch (err) {
        console.error("Failed generating questions:", err);
        questionArea.innerHTML = "<div class='alert alert-warning'>Failed to generate questions via Gemini AI. Please try again.</div>";
      } finally {
        if (generateBtn) generateBtn.disabled = false;
      }
    }

    function escapeHtml(s) {
      if (!s) return "";
      return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    renderChapterButtons();
    renderChapterPreview(selectedChapter);

    generateBtn.addEventListener("click", () => {
      const count = Math.max(1, Math.min(20, Number(questionCountInput.value) || 5));
      loadAndRenderQuestions(selectedChapter, count);
    });

    submitButton.addEventListener("click", async () => {
      if (!generatedQuestions.length) {
        alert("Please generate questions first.");
        return;
      }

      let correctCount = 0;
      generatedQuestions.forEach((question, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && selected.value === question.answer) {
          correctCount += 1;
        }
      });

      const percentage = Math.round((correctCount / generatedQuestions.length) * 100);
      const result = {
        studentName: student.name,
        school,
        className: student.className,
        subject,
        marks: `${correctCount}/${generatedQuestions.length}`,
        percentage,
        chapter: selectedChapter.chapter,
        date: new Date().toLocaleDateString()
      };

      if (typeof saveQuizResultToMongo === "function") {
        await saveQuizResultToMongo(result);
      } else {
        const results = getResults();
        results.push(result);
        saveResults(results);
      }

      sessionStorage.setItem("lastResult", JSON.stringify(result));
      window.location.href = "result.html";
    });

    loadAndRenderQuestions(selectedChapter, 5);
  } catch (error) {
    quizContainer.innerHTML = "<div class='alert alert-danger'>Unable to load quiz data right now.</div>";
  }
});
