import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { formsAPI, responsesAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../shared/Spinner";

const StudentHome = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [myResponses, setMyResponses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      formsAPI.getAll(),
      responsesAPI.getSubmittedFormIds(),
      responsesAPI.getMyResponses(),
    ]).then(([fRes, sRes, rRes]) => {
      setForms(fRes.data.forms);
      setSubmittedIds(sRes.data.submittedIds);
      setMyResponses(rRes.data.responses);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  const pending = forms.filter((f) => !submittedIds.includes(f._id));
  const completed = forms.filter((f) => submittedIds.includes(f._id));

  return (
    <>
      <div className="page-header">
        <h1>👋 Hello, {user?.name?.split(" ")[0]}!</h1>
        <p>Your feedback helps improve the learning experience for everyone.</p>
      </div>

      {/* Summary */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div><div className="stat-value">{forms.length}</div><div className="stat-label">Total Forms</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⏳</div>
          <div><div className="stat-value">{pending.length}</div><div className="stat-label">Pending</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div><div className="stat-value">{completed.length}</div><div className="stat-label">Completed</div></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Pending Forms */}
        <div className="card">
          <div className="card-header">
            <h3>⏳ Pending Forms</h3>
            <Link to="/student-dashboard/forms" className="btn btn-primary btn-sm">View All</Link>
          </div>
          {pending.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>🎉</div>
              <div style={{ fontWeight: 600, color: "var(--text-secondary)" }}>All caught up!</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>You've submitted all available forms.</div>
            </div>
          ) : (
            <div>
              {pending.slice(0, 4).map((f) => (
                <div key={f._id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: "1px solid var(--border)",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{f.title}</div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                      {f.questions.length} questions
                    </div>
                  </div>
                  <Link to="/student-dashboard/forms" className="btn btn-primary btn-sm">Fill →</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Submissions */}
        <div className="card">
          <div className="card-header">
            <h3>✅ Recent Submissions</h3>
            <Link to="/student-dashboard/history" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          {myResponses.length === 0 ? (
            <div className="empty-state" style={{ padding: "24px 0" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>📝</div>
              <div style={{ color: "var(--text-muted)" }}>No submissions yet.</div>
            </div>
          ) : (
            <div>
              {myResponses.slice(0, 4).map((r) => (
                <div key={r._id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "10px 0", borderBottom: "1px solid var(--border)",
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {r.formId?.title || "Deleted Form"}
                    </div>
                    <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                      {new Date(r.submittedAt).toLocaleDateString()}
                    </div>
                  </div>
                  {r.averageRating > 0 && (
                    <span className="badge badge-warning">⭐ {r.averageRating}/5</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentHome;
