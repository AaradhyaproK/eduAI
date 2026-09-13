import React, { useState } from "react";
import { IconStaff, IconFileText, IconPrinter, IconSchool } from "./ERPIcons";

export default function ERPStaffModule({ erpData }) {
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedStaffForSlip, setSelectedStaffForSlip] = useState(null);

  const staffList = erpData.staff || [];

  const filteredStaff = staffList.filter((st) => {
    if (selectedDept === "All") return true;
    return st.department.includes(selectedDept);
  });

  return (
    <div className="erp-staff-module animate-fade-in">
      {/* Header */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Faculty, Administration & Staff HR Payroll</h5>
            <p className="text-muted small mb-0">
              Manage academic educators, administrative officers, leave quotas, and calculate automated monthly payroll slips.
            </p>
          </div>
          <div className="d-flex align-items-center gap-1 flex-wrap">
            <span className="small text-muted fw-medium me-1" style={{ fontSize: "0.75rem" }}>Department:</span>
            {["All", "Science", "Mathematics", "Languages", "Administration", "Fleet"].map((d) => (
              <button
                key={d}
                onClick={() => setSelectedDept(d)}
                className={`btn btn-sm rounded-2 px-2 py-1 ${
                  selectedDept === d ? "btn-primary shadow-xs" : "btn-light border text-secondary"
                }`}
                style={{ fontSize: "0.76rem" }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="card border rounded-3 overflow-hidden bg-white mb-4 shadow-xs">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small border-bottom">
              <tr>
                <th className="ps-3 text-muted fw-semibold">Employee ID</th>
                <th className="text-muted fw-semibold">Staff Name & Designation</th>
                <th className="text-muted fw-semibold">Department</th>
                <th className="text-muted fw-semibold">Academic Qualifications</th>
                <th className="text-muted fw-semibold">Leave Quotas</th>
                <th className="text-muted fw-semibold">Monthly Net Pay</th>
                <th className="text-end pe-4 text-muted fw-semibold">Payroll Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStaff.map((st) => (
                <tr key={st.id}>
                  <td className="ps-3 fw-semibold text-secondary font-monospace small">{st.id}</td>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={st.avatar}
                        alt={st.name}
                        className="rounded-circle border"
                        style={{ width: "38px", height: "38px", objectFit: "cover" }}
                      />
                      <div>
                        <div className="fw-semibold text-dark small">{st.name}</div>
                        <div className="text-muted" style={{ fontSize: "0.75rem" }}>{st.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge bg-slate-100 text-slate-700 border">{st.department}</span>
                  </td>
                  <td>
                    <span className="small text-muted" style={{ fontSize: "0.78rem" }}>{st.qualification}</span>
                  </td>
                  <td>
                    <div className="small" style={{ fontSize: "0.76rem" }}>
                      <span className="text-success fw-medium">Casual: {st.leaveBalance.casual}</span> |{" "}
                      <span className="text-warning fw-medium">Sick: {st.leaveBalance.sick}</span> |{" "}
                      <span className="text-primary fw-medium">Earned: {st.leaveBalance.earned}</span>
                    </div>
                  </td>
                  <td className="fw-bold text-dark small">
                    ₹{st.salary?.net ? st.salary.net.toLocaleString() : "75,000"}
                  </td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-2 px-3 fw-medium"
                      style={{ fontSize: "0.78rem" }}
                      onClick={() => setSelectedStaffForSlip(st)}
                    >
                      Generate Payslip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Printable Staff Payslip Modal */}
      {selectedStaffForSlip && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border rounded-3 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom py-3 bg-light no-print">
                <h6 className="modal-title fw-bold text-dark mb-0">Official Employee Monthly Payslip</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedStaffForSlip(null)}
                ></button>
              </div>

              {/* Printable Body */}
              <div className="modal-body p-4 p-md-5 print-document-container bg-white" id="printable-payslip">
                <div className="text-center border-bottom pb-4 mb-4">
                  <div className="d-inline-flex p-2 bg-slate-100 rounded-2 text-primary mb-2">
                    <IconSchool size={28} />
                  </div>
                  <h4 className="fw-bold mb-1 text-uppercase text-dark">
                    {erpData.schoolInfo.name}
                  </h4>
                  <p className="text-muted small mb-0">{erpData.schoolInfo.address}</p>
                  <div className="mt-3">
                    <span className="badge bg-slate-800 text-white px-3 py-2 rounded-1 small fw-semibold">
                      SALARY DISBURSEMENT STATEMENT - AUGUST 2026
                    </span>
                  </div>
                </div>

                <div className="row g-3 p-3 bg-slate-50 rounded-2 mb-4 small border">
                  <div className="col-sm-6">
                    <div>
                      <span className="text-muted">Employee Name:</span> <strong>{selectedStaffForSlip.name}</strong>
                    </div>
                    <div>
                      <span className="text-muted">Employee ID:</span> <span className="font-monospace">{selectedStaffForSlip.id}</span>
                    </div>
                    <div>
                      <span className="text-muted">Designation:</span> {selectedStaffForSlip.designation}
                    </div>
                    <div>
                      <span className="text-muted">Department:</span> {selectedStaffForSlip.department}
                    </div>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div>
                      <span className="text-muted">Date of Joining:</span> {selectedStaffForSlip.joiningDate}
                    </div>
                    <div>
                      <span className="text-muted">Salary Account:</span> HDFC Bank •••• 8821
                    </div>
                    <div>
                      <span className="text-muted">EPF UAN Number:</span> <span className="font-monospace">KN/BLR/2849102/PF</span>
                    </div>
                    <div>
                      <span className="text-muted">Payable Days:</span> 31 Calendar Days
                    </div>
                  </div>
                </div>

                {/* Earnings vs Deductions Table */}
                <div className="row g-3 mb-4 small">
                  {/* Earnings */}
                  <div className="col-6">
                    <table className="table table-bordered mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="text-muted fw-semibold">Earnings Component</th>
                          <th className="text-end text-muted fw-semibold">Amount (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Basic Salary</td>
                          <td className="text-end">₹{selectedStaffForSlip.salary.basic.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>House Rent Allowance (HRA)</td>
                          <td className="text-end">₹{selectedStaffForSlip.salary.hra.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Dearness Allowance (DA)</td>
                          <td className="text-end">₹{selectedStaffForSlip.salary.da.toLocaleString()}</td>
                        </tr>
                        <tr className="table-light fw-bold">
                          <td>Gross Remuneration</td>
                          <td className="text-end text-primary">
                            ₹
                            {(
                              selectedStaffForSlip.salary.basic +
                              selectedStaffForSlip.salary.hra +
                              selectedStaffForSlip.salary.da
                            ).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Deductions */}
                  <div className="col-6">
                    <table className="table table-bordered mb-0">
                      <thead className="table-light">
                        <tr>
                          <th className="text-muted fw-semibold">Statutory Deductions</th>
                          <th className="text-end text-muted fw-semibold">Amount (INR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Provident Fund (EPF 12%)</td>
                          <td className="text-end">₹{selectedStaffForSlip.salary.pf.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Income Tax TDS</td>
                          <td className="text-end">₹{selectedStaffForSlip.salary.tax.toLocaleString()}</td>
                        </tr>
                        <tr>
                          <td>Professional Tax</td>
                          <td className="text-end">₹200</td>
                        </tr>
                        <tr className="table-light fw-bold">
                          <td>Total Deductions</td>
                          <td className="text-end text-danger">
                            ₹{(selectedStaffForSlip.salary.pf + selectedStaffForSlip.salary.tax + 200).toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Net Pay Highlight */}
                <div className="p-3 bg-slate-50 border rounded-2 mb-4 d-flex justify-content-between align-items-center">
                  <span className="fw-semibold text-dark small">Net Credited Remuneration:</span>
                  <strong className="fs-5 text-success">
                    ₹{selectedStaffForSlip.salary.net.toLocaleString()}
                  </strong>
                </div>

                <div className="row mt-5 pt-4 text-center small">
                  <div className="col-6 text-start ps-4">
                    <span className="text-muted d-block">Treasury Bank Transfer Advice Dispatched.</span>
                  </div>
                  <div className="col-6 text-end pe-4">
                    <div className="border-bottom d-inline-block pb-1 mb-2 font-monospace" style={{ minWidth: "160px" }}>
                      Chief Accounts Officer
                    </div>
                    <span className="text-muted d-block">Authorized HR Signatory</span>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="modal-footer border-top py-2 bg-light no-print">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-2 px-3"
                  onClick={() => setSelectedStaffForSlip(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary rounded-2 px-4 fw-medium d-flex align-items-center gap-2"
                  onClick={() => window.print()}
                >
                  <IconPrinter size={15} />
                  <span>Print Payslip</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
