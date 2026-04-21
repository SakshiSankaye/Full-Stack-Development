import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("sfs_token");
      localStorage.removeItem("sfs_user");
      delete api.defaults.headers.common["Authorization"];
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  getAllUsers: () => api.get("/auth/users"),
};

// ── Forms ─────────────────────────────────────────────────
export const formsAPI = {
  getAll: () => api.get("/forms"),
  getById: (id) => api.get(`/forms/${id}`),
  create: (data) => api.post("/forms", data),
  update: (id, data) => api.put(`/forms/${id}`, data),
  delete: (id) => api.delete(`/forms/${id}`),
};

// ── Responses ─────────────────────────────────────────────
export const responsesAPI = {
  submit: (data) => api.post("/responses", data),
  getMyResponses: () => api.get("/responses/my"),
  getSubmittedFormIds: () => api.get("/responses/submitted-forms"),
  getByForm: (formId, params) => api.get(`/responses/form/${formId}`, { params }),
  getAnalytics: () => api.get("/responses/analytics"),
  exportCSV: (formId) =>
    api.get(`/responses/export/${formId}`, { responseType: "blob" }),
};

export default api;
