import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNav = () => (
  <>
    <span className="nav-section-label">Overview</span>
    <NavLink to="/admin-dashboard" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon">📊</span> Dashboard
    </NavLink>

    <span className="nav-section-label">Management</span>
    <NavLink to="/admin-dashboard/forms" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon">📋</span> Feedback Forms
    </NavLink>
    <NavLink to="/admin-dashboard/responses" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon">💬</span> Responses
    </NavLink>
    <NavLink to="/admin-dashboard/students" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon">👥</span> Students
    </NavLink>

    <span className="nav-section-label">Analytics</span>
    <NavLink to="/admin-dashboard/analytics" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon">📈</span> Analytics
    </NavLink>
  </>
);

const StudentNav = () => (
  <>
    <span className="nav-section-label">Overview</span>
    <NavLink to="/student-dashboard" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon">🏠</span> Dashboard
    </NavLink>

    <span className="nav-section-label">Feedback</span>
    <NavLink to="/student-dashboard/forms" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon">📝</span> Available Forms
    </NavLink>
    <NavLink to="/student-dashboard/history" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
      <span className="nav-icon">📚</span> My Submissions
    </NavLink>
  </>
);

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-text">
          <span>🎓</span>
          <span>FeedbackPro</span>
        </div>
        <div className="logo-sub">Student Feedback System</div>
      </div>

      <nav className="sidebar-nav">
        {isAdmin ? <AdminNav /> : <StudentNav />}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
