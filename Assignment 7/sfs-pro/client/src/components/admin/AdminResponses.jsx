import { useState, useEffect, useCallback } from "react";
import { formsAPI, responsesAPI } from "../../services/api";
import Spinner from "../shared/Spinner";
import Alert from "../shared/Alert";

/* ─── Response Detail Modal ─────────────────────────────── */
const ResponseModal = ({ response, onClose }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="modal-header">
        <h3>💬 Response Details</h3>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      <div style={{ marginBottom: 16, padding: "12px 16px", background: "var(--surface2)", borderRadius: 8 }}>
        <div style={{ fontWeight: 600 }}>{response.studentName}</div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>{response.studentEmail}</div>
        <div style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: 4 }}>
          Submitted: {new Date(response.submittedAt).toLocaleString()}
        </div>
        {response.averageRating > 0 && (
          <div style={{ marginTop: 6 }}>
            <span className="badge badge-warning">⭐ Avg Rating: {response.averageRating}/5</span>
          </div>
        )}
      </div>

      <div>
        {response.answers.map((ans, i) => (
          <div key={i} style={{
            padding: "12px 0", borderBottom: "1px solid var(--border)",
          }}>
            <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              Q{i + 1}. {ans.questionText}
            </div>
            {ans.questionType === "rating" ? (
              <div style={{ display: "flex", gap: 4 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} style={{ fontSize: "1.2rem", color: star <= ans.value ? "#f59e0b" : "#d1d5db" }}>★</span>
                ))}
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: 6, alignSelf: "center" }}>
                  {ans.value}/5
                </span>
              </div>
            ) : (
              <div style={{
                background: "var(--surface2)", padding: "8px 12px", borderRadius: 6,
                fontSize: "0.9rem", color: "var(--text-primary)"
              }}>
                {ans.value || <em style={{ color: "var(--text-muted)" }}>No answer</em>}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
const AdminResponses = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");
  const [responses, setResponses] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formsLoading, setFormsLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [viewingResponse, setViewingResponse] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    formsAPI.getAll().then((res) => {
      setForms(res.data.forms);
      if (res.data.forms.length > 0) setSelectedForm(res.data.forms[0]._id);
    }).finally(() => setFormsLoading(false));
  }, []);

  const loadResponses = useCallback(async () => {
    if (!selectedForm) return;
    setLoading(true);
    try {
      const res = await responsesAPI.getByForm(selectedForm, { search, startDate, endDate, page, limit: 20 });
      setResponses(res.data.responses);
      setTotal(res.data.total);
      setPages(res.data.pages);
    } catch {
      setAlert({ type: "error", message: "Failed to load responses." });
    } finally {
      setLoading(false);
    }
  }, [selectedForm, search, startDate, endDate, page]);

  useEffect(() => { loadResponses(); }, [loadResponses]);
  useEffect(() => { setPage(1); }, [selectedForm, search, startDate, endDate]);

  const handleExport = async () => {
    if (!selectedForm) return;
    setExporting(true);
    try {
      const res = await responsesAPI.exportCSV(selectedForm);
      const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const a = document.createElement("a");
      const formTitle = forms.find((f) => f._id === selectedForm)?.title || "responses";
      a.href = url;
      a.download = `${formTitle.replace(/[^a-z0-9]/gi, "_")}_responses.csv`;
      a.click();
      URL.revokeObjectURL(url);
      setAlert({ type: "success", message: "CSV exported successfully!" });
    } catch {
      setAlert({ type: "error", message: "No responses to export or export failed." });
    } finally {
      setExporting(false);
    }
  };

  if (formsLoading) return <Spinner />;

  return (
    <>
      <div className="page-header">
        <h1>💬 Student Responses</h1>
        <p>View, search, filter, and export student feedback responses.</p>
      </div>

      {alert && <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />}

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12, alignItems: "end" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Select Form</label>
            <select className="form-control" value={selectedForm} onChange={(e) => setSelectedForm(e.target.value)}>
              {forms.map((f) => <option key={f._id} value={f._id}>{f.title}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Start Date</label>
            <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>End Date</label>
            <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 12, alignItems: "center" }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <span>🔍</span>
            <input placeholder="Search by student name…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {(search || startDate || endDate) && (
            <button className="btn btn-secondary btn-sm" onClick={() => { setSearch(""); setStartDate(""); setEndDate(""); }}>
              Clear Filters
            </button>
          )}
          <button className="btn btn-success btn-sm" onClick={handleExport} disabled={exporting || responses.length === 0}>
            {exporting ? "Exporting…" : "⬇️ Export CSV"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>
            {total > 0 ? `${total} Response${total !== 1 ? "s" : ""}` : "Responses"}
          </h3>
        </div>

        {loading ? (
          <Spinner />
        ) : responses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <h3>No responses found</h3>
            <p>{search || startDate || endDate ? "Try adjusting your filters." : "No students have submitted this form yet."}</p>
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Avg Rating</th>
                    <th>Submitted</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((r) => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 600 }}>{r.studentName}</td>
                      <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{r.studentEmail}</td>
                      <td>
                        {r.averageRating > 0 ? (
                          <span className="badge badge-warning">⭐ {r.averageRating}/5</span>
                        ) : (
                          <span className="badge badge-gray">Text only</span>
                        )}
                      </td>
                      <td style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {new Date(r.submittedAt).toLocaleDateString()}
                      </td>
                      <td>
                        <button className="btn btn-secondary btn-sm" onClick={() => setViewingResponse(r)}>
                          👁 View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 16 }}>
                <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
                <span style={{ fontSize: "0.875rem", color: "var(--text-muted)" }}>Page {page} of {pages}</span>
                <button className="btn btn-secondary btn-sm" disabled={page === pages} onClick={() => setPage((p) => p + 1)}>Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {viewingResponse && (
        <ResponseModal response={viewingResponse} onClose={() => setViewingResponse(null)} />
      )}
    </>
  );
};

export default AdminResponses;
