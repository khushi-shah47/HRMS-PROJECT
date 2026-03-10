import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, LinearProgress, Divider } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CodeIcon from "@mui/icons-material/Code";
import TimerIcon from "@mui/icons-material/Timer";
import EventNoteIcon from "@mui/icons-material/EventNote";
import { useNavigate } from "react-router-dom";

// Developer-specific stats
const developerStats = [
  { title: "My Tasks", value: 8, icon: <AssignmentIcon />, color: "#DC2626", bg: "#FEF2F2" },
  { title: "Completed", value: 5, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
  { title: "In Progress", value: 3, icon: <AccessTimeIcon />, color: "#F59E0B", bg: "#FFFBEB" },
  { title: "Leave Balance", value: 15, icon: <BeachAccessIcon />, color: "#8B5CF6", bg: "#F5F3FF" },
  { title: "WFH Balance", value: 4, icon: <HomeWorkIcon />, color: "#06B6D4", bg: "#ECFEFF" },
  { title: "Hours This Week", value: 38, icon: <TimerIcon />, color: "#3B82F6", bg: "#EBF5FF" }
];

const myTasks = [
  { task: "Fix login bug", status: "In Progress", deadline: "2024-01-20", priority: "High", progress: 60, assignedBy: "John Manager" },
  { task: "Update API documentation", status: "Pending", deadline: "2024-01-22", priority: "Medium", progress: 0, assignedBy: "Jane Smith" },
  { task: "Write unit tests", status: "Completed", deadline: "2024-01-18", priority: "High", progress: 100, assignedBy: "Mike Johnson" },
  { task: "Code review for PR #45", status: "In Progress", deadline: "2024-01-19", priority: "Medium", progress: 45, assignedBy: "Sarah Wilson" },
  { task: "Database optimization", status: "Pending", deadline: "2024-01-25", priority: "Low", progress: 0, assignedBy: "Tom Brown" }
];

const attendanceHistory = [
  { date: "2024-01-15", status: "Present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: 9 },
  { date: "2024-01-16", status: "Present", checkIn: "09:15 AM", checkOut: "06:30 PM", hours: 9.25 },
  { date: "2024-01-17", status: "WFH", checkIn: "09:00 AM", checkOut: "05:30 PM", hours: 8.5 },
  { date: "2024-01-18", status: "Present", checkIn: "09:00 AM", checkOut: "06:00 PM", hours: 9 },
  { date: "2024-01-19", status: "Leave", checkIn: "-", checkOut: "-", hours: 0 }
];

const upcomingDeadlines = [
  { task: "Fix login bug", deadline: "2024-01-20", daysLeft: 1 },
  { task: "Code review for PR #45", deadline: "2024-01-19", daysLeft: 0 },
  { task: "Update API documentation", deadline: "2024-01-22", daysLeft: 3 }
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

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} sx={{ height: 8, borderRadius: 4 }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value,
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function DeveloperDashboard() {
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
      "In Progress": { bg: "#FEF3C7", color: "#D97706" },
      Completed: { bg: "#ECFDF5", color: "#059669" },
      Pending: { bg: "#F3F4F6", color: "#6B7280" },
      WFH: { bg: "#EDE9FE", color: "#7C3AED" },
      Leave: { bg: "#FFEDD5", color: "#EA580C" },
      Present: { bg: "#ECFDF5", color: "#059669" }
    };
    const style = colors[status] || colors.Pending;
    return <Chip label={status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "High" ? "error" : priority === "Medium" ? "warning" : "info";
  };

  const getDaysLeftColor = (days) => {
    if (days <= 0) return "#DC2626";
    if (days <= 2) return "#F59E0B";
    return "#16A34A";
  };

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #DC2626 0%, #EF4444 100%)", color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold">
              Hello, {user?.name || "Developer"}! 👨‍💻
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Track your tasks and stay productive
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.2)", p: 2, borderRadius: 3 }}>
              <CodeIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">Developer</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Personal Workspace</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {developerStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* My Tasks */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626" }}>
                  My Tasks
                </Typography>
                <Button size="small" onClick={() => navigate("/tasks")}>View All Tasks</Button>
              </Box>
              {myTasks.map((task, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography fontWeight="600">{task.task}</Typography>
                      <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
                    </Box>
                    {getStatusChip(task.status)}
                  </Box>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Assigned by: {task.assignedBy} | Due: {task.deadline}
                  </Typography>
                  {task.status !== "Pending" && (
                    <Box sx={{ mt: 1.5 }}>
                      <LinearProgressWithLabel value={task.progress} />
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626", mb: 3 }}>
                Upcoming Deadlines
              </Typography>
              {upcomingDeadlines.map((item, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", borderLeft: `4px solid ${getDaysLeftColor(item.daysLeft)}` }}>
                  <Typography fontWeight="600">{item.task}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    Due: {item.deadline}
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" sx={{ color: getDaysLeftColor(item.daysLeft), mt: 0.5 }}>
                    {item.daysLeft <= 0 ? "Overdue!" : `${item.daysLeft} day(s) left`}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626", mb: 2 }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Button variant="outlined" fullWidth onClick={() => navigate("/leave")} sx={{ justifyContent: "flex-start" }}>
                  <BeachAccessIcon sx={{ mr: 1 }} /> Request Leave
                </Button>
                <Button variant="outlined" fullWidth onClick={() => navigate("/wfh")} sx={{ justifyContent: "flex-start" }}>
                  <HomeWorkIcon sx={{ mr: 1 }} /> Request WFH
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance History */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#DC2626" }}>
                  Attendance History
                </Typography>
                <Button size="small" onClick={() => navigate("/attendance")}>View Full History</Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#F8FAFC" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Check In</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Check Out</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Total Hours</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {attendanceHistory.map((att, i) => (
                      <TableRow key={i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                        <TableCell>{att.date}</TableCell>
                        <TableCell>{getStatusChip(att.status)}</TableCell>
                        <TableCell>{att.checkIn}</TableCell>
                        <TableCell>{att.checkOut}</TableCell>
                        <TableCell>
                          <Chip 
                            label={`${att.hours} hrs`} 
                            size="small" 
                            sx={{ background: att.hours >= 8 ? "#ECFDF5" : "#FEF2F2", color: att.hours >= 8 ? "#059669" : "#DC2626" }} 
                          />
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

