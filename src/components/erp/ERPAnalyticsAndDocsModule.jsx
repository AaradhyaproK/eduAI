import React, { useState } from "react";
import {
  IconTrendingUp,
  IconAlertTriangle,
  IconFileCheck,
  IconAward,
  IconPrinter,
  IconShield,
  IconSchool,
  IconCheck,
  IconBookOpen
} from "./ERPIcons";

export default function ERPAnalyticsAndDocsModule({ erpData }) {
  const [selectedSubTab, setSelectedSubTab] = useState("ai_sentinel"); // "ai_sentinel" | "doc_center" | "erp_manual"
  const [selectedDocStudent, setSelectedDocStudent] = useState(erpData.students[0] || null);
  const [docType, setDocType] = useState("bonafide"); // "tc" | "bonafide" | "merit"
  const [activeIntervention, setActiveIntervention] = useState(null);

  const students = erpData.students || [];

  // Compute AI Risk Diagnostic for each student
  const studentDiagnostics = students.map((s) => {
    let riskScore = 0;
    const reasons = [];

    if (s.attendance < 75) {
      riskScore += 40;
      reasons.push("Critical attendance deficiency (<75%)");
    } else if (s.attendance < 90) {
      riskScore += 20;
      reasons.push("Sub-optimal attendance pattern");
    }

    if (s.fee?.status === "Pending") {
      riskScore += 25;
      reasons.push("Unsettled academic fee liability");
    } else if (s.fee?.status === "Partial") {
      riskScore += 10;
      reasons.push("Partial outstanding balance");
    }

    // Exam score factor
    const marks = s.marks?.term1 || {};
    const avgScore = Object.values(marks).length
      ? Math.round(Object.values(marks).reduce((a, b) => a + b, 0) / Object.values(marks).length)
      : 85;

    if (avgScore < 70) {
      riskScore += 35;
      reasons.push("Below grade level evaluation in core subjects");
    } else if (avgScore >= 92) {
      riskScore = 0;
    }

    let status = "Stable";
    let badgeClass = "bg-slate-100 text-slate-700 border";
    if (avgScore >= 92 && s.attendance >= 94) {
      status = "Academic Scholar";
      badgeClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";
    } else if (riskScore >= 40) {
      status = "High Risk Priority";
      badgeClass = "bg-rose-50 text-rose-700 border border-rose-200";
    } else if (riskScore >= 20) {
      status = "Moderate Attention";
      badgeClass = "bg-amber-50 text-amber-700 border border-amber-200";
    }

    return {
      student: s,
      riskScore,
      status,
      badgeClass,
      avgScore,
      reasons: reasons.length ? reasons : ["Consistent performance across parameters"]
    };
  });

  const handleGenerateIntervention = (diag) => {
    setActiveIntervention({
      student: diag.student,
      status: diag.status,
      plan: [
        `Designate assigned peer mentor in core subjects (Science / Mathematics).`,
        `Schedule bi-weekly guardian briefing with Class Mentor (${diag.student.parentPhone}).`,
        diag.student.fee?.due > 0
          ? `Bursar Office: Propose 3-part flexible tuition payment restructuring plan.`
          : `Enroll in after-school AI & STEM Innovation accelerator program.`,
        `Mandatory biometric check-in confirmation at Gate Turnstile 01.`
      ]
    });
  };

  return (
    <div className="erp-analytics-and-docs animate-fade-in">
      {/* Module Navigation Ribbon */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Institutional Intelligence, Compliance & Document Center</h5>
            <p className="text-muted small mb-0">
              Predictive student performance diagnostics, official CBSE/NEP accreditation compliance, and instant certificate issuance desk.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group p-1 bg-slate-100 rounded-2 border">
              <button
                type="button"
                className={`btn btn-sm rounded-2 px-3 fw-medium d-flex align-items-center gap-2 ${
                  selectedSubTab === "ai_sentinel" ? "btn-primary shadow-xs" : "btn-light text-secondary border-0"
                }`}
                onClick={() => setSelectedSubTab("ai_sentinel")}
              >
                <IconTrendingUp size={15} />
                <span>AI Performance Sentinel</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-2 px-3 fw-medium d-flex align-items-center gap-2 ${
                  selectedSubTab === "doc_center" ? "btn-primary shadow-xs" : "btn-light text-secondary border-0"
                }`}
                onClick={() => setSelectedSubTab("doc_center")}
              >
                <IconFileCheck size={15} />
                <span>Certificate Issuance Desk</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-2 px-3 fw-medium d-flex align-items-center gap-2 ${
                  selectedSubTab === "erp_manual" ? "btn-primary shadow-xs" : "btn-light text-secondary border-0"
                }`}
                onClick={() => setSelectedSubTab("erp_manual")}
              >
                <IconBookOpen size={15} />
                <span>System Architecture Manual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SUB-VIEW 1: AI Performance Sentinel & Compliance Audit */}
      {selectedSubTab === "ai_sentinel" && (
        <div>
          {/* Institutional Compliance Scorecards */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3 col-sm-6">
              <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
                <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>
                  Institutional Accreditation Index
                </span>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <h3 className="fw-bold mb-0 text-dark">96.8 / 100</h3>
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small">Grade A++</span>
                </div>
                <span className="small text-muted" style={{ fontSize: "0.75rem" }}>CBSE & NEP 2020 Compliance Verified</span>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
                <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Faculty-to-Student Ratio</span>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <h3 className="fw-bold mb-0 text-primary">1 : 14.5</h3>
                  <span className="badge bg-blue-50 text-blue-700 border border-blue-200 small">Optimal</span>
                </div>
                <span className="small text-muted" style={{ fontSize: "0.75rem" }}>Regulatory mandate: 1:30</span>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
                <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Fleet Safety Audit</span>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <h3 className="fw-bold mb-0 text-success">100%</h3>
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small">Clear</span>
                </div>
                <span className="small text-muted" style={{ fontSize: "0.75rem" }}>Speed governors & CCTV certified</span>
              </div>
            </div>

            <div className="col-lg-3 col-sm-6">
              <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
                <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Curriculum Digitalization</span>
                <div className="d-flex align-items-baseline gap-2 mt-1">
                  <h3 className="fw-bold mb-0 text-dark">98.2%</h3>
                  <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small">Complete</span>
                </div>
                <span className="small text-muted" style={{ fontSize: "0.75rem" }}>Smartboard & AI Lab integration</span>
              </div>
            </div>
          </div>

          {/* AI Student Risk Diagnostic Table */}
          <div className="card border rounded-3 overflow-hidden bg-white mb-4 shadow-xs">
            <div className="card-header bg-light border-bottom py-3 d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-0 text-dark small">AI Early Warning Diagnostic Sentinel</h6>
                <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
                  Synthesizes daily attendance telemetry, examination trajectories, and bursar payment records
                </span>
              </div>
              <span className="badge bg-slate-100 text-slate-700 border small">Predictive Modeling Engine</span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light small border-bottom">
                  <tr>
                    <th className="ps-3 text-muted fw-semibold">Roll No</th>
                    <th className="text-muted fw-semibold">Student Profile</th>
                    <th className="text-muted fw-semibold">Attendance</th>
                    <th className="text-muted fw-semibold">Academic Avg</th>
                    <th className="text-muted fw-semibold">Diagnostic Assessment</th>
                    <th className="text-muted fw-semibold">Identified Risk Factors</th>
                    <th className="text-end pe-4 text-muted fw-semibold">AI Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentDiagnostics.map((diag) => (
                    <tr key={diag.student.id}>
                      <td className="ps-3 fw-semibold text-secondary font-monospace small">#{diag.student.rollNo}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <img
                            src={diag.student.avatar}
                            alt={diag.student.name}
                            className="rounded-circle border"
                            style={{ width: "32px", height: "32px", objectFit: "cover" }}
                          />
                          <div>
                            <div className="fw-semibold small text-dark">{diag.student.name}</div>
                            <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                              {diag.student.grade} - {diag.student.section}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`small fw-semibold ${
                            diag.student.attendance >= 90 ? "text-success" : "text-warning"
                          }`}
                        >
                          {diag.student.attendance}%
                        </span>
                      </td>
                      <td className="fw-medium text-dark small">{diag.avgScore}%</td>
                      <td>
                        <span className={`badge rounded-1 small ${diag.badgeClass}`} style={{ fontSize: "0.75rem" }}>
                          {diag.status}
                        </span>
                      </td>
                      <td>
                        <span className="text-muted small" style={{ fontSize: "0.76rem" }}>
                          {diag.reasons.join(", ")}
                        </span>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary rounded-2 px-3 fw-medium"
                          style={{ fontSize: "0.78rem" }}
                          onClick={() => handleGenerateIntervention(diag)}
                        >
                          AI Prescription
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Intervention Modal */}
          {activeIntervention && (
            <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border rounded-3 shadow-lg">
                  <div className="modal-header border-bottom py-3 bg-primary text-white">
                    <h6 className="modal-title fw-bold mb-0">Automated Remediation & Intervention Protocol</h6>
                    <button
                      type="button"
                      className="btn-close btn-close-white"
                      onClick={() => setActiveIntervention(null)}
                    ></button>
                  </div>
                  <div className="modal-body p-4">
                    <div className="p-3 bg-slate-50 border rounded-2 mb-3 small">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="text-muted">Target Student:</span>
                        <strong className="text-dark">
                          {activeIntervention.student.name} (Roll #{activeIntervention.student.rollNo})
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted">Status Classification:</span>
                        <span className="fw-bold text-primary">{activeIntervention.status}</span>
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark small mb-2">Automated Intervention Recommendations:</h6>
                    <ul className="list-group list-group-flush border rounded-2 small mb-3">
                      {activeIntervention.plan.map((item, idx) => (
                        <li key={idx} className="list-group-item py-2 d-flex align-items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-muted small mb-0" style={{ fontSize: "0.75rem" }}>
                      This protocol is automatically routed to Mrs. Priya Sharma (Class Mentor) and the Academic Dean.
                    </p>
                  </div>
                  <div className="modal-footer border-top py-2 bg-light">
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary rounded-2 px-3"
                      onClick={() => setActiveIntervention(null)}
                    >
                      Dismiss
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary rounded-2 px-3 fw-medium"
                      onClick={() => {
                        alert("Intervention directive dispatched to Class Mentor and Guardian portal.");
                        setActiveIntervention(null);
                      }}
                    >
                      Authorize Protocol
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: Official Document & Certificate Generation Desk */}
      {selectedSubTab === "doc_center" && (
        <div>
          <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
            <h6 className="fw-bold mb-2 text-dark small">Document Generation Parameters</h6>
            <div className="row g-3 align-items-end">
              <div className="col-md-5">
                <label className="form-label small fw-medium text-muted" style={{ fontSize: "0.78rem" }}>
                  Select Student Beneficiary
                </label>
                <select
                  className="form-select form-select-sm rounded-2"
                  value={selectedDocStudent?.id}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value);
                    setSelectedDocStudent(st);
                  }}
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      #{s.rollNo} - {s.name} ({s.grade}-{s.section})
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label small fw-medium text-muted" style={{ fontSize: "0.78rem" }}>
                  Document Certificate Type
                </label>
                <select
                  className="form-select form-select-sm rounded-2"
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                >
                  <option value="bonafide">Official Bonafide & Character Certificate</option>
                  <option value="tc">Institutional Transfer Certificate (TC)</option>
                  <option value="merit">Certificate of Academic Merit & Honor</option>
                </select>
              </div>

              <div className="col-md-3 text-end">
                <button
                  className="btn btn-sm btn-primary rounded-2 px-3 fw-medium d-flex align-items-center gap-2 ms-auto"
                  onClick={() => window.print()}
                >
                  <IconPrinter size={15} />
                  <span>Print Document</span>
                </button>
              </div>
            </div>
          </div>

          {/* Printable Official Document Preview */}
          {selectedDocStudent && (
            <div className="card border rounded-3 bg-white p-4 p-md-5 shadow-xs print-document-container mb-4" id="official-cert-preview">
              {/* Document Letterhead */}
              <div className="text-center border-bottom pb-4 mb-4">
                <div className="d-inline-flex p-2 bg-slate-100 rounded-2 text-primary mb-2">
                  <IconSchool size={30} />
                </div>
                <h4 className="fw-bold mb-1 text-uppercase text-dark tracking-wide">
                  {erpData.schoolInfo.name}
                </h4>
                <p className="text-muted small mb-1">
                  {erpData.schoolInfo.affiliation} | Estd. {erpData.schoolInfo.established}
                </p>
                <p className="text-muted small mb-0">
                  {erpData.schoolInfo.address} | Phone: {erpData.schoolInfo.phone}
                </p>
                <div className="mt-3">
                  <span className="badge bg-slate-900 text-white px-3 py-2 rounded-1 small fw-semibold text-uppercase">
                    {docType === "bonafide"
                      ? "Official Bonafide & Conduct Certificate"
                      : docType === "tc"
                      ? "Official School Transfer Certificate"
                      : "Certificate of Academic Excellence & Merit"}
                  </span>
                </div>
              </div>

              {/* Certificate Metadata */}
              <div className="d-flex justify-content-between text-muted small mb-4 font-monospace">
                <span>Certificate Ref: GW/CERT/2026/{selectedDocStudent.rollNo}</span>
                <span>Date of Issue: {new Date().toLocaleDateString()}</span>
              </div>

              {/* Certificate Body */}
              <div className="certificate-body py-4 px-2" style={{ lineHeight: "2.0", fontSize: "1.02rem" }}>
                {docType === "bonafide" && (
                  <p className="text-dark">
                    This is to formally certify that <strong>{selectedDocStudent.name}</strong>, Son / Daughter of{" "}
                    <strong>{selectedDocStudent.parentName}</strong>, bearing Roll Number{" "}
                    <strong>#{selectedDocStudent.rollNo}</strong> and Student Registration Number{" "}
                    <strong>{selectedDocStudent.id}</strong>, is a bonafide student of this institution currently studying in{" "}
                    <strong>{selectedDocStudent.grade} ({selectedDocStudent.section})</strong> for the Academic Session{" "}
                    <strong>{erpData.schoolInfo.academicYear}</strong>.
                    <br />
                    To the best of our administrative and faculty knowledge, his/her character and conduct have consistently been{" "}
                    <strong>Exemplary</strong>. This certificate is issued on the request of the guardian for official identification,
                    passport, visa, and scholarship verification purposes.
                  </p>
                )}

                {docType === "tc" && (
                  <div>
                    <table className="table table-bordered small">
                      <tbody>
                        <tr>
                          <td className="fw-semibold" style={{ width: "35%" }}>Name of Student</td>
                          <td>{selectedDocStudent.name}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Father / Guardian Name</td>
                          <td>{selectedDocStudent.parentName}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Date of Birth (in figures & words)</td>
                          <td>{selectedDocStudent.dob}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Class in which student last studied</td>
                          <td>{selectedDocStudent.grade} - Section {selectedDocStudent.section}</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">School / Board Annual Examination status</td>
                          <td>Passed & Promoted to next academic cohort</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Total Attendance percentage</td>
                          <td>{selectedDocStudent.attendance}% (Eligible for board clearance)</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Whether all school dues are paid</td>
                          <td>
                            {selectedDocStudent.fee?.due === 0
                              ? "Yes, all dues fully settled (No dues certificate issued)"
                              : `Outstanding dues of ₹${selectedDocStudent.fee?.due?.toLocaleString()} subject to clearance`}
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">General Conduct & Demeanor</td>
                          <td>Good and disciplined throughout enrollment</td>
                        </tr>
                        <tr>
                          <td className="fw-semibold">Reason for leaving institution</td>
                          <td>Parental relocation / Higher secondary progression</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {docType === "merit" && (
                  <div className="text-center py-4">
                    <p className="text-dark fs-5 mb-4">
                      Presented with deep institutional commendation to
                    </p>
                    <h2 className="fw-bold text-primary mb-3 text-uppercase">{selectedDocStudent.name}</h2>
                    <p className="text-dark fs-6" style={{ maxWidth: "650px", margin: "0 auto" }}>
                      In formal recognition of outstanding scholarly achievement, academic dedication, and distinguished performance in{" "}
                      <strong>{selectedDocStudent.grade}</strong> with a cumulative Grade Point Average of{" "}
                      <strong>3.8 / 4.0</strong> during the Academic Session {erpData.schoolInfo.academicYear}.
                    </p>
                  </div>
                )}
              </div>

              {/* Official Signatures & Seal */}
              <div className="row mt-5 pt-5 text-center small">
                <div className="col-4">
                  <div className="border-bottom pb-1 mb-2 font-monospace">Mrs. Priya Sharma</div>
                  <span className="text-muted">Class Mentor</span>
                </div>
                <div className="col-4">
                  <div className="border-bottom pb-1 mb-2 font-monospace">Verified & Affixed</div>
                  <span className="text-muted">Registrar Seal</span>
                </div>
                <div className="col-4">
                  <div className="border-bottom pb-1 mb-2 font-monospace">Dr. Evelyn Vance, Ph.D.</div>
                  <span className="text-muted">Principal & Head of Institution</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 3: Complete System Architecture Manual */}
      {selectedSubTab === "erp_manual" && (
        <div className="card border rounded-3 p-4 bg-white shadow-xs mb-4">
          <h5 className="fw-bold text-dark mb-2">School ERP System Architecture & Operational Manual</h5>
          <p className="text-muted small mb-4">
            Comprehensive guide to the operational workflows, technical data relationships, and governance capabilities implemented in this ERP suite.
          </p>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="p-3 bg-slate-50 border rounded-2 h-100">
                <h6 className="fw-bold text-dark small mb-2">1. Student Information System (SIS)</h6>
                <p className="text-muted small mb-2" style={{ fontSize: "0.82rem" }}>
                  <strong>Significance:</strong> Acts as the single source of truth (SSOT) for student demographics, enrollment statuses, health profiles, and parent emergency contacts.
                </p>
                <ul className="small text-muted ps-3 mb-0" style={{ fontSize: "0.8rem" }}>
                  <li>Automated Roll Number & Registration ID issuance</li>
                  <li>Multi-tiered filtering by Grade (1-12), Section (A/B/C), and Dues status</li>
                  <li>Immediate live record synchronization in local storage repository</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-slate-50 border rounded-2 h-100">
                <h6 className="fw-bold text-dark small mb-2">2. Daily Attendance & RFID Gate Telemetry</h6>
                <p className="text-muted small mb-2" style={{ fontSize: "0.82rem" }}>
                  <strong>Significance:</strong> Guarantees student safety, automated regulatory attendance auditing, and real-time parent check-in reassurance.
                </p>
                <ul className="small text-muted ps-3 mb-0" style={{ fontSize: "0.8rem" }}>
                  <li>One-click status toggle (Present, Absent, Late, Excused)</li>
                  <li>Turnstile gate optical reader simulation with NFC badge authentication</li>
                  <li>Real-time parent SMS dispatch pipeline on gate verification</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-slate-50 border rounded-2 h-100">
                <h6 className="fw-bold text-dark small mb-2">3. Academics, Master Timetable & Gradebook</h6>
                <p className="text-muted small mb-2" style={{ fontSize: "0.82rem" }}>
                  <strong>Significance:</strong> Enforces standard academic rigor, syllabus progression tracking, and formal printable CBSE/ICSE progress marksheets.
                </p>
                <ul className="small text-muted ps-3 mb-0" style={{ fontSize: "0.8rem" }}>
                  <li>Weekly period schedule matrix across 5 working days</li>
                  <li>Term-wise live grade entry with automatic percentage, GPA, and letter grades</li>
                  <li>Printable official report cards formatted for regulatory archival</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-slate-50 border rounded-2 h-100">
                <h6 className="fw-bold text-dark small mb-2">4. Bursar Finance, Fee Counter & GST Invoicing</h6>
                <p className="text-muted small mb-2" style={{ fontSize: "0.82rem" }}>
                  <strong>Significance:</strong> Manages institutional cashflow, fee recovery monitoring, multi-channel payment reconciliation, and tax compliance.
                </p>
                <ul className="small text-muted ps-3 mb-0" style={{ fontSize: "0.8rem" }}>
                  <li>Itemized breakdown: Tuition, STEM Labs, Fleet, Sports</li>
                  <li>Interactive payment gateway simulation (UPI, Card, Net Banking, Cash)</li>
                  <li>Print-ready official fee payment receipt with GSTIN verification</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-slate-50 border rounded-2 h-100">
                <h6 className="fw-bold text-dark small mb-2">5. Campus Fleet Telemetry & Live Bus GPS</h6>
                <p className="text-muted small mb-2" style={{ fontSize: "0.82rem" }}>
                  <strong>Significance:</strong> Mitigates commute risks, monitors vehicle speed governance, and keeps parents informed during road congestion.
                </p>
                <ul className="small text-muted ps-3 mb-0" style={{ fontSize: "0.8rem" }}>
                  <li>Moving road progress visualizer with scheduled stop arrivals</li>
                  <li>Speedometer telemetry and certified driver safety records</li>
                  <li>Driver emergency SOS beacon and delay broadcast simulators</li>
                </ul>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-slate-50 border rounded-2 h-100">
                <h6 className="fw-bold text-dark small mb-2">6. AI Early Warning Sentinel & Document Desk</h6>
                <p className="text-muted small mb-2" style={{ fontSize: "0.82rem" }}>
                  <strong>Significance:</strong> Proactively identifies struggling students before terminal exams and automates administrative certificate issuance.
                </p>
                <ul className="small text-muted ps-3 mb-0" style={{ fontSize: "0.8rem" }}>
                  <li>Automated risk scoring based on attendance, GPA, and dues status</li>
                  <li>Actionable remediation directives for class mentors and counselors</li>
                  <li>Official Transfer Certificate, Bonafide, and Merit Award generation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
