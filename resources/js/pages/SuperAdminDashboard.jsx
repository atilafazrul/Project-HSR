import React from "react";

const SuperAdminDashboard = ({ user, logout }) => {
    return (
        <div style={{ padding: 40 }}>
            <h1 style={{ color: "red" }}>Super Admin Dashboard</h1>

            <p>Welcome {user?.name}</p>
            <p><strong>Role:</strong> {user?.role}</p>

            <hr />

            <h3>Management Menu</h3>

            <ul>
                <li>✔ Manage Admin Accounts</li>
                <li>✔ Manage Users</li>
                <li>✔ System Settings</li>
                <li>✔ View All Reports</li>
                <li>✔ Delete Any Data</li>
            </ul>

            <br />
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default SuperAdminDashboard;
