// Registration page logic with duplicate student checks and validation.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const messageBox = document.getElementById("registerMessage");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    messageBox.className = "alert d-none";

    const student = {
      name: document.getElementById("regName").value.trim(),
      password: document.getElementById("regPassword").value,
      confirmPassword: document.getElementById("regConfirmPassword").value,
      age: document.getElementById("regAge").value,
      className: document.getElementById("regClass").value,
      school: document.getElementById("regSchool").value,
      parentName: document.getElementById("regParent").value.trim(),
      mobile: document.getElementById("regMobile").value.trim(),
    };

    const errors = [];
    if (!student.name) errors.push("Student name is required.");
    if (!student.password || student.password.length < 8) errors.push("Password must be at least 8 characters.");
    if (student.password !== student.confirmPassword) errors.push("Passwords do not match.");
    if (!student.age || Number(student.age) < 3 || Number(student.age) > 18) errors.push("Age must be between 3 and 18.");
    if (!student.className) errors.push("Class is required.");
    if (!student.school) errors.push("School is required.");
    if (!student.parentName) errors.push("Parent name is required.");
    if (!student.mobile) errors.push("Mobile number is required.");

    if (errors.length) {
      messageBox.className = "alert alert-danger";
      messageBox.innerHTML = errors.map((item) => `<div>${item}</div>`).join("");
      return;
    }

    const students = getStudents();
    const duplicate = students.some((existing) => existing.name.toLowerCase() === student.name.toLowerCase() && existing.school === student.school);
    if (duplicate) {
      messageBox.className = "alert alert-warning";
      messageBox.textContent = "This student is already registered.";
      return;
    }

    students.push(student);
    saveStudents(students);
    setCurrentStudent(student);
    messageBox.className = "alert alert-success";
    messageBox.innerHTML = `<strong>Account created successfully.</strong><br />Username: ${student.name}<br />Password: ${student.password}`;
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 700);
  });
});
