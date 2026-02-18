import React from "react";

const SuperAdminDashboard = ({ user, logout }) => {
    return (
        <div style={{ padding: 40 }}>
            <h1>Super Admin Dashboard</h1>
            <p>Welcome {user?.name}</p>

            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default SuperAdminDashboard;
