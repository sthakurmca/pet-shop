import React, { useState, useEffect } from "react";
import { adoptions } from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminApplications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [reviewing, setReviewing] = useState(null);

  const load = () => {
    setLoading(true);
    adoptions
      .all(statusFilter ? { status: statusFilter } : {})
      .then((res) => setList(res.data))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), [statusFilter]);

  const handleReview = async (id, status) => {
    setReviewing(id);
    try {
      await adoptions.review(id, status);
      toast.success(`Application ${status}.`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed.");
    } finally {
      setReviewing(null);
    }
  };

  return (
    <div className="admin-applications">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1>Adoption applications</h1>
      <div className="filter-row">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading…</div>
      ) : list.length === 0 ? (
        <div className="empty">No applications.</div>
      ) : (
        <div className="applications-list admin-app-list">
          {list.map((app) => (
            <div key={app._id} className="application-card admin-app-card">
              <div className="app-info">
                <p><strong>Pet:</strong> {app.pet?.name} ({app.pet?.species}, {app.pet?.age} yrs)</p>
                <p><strong>Applicant:</strong> {app.user?.name} ({app.user?.email})</p>
                {app.message && <p><strong>Message:</strong> {app.message}</p>}
                <p className="app-date">Applied {new Date(app.createdAt).toLocaleString()}</p>
              </div>
              <div className="app-actions">
                <span className={`badge status-${app.status}`}>{app.status}</span>
                {app.status === "pending" && (
                  <div className="review-btns">
                    <button
                      type="button"
                      className="btn-sm success"
                      disabled={reviewing === app._id}
                      onClick={() => handleReview(app._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn-sm danger"
                      disabled={reviewing === app._id}
                      onClick={() => handleReview(app._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
