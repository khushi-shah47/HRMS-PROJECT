import React from "react";
import {
AppBar,
Toolbar,
Typography,
Avatar,
Box,
IconButton,
InputBase
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Tooltip from "@mui/material/Tooltip";
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
                <Typography
                    variant="h6" 
                    sx={{ color:"#1E3A8A", fontWeight: "bold" }}
                >
                    HRMS Dashboard
                </Typography>
                <Box sx={{ flexGrow: 1 }} />
                <IconButton
                    edge="start"
                    color="inherit"
                    onClick={onMenuClick}
                    sx={{ mr: 2, display: { md: "none" } }}
                >
                    <MenuIcon />
                </IconButton>
                <Box sx={{ display: 'flex', alignItems: 'center', width: 250 }}>
                  <InputBase
                    placeholder="Search…"
                    sx={{
                      border: '1px solid #E5E7EB',
                      borderRadius: 2,
                      px: 2,
                      py: 0.5,
                      bgcolor: 'white',
                      minWidth: 200,
                      '&:hover': { borderColor: '#D1D5DB' }
                    }}
                    endAdornment={
                      <SearchIcon sx={{ color: '#9CA3AF', mr: 1 }} />
                    }
                    onChange={(e) => console.log('Search:', e.target.value)}
                  />
                </Box>

                <Box sx={{ display:"flex", alignItems:"center", gap:2 }}>
                    <Tooltip title="Notifications">
                      <IconButton sx={{ color: '#6B7280' }}>
                        <NotificationsIcon />
                      </IconButton>
                    </Tooltip>
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

