import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Please enter your username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      await login(username.trim(), password);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Invalid username or password.");
    }
  };

  return (
    <div className="hero-section" id="loginSection">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="text-center mb-4">
              <h1 className="display-5 fw-bold mb-2">EduMind AI</h1>
              <p className="lead text-muted mb-0">Learn Smarter with AI</p>
              <h2 className="h4 fw-semibold mt-4">Welcome Back!</h2>
            </div>

            <div className="card shadow-lg border-0 rounded-4 p-4 auth-card">
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="mb-3">
                    <label htmlFor="studentName" className="form-label fw-semibold">
                      👤 Student ID / Username
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="studentName"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="studentPassword" className="form-label fw-semibold">
                      🔒 Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="studentPassword"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "🙈" : "👁"}
                      </button>
                    </div>
                  </div>

                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember Me
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mb-3 py-2 fw-semibold" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <div className="d-flex justify-content-between flex-wrap gap-2 auth-links">
                    <Link to="/forgot-password">Forgot Password?</Link>
                    <Link to="/register">Create Account</Link>
                  </div>

                  <div className="text-center my-3 auth-divider">---------------- OR ----------------</div>
                  <button type="button" className="btn btn-outline-dark w-100 py-2">
                    Continue with Google
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
