import React, { useState } from "react";
import {
  recordAttendance,
  markAllAttendance,
  simulateGateTap
} from "../../services/erpStorage";
import { IconAttendance, IconShield, IconCheck, IconCreditCard, IconSend } from "./ERPIcons";

export default function ERPAttendanceModule({ erpData, onRefresh }) {
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [rfidStudentId, setRfidStudentId] = useState(erpData.students[0]?.id || "");
  const [tapFeedback, setTapFeedback] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const students = erpData.students || [];
  const attendanceRecords = erpData.dailyAttendance[selectedClass]?.records || {};
  const smsQueue = erpData.simulatedSmsQueue || [];

  // Calculate statistics for class
  const classStudents = students.filter((s) => `${s.grade}-${s.section}` === selectedClass);
  const total = classStudents.length;
  let presentCount = 0;
  let absentCount = 0;
  let lateCount = 0;

  classStudents.forEach((s) => {
    const st = attendanceRecords[s.id] || "Present";
    if (st === "Present") presentCount++;
    else if (st === "Absent") absentCount++;
    else if (st === "Late") lateCount++;
  });

  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  const handleStatusChange = (studentId, status) => {
    recordAttendance(selectedClass, studentId, status);
    onRefresh();
  };

  const handleMarkAll = (status) => {
    markAllAttendance(selectedClass, status);
    onRefresh();
  };

  const handleSimulateCardTap = () => {
    if (!rfidStudentId) return;
    setIsScanning(true);
    setTapFeedback(null);

    setTimeout(() => {
      const res = simulateGateTap(rfidStudentId);
      setIsScanning(false);
      if (res.success) {
        setTapFeedback({
          success: true,
          message: `RFID Badge Verified: ${res.student.name} logged at ${res.timeStr}. SMS dispatch routed to guardian (${res.student.parentPhone}).`
        });
        recordAttendance(selectedClass, rfidStudentId, "Present");
        onRefresh();
      }
    }, 600);
  };

  return (
    <div className="erp-attendance-module animate-fade-in">
      {/* Top Header & Overview */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Daily Class Attendance & Smart Turnstile Terminal</h5>
            <p className="text-muted small mb-0">
              Record classroom roll calls and simulate real-time RFID biometric entrance checkpoints with parent SMS dispatch.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-sm btn-outline-success fw-medium rounded-2 px-3"
              onClick={() => handleMarkAll("Present")}
            >
              Mark All Present
            </button>
            <button
              className="btn btn-sm btn-outline-danger fw-medium rounded-2 px-3"
              onClick={() => handleMarkAll("Absent")}
            >
              Mark All Absent
            </button>
          </div>
        </div>

        {/* Controls Row */}
        <div className="row g-3 align-items-center border-top pt-3">
          <div className="col-md-4 col-sm-6">
            <label className="form-label small text-muted mb-1 fw-medium" style={{ fontSize: "0.78rem" }}>
              Classroom Roster
            </label>
            <select
              className="form-select form-select-sm rounded-2"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="Grade 10-A">Grade 10 - Section A (Active Section)</option>
              <option value="Grade 10-B">Grade 10 - Section B</option>
              <option value="Grade 9-A">Grade 9 - Section A</option>
              <option value="Grade 9-B">Grade 9 - Section B</option>
              <option value="Grade 11-A">Grade 11 - Section A</option>
              <option value="Grade 12-A">Grade 12 - Section A</option>
            </select>
          </div>

          <div className="col-md-3 col-sm-6">
            <label className="form-label small text-muted mb-1 fw-medium" style={{ fontSize: "0.78rem" }}>
              Session Date
            </label>
            <input
              type="date"
              className="form-control form-control-sm rounded-2"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="col-md-5 d-flex justify-content-md-end">
            <div className="d-flex align-items-center gap-2">
              <div className="text-center px-3 py-1 bg-slate-50 rounded-2 border">
                <span className="small text-muted d-block" style={{ fontSize: "0.7rem" }}>Present</span>
                <strong className="text-success small">{presentCount}</strong>
              </div>
              <div className="text-center px-3 py-1 bg-slate-50 rounded-2 border">
                <span className="small text-muted d-block" style={{ fontSize: "0.7rem" }}>Late</span>
                <strong className="text-warning small">{lateCount}</strong>
              </div>
              <div className="text-center px-3 py-1 bg-slate-50 rounded-2 border">
                <span className="small text-muted d-block" style={{ fontSize: "0.7rem" }}>Absent</span>
                <strong className="text-danger small">{absentCount}</strong>
              </div>
              <div className="text-center px-3 py-1 bg-primary text-white rounded-2">
                <span className="small opacity-75 d-block" style={{ fontSize: "0.7rem" }}>Rate</span>
                <strong className="small">{rate}%</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Class Roll Call Sheet */}
        <div className="col-lg-7">
          <div className="card border rounded-3 overflow-hidden bg-white mb-4 shadow-xs">
            <div className="card-header bg-light border-bottom py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0 text-dark small">
                Classroom Attendance Register: {selectedClass} ({classStudents.length} Students)
              </h6>
              <span className="badge bg-slate-100 text-slate-700 border small">Auto-persisted</span>
            </div>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small">
                  <tr>
                    <th className="ps-3 text-muted fw-semibold">Roll</th>
                    <th className="text-muted fw-semibold">Student Name</th>
                    <th className="text-center text-muted fw-semibold">Attendance Action</th>
                  </tr>
                </thead>
                <tbody>
                  {classStudents.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-4 text-muted small">
                        No enrolled students found in {selectedClass}.
                      </td>
                    </tr>
                  ) : (
                    classStudents.map((s) => {
                      const currentStatus = attendanceRecords[s.id] || "Present";
                      return (
                        <tr key={s.id}>
                          <td className="ps-3 fw-semibold text-secondary font-monospace small">#{s.rollNo}</td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={s.avatar}
                                alt={s.name}
                                className="rounded-circle border"
                                style={{ width: "32px", height: "32px", objectFit: "cover" }}
                              />
                              <div>
                                <div className="fw-semibold text-dark small">{s.name}</div>
                                <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                                  {s.id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-center">
                            <div className="btn-group btn-group-sm" role="group">
                              {["Present", "Absent", "Late", "Excused"].map((st) => (
                                <button
                                  key={st}
                                  type="button"
                                  onClick={() => handleStatusChange(s.id, st)}
                                  className={`btn ${
                                    currentStatus === st
                                      ? st === "Present"
                                        ? "btn-success"
                                        : st === "Absent"
                                        ? "btn-danger"
                                        : st === "Late"
                                        ? "btn-warning"
                                        : "btn-info text-white"
                                      : "btn-outline-secondary"
                                  }`}
                                  style={{ minWidth: "55px", fontSize: "0.74rem" }}
                                >
                                  {st[0]}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Biometric / RFID Gate Reader Simulator */}
        <div className="col-lg-5">
          <div className="card border rounded-3 p-4 bg-white mb-4 shadow-xs">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 className="fw-bold mb-0 text-dark small">Smart Gate RFID Terminal Simulator</h6>
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small">Sensor Online</span>
            </div>
            <p className="text-muted small mb-3">
              Simulate high-frequency smart ID badge authentication at the main campus gate turnstiles:
            </p>

            {/* Tap Terminal Visualizer */}
            <div
              className={`p-4 rounded-3 text-center mb-3 border transition-all ${
                isScanning ? "bg-primary-subtle border-primary" : "bg-slate-50 border-dashed"
              }`}
            >
              <div className="mb-2 text-primary">
                <IconCreditCard size={32} />
              </div>
              <h6 className="fw-bold mb-1 text-dark small">
                {isScanning ? "Authenticating RFID Token..." : "Turnstile Gate Scanner #01"}
              </h6>
              <span className="small text-muted" style={{ fontSize: "0.75rem" }}>
                Hold smart student badge to optical sensor
              </span>
            </div>

            {/* Student Picker for Simulator */}
            <div className="mb-3">
              <label className="form-label small fw-medium text-muted" style={{ fontSize: "0.78rem" }}>
                Select Student Badge to Authenticate
              </label>
              <select
                className="form-select form-select-sm rounded-2"
                value={rfidStudentId}
                onChange={(e) => setRfidStudentId(e.target.value)}
              >
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    #{s.rollNo} - {s.name} ({s.grade}-{s.section})
                  </option>
                ))}
              </select>
            </div>

            <button
              className="btn btn-sm btn-primary w-100 rounded-2 fw-medium shadow-xs mb-3 py-2"
              onClick={handleSimulateCardTap}
              disabled={isScanning}
            >
              {isScanning ? "Verifying Credentials..." : "Authenticate Student RFID Badge at Gate"}
            </button>

            {tapFeedback && (
              <div className="alert alert-success small py-2 rounded-2 mb-3" style={{ fontSize: "0.8rem" }}>
                {tapFeedback.message}
              </div>
            )}

            {/* Parent SMS Outbox Log */}
            <h6 className="fw-bold text-dark small mt-3 mb-2" style={{ fontSize: "0.8rem" }}>
              Automated Guardian SMS Outbox Dispatch:
            </h6>
            <div className="sms-feed overflow-auto p-2 bg-slate-50 border rounded-2" style={{ maxHeight: "200px" }}>
              {smsQueue.length === 0 ? (
                <p className="text-muted small text-center mb-0 py-2">No SMS notifications dispatched yet.</p>
              ) : (
                smsQueue.slice(0, 5).map((sms) => (
                  <div key={sms.id} className="bg-white p-2 rounded-2 border shadow-xs mb-2">
                    <div className="d-flex justify-content-between text-muted mb-1" style={{ fontSize: "0.72rem" }}>
                      <span className="fw-medium">To: {sms.to}</span>
                      <span className="font-monospace">{sms.time}</span>
                    </div>
                    <p className="mb-0 text-dark font-monospace" style={{ fontSize: "0.75rem" }}>{sms.text}</p>
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
