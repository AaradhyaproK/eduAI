import React, { useState } from "react";
import { publishNotice } from "../../services/erpStorage";
import { IconNotice, IconPlus } from "./ERPIcons";

export default function ERPNoticesModule({ erpData, onRefresh }) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [formData, setFormData] = useState({
    title: "",
    category: "Academic & Tech",
    priority: "High",
    targetAudience: "All",
    content: "",
    author: "Office of the Principal"
  });

  const notices = erpData.notices || [];

  const filteredNotices = notices.filter((n) => {
    if (categoryFilter === "All") return true;
    return n.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    publishNotice(formData);
    setShowCreateModal(false);
    setFormData({
      title: "",
      category: "Academic & Tech",
      priority: "High",
      targetAudience: "All",
      content: "",
      author: "Office of the Principal"
    });
    onRefresh();
  };

  return (
    <div className="erp-notices-module animate-fade-in">
      {/* Header */}
      <div className="card border rounded-3 p-4 mb-4 bg-white shadow-xs">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Institutional Circulars & Official Notice Desk</h5>
            <p className="text-muted small mb-0">
              Broadcast administrative decrees, examination timetables, holiday advisories, and campus bulletins.
            </p>
          </div>
          <button
            className="btn btn-sm btn-primary d-flex align-items-center gap-2 rounded-2 fw-medium px-3 shadow-xs"
            onClick={() => setShowCreateModal(true)}
          >
            <IconPlus size={15} />
            <span>Draft Circular</span>
          </button>
        </div>

        <div className="d-flex align-items-center gap-1 border-top pt-3 flex-wrap">
          <span className="small text-muted fw-medium me-1" style={{ fontSize: "0.75rem" }}>Filter:</span>
          {["All", "Academic", "Exams", "Transport", "General"].map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`btn btn-sm rounded-2 px-2 py-1 ${
                categoryFilter === c ? "btn-primary shadow-xs" : "btn-light border text-secondary"
              }`}
              style={{ fontSize: "0.76rem" }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Notices Grid */}
      <div className="row g-4">
        {filteredNotices.map((n) => (
          <div key={n.id} className="col-md-6">
            <div className="card border rounded-3 p-4 h-100 bg-white shadow-xs hover-elevate">
              <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
                <span
                  className={`badge rounded-1 small px-2 py-1 ${
                    n.priority === "Urgent"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : n.priority === "High"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-blue-50 text-blue-700 border border-blue-200"
                  }`}
                  style={{ fontSize: "0.72rem" }}
                >
                  {n.priority} Priority
                </span>
                <span className="small text-muted font-monospace" style={{ fontSize: "0.75rem" }}>{n.date}</span>
              </div>

              <h6 className="fw-bold text-dark mb-2">{n.title}</h6>

              <p className="text-secondary small mb-3 flex-grow-1" style={{ lineHeight: "1.6", fontSize: "0.82rem" }}>
                {n.content}
              </p>

              <div className="d-flex justify-content-between align-items-center pt-3 border-top small" style={{ fontSize: "0.75rem" }}>
                <div>
                  <span className="text-muted">Target: </span>
                  <span className="badge bg-slate-100 text-slate-700 border">{n.targetAudience}</span>
                </div>
                <div className="text-muted fw-medium">By {n.author}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Notice Modal */}
      {showCreateModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(15, 23, 42, 0.4)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border rounded-3 shadow-lg">
              <div className="modal-header border-bottom py-3 bg-primary text-white">
                <h6 className="modal-title fw-bold mb-0">Draft Official Institutional Circular</h6>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowCreateModal(false)}
                ></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label small fw-medium text-muted">Subject Heading *</label>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-2"
                        required
                        placeholder="e.g. Annual STEM Science & Innovation Olympiad 2026"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Category</label>
                      <select
                        className="form-select form-select-sm rounded-2"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="Academic & Tech">Academic & Tech</option>
                        <option value="Exams">Exams</option>
                        <option value="Transport">Transport</option>
                        <option value="General">General Notice</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Urgency Classification</label>
                      <select
                        className="form-select form-select-sm rounded-2"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent Priority</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Target Recipients</label>
                      <select
                        className="form-select form-select-sm rounded-2"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                      >
                        <option value="All">All (Students, Faculty, Parents)</option>
                        <option value="Students & Parents">Students & Parents</option>
                        <option value="Parents">Parents Only</option>
                        <option value="Teachers">Faculty Only</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label small fw-medium text-muted">Signatory Authority</label>
                      <input
                        type="text"
                        className="form-control form-control-sm rounded-2"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label small fw-medium text-muted">Announcement Content *</label>
                      <textarea
                        className="form-control form-control-sm rounded-2"
                        rows="5"
                        required
                        placeholder="Type announcement details here..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top py-2 bg-light">
                  <button
                    type="button"
                    className="btn btn-sm btn-secondary rounded-2 px-3"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary rounded-2 px-4 fw-medium">
                    Authorize & Broadcast
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
