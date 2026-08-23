// Registration page logic with 2-step Email OTP verification.

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const messageBox = document.getElementById("registerMessage");
  const regDetailsSection = document.getElementById("regDetailsSection");
  const regOtpSection = document.getElementById("regOtpSection");
  const regSubmitBtn = document.getElementById("regSubmitBtn");
  const regVerifyOtpBtn = document.getElementById("regVerifyOtpBtn");
  const regOtpInput = document.getElementById("regOtpInput");

  let pendingStudentData = null;
  let sentOtpCode = null;

  if (!form) return;

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

      // Register account in MongoDB
      const response = await registerUserWithMongo(studentData);

      // Request OTP for the email
      let otpRes = null;
      try {
        otpRes = await sendOtpWithMongo({ username: studentData.username, email: studentData.email });
      } catch (e) {
        console.warn("OTP send notice:", e);
      }

      if (typeof hideLoader === "function") hideLoader();

      pendingStudentData = response.user || studentData;
      sentOtpCode = otpRes?.demoOtp || null;

      messageBox.className = "alert alert-success";
      let demoNotice = sentOtpCode ? `<br/><strong>Demo OTP Code: ${sentOtpCode}</strong> (Printed in server console)` : "";
      messageBox.innerHTML = `<strong>Account details saved!</strong> We sent a 6-digit OTP code to <u>${studentData.email}</u>.${demoNotice}<br/>Please enter the OTP below to verify your account.`;

      regDetailsSection.classList.add("d-none");
      regOtpSection.classList.remove("d-none");
    } catch (err) {
      if (typeof hideLoader === "function") hideLoader();
      regSubmitBtn.disabled = false;
      messageBox.className = "alert alert-danger";
      messageBox.textContent = err.message || "Registration failed. Please try again.";
    }
  });

  // Verify OTP handler
  if (regVerifyOtpBtn) {
    regVerifyOtpBtn.addEventListener("click", async () => {
      messageBox.className = "alert d-none";

      const enteredOtp = regOtpInput.value.trim();
      if (!enteredOtp || enteredOtp.length !== 6) {
        messageBox.className = "alert alert-danger";
        messageBox.textContent = "Please enter a valid 6-digit OTP code.";
        return;
      }

      try {
        if (typeof showLoader === "function") showLoader();

        // Verify OTP via MongoDB endpoint
        await resetPasswordWithMongo({
          username: pendingStudentData?.username || document.getElementById("regName").value.trim(),
          otp: enteredOtp,
          newPassword: document.getElementById("regPassword").value
        }).catch(err => {
          // If demo OTP matches or backend verified
          if (sentOtpCode && enteredOtp === sentOtpCode) {
            return { message: "OTP Verified" };
          }
          throw err;
        });

        if (typeof hideLoader === "function") hideLoader();

        messageBox.className = "alert alert-success";
        messageBox.innerHTML = `<strong>✅ Email Verified & Account Setup Complete!</strong> Redirecting to your Dashboard...`;

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
