// Forgot password OTP flow logic with MongoDB API integration.

document.addEventListener("DOMContentLoaded", () => {
  const sendOtpForm = document.getElementById("sendOtpForm");
  const resetPasswordForm = document.getElementById("resetPasswordForm");
  const messageBox = document.getElementById("forgotMessage");
  const forgotUsernameInput = document.getElementById("forgotUsername");
  const otpInput = document.getElementById("otpInput");
  const newPasswordInput = document.getElementById("newPasswordInput");
  const confirmNewPasswordInput = document.getElementById("confirmNewPasswordInput");
  const sendOtpBtn = document.getElementById("sendOtpBtn");

  let activeUsername = "";

  // Step 1: Send OTP
  if (sendOtpForm) {
    sendOtpForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      messageBox.className = "alert d-none";

      const usernameVal = forgotUsernameInput.value.trim();
      if (!usernameVal) {
        messageBox.className = "alert alert-danger";
        messageBox.textContent = "Please enter your username or email address.";
        return;
      }

      try {
        if (typeof showLoader === "function") showLoader();
        sendOtpBtn.disabled = true;

        const res = await sendOtpWithMongo({ username: usernameVal, email: usernameVal });
        if (typeof hideLoader === "function") hideLoader();

        activeUsername = res.username || usernameVal;
        messageBox.className = "alert alert-success";
        
        let demoNotice = res.demoOtp ? `<br/><strong>Demo OTP Code: ${res.demoOtp}</strong> (Printed in server console)` : "";
        messageBox.innerHTML = `<strong>${res.message}</strong>${demoNotice}<br/>Please check your inbox and enter the 6-digit OTP code below.`;

        sendOtpForm.classList.add("d-none");
        resetPasswordForm.classList.remove("d-none");
      } catch (err) {
        if (typeof hideLoader === "function") hideLoader();
        sendOtpBtn.disabled = false;
        messageBox.className = "alert alert-danger";
        messageBox.textContent = err.message || "Could not send OTP. Please check your username.";
      }
    });
  }

  // Step 2: Reset Password with OTP
  if (resetPasswordForm) {
    resetPasswordForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      messageBox.className = "alert d-none";

      const otp = otpInput.value.trim();
      const newPassword = newPasswordInput.value;
      const confirmNewPassword = confirmNewPasswordInput.value;

      const errors = [];
      if (!otp || otp.length !== 6) errors.push("Please enter a valid 6-digit OTP code.");
      if (!newPassword || newPassword.length < 6) errors.push("New password must be at least 6 characters.");
      if (newPassword !== confirmNewPassword) errors.push("Passwords do not match.");

      if (errors.length) {
        messageBox.className = "alert alert-danger";
        messageBox.innerHTML = errors.map((e) => `<div>${e}</div>`).join("");
        return;
      }

      try {
        if (typeof showLoader === "function") showLoader();
        const res = await resetPasswordWithMongo({
          username: activeUsername,
          otp,
          newPassword
        });
        if (typeof hideLoader === "function") hideLoader();

        messageBox.className = "alert alert-success";
        messageBox.innerHTML = `<strong>${res.message}</strong> Redirecting to login page...`;

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      } catch (err) {
        if (typeof hideLoader === "function") hideLoader();
        messageBox.className = "alert alert-danger";
        messageBox.textContent = err.message || "Password reset failed. Please check your OTP code.";
      }
    });
  }
});
