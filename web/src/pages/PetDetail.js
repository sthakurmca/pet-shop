import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { pets, adoptions } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    pets
      .getOne(id)
      .then((res) => setPet(res.data))
      .catch(() => setPet(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }
    setApplying(true);
    try {
      await adoptions.apply({ petId: id, message: message.trim() });
      toast.success("Application submitted!");
      setMessage("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="loading">Loading…</div>;
  if (!pet) return <div className="empty">Pet not found.</div>;

  const canApply = pet.status === "available" && user;

  return (
    <div className="pet-detail">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="pet-detail-grid">
        <div className="pet-detail-image">
          {pet.imageUrl ? (
            <img src={pet.imageUrl} alt={pet.name} />
          ) : (
            <div className="pet-placeholder large">🐾</div>
          )}
        </div>
        <div className="pet-detail-info">
          <span className={`badge status-${pet.status}`}>{pet.status}</span>
          <h1>{pet.name}</h1>
          <p><strong>Species:</strong> {pet.species}</p>
          {pet.breed && <p><strong>Breed:</strong> {pet.breed}</p>}
          <p><strong>Age:</strong> {pet.age} years</p>
          {pet.description && <p className="description">{pet.description}</p>}

          {canApply && (
            <form onSubmit={handleApply} className="apply-form">
              <textarea
                placeholder="Optional message for the shelter"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
              />
              <button type="submit" disabled={applying}>
                {applying ? "Submitting…" : "Apply to adopt"}
              </button>
            </form>
          )}
          {pet.status === "available" && !user && (
            <p className="login-prompt">Please <Link to="/login">log in</Link> to apply for adoption.</p>
          )}
          {pet.status !== "available" && (
            <p className="not-available">This pet is not available for adoption.</p>
          )}
        </div>
      </div>
    </div>
  );
}
