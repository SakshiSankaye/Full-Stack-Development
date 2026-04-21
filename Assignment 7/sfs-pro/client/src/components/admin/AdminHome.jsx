import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formsAPI, responsesAPI, authAPI } from "../../services/api";
import Spinner from "../shared/Spinner";
import { useAuth } from "../../context/AuthContext";

const StatCard = ({ icon, label, value, color, to }) => (
  <Link to={to} style={{ textDecoration: "none" }}>
    <div className="stat-card" style={{ cursor: "pointer" }}>
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  </Link>
);

const AdminHome = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [formsRes, analyticsRes, usersRes] = await Promise.all([
          formsAPI.getAll(),
          responsesAPI.getAnalytics(),
          authAPI.getAllUsers(),
        ]);
        setData({
          forms: formsRes.data.forms,
          analytics: analyticsRes.data.analytics,
          users: usersRes.data.users,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const students = data.users.filter((u) => u.role === "student");
  const { analytics, forms } = data;

  return (
    <>
      <div className="page-header">
        <h1>👋 Welcome back, {user?.name?.split(" ")[0]}!</h1>
        <p>Here's what's happening with your feedback system today.</p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <StatCard icon="📋" label="Total Forms" value={forms.length} color="blue" to="/admin-dashboard/forms" />
        <StatCard icon="💬" label="Total Responses" value={analytics.totalResponses} color="green" to="/admin-dashboard/responses" />
        <StatCard icon="👥" label="Students" value={students.length} color="purple" to="/admin-dashboard/students" />
        <StatCard
          icon="⭐"
          label="Avg Rating"
          value={analytics.overallAvgRating ? `${analytics.overallAvgRating}/5` : "—"}
          color="orange"
          to="/admin-dashboard/analytics"
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Forms */}
        <div className="card">
          <div className="card-header">
            <h3>📋 Recent Forms</h3>
            <Link to="/admin-dashboard/forms" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {forms.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <div>No forms yet.</div>
              <Link to="/admin-dashboard/forms" className="btn btn-primary btn-sm" style={{ marginTop: 10 }}>
                Create Form
              </Link>
            </div>
          ) : (
            <div>
              {forms.slice(0, 5).map((f) => (
                <div
                  key={f._id}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0", borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                      {f.questions.length} questions · {f.responseCount} responses
                    </div>
                  </div>
                  <span className={`badge ${f.isActive ? "badge-success" : "badge-gray"}`}>
                    {f.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Responses Per Form */}
        <div className="card">
          <div className="card-header">
            <h3>📊 Responses Per Form</h3>
            <Link to="/admin-dashboard/analytics" className="btn btn-secondary btn-sm">Full Analytics</Link>
          </div>
          {analytics.responsesPerForm.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>No responses yet.</div>
          ) : (
            <div>
              {analytics.responsesPerForm.slice(0, 5).map((item) => (
                <div key={item._id} style={{ marginBottom: 14 }}>
                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    fontSize: "0.85rem", marginBottom: 5,
                  }}>
                    <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{item.formTitle}</span>
                    <span style={{ color: "var(--text-muted)" }}>{item.count} responses</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${Math.min(100, (item.count / (analytics.totalResponses || 1)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Daily Trend */}
      {analytics.dailyTrend.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="card-header">
            <h3>📅 Last 30 Days Activity</h3>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 80 }}>
            {analytics.dailyTrend.map((d) => {
              const max = Math.max(...analytics.dailyTrend.map((x) => x.count));
              const h = max > 0 ? Math.max(6, (d.count / max) * 72) : 6;
              return (
                <div key={d._id} title={`${d._id}: ${d.count} responses`}
                  style={{
                    flex: 1, height: h, background: "var(--primary)",
                    borderRadius: "3px 3px 0 0", opacity: 0.75,
                    minWidth: 6, cursor: "default",
                    transition: "opacity .15s",
                  }}
                  onMouseEnter={(e) => (e.target.style.opacity = 1)}
                  onMouseLeave={(e) => (e.target.style.opacity = 0.75)}
                />
              );
            })}
          </div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 6, textAlign: "right" }}>
            Past 30 days · hover bars for details
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHome;
