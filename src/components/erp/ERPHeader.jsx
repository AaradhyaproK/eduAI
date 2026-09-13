import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  IconSchool,
  IconDownload,
  IconUpload,
  IconRefresh,
  IconSearch,
  IconArrowLeft,
  IconClock,
  IconShield,
  IconBell
} from "./ERPIcons";
import { resetERPState, exportERPState, importERPState } from "../../services/erpStorage";

export default function ERPHeader({
  activeRole,
  setActiveRole,
  erpData,
  onRefresh,
  searchQuery,
  setSearchQuery
}) {
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [importStatus, setImportStatus] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const roles = [
    { id: "admin", label: "Principal & Admin", subtitle: "Executive Control" },
    { id: "teacher", label: "Class Faculty", subtitle: "Grade 10-A Mentor" },
    { id: "student", label: "Student Portal", subtitle: "Aarav Patel (101)" },
    { id: "parent", label: "Parent Desk", subtitle: "Guardian Access" },
    { id: "finance", label: "Accounts & Bursar", subtitle: "Fee Counter" },
    { id: "library", label: "Library Catalog", subtitle: "Circulation Desk" },
    { id: "transport", label: "Fleet Operations", subtitle: "GPS Telemetry" }
  ];

  const handleReset = () => {
    if (window.confirm("Confirm: Reset all institutional simulation state to factory demo records?")) {
      resetERPState();
      onRefresh();
    }
  };

  const handleExport = () => {
    const dataStr = exportERPState();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `greenwood-academy-erp-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const res = importERPState(jsonInput);
    if (res.success) {
      setImportStatus({ success: true, message: "Simulation state successfully restored." });
      setTimeout(() => {
        setShowBackupModal(false);
        setImportStatus(null);
        setJsonInput("");
        onRefresh();
      }, 900);
    } else {
      setImportStatus({ success: false, message: res.error || "Failed to parse snapshot format." });
    }
  };

  return (
    <header className="erp-top-command-center mb-4">
      {/* Upper Utility Ribbon */}
      <div className="bg-white border rounded-3 p-3 mb-3 shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          {/* Left: Brand Identity & Link to Portal */}
          <div className="d-flex align-items-center gap-3">
            <Link
              to="/dashboard"
              className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-2 rounded-2 fw-medium text-decoration-none"
              title="Return to Student LMS Learning Portal"
            >
              <IconArrowLeft size={15} />
              <span>Back to LMS Portal</span>
            </Link>

            <div className="vr d-none d-md-block my-1 text-muted"></div>

            <div className="d-flex align-items-center gap-2">
              <div className="bg-primary text-white p-2 rounded-2 d-flex align-items-center justify-content-center shadow-xs">
                <IconSchool size={20} />
              </div>
              <div>
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-bold text-dark fs-6 tracking-tight">
                    {erpData.schoolInfo.name}
                  </span>
                  <span className="badge bg-slate-100 text-slate-700 border small py-1 px-2 fw-semibold">
                    ERP Enterprise Edition
                  </span>
                </div>
                <div className="text-muted small" style={{ fontSize: "0.8rem" }}>
                  Affiliation: {erpData.schoolInfo.affiliation} | Session {erpData.schoolInfo.academicYear}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Operational Telemetry & State Controls */}
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="d-flex align-items-center gap-2 px-3 py-1 bg-slate-50 border rounded-2 text-muted small">
              <IconClock size={14} className="text-primary" />
              <span className="font-monospace text-dark fw-medium">{currentTime}</span>
            </div>

            <button
              onClick={handleExport}
              className="btn btn-sm btn-light border d-flex align-items-center gap-1 text-secondary fw-medium rounded-2"
              title="Download full ERP snapshot as JSON"
            >
              <IconDownload size={14} />
              <span>Export</span>
            </button>

            <button
              onClick={() => setShowBackupModal(true)}
              className="btn btn-sm btn-light border d-flex align-items-center gap-1 text-secondary fw-medium rounded-2"
              title="Load saved snapshot"
            >
              <IconUpload size={14} />
              <span>Import</span>
            </button>

            <button
              onClick={handleReset}
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 fw-medium rounded-2"
              title="Reset state to initial realistic demo seed"
            >
              <IconRefresh size={14} />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role Navigation Toolbar */}
      <div className="bg-white border rounded-3 p-2 shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          {/* Persona Pills */}
          <div className="d-flex align-items-center gap-1 overflow-auto role-pills-bar py-1">
            <span className="text-muted small fw-semibold px-2 text-uppercase" style={{ fontSize: "0.72rem", letterSpacing: "0.05em" }}>
              Persona:
            </span>
            {roles.map((r) => {
              const isSelected = activeRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setActiveRole(r.id)}
                  className={`btn btn-sm rounded-2 text-nowrap transition-all text-start px-3 py-1 ${
                    isSelected
                      ? "btn-primary shadow-xs"
                      : "btn-light bg-transparent text-secondary border-0"
                  }`}
                  style={{ fontSize: "0.82rem" }}
                >
                  <span className="fw-semibold d-block leading-tight">{r.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="d-flex align-items-center gap-2 ms-auto" style={{ minWidth: "240px" }}>
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <IconSearch size={14} />
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search students, staff, IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Snapshot Backup / Restore Modal */}
      {showBackupModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 border shadow-lg">
              <div className="modal-header border-bottom py-3">
                <h6 className="modal-title fw-bold text-dark mb-0">Restore ERP Snapshot</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowBackupModal(false);
                    setImportStatus(null);
                  }}
                ></button>
              </div>
              <div className="modal-body p-4">
                <p className="text-muted small mb-3">
                  Paste JSON configuration to restore institutional records, students, fee ledger, and attendance history.
                </p>
                <textarea
                  className="form-control font-monospace small"
                  rows="7"
                  placeholder="Paste ERP snapshot JSON here..."
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                ></textarea>
                {importStatus && (
                  <div
                    className={`alert mt-3 small py-2 ${
                      importStatus.success ? "alert-success" : "alert-danger"
                    }`}
                  >
                    {importStatus.message}
                  </div>
                )}
              </div>
              <div className="modal-footer border-top py-2">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-2"
                  onClick={() => setShowBackupModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary rounded-2 fw-semibold"
                  onClick={handleImport}
                  disabled={!jsonInput.trim()}
                >
                  Load Snapshot
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
