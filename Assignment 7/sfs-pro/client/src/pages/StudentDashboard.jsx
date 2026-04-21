import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import StudentHome from "../components/student/StudentHome";
import StudentForms from "../components/student/StudentForms";
import StudentHistory from "../components/student/StudentHistory";

const StudentDashboard = () => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      <Routes>
        <Route index element={<StudentHome />} />
        <Route path="forms" element={<StudentForms />} />
        <Route path="history" element={<StudentHistory />} />
        <Route path="*" element={<Navigate to="/student-dashboard" replace />} />
      </Routes>
    </main>
  </div>
);

export default StudentDashboard;
