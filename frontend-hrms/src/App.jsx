// -----------------hrms---------------------------------

// import React, { useState } from "react";
// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignupPage";
// import ForgetPassword from "./pages/ForgetPassword";
// import EmployeeListPage from "./pages/EmployeeListPage";
// import LeavePage from "./pages/LeavePage";
// import AttendancePage from "./pages/AttendancePage";
// import SalaryPage from "./pages/SalaryPage";
// import AllAttendancePage from "./pages/AllAttendancePage";
// import WFHPage from "./pages/WFHPage";
// import HolidayPage from "./pages/HolidayPage";
// import PolicyPage from "./pages/PolicyPage";
// import EmployeePage from "./pages/EmployeePage";
// import DepartmentPage from "./pages/DepartmentPage";
// import UserPage from "./pages/UserPage";
// import TaskPage from "./pages/TaskPage";
// import ReportsPage from "./pages/ReportsPage";

// function App() {
//   const employeeId = 1;
//   const [currentPage, setCurrentPage] = useState("attendance");
//   const [showAllAttendance, setShowAllAttendance] = useState(false);
//    const navItems = [
//     { id: "attendance", label: "Attendance" },
//     { id: "wfh", label: "WFH" },
//     { id: "holiday", label: "Holiday" },
//     { id: "policy", label: "Policy" },
//     { id: "employee", label: "Employee" },
//     { id: "department", label: "Department" },
//     { id: "user", label: "User" },
//     { id: "tasks", label: "Tasks" },
//     { id: "reports", label: "Reports" }
//   ];

//   const renderPage = () => {
//     if (showAllAttendance) {
//       return <AllAttendancePage employeeId={employeeId} onBack={() => setShowAllAttendance(false)} />;
//     }
//     switch (currentPage) {
//       case "wfh":
//         return <WFHPage employeeId={employeeId} />;
//       case "holiday":
//         return <HolidayPage />;
//       case "policy":
//         return <PolicyPage />;
//       case "employee":
//         return <EmployeePage />;
//       case "department":
//         return <DepartmentPage />;
//       case "user":
//         return <UserPage />;
//       case "tasks":
//         return <TaskPage />;
//       case "reports":
//         return <ReportsPage />;
//       default:
//         return <AttendancePage employeeId={employeeId} onShowAll={() => setShowAllAttendance(true)} />;
//     }
//   };

//   return (
//     <div className="app" style={{ backgroundColor: "#ffffff", minHeight: "100vh", padding: "20px" }}>
//       <h1 style={{ color: "#1E3A8A", marginBottom: "30px", textAlign: "center" }}>HRMS PROJECT</h1>
      
//       <div style={{ marginBottom: "20px", display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
//         {navItems.map((item) => (
//           <button 
//             key={item.id}
//             onClick={() => setCurrentPage(item.id)} 
//             style={{ 
//               padding: "10px 20px", 
//               cursor: "pointer",
//               backgroundColor: currentPage === item.id ? "#1E3A8A" : "#e5e7eb",
//               color: currentPage === item.id ? "white" : "black",
//               border: "none",
//               borderRadius: "5px",
//               fontWeight: currentPage === item.id ? "bold" : "normal"
//             }}
//           >
//             {item.label}
//           </button>
//         ))}
//       </div>

//       <div style={{ marginBottom: "50px" }}>
//         {renderPage()}
//       </div>
//     </div>
//   );
// }

// export default App;
  // const [showAllAttendance, setShowAllAttendance] = useState(false);

  // const [role, setRole] = useState(null);
  // const [page, setPage] = useState("login");

  //  return (
  //    <div
  //      style={{
  //        minHeight: "100vh",
  //        backgroundColor: "#F8FAFC",
  //        display: "flex",
  //        justifyContent: "center",
  //        alignItems: "center",
  //      }}
  //    >
  //      {!role ? (
  //        page === "login" ? (
  //          <LoginPage
  //            setRole={setRole}
  //            goToSignup={() => setPage("signup")}
  //            goToForgot={() => setPage("forgot")}
  //          />
  //        ) : page === "signup" ? (
  //          <SignupPage
  //            setRole={setRole}
  //            goToLogin={() => setPage("login")}
  //          />
  //        ) : (
  //          <ForgetPassword goToLogin={() => setPage("login")} />
  //        )
  //      ) : (
  //       //  <EmployeeListPage role={role}/>
  //       <WFHPage employeeId={1}/>
  //      )}
  //    </div>
  //  );

  // return (
  //   <div className="app" style={{ backgroundColor: "#ffffff", minHeight: "100vh", padding: "20px" }}>
  //     <h1 style={{ color: "#1E3A8A", marginBottom: "30px" }}>HRMS PROJECT</h1>
      
  //     <div style={{ marginBottom: "50px" }}>
  //       <h2 style={{ color: "#333" }}>Attendance Management</h2>
  //       {showAllAttendance ? (
  //         <AllAttendancePage 
  //           employeeId={employeeId} 
  //           onBack={() => setShowAllAttendance(false)} 
  //         />
  //       ) : (
  //         <AttendancePage 
  //           employeeId={employeeId} 
  //           onShowAll={() => setShowAllAttendance(true)} 
  //         />
  //       )}
  //     </div>
  //   </div>
  // );

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardPage from "./pages/DashboardPage";
import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";
import TaskPage from "./pages/TaskPage";
import ReportsPage from "./pages/ReportsPage";
import UserPage from "./pages/UserPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgetPassword from "./pages/ForgetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <Router>

      <Routes>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/signup" element={<SignupPage/>}/>
        <Route path="/forgot-password" element={<ForgetPassword/>}/>

        <Route path="/"
          element={
            <ProtectedRoute>  
              <Layout/>
            </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="/employees" element={<EmployeePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/tasks" element={<TaskPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/users" element={<UserPage />} />
        </Route>
      </Routes>

    </Router>
  );
}

export default App;