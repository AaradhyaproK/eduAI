// Quiz page logic: load school-specific content, render MCQs, and save results.

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
  const school = student.school;
  const quizHeading = document.getElementById("quizHeading");
  const quizIntro = document.getElementById("quizIntro");
  const quizContainer = document.getElementById("quizContainer");
  const submitButton = document.getElementById("submitQuiz");

  quizHeading.textContent = `${subject} Quiz`;
  quizIntro.textContent = `Interactive learning quiz for ${school}.`;

  try {
    const response = await fetch(schoolDataMap[school]);
    const data = await response.json();
    const lessons = data.subjects[subject] || [];
    if (!lessons.length) {
      quizContainer.innerHTML = "<div class='alert alert-warning'>No quiz content available for this subject yet.</div>";
      return;
    }

    const lesson = lessons[0];
    quizContainer.innerHTML = `
      <div class='mb-4'>
        <h4>${lesson.chapter}</h4>
        <p class='text-muted'>${lesson.theory}</p>
        <img src='${lesson.image}' class='img-fluid rounded-4 mb-3' alt='${lesson.chapter}' />
        <p><strong>Examples:</strong> ${lesson.examples.join(", ")}</p>
        <p><strong>Notes:</strong> ${lesson.notes}</p>
      </div>
      <div class='quiz-list'>${lesson.mcqs.map((question, index) => `
        <div class='card p-3 mb-3'>
          <p class='fw-semibold'>${index + 1}. ${question.question}</p>
          <div class='form-check'>${question.options.map((option) => `<label class='d-block'><input type='radio' name='q${index}' value='${option}' /> ${option}</label>`).join("")}</div>
        </div>
      `).join("")}</div>
    `;

    submitButton.addEventListener("click", () => {
      const chosen = [];
      lesson.mcqs.forEach((_, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        chosen.push(selected ? selected.value : "");
      });

      let correctCount = 0;
      lesson.mcqs.forEach((question, index) => {
        if (chosen[index] === question.answer) correctCount += 1;
      });

      const percentage = Math.round((correctCount / lesson.mcqs.length) * 100);
      const result = {
        studentName: student.name,
        school,
        className: student.className,
        subject,
        marks: `${correctCount}/${lesson.mcqs.length}`,
        percentage,
        date: new Date().toLocaleDateString()
      };

      const results = getResults();
      results.push(result);
      saveResults(results);
      sessionStorage.setItem("lastResult", JSON.stringify(result));
      window.location.href = "result.html";
    });
  } catch (error) {
    quizContainer.innerHTML = "<div class='alert alert-danger'>Unable to load quiz data right now.</div>";
  }
});
