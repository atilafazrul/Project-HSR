import React from "react";

const AdminDashboard = ({ user, logout }) => {
    return (
        <div style={{ padding: 40 }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome {user?.name}</p>

            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
