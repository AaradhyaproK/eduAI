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
      questionArea.innerHTML = questions.map((question, index) => `
        <div class='card p-3 mb-3'>
          <p class='fw-semibold'>${index + 1}. ${question.question}</p>
          <div class='form-check'>${question.options.map((option) => `
            <label class='d-block mb-2'>
              <input type='radio' name='q${index}' value='${option}' /> ${option}
            </label>
          `).join("")}</div>
        </div>
      `).join("");
    }

    function generateAiQuestions(chapter, count) {
      const baseQuestions = chapter.mcqs || [];
      const generated = [];

      for (let i = 0; i < count; i += 1) {
        const source = baseQuestions[i % baseQuestions.length] || {
          question: `Which fact matches the chapter "${chapter.chapter}"?`,
          options: [chapter.examples[0] || "Plant", chapter.notes || "Observation", "Stone", "River"],
          answer: chapter.examples[0] || "Plant"
        };

        const shuffled = [...source.options];
        for (let j = shuffled.length - 1; j > 0; j -= 1) {
          const randomIndex = Math.floor(Math.random() * (j + 1));
          [shuffled[j], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[j]];
        }

        generated.push({
          question: `${source.question}`,
          options: shuffled,
          answer: source.answer
        });
      }

      return generated;
    }

    renderChapterButtons();
    renderChapterPreview(selectedChapter);

    generateBtn.addEventListener("click", () => {
      const count = Math.max(1, Math.min(20, Number(questionCountInput.value) || 5));
      const questions = generateAiQuestions(selectedChapter, count);
      renderQuestions(questions);
    });

    submitButton.addEventListener("click", () => {
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

      const results = getResults();
      results.push(result);
      saveResults(results);
      sessionStorage.setItem("lastResult", JSON.stringify(result));
      window.location.href = "result.html";
    });

    const initialQuestions = generateAiQuestions(selectedChapter, 5);
    renderQuestions(initialQuestions);
  } catch (error) {
    quizContainer.innerHTML = "<div class='alert alert-danger'>Unable to load quiz data right now.</div>";
  }
});
