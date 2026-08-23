// Registration page logic with 2-step Email OTP verification BEFORE account creation in MongoDB.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const messageBox = document.getElementById("registerMessage");
  const regDetailsSection = document.getElementById("regDetailsSection");
  const regOtpSection = document.getElementById("regOtpSection");
  const regSubmitBtn = document.getElementById("regSubmitBtn");
  const regVerifyOtpBtn = document.getElementById("regVerifyOtpBtn");
  const regOtpInput = document.getElementById("regOtpInput");

  let registrationSession = null; // Holds temporary regToken

  if (!form) return;

  // Step 1: Submit Form -> Validate & Send Email OTP (Account NOT saved yet)
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    messageBox.className = "alert d-none";

    const emailVal = document.getElementById("regEmail").value.trim();
    const studentData = {
      name: document.getElementById("regName").value.trim(),
      username: document.getElementById("regName").value.trim(),
      email: emailVal,
      password: document.getElementById("regPassword").value,
      confirmPassword: document.getElementById("regConfirmPassword").value,
      age: document.getElementById("regAge").value,
      className: document.getElementById("regClass").value,
      schoolName: document.getElementById("regSchool").value,
      parentName: document.getElementById("regParent").value?.trim() || ""
    };

    const errors = [];
    if (!studentData.name) errors.push("Student name / username is required.");
    if (!studentData.email || !studentData.email.includes("@")) errors.push("Valid email address is required for OTP.");
    if (!studentData.password || studentData.password.length < 6) errors.push("Password must be at least 6 characters.");
    if (studentData.password !== studentData.confirmPassword) errors.push("Passwords do not match.");

    if (errors.length) {
      messageBox.className = "alert alert-danger";
      messageBox.innerHTML = errors.map((item) => `<div>${item}</div>`).join("");
      return;
    }

    try {
      if (typeof showLoader === "function") showLoader();
      regSubmitBtn.disabled = true;

      // Send OTP to Email without creating MongoDB user record yet
      const response = await sendRegisterOtpWithMongo(studentData);
      if (typeof hideLoader === "function") hideLoader();

      registrationSession = response;

      messageBox.className = "alert alert-success";
      let demoNotice = response.demoOtp ? `<br/><strong>Demo OTP Code: ${response.demoOtp}</strong> (Printed in server console)` : "";
      messageBox.innerHTML = `<strong>We sent a 6-digit OTP code to <u>${studentData.email}</u>!</strong>${demoNotice}<br/>Please enter the 6-digit code below to verify your email and create your account.`;

      regDetailsSection.classList.add("d-none");
      regOtpSection.classList.remove("d-none");
    } catch (err) {
      if (typeof hideLoader === "function") hideLoader();
      regSubmitBtn.disabled = false;
      messageBox.className = "alert alert-danger";
      messageBox.textContent = err.message || "Registration failed. Please try again.";
    }
  });

  // Step 2: Verify OTP -> ONLY THEN Create Account in MongoDB
  if (regVerifyOtpBtn) {
    regVerifyOtpBtn.addEventListener("click", async () => {
      messageBox.className = "alert d-none";

      const enteredOtp = regOtpInput.value.trim();
      if (!enteredOtp || enteredOtp.length !== 6) {
        messageBox.className = "alert alert-danger";
        messageBox.textContent = "Please enter a valid 6-digit OTP code.";
        return;
      }

      if (!registrationSession || !registrationSession.regToken) {
        messageBox.className = "alert alert-danger";
        messageBox.textContent = "Registration session expired. Please refresh and fill in the registration details again.";
        return;
      }

      try {
        if (typeof showLoader === "function") showLoader();

        // Verify OTP and Save User Account to MongoDB Atlas
        const result = await verifyRegisterOtpWithMongo({
          regToken: registrationSession.regToken,
          otp: enteredOtp
        });

        if (typeof hideLoader === "function") hideLoader();

        messageBox.className = "alert alert-success";
        messageBox.innerHTML = `<strong>🎉 ${result.message}</strong> Redirecting to your Dashboard...`;

        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 1200);
      } catch (err) {
        if (typeof hideLoader === "function") hideLoader();
        messageBox.className = "alert alert-danger";
        messageBox.textContent = err.message || "Invalid OTP code. Please check your email and try again.";
      }
    });
  }
});
