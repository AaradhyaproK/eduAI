import React, { useState } from "react";
import { issueBookToStudent, returnBookFromStudent } from "../../services/erpStorage";
import { IconLibrary, IconBook, IconSearch, IconCheck } from "./ERPIcons";

export default function ERPLibraryModule({ erpData, onRefresh }) {
  const [selectedBookForIssue, setSelectedBookForIssue] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(erpData.students[0]?.id || "");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchFilter, setSearchFilter] = useState("");
  const [barcodeInput, setBarcodeInput] = useState("");
  const [deskMessage, setDeskMessage] = useState(null);

  const books = erpData.libraryBooks || [];
  const students = erpData.students || [];

  const filteredBooks = books.filter((b) => {
    const matchCat = categoryFilter === "All" || b.category.includes(categoryFilter);
    const matchSearch =
      !searchFilter ||
      b.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.author.toLowerCase().includes(searchFilter.toLowerCase()) ||
      b.isbn.includes(searchFilter);
    return matchCat && matchSearch;
  });

  const handleIssueSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookForIssue || !selectedStudentId) return;

    const res = issueBookToStudent(selectedBookForIssue.id, selectedStudentId);
    if (res.success) {
      setDeskMessage({
        type: "success",
        text: `Loan registered: "${selectedBookForIssue.title}" issued. Due date recorded: 14 calendar days from today.`
      });
      setSelectedBookForIssue(null);
      onRefresh();
    } else {
      setDeskMessage({ type: "danger", text: res.error || "Could not issue title." });
    }
  };

  const handleReturn = (bookId, studentId, dueDateStr) => {
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    let fine = 0;
    if (today > dueDate) {
      const diffDays = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
      fine = diffDays * 5;
    }

    const res = returnBookFromStudent(bookId, studentId);
    if (res.success) {
      setDeskMessage({
        type: "info",
        text: `Check-in complete. ${fine > 0 ? `Late penalty levied: ₹${fine} (₹5/day).` : "Returned on schedule without penalties."}`
      });
      onRefresh();
    }
  };

  const handleBarcodeSearch = (e) => {
    e.preventDefault();
    if (!barcodeInput) return;
    const match = books.find((b) => b.isbn.includes(barcodeInput) || b.id.toLowerCase() === barcodeInput.toLowerCase());
    if (match) {
      setSearchFilter(match.title);
      setDeskMessage({ type: "success", text: `Barcode Matched: "${match.title}" (Shelf Location: ${match.rack})` });
    } else {
      setDeskMessage({ type: "warning", text: `No title cataloged for barcode / ISBN: ${barcodeInput}` });
    }
  };

  return (
    <div className="erp-library-module animate-fade-in">
      {/* Header */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Library Information & Resource Circulation Desk</h5>
            <p className="text-muted small mb-0">
              Circulate textbooks, track active student loans, calculate overdue fines, and manage catalog racks.
            </p>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-slate-100 text-slate-700 border px-3 py-2 rounded-2 small fw-medium">
              Resource Officer: {erpData.staff.find((s) => s.id === "STF-206")?.name || "Mrs. Thomas"}
            </span>
          </div>
        </div>

        {/* Barcode & Filters Row */}
        <div className="row g-3 align-items-center border-top pt-3">
          <div className="col-md-5">
            <form onSubmit={handleBarcodeSearch} className="d-flex gap-2">
              <input
                type="text"
                className="form-control form-control-sm rounded-2 font-monospace"
                placeholder="Simulate ISBN / Barcode scan (e.g. 978-0134685991)..."
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
              />
              <button type="submit" className="btn btn-sm btn-primary rounded-2 px-3 fw-medium">
                Scan
              </button>
            </form>
          </div>

          <div className="col-md-4">
            <input
              type="text"
              className="form-control form-control-sm rounded-2"
              placeholder="Search title, author, subject..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <select
              className="form-select form-select-sm rounded-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Computer Science">Computer Science & AI</option>
              <option value="Physics">Physics & STEM</option>
              <option value="Literature">Literature</option>
              <option value="Social History">History</option>
            </select>
          </div>
        </div>

        {deskMessage && (
          <div className={`alert alert-${deskMessage.type} small py-2 rounded-2 mt-3 mb-0 d-flex justify-content-between align-items-center`} style={{ fontSize: "0.8rem" }}>
            <span>{deskMessage.text}</span>
            <button type="button" className="btn-close btn-close-sm" onClick={() => setDeskMessage(null)}></button>
          </div>
        )}
      </div>

      {/* Book Catalog Table */}
      <div className="card border rounded-3 overflow-hidden bg-white mb-4 shadow-xs">
        <div className="card-header bg-light border-bottom py-3">
          <h6 className="fw-bold mb-0 text-dark small">
            Catalog Inventory & Circulation Status ({filteredBooks.length} Titles)
          </h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light small border-bottom">
              <tr>
                <th className="ps-3 text-muted fw-semibold">ID / ISBN</th>
                <th className="text-muted fw-semibold">Title & Author</th>
                <th className="text-muted fw-semibold">Category</th>
                <th className="text-muted fw-semibold">Shelf Location</th>
                <th className="text-muted fw-semibold">Stock Availability</th>
                <th className="text-end pe-4 text-muted fw-semibold">Circulation Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((b) => (
                <tr key={b.id}>
                  <td className="ps-3 small">
                    <span className="fw-semibold text-dark d-block font-monospace">{b.id}</span>
                    <span className="text-muted font-monospace" style={{ fontSize: "0.72rem" }}>
                      {b.isbn}
                    </span>
                  </td>
                  <td>
                    <div className="fw-semibold text-dark small">{b.title}</div>
                    <div className="text-muted" style={{ fontSize: "0.75rem" }}>{b.author}</div>
                  </td>
                  <td>
                    <span className="badge bg-slate-100 text-slate-700 border">{b.category}</span>
                  </td>
                  <td>
                    <span className="badge bg-slate-50 text-slate-600 border font-monospace">{b.rack}</span>
                  </td>
                  <td>
                    <div className="small">
                      <strong className="text-success">{b.availableCopies}</strong> / {b.totalCopies} Available
                    </div>
                    {b.issuedTo && b.issuedTo.length > 0 && (
                      <span className="text-muted" style={{ fontSize: "0.72rem" }}>
                        {b.issuedTo.length} actively checked out
                      </span>
                    )}
                  </td>
                  <td className="text-end pe-4">
                    <button
                      className="btn btn-sm btn-outline-secondary rounded-2 px-3 fw-medium"
                      style={{ fontSize: "0.78rem" }}
                      onClick={() => setSelectedBookForIssue(b)}
                      disabled={b.availableCopies <= 0}
                    >
                      {b.availableCopies > 0 ? "Issue to Student" : "Out of Stock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Borrowers & Return Desk */}
      <div className="card border rounded-3 p-4 bg-white mb-4 shadow-xs">
        <h6 className="fw-bold text-dark mb-3 small">Active Loans & Overdue Tracking Desk</h6>
        <div className="table-responsive">
          <table className="table table-sm table-hover align-middle mb-0 small">
            <thead className="table-light border-bottom">
              <tr>
                <th className="ps-3 text-muted fw-semibold">Title</th>
                <th className="text-muted fw-semibold">Borrower Profile</th>
                <th className="text-muted fw-semibold">Issue Date</th>
                <th className="text-muted fw-semibold">Due Date</th>
                <th className="text-muted fw-semibold">Loan Status</th>
                <th className="text-end pe-3 text-muted fw-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {books.flatMap((b) =>
                b.issuedTo.map((iss) => {
                  const isOverdue = new Date() > new Date(iss.dueDate);
                  return (
                    <tr key={`${b.id}-${iss.studentId}`}>
                      <td className="ps-3 fw-medium text-dark">{b.title}</td>
                      <td>
                        <strong>{iss.studentName}</strong> ({iss.studentId})
                      </td>
                      <td className="font-monospace text-muted">{iss.issueDate}</td>
                      <td className="font-monospace text-muted">{iss.dueDate}</td>
                      <td>
                        {isOverdue ? (
                          <span className="badge bg-rose-50 text-rose-700 border border-rose-200">Overdue (₹5/day fine)</span>
                        ) : (
                          <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200">Active Loan</span>
                        )}
                      </td>
                      <td className="text-end pe-3">
                        <button
                          className="btn btn-sm btn-outline-success rounded-2 px-3"
                          style={{ fontSize: "0.75rem" }}
                          onClick={() => handleReturn(b.id, iss.studentId, iss.dueDate)}
                        >
                          Check In Book
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

      {/* Issue Book Modal */}
      {selectedBookForIssue && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 bg-primary text-white">
                <h6 className="modal-title fw-bold mb-0">Issue Library Title to Student</h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setSelectedBookForIssue(null)}
                ></button>
              </div>
              <form onSubmit={handleIssueSubmit}>
                <div className="modal-body p-4">
                  <div className="p-3 bg-slate-50 border rounded-2 mb-3 small">
                    <div className="fw-bold text-dark">{selectedBookForIssue.title}</div>
                    <div className="text-muted">Author: {selectedBookForIssue.author}</div>
                    <div className="mt-2 text-secondary" style={{ fontSize: "0.75rem" }}>
                      Rack: {selectedBookForIssue.rack} | Available Copies: {selectedBookForIssue.availableCopies}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-medium text-muted">Select Student Borrower</label>
                    <select
                      className="form-select form-select-sm rounded-2"
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          #{s.rollNo} - {s.name} ({s.grade}-{s.section})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="p-3 border rounded-2 small bg-white">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="text-muted">Loan Standard Period:</span>
                      <strong className="text-dark">14 Calendar Days</strong>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-muted">Overdue Penalty:</span>
                      <span className="text-danger fw-medium">₹5.00 per day after grace period</span>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top py-2 bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2 px-3"
                    onClick={() => setSelectedBookForIssue(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary rounded-2 px-4 fw-medium">
                    Confirm Checkout
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
