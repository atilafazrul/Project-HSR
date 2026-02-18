import React from "react";

const AdminDashboard = ({ user, logout }) => {
    return (
        <div style={{ padding: 40 }}>
            <h1 style={{ color: "blue" }}>Admin Dashboard</h1>

            <p>Welcome {user?.name}</p>
            <p><strong>Role:</strong> {user?.role}</p>

            <hr />

            <h3>Admin Menu</h3>

            <ul>
                <li>✔ Manage Users</li>
                <li>✔ View Reports</li>
                <li>❌ Cannot Manage Admin Accounts</li>
                <li>❌ Cannot Access System Settings</li>
            </ul>

            <br />
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default AdminDashboard;
