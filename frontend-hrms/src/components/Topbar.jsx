import React from "react";
import {
AppBar,
Toolbar,
Typography,
Avatar,
Box,
IconButton
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick }){

    const location = useLocation(); 
    const navigate = useNavigate();
    
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

    // Get user from localStorage
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : { name: "Admin" };

    return(
        <AppBar position="static" sx={{ background:"#FFFFFF", color:"#000", boxShadow:1 }}>
            <Toolbar>
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { md: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6" 
                    sx={{ flexGrow:1, color:"#1E3A8A", fontWeight: "bold" }}
                >
                    {pageTitle}
                </Typography>
                <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
                    <Typography sx={{ fontWeight: 500 }}>
                        {user.name || user.username || "User"}
                    </Typography>
                    <Avatar sx={{ bgcolor: "#1E3A8A" }}>
                        {(user.name || user.username || "U").charAt(0).toUpperCase()}
                    </Avatar>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

