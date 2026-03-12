import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, LinearProgress, Divider } from "@mui/material";
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

// Role-based stats configuration
const roleStats = {
  admin: [
    { title: "Total Employees", value: 45, icon: <PeopleIcon />, color: "#3B82F6", bg: "#EBF5FF" },
    { title: "Present Today", value: 38, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "On Leave", value: 5, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "WFH", value: 7, icon: <HomeWorkIcon />, color: "#8B5CF6", bg: "#F5F3FF" },
    { title: "Pending Tasks", value: 23, icon: <AssignmentIcon />, color: "#EF4444", bg: "#FEF2F2" },
    { title: "New Hires", value: 8, icon: <PersonAddIcon />, color: "#06B6D4", bg: "#ECFEFF" }
  ],
  manager: [
    { title: "Team Members", value: 15, icon: <PeopleIcon />, color: "#3B82F6", bg: "#EBF5FF" },
    { title: "Present Today", value: 12, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "Pending Leaves", value: 4, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "Active Tasks", value: 18, icon: <AssignmentIcon />, color: "#EF4444", bg: "#FEF2F2" },
    { title: "WFH Requests", value: 3, icon: <HomeWorkIcon />, color: "#8B5CF6", bg: "#F5F3FF" }
  ],
  hr: [
    { title: "Total Employees", value: 45, icon: <PeopleIcon />, color: "#3B82F6", bg: "#EBF5FF" },
    { title: "Present Today", value: 38, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "Leave Requests", value: 8, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "Departments", value: 6, icon: <TrendingUpIcon />, color: "#8B5CF6", bg: "#F5F3FF" }
  ],
  developer: [
    { title: "My Tasks", value: 8, icon: <AssignmentIcon />, color: "#3B82F6", bg: "#EBF5FF" },
    { title: "Completed", value: 5, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "In Progress", value: 3, icon: <AccessTimeIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "Leave Balance", value: 15, icon: <BeachAccessIcon />, color: "#8B5CF6", bg: "#F5F3FF" }
  ],
  intern: [
    { title: "Assigned Tasks", value: 4, icon: <AssignmentIcon />, color: "#3B82F6", bg: "#EBF5FF" },
    { title: "Completed", value: 2, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "In Progress", value: 2, icon: <AccessTimeIcon />, color: "#F59E0B", bg: "#FFFBEB" }
  ]
};

// Sample data for different roles
const sampleData = {
  admin: {
    recentEmployees: [
      { name: "John Doe", position: "Developer", department: "IT", date: "2024-01-15" },
      { name: "Jane Smith", position: "Designer", department: "Design", date: "2024-01-14" },
      { name: "Mike Johnson", position: "Manager", department: "Sales", date: "2024-01-13" }
    ],
    pendingTasks: [
      { task: "Update login page", assignedTo: "John Doe", priority: "High", deadline: "2024-01-20" },
      { task: "Fix navigation bug", assignedTo: "Jane Smith", priority: "Medium", deadline: "2024-01-22" },
      { task: "Design dashboard", assignedTo: "Mike Johnson", priority: "High", deadline: "2024-01-21" }
    ],
    leaveRequests: [
      { employee: "Sarah Wilson", type: "Sick Leave", days: 2, status: "Pending" },
      { employee: "Tom Brown", type: "Casual Leave", days: 1, status: "Pending" }
    ]
  },
  manager: {
    teamAttendance: [
      { name: "John Doe", status: "Present", time: "09:00 AM" },
      { name: "Jane Smith", status: "Present", time: "09:15 AM" },
      { name: "Mike Johnson", status: "WFH", time: "-" },
      { name: "Sarah Wilson", status: "Leave", time: "-" }
    ],
    pendingTasks: [
      { task: "Client presentation", assignedTo: "John Doe", priority: "High", deadline: "2024-01-20" },
      { task: "Code review", assignedTo: "Jane Smith", priority: "Medium", deadline: "2024-01-22" }
    ],
    leaveRequests: [
      { employee: "Tom Brown", type: "Casual Leave", days: 1, status: "Pending" }
    ]
  },
  hr: {
    recentHires: [
      { name: "John Doe", position: "Developer", department: "IT", date: "2024-01-15" },
      { name: "Jane Smith", position: "Designer", department: "Design", date: "2024-01-14" }
    ],
    leaveRequests: [
      { employee: "Sarah Wilson", type: "Sick Leave", days: 2, status: "Pending" },
      { employee: "Tom Brown", type: "Casual Leave", days: 1, status: "Approved" }
    ]
  },
  developer: {
    myTasks: [
      { task: "Fix login bug", status: "In Progress", deadline: "2024-01-20", progress: 60 },
      { task: "Update API documentation", status: "Pending", deadline: "2024-01-22", progress: 0 },
      { task: "Write unit tests", status: "Completed", deadline: "2024-01-18", progress: 100 }
    ]
  },
  intern: {
    myTasks: [
      { task: "Learn codebase", status: "In Progress", deadline: "2024-01-20", progress: 40 },
      { task: "Complete training", status: "Completed", deadline: "2024-01-15", progress: 100 },
      { task: "Setup environment", status: "Completed", deadline: "2024-01-14", progress: 100 }
    ]
  }
};

// Get role display info
const getRoleInfo = (role) => {
  const roles = {
    admin: { title: "Admin Dashboard", subtitle: "Full System Overview", color: "#1E3A8A", bg: "#EEF2FF" },
    manager: { title: "Manager Dashboard", subtitle: "Team Overview", color: "#7C3AED", bg: "#F5F3FF" },
    hr: { title: "HR Dashboard", subtitle: "Employee Management", color: "#059669", bg: "#ECFDF5" },
    developer: { title: "Developer Dashboard", subtitle: "My Tasks & Attendance", color: "#DC2626", bg: "#FEF2F2" },
    intern: { title: "Intern Dashboard", subtitle: "Learning Progress", color: "#D97706", bg: "#FFFBEB" }
  };
  return roles[role] || roles.developer;
};

// Stat Card Component
function StatCard({ title, value, icon, color, bg }) {
  return (
    <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" sx={{ color: color }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
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

// Task Progress Component
function TaskProgress({ task, status, deadline, progress }) {
  const getStatusColor = (status) => {
    switch(status) {
      case "Completed": return "success";
      case "In Progress": return "warning";
      default: return "default";
    }
  };
  
  return (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="body2" fontWeight="500">{task}</Typography>
        <Chip label={status} size="small" color={getStatusColor(status)} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <LinearProgress variant="determinate" value={progress} sx={{ flexGrow: 1, height: 6, borderRadius: 3 }} />
        <Typography variant="caption" color="textSecondary">{progress}%</Typography>
      </Box>
      <Typography variant="caption" color="textSecondary">Due: {deadline}</Typography>
    </Box>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3, display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const role = user?.role || "developer";
  const roleInfo = getRoleInfo(role);
  const stats = roleStats[role] || roleStats.developer;
  const data = sampleData[role] || sampleData.developer;

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 3, borderRadius: 3, background: roleInfo.bg }}>
        <Typography variant="h4" fontWeight="bold" sx={{ color: roleInfo.color }}>
          {roleInfo.title}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {roleInfo.subtitle}
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Role-specific Content */}
      <Grid container spacing={3}>
        {/* Admin Content */}
        {role === "admin" && (
          <>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
                    Recent Employees
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Position</TableCell>
                          <TableCell>Department</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.recentEmployees.map((emp, i) => (
                          <TableRow key={i}>
                            <TableCell>{emp.name}</TableCell>
                            <TableCell>{emp.position}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>{emp.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
                    Pending Tasks
                  </Typography>
                  {data.pendingTasks.map((task, i) => (
                    <Box key={i} sx={{ p: 1.5, mb: 1, borderRadius: 1, background: "#F8FAFC" }}>
                      <Typography fontWeight="500">{task.task}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Assigned to: {task.assignedTo} | Priority: {task.priority} | Due: {task.deadline}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
                    Leave Requests
                  </Typography>
                  {data.leaveRequests.map((leave, i) => (
                    <Box key={i} sx={{ p: 1.5, mb: 1, borderRadius: 1, background: "#F8FAFC", display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography fontWeight="500">{leave.employee}</Typography>
                        <Typography variant="caption" color="textSecondary">{leave.type} - {leave.days} day(s)</Typography>
                      </Box>
                      <Chip label={leave.status} size="small" color="warning" />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Manager Content */}
        {role === "manager" && (
          <>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#7C3AED" }}>
                    Team Attendance Today
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Employee</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Time</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.teamAttendance.map((att, i) => (
                          <TableRow key={i}>
                            <TableCell>{att.name}</TableCell>
                            <TableCell>
                              <Chip 
                                label={att.status} 
                                size="small" 
                                color={att.status === "Present" ? "success" : att.status === "WFH" ? "info" : "warning"} 
                              />
                            </TableCell>
                            <TableCell>{att.time}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#7C3AED" }}>
                    Team Tasks
                  </Typography>
                  {data.pendingTasks.map((task, i) => (
                    <Box key={i} sx={{ p: 1.5, mb: 1, borderRadius: 1, background: "#F8FAFC" }}>
                      <Typography fontWeight="500">{task.task}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        Assigned to: {task.assignedTo} | Priority: {task.priority} | Due: {task.deadline}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* HR Content */}
        {role === "hr" && (
          <>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#059669" }}>
                    Recent Hires
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Position</TableCell>
                          <TableCell>Department</TableCell>
                          <TableCell>Join Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data.recentHires.map((emp, i) => (
                          <TableRow key={i}>
                            <TableCell>{emp.name}</TableCell>
                            <TableCell>{emp.position}</TableCell>
                            <TableCell>{emp.department}</TableCell>
                            <TableCell>{emp.date}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#059669" }}>
                    Leave Requests
                  </Typography>
                  {data.leaveRequests.map((leave, i) => (
                    <Box key={i} sx={{ p: 1.5, mb: 1, borderRadius: 1, background: "#F8FAFC", display: "flex", justifyContent: "space-between" }}>
                      <Box>
                        <Typography fontWeight="500">{leave.employee}</Typography>
                        <Typography variant="caption" color="textSecondary">{leave.type} - {leave.days} day(s)</Typography>
                      </Box>
                      <Chip 
                        label={leave.status} 
                        size="small" 
                        color={leave.status === "Approved" ? "success" : "warning"} 
                      />
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
          </>
        )}

        {/* Developer Content */}
        {(role === "developer" || role === "intern") && (
          <Grid item xs={12}>
            <Card sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: "#DC2626" }}>
                  My Tasks
                </Typography>
                {data.myTasks.map((task, i) => (
                  <TaskProgress key={i} {...task} />
                ))}
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}