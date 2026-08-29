import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendRegisterOtpApi, verifyRegisterOtpApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    className: "Class 5",
    schoolName: "Day Care Centre School",
    parentName: ""
  });

  const [step, setStep] = useState(1); // 1: details, 2: OTP
  const [regToken, setRegToken] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [demoOtp, setDemoOtp] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const errors = [];
    if (!formData.name.trim()) errors.push("Student name / username is required.");
    if (!formData.email.trim() || !formData.email.includes("@")) errors.push("Valid email address is required for OTP.");
    if (!formData.password || formData.password.length < 6) errors.push("Password must be at least 6 characters.");
    if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match.");

    if (errors.length) {
      setError(errors.join(" "));
      return;
    }

    try {
      setLoading(true);
      const res = await sendRegisterOtpApi({
        name: formData.name.trim(),
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        schoolName: formData.schoolName,
        className: formData.className
      });
      setLoading(false);

      setRegToken(res.regToken);
      if (res.demoOtp) setDemoOtp(res.demoOtp);
      setSuccessMsg(`We sent a 6-digit OTP code to ${formData.email}. Please enter it below.`);
      setStep(2);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Failed to send registration OTP email.");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setSuccessMsg("");

    if (!otpInput.trim() || otpInput.trim().length !== 6) {
      setError("Please enter a valid 6-digit OTP code.");
      return;
    }

    try {
      setLoading(true);
      const res = await verifyRegisterOtpApi({
        regToken,
        otp: otpInput.trim()
      });
      setLoading(false);

      if (res.user) updateUser(res.user);
      setSuccessMsg("🎉 Email verified & account successfully created! Redirecting to Dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Invalid OTP code. Please try again.");
    }
  };

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <div className="card-body">
              <h2 className="section-title text-center">Create New Student Account</h2>
              <p className="text-center text-muted mb-4">Register to begin learning with a personalized dashboard.</p>

              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {successMsg && (
                <div className="alert alert-success" role="alert">
                  <div>{successMsg}</div>
                  {demoOtp && <div className="mt-1"><strong>Demo OTP: {demoOtp}</strong></div>}
                </div>
              )}

              {step === 1 && (
                <form onSubmit={handleSendOtp} noValidate>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Student Name / Username</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Full name or username"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">📧 Email Address (for OTP verification)</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        placeholder="Min 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className="form-control"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Age</label>
                      <input
                        type="number"
                        name="age"
                        className="form-control"
                        placeholder="Age"
                        value={formData.age}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Standard / Class</label>
                      <select name="className" className="form-select" value={formData.className} onChange={handleChange}>
                        <option value="Nursery">Nursery</option>
                        <option value="KG">KG</option>
                        <option value="Class 1">Class 1</option>
                        <option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option>
                        <option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option>
                        <option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option>
                        <option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option>
                        <option value="Class 10">Class 10</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">School</label>
                      <select name="schoolName" className="form-select" value={formData.schoolName} onChange={handleChange}>
                        <option value="Day Care Centre School">Day Care Centre School</option>
                        <option value="Guru Gobind Singh Public School">Guru Gobind Singh Public School</option>
                        <option value="SSC Board">SSC Board</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Parent Name</label>
                      <input
                        type="text"
                        name="parentName"
                        className="form-control"
                        placeholder="Parent name"
                        value={formData.parentName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="mt-4 d-flex flex-wrap gap-2 justify-content-between align-items-center">
                    <button type="submit" className="btn btn-primary px-4 py-2 fw-semibold" disabled={loading}>
                      {loading ? "Sending OTP..." : "📩 Register & Send OTP"}
                    </button>
                    <Link to="/login" className="text-decoration-none">Already have an account? Login</Link>
                  </div>
                </form>
              )}

              {step === 2 && (
                <div className="mt-4 p-4 border rounded-4 bg-light">
                  <h4 className="fw-bold mb-2">🔑 Verify Your Email OTP</h4>
                  <p className="text-muted small">We sent a 6-digit OTP code to your email. Enter it below to complete registration.</p>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">6-Digit OTP Code</label>
                    <input
                      type="text"
                      className="form-control text-center fs-4 letter-spacing-2"
                      placeholder="123456"
                      maxLength="6"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-success w-100 py-2 fw-semibold"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? "Verifying OTP..." : "✅ Verify OTP & Complete Account Setup"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
