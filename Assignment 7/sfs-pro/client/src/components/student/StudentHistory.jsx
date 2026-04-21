import { useState, useEffect } from "react";
import { responsesAPI } from "../../services/api";
import Spinner from "../shared/Spinner";
import Alert from "../shared/Alert";

const ResponseCard = ({ response }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <h3 style={{ margin: 0, fontSize: "1rem" }}>
            {response.formId?.title || "Deleted Form"}
          </h3>
          <div style={{ display: "flex", gap: 16, marginTop: 6, fontSize: "0.82rem", color: "var(--text-muted)" }}>
            <span>📅 {new Date(response.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            <span>💬 {response.answers.length} answers</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {response.averageRating > 0 && (
            <span className="badge badge-warning">⭐ {response.averageRating}/5</span>
          )}
          <span style={{ color: "var(--text-muted)", fontSize: "1.1rem", transition: "transform 0.2s", transform: expanded ? "rotate(180deg)" : "none" }}>
            ▼
          </span>
        </div>
      </div>

      {expanded && (
        <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
          {response.answers.map((ans, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 8 }}>
                Q{i + 1}. {ans.questionText}
              </div>
              {ans.questionType === "rating" ? (
                <div style={{ display: "flex", gap: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ fontSize: "1.3rem", color: star <= ans.value ? "#f59e0b" : "#d1d5db" }}>★</span>
                  ))}
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", alignSelf: "center", marginLeft: 8 }}>
                    {ans.value}/5 — {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][ans.value]}
                  </span>
                </div>
              ) : (
                <div style={{
                  background: "var(--surface2)", padding: "10px 14px",
                  borderRadius: 8, fontSize: "0.9rem",
                  border: "1px solid var(--border)", color: "var(--text-primary)",
                }}>
                  {ans.value || <em style={{ color: "var(--text-muted)" }}>No answer provided</em>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const StudentHistory = () => {
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    responsesAPI.getMyResponses()
      .then((res) => setResponses(res.data.responses))
      .catch(() => setError("Failed to load your submissions."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>📚 My Submissions</h1>
        <p>A history of all feedback forms you have submitted.</p>
      </div>

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <Spinner />
      ) : responses.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No submissions yet</h3>
            <p>You haven't submitted any feedback forms yet. Head to <strong>Available Forms</strong> to get started.</p>
          </div>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: 16, fontSize: "0.875rem", color: "var(--text-muted)" }}>
            {responses.length} submission{responses.length !== 1 ? "s" : ""} — click any card to expand
          </div>
          {responses.map((r) => (
            <ResponseCard key={r._id} response={r} />
          ))}
        </>
      )}
    </>
  );
};

export default StudentHistory;
