// Displays the logged-in student's information on the subjects page.

document.addEventListener("DOMContentLoaded", () => {
  const student = getStoredStudent();

  if (!student) {
    window.location.href = "index.html";
    return;
  }

  const nameDisplay = document.getElementById("studentNameDisplay");
  const schoolDisplay = document.getElementById("schoolDisplay");
  const classDisplay = document.getElementById("classDisplay");

  if (nameDisplay) nameDisplay.textContent = student.name;
  if (schoolDisplay) schoolDisplay.textContent = student.schoolName;
  if (classDisplay) classDisplay.textContent = student.className;

  document.querySelectorAll(".subject-card").forEach((card) => {
    card.addEventListener("click", () => {
      const subject = card.getAttribute("data-subject");
      if (subject) {
        showLoader();
        setTimeout(() => {
          window.location.href = `quiz.html?subject=${encodeURIComponent(subject)}`;
        }, 500);
      }
    });
  });
});
