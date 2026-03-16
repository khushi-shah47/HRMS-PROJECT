// // import React from "react";
// // import {
// // AppBar,
// // Toolbar,
// // Typography,
// // Avatar,
// // Box,
// // IconButton,
// // InputBase
// // } from "@mui/material";
// // import SearchIcon from "@mui/icons-material/Search";
// // import NotificationsIcon from "@mui/icons-material/Notifications";
// // import Tooltip from "@mui/material/Tooltip";
// // import MenuIcon from "@mui/icons-material/Menu";
// // import { useLocation, useNavigate } from "react-router-dom";

// // export default function Topbar({ onMenuClick }){

// //     const location = useLocation(); 
// //     const navigate = useNavigate();
    
// //     const titles = {
// //         "/": "Dashboard",
// //         "/employees": "Employee Management",
// //         "/attendance": "Attendance",
// //         "/tasks": "Task Management",
// //         "/reports": "Reports",
// //         "/users": "User Management",
// //         "/leave": "Leave Management",
// //         "/salary": "Salary Management",
// //         "/policies": "Policies",
// //         "/wfh": "Work From Home",
// //         "/holidays": "Holidays",
// //         "/departments": "Department Management"
// //     };
// //     const pageTitle = titles[location.pathname] || "HRMS Dashboard";

// //     // Get user from localStorage
// //     const userData = localStorage.getItem("user");
// //     const user = userData ? JSON.parse(userData) : { name: "Admin" };

// //     return(
// //         <AppBar position="static" sx={{ background:"#FFFFFF", color:"#000", boxShadow:1 }}>
// //             <Toolbar>
// //                 <Typography
// //                     variant="h6" 
// //                     sx={{ color:"#1E3A8A", fontWeight: "bold" }}
// //                 >
// //                     HRMS Dashboard
// //                 </Typography>
// //                 <Box sx={{ flexGrow: 1 }} />
// //                 <IconButton
// //                     edge="start"
// //                     color="inherit"
// //                     onClick={onMenuClick}
// //                     sx={{ mr: 2, display: { md: "none" } }}
// //                 >
// //                     <MenuIcon />
// //                 </IconButton>
// //                 <Box sx={{ display: 'flex', alignItems: 'center', width: 250 }}>
// //                   <InputBase
// //                     placeholder="Search…"
// //                     sx={{
// //                       border: '1px solid #E5E7EB',
// //                       borderRadius: 2,
// //                       px: 2,
// //                       py: 0.5,
// //                       bgcolor: 'white',
// //                       minWidth: 200,
// //                       '&:hover': { borderColor: '#D1D5DB' }
// //                     }}
// //                     endAdornment={
// //                       <SearchIcon sx={{ color: '#9CA3AF', mr: 1 }} />
// //                     }
// //                     onChange={(e) => console.log('Search:', e.target.value)}
// //                   />
// //                 </Box>

// //                 <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
// //                     <Tooltip title="Notifications">
// //                       <IconButton sx={{ color: '#6B7280' }}>
// //                         <NotificationsIcon />
// //                       </IconButton>
// //                     </Tooltip>
// //                     <Typography sx={{ fontWeight: 500 }}>
// //                         {user.name || user.username || "User"}
// //                     </Typography>
// //                     <Avatar sx={{ bgcolor: "#1E3A8A" }}>
// //                         {(user.name || user.username || "U").charAt(0).toUpperCase()}
// //                     </Avatar>
// //                 </Box>
// //             </Toolbar>
// //         </AppBar>
// //     );
// // }

// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Avatar,
//   Box,
//   IconButton,
//   InputBase,
//   Badge,
//   Tooltip
// } from "@mui/material";

// import SearchIcon from "@mui/icons-material/Search";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import MenuIcon from "@mui/icons-material/Menu";
// import { useLocation } from "react-router-dom";
// import api from "../services/api";

// export default function Topbar({ onMenuClick }) {

//   const location = useLocation();

//   const [search, setSearch] = useState("");
//   const [notifications, setNotifications] = useState([]);

//   const titles = {
//     "/": "Dashboard",
//     "/employees": "Employee Management",
//     "/attendance": "Attendance",
//     "/tasks": "Task Management",
//     "/reports": "Reports",
//     "/users": "User Management",
//     "/leave": "Leave Management",
//     "/salary": "Salary Management",
//     "/policies": "Policies",
//     "/wfh": "Work From Home",
//     "/holidays": "Holidays",
//     "/departments": "Department Management"
//   };

//   const pageTitle = titles[location.pathname] || "HRMS Dashboard";

//   const fetchNotifications = async () => {
//     try {
//       const res = await api.get("/notifications");
//       setNotifications(res.data);
//     } catch (err) {
//       console.error("Notification fetch error", err);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const userData = localStorage.getItem("user");
//   const user = userData ? JSON.parse(userData) : { name: "Admin" };

//   return (
//     <AppBar position="static" sx={{ background: "#FFFFFF", color: "#000", boxShadow: 1 }}>
//       <Toolbar>

//         {/* Menu button */}
//         <IconButton
//           edge="start"
//           color="inherit"
//           onClick={onMenuClick}
//           sx={{ mr: 2, display: { md: "none" } }}
//         >
//           <MenuIcon />
//         </IconButton>

//         {/* Page title */}
//         <Typography variant="h6" sx={{ color: "#1E3A8A", fontWeight: "bold" }}>
//           {pageTitle}
//         </Typography>

//         <Box sx={{ flexGrow: 1 }} />

//         {/* Search Bar */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             border: "1px solid #E5E7EB",
//             borderRadius: 2,
//             px: 2,
//             py: 0.5,
//             mr: 2,
//             bgcolor: "white"
//           }}
//         >
//           <SearchIcon sx={{ color: "#9CA3AF", mr: 1 }} />

//           <InputBase
//             placeholder="Search..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               console.log("Search:", e.target.value);
//             }}
//           />
//         </Box>

//         {/* Notifications */}
//         <Tooltip title="Notifications">
//           <IconButton sx={{ color: "#6B7280" }}>
//             <Badge badgeContent={notifications.length} color="error">
//               <NotificationsIcon />
//             </Badge>
//           </IconButton>
//         </Tooltip>

//         {/* User */}
//         <Typography sx={{ ml: 2, fontWeight: 500 }}>
//           {user.name || user.username || "User"}
//         </Typography>

//         <Avatar sx={{ bgcolor: "#1E3A8A", ml: 1 }}>
//           {(user.name || user.username || "U").charAt(0).toUpperCase()}
//         </Avatar>

//       </Toolbar>
//     </AppBar>
//   );
// }

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  InputBase,
  Badge,
  Tooltip,
  Paper
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MenuIcon from "@mui/icons-material/Menu";

import { useLocation, useNavigate } from "react-router-dom";

import api from "../services/api";

export default function Topbar({ onMenuClick }) {

  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [results, setResults] = useState([]);

  const titles = {
    "/": "Dashboard",
    "/employees": "Employee Management",
    "/attendance": "Attendance",
    "/tasks": "Task Management",
    "/reports": "Reports",
    "/users": "User Management",
    "/leave": "Leave Management",
    "/salary": "Salary Management",
    "/policies": "Policies",
    "/wfh": "Work From Home",
    "/holidays": "Holidays",
    "/departments": "Department Management"
  };

  const pageTitle = titles[location.pathname] || "HRMS Dashboard";

  /* ================= NOTIFICATIONS ================= */

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification fetch error", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  /* ================= SEARCH ================= */

  useEffect(() => {

    if (search.length < 2) {
      setResults([]);
      return;
    }

    const fetchSearch = async () => {
      try {

        const res = await api.get(`/employees?search=${search}`);

        setResults(res.data.employees || []);

      } catch (err) {
        console.error("Search error", err);
      }
    };

    const delayDebounce = setTimeout(fetchSearch, 400);

    return () => clearTimeout(delayDebounce);

  }, [search]);

  /* ================= USER ================= */

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : { name: "Admin" };

  /* ================= UI ================= */

  return (
    <AppBar position="static" sx={{ background: "#FFFFFF", color: "#000", boxShadow: 1 }}>
      <Toolbar>

        {/* MENU BUTTON */}

        <IconButton
          edge="start"
          color="inherit"
          onClick={onMenuClick}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        {/* PAGE TITLE */}

        <Typography variant="h6" sx={{ color: "#1E3A8A", fontWeight: "bold" }}>
          {pageTitle}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* SEARCH */}

        <Box
          sx={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            border: "1px solid #E5E7EB",
            borderRadius: 2,
            px: 2,
            py: 0.5,
            mr: 2,
            bgcolor: "white"
          }}
        >

          <SearchIcon sx={{ color: "#9CA3AF", mr: 1 }} />

          <InputBase
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* SEARCH RESULTS */}

          {results.length > 0 && (

            <Paper
              sx={{
                position: "absolute",
                top: "40px",
                left: 0,
                width: "250px",
                maxHeight: "250px",
                overflowY: "auto",
                zIndex: 1000
              }}
            >

              {results.map((emp) => (

                <Box
                  key={emp.id}
                  sx={{
                    px: 2,
                    py: 1,
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" }
                  }}
                  onClick={() => {

                    setSearch("");
                    setResults([]);

                    navigate("/employees");

                  }}
                >

                  {emp.name}

                </Box>

              ))}

            </Paper>

          )}

        </Box>

        {/* NOTIFICATIONS */}

        <Tooltip title="Notifications">

          <IconButton sx={{ color: "#D4AF37" }}>

            <Badge badgeContent={notifications.length} color="error">

              <NotificationsIcon />

            </Badge>

          </IconButton>

        </Tooltip>

        {/* USER */}


        <Typography sx={{ ml: 2, fontWeight: 500 }}>
          {user.name || user.username || "User"}
        </Typography>

        <Avatar sx={{ bgcolor: "#1E3A8A", ml: 1 }}>
          {(user.name || user.username || "U").charAt(0).toUpperCase()}
        </Avatar>

      </Toolbar>
    </AppBar>
  );
}