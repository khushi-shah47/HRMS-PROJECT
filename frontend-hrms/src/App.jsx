import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import HRDashboard from "./pages/HRDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import InternDashboard from "./pages/InternDashboard";

import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";
import AllAttendancePage from "./pages/AllAttendancePage";
import TaskPage from "./pages/TaskPage";
import ReportsPage from "./pages/ReportsPage";
import UserPage from "./pages/UserPage";
import LeavePage from "./pages/LeavePage";
import SalaryPage from "./pages/SalaryPage";
import PolicyPage from "./pages/PolicyPage";
import WFHPage from "./pages/WFHPage";
import HolidayPage from "./pages/HolidayPage";
import DepartmentPage from "./pages/DepartmentPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./components/ProtectedRoute";

// Role-based route access configuration
const roleRoutes = {
  admin: ["/admin", "/employees", "/attendance", "/all-attendance", "/tasks", "/reports", "/users", "/leave", "/salary", "/policies", "/wfh", "/holidays", "/departments"],
  manager: ["/manager", "/employees", "/attendance", "/tasks", "/reports", "/leave", "/wfh", "/departments"],
  hr: ["/hr", "/employees", "/attendance", "/leave", "/holidays", "/departments"],
  developer: ["/developer", "/attendance", "/leave", "/tasks", "/wfh"],
  intern: ["/intern", "/attendance", "/tasks"]
};

function App() {
  return (
    <Router>
      <Routes>
          <Route element={<ProtectedRoute><Layout/></ProtectedRoute>}>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/signup" element={<SignupPage/>}/>
            <Route path="/forgot-password" element={<ForgetPassword/>}/>

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
                <ProtectedRoute allowedRoles={["admin", "manager", "hr"]}>
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
                <ProtectedRoute allowedRoles={["admin", "manager", "hr"]}>
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
                <ProtectedRoute allowedRoles={["admin", "manager", "hr"]}>
                  <DepartmentPage />
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

