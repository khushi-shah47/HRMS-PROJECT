import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, LinearProgress, Divider, IconButton, Badge } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";

// Manager-specific stats
const managerStats = [
  { title: "Team Members", value: 15, icon: <PeopleIcon />, color: "#7C3AED", bg: "#F5F3FF" },
  { title: "Present Today", value: 12, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
  { title: "Pending Leaves", value: 4, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB" },
  { title: "Active Tasks", value: 18, icon: <AssignmentIcon />, color: "#EF4444", bg: "#FEF2F2" },
  { title: "WFH Requests", value: 3, icon: <HomeWorkIcon />, color: "#8B5CF6", bg: "#F5F3FF" },
  { title: "Completed Tasks", value: 25, icon: <CheckCircleOutlineIcon />, color: "#06B6D4", bg: "#ECFEFF" }
];

const teamMembers = [
  { name: "John Doe", position: "Senior Developer", status: "Present", avatar: "JD", tasks: 5, completed: 3 },
  { name: "Jane Smith", position: "Designer", status: "Present", avatar: "JS", tasks: 4, completed: 2 },
  { name: "Mike Johnson", position: "Backend Dev", status: "WFH", avatar: "MJ", tasks: 3, completed: 1 },
  { name: "Sarah Wilson", position: "QA Engineer", status: "Leave", avatar: "SW", tasks: 2, completed: 2 }
];

const teamAttendance = [
  { name: "John Doe", status: "Present", time: "09:00 AM", location: "Office" },
  { name: "Jane Smith", status: "Present", time: "09:15 AM", location: "Office" },
  { name: "Mike Johnson", status: "WFH", time: "-", location: "Home" },
  { name: "Sarah Wilson", status: "Leave", time: "-", location: "-" },
  { name: "Tom Brown", status: "Present", time: "09:30 AM", location: "Office" }
];

const pendingTasks = [
  { task: "Client presentation", assignedTo: "John Doe", priority: "High", deadline: "2024-01-20", progress: 80 },
  { task: "Code review", assignedTo: "Jane Smith", priority: "Medium", deadline: "2024-01-22", progress: 60 },
  { task: "API integration", assignedTo: "Mike Johnson", priority: "High", deadline: "2024-01-21", progress: 45 },
  { task: "Testing", assignedTo: "Sarah Wilson", priority: "Medium", deadline: "2024-01-23", progress: 30 }
];

const leaveRequests = [
  { employee: "Tom Brown", type: "Casual Leave", days: 1, status: "Pending", reason: "Personal work" },
  { employee: "Emily Davis", type: "Sick Leave", days: 2, status: "Pending", reason: "Medical appointment" }
];

function StatCard({ title, value, icon, color, bg }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: color }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 3, 
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 28, color: color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getStatusChip = (status) => {
    const colors = {
      Present: { bg: "#ECFDF5", color: "#16A34A" },
      WFH: { bg: "#F5F3FF", color: "#8B5CF6" },
      Leave: { bg: "#FFFBEB", color: "#F59E0B" },
      Absent: { bg: "#FEF2F2", color: "#EF4444" }
    };
    const style = colors[status] || colors.Absent;
    return <Chip label={status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "High" ? "error" : priority === "Medium" ? "warning" : "info";
  };

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)", color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, {user?.name || "Manager"}! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Here's your team overview for today
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.2)", p: 2, borderRadius: 3 }}>
              <SupervisedUserCircleIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">Manager Panel</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Team Management</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {managerStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Team Members */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#7C3AED" }}>
                  Team Members
                </Typography>
                <Button size="small" onClick={() => navigate("/employees")}>View All</Button>
              </Box>
              {teamMembers.map((member, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Avatar sx={{ background: "#7C3AED" }}>{member.avatar}</Avatar>
                    <Box>
                      <Typography fontWeight="600">{member.name}</Typography>
                      <Typography variant="caption" color="textSecondary">{member.position}</Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="caption" color="textSecondary">Tasks</Typography>
                      <Typography fontWeight="bold">{member.completed}/{member.tasks}</Typography>
                    </Box>
                    {getStatusChip(member.status)}
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Attendance */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#7C3AED" }}>
                  Team Attendance Today
                </Typography>
                <Button size="small" onClick={() => navigate("/attendance")}>View All</Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#F8FAFC" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Location</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamAttendance.map((att, i) => (
                      <TableRow key={i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                        <TableCell>
                          <Typography fontWeight="500">{att.name}</Typography>
                        </TableCell>
                        <TableCell>{getStatusChip(att.status)}</TableCell>
                        <TableCell>{att.time}</TableCell>
                        <TableCell>
                          <Chip label={att.location} size="small" sx={{ background: "#E0E7FF", color: "#4338CA" }} />
                        </TableCell>
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
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#7C3AED" }}>
                  Team Tasks
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
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#7C3AED" }}>
                  Pending Leave Requests
                </Typography>
                <Button size="small" onClick={() => navigate("/leave")}>View All</Button>
              </Box>
              {leaveRequests.map((leave, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography fontWeight="600">{leave.employee}</Typography>
                    <Typography variant="caption" color="textSecondary">{leave.type} - {leave.days} day(s)</Typography>
                    <Typography variant="caption" display="block" color="textSecondary">Reason: {leave.reason}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="small" variant="contained" color="success" sx={{ minWidth: 70 }}>Approve</Button>
                    <Button size="small" variant="outlined" color="error" sx={{ minWidth: 70 }}>Reject</Button>
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}