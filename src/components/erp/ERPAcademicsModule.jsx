import React, { useState } from "react";
import { updateStudentMarks } from "../../services/erpStorage";
import { IconAcademics, IconCalendar, IconFileText, IconPrinter, IconSchool } from "./ERPIcons";

export default function ERPAcademicsModule({ erpData, onRefresh }) {
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [selectedTerm, setSelectedTerm] = useState("term1");
  const [activeSubTab, setActiveSubTab] = useState("gradebook"); // "gradebook" | "timetable"
  const [reportCardStudent, setReportCardStudent] = useState(null);

  const students = erpData.students || [];
  const timetable = erpData.timetable[selectedClass] || [];
  const classStudents = students.filter((s) => `${s.grade}-${s.section}` === selectedClass);

  const subjectsList = ["Mathematics", "Science", "English", "Social Studies", "AI & Robotics"];

  const getGradeInfo = (percentage) => {
    if (percentage >= 90) return { grade: "A+", points: 4.0, remarks: "Outstanding Performance" };
    if (percentage >= 80) return { grade: "A", points: 3.7, remarks: "Very Good" };
    if (percentage >= 70) return { grade: "B+", points: 3.2, remarks: "Good, Consistent Effort" };
    if (percentage >= 60) return { grade: "B", points: 2.8, remarks: "Above Average" };
    if (percentage >= 50) return { grade: "C", points: 2.0, remarks: "Needs Improvement" };
    return { grade: "F", points: 0.0, remarks: "Remedial Attention Required" };
  };

  const handleScoreEdit = (studentId, subject, val) => {
    const score = Math.max(0, Math.min(100, Number(val) || 0));
    updateStudentMarks(studentId, selectedTerm, subject, score);
    onRefresh();
  };

  return (
    <div className="erp-academics-module animate-fade-in">
      {/* Header & Controls */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Academics, Master Timetable & Term Gradebook</h5>
            <p className="text-muted small mb-0">
              Manage weekly institutional schedules, gradebook evaluations, and generate formal CBSE/ICSE report cards.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group p-1 bg-slate-100 rounded-2 border">
              <button
                type="button"
                className={`btn btn-sm rounded-2 px-3 fw-medium d-flex align-items-center gap-2 ${
                  activeSubTab === "gradebook" ? "btn-primary shadow-xs" : "btn-light text-secondary border-0"
                }`}
                onClick={() => setActiveSubTab("gradebook")}
              >
                <IconAcademics size={15} />
                <span>Term Gradebook</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm rounded-2 px-3 fw-medium d-flex align-items-center gap-2 ${
                  activeSubTab === "timetable" ? "btn-primary shadow-xs" : "btn-light text-secondary border-0"
                }`}
                onClick={() => setActiveSubTab("timetable")}
              >
                <IconCalendar size={15} />
                <span>Weekly Schedule</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <div className="row g-3 align-items-center border-top pt-3">
          <div className="col-md-4 col-sm-6">
            <label className="form-label small text-muted mb-1 fw-medium" style={{ fontSize: "0.78rem" }}>Classroom</label>
            <select
              className="form-select form-select-sm rounded-2"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="Grade 10-A">Grade 10 - Section A</option>
              <option value="Grade 10-B">Grade 10 - Section B</option>
              <option value="Grade 9-A">Grade 9 - Section A</option>
              <option value="Grade 11-A">Grade 11 - Section A</option>
              <option value="Grade 12-A">Grade 12 - Section A</option>
            </select>
          </div>

          {activeSubTab === "gradebook" && (
            <div className="col-md-4 col-sm-6">
              <label className="form-label small text-muted mb-1 fw-medium" style={{ fontSize: "0.78rem" }}>Evaluation Term</label>
              <select
                className="form-select form-select-sm rounded-2"
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
              >
                <option value="term1">Term 1 - Mid-Year Evaluation</option>
                <option value="term2">Term 2 - Final Assessment</option>
              </select>
            </div>
          )}

          <div className="col-md-4 text-md-end">
            <span className="badge bg-slate-100 text-slate-700 border px-3 py-2 rounded-2 small fw-medium">
              Academic Session: <strong>{erpData.schoolInfo.academicYear}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Subtab 1: Gradebook */}
      {activeSubTab === "gradebook" && (
        <div className="card border rounded-3 overflow-hidden bg-white mb-4 shadow-xs">
          <div className="card-header bg-light border-bottom py-3 d-flex justify-content-between align-items-center">
            <h6 className="fw-bold mb-0 text-dark small">
              Marks Evaluation Grid: {selectedClass} ({selectedTerm.toUpperCase()})
            </h6>
            <span className="badge bg-slate-100 text-slate-700 border small">Live Marks Editor</span>
          </div>

          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light small border-bottom">
                <tr>
                  <th className="ps-3 text-muted fw-semibold">Roll</th>
                  <th className="text-muted fw-semibold">Student</th>
                  {subjectsList.map((sub) => (
                    <th key={sub} className="text-center text-muted fw-semibold" style={{ minWidth: "90px" }}>
                      {sub} (100)
                    </th>
                  ))}
                  <th className="text-center text-muted fw-semibold">Total (500)</th>
                  <th className="text-center text-muted fw-semibold">%</th>
                  <th className="text-center text-muted fw-semibold">Grade</th>
                  <th className="text-end pe-4 text-muted fw-semibold">Report Card</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-4 text-muted small">
                      No student records found in {selectedClass}.
                    </td>
                  </tr>
                ) : (
                  classStudents.map((s) => {
                    const marks = s.marks?.[selectedTerm] || {};
                    const totalMarks = subjectsList.reduce((acc, sub) => acc + (marks[sub] || 0), 0);
                    const percentage = Math.round((totalMarks / (subjectsList.length * 100)) * 100);
                    const gradeInfo = getGradeInfo(percentage);

                    return (
                      <tr key={s.id}>
                        <td className="ps-3 fw-semibold text-secondary font-monospace small">#{s.rollNo}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <img
                              src={s.avatar}
                              alt={s.name}
                              className="rounded-circle border"
                              style={{ width: "30px", height: "30px", objectFit: "cover" }}
                            />
                            <div className="fw-semibold small text-dark">{s.name}</div>
                          </div>
                        </td>
                        {subjectsList.map((sub) => (
                          <td key={sub} className="text-center">
                            <input
                              type="number"
                              min="0"
                              max="100"
                              className="form-control form-control-sm text-center mx-auto rounded-2"
                              style={{ width: "65px", fontSize: "0.82rem" }}
                              value={marks[sub] !== undefined ? marks[sub] : 85}
                              onChange={(e) => handleScoreEdit(s.id, sub, e.target.value)}
                            />
                          </td>
                        ))}
                        <td className="text-center fw-semibold text-dark small">{totalMarks}</td>
                        <td className="text-center fw-semibold text-primary small">{percentage}%</td>
                        <td className="text-center">
                          <span
                            className={`badge rounded-1 ${
                              percentage >= 80
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : percentage >= 60
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                            style={{ fontSize: "0.75rem" }}
                          >
                            {gradeInfo.grade} ({gradeInfo.points})
                          </span>
                        </td>
                        <td className="text-end pe-4">
                          <button
                            className="btn btn-sm btn-outline-secondary rounded-2 px-3 fw-medium"
                            style={{ fontSize: "0.78rem" }}
                            onClick={() => setReportCardStudent(s)}
                          >
                            Generate Card
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Subtab 2: Timetable Matrix */}
      {activeSubTab === "timetable" && (
        <div className="card border rounded-3 overflow-hidden bg-white mb-4 shadow-xs">
          <div className="card-header bg-light border-bottom py-3">
            <h6 className="fw-bold mb-0 text-dark small">
              Institutional Weekly Schedule: {selectedClass}
            </h6>
          </div>

          <div className="table-responsive p-3">
            <table className="table table-bordered align-middle text-center mb-0 small">
              <thead className="table-light">
                <tr>
                  <th style={{ width: "110px" }} className="text-muted fw-semibold">Day</th>
                  <th className="text-muted fw-semibold">P1 (08:30-09:15)</th>
                  <th className="text-muted fw-semibold">P2 (09:20-10:05)</th>
                  <th className="text-muted fw-semibold">P3 (10:10-10:55)</th>
                  <th className="bg-slate-100 text-muted fw-semibold" style={{ width: "70px" }}>Break</th>
                  <th className="text-muted fw-semibold">P4 (11:35-12:20)</th>
                  <th className="text-muted fw-semibold">P5 (12:25-01:10)</th>
                  <th className="text-muted fw-semibold">P6 (01:15-02:00)</th>
                </tr>
              </thead>
              <tbody>
                {timetable.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-4 text-muted small">
                      No schedule configured for {selectedClass}.
                    </td>
                  </tr>
                ) : (
                  timetable.map((dayPlan) => (
                    <tr key={dayPlan.day}>
                      <td className="fw-semibold bg-slate-50 text-dark">{dayPlan.day}</td>
                      {dayPlan.periods.map((p, idx) => {
                        if (p.subject === "Break") {
                          return (
                            <td key={idx} className="bg-slate-100 text-muted small">
                              Recess
                            </td>
                          );
                        }
                        return (
                          <td key={idx} className="p-2 hover-cell">
                            <div className="fw-semibold text-dark" style={{ fontSize: "0.82rem" }}>{p.subject}</div>
                            <div className="text-muted" style={{ fontSize: "0.72rem" }}>
                              {p.teacher}
                            </div>
                            <span className="badge bg-slate-100 text-slate-600 border mt-1" style={{ fontSize: "0.68rem" }}>
                              {p.room}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Printable Official Report Card Modal */}
      {reportCardStudent && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border rounded-3 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom py-3 bg-light no-print">
                <h6 className="modal-title fw-bold text-dark mb-0">Official Student Report Card Preview</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setReportCardStudent(null)}
                ></button>
              </div>

              {/* Printable Document Container */}
              <div className="modal-body p-4 p-md-5 print-document-container bg-white" id="printable-report-card">
                {/* School Header */}
                <div className="text-center border-bottom pb-4 mb-4">
                  <div className="d-inline-flex p-2 bg-slate-100 rounded-2 text-primary mb-2">
                    <IconSchool size={28} />
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
                    <span className="badge bg-primary px-3 py-2 rounded-1 small fw-semibold">
                      OFFICIAL ACADEMIC PROGRESS REPORT - {selectedTerm === "term1" ? "TERM 1 MID-YEAR" : "TERM 2 ANNUAL"}
                    </span>
                  </div>
                </div>

                {/* Student Info Box */}
                <div className="row g-3 p-3 bg-slate-50 rounded-2 mb-4 small border">
                  <div className="col-sm-6">
                    <div>
                      <span className="text-muted">Student Name:</span> <strong>{reportCardStudent.name}</strong>
                    </div>
                    <div>
                      <span className="text-muted">Admission / ID:</span> <span className="font-monospace">{reportCardStudent.id}</span>
                    </div>
                    <div>
                      <span className="text-muted">Class & Section:</span> {reportCardStudent.grade} - {reportCardStudent.section}
                    </div>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div>
                      <span className="text-muted">Roll Number:</span> #{reportCardStudent.rollNo}
                    </div>
                    <div>
                      <span className="text-muted">Guardian Name:</span> {reportCardStudent.parentName}
                    </div>
                    <div>
                      <span className="text-muted">Academic Year:</span> {erpData.schoolInfo.academicYear}
                    </div>
                  </div>
                </div>

                {/* Marks Table */}
                <table className="table table-bordered align-middle text-center small mb-4">
                  <thead className="table-light">
                    <tr>
                      <th className="text-start ps-3 text-muted fw-semibold">Subject Name</th>
                      <th className="text-muted fw-semibold">Max Marks</th>
                      <th className="text-muted fw-semibold">Marks Obtained</th>
                      <th className="text-muted fw-semibold">Grade</th>
                      <th className="text-muted fw-semibold">Faculty Remark</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectsList.map((sub) => {
                      const score = reportCardStudent.marks?.[selectedTerm]?.[sub] || 85;
                      const gInfo = getGradeInfo(score);
                      return (
                        <tr key={sub}>
                          <td className="text-start ps-3 fw-semibold text-dark">{sub}</td>
                          <td>100</td>
                          <td className="fw-bold">{score}</td>
                          <td>
                            <span className="badge bg-slate-100 text-slate-800 border">{gInfo.grade}</span>
                          </td>
                          <td className="text-muted">{gInfo.remarks}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Overall Summary Calculation */}
                {(() => {
                  const marks = reportCardStudent.marks?.[selectedTerm] || {};
                  const total = subjectsList.reduce((acc, sub) => acc + (marks[sub] || 0), 0);
                  const pct = Math.round((total / (subjectsList.length * 100)) * 100);
                  const overallGrade = getGradeInfo(pct);

                  return (
                    <div className="row g-3 p-3 border rounded-2 mb-4 text-center small bg-slate-50">
                      <div className="col-3">
                        <span className="text-muted d-block">Grand Total</span>
                        <strong className="fs-6 text-dark">{total} / 500</strong>
                      </div>
                      <div className="col-3">
                        <span className="text-muted d-block">Aggregate Score</span>
                        <strong className="fs-6 text-primary">{pct}%</strong>
                      </div>
                      <div className="col-3">
                        <span className="text-muted d-block">Cumulative GPA</span>
                        <strong className="fs-6 text-success">{overallGrade.points} / 4.0</strong>
                      </div>
                      <div className="col-3">
                        <span className="text-muted d-block">Attendance Standing</span>
                        <strong className="fs-6 text-dark">{reportCardStudent.attendance}%</strong>
                      </div>
                    </div>
                  );
                })()}

                {/* Signatures */}
                <div className="row mt-5 pt-4 text-center small">
                  <div className="col-4">
                    <div className="border-bottom pb-1 mb-2 font-monospace">Mrs. Priya Sharma</div>
                    <span className="text-muted">Class Mentor Signature</span>
                  </div>
                  <div className="col-4">
                    <div className="border-bottom pb-1 mb-2 font-monospace">
                      Verified & Sealed
                    </div>
                    <span className="text-muted">Registrar Stamp</span>
                  </div>
                  <div className="col-4">
                    <div className="border-bottom pb-1 mb-2 font-monospace">Dr. Evelyn Vance</div>
                    <span className="text-muted">Principal Signature</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="modal-footer border-top py-2 bg-light no-print">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-2 px-3"
                  onClick={() => setReportCardStudent(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary rounded-2 px-4 fw-medium d-flex align-items-center gap-2"
                  onClick={() => window.print()}
                >
                  <IconPrinter size={15} />
                  <span>Print Official Report Card</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
