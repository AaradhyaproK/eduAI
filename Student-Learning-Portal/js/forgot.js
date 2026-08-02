// Forgot password flow with validation and password update.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotForm");
  const messageBox = document.getElementById("forgotMessage");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    messageBox.className = "alert d-none";

    const name = document.getElementById("forgotName").value.trim();
    const school = document.getElementById("forgotSchool").value;
    const password = document.getElementById("forgotPassword").value;
    const confirmPassword = document.getElementById("forgotConfirmPassword").value;

    const errors = [];
    if (!name) errors.push("Student name is required.");
    if (!school) errors.push("School is required.");
    if (!password || password.length < 8) errors.push("Password must be at least 8 characters.");
    if (password !== confirmPassword) errors.push("Passwords do not match.");

    if (errors.length) {
      messageBox.className = "alert alert-danger";
      messageBox.innerHTML = errors.map((item) => `<div>${item}</div>`).join("");
      return;
    }

    const students = getStudents();
    const studentIndex = students.findIndex((student) => student.name.toLowerCase() === name.toLowerCase() && student.school === school);

    if (studentIndex === -1) {
      messageBox.className = "alert alert-warning";
      messageBox.textContent = "No matching student account found.";
      return;
    }

    students[studentIndex].password = password;
    saveStudents(students);
    messageBox.className = "alert alert-success";
    messageBox.textContent = "Password updated successfully. You can now login.";
  });
});
