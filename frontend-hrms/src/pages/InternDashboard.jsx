import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Chip,Avatar, LinearProgress, CircularProgress, useTheme, Stack, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CampaignIcon from "@mui/icons-material/Campaign";
import PersonIcon from "@mui/icons-material/Person";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import RealTimeClock from "../components/dashboard/RealTimeClock";
import AnnouncementCard from "../components/dashboard/AnnouncementCard";
import HolidayCard from "../components/dashboard/HolidayCard";
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

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} sx={{ height: 8, borderRadius: 4 }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function InternDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    wfhToday: 0,
    leaveBalance: 0
  });


  const [myTasks, setMyTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);


  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAllData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchInternData();
    }
  }, [user]);

  const [employee,setEmployee] = useState([]);
  useEffect(() => {
  if (user?.id) {
      api.get(`/employees/user/${user.id}`)
        .then(res => setEmployee(res.data))
        .catch(err => console.error(err));
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      const data = res.data || {};
      setStats(prev => ({
        ...prev,
        presentToday: data.presentToday || 0,
        wfhToday: data.wfhToday || 0,
        leavesToday: data.leavesToday || data.onLeave || 0,
        totalEmployees: data.totalEmployees || 0
      }));
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchAnnouncements(),
        fetchHolidays(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks/my");
      const myTasksList = res.data || [];

      setMyTasks(myTasksList);

      const completed = myTasksList.filter(t => t.status === "completed").length;
      const inProgress = myTasksList.filter(t => t.status === "in_progress").length;
      const pending = myTasksList.filter(t => t.status === "pending" || !t.status).length;

      setStats(prev => ({
        ...prev,
        totalTasks: myTasksList.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        pendingTasks: pending
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };



  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data?.slice(0, 3) || []);
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

  const getStatusChip = (status) => {
    const colors = {
      "in_progress": { bg: "warning.light", color: "warning.dark", label: "In Progress" },
      "completed": { bg: "success.light", color: "success.dark", label: "Completed" },
      "pending": { bg: "action.hover", color: "text.secondary", label: "Pending" }
    };
    const style = colors[status] || colors.pending;
    return <Chip label={style.label || status} size="small" sx={{ bgcolor: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "error" : priority === "medium" ? "warning" : "info";
  };

  const taskCompletionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const internStats = [
    { title: "Present Today", value: stats.presentToday || 0, icon: <CheckCircleIcon />, color: "success.main", bg: "action.hover" },
    { title: "WFH Today", value: stats.wfhToday || 0, icon: <HomeWorkIcon />, color: "secondary.main", bg: "action.hover" },
    { title: "Assigned Tasks", value: stats.totalTasks, icon: <AssignmentIcon />, color: "warning.main", bg: "action.hover" },
    { title: "Completed", value: stats.completedTasks, icon: <CheckCircleIcon />, color: "success.main", bg: "action.hover" },
    { title: "Pending", value: stats.pendingTasks, icon: <PendingActionsIcon />, color: "error.main", bg: "action.hover" },
    { title: "In Progress", value: stats.inProgressTasks, icon: <AccessTimeIcon />, color: "warning.dark", bg: "action.hover" }
  ];

  const fetchWFHToday = async () => {
    try {
      const userId = user?.employee_id || user?.id;
      const today = new Date().toISOString().split('T')[0];
      const res = await api.get("/wfh/my");
      const wfh = res.data || [];
      const todayWFH = wfh.filter(w => 
        w.date?.startsWith(today) && 
        (w.status === 'Approved' || w.status === 'approved')
      ).length;
      setStats(prev => ({ ...prev, wfhToday: todayWFH }));
    } catch (error) {
      console.error("Error fetching WFH today:", error);
      setStats(prev => ({ ...prev, wfhToday: 0 }));
    }
  };

  const fetchInternData = async () => {
    try {
      if (!user) return;

      const res = await api.get("/tasks/my");

      const tasks = Array.isArray(res.data)
        ? res.data
        : res.data?.tasks || [];

      const userId = user?.employee_id || user?.id;

      const filteredTasks = tasks.filter(
        task => Number(task.assigned_to) === Number(userId)
      );

      // 🧾 Stats
      const completed = filteredTasks.filter(
        t => t.status?.toLowerCase() === "completed"
      ).length;

      const inProgress = filteredTasks.filter(
        t => t.status?.toLowerCase() === "in_progress"
      ).length;

      const pending = filteredTasks.filter(
        t => !t.status || t.status?.toLowerCase() === "pending"
      ).length;

      setStats(prev => ({
        ...prev,
        totalTasks: filteredTasks.length,
        completedTasks: completed,
        inProgressTasks: inProgress,
        pendingTasks: pending
      }));

      setMyTasks(filteredTasks);

      // Fetch WFH today
      await fetchWFHToday();

    } catch (error) {
      console.error("Intern dashboard error:", error);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" fontWeight="bold">
              Welcome, {user?.name || "Intern"}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Track your learning journey and grow with us
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
            <RealTimeClock />
          </Grid>
        </Grid>
      </Box>


      {/* Stats Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {internStats.map((stat, index) => (
          <Box key={index} sx={{ width: 195 }}>
            <StatCard {...stat} loading={loading} />
          </Box>
        ))}
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left column (70%) */}
        <Grid size={{ xs: 12, lg: 8.5 }}>
          <Stack spacing={3}>
            {/* My Profile - Standardized */}
            {/* <ProfileCard user={user} leaveBalance={stats.leaveBalance} /> */}

            <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
           <CardContent>

    {/* Header */}
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

        <Typography variant="h6" fontWeight="bold" sx={{ color: 'primary.main' }}>
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


            {/* My Tasks Table - NEW for Interns */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
                    My Assigned Tasks
                  </Typography>
                  <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
                </Box>
                {myTasks.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    No tasks assigned yet.
                  </Typography>
                ) : (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ background: "action.hover" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Task</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {myTasks.slice(0, 5).map((task, i) => (
                          <TableRow key={task.id || i}>
                            <TableCell sx={{ fontWeight: "500" }}>{task.title}</TableCell>
                            <TableCell>
                              <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
                            </TableCell>
                            <TableCell>{getStatusChip(task.status)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </CardContent>
            </Card>

            {/* Task Progress Card - MOVED BELOW */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
                    Learning Progress
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" gutterBottom>Overall Completion Rate</Typography>
                  <LinearProgressWithLabel value={taskCompletionRate} color="success" />
                </Box>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ p: 2, bgcolor: "success.light", borderRadius: 2, textAlign: "center" }}>
                      <CheckCircleIcon sx={{ color: "white", fontSize: 30 }} />
                      <Typography variant="h5" fontWeight="bold" color="white">{stats.completedTasks}</Typography>
                      <Typography variant="caption" color="white">Completed</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ p: 2, bgcolor: "warning.light", borderRadius: 2, textAlign: "center" }}>
                      <AccessTimeIcon sx={{ color: "white", fontSize: 30 }} />
                      <Typography variant="h5" fontWeight="bold" color="white">{stats.inProgressTasks || 0}</Typography>
                      <Typography variant="caption" color="white">In Progress</Typography>
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Box sx={{ p: 2, bgcolor: "error.main", borderRadius: 2, textAlign: "center" }}>
                      <PendingActionsIcon sx={{ color: "white", fontSize: 30 }} />
                      <Typography variant="h5" fontWeight="bold" color="white">{stats.pendingTasks}</Typography>
                      <Typography variant="caption" color="white">Pending</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right column (30%) */}
         <Grid size={{ xs: 12, lg: 3.5 }}>
          <Stack spacing={3}>
            <Box sx={{ p: 2, bgcolor: "background.paper", borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              {/* <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Quick Shortcuts</Typography> */}
              <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  sx={{ mb: 2, color: 'primary.main' }}
                >
                  Quick Shortcuts
                </Typography>
              <Stack spacing={1}>
                <Button variant="outlined" color="primary" onClick={() => navigate("/attendance")} startIcon={<AccessTimeIcon />}>Attendance</Button>
                <Button variant="outlined" color="primary" onClick={() => navigate("/leave")} startIcon={<BeachAccessIcon />}>Leave</Button>
                <Button variant="outlined" color="primary" onClick={() => navigate("/wfh")} startIcon={<HomeWorkIcon />}>WFH</Button>
              </Stack>
            </Box>
            <AnnouncementCard announcements={announcements} loading={loading} />
            <HolidayCard holidays={holidays} loading={loading} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}