// Registration page logic with duplicate student checks and validation.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const messageBox = document.getElementById("registerMessage");

  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageBox.className = "alert d-none";

    const studentData = {
      name: document.getElementById("regName").value.trim(),
      username: document.getElementById("regName").value.trim(),
      password: document.getElementById("regPassword").value,
      confirmPassword: document.getElementById("regConfirmPassword").value,
      age: document.getElementById("regAge").value,
      className: document.getElementById("regClass").value,
      schoolName: document.getElementById("regSchool").value,
      parentName: document.getElementById("regParent").value.trim(),
      mobile: document.getElementById("regMobile").value.trim(),
    };

    const errors = [];
    if (!studentData.name) errors.push("Student name is required.");
    if (!studentData.password || studentData.password.length < 6) errors.push("Password must be at least 6 characters.");
    if (studentData.password !== studentData.confirmPassword) errors.push("Passwords do not match.");

    if (errors.length) {
      messageBox.className = "alert alert-danger";
      messageBox.innerHTML = errors.map((item) => `<div>${item}</div>`).join("");
      return;
    }

    try {
      showLoader();
      const response = await registerUserWithMongo(studentData);
      hideLoader();
      messageBox.className = "alert alert-success";
      messageBox.innerHTML = `<strong>Account created & saved to MongoDB!</strong><br />Username: ${studentData.name}`;
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 800);
    } catch (err) {
      hideLoader();
      messageBox.className = "alert alert-danger";
      messageBox.textContent = err.message || "Registration failed. Please try again.";
    }
  });
});
