import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { currentUser, updateUser } = useAuth();

  const [name, setName] = useState(currentUser?.name || currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [schoolName, setSchoolName] = useState(currentUser?.schoolName || "Day Care Centre School");
  const [className, setClassName] = useState(currentUser?.className || "Class 5");

  const [message, setMessage] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...currentUser,
      name,
      email,
      schoolName,
      className
    };
    updateUser(updated);
    setMessage("Profile details updated successfully!");
  };

  return (
    <main className="container py-5" style={{ marginTop: "70px" }}>
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card border-0 shadow-lg rounded-4 p-4">
            <div className="text-center mb-4">
              <div className="fs-1 mb-2">👤</div>
              <h2 className="fw-bold">Student Profile</h2>
              <p className="text-muted mb-0">Manage your account information and preferences.</p>
            </div>

            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSave}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Student Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">School</label>
                <select className="form-select" value={schoolName} onChange={(e) => setSchoolName(e.target.value)}>
                  <option value="Day Care Centre School">Day Care Centre School</option>
                  <option value="Guru Gobind Singh Public School">Guru Gobind Singh Public School</option>
                  <option value="SSC Board">SSC Board</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Class / Standard</label>
                <select className="form-select" value={className} onChange={(e) => setClassName(e.target.value)}>
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

              <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
                💾 Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
