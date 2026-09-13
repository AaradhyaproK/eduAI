import React from "react";
import {
  IconStudents,
  IconStaff,
  IconAttendance,
  IconFinance,
  IconTransport,
  IconLibrary,
  IconAcademics,
  IconNotice,
  IconShield,
  IconPlus,
  IconCreditCard,
  IconCalendar,
  IconBus
} from "./ERPIcons";

export default function ERPDashboardOverview({ erpData, setActiveTab, onOpenAdmission }) {
  const stats = erpData.stats;
  const auditLogs = erpData.auditLogs || [];

  return (
    <div className="erp-dashboard-overview animate-fade-in">
      {/* Top Institutional KPI Row */}
      <div className="row g-3 mb-4">
        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border rounded-3 p-3 h-100 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-medium">Total Enrollment</span>
              <div className="text-primary p-1 bg-primary-subtle rounded-1">
                <IconStudents size={16} />
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{erpData.students.length + 1240}</h3>
            <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small py-0 px-2 fw-medium">
              +2.4% this session
            </span>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border rounded-3 p-3 h-100 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-medium">Academic Staff</span>
              <div className="text-info p-1 bg-info-subtle rounded-1">
                <IconStaff size={16} />
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{erpData.staff.length + 79}</h3>
            <span className="text-muted small">8 departments</span>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border rounded-3 p-3 h-100 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-medium">Daily Attendance</span>
              <div className="text-success p-1 bg-success-subtle rounded-1">
                <IconAttendance size={16} />
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{stats.todayAttendanceRate}</h3>
            <span className="text-success small fw-medium">Verified via RFID</span>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border rounded-3 p-3 h-100 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-medium">Fee Collection</span>
              <div className="text-warning p-1 bg-warning-subtle rounded-1">
                <IconFinance size={16} />
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{stats.feeCollectionRate}</h3>
            <span className="text-muted small">Q2 Fiscal Recovery</span>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border rounded-3 p-3 h-100 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-medium">Active Fleet</span>
              <div className="text-primary p-1 bg-primary-subtle rounded-1">
                <IconTransport size={16} />
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{erpData.transportRoutes.length} / 4</h3>
            <span className="badge bg-blue-50 text-blue-700 border border-blue-200 small py-0 px-2 fw-medium">
              GPS Telemetry On
            </span>
          </div>
        </div>

        <div className="col-lg-2 col-md-4 col-sm-6">
          <div className="card border rounded-3 p-3 h-100 bg-white shadow-xs">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted small fw-medium">Library Resources</span>
              <div className="text-secondary p-1 bg-secondary-subtle rounded-1">
                <IconLibrary size={16} />
              </div>
            </div>
            <h3 className="fw-bold mb-1 text-dark">{stats.libraryBooks}</h3>
            <span className="text-muted small">Indexed titles</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Command Workflows & Real-time Audit Stream */}
      <div className="row g-4 mb-4">
        {/* Quick Command Launcher */}
        <div className="col-lg-8">
          <div className="card border rounded-3 p-4 h-100 bg-white shadow-xs">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold mb-0 text-dark">Institutional Action Center</h6>
                <p className="text-muted small mb-0">Direct access to core administrative and academic operations</p>
              </div>
              <span className="badge bg-slate-100 text-slate-700 border px-2 py-1 small">Active Workspace</span>
            </div>

            <div className="row g-3">
              <div className="col-md-4 col-sm-6">
                <button
                  onClick={onOpenAdmission}
                  className="btn btn-outline-light text-dark border p-3 rounded-3 w-100 text-start h-100 shadow-xs hover-elevate d-flex flex-column justify-content-between"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="p-2 bg-primary-subtle text-primary rounded-2">
                      <IconPlus size={18} />
                    </span>
                    <span className="badge bg-light text-muted border small">Enrollment</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-dark small mb-1">Admit New Student</span>
                    <span className="text-muted small d-block" style={{ fontSize: "0.78rem" }}>
                      Register student profile, parent records & assign roll ID
                    </span>
                  </div>
                </button>
              </div>

              <div className="col-md-4 col-sm-6">
                <button
                  onClick={() => setActiveTab("attendance")}
                  className="btn btn-outline-light text-dark border p-3 rounded-3 w-100 text-start h-100 shadow-xs hover-elevate d-flex flex-column justify-content-between"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="p-2 bg-success-subtle text-success rounded-2">
                      <IconAttendance size={18} />
                    </span>
                    <span className="badge bg-light text-muted border small">Register</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-dark small mb-1">Attendance & Smart Gate</span>
                    <span className="text-muted small d-block" style={{ fontSize: "0.78rem" }}>
                      Take class roll call or simulate RFID turnstile check-in
                    </span>
                  </div>
                </button>
              </div>

              <div className="col-md-4 col-sm-6">
                <button
                  onClick={() => setActiveTab("finance")}
                  className="btn btn-outline-light text-dark border p-3 rounded-3 w-100 text-start h-100 shadow-xs hover-elevate d-flex flex-column justify-content-between"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="p-2 bg-warning-subtle text-warning rounded-2">
                      <IconCreditCard size={18} />
                    </span>
                    <span className="badge bg-light text-muted border small">Bursar</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-dark small mb-1">Fee Collection Counter</span>
                    <span className="text-muted small d-block" style={{ fontSize: "0.78rem" }}>
                      Collect tuition fees & generate official GST receipts
                    </span>
                  </div>
                </button>
              </div>

              <div className="col-md-4 col-sm-6">
                <button
                  onClick={() => setActiveTab("academics")}
                  className="btn btn-outline-light text-dark border p-3 rounded-3 w-100 text-start h-100 shadow-xs hover-elevate d-flex flex-column justify-content-between"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="p-2 bg-info-subtle text-info rounded-2">
                      <IconAcademics size={18} />
                    </span>
                    <span className="badge bg-light text-muted border small">Evaluation</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-dark small mb-1">Gradebook & Report Card</span>
                    <span className="text-muted small d-block" style={{ fontSize: "0.78rem" }}>
                      Input exam marks & print official academic progress cards
                    </span>
                  </div>
                </button>
              </div>

              <div className="col-md-4 col-sm-6">
                <button
                  onClick={() => setActiveTab("transport")}
                  className="btn btn-outline-light text-dark border p-3 rounded-3 w-100 text-start h-100 shadow-xs hover-elevate d-flex flex-column justify-content-between"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="p-2 bg-secondary-subtle text-secondary rounded-2">
                      <IconBus size={18} />
                    </span>
                    <span className="badge bg-light text-muted border small">Telemetry</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-dark small mb-1">Live Bus Fleet Tracker</span>
                    <span className="text-muted small d-block" style={{ fontSize: "0.78rem" }}>
                      Track vehicle GPS waypoints, speed & broadcast delay alerts
                    </span>
                  </div>
                </button>
              </div>

              <div className="col-md-4 col-sm-6">
                <button
                  onClick={() => setActiveTab("notices")}
                  className="btn btn-outline-light text-dark border p-3 rounded-3 w-100 text-start h-100 shadow-xs hover-elevate d-flex flex-column justify-content-between"
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className="p-2 bg-danger-subtle text-danger rounded-2">
                      <IconNotice size={18} />
                    </span>
                    <span className="badge bg-light text-muted border small">Broadcast</span>
                  </div>
                  <div>
                    <span className="fw-bold d-block text-dark small mb-1">Publish Circular</span>
                    <span className="text-muted small d-block" style={{ fontSize: "0.78rem" }}>
                      Issue urgent circulars to parents, teachers & students
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Real-time Institutional Audit Stream */}
        <div className="col-lg-4">
          <div className="card border rounded-3 p-4 h-100 bg-white shadow-xs">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h6 className="fw-bold mb-0 text-dark">Institutional Audit Stream</h6>
                <span className="text-muted small">Automated transactional ledger</span>
              </div>
              <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small">Online</span>
            </div>

            <div className="audit-feed-list overflow-auto pe-1" style={{ maxHeight: "310px" }}>
              {auditLogs.length === 0 ? (
                <p className="text-muted small text-center py-4">No audit events logged yet.</p>
              ) : (
                auditLogs.map((log) => (
                  <div key={log.id} className="d-flex align-items-start gap-2 mb-3 pb-2 border-bottom">
                    <span className="badge bg-slate-100 text-slate-700 border small font-monospace" style={{ fontSize: "0.72rem" }}>
                      {log.timestamp}
                    </span>
                    <span className="small text-dark" style={{ fontSize: "0.82rem", lineHeight: "1.4" }}>
                      {log.message}
                    </span>
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
