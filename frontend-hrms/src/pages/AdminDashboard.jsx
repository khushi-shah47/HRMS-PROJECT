import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Avatar, LinearProgress, CircularProgress, useTheme } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BusinessIcon from "@mui/icons-material/Business";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PersonIcon from "@mui/icons-material/Person";
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

export default function AdminDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    wfhToday: 0,
    pendingTasks: 0,
    totalDepartments: 0,
    wfhPending: 0,
    leaveBalance: 0
  });

  const [recentEmployees, setRecentEmployees] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
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
  const [employee,setEmployee] = useState([]);
  useEffect(() => {
  if (user?.id) {
      api.get(`/employees/user/${user.id}`)
        .then(res => setEmployee(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchEmployees(),
        fetchTasks(),
        fetchLeaves(),
        fetchDepartments(),
        fetchAnnouncements(),
        fetchHolidays()
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
        onLeave: data.leavesToday || 0,
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

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const tasks = res.data || [];

      const pending = tasks.filter(t => t.status === "pending" || t.status === "in_progress");
      setPendingTasks(pending.slice(0, 4));

      setStats(prev => ({ ...prev, pendingTasks: pending.length }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves");
      const leaves = res.data?.data || res.data || [];

      const pendingLeaves = leaves.filter(l => l.status === "Pending");
      setLeaveRequests(pendingLeaves.slice(0, 3));
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchWFHRequests = async () => {
    try {
      const res = await api.get("/wfh/all");
      const wfh = res.data || [];
      const pending = wfh.filter(r => r.status === "pending");
      setStats(prev => ({ ...prev, wfhPending: pending.length }));
    } catch (error) {
      console.error("Error fetching WFH requests:", error);
    }
  };


  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments/all");
      const depts = res.data || [];
      setDepartments(depts);
      setStats(prev => ({ ...prev, totalDepartments: depts.length }));
    } catch (error) {
      console.error("Error fetching departments:", error);
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

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      default: return "success";
    }
  };


  const adminStats = [
    { title: "Total Employees", value: stats.totalEmployees, icon: <PeopleIcon />, color: "primary.main", bg: "action.hover" },
    { title: "Present Today", value: stats.presentToday, icon: <CheckCircleIcon />, color: "success.main", bg: "action.hover" },
    { title: "On Leave", value: stats.onLeave, icon: <BeachAccessIcon />, color: "warning.main", bg: "action.hover" },
    { title: "WFH Today", value: stats.wfhToday, icon: <HomeWorkIcon />, color: "secondary.main", bg: "action.hover" },
    { title: "Pending Tasks", value: stats.pendingTasks, icon: <AssignmentIcon />, color: "error.main", bg: "action.hover" },
    { title: "Departments", value: stats.totalDepartments, icon: <BusinessIcon />, color: "info.main", bg: "action.hover" }
  ];
return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" fontWeight="bold">
              Welcome back, {user?.name || "Admin"}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Here's what's happening with your organization today
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
            <RealTimeClock />
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards Row */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {adminStats.map((stat, index) => (
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
            {/* <ProfileCard user={user} leaveBalance={stats.leaveBalance} /> */}

            <Card sx={{ borderRadius: 3, p: 2 }}>
      <CardContent>

    {/* Header inside card */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
      <Avatar
        sx={{
          width: 50,
          height: 50,
          bgcolor: "primary.main",
          mr : 1.5
        }}
        src={
          employee?.profile_image
            ? `http://localhost:5000/${employee.profile_image}`
            : ""
        }
      >
        {!employee?.profile_image && <PersonIcon />}
      </Avatar>

      <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }} >
        My Profile
      </Typography>
    </Box>
    

    {/* Profile Details */}
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">

          {/* Name */}
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="h6">
              {(user && user.name) ? user.name : "-"}
            </Typography>
          </Grid>

          {/* Email */}
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="h6">
              {(user && user.email) ? user.email : "-"}
            </Typography>
          </Grid>

          {/* Role */}
          <Grid item xs={12} md={4}>
            <Typography variant="body2" color="text.secondary">
              Role
            </Typography>
            <Typography variant="h6">
              {(user && user.role) ? user.role : "-"}
            </Typography>
          </Grid>

        </Grid>
            </CardContent>
          </Card>

            {/* Recent Employees */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
                    Recent Employees
                  </Typography>
                  <Button size="small" onClick={() => navigate("/employees")}>View All</Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : recentEmployees.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No employees found
                  </Typography>
                ) : (
                  <TableContainer>
                    <TableContainer sx={{ overflowX: 'auto' }}>
                   <Table>
                      <TableHead>
                        <TableRow sx={{ background: "action.hover" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentEmployees.map((emp, i) => (
                          <TableRow key={emp.id || i} sx={{ "&:hover": { background: "action.hover" } }}>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                {/* <Avatar sx={{ width: 32, height: 32, background: theme.palette.primary.main, fontSize: "0.8rem" }}>
                                  {emp.name?.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                </Avatar> */}
                                <Typography fontWeight="500">{emp.name}</Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{emp.position || "-"}</TableCell>
                            <TableCell>
                              <Chip label={emp.department_name || "Not Assigned"} size="small" sx={{ background: "action.selected", color: "primary.main" }} />
                            </TableCell>
                            <TableCell>{emp.join_date?.split("T")[0] || "-"}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
        </TableContainer>
                  </TableContainer>
                )}
              </CardContent>
            </Card>

            {/* Pending Tasks */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
                    Pending Tasks
                  </Typography>
                  <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : pendingTasks.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No pending tasks
                  </Typography>
                ) : (
                  pendingTasks.map((task, i) => (
                    <Box key={task.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography fontWeight="600">{task.title}</Typography>
                        <Chip label={task.priority || "medium"} size="small" color={getPriorityColor(task.priority)} />
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        Assigned to: {getEmployeeName(task.assigned_to)} | Due: {task.due_date?.split("T")[0] || "Not set"}
                      </Typography>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Pending Leave Requests */}
            {leaveRequests.length > 0 && (
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "warning.main" }}>
                      Pending Leave Requests
                    </Typography>
                    <Button size="small" color="primary" onClick={() => navigate("/leave")}>View All</Button>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                      <CircularProgress color="primary" />
                    </Box>
                  ) : (
                    leaveRequests.map((leave, i) => (
                      <Box key={leave.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "background.default", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid", borderColor: "divider" }}>
                        <Box>
                          <Typography fontWeight="600">{leave.name || getEmployeeName(leave.employee_id)}</Typography>
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

            {/* Pending WFH Requests */}
            {stats.wfhPending > 0 && (
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "secondary.main" }}>
                      Pending WFH Requests
                    </Typography>
                    <Button size="small" color="secondary" onClick={() => navigate("/wfh")}>View All</Button>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                      <CircularProgress color="secondary" />
                    </Box>
                  ) : (
                     <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                        There are {stats.wfhPending} WFH requests pending in the system.
                     </Typography>
                  )}
                </CardContent>
              </Card>
            )}
          </Stack>
        </Grid>

        {/* Right column (30%) */}
        <Grid size={{ xs: 12, lg: 3.5 }}>
          <Stack spacing={3}>
            <QuickActions role="admin" />
            <AnnouncementCard announcements={announcements} loading={loading} />
            <HolidayCard holidays={holidays} loading={loading} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}