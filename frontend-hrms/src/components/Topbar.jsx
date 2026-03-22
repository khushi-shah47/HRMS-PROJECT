import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  InputAdornment,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

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
    const [user, setUser] = useState(() => {
        const userData = localStorage.getItem("user");
        return userData ? JSON.parse(userData) : { name: "Admin" };
    });

    // Notification State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState({ employees: [], tasks: [], requests: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [searchAnchorEl, setSearchAnchorEl] = useState(null);

    // Profile Menu State
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);
    const openProfileMenu = Boolean(profileAnchorEl);

    
    // Handlers
    const handleProfileClick = (event) => {
        setProfileAnchorEl(event.currentTarget);
    };

    const handleProfileClose = () => {
        setProfileAnchorEl(null);
    };

    const handleMenuNavigation = (path) => {
        navigate(path);
        handleProfileClose();
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
        handleProfileClose();
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 30 seconds for new notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const updateUser = () => {
            const userData = localStorage.getItem("user");
            setUser(userData ? JSON.parse(userData) : { name: "Admin" });
        };

        window.addEventListener("profileUpdated", updateUser);

        return () => window.removeEventListener("profileUpdated", updateUser);
    }, []);

    const fetchNotifications = async () => {
        try {
            const countRes = await api.get("/notifications/unread-count");
            setUnreadCount(countRes.data.unreadCount);

            const notifRes = await api.get("/notifications/my");
            setNotifications(notifRes.data);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const handleMarkAllRead = async () => {
        try {
            await api.put("/notifications/mark-all-read");
            fetchNotifications(); // Refresh list and count
        } catch (error) {
            console.error("Failed to mark all as read:", error);
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications(); // Refresh list and count
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const openNotifications = Boolean(anchorEl);

    // Search Logic
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.trim().length > 0) {
                performSearch();
            } else {
                setSearchResults({ employees: [], tasks: [], requests: [] });
                setSearchAnchorEl(null);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    const performSearch = async () => {
        setIsSearching(true);
        try {
            const res = await api.get(`/search?q=${searchQuery}`);
            setSearchResults(res.data);
            if (res.data.employees.length > 0 || res.data.tasks.length > 0 || res.data.requests.length > 0) {
                // Ensure search popover anchors to the input box
                const searchInput = document.getElementById("global-search-input");
                setSearchAnchorEl(searchInput);
            } else {
                setSearchAnchorEl(null);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const closeSearch = () => {
        setSearchAnchorEl(null);
        setSearchQuery("");
    };

    const handleSearchResultClick = (path) => {
        navigate(path);
        closeSearch();
    };

    const openSearch = Boolean(searchAnchorEl);

    return(
        <AppBar position="static">
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
                    sx={{ flexGrow:1, color:"primary.main", fontWeight: "bold" }}
                >
                    {pageTitle}
                </Typography>
                <Box sx={{ display:"flex", alignItems:"center", gap:3 }}>
                    
                    {/* Search Bar */}
                    <Box sx={{ position: "relative", display: { xs: "none", md: "block" } }}>
                        <TextField
                            id="global-search-input"
                            placeholder="Search employees, tasks..."
                            size="small"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {isSearching && <CircularProgress size={16} />}
                                    </InputAdornment>
                                )
                            }}
                            sx={{
                                width: 300,
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: 5,
                                    backgroundColor: "action.hover",
                                }
                            }}
                        />
                    </Box>

                    {/* Notification Bell */}
                    <IconButton 
                        color="inherit" 
                        onClick={handleNotificationClick}
                        aria-label="show new notifications"
                    >
                        <Badge badgeContent={unreadCount} color="error">
                            <NotificationsIcon sx={{ color: "text.secondary" }} />
                        </Badge>
                    </IconButton>

                    {/* User Display / Action */}
                    <Box 
                        sx={{ display:"flex", alignItems:"center", gap:2, cursor: "pointer", "&:hover": { opacity: 0.8 } }}
                        onClick={handleProfileClick}
                        aria-controls={openProfileMenu ? 'profile-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={openProfileMenu ? 'true' : undefined}
                    >
                        <Typography sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}>
                            {user.name || user.username || "User"}
                        </Typography>
                        <Avatar
                            src={
                                user?.profile_image
                                    ? `http://localhost:5000/${user.profile_image}?t=${new Date().getTime()}`
                                    : ""
                            }
                            sx={{ bgcolor: "primary.main", width: 35, height: 35 }}
                        >
                            {!user?.profile_image && (user.name || user.username || "U").charAt(0).toUpperCase()}
                        </Avatar>
                    </Box>
                </Box>
            </Toolbar>

            {/* Profile Dropdown Menu */}
            <Menu
                id="profile-menu"
                anchorEl={profileAnchorEl}
                open={openProfileMenu}
                onClose={handleProfileClose}
                MenuListProps={{
                    'aria-labelledby': 'profile-button',
                }}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        width: 200,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => handleMenuNavigation('/profile')}>
                    <ListItemIcon>
                        <PersonIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    My Profile
                </MenuItem>
                <MenuItem onClick={() => handleMenuNavigation('/settings')}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    Settings
                </MenuItem>
                <MenuItem onClick={() => handleMenuNavigation('/change-password')}>
                    <ListItemIcon>
                        <SettingsIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    Change Password
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>

            {/* Notifications Popover */}
            <Popover
                open={openNotifications}
                anchorEl={anchorEl}
                onClose={handleNotificationClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{ sx: { width: 350, maxHeight: 400, mt: 1.5, borderRadius: 2 } }}
            >
                <Box sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
                    {unreadCount > 0 && (
                        <IconButton size="small" onClick={handleMarkAllRead} title="Mark all as read">
                            <DoneAllIcon fontSize="small" color="primary" />
                        </IconButton>
                    )}
                </Box>
                <List sx={{ p: 0 }}>
                    {notifications.length === 0 ? (
                        <ListItem><ListItemText primary="No new notifications" sx={{ color: "text.secondary", textAlign: "center", py: 2 }} /></ListItem>
                    ) : (
                        notifications.map((notif) => (
                            <React.Fragment key={notif.id}>
                                <ListItem 
                                    button 
                                    onClick={() => handleMarkRead(notif.id)}
                                    sx={{ 
                                        bgcolor: notif.is_read ? "transparent" : "action.hover", 
                                        "&:hover": { bgcolor: "action.selected" },
                                        transition: "background-color 0.2s"
                                    }}
                                >
                                    <ListItemText 
                                        primary={
                                            <Typography variant="body2" fontWeight={notif.is_read ? "normal" : "bold"} color="text.primary">
                                                {notif.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary">
                                                {notif.message}
                                                <br />
                                                {new Date(notif.created_at).toLocaleString()}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Popover>

            {/* Global Search Popover */}
            <Popover
                open={openSearch}
                anchorEl={searchAnchorEl}
                onClose={closeSearch}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                disableAutoFocus
                disableEnforceFocus
                PaperProps={{ sx: { width: 300, maxHeight: 400, mt: 1, borderRadius: 2 } }}
            >
                <List sx={{ p: 0 }}>
                    {/* Employees */}
                    {searchResults.employees?.length > 0 && (
                        <>
                            <Box sx={{ px: 2, py: 1, bgcolor: "background.default" }}>
                                <Typography variant="caption" fontWeight="bold" color="text.secondary">EMPLOYEES</Typography>
                            </Box>
                            {searchResults.employees.map(emp => (
                                <ListItem 
                                    button 
                                    key={`emp-${emp.id}`} 
                                    onClick={() => handleSearchResultClick(`/employees/${emp.id}`)}
                                >
                                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: 12, bgcolor: "primary.main" }}>{emp.name.charAt(0)}</Avatar>
                                    <ListItemText primary={emp.name} secondary={emp.position} />
                                </ListItem>
                            ))}
                        </>
                    )}
                    
                    {/* Tasks */}
                    {searchResults.tasks?.length > 0 && (
                        <>
                            <Box sx={{ px: 2, py: 1, bgcolor: "background.default" }}>
                                <Typography variant="caption" fontWeight="bold" color="text.secondary">TASKS</Typography>
                            </Box>
                            {searchResults.tasks.map(task => (
                                <ListItem 
                                    button 
                                    key={`task-${task.id}`} 
                                    onClick={() => handleSearchResultClick(`/tasks/${task.id}`)}
                                >
                                    <ListItemText primary={task.title} secondary={`Status: ${task.status}`} />
                                </ListItem>
                            ))}
                        </>
                    )}

                    {/* Requests */}
                    {searchResults.requests?.length > 0 && (
                        <>
                            <Box sx={{ px: 2, py: 1, bgcolor: "background.default" }}>
                                <Typography variant="caption" fontWeight="bold" color="text.secondary">REQUESTS</Typography>
                            </Box>
                            {searchResults.requests.map(req => (
                                <ListItem button key={`req-${req.type}-${req.id}`} onClick={() => handleSearchResultClick(req.type === 'leave' ? "/leave" : "/wfh")}>
                                    <ListItemText 
                                        primary={req.reason ? (req.reason.substring(0, 30) + (req.reason.length > 30 ? "..." : "")) : "No Reason"} 
                                        secondary={`${req.type.toUpperCase()} - ${req.status}`} 
                                    />
                                </ListItem>
                            ))}
                        </>
                    )}
                </List>
            </Popover>

        </AppBar>
    );
}

