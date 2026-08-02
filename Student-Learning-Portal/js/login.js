// Login page logic with validation and local storage authentication.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorBox = document.getElementById("loginError");
  const passwordInput = document.getElementById("studentPassword");
  const togglePasswordButton = document.getElementById("togglePassword");
  const rememberMeCheckbox = document.getElementById("rememberMe");

  if (!form) return;

  if (togglePasswordButton && passwordInput) {
    togglePasswordButton.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      togglePasswordButton.textContent = isHidden ? "🙈" : "👁";
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    errorBox.classList.add("d-none");

    const name = document.getElementById("studentName").value.trim();
    const password = passwordInput.value;

    const errors = [];
    if (!name) errors.push("Student ID or username is required.");
    if (!password) errors.push("Password is required.");
    if (password.length < 8) errors.push("Password must be at least 8 characters.");

    if (errors.length) {
      errorBox.classList.remove("d-none");
      errorBox.innerHTML = errors.map((item) => `<div>${item}</div>`).join("");
      return;
    }

    const students = getStudents();
    const matchedStudent = students.find((student) => student.name === name && student.password === password);

    if (!matchedStudent) {
      errorBox.classList.remove("d-none");
      errorBox.innerHTML = "Student account not found. Please register first or check your details.";
      return;
    }

    if (rememberMeCheckbox && rememberMeCheckbox.checked) {
      localStorage.setItem("smartStudentPortalRememberedUser", JSON.stringify({ name }));
    } else {
      localStorage.removeItem("smartStudentPortalRememberedUser");
    }

    setCurrentStudent(matchedStudent);
    window.location.href = "dashboard.html";
  });
});
