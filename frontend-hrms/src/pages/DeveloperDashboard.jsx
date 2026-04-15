import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Chip, LinearProgress, Divider, CircularProgress, useTheme, Avatar } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import CodeIcon from "@mui/icons-material/Code";
import TimerIcon from "@mui/icons-material/Timer";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CampaignIcon from "@mui/icons-material/Campaign";
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

export default function DeveloperDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    leaveBalance: 0,
    totalHours: 0
  });

  const [myTasks, setMyTasks] = useState([]);
  const [attendanceHistory, setAttendanceHistory] = useState([]);
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
        fetchTasks(),
        fetchAttendance(),
        fetchDashboardStats(),
        fetchAnnouncements(),
        fetchHolidays()
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

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/my`);
      const rawData = res.data?.data || res.data;
      const attendance = Array.isArray(rawData) ? rawData : [];

      const formattedAttendance = attendance.slice(0, 7).map(att => ({
        date: att.time_in ? att.time_in.split("T")[0] : att.date?.split("T")[0] || "-",
        status: att.work_type === "present" ? "Present" : att.work_type === "wfh" ? "WFH" : "Leave",
        checkIn: att.time_in ? new Date(att.time_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
        checkOut: att.time_out ? new Date(att.time_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
        hours: att.total_hours || 0
      }));

      setAttendanceHistory(formattedAttendance);

      const totalHours = formattedAttendance.reduce((sum, att) => sum + (parseFloat(att.hours) || 0), 0);
      setStats(prev => ({ ...prev, totalHours: Math.round(totalHours * 10) / 10 }));
    } catch (error) {
      console.error("Error fetching attendance:", error);
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
      "in_progress": { bg: "warning.main", color: "warning.contrastText", label: "In Progress" },
      "completed": { bg: "success.main", color: "success.contrastText", label: "Completed" },
      "pending": { bg: "grey.300", color: "text.primary", label: "Pending" },
      "WFH": { bg: "info.main", color: "info.contrastText", label: "WFH" },
      "Leave": { bg: "error.main", color: "error.contrastText", label: "Leave" },
      "Present": { bg: "success.main", color: "success.contrastText", label: "Present" }
    };
    const style = colors[status] || colors.pending;
    return <Chip label={style.label || status} size="small" sx={{ bgcolor: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "error" : priority === "medium" ? "warning" : "success";
  };

  const getUpcomingDeadlines = () => {
    const today = new Date();
    return myTasks
      .filter(t => t.due_date && t.status !== "completed")
      .map(t => {
        const dueDate = new Date(t.due_date);
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        return { ...t, daysLeft };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 3);
  };

  const getDaysLeftColor = (days) => {
    if (days <= 0) return "error.main";
    if (days <= 2) return "warning.main";
    return "success.main";
  };

  const upcomingDeadlines = getUpcomingDeadlines();


  const developerStats = [
    { title: "Present Today", value: stats.presentToday || 0, icon: <CheckCircleIcon />, color: "success.main", bg: "action.hover" },
    { title: "WFH Today", value: stats.wfhToday || 0, icon: <HomeWorkIcon />, color: "secondary.main", bg: "action.hover" },
    { title: "My Tasks", value: stats.totalTasks, icon: <AssignmentIcon />, color: "error.main", bg: "action.hover" },
    { title: "Completed", value: stats.completedTasks, icon: <CheckCircleIcon />, color: "success.main", bg: "action.hover" },
    { title: "In Progress", value: stats.inProgressTasks, icon: <AccessTimeIcon />, color: "warning.main", bg: "action.hover" },
    { title: "Pending", value: stats.pendingTasks, icon: <PendingActionsIcon />, color: "text.secondary", bg: "action.hover" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" fontWeight="bold">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, {user?.name || "Manager"}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Here's your team overview for today
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
            <RealTimeClock />
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {developerStats.map((stat, index) => (
          <Box key={index} sx={{ width: 195 }}>
            <StatCard {...stat} loading={loading} />
          </Box>
        ))}
      </Box>

      {/* Main Content */}
      {/* Layout Grid */}
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
                      {(user && user.role) ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "-"}
                    </Typography>
                  </Grid>

                </Grid>

              </CardContent>
            </Card>

            {/* My Tasks - FOCUS AREA */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
                    My Tasks
                  </Typography>
                  <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
                </Box>

                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : myTasks.length === 0 ? (
                  <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                    You have no pending tasks. Great job!
                  </Typography>
                ) : (
                  <TableContainer>
                    <TableContainer sx={{ overflowX: 'auto' }}>
                    <Table>
                      <TableHead>
                        <TableRow sx={{ background: "action.hover" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Task Title</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {myTasks.slice(0, 5).map((task, i) => (
                          <TableRow key={task.id || i} sx={{ "&:hover": { background: "action.hover" } }}>
                            <TableCell sx={{ fontWeight: "500" }} variant="body2">{task.title}</TableCell>
                            <TableCell>
                              <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
                            </TableCell>
                            <TableCell variant="body2">{task.due_date?.split("T")[0] || "No date"}</TableCell>
                            <TableCell>
                              <Chip
                                label={task.status.replace("_", " ")}
                                size="small"
                                variant="outlined"
                                sx={{
                                  color: task.status === "completed" ? "success.main" : "warning.main",
                                  borderColor: task.status === "completed" ? "success.main" : "warning.main"
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  </TableContainer>
                )}
              </CardContent>
            </Card>

            {/* Attendance History */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3, color: "primary.main" }}>
                  Recent Attendance
                </Typography>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <TableContainer>
                    <TableContainer sx={{ overflowX: 'auto' }}>
                   <Table>
                      <TableHead>
                        <TableRow sx={{ background: "action.hover" }}>
                          <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Type</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Check In</TableCell>
                          <TableCell sx={{ fontWeight: "bold" }}>Check Out</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {attendanceHistory.map((att, i) => (
                          <TableRow key={i}>
                            <TableCell variant="body2">{att.date}</TableCell>
                            <TableCell>{getStatusChip(att.status)}</TableCell>
                            <TableCell variant="body2">{att.checkIn}</TableCell>
                            <TableCell variant="body2">{att.checkOut}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
        </TableContainer>
                  </TableContainer>
                )}
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right column (30%) */}
        <Grid size={{ xs: 12, lg: 3.5 }}>
          <Stack spacing={3}>
            {/* Profile Summary Removed */}
            
            {/* PayslipCard Removed */}

            {/* Upcoming Deadlines */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1, color: "primary.main" }}>
                  <TimerIcon color="primary" /> Upcoming Deadlines
                </Typography>
                {upcomingDeadlines.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No immediate deadlines.</Typography>
                ) : (
                  <Stack spacing={2}>
                    {upcomingDeadlines.map((deadline) => (
                      <Box key={deadline.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover", borderLeft: "4px solid", borderColor: getDaysLeftColor(deadline.daysLeft) }}>
                        <Typography variant="body2" fontWeight="bold">{deadline.title}</Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            Due: {deadline.due_date?.split("T")[0]}
                          </Typography>
                          <Typography variant="caption" fontWeight="bold" sx={{ color: getDaysLeftColor(deadline.daysLeft) }}>
                            {deadline.daysLeft <= 0 ? "OVERDUE" : `${deadline.daysLeft} days left`}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>

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
                <Button variant="outlined" onClick={() => navigate("/leave")} startIcon={<BeachAccessIcon />}>Request Leave</Button>
                <Button variant="outlined" onClick={() => navigate("/wfh")} startIcon={<HomeWorkIcon />}>Request WFH</Button>
                <Button variant="outlined" onClick={() => navigate("/salary")} startIcon={<AttachMoneyIcon />}>View Salary</Button>
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