import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import Alert from "../components/shared/Alert";

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    role: "student" // default role
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const setField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    setError("");

    const { name, email, password, confirm, role } = form;

    if (!name || !email || !password || !confirm || !role) {
      setError("All fields are required.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await authAPI.register({
        name: name.trim(),
        email,
        password,
        role // 🔥 send role
      });

      const { user, token } = res.data;

      // Save user + token
      login(user, token);

      // 🔥 Role-based redirect
      if (user.role === "admin") {
        navigate("/admin-dashboard", { replace: true });
      } else {
        navigate("/student-dashboard", { replace: true });
      }

    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-logo">
            <div className="logo-icon">📝</div>
            <h1>Create Account</h1>
            <p>Join the Student Feedback System</p>
          </div>

          <Alert type="error" message={error} onClose={() => setError("")} />

          <div className="form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              type="text"
              placeholder="Enter your full name"
              value={form.name}
              onChange={setField("name")}
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={setField("email")}
            />
          </div>

          {/* 🔥 ROLE SELECTION */}
          <div className="form-group">
            <label>Select Role</label>
            <select
              className="form-control"
              value={form.role}
              onChange={setField("role")}
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={setField("password")}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Confirm password"
              value={form.confirm}
              onChange={setField("confirm")}
            />
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating account…" : "Register"}
          </button>

          <div className="auth-footer">
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default RegisterPage;