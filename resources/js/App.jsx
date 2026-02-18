import React, { useState, useEffect } from "react";
import Login from "./pages/Login.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ambil user dari localStorage saat pertama load
    useEffect(() => {
        try {
            const savedUser = localStorage.getItem("user");

            if (savedUser) {
                const parsedUser = JSON.parse(savedUser);

                // Jika role tidak valid → hapus
                if (
                    parsedUser.role === "super_admin" ||
                    parsedUser.role === "admin"
                ) {
                    setUser(parsedUser);
                } else {
                    localStorage.removeItem("user");
                }
            }
        } catch (error) {
            console.error("Error parsing user:", error);
            localStorage.removeItem("user");
        }

        setLoading(false);
    }, []);

    // Simpan user saat login
    const handleSetUser = (userData) => {
        if (
            userData.role === "super_admin" ||
            userData.role === "admin"
        ) {
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData));
        } else {
            alert("Role tidak valid");
        }
    };

    // Logout
    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };

    if (loading) {
        return <div style={{ padding: 40 }}>Loading...</div>;
    }

    // Jika belum login
    if (!user) {
        return <Login setUser={handleSetUser} />;
    }

    // Super Admin
    if (user.role === "super_admin") {
        return (
            <SuperAdminDashboard
                user={user}
                logout={handleLogout}
            />
        );
    }

    // Admin
    if (user.role === "admin") {
        return (
            <AdminDashboard
                user={user}
                logout={handleLogout}
            />
        );
    }

    // Jika role aneh → reset
    handleLogout();
    return <Login setUser={handleSetUser} />;
}
