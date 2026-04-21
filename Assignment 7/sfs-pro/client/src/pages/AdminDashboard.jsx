import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/shared/Sidebar";
import AdminHome from "../components/admin/AdminHome";
import AdminForms from "../components/admin/AdminForms";
import AdminResponses from "../components/admin/AdminResponses";
import AdminStudents from "../components/admin/AdminStudents";
import AdminAnalytics from "../components/admin/AdminAnalytics";

const AdminDashboard = () => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="forms" element={<AdminForms />} />
        <Route path="responses" element={<AdminResponses />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="*" element={<Navigate to="/admin-dashboard" replace />} />
      </Routes>
    </main>
  </div>
);

export default AdminDashboard;
