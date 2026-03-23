import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, CircularProgress, useTheme, Stack } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import RealTimeClock from "../components/dashboard/RealTimeClock";
import AnnouncementCard from "../components/dashboard/AnnouncementCard";
import HolidayCard from "../components/dashboard/HolidayCard";
import QuickActions from "../components/dashboard/QuickActions";
import ProfileCard from "../components/dashboard/ProfileCard";

function StatCard({ title, value, icon, color, bg, loading }) {
  return (
    <Card sx={{
      borderRadius: 4,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      p: 2,
      transition: "transform 0.2s",
      "&:hover": { transform: "translateY(-4px)" }
    }}>
      <Box sx={{
        p: 1.5,
        mb: 1.5,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 24, color: color } })}
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>
        {title}
      </Typography>
      {loading ? (
        <CircularProgress size={20} sx={{ color: color }} />
      ) : (
        <Typography variant="h4" fontWeight="bold" sx={{ color: color }}>
          {value}
        </Typography>
      )}
    </Card>
  );
}

export default function HRDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    leaveRequests: 0,
    pendingTasks: 0,
    wfhToday: 0,
    wfhRequests: 0,
    leaveBalance: 0
  });

  const [recentEmployees, setRecentEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [wfhRequests, setWfhRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchEmployees(),
        fetchLeaves(),
        fetchWFH(),
        fetchAnnouncements(),
        fetchHolidays(),
        fetchLeaveBalance()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      const data = res.data;
      setStats(prev => ({
        ...prev,
        totalEmployees: data.totalEmployees || 0,
        presentToday: data.presentToday || 0,
        wfhToday: data.wfhToday || 0
      }));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      const data = res.data;
      let employeesArray = Array.isArray(data) ? data : (data.employees || []);
      setEmployees(employeesArray);

      const sorted = [...employeesArray].sort((a, b) =>
        new Date(b.created_at || b.join_date) - new Date(a.created_at || a.join_date)
      );
      setRecentEmployees(sorted.slice(0, 5));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      const leaves = res.data?.data || res.data || [];
      setLeaveRequests(leaves.slice(0, 4));
      const pending = leaves.filter(l => l.status === "Pending");
      setStats(prev => ({ ...prev, leaveRequests: pending.length }));
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchWFH = async () => {
    try {
      const res = await api.get("/wfh/all");
      const wfh = res.data || [];
      setWfhRequests(wfh.slice(0, 4));
      const pending = wfh.filter(r => r.status === "pending");
      setStats(prev => ({ ...prev, wfhRequests: pending.length }));
    } catch (error) {
      console.error("Error fetching WFH requests:", error);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const employeeId = userData?.employee_id || userData?.id;
      const res = await api.get(`/employees/${employeeId}`);
      setStats(prev => ({ ...prev, leaveBalance: res.data?.leave_balance || 0 }));
    } catch (error) {
      console.error("Error fetching leave balance:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const res = await api.get("/holidays");
      setHolidays(res.data || []);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find(e => e.id === parseInt(id) || e.id === id);
    return emp ? emp.name : `ID: ${id}`;
  };

  const handleApproveLeave = async (id) => {
    try {
      await api.put(`/leaves/${id}`, { status: "Approved" });
      fetchLeaves();
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await api.put(`/leaves/${id}`, { status: "Rejected" });
      fetchLeaves();
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      Active: { bg: "success.light", color: "success.main" },
      Probation: { bg: "warning.light", color: "warning.main" },
      Pending: { bg: "warning.light", color: "warning.main" },
      Approved: { bg: "success.light", color: "success.main" },
      Rejected: { bg: "error.light", color: "error.main" }
    };
    const style = colors[status] || colors.Pending;
    return <Chip label={status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const hrStats = [
    { title: "Total Employees", value: stats.totalEmployees, icon: <PeopleIcon />, color: "primary.main", bg: "action.hover" },
    { title: "Present Today", value: stats.presentToday, icon: <CheckCircleIcon />, color: "success.main", bg: "action.hover" },
    { title: "Leave Requests", value: stats.leaveRequests, icon: <BeachAccessIcon />, color: "warning.main", bg: "action.hover" },
    { title: "WFH Requests", value: stats.wfhRequests, icon: <HomeWorkIcon />, color: "info.main", bg: "action.hover" },
    { title: "Active", value: stats.totalEmployees, icon: <AssignmentIcon />, color: "error.main", bg: "action.hover" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`, color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" fontWeight="bold">
              Welcome, {user?.name || "HR"}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Manage your organization's workforce efficiently
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
            <RealTimeClock />
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {hrStats.map((stat, index) => (
          <Box key={index} sx={{ width: 197 }}>
            <StatCard {...stat} loading={loading} />
          </Box>
        ))}
      </Box>

      {/* Layout Grid */}
      <Grid container spacing={3}>
        {/* Left column (70%) */}
        <Grid size={{ xs: 12, lg: 8.5 }}>
          <Stack spacing={3}>
            {/* My Profile - Standardized */}
            <ProfileCard user={user} leaveBalance={stats.leaveBalance} />

            {/* Employee Directory */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
                    Employee Directory
                  </Typography>
                  <Button size="small" onClick={() => navigate("/employees")}>View All</Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : employees.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No employees found
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ background: "action.hover" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {employees.slice(0, 5).map((emp, i) => (
                          <TableRow key={emp.id || i} sx={{ "&:hover": { background: "action.hover" } }}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Avatar sx={{ width: 32, height: 32, background: theme.palette.primary.main, fontSize: "0.8rem" }}>
                                  {emp.name?.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                </Avatar>
                                <Typography fontWeight="500" variant="body2">{emp.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell variant="body2">{emp.position || "-"}</TableCell>
                            <TableCell>
                              <Chip label={emp.department_name || "Not Assigned"} size="small" sx={{ background: "action.selected", color: "primary.main" }} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>

            {/* Leave Requests */}
            {leaveRequests.length > 0 && (
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "warning.main" }}>
                      Recent Leave Requests
                    </Typography>
                    <Button size="small" color="warning" onClick={() => navigate("/leave")}>View All</Button>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                      <CircularProgress color="warning" />
                    </Box>
                  ) : (
                    leaveRequests.map((leave, i) => (
                      <Box key={leave.id || i} sx={{ p: 2, mb: 1, borderRadius: 2, bgcolor: "background.default", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid", borderColor: "divider" }}>
                        <Box>
                          <Typography fontWeight="600" variant="body2">{leave.name || getEmployeeName(leave.employee_id)}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {leave.start_date?.split("T")[0]} to {leave.end_date?.split("T")[0]}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button size="small" variant="contained" color="success" onClick={() => handleApproveLeave(leave.id)}>
                            Approve
                          </Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleRejectLeave(leave.id)}>
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            )}

            {/* WFH Requests */}
            {wfhRequests.length > 0 && (
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "info.main" }}>
                      Recent WFH Requests
                    </Typography>
                    <Button size="small" color="info" onClick={() => navigate("/wfh")}>View All</Button>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                      <CircularProgress color="info" />
                    </Box>
                  ) : (
                    wfhRequests.map((request, i) => (
                      <Box key={request.id || i} sx={{ p: 2, mb: 1, borderRadius: 2, bgcolor: "background.default", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid", borderColor: "divider" }}>
                        <Box>
                          <Typography fontWeight="600" variant="body2">{request.name || getEmployeeName(request.employee_id)}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Applied for: {request.date?.split("T")[0]}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button size="small" color="info">Manage</Button>
                        </Box>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        {/* Right column (30%) */}
        <Grid size={{ xs: 12, lg: 3.5 }}>
          <Stack spacing={3}>
            <QuickActions role="hr" />
            {/* PayslipCard REMOVED */}
            <AnnouncementCard announcements={announcements} loading={loading} />
            <HolidayCard holidays={holidays} loading={loading} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
