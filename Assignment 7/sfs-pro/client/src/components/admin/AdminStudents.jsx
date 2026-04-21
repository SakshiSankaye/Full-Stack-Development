import { useState, useEffect } from "react";
import { authAPI } from "../../services/api";
import Spinner from "../shared/Spinner";
import Alert from "../shared/Alert";

const AdminStudents = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    authAPI.getAllUsers()
      .then((res) => setUsers(res.data.users))
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const students = users.filter(
    (u) =>
      u.role === "student" &&
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()))
  );

  const admins = users.filter((u) => u.role === "admin");

  return (
    <>
      <div className="page-header">
        <h1>👥 Students</h1>
        <p>All registered users in the system.</p>
      </div>

      {error && <Alert type="error" message={error} />}

      <div className="stats-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card">
          <div className="stat-icon blue">👥</div>
          <div><div className="stat-value">{users.filter(u => u.role === "student").length}</div><div className="stat-label">Total Students</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">🛡️</div>
          <div><div className="stat-value">{admins.length}</div><div className="stat-label">Admins</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div>
            <div className="stat-value">{users.filter(u => u.isActive).length}</div>
            <div className="stat-label">Active Users</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Student Accounts</h3>
          <div className="search-bar" style={{ maxWidth: 280 }}>
            <span>🔍</span>
            <input placeholder="Search by name or email…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>{search ? "No matching students" : "No students registered"}</h3>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Registered</th>
                  <th>Last Login</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((u) => {
                  const initials = u.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
                  return (
                    <tr key={u._id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: "var(--primary-light)", color: "var(--primary-dark)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: "0.78rem", flexShrink: 0,
                          }}>{initials}</div>
                          <span style={{ fontWeight: 600 }}>{u.name}</span>
                        </div>
                      </td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{u.email}</td>
                      <td style={{ fontSize: "0.85rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td style={{ fontSize: "0.85rem" }}>
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : <span style={{ color: "var(--text-muted)" }}>Never</span>}
                      </td>
                      <td>
                        <span className={`badge ${u.isActive ? "badge-success" : "badge-danger"}`}>
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminStudents;
