
import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Box,
  Button,
  useMediaQuery,
  useTheme,
  Divider,
  Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PolicyIcon from "@mui/icons-material/Policy";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import EventIcon from "@mui/icons-material/Event";
import BusinessIcon from "@mui/icons-material/Business";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useNavigate, useLocation } from "react-router-dom";

// Role-based menu items - redirects to role-specific dashboard
const roleMenuItems = {
  admin: [
    { text: "Dashboard", path: "/admin", icon: <DashboardIcon /> },

    { text: "Employees", path: "/employees", icon: <PeopleIcon /> },
    { text: "Leave", path: "/leave", icon: <BeachAccessIcon /> },
    { text: "Salary", path: "/salary", icon: <CurrencyRupeeIcon /> },
    { text: "Tasks", path: "/tasks", icon: <AssignmentIcon /> },
    { text: "Policies", path: "/policies", icon: <PolicyIcon /> },
    { text: "WFH", path: "/wfh", icon: <HomeWorkIcon /> },
    { text: "Holidays", path: "/holidays", icon: <EventIcon /> },
    { text: "Announcements", path: "/announcements", icon: <CampaignIcon /> },
    { text: "Reports", path: "/reports", icon: <AssessmentIcon /> },
    { text: "Users", path: "/users", icon: <AdminPanelSettingsIcon /> }
  ],
  manager: [
    { text: "Dashboard", path: "/manager", icon: <DashboardIcon /> },
    { text: "Attendance", path: "/attendance", icon: <CheckCircleIcon /> },
    { text: "Leave", path: "/leave", icon: <BeachAccessIcon /> },
    { text: "Tasks", path: "/tasks", icon: <AssignmentIcon /> },
    { text: "WFH", path: "/wfh", icon: <HomeWorkIcon /> },
    { text: "Announcements", path: "/announcements", icon: <CampaignIcon /> },
    { text: "Reports", path: "/reports", icon: <AssessmentIcon /> }
  ],
  hr: [
    { text: "Dashboard", path: "/hr", icon: <DashboardIcon /> },
    { text: "Employees", path: "/employees", icon: <PeopleIcon /> },
    { text: "Attendance", path: "/attendance", icon: <CheckCircleIcon /> },
    { text: "Leave", path: "/leave", icon: <BeachAccessIcon /> },
    { text: "Tasks", path: "/tasks", icon: <AssignmentIcon /> },
    { text: "Salary", path: "/salary", icon: <CurrencyRupeeIcon /> },
    { text: "Policies", path: "/policies", icon: <PolicyIcon /> },
    { text: "WFH", path: "/wfh", icon: <HomeWorkIcon /> },
    { text: "Holidays", path: "/holidays", icon: <EventIcon /> },
    { text: "Announcements", path: "/announcements", icon: <CampaignIcon /> }
  ],
  developer: [
    { text: "Dashboard", path: "/developer", icon: <DashboardIcon /> },
    { text: "Attendance", path: "/attendance", icon: <CheckCircleIcon /> },
    { text: "Leave", path: "/leave", icon: <BeachAccessIcon /> },
    { text: "Tasks", path: "/tasks", icon: <AssignmentIcon /> },
    { text: "WFH", path: "/wfh", icon: <HomeWorkIcon /> },
    { text: "Holidays", path: "/holidays", icon: <EventIcon /> },
    { text: "Announcements", path: "/announcements", icon: <CampaignIcon /> }
  ],
  intern: [
    { text: "Dashboard", path: "/intern", icon: <DashboardIcon /> },
    { text: "Attendance", path: "/attendance", icon: <CheckCircleIcon /> },
    { text: "Leave", path: "/leave", icon: <BeachAccessIcon /> },
    { text: "Tasks", path: "/tasks", icon: <AssignmentIcon /> },
    { text: "WFH", path: "/wfh", icon: <HomeWorkIcon /> },
    { text: "Holidays", path: "/holidays", icon: <EventIcon /> },
    { text: "Announcements", path: "/announcements", icon: <CampaignIcon /> }
  ]
};

// Get role colors
// Removed hardcoded role colors - now using theme.roleColors from CustomThemeProvider

export default function Sidebar({ mobileOpen, onDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile && onDrawerToggle) {
      onDrawerToggle();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const role = user?.role || "developer";
  const menuItems = roleMenuItems[role] || roleMenuItems.developer;
  const roleColors = theme.roleColors[role] || theme.roleColors.developer;

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `3px solid ${roleColors.border}` }}>
        <Box>
          <Typography variant="h6" fontWeight="bold" sx={{ color: roleColors.main }}>
            HRMS
          </Typography>
          <Typography variant="caption" sx={{ color: roleColors.main, textTransform: "capitalize" }}>
            {role} Panel
          </Typography>
        </Box>
        {isMobile && onDrawerToggle && (
          <IconButton onClick={onDrawerToggle}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Menu Items */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            selected={location.pathname === item.path}
            sx={{
              "&.Mui-selected": {
                background: roleColors.bg,
                borderLeft: `4px solid ${roleColors.border}`,
                color: roleColors.main,
                fontWeight: "bold",
                "&:hover": {
                  background: roleColors.bg,
                }
              },
              "&:hover": {
                background: roleColors.bg,
              },
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              color: "text.secondary"
            }}
          >
            <Box sx={{ mr: 2, display: "flex", alignItems: "center", color: location.pathname === item.path ? roleColors.main : "text.secondary" }}>
              {item.icon}
            </Box>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* User Info */}
      {user && (
        <Box sx={{ p: 2, background: roleColors.bg }}>
          <Typography variant="body2" fontWeight="bold" sx={{ color: roleColors.main }}>
            {user.name || user.username}
          </Typography>
          <Typography variant="caption" sx={{ color: roleColors.main, textTransform: "capitalize" }}>
            {role}
          </Typography>
        </Box>
      )}

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ fontWeight: "bold" }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 280,
          }
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: 280,
          "& .MuiDrawer-paper": {
            width: 280,
          }
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}


