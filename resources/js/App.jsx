import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";

import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import ITPage from "./pages/ITPage.jsx";
import ServicePage from "./pages/ServicePage.jsx";
import KontraktorPage from "./pages/KontraktorPage.jsx";

import FotoProjekPage from "./pages/FotoProjekPage.jsx"; // <<< TAMBAHAN


export default function App() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  /* ================= LOAD USER ================= */
  useEffect(() => {

    const savedUser = localStorage.getItem("user");

    if (savedUser) {

      try {

        const parsedUser = JSON.parse(savedUser);

        if (
          parsedUser.role === "super_admin" ||
          parsedUser.role === "admin" ||
          parsedUser.role === "it" ||
          parsedUser.role === "service" ||
          parsedUser.role === "kontraktor"
        ) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem("user");
        }

      } catch {
        localStorage.removeItem("user");
      }
    }

    setLoading(false);

  }, []);


  /* ================= SET USER ================= */
  const handleSetUser = (userData) => {

    if (
      userData.role === "super_admin" ||
      userData.role === "admin" ||
      userData.role === "it" ||
      userData.role === "service" ||
      userData.role === "kontraktor"
    ) {

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

    } else {

      alert("Role tidak valid");

    }

  };


  /* ================= LOGOUT ================= */
  const handleLogout = () => {

    setUser(null);
    localStorage.clear();

  };


  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }


  return (
    <Routes>

      {/* ================= LOGIN ================= */}
      <Route
        path="/"
        element={
          !user ? (
            <Login setUser={handleSetUser} />
          ) : user.role === "super_admin" ? (
            <Navigate to="/super_admin/dashboard" />
          ) : user.role === "admin" ? (
            <Navigate to="/admin/dashboard" />
          ) : user.role === "it" ? (
            <Navigate to="/it" />
          ) : user.role === "service" ? (
            <Navigate to="/service" />
          ) : user.role === "kontraktor" ? (
            <Navigate to="/kontraktor" />
          ) : (
            <Navigate to="/" />
          )
        }
      />


      {/* ================= SUPER ADMIN FOTO ================= */}
      <Route
        path="/super_admin/projek-kerja/foto/:id"
        element={
          user?.role === "super_admin" ? (
            <FotoProjekPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />


      {/* ================= SUPER ADMIN ================= */}
      <Route
        path="/super_admin/*"
        element={
          user?.role === "super_admin" ? (
            <SuperAdminDashboard user={user} logout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />


      {/* ================= ADMIN FOTO ================= */}
      <Route
        path="/admin/projek-kerja/foto/:id"
        element={
          user?.role === "admin" ? (
            <FotoProjekPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />


      {/* ================= ADMIN ================= */}
      <Route
        path="/admin/*"
        element={
          user?.role === "admin" ? (
            <AdminDashboard user={user} logout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />


      {/* ================= IT ================= */}
      <Route
        path="/it/*"
        element={
          user?.role === "it" ? (
            <ITPage user={user} logout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />


      {/* ================= SERVICE ================= */}
      <Route
        path="/service/*"
        element={
          user?.role === "service" ? (
            <ServicePage user={user} logout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />


      {/* ================= KONTRAKTOR ================= */}
      <Route
        path="/kontraktor/*"
        element={
          user?.role === "kontraktor" ? (
            <KontraktorPage user={user} logout={handleLogout} />
          ) : (
            <Navigate to="/" />
          )
        }
      />


      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}