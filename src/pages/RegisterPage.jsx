import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUserApi } from "../services/api";
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

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    const errors = [];
    if (!formData.name.trim()) errors.push("Student name / username is required.");
    if (!formData.password || formData.password.length < 6) errors.push("Password must be at least 6 characters.");
    if (formData.password !== formData.confirmPassword) errors.push("Passwords do not match.");

    if (errors.length) {
      setError(errors.join(" "));
      return;
    }

    try {
      setLoading(true);
      const res = await registerUserApi({
        name: formData.name.trim(),
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        schoolName: formData.schoolName,
        className: formData.className
      });
      setLoading(false);

      if (res.user) updateUser(res.user);
      setSuccessMsg("🎉 Account created successfully! Redirecting to Dashboard...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Registration failed. Please try again.");
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
              {successMsg && <div className="alert alert-success" role="alert">{successMsg}</div>}

              <form onSubmit={handleRegister} noValidate>
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
                    <label className="form-label fw-semibold">📧 Email Address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="student@example.com"
                      value={formData.email}
                      onChange={handleChange}
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
                    {loading ? "Creating Account..." : "✨ Create Account"}
                  </button>
                  <Link to="/login" className="text-decoration-none">Already have an account? Login</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
