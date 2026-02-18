import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PetDetail from "./pages/PetDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyApplications from "./pages/MyApplications";
import AdminPets from "./pages/admin/AdminPets";
import AdminApplications from "./pages/admin/AdminApplications";
import "./App.css";

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading">Loading…</div>;
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pet/:id" element={<PetDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/my-applications" element={<MyApplications />} />
            <Route
              path="/admin/pets"
              element={
                <AdminRoute>
                  <AdminPets />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/applications"
              element={
                <AdminRoute>
                  <AdminApplications />
                </AdminRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
