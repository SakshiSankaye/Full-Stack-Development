import { useState, useEffect, useCallback } from "react";
import { formsAPI, responsesAPI } from "../../services/api";
import Spinner from "../shared/Spinner";
import Alert from "../shared/Alert";

/* ─── Star Rating Input ──────────────────────────────────── */
const StarRating = ({ value, onChange }) => (
  <div className="rating-stars">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={`star ${star <= value ? "filled" : "empty"}`}
        onClick={() => onChange(star)}
        title={`${star} star${star !== 1 ? "s" : ""}`}
      >
        ★
      </span>
    ))}
    {value > 0 && (
      <span style={{ fontSize: "0.82rem", color: "var(--text-muted)", alignSelf: "center", marginLeft: 6 }}>
        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
      </span>
    )}
  </div>
);

/* ─── Submit Feedback Modal ──────────────────────────────── */
const FeedbackModal = ({ form, onClose, onSubmitted }) => {
  const [answers, setAnswers] = useState(
    form.questions.map((q) => ({ questionId: q._id, value: q.type === "rating" ? 0 : "" }))
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const setAnswer = (qi, value) => {
    setAnswers((prev) => prev.map((a, i) => (i === qi ? { ...a, value } : a)));
  };

  const handleSubmit = async () => {
    setError("");
    // Validate required questions
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      const ans = answers[i];
      if (q.required) {
        if (q.type === "rating" && (!ans.value || ans.value === 0))
          return setError(`Please rate question ${i + 1}: "${q.text}"`);
        if (q.type !== "rating" && !String(ans.value).trim())
          return setError(`Please answer question ${i + 1}: "${q.text}"`);
      }
    }

    setLoading(true);
    try {
      await responsesAPI.submit({ formId: form._id, answers });
      setSuccess(true);
      setTimeout(() => { onSubmitted(); }, 1800);
    } catch (e) {
      setError(e.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="modal-overlay">
        <div className="modal" style={{ textAlign: "center", padding: "48px 28px", maxWidth: 420 }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>🎉</div>
          <h2 style={{ marginBottom: 8 }}>Thank You!</h2>
          <p>Your feedback has been submitted successfully.</p>
          <div style={{ marginTop: 16, fontSize: "0.85rem", color: "var(--text-muted)" }}>Closing…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal-header">
          <div>
            <h3>{form.title}</h3>
            {form.description && (
              <p style={{ fontSize: "0.85rem", margin: "4px 0 0", color: "var(--text-muted)" }}>
                {form.description}
              </p>
            )}
          </div>
          <button className="modal-close" onClick={onClose} disabled={loading}>×</button>
        </div>

        <Alert type="error" message={error} onClose={() => setError("")} />

        <div>
          {form.questions.map((q, qi) => (
            <div key={q._id} style={{
              padding: "16px 0",
              borderBottom: qi < form.questions.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 10, display: "flex", gap: 6, alignItems: "flex-start" }}>
                <span style={{
                  background: "var(--primary-light)", color: "var(--primary-dark)",
                  borderRadius: "50%", width: 22, height: 22, display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: "0.75rem",
                  fontWeight: 700, flexShrink: 0, marginTop: 1,
                }}>
                  {qi + 1}
                </span>
                {q.text}
                {q.required && <span style={{ color: "var(--danger)", marginLeft: 2 }}>*</span>}
              </div>

              {q.type === "rating" && (
                <StarRating
                  value={answers[qi]?.value || 0}
                  onChange={(val) => setAnswer(qi, val)}
                />
              )}

              {q.type === "text" && (
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Type your answer here…"
                  value={answers[qi]?.value || ""}
                  onChange={(e) => setAnswer(qi, e.target.value)}
                />
              )}

              {q.type === "multiple_choice" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {q.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setAnswer(qi, opt)}
                      style={{
                        padding: "8px 16px", borderRadius: 20,
                        border: `2px solid ${answers[qi]?.value === opt ? "var(--primary)" : "var(--border)"}`,
                        background: answers[qi]?.value === opt ? "var(--primary-light)" : "var(--surface)",
                        color: answers[qi]?.value === opt ? "var(--primary-dark)" : "var(--text-primary)",
                        cursor: "pointer", fontWeight: 500, fontSize: "0.875rem",
                        transition: "all 0.15s",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting…" : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
const StudentForms = () => {
  const [forms, setForms] = useState([]);
  const [submittedIds, setSubmittedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState(null);
  const [alert, setAlert] = useState(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      const [fRes, sRes] = await Promise.all([
        formsAPI.getAll(),
        responsesAPI.getSubmittedFormIds(),
      ]);
      setForms(fRes.data.forms);
      setSubmittedIds(sRes.data.submittedIds);
    } catch {
      setAlert({ type: "error", message: "Failed to load forms." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmitted = () => {
    setActiveForm(null);
    setAlert({ type: "success", message: "✅ Feedback submitted successfully!" });
    load();
  };

  const filtered = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h1>📝 Available Forms</h1>
        <p>Select a form below to submit your feedback.</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="card" style={{ marginBottom: 20 }}>
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="Search forms…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{search ? "No matching forms" : "No forms available"}</h3>
            <p>{search ? "Try a different search term." : "Check back later — your admin will publish forms soon."}</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
          {filtered.map((f) => {
            const done = submittedIds.includes(f._id);
            return (
              <div key={f._id} className="card" style={{
                display: "flex", flexDirection: "column",
                borderTop: `3px solid ${done ? "var(--success)" : "var(--primary)"}`,
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h3 style={{ margin: 0, fontSize: "1rem", lineHeight: 1.4 }}>{f.title}</h3>
                    <span className={`badge ${done ? "badge-success" : "badge-primary"}`} style={{ flexShrink: 0, marginLeft: 8 }}>
                      {done ? "✓ Done" : "Pending"}
                    </span>
                  </div>
                  {f.description && (
                    <p style={{ fontSize: "0.85rem", margin: "0 0 12px", color: "var(--text-muted)" }}>
                      {f.description}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 12, fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 16 }}>
                    <span>📋 {f.questions.length} questions</span>
                    <span>📅 {new Date(f.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  className={`btn btn-full ${done ? "btn-secondary" : "btn-primary"}`}
                  onClick={() => !done && setActiveForm(f)}
                  disabled={done}
                >
                  {done ? "✅ Already Submitted" : "Fill Feedback →"}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeForm && (
        <FeedbackModal
          form={activeForm}
          onClose={() => setActiveForm(null)}
          onSubmitted={handleSubmitted}
        />
      )}
    </>
  );
};

export default StudentForms;
