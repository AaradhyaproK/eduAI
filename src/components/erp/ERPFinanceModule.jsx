import React, { useState } from "react";
import { payStudentFee } from "../../services/erpStorage";
import { IconFinance, IconCreditCard, IconPrinter, IconSchool, IconCheck } from "./ERPIcons";

export default function ERPFinanceModule({ erpData, onRefresh }) {
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStudentForPay, setSelectedStudentForPay] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const students = erpData.students || [];

  // Metrics
  const totalBilled = students.reduce((acc, s) => acc + (s.fee?.total || 0), 0);
  const totalCollected = students.reduce((acc, s) => acc + (s.fee?.paid || 0), 0);
  const totalPending = students.reduce((acc, s) => acc + (s.fee?.due || 0), 0);
  const recoveryRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0;

  const filteredStudents = students.filter((s) => {
    if (filterStatus === "All") return true;
    return s.fee?.status === filterStatus;
  });

  const handleOpenPayModal = (student) => {
    setSelectedStudentForPay(student);
    setPaymentAmount(student.fee.due > 0 ? student.fee.due : 10000);
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    if (!selectedStudentForPay || !paymentAmount || paymentAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const res = payStudentFee(selectedStudentForPay.id, paymentAmount, paymentMode);
      setIsProcessing(false);
      if (res.success) {
        setSelectedStudentForPay(null);
        setReceiptData({
          receiptId: res.receiptId,
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
          student: res.student,
          amountPaid: res.amountPaid,
          mode: paymentMode
        });
        onRefresh();
      }
    }, 700);
  };

  return (
    <div className="erp-finance-module animate-fade-in">
      {/* Financial Metrics Overview */}
      <div className="row g-3 mb-4">
        <div className="col-lg-3 col-sm-6">
          <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
            <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Total Invoiced (Current Term)</span>
            <h3 className="fw-bold mb-1 text-dark">₹{totalBilled.toLocaleString()}</h3>
            <span className="small text-muted" style={{ fontSize: "0.75rem" }}>Enrolled student ledger base</span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
            <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Recovered / Paid</span>
            <h3 className="fw-bold mb-1 text-success">₹{totalCollected.toLocaleString()}</h3>
            <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 small py-0 px-2 fw-medium">
              {recoveryRate}% Collection Rate
            </span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
            <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Outstanding Accounts Receivable</span>
            <h3 className="fw-bold mb-1 text-danger">₹{totalPending.toLocaleString()}</h3>
            <span className="small text-muted" style={{ fontSize: "0.75rem" }}>Guardian reminders scheduled</span>
          </div>
        </div>

        <div className="col-lg-3 col-sm-6">
          <div className="card border rounded-3 p-3 bg-white h-100 shadow-xs">
            <span className="text-muted small fw-medium" style={{ fontSize: "0.78rem" }}>Fee Allocation Structure</span>
            <div className="small mt-1 text-muted" style={{ fontSize: "0.75rem" }}>
              <div>• Tuition & Smart AI Labs: 65%</div>
              <div>• Campus Transport: 20%</div>
              <div>• Sports & Infrastructure: 15%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Fee Ledger Table */}
      <div className="card border rounded-3 overflow-hidden bg-white mb-4 shadow-xs">
        <div className="card-header bg-light border-bottom py-3 d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h6 className="fw-bold mb-0 text-dark small">Student Fee Ledger & Collection Terminal</h6>
            <span className="text-muted small" style={{ fontSize: "0.75rem" }}>
              Record tuition collections and print official GST payment receipts
            </span>
          </div>

          <div className="d-flex align-items-center gap-1">
            <span className="small text-muted fw-medium me-1" style={{ fontSize: "0.75rem" }}>Filter:</span>
            {["All", "Paid", "Partial", "Pending"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`btn btn-sm rounded-2 px-2 py-1 ${
                  filterStatus === st ? "btn-primary shadow-xs" : "btn-light border text-secondary"
                }`}
                style={{ fontSize: "0.76rem" }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small border-bottom">
              <tr>
                <th className="ps-3 text-muted fw-semibold">Roll</th>
                <th className="text-muted fw-semibold">Student Name</th>
                <th className="text-muted fw-semibold">Class</th>
                <th className="text-muted fw-semibold">Total Invoiced</th>
                <th className="text-muted fw-semibold">Paid Amount</th>
                <th className="text-muted fw-semibold">Balance Due</th>
                <th className="text-muted fw-semibold">Status</th>
                <th className="text-end pe-4 text-muted fw-semibold">Counter Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-muted small">
                    No records found for status filter: {filterStatus}.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => (
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
                          <div className="fw-semibold small text-dark">{s.name}</div>
                          <span className="text-muted font-monospace" style={{ fontSize: "0.72rem" }}>
                            {s.parentName} ({s.parentPhone})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge bg-slate-100 text-slate-700 border">
                        {s.grade}-{s.section}
                      </span>
                    </td>
                    <td className="fw-medium text-dark small">₹{s.fee?.total.toLocaleString()}</td>
                    <td className="text-success fw-semibold small">₹{s.fee?.paid.toLocaleString()}</td>
                    <td className="text-danger fw-bold small">₹{s.fee?.due.toLocaleString()}</td>
                    <td>
                      <span
                        className={`badge rounded-1 px-2 py-1 ${
                          s.fee?.status === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : s.fee?.status === "Partial"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                        style={{ fontSize: "0.75rem" }}
                      >
                        {s.fee?.status}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      {s.fee?.due > 0 ? (
                        <button
                          className="btn btn-sm btn-primary rounded-2 px-3 fw-medium shadow-xs"
                          style={{ fontSize: "0.78rem" }}
                          onClick={() => handleOpenPayModal(s)}
                        >
                          Collect Payment
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-2 px-3 fw-medium"
                          style={{ fontSize: "0.78rem" }}
                          onClick={() =>
                            setReceiptData({
                              receiptId: s.fee.lastReceipt || "REC-2026-089",
                              date: s.fee.lastPaidDate || new Date().toLocaleDateString(),
                              time: "10:30 AM",
                              student: s,
                              amountPaid: s.fee.total,
                              mode: "Online Bank Transfer"
                            })
                          }
                        >
                          View Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Fee Simulation Modal */}
      {selectedStudentForPay && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 bg-primary text-white">
                <h6 className="modal-title fw-bold mb-0">Fee Payment Counter Terminal</h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedStudentForPay(null)}
                ></button>
              </div>

              <form onSubmit={handleProcessPayment}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-slate-50 border rounded-2 mb-3 small">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Student:</span>
                      <strong className="text-dark">
                        {selectedStudentForPay.name} (Roll #{selectedStudentForPay.rollNo})
                      </strong>
                    </div>
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Total Billed:</span>
                      <span>₹{selectedStudentForPay.fee?.total.toLocaleString()}</span>
                    </div>
                    <div className="d-flex justify-content-between text-danger fw-bold">
                      <span>Outstanding Balance:</span>
                      <span>₹{selectedStudentForPay.fee?.due.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium text-muted">Payment Amount (₹)</label>
                    <input
                      type="number"
                      className="form-control form-control-sm rounded-2"
                      min="1000"
                      max={selectedStudentForPay.fee.due}
                      step="500"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium text-muted">Settlement Channel</label>
                    <div className="row g-2">
                      {["UPI", "Debit/Credit Card", "Net Banking", "Counter Cash"].map((m) => (
                        <div key={m} className="col-6">
                          <button
                            type="button"
                            className={`btn btn-sm w-100 rounded-2 py-2 ${
                              paymentMode === m ? "btn-primary shadow-xs" : "btn-outline-secondary"
                            }`}
                            style={{ fontSize: "0.8rem" }}
                            onClick={() => setPaymentMode(m)}
                          >
                            {m}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {paymentMode === "UPI" && (
                    <div className="p-3 bg-slate-50 border rounded-2 text-center mb-3">
                      <span className="small text-muted d-block" style={{ fontSize: "0.75rem" }}>Simulated UPI Merchant VPA:</span>
                      <code className="fw-bold text-dark">greenwood.academy@icici</code>
                    </div>
                  )}
                </div>

                <div className="modal-footer border-top py-2 bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2 px-3"
                    onClick={() => setSelectedStudentForPay(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-sm btn-success rounded-2 px-4 fw-medium"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing Gateway..." : `Confirm Settlement (₹${Number(paymentAmount).toLocaleString()})`}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Printable Official Fee Receipt Modal */}
      {receiptData && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border rounded-3 shadow-lg overflow-hidden">
              <div className="modal-header border-bottom py-3 bg-light no-print">
                <h6 className="modal-title fw-bold text-dark mb-0">Official School Fee Receipt</h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setReceiptData(null)}
                ></button>
              </div>

              {/* Printable Receipt Body */}
              <div className="modal-body p-4 p-md-5 print-document-container bg-white" id="printable-fee-receipt">
                {/* School Letterhead */}
                <div className="text-center border-bottom pb-4 mb-4">
                  <div className="d-inline-flex p-2 bg-slate-100 rounded-2 text-primary mb-2">
                    <IconSchool size={28} />
                  </div>
                  <h4 className="fw-bold mb-1 text-uppercase text-dark">
                    {erpData.schoolInfo.name}
                  </h4>
                  <p className="text-muted small mb-1">{erpData.schoolInfo.address}</p>
                  <p className="text-muted small mb-0">GSTIN: 29AAAEG4481P1Z4 | Affiliation #2130894</p>
                  <div className="mt-3">
                    <span className="badge bg-success px-3 py-2 rounded-1 small fw-semibold">
                      OFFICIAL PAYMENT ACKNOWLEDGEMENT RECEIPT
                    </span>
                  </div>
                </div>

                {/* Receipt Details Box */}
                <div className="row g-3 p-3 bg-slate-50 rounded-2 mb-4 small border">
                  <div className="col-sm-6">
                    <div>
                      <span className="text-muted">Receipt Number:</span> <code>{receiptData.receiptId}</code>
                    </div>
                    <div>
                      <span className="text-muted">Date & Time:</span> {receiptData.date} - {receiptData.time}
                    </div>
                    <div>
                      <span className="text-muted">Payment Channel:</span> {receiptData.mode}
                    </div>
                    <div>
                      <span className="text-muted">Status:</span> <span className="text-success fw-bold">Settled (Success)</span>
                    </div>
                  </div>
                  <div className="col-sm-6 text-sm-end">
                    <div>
                      <span className="text-muted">Student Name:</span> <strong>{receiptData.student?.name}</strong>
                    </div>
                    <div>
                      <span className="text-muted">Roll Number:</span> #{receiptData.student?.rollNo}
                    </div>
                    <div>
                      <span className="text-muted">Grade & Section:</span> {receiptData.student?.grade} - {receiptData.student?.section}
                    </div>
                    <div>
                      <span className="text-muted">Guardian Contact:</span> {receiptData.student?.parentPhone}
                    </div>
                  </div>
                </div>

                {/* Fee Itemization Table */}
                <table className="table table-bordered align-middle small mb-4">
                  <thead className="table-light">
                    <tr>
                      <th className="ps-3 text-muted fw-semibold">No</th>
                      <th className="text-muted fw-semibold">Particulars</th>
                      <th className="text-muted fw-semibold">Academic Period</th>
                      <th className="text-end pe-3 text-muted fw-semibold">Amount (INR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="ps-3">1</td>
                      <td>Tuition, Digital Curriculum & Learning Portal Access</td>
                      <td>Term 1 (2026-27)</td>
                      <td className="text-end pe-3">₹{Math.round(receiptData.amountPaid * 0.65).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="ps-3">2</td>
                      <td>STEM & AI Robotics Innovation Laboratory Fee</td>
                      <td>Term 1 (2026-27)</td>
                      <td className="text-end pe-3">₹{Math.round(receiptData.amountPaid * 0.20).toLocaleString()}</td>
                    </tr>
                    <tr>
                      <td className="ps-3">3</td>
                      <td>Sports Complex, Library & Activity Infrastructure</td>
                      <td>Term 1 (2026-27)</td>
                      <td className="text-end pe-3">₹{Math.round(receiptData.amountPaid * 0.15).toLocaleString()}</td>
                    </tr>
                    <tr className="table-light fw-bold">
                      <td colSpan="3" className="text-end pe-3 text-dark">
                        Total Amount Received:
                      </td>
                      <td className="text-end pe-3 text-success fs-6">
                        ₹{Number(receiptData.amountPaid).toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Remaining Balance */}
                <div className="p-3 bg-slate-50 border rounded-2 mb-4 small d-flex justify-content-between">
                  <span className="text-muted">Outstanding Balance Post Transaction:</span>
                  <strong className="text-danger">
                    ₹{receiptData.student?.fee?.due ? receiptData.student.fee.due.toLocaleString() : "0.00"}
                  </strong>
                </div>

                {/* Authorization Stamp */}
                <div className="row mt-5 pt-4 text-center small">
                  <div className="col-6 text-start ps-4">
                    <span className="text-muted d-block mb-1">Generated electronically via Greenwood ERP Financial Engine.</span>
                    <span className="text-muted">Bursar Internal Audit Cleared.</span>
                  </div>
                  <div className="col-6 text-end pe-4">
                    <div className="border-bottom d-inline-block pb-1 mb-2 font-monospace" style={{ minWidth: "180px" }}>
                      Mr. Vinod Deshmukh, FCA
                    </div>
                    <span className="text-muted d-block">Authorized Accounts Signatory</span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer border-top py-2 bg-light no-print">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary rounded-2 px-3"
                  onClick={() => setReceiptData(null)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-primary rounded-2 px-4 fw-medium d-flex align-items-center gap-2"
                  onClick={() => window.print()}
                >
                  <IconPrinter size={15} />
                  <span>Print Official Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
