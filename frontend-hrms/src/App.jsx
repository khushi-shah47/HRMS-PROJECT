import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import HRDashboard from "./pages/HRDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import InternDashboard from "./pages/InternDashboard";

import EmployeePage from "./pages/EmployeePage";
import EmployeeDetailPage from "./pages/EmployeeDetailPage";
import AttendancePage from "./pages/AttendancePage";
import AllAttendancePage from "./pages/AllAttendancePage";
import TaskPage from "./pages/TaskPage";
import TaskDetailPage from "./pages/TaskDetailPage";
import ReportsPage from "./pages/ReportsPage";
import UserPage from "./pages/UserPage";
import LeavePage from "./pages/LeavePage";
import SalaryPage from "./pages/SalaryPage";
import PolicyPage from "./pages/PolicyPage";
import WFHPage from "./pages/WFHPage";
import HolidayPage from "./pages/HolidayPage";
import DepartmentPage from "./pages/DepartmentPage";
import AnnouncementsPage from "./pages/AnnouncementsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ChangePasswordPage from "./pages/ChangePasswordPage";
// Role-based route access configuration
const roleRoutes = {
  admin: ["/admin", "/employees", "/attendance", "/all-attendance", "/tasks", "/reports", "/users", "/leave", "/salary", "/policies", "/wfh", "/holidays", "/departments"],
  manager: ["/manager", "/attendance", "/tasks", "/reports", "/leave", "/wfh"],
  hr: ["/hr", "/employees", "/attendance", "/all-attendance", "/leave", "/salary", "/policies", "/wfh", "/holidays", "/departments", "/announcements"],
  developer: ["/developer", "/attendance", "/all-attendance", "/leave", "/tasks", "/wfh", "/policies", "/holidays", "/announcements"],
  intern: ["/intern", "/attendance", "/all-attendance", "/tasks", "/policies", "/holidays", "/announcements"]
};

function App() {
  return (
    <Router>
      <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignupPage/>}/>
          <Route path="/forgot-password" element={<ForgetPassword/>}/>
          <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
            {/* Role-specific Dashboard Routes */}
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/manager" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager"]}>
                  <ManagerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr" 
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <HRDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/developer" 
              element={
                <ProtectedRoute allowedRoles={["admin", "developer"]}>
                  <DeveloperDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/intern" 
              element={
                <ProtectedRoute allowedRoles={["admin", "intern"]}>
                  <InternDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Default Dashboard (redirects based on role) */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />

            {/* Protected Routes */}
            <Route 
              path="/employees" 
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <EmployeePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/attendance" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <AttendancePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/all-attendance" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <AllAttendancePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <TaskPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/employees/:id" 
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <EmployeeDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks/:id" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <TaskDetailPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr"]}>
                  <ReportsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <UserPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/leave" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <LeavePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/salary" 
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <SalaryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/policies" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <PolicyPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/wfh" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <WFHPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/holidays" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <HolidayPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/departments" 
              element={
                <ProtectedRoute allowedRoles={["admin", "hr"]}>
                  <DepartmentPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/announcements" 
              element={
                <ProtectedRoute allowedRoles={["admin", "manager", "hr", "developer", "intern"]}>
                  <AnnouncementsPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />
            {/* Catch all - redirect to login */}
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
      </Routes>
    </Router>
  );
}

export default App;

