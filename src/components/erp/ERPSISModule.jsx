import React, { useState } from "react";
import { IconStudents, IconPlus, IconUser, IconFileText, IconSearch, IconCheck } from "./ERPIcons";
import { admitNewStudent } from "../../services/erpStorage";

export default function ERPSISModule({
  erpData,
  onRefresh,
  searchQuery,
  showAdmissionModal,
  setShowAdmissionModal
}) {
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // New Student Form State
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    grade: "Grade 10",
    section: "A",
    dob: "2010-05-15",
    bloodGroup: "B+",
    parentName: "",
    parentPhone: "",
    parentEmail: "",
    address: "",
    busRoute: "Route 01 - Blue Line",
    busStop: "Main Gate",
    initialFeePaid: "40000"
  });

  const students = erpData.students || [];

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchSearch =
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(s.rollNo).includes(searchQuery) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchGrade = selectedGrade === "All" || s.grade === selectedGrade;
    const matchSection = selectedSection === "All" || s.section === selectedSection;
    const matchFee = selectedFeeStatus === "All" || s.fee?.status === selectedFeeStatus;

    return matchSearch && matchGrade && matchSection && matchFee;
  });

  const handleAdmissionSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.parentName || !formData.parentPhone) {
      alert("Please enter full student name and primary guardian contact details.");
      return;
    }

    const res = admitNewStudent(formData);
    if (res.success) {
      alert(`Admission Confirmed!\nAssigned Roll Number: #${res.student.rollNo}\nStudent Registration ID: ${res.student.id}`);
      setShowAdmissionModal(false);
      setFormData({
        name: "",
        gender: "Male",
        grade: "Grade 10",
        section: "A",
        dob: "2010-05-15",
        bloodGroup: "B+",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        address: "",
        busRoute: "Route 01 - Blue Line",
        busStop: "Main Gate",
        initialFeePaid: "40000"
      });
      onRefresh();
    }
  };

  return (
    <div className="erp-sis-module animate-fade-in">
      {/* Header & Controls */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Student Information System (SIS)</h5>
            <p className="text-muted small mb-0">
              Centralized repository for student academic records, emergency profiles, fee status, and enrollment.
            </p>
          </div>
          <button
            className="btn btn-sm btn-primary d-flex align-items-center gap-2 rounded-2 fw-medium px-3 shadow-xs"
            onClick={() => setShowAdmissionModal(true)}
          >
            <IconPlus size={15} />
            <span>Admit New Student</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="row g-2 align-items-center pt-3 border-top">
          <div className="col-md-3 col-sm-6">
            <label className="form-label small text-muted mb-1 fw-medium" style={{ fontSize: "0.78rem" }}>Grade Level</label>
            <select
              className="form-select form-select-sm rounded-2"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
            >
              <option value="All">All Grades (1 - 12)</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
              <option value="Grade 11">Grade 11</option>
              <option value="Grade 12">Grade 12</option>
            </select>
          </div>

          <div className="col-md-3 col-sm-6">
            <label className="form-label small text-muted mb-1 fw-medium" style={{ fontSize: "0.78rem" }}>Class Section</label>
            <select
              className="form-select form-select-sm rounded-2"
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="All">All Sections (A, B, C)</option>
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>

          <div className="col-md-3 col-sm-6">
            <label className="form-label small text-muted mb-1 fw-medium" style={{ fontSize: "0.78rem" }}>Fee Status</label>
            <select
              className="form-select form-select-sm rounded-2"
              value={selectedFeeStatus}
              onChange={(e) => setSelectedFeeStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partial">Partial Dues</option>
              <option value="Pending">Unpaid</option>
            </select>
          </div>

          <div className="col-md-3 col-sm-6 d-flex align-items-end">
            <div className="w-100 text-end">
              <span className="badge bg-slate-50 text-slate-700 border px-3 py-2 rounded-2 small fw-medium">
                Records Found: <strong>{filteredStudents.length}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Student Records Table */}
      <div className="card border rounded-3 overflow-hidden bg-white mb-4 shadow-xs">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light border-bottom">
              <tr>
                <th className="ps-4 text-muted fw-semibold small">Roll No</th>
                <th className="text-muted fw-semibold small">Student Details</th>
                <th className="text-muted fw-semibold small">Class & Section</th>
                <th className="text-muted fw-semibold small">Guardian Contact</th>
                <th className="text-muted fw-semibold small">Attendance %</th>
                <th className="text-muted fw-semibold small">Fee Balance</th>
                <th className="text-end pe-4 text-muted fw-semibold small">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted small">
                    No student records match the active criteria.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
                  <tr key={s.id}>
                    <td className="ps-4 fw-semibold text-secondary font-monospace small">#{s.rollNo}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={s.avatar}
                          alt={s.name}
                          className="rounded-circle border"
                          style={{ width: "38px", height: "38px", objectFit: "cover" }}
                        />
                        <div>
                          <div className="fw-semibold text-dark small">{s.name}</div>
                          <div className="text-muted small" style={{ fontSize: "0.75rem" }}>
                            {s.id} • Blood: {s.bloodGroup}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-slate-100 text-slate-700 border fw-medium px-2 py-1 rounded-2">
                        {s.grade} - {s.section}
                      </span>
                    </td>
                    <td>
                      <div className="small fw-medium text-dark">{s.parentName}</div>
                      <div className="small text-muted font-monospace" style={{ fontSize: "0.75rem" }}>{s.parentPhone}</div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="progress flex-grow-1" style={{ height: "5px", width: "65px" }}>
                          <div
                            className={`progress-bar ${
                              s.attendance >= 90 ? "bg-success" : s.attendance >= 75 ? "bg-warning" : "bg-danger"
                            }`}
                            style={{ width: `${s.attendance}%` }}
                          ></div>
                        </div>
                        <span className="small fw-semibold text-dark" style={{ fontSize: "0.8rem" }}>{s.attendance}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge rounded-1 px-2 py-1 ${
                          s.fee?.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : s.fee?.status === "Partial"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                        style={{ fontSize: "0.76rem" }}
                      >
                        {s.fee?.status} (₹{s.fee?.due ? s.fee.due.toLocaleString() : 0} due)
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-2 px-3 fw-medium"
                        style={{ fontSize: "0.78rem" }}
                        onClick={() => setSelectedStudent(s)}
                      >
                        View Dossier
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Dossier Modal */}
      {selectedStudent && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 bg-light">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="rounded-circle border"
                    style={{ width: "52px", height: "52px", objectFit: "cover" }}
                  />
                  <div>
                    <h6 className="modal-title fw-bold mb-0 text-dark">{selectedStudent.name}</h6>
                    <span className="text-muted small">
                      Roll #{selectedStudent.rollNo} • {selectedStudent.grade} ({selectedStudent.section}) • ID: {selectedStudent.id}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedStudent(null)}
                ></button>
              </div>

              <div className="modal-body p-4">
                <div className="row g-4">
                  {/* Left Column: Personal & Emergency */}
                  <div className="col-md-6">
                    <h6 className="fw-bold text-dark small text-uppercase mb-3" style={{ letterSpacing: "0.04em" }}>
                      Personal & Health Profile
                    </h6>
                    <ul className="list-group list-group-flush small">
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Gender</span>
                        <span className="fw-medium text-dark">{selectedStudent.gender}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Date of Birth</span>
                        <span className="fw-medium text-dark">{selectedStudent.dob}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Blood Group</span>
                        <span className="badge bg-slate-100 text-slate-700 border">{selectedStudent.bloodGroup}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Residential Address</span>
                        <span className="fw-medium text-dark text-end" style={{ maxWidth: "200px" }}>
                          {selectedStudent.address}
                        </span>
                      </li>
                    </ul>

                    <h6 className="fw-bold text-dark small text-uppercase mt-4 mb-3" style={{ letterSpacing: "0.04em" }}>
                      Primary Guardian & Commute
                    </h6>
                    <ul className="list-group list-group-flush small">
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Guardian Name</span>
                        <span className="fw-medium text-dark">{selectedStudent.parentName}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Emergency Phone</span>
                        <span className="fw-medium text-dark font-monospace">{selectedStudent.parentPhone}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Email</span>
                        <span className="fw-medium text-dark">{selectedStudent.parentEmail}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Transport Assignment</span>
                        <span className="fw-medium text-dark">{selectedStudent.busRoute}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between px-0">
                        <span className="text-muted">Stop Location</span>
                        <span className="fw-medium text-dark">{selectedStudent.busStop}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right Column: Academics & Finance */}
                  <div className="col-md-6">
                    <h6 className="fw-bold text-dark small text-uppercase mb-3" style={{ letterSpacing: "0.04em" }}>
                      Attendance & Compliance
                    </h6>
                    <div className="p-3 bg-slate-50 border rounded-2 mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small text-muted">Attendance Standing</span>
                        <span className="small fw-bold text-dark">{selectedStudent.attendance}%</span>
                      </div>
                      <div className="progress mb-2" style={{ height: "6px" }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{ width: `${selectedStudent.attendance}%` }}
                        ></div>
                      </div>
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>
                        Meets official CBSE academic attendance threshold (75% min).
                      </span>
                    </div>

                    <h6 className="fw-bold text-dark small text-uppercase mt-3 mb-2" style={{ letterSpacing: "0.04em" }}>
                      Bursar Account Statement
                    </h6>
                    <div className="border p-3 rounded-2 mb-3 bg-white">
                      <div className="d-flex justify-content-between mb-1 small">
                        <span className="text-muted">Total Academic Billed:</span>
                        <strong className="text-dark">₹{selectedStudent.fee?.total.toLocaleString()}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-1 small">
                        <span className="text-muted">Settled Amount:</span>
                        <span className="text-success fw-bold">₹{selectedStudent.fee?.paid.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-1 small">
                        <span className="text-muted">Outstanding Dues:</span>
                        <span className="text-danger fw-bold">₹{selectedStudent.fee?.due.toLocaleString()}</span>
                      </div>
                      <div className="d-flex justify-content-between small pt-2 border-top mt-2">
                        <span className="text-muted">Last Receipt:</span>
                        <span className="font-monospace text-dark">{selectedStudent.fee?.lastReceipt || "None"}</span>
                      </div>
                    </div>

                    <h6 className="fw-bold text-dark small text-uppercase mb-2" style={{ letterSpacing: "0.04em" }}>
                      Term Evaluation Snapshot
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {selectedStudent.marks?.term1 &&
                        Object.entries(selectedStudent.marks.term1).map(([sub, mark]) => (
                          <div key={sub} className="badge bg-slate-50 text-dark border p-2 rounded-2 text-start">
                            <div className="text-muted" style={{ fontSize: "0.72rem" }}>{sub}</div>
                            <div className="fw-bold" style={{ fontSize: "0.85rem" }}>{mark} / 100</div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer border-top py-2 bg-light">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-2 px-3"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close Dossier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admission Wizard Modal */}
      {showAdmissionModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 bg-primary text-white">
                <h6 className="modal-title fw-bold mb-0">New Student Admission Protocol</h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAdmissionModal(false)}
                ></button>
              </div>
              <form onSubmit={handleAdmissionSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-medium text-muted">Full Student Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-2"
                        required
                        placeholder="e.g. Yashvardhan Rao"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-medium text-muted">Gender</label>
                      <select
                        className="form-select form-select-sm rounded-2"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label small fw-medium text-muted">Blood Group</label>
                      <select
                        className="form-select form-select-sm rounded-2"
                        value={formData.bloodGroup}
                        onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                      >
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Class Grade</label>
                      <select
                        className="form-select form-select-sm rounded-2"
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      >
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Section</label>
                      <select
                        className="form-select form-select-sm rounded-2"
                        value={formData.section}
                        onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                      >
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control form-control-sm rounded-2"
                        value={formData.dob}
                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                      />
                    </div>

                    <hr className="my-2" />

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Primary Guardian Name *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-2"
                        required
                        placeholder="e.g. S. K. Rao"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Guardian Phone *</label>
                      <input
                        type="tel"
                        className="form-control form-control-sm rounded-2"
                        required
                        placeholder="+91 98000 00000"
                        value={formData.parentPhone}
                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Guardian Email</label>
                      <input
                        type="email"
                        className="form-control form-control-sm rounded-2"
                        placeholder="parent@example.com"
                        value={formData.parentEmail}
                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium text-muted">Residential Address</label>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-2"
                        placeholder="Apartment / Villa, Street, City"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-medium text-muted">Initial Admission Deposit (₹)</label>
                      <input
                        type="number"
                        className="form-control form-control-sm rounded-2"
                        min="0"
                        max="85000"
                        step="1000"
                        value={formData.initialFeePaid}
                        onChange={(e) => setFormData({ ...formData, initialFeePaid: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top py-2 bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2 px-3"
                    onClick={() => setShowAdmissionModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary rounded-2 px-4 fw-medium">
                    Confirm Admission & Assign Roll ID
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
