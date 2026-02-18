import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { pets } from "../api/axios";

export default function Home() {
  const [data, setData] = useState({ pets: [], pagination: {} });
  const [filters, setFilters] = useState({ species: "", breed: "", ageMin: "", ageMax: "", search: "" });
  const [page, setPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState({ species: [], breeds: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pets.getFilters().then((res) => setFilterOptions(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, status: "available" };
    if (filters.search) params.search = filters.search;
    if (filters.species) params.species = filters.species;
    if (filters.breed) params.breed = filters.breed;
    if (filters.ageMin !== "") params.ageMin = filters.ageMin;
    if (filters.ageMax !== "") params.ageMax = filters.ageMax;

    pets
      .list(params)
      .then((res) => {
        setData({ pets: res.data.pets, pagination: res.data.pagination });
      })
      .catch(() => setData({ pets: [], pagination: {} }))
      .finally(() => setLoading(false));
  }, [page, filters.search, filters.species, filters.breed, filters.ageMin, filters.ageMax]);

  const handleFilterChange = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const { pets: list, pagination } = data;
  const totalPages = pagination.pages || 1;

  return (
    <div className="home">
      <div className="hero">
        <h1>Find your new companion</h1>
        <p>Browse pets available for adoption</p>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name or breed..."
          value={filters.search}
          onChange={(e) => handleFilterChange("search", e.target.value)}
          className="filter-search"
        />
        <select
          value={filters.species}
          onChange={(e) => handleFilterChange("species", e.target.value)}
        >
          <option value="">All species</option>
          {filterOptions.species.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={filters.breed}
          onChange={(e) => handleFilterChange("breed", e.target.value)}
        >
          <option value="">All breeds</option>
          {filterOptions.breeds.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Min age"
          min="0"
          value={filters.ageMin}
          onChange={(e) => handleFilterChange("ageMin", e.target.value)}
          className="filter-age"
        />
        <input
          type="number"
          placeholder="Max age"
          min="0"
          value={filters.ageMax}
          onChange={(e) => handleFilterChange("ageMax", e.target.value)}
          className="filter-age"
        />
      </div>

      {loading ? (
        <div className="loading">Loading pets…</div>
      ) : list.length === 0 ? (
        <div className="empty">No pets found. Try adjusting filters.</div>
      ) : (
        <>
          <div className="pet-grid">
            {list.map((pet) => (
              <Link to={`/pet/${pet._id}`} key={pet._id} className="pet-card">
                <div className="pet-card-image">
                  {pet.imageUrl ? (
                    <img src={pet.imageUrl} alt={pet.name} />
                  ) : (
                    <div className="pet-placeholder">🐾</div>
                  )}
                </div>
                <div className="pet-card-body">
                  <h3>{pet.name}</h3>
                  <p>{pet.species} {pet.breed ? `· ${pet.breed}` : ""}</p>
                  <p className="pet-age">Age: {pet.age} years</p>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </button>
              <span>Page {page} of {totalPages}</span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
