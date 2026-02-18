import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-inner">
          <Link to="/" className="nav-logo">Pet Adoption</Link>
          <div className="nav-links">
            <Link to="/">Pets</Link>
            {user ? (
              <>
                <Link to="/my-applications">My Applications</Link>
                {isAdmin && (
                  <>
                    <Link to="/admin/pets">Manage Pets</Link>
                    <Link to="/admin/applications">Applications</Link>
                  </>
                )}
                <button type="button" className="nav-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register" className="nav-register">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </>
  );
}
