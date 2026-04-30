/** @format */

import ProtectedRoute from "@/routes/ProtectedRoute";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

/* ================= ADMIN ================= */
import Dashboard from "../features/admin/pages/Dashboard";
import LiveMonitoring from "../features/admin/pages/LiveMonitoring";
import Reports from "../features/admin/pages/Reports";
import Settings from "../features/admin/pages/Settings";
import Employees from "../features/admin/pages/WorkForce";

/* ================= EMPLOYEE ================= */
import CompanySection from "@/features/employee/pages/CompanySection";
import CompanyInfo from "../features/employee/pages/CompanyInfo";
import EmployeeDashboard from "../features/employee/pages/EmployeeDashboard";
import MyActivity from "../features/employee/pages/MyActivity";
import MyTasks from "../features/employee/pages/Tasks";

/* ================= AUTH ================= */
import GreetingWrapper from "@/pages/auth/wrapper/GreetingWrapper";
import AdminRegister from "../pages/auth/AdminRegister";
import LoginPage from "../pages/auth/Login";

/* ================= LANDING ================= */
import LandingPage from "@/pages/landing/LandingPage";

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<AdminRegister />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/greeting" element={<GreetingWrapper />} />

      {/* ================= ADMIN ================= */}
      <Route
        element={
          <ProtectedRoute roles={["admin"]}>
            <MainLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/live-monitoring" element={<LiveMonitoring />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      {/* ================= EMPLOYEE ================= */}
      <Route
        element={
          <ProtectedRoute roles={["employee"]}>
            <MainLayout role="employee" />
          </ProtectedRoute>
        }
      >
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/activity" element={<MyActivity />} />
        <Route path="/employee/tasks" element={<MyTasks />} />
        <Route path="/employee/company-info" element={<CompanyInfo />} />
        <Route path="/employee/company-info/:section" element={<CompanySection />} />
      </Route>

      {/* ================= SUPER ADMIN (FUTURE READY) ================= */}
      <Route
        element={
          <ProtectedRoute roles={["superadmin"]}>
            <MainLayout role="superadmin" />
          </ProtectedRoute>
        }
      >
        {/* Add routes when ready */}
        {/* <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} /> */}
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<LoginPage />} />

    </Routes>
  );
}
