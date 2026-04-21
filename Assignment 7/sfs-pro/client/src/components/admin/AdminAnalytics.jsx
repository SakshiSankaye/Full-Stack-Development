import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { responsesAPI } from "../../services/api";
import Spinner from "../shared/Spinner";
import Alert from "../shared/Alert";

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const CHART_COLORS = ["#4f46e5","#06b6d4","#10b981","#f59e0b","#ef4444","#8b5cf6","#ec4899"];
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { position: "bottom", labels: { font: { size: 12 }, padding: 16 } } },
};

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    responsesAPI.getAnalytics()
      .then((res) => setAnalytics(res.data.analytics))
      .catch(() => setError("Failed to load analytics data."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (error) return <Alert type="error" message={error} />;

  const { totalResponses, totalForms, overallAvgRating, responsesPerForm, dailyTrend, ratingDistribution } = analytics;

  /* ── Chart data ── */
  const barData = {
    labels: responsesPerForm.map((r) => r.formTitle.length > 25 ? r.formTitle.slice(0, 25) + "…" : r.formTitle),
    datasets: [{
      label: "Total Responses",
      data: responsesPerForm.map((r) => r.count),
      backgroundColor: CHART_COLORS,
      borderRadius: 6,
    }],
  };

  const avgRatingData = {
    labels: responsesPerForm.filter((r) => r.avgRating > 0).map((r) =>
      r.formTitle.length > 20 ? r.formTitle.slice(0, 20) + "…" : r.formTitle
    ),
    datasets: [{
      label: "Average Rating",
      data: responsesPerForm.filter((r) => r.avgRating > 0).map((r) => r.avgRating),
      backgroundColor: "#4f46e580",
      borderColor: "#4f46e5",
      borderWidth: 2,
      borderRadius: 6,
    }],
  };

  const trendData = {
    labels: dailyTrend.map((d) => {
      const date = new Date(d._id);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }),
    datasets: [{
      label: "Responses",
      data: dailyTrend.map((d) => d.count),
      borderColor: "#4f46e5",
      backgroundColor: "rgba(79,70,229,0.08)",
      borderWidth: 2,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointBackgroundColor: "#4f46e5",
    }],
  };

  const doughnutData = {
    labels: ratingDistribution.map((r) => `${r._id} Star${r._id !== 1 ? "s" : ""}`),
    datasets: [{
      data: ratingDistribution.map((r) => r.count),
      backgroundColor: ["#ef4444","#f59e0b","#eab308","#22c55e","#10b981"],
      borderWidth: 2,
      borderColor: "#fff",
    }],
  };

  return (
    <>
      <div className="page-header">
        <h1>📈 Analytics</h1>
        <p>Visual insights from all student feedback data.</p>
      </div>

      {/* KPI row */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-icon blue">💬</div>
          <div><div className="stat-value">{totalResponses}</div><div className="stat-label">Total Responses</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📋</div>
          <div><div className="stat-value">{totalForms}</div><div className="stat-label">Active Forms</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">⭐</div>
          <div>
            <div className="stat-value">{overallAvgRating > 0 ? `${overallAvgRating}/5` : "—"}</div>
            <div className="stat-label">Overall Avg Rating</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📊</div>
          <div>
            <div className="stat-value">
              {totalForms > 0 ? (totalResponses / totalForms).toFixed(1) : 0}
            </div>
            <div className="stat-label">Avg per Form</div>
          </div>
        </div>
      </div>

      {totalResponses === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No data yet</h3>
            <p>Analytics will appear here once students start submitting feedback.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>📊 Responses per Form</h3>
              <div style={{ height: 260 }}>
                <Bar
                  data={barData}
                  options={{
                    ...chartDefaults,
                    scales: {
                      y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f1f5f9" } },
                      x: { grid: { display: false } },
                    },
                    plugins: { ...chartDefaults.plugins, legend: { display: false } },
                  }}
                />
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 16 }}>⭐ Rating Distribution</h3>
              {ratingDistribution.length === 0 ? (
                <div className="empty-state" style={{ padding: "24px 0" }}>No rating data.</div>
              ) : (
                <div style={{ height: 260, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Doughnut data={doughnutData} options={{ ...chartDefaults, cutout: "65%" }} />
                </div>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div className="card">
              <h3 style={{ marginBottom: 16 }}>📅 Submission Trend (Last 30 Days)</h3>
              {dailyTrend.length === 0 ? (
                <div className="empty-state" style={{ padding: "24px 0" }}>No recent activity.</div>
              ) : (
                <div style={{ height: 240 }}>
                  <Line
                    data={trendData}
                    options={{
                      ...chartDefaults,
                      scales: {
                        y: { beginAtZero: true, ticks: { stepSize: 1 }, grid: { color: "#f1f5f9" } },
                        x: { grid: { display: false }, ticks: { maxTicksLimit: 8 } },
                      },
                      plugins: { ...chartDefaults.plugins, legend: { display: false } },
                    }}
                  />
                </div>
              )}
            </div>

            <div className="card">
              <h3 style={{ marginBottom: 16 }}>📈 Average Rating per Form</h3>
              {avgRatingData.labels.length === 0 ? (
                <div className="empty-state" style={{ padding: "24px 0" }}>No rating data yet.</div>
              ) : (
                <div style={{ height: 240 }}>
                  <Bar
                    data={avgRatingData}
                    options={{
                      ...chartDefaults,
                      scales: {
                        y: { beginAtZero: false, min: 0, max: 5, ticks: { stepSize: 1 }, grid: { color: "#f1f5f9" } },
                        x: { grid: { display: false } },
                      },
                      plugins: { ...chartDefaults.plugins, legend: { display: false } },
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Per-Form Breakdown Table */}
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>📋 Form Performance Summary</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Form Title</th>
                    <th>Total Responses</th>
                    <th>Avg Rating</th>
                    <th>Response Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {responsesPerForm.map((item) => (
                    <tr key={item._id}>
                      <td style={{ fontWeight: 600 }}>{item.formTitle}</td>
                      <td>{item.count}</td>
                      <td>
                        {item.avgRating > 0 ? (
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span>{item.avgRating}/5</span>
                            <div style={{ flex: 1, maxWidth: 80 }}>
                              <div className="progress-bar-bg" style={{ height: 6 }}>
                                <div className="progress-bar-fill" style={{ width: `${(item.avgRating / 5) * 100}%` }} />
                              </div>
                            </div>
                          </div>
                        ) : "—"}
                      </td>
                      <td>
                        <span className="badge badge-primary">
                          {totalResponses > 0 ? `${Math.round((item.count / totalResponses) * 100)}%` : "0%"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminAnalytics;
