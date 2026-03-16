import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Avatar, LinearProgress, Divider } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import BusinessIcon from "@mui/icons-material/Business";
import EventIcon from "@mui/icons-material/Event";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WorkIcon from "@mui/icons-material/Work";
import { useNavigate } from "react-router-dom";

// StatsCards component now fetches real role-specific data
import StatsCards from "../components/StatsCards.jsx";

const recentHires = [
  // { name: "John Doe", position: "Developer", department: "IT", date: "2024-01-15", status: "Active", avatar: "JD" },
  // { name: "Jane Smith", position: "Designer", department: "Design", date: "2024-01-14", status: "Active", avatar: "JS" },
  // { name: "Mike Johnson", position: "Manager", department: "Sales", date: "2024-01-13", status: "Probation", avatar: "MJ" },
  // { name: "Sarah Wilson", position: "HR Executive", department: "HR", date: "2024-01-12", status: "Active", avatar: "SW" }
];

const leaveRequests = [
  // { employee: "Tom Brown", type: "Sick Leave", days: 2, status: "Pending", department: "IT", reason: "Medical checkup" },
  // { employee: "Emily Davis", type: "Casual Leave", days: 1, status: "Approved", department: "Sales", reason: "Personal work" },
  // { employee: "Michael Lee", type: "Annual Leave", days: 5, status: "Pending", department: "Marketing", reason: "Family vacation" },
  // { employee: "Lisa Anderson", type: "Sick Leave", days: 3, status: "Approved", department: "IT", reason: "Surgery" }
];

const departments = [
  // { name: "IT", head: "John Doe", employees: 15, vacancies: 3 },
  // { name: "Sales", head: "Mike Johnson", employees: 10, vacancies: 2 },
  // { name: "Marketing", head: "Sarah Wilson", employees: 8, vacancies: 1 },
  // { name: "HR", head: "Lisa Anderson", employees: 5, vacancies: 1 },
  // { name: "Design", head: "Jane Smith", employees: 7, vacancies: 2 }
];

function StatCard({ title, value, icon, color, bg }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)", height: "100%" }}>
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

export default function HRDashboard() {
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
      Active: { bg: "#ECFDF5", color: "#059669" },
      Probation: { bg: "#FEF3C7", color: "#D97706" },
      Pending: { bg: "#FFFBEB", color: "#D97706" },
      Approved: { bg: "#ECFDF5", color: "#059669" },
      Rejected: { bg: "#FEF2F2", color: "#DC2626" }
    };
    const style = colors[status] || colors.Pending;
    return <Chip label={status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #059669 0%, #10B981 100%)", color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold">
              Welcome, {user?.name || "HR"}! 👋
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Manage your organization's workforce efficiently
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.2)", p: 2, borderRadius: 3 }}>
              <WorkIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">HR Panel</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Employee Management</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}

      <Grid container spacing={3} sx={{ mb: 5 }}>

        <StatsCards />

      </Grid>

      <Box sx={{ height: 20 }} />

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Hires */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#059669" }}>
                  Recent Hires
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
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentHires.map((emp, i) => (
                      <TableRow key={i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, background: "#059669", fontSize: "0.8rem" }}>{emp.avatar}</Avatar>
                            <Typography fontWeight="500">{emp.name}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{emp.position}</TableCell>
                        <TableCell>
                          <Chip label={emp.department} size="small" sx={{ background: "#ECFDF5", color: "#059669" }} />
                        </TableCell>
                        <TableCell>{getStatusChip(emp.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Requests */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#059669" }}>
                  Leave Requests
                </Typography>
                <Button size="small" onClick={() => navigate("/leave")}>View All</Button>
              </Box>
              {leaveRequests.map((leave, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography fontWeight="600">{leave.employee}</Typography>
                    <Typography variant="caption" color="textSecondary">{leave.type} - {leave.days} day(s) | {leave.department}</Typography>
                    <Typography variant="caption" display="block" color="textSecondary">Reason: {leave.reason}</Typography>
                  </Box>
                  {leave.status === "Pending" && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" variant="contained" color="success" sx={{ minWidth: 70 }}>Approve</Button>
                      <Button size="small" variant="outlined" color="error" sx={{ minWidth: 70 }}>Reject</Button>
                    </Box>
                  )}
                  {leave.status !== "Pending" && getStatusChip(leave.status)}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Department Overview */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#059669" }}>
                  Department Overview
                </Typography>
                <Button size="small" onClick={() => navigate("/departments")}>Manage Departments</Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ background: "#F8FAFC" }}>
                      <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Department Head</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Total Employees</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Vacancies</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {departments.map((dept, i) => (
                      <TableRow key={i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                        <TableCell>
                          <Chip label={dept.name} size="small" sx={{ background: "#ECFDF5", color: "#059669", fontWeight: "bold" }} />
                        </TableCell>
                        <TableCell>{dept.head}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{dept.employees}</TableCell>
                        <TableCell>
                          <Chip label={dept.vacancies} size="small" color="warning" />
                        </TableCell>
                        <TableCell>
                          <Button size="small" variant="outlined">View</Button>
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