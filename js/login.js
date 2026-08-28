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

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    errorBox.classList.add("d-none");

    const name = document.getElementById("studentName").value.trim();
    const password = passwordInput.value;

    const errors = [];
    if (!name) errors.push("Student ID or username is required.");
    if (!password) errors.push("Password is required.");

    if (errors.length) {
      errorBox.classList.remove("d-none");
      errorBox.innerHTML = errors.map((item) => `<div>${item}</div>`).join("");
      return;
    }

    try {
      showLoader();
      const response = await loginUserWithMongo({ username: name, password });
      hideLoader();

      if (rememberMeCheckbox && rememberMeCheckbox.checked) {
        localStorage.setItem("smartStudentPortalRememberedUser", JSON.stringify({ name }));
      } else {
        localStorage.removeItem("smartStudentPortalRememberedUser");
      }

      window.location.href = "dashboard.html";
    } catch (err) {
      hideLoader();
      errorBox.classList.remove("d-none");
      errorBox.innerHTML = err.message || "Login failed. Please check your credentials.";
    }
  });
});
