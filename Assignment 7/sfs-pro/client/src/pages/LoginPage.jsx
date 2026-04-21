import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import Alert from "../components/shared/Alert";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });

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
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-layout">
      <div className="auth-container">
        <div className="auth-card">

          <div className="auth-logo">
            <div className="logo-icon">🎓</div>
            <h1>Welcome Back</h1>
            <p>Sign in to Student Feedback System</p>
          </div>

          <Alert type="error" message={error} onClose={() => setError("")} />

          <div className="form-group">
            <label>Email Address</label>
            <input
              className="form-control"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="form-control"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary btn-full btn-lg"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <div className="auth-divider">or</div>

          <div className="auth-footer">
            Don't have an account?{" "}
            <Link to="/register">Register here</Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginPage;