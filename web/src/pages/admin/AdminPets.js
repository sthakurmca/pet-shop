import React, { useState, useEffect } from "react";
import { pets as petsApi } from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultPet = { name: "", species: "", breed: "", age: "", description: "", imageUrl: "", status: "available" };

export default function AdminPets() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaultPet);
  const [saving, setSaving] = useState(false);

  const loadPets = () => {
    setLoading(true);
    petsApi
      .list({ limit: 100, status: "all" })
      .then((res) => setList(res.data.pets || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => loadPets(), []);

  const openCreate = () => {
    setEditing("new");
    setForm(defaultPet);
  };

  const openEdit = (pet) => {
    setEditing(pet._id);
    setForm({
      name: pet.name,
      species: pet.species,
      breed: pet.breed || "",
      age: pet.age,
      description: pet.description || "",
      imageUrl: pet.imageUrl || "",
      status: pet.status,
    });
  };

  const closeForm = () => {
    setEditing(null);
    setForm(defaultPet);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, age: Number(form.age) || 0 };
      if (editing === "new") {
        await petsApi.create(payload);
        toast.success("Pet added.");
      } else {
        await petsApi.update(editing, payload);
        toast.success("Pet updated.");
      }
      closeForm();
      loadPets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this pet?")) return;
    try {
      await petsApi.delete(id);
      toast.success("Pet deleted.");
      loadPets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete.");
    }
  };

  return (
    <div className="admin-pets">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="admin-header">
        <h1>Manage pets</h1>
        <button type="button" className="btn-primary" onClick={openCreate}>Add pet</button>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing === "new" ? "Add pet" : "Edit pet"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
              <input
                placeholder="Species"
                value={form.species}
                onChange={(e) => setForm((f) => ({ ...f, species: e.target.value }))}
                required
              />
              <input
                placeholder="Breed"
                value={form.breed}
                onChange={(e) => setForm((f) => ({ ...f, breed: e.target.value }))}
              />
              <input
                type="number"
                min="0"
                placeholder="Age"
                value={form.age}
                onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                required
              />
              <select
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="adopted">Adopted</option>
              </select>
              <input
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
              />
              <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={3}
              />
              <div className="modal-actions">
                <button type="button" onClick={closeForm}>Cancel</button>
                <button type="submit" disabled={saving}>{saving ? "Saving…" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="loading">Loading…</div>
      ) : list.length === 0 ? (
        <div className="empty">No pets. Add one above.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Species</th>
                <th>Breed</th>
                <th>Age</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((pet) => (
                <tr key={pet._id}>
                  <td>{pet.name}</td>
                  <td>{pet.species}</td>
                  <td>{pet.breed || "—"}</td>
                  <td>{pet.age}</td>
                  <td><span className={`badge status-${pet.status}`}>{pet.status}</span></td>
                  <td>
                    <button type="button" className="btn-sm" onClick={() => openEdit(pet)}>Edit</button>
                    <button type="button" className="btn-sm danger" onClick={() => handleDelete(pet._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
