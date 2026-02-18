import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { adoptions } from "../api/axios";

export default function MyApplications() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adoptions
      .my()
      .then((res) => setList(res.data))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  const statusClass = (s) => (s === "approved" ? "approved" : s === "rejected" ? "rejected" : "pending");

  if (loading) return <div className="loading">Loading your applications…</div>;

  return (
    <div className="my-applications">
      <h1>My adoption applications</h1>
      {list.length === 0 ? (
        <div className="empty">
          You haven’t applied for any pets yet. <Link to="/">Browse pets</Link>
        </div>
      ) : (
        <div className="applications-list">
          {list.map((app) => (
            <div key={app._id} className="application-card">
              <div className="app-pet">
                {app.pet?.imageUrl ? (
                  <img src={app.pet.imageUrl} alt={app.pet.name} />
                ) : (
                  <div className="pet-placeholder small">🐾</div>
                )}
                <div>
                  <Link to={`/pet/${app.pet?._id}`}><strong>{app.pet?.name}</strong></Link>
                  <p>{app.pet?.species} · {app.pet?.age} years</p>
                </div>
              </div>
              <span className={`badge status-${statusClass(app.status)}`}>{app.status}</span>
              <p className="app-date">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
