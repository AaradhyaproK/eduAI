import React, { useState } from "react";
import { submitLeaveRequest } from "../../services/erpStorage";
import { IconParent, IconSend, IconFileText, IconCheck } from "./ERPIcons";

export default function ERPParentPortal({ erpData, onRefresh, setActiveTab }) {
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFeedback, setLeaveFeedback] = useState(null);

  // Chat simulator state
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: "Mrs. Priya Sharma (Class Mentor)",
      time: "Yesterday, 04:15 PM",
      text: "Namaste Mr. Patel! Aarav has been performing exceptionally well in the AI & Robotics lab. We are recommending him for the upcoming Inter-School Science Olympiad.",
      isMentor: true
    },
    {
      id: 2,
      sender: "You (Rajesh Patel)",
      time: "Yesterday, 06:30 PM",
      text: "Thank you Mrs. Sharma! That is wonderful to hear. Will the preparation sessions happen during normal school hours or over weekends?",
      isMentor: false
    },
    {
      id: 3,
      sender: "Mrs. Priya Sharma (Class Mentor)",
      time: "Today, 08:30 AM",
      text: "The preparation will happen on Wednesdays during zero-period from 08:00 AM to 08:30 AM so it won't clash with his core subjects.",
      isMentor: true
    }
  ]);
  const [inputMsg, setInputMsg] = useState("");

  const student = erpData.students[0]; // Aarav Patel
  const myLeaves = (erpData.leaveRequests || []).filter(
    (l) => l.applicantId === student.id || l.applicantName === student.name
  );

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    if (!leaveFrom || !leaveTo || !leaveReason) return;

    submitLeaveRequest({
      applicantType: "Student",
      applicantId: student.id,
      applicantName: student.name,
      grade: `${student.grade}-${student.section}`,
      fromDate: leaveFrom,
      toDate: leaveTo,
      reason: leaveReason
    });

    setLeaveFeedback("Leave application submitted to Class Mentor (Mrs. Priya Sharma) for authorization.");
    setLeaveFrom("");
    setLeaveTo("");
    setLeaveReason("");
    onRefresh();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    const newMsg = {
      id: Date.now(),
      sender: `You (${student.parentName})`,
      time: "Just now",
      text: userText,
      isMentor: false
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMsg("");

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "Mrs. Priya Sharma (Class Mentor)",
          time: "Just now",
          text: `Thank you for your update regarding Aarav. I have noted this and will coordinate with the academic department.`,
          isMentor: true
        }
      ]);
    }, 1200);
  };

  return (
    <div className="erp-parent-portal animate-fade-in">
      {/* Ward Profile Banner */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div className="d-flex align-items-center gap-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="rounded-circle border"
              style={{ width: "64px", height: "64px", objectFit: "cover" }}
            />
            <div>
              <div className="d-flex align-items-center gap-2">
                <h5 className="fw-bold mb-0 text-dark">{student.name}</h5>
                <span className="badge bg-slate-100 text-slate-700 border">
                  {student.grade} - {student.section}
                </span>
              </div>
              <p className="text-muted small mb-0">
                Roll #{student.rollNo} • ID: <span className="font-monospace">{student.id}</span> • Mentor: Mrs. Priya Sharma
              </p>
              <span className="small text-muted" style={{ fontSize: "0.75rem" }}>
                Active Guardian: <strong>{student.parentName}</strong> ({student.parentPhone})
              </span>
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-secondary rounded-2 px-3 fw-medium"
              onClick={() => setActiveTab("academics")}
            >
              Academic Report Card
            </button>
            <button
              className="btn btn-sm btn-primary rounded-2 px-3 fw-medium shadow-xs"
              onClick={() => setActiveTab("finance")}
            >
              Pay Tuition Dues
            </button>
          </div>
        </div>
      </div>

      {/* Ward Telemetry & Status Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
            <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Attendance Standing</span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-success">{student.attendance}%</h3>
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small">Regular</span>
            </div>
            <span className="small text-muted mt-1" style={{ fontSize: "0.75rem" }}>RFID turnstile entry: 08:02 AM Today</span>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
            <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Tuition Dues Account</span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-dark">
                {student.fee.due === 0 ? "₹0 Dues" : `₹${student.fee.due.toLocaleString()}`}
              </h3>
              <span
                className={`badge small ${
                  student.fee.status === "Paid"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}
                style={{ fontSize: "0.72rem" }}
              >
                {student.fee.status}
              </span>
            </div>
            <span className="small text-muted mt-1 font-monospace" style={{ fontSize: "0.72rem" }}>Receipt #{student.fee.lastReceipt}</span>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
            <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Assigned Fleet Route</span>
            <h6 className="fw-bold mb-0 text-dark mt-1">{student.busRoute.split("-")[1] || "Route 04"}</h6>
            <span className="small text-muted" style={{ fontSize: "0.75rem" }}>Pickup Point: {student.busStop}</span>
            <button
              className="btn btn-link btn-sm p-0 text-start text-primary fw-medium small mt-1 text-decoration-none"
              style={{ fontSize: "0.75rem" }}
              onClick={() => setActiveTab("transport")}
            >
              Track Bus Location →
            </button>
          </div>
        </div>

        <div className="col-md-3 col-sm-6">
          <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
            <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Cumulative GPA Standing</span>
            <div className="d-flex align-items-baseline gap-2 mt-1">
              <h3 className="fw-bold mb-0 text-dark">3.8 / 4.0</h3>
              <span className="badge bg-blue-50 text-blue-700 border border-blue-200 small">Rank #2</span>
            </div>
            <span className="small text-muted mt-1" style={{ fontSize: "0.75rem" }}>Top 5th percentile cohort</span>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Mentor Two-Way Chat Channel */}
        <div className="col-lg-7">
          <div className="card border rounded-3 p-4 bg-white mb-4 h-100 d-flex flex-column shadow-xs">
            <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
              <div>
                <h6 className="fw-bold mb-0 text-dark small">Class Mentor Communication Channel</h6>
                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>Mrs. Priya Sharma (Grade 10-A Faculty Mentor)</span>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small">Direct</span>
            </div>

            {/* Chat Stream */}
            <div className="chat-stream flex-grow-1 overflow-auto p-2 mb-3 bg-slate-50 border rounded-2" style={{ maxHeight: "310px" }}>
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`d-flex flex-column mb-3 ${msg.isMentor ? "align-items-start" : "align-items-end"}`}
                >
                  <div className="text-muted mb-1" style={{ fontSize: "0.72rem" }}>
                    {msg.sender} • {msg.time}
                  </div>
                  <div
                    className={`p-3 rounded-2 shadow-xs small ${
                      msg.isMentor
                        ? "bg-white text-dark border"
                        : "bg-primary text-white"
                    }`}
                    style={{ maxWidth: "80%", fontSize: "0.82rem", lineHeight: "1.4" }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input form */}
            <form onSubmit={handleSendMessage} className="d-flex gap-2 pt-2">
              <input
                type="text"
                className="form-control form-control-sm rounded-2"
                placeholder="Type a message to Class Mentor..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
              />
              <button type="submit" className="btn btn-sm btn-primary rounded-2 px-3 fw-medium d-flex align-items-center gap-1">
                <IconSend size={14} />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Leave Application Desk */}
        <div className="col-lg-5">
          <div className="card border rounded-3 p-4 bg-white mb-4 shadow-xs">
            <h6 className="fw-bold text-dark mb-1 small">Student Leave Request Application</h6>
            <p className="text-muted small mb-3" style={{ fontSize: "0.78rem" }}>
              Submit planned medical or family absence requests directly to the mentor and principal.
            </p>

            <form onSubmit={handleLeaveSubmit}>
              <div className="row g-2 mb-2">
                <div className="col-6">
                  <label className="form-label small fw-medium text-muted" style={{ fontSize: "0.75rem" }}>From Date *</label>
                  <input
                    type="date"
                    className="form-control form-control-sm rounded-2"
                    required
                    value={leaveFrom}
                    onChange={(e) => setLeaveFrom(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label small fw-medium text-muted" style={{ fontSize: "0.75rem" }}>To Date *</label>
                  <input
                    type="date"
                    className="form-control form-control-sm rounded-2"
                    required
                    value={leaveTo}
                    onChange={(e) => setLeaveTo(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-medium text-muted" style={{ fontSize: "0.75rem" }}>Reason for Absence *</label>
                <textarea
                  className="form-control form-control-sm rounded-2"
                  rows="3"
                  required
                  placeholder="State reason for absence..."
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-sm btn-outline-primary rounded-2 w-100 fw-medium mb-2">
                Submit Leave Application
              </button>
            </form>

            {leaveFeedback && (
              <div className="alert alert-success small py-2 rounded-2 mt-2 mb-3" style={{ fontSize: "0.78rem" }}>
                {leaveFeedback}
              </div>
            )}

            {/* Leave History */}
            <h6 className="fw-bold text-dark mt-3 mb-2" style={{ fontSize: "0.78rem" }}>Submitted Requests Status:</h6>
            <div className="leave-list overflow-auto" style={{ maxHeight: "140px" }}>
              {myLeaves.length === 0 ? (
                <span className="text-muted small">No past leave applications recorded.</span>
              ) : (
                myLeaves.map((l) => (
                  <div key={l.id} className="p-2 border rounded-2 mb-2 small bg-slate-50">
                    <div className="d-flex justify-content-between fw-medium">
                      <span className="font-monospace" style={{ fontSize: "0.75rem" }}>{l.fromDate} to {l.toDate}</span>
                      <span
                        className={`badge rounded-1 ${
                          l.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : l.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                        style={{ fontSize: "0.7rem" }}
                      >
                        {l.status}
                      </span>
                    </div>
                    <div className="text-muted mt-1" style={{ fontSize: "0.72rem" }}>
                      Reason: {l.reason}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
