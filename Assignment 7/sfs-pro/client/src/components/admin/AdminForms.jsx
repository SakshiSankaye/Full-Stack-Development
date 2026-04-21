import { useState, useEffect, useCallback } from "react";
import { formsAPI } from "../../services/api";
import Spinner from "../shared/Spinner";
import Alert from "../shared/Alert";

/* ─── Form Builder Modal ─────────────────────────────────── */
const EMPTY_QUESTION = { text: "", type: "rating", required: true, options: [""] };

const FormModal = ({ form, onClose, onSaved }) => {
  const editing = !!form;
  const [title, setTitle] = useState(form?.title || "");
  const [description, setDescription] = useState(form?.description || "");
  const [questions, setQuestions] = useState(
    form?.questions?.length
      ? form.questions.map((q) => ({
          ...q,
          options: q.options?.length ? q.options : [""],
        }))
      : [{ ...EMPTY_QUESTION }]
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addQuestion = () =>
    setQuestions((prev) => [...prev, { ...EMPTY_QUESTION, options: [""] }]);

  const removeQuestion = (i) =>
    setQuestions((prev) => prev.filter((_, idx) => idx !== i));

  const updateQuestion = (i, field, value) =>
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === i ? { ...q, [field]: value } : q))
    );

  const addOption = (qi) =>
    setQuestions((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, options: [...q.options, ""] } : q))
    );

  const updateOption = (qi, oi, val) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi
          ? { ...q, options: q.options.map((o, j) => (j === oi ? val : o)) }
          : q
      )
    );

  const removeOption = (qi, oi) =>
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qi ? { ...q, options: q.options.filter((_, j) => j !== oi) } : q
      )
    );

  const handleSave = async () => {
    setError("");
    if (!title.trim()) return setError("Form title is required.");
    if (questions.some((q) => !q.text.trim()))
      return setError("All questions must have text.");
    if (
      questions.some(
        (q) =>
          q.type === "multiple_choice" &&
          (q.options.length === 0 || q.options.some((o) => !o.trim()))
      )
    )
      return setError("Multiple choice questions need at least one non-empty option.");

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        questions: questions.map((q, i) => ({
          text: q.text.trim(),
          type: q.type,
          required: q.required,
          order: i,
          options:
            q.type === "multiple_choice"
              ? q.options.filter((o) => o.trim())
              : [],
        })),
      };
      if (editing) {
        await formsAPI.update(form._id, payload);
      } else {
        await formsAPI.create(payload);
      }
      onSaved();
    } catch (e) {
      setError(e.response?.data?.message || "Failed to save form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 680 }}>
        <div className="modal-header">
          <h3>{editing ? "✏️ Edit Form" : "➕ Create New Form"}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <Alert type="error" message={error} onClose={() => setError("")} />

        <div className="form-group">
          <label>Form Title <span className="required">*</span></label>
          <input className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Faculty Feedback – Semester 1" />
        </div>

        <div className="form-group">
          <label>Description <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span></label>
          <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of this feedback form…" rows={2} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <label style={{ fontWeight: 600, fontSize: "0.875rem" }}>Questions <span className="required">*</span></label>
            <button className="btn btn-secondary btn-sm" onClick={addQuestion}>+ Add Question</button>
          </div>

          {questions.map((q, qi) => (
            <div key={qi} style={{
              border: "1.5px solid var(--border)", borderRadius: 10,
              padding: 16, marginBottom: 12, background: "var(--surface2)"
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", background: "var(--primary)",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: "0.8rem", flexShrink: 0, marginTop: 6
                }}>
                  {qi + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <input
                    className="form-control"
                    placeholder="Question text…"
                    value={q.text}
                    onChange={(e) => updateQuestion(qi, "text", e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <select
                      className="form-control"
                      value={q.type}
                      onChange={(e) => updateQuestion(qi, "type", e.target.value)}
                      style={{ width: "auto" }}
                    >
                      <option value="rating">⭐ Rating (1–5)</option>
                      <option value="text">📝 Text Answer</option>
                      <option value="multiple_choice">☑️ Multiple Choice</option>
                    </select>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 500, fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={(e) => updateQuestion(qi, "required", e.target.checked)}
                      />
                      Required
                    </label>
                  </div>

                  {q.type === "multiple_choice" && (
                    <div style={{ marginTop: 10 }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Options:</div>
                      {q.options.map((opt, oi) => (
                        <div key={oi} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                          <input
                            className="form-control"
                            placeholder={`Option ${oi + 1}`}
                            value={opt}
                            onChange={(e) => updateOption(qi, oi, e.target.value)}
                          />
                          {q.options.length > 1 && (
                            <button className="btn btn-secondary btn-sm btn-icon" onClick={() => removeOption(qi, oi)}>✕</button>
                          )}
                        </div>
                      ))}
                      <button className="btn btn-secondary btn-sm" onClick={() => addOption(qi)}>+ Option</button>
                    </div>
                  )}
                </div>
                {questions.length > 1 && (
                  <button className="btn btn-danger btn-sm btn-icon" onClick={() => removeQuestion(qi)} title="Remove question">🗑</button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? "Saving…" : editing ? "Save Changes" : "Create Form"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main AdminForms Component ──────────────────────────── */
const AdminForms = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingForm, setEditingForm] = useState(null);
  const [alert, setAlert] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadForms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await formsAPI.getAll();
      setForms(res.data.forms);
    } catch {
      setAlert({ type: "error", message: "Failed to load forms." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadForms(); }, [loadForms]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this form and ALL its responses? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await formsAPI.delete(id);
      setAlert({ type: "success", message: "Form deleted successfully." });
      loadForms();
    } catch {
      setAlert({ type: "error", message: "Failed to delete form." });
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleActive = async (form) => {
    try {
      await formsAPI.update(form._id, { isActive: !form.isActive });
      loadForms();
    } catch {
      setAlert({ type: "error", message: "Failed to update form status." });
    }
  };

  const handleSaved = () => {
    setShowModal(false);
    setEditingForm(null);
    setAlert({ type: "success", message: editingForm ? "Form updated!" : "Form created!" });
    loadForms();
  };

  const filtered = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <h1>📋 Feedback Forms</h1>
        <p>Create and manage all feedback forms for students.</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      <div className="card">
        <div className="card-header">
          <div className="search-bar" style={{ flex: 1, maxWidth: 320 }}>
            <span>🔍</span>
            <input
              placeholder="Search forms…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingForm(null); setShowModal(true); }}>
            + Create Form
          </button>
        </div>

        {loading ? (
          <Spinner />
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>{search ? "No matching forms" : "No forms yet"}</h3>
            <p>{search ? "Try a different search term." : "Create your first feedback form to get started."}</p>
            {!search && (
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowModal(true)}>
                Create Form
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Questions</th>
                  <th>Responses</th>
                  <th>Created</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{f.title}</div>
                      {f.description && (
                        <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>
                          {f.description.slice(0, 60)}{f.description.length > 60 ? "…" : ""}
                        </div>
                      )}
                    </td>
                    <td>{f.questions.length}</td>
                    <td>{f.responseCount}</td>
                    <td style={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>
                      {new Date(f.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${f.isActive ? "badge-success" : "badge-gray"}`}>
                        {f.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => { setEditingForm(f); setShowModal(true); }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleToggleActive(f)}
                          title={f.isActive ? "Deactivate" : "Activate"}
                        >
                          {f.isActive ? "⏸" : "▶️"}
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(f._id)}
                          disabled={deletingId === f._id}
                        >
                          {deletingId === f._id ? "…" : "🗑"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <FormModal
          form={editingForm}
          onClose={() => { setShowModal(false); setEditingForm(null); }}
          onSaved={handleSaved}
        />
      )}
    </>
  );
};

export default AdminForms;
