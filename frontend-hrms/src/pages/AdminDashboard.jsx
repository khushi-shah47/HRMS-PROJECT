import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, LinearProgress, AvatarGroup, IconButton, Divider } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

// Admin-specific stats
const adminStats = [
  { title: "Total Employees", value: 45, icon: <PeopleIcon />, color: "#3B82F6", bg: "#EBF5FF", trend: "+5%" },
  { title: "Present Today", value: 38, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5", trend: "+2%" },
  { title: "On Leave", value: 5, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB", trend: "-1" },
  { title: "WFH", value: 7, icon: <HomeWorkIcon />, color: "#8B5CF6", bg: "#F5F3FF", trend: "+3" },
  { title: "Pending Tasks", value: 23, icon: <AssignmentIcon />, color: "#EF4444", bg: "#FEF2F2", trend: "+8" },
  { title: "New Hires", value: 8, icon: <PersonAddIcon />, color: "#06B6D4", bg: "#ECFEFF", trend: "+3" }
];

const recentEmployees = [
  { name: "John Doe", position: "Developer", department: "IT", date: "2024-01-15", avatar: "JD" },
  { name: "Jane Smith", position: "Designer", department: "Design", date: "2024-01-14", avatar: "JS" },
  { name: "Mike Johnson", position: "Manager", department: "Sales", date: "2024-01-13", avatar: "MJ" },
  { name: "Sarah Wilson", position: "HR", department: "HR", date: "2024-01-12", avatar: "SW" }
];

const pendingTasks = [
  { task: "Update login page", assignedTo: "John Doe", priority: "High", deadline: "2024-01-20", progress: 75 },
  { task: "Fix navigation bug", assignedTo: "Jane Smith", priority: "Medium", deadline: "2024-01-22", progress: 45 },
  { task: "Design dashboard", assignedTo: "Mike Johnson", priority: "High", deadline: "2024-01-21", progress: 90 },
  { task: "Database migration", assignedTo: "Sarah Wilson", priority: "Critical", deadline: "2024-01-25", progress: 30 }
];

const leaveRequests = [
  { employee: "Tom Brown", type: "Sick Leave", days: 2, status: "Pending", department: "IT" },
  { employee: "Emily Davis", type: "Casual Leave", days: 1, status: "Pending", department: "Sales" },
  { employee: "Michael Lee", type: "Annual Leave", days: 5, status: "Approved", department: "Marketing" }
];

const departmentStats = [
  { name: "IT", employees: 15, present: 12, leave: 2, wfh: 1 },
  { name: "Sales", employees: 10, present: 8, leave: 1, wfh: 1 },
  { name: "Marketing", employees: 8, present: 6, leave: 1, wfh: 1 },
  { name: "HR", employees: 5, present: 4, leave: 0, wfh: 1 },
  { name: "Design", employees: 7, present: 6, leave: 1, wfh: 0 }
];

function StatCard({ title, value, icon, color, bg, trend }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", height: "100%", position: "relative", overflow: "visible" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: color, mb: 1 }}>
              {value}
            </Typography>
            <Chip 
              label={trend} 
              size="small" 
              sx={{ 
                background: trend.includes('+') ? '#ECFDF5' : '#FEF2F2',
                color: trend.includes('+') ? '#16A34A' : '#EF4444',
                fontWeight: 'bold',
                fontSize: '0.7rem'
              }} 
            />
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 3, 
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 32, color: color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getPriorityColor = (priority) => {
    switch(priority) {
      case "Critical": return "error";
      case "High": return "warning";
      case "Medium": return "info";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    return status === "Approved" ? "success" : status === "Pending" ? "warning" : "error";
  };

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      {/* <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)", color: "white" }}> */}
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold">
              Welcome back, {user?.name || "Admin"}! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Here's what's happening with your organization today
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.2)", p: 2, borderRadius: 3 }}>
              <AdminPanelSettingsIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">Admin Panel</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Full System Access</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {adminStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Employees */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
                  Recent Employees
                </Typography>
                <Button size="small" onClick={() => navigate("/employees")}>View All</Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#F8FAFC" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEmployees.map((emp, i) => (
                      <TableRow key={i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, background: "#3B82F6", fontSize: "0.8rem" }}>{emp.avatar}</Avatar>
                            <Typography fontWeight="500">{emp.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell>
                          <Chip label={emp.department} size="small" sx={{ background: "#EBF5FF", color: "#3B82F6" }} />
                        </TableCell>
                        <TableCell>{emp.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Tasks */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
                  Pending Tasks
                </Typography>
                <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
              </Box>
              {pendingTasks.map((task, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography fontWeight="600">{task.task}</Typography>
                    <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="caption" color="textSecondary">
                      Assigned to: {task.assignedTo} | Due: {task.deadline}
                    </Typography>
                    <Typography variant="caption" fontWeight="bold" color="primary">{task.progress}%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={task.progress} sx={{ mt: 1, height: 6, borderRadius: 3 }} />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Requests */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
                  Leave Requests
                </Typography>
                <Button size="small" onClick={() => navigate("/leave")}>View All</Button>
              </Box>
              {leaveRequests.map((leave, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography fontWeight="600">{leave.employee}</Typography>
                    <Typography variant="caption" color="textSecondary">{leave.type} - {leave.days} day(s) | {leave.department}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" variant="contained" color="success" sx={{ minWidth: 60 }}>Approve</Button>
                    <Button size="small" variant="outlined" color="error" sx={{ minWidth: 60 }}>Reject</Button>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Department Overview */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#1E3A8A" }}>
                  Department Overview
                </Typography>
                <Button size="small" onClick={() => navigate("/departments")}>View All</Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#F8FAFC" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Present</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Leave</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>WFH</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departmentStats.map((dept, i) => (
                      <TableRow key={i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                        <TableCell>
                          <Chip label={dept.name} size="small" sx={{ background: "#EBF5FF", color: "#3B82F6", fontWeight: "bold" }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{dept.employees}</TableCell>
                        <TableCell>
                          <Chip label={dept.present} size="small" color="success" />
                        </TableCell>
                        <TableCell>
                          <Chip label={dept.leave} size="small" color="warning" />
                        </TableCell>
                        <TableCell>
                          <Chip label={dept.wfh} size="small" color="info" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

