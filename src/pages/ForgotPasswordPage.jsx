import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendForgotOtpApi, resetPasswordApi } from "../services/api";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [demoOtp, setDemoOtp] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!username.trim() && !email.trim()) {
      setError("Please enter your Username or Email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await sendForgotOtpApi({ username: username.trim(), email: email.trim() });
      setLoading(false);

      if (res.demoOtp) setDemoOtp(res.demoOtp);
      setMessage(res.message || "OTP code sent to your email!");
      setStep(2);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to send OTP.");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter the 6-digit OTP code.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await resetPasswordApi({
        username: username.trim(),
        otp: otp.trim(),
        newPassword
      });
      setLoading(false);

      setMessage(res.message || "Password updated successfully!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to reset password.");
    }
  };

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <div className="card-body">
              <h2 className="section-title text-center">🔑 Reset Password</h2>
              <p className="text-center text-muted mb-4">Verify via email OTP to choose a new password.</p>

              {error && <div className="alert alert-danger">{error}</div>}
              {message && (
                <div className="alert alert-success">
                  <div>{message}</div>
                  {demoOtp && <div className="mt-1"><strong>Demo OTP Code: {demoOtp}</strong></div>}
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleSendOtp}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Username or Email Address</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter username or email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold" disabled={loading}>
                    {loading ? "Sending OTP..." : "📩 Send OTP Code"}
                  </button>
                  <div className="text-center mt-3">
                    <Link to="/login" className="text-decoration-none">Back to Login</Link>
                  </div>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleResetPassword}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">6-Digit OTP Code</label>
                    <input
                      type="text"
                      className="form-control text-center fs-4 letter-spacing-2"
                      placeholder="123456"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Min 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Confirm New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100 py-2 fw-semibold" disabled={loading}>
                    {loading ? "Updating..." : "✅ Reset Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
