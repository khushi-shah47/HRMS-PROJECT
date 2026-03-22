import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, LinearProgress, Divider, CircularProgress, useTheme } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
import PieChartBox from "../components/dashboard/PieChartBox";
import LineChartBox from "../components/dashboard/LineChartBox";

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

  const [chartData, setChartData] = useState({
    taskStatusData: [],
    // projectData: [],
    taskTrendData: [],
    // bugTrendData: []
  });

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAllData();
  }, []);

  useEffect(() => {
  if (user) {
    fetchDeveloperChartData();
  }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTasks(),
        fetchAttendance(),
        fetchAnnouncements(),
        fetchHolidays(),
        fetchLeaveBalance(),
        // fetchDeveloperChartData()
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
      const userData = JSON.parse(localStorage.getItem("user"));
      const employeeId = userData?.employee_id || userData?.id;
      
      const res = await api.get(`/attendance/history/${employeeId}`);
      const attendance = Array.isArray(res.data) ? res.data : [];
      
      const formattedAttendance = attendance.slice(0, 7).map(att => ({
        date: att.date?.split("T")[0],
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

  const fetchLeaveBalance = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const employeeId = userData?.employee_id || userData?.id;
      
      const res = await api.get(`/employees/${employeeId}`);
      const employee = res.data;
      
      setStats(prev => ({ ...prev, leaveBalance: employee?.leave_balance || 0 }));
    } catch (error) {
      console.error("Error fetching leave balance:", error);
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
      "pending": { bg: "action.hover", color: "text.secondary", label: "Pending" },
      "WFH": { bg: "secondary.light", color: "secondary.dark", label: "WFH" },
      "Leave": { bg: "primary.light", color: "primary.dark", label: "Leave" },
      "Present": { bg: "success.light", color: "success.dark", label: "Present" }
    };
    const style = colors[status] || colors.pending;
    return <Chip label={style.label || status} size="small" sx={{ bgcolor: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "error" : priority === "medium" ? "warning" : "info";
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

  const fetchDeveloperChartData = async () => {
    try {
      const taskRes = await api.get("/tasks/my");
      // const projectRes = await api.get("/projects"); // if exists

      // ✅ SAFE extraction
      const tasks = Array.isArray(taskRes.data)
        ? taskRes.data
        : taskRes.data?.tasks || [];
      console.log("TASK API DATA:", taskRes.data);
      // const projects = Array.isArray(projectRes?.data)
      //   ? projectRes.data
      //   : projectRes?.data?.projects || [];

      const userId = user?.employee_id || user?.id;

      // 🔥 Only developer's tasks
      const myTasks = tasks.filter(
        task => Number(task.assigned_to) === Number(userId)
      );
      console.log("MY TASKS:", myTasks);

      console.log("USER:", user);
      console.log("USER ID USED:", userId);
      console.log("TASK assigned_to values:", tasks.map(t => t.assigned_to));

      // =========================
      // 📊 1. Task Status Pie
      // =========================
      const taskMap = {
        Completed: 0,
        "In Progress": 0,
        Pending: 0
      };

      myTasks.forEach(task => {
        const status = task.status?.toLowerCase();
        if (task.status === "completed") taskMap.Completed++;
        else if (task.status === "in_progress") taskMap["In Progress"]++;
        else taskMap.Pending++;
      });

      const taskStatusData = Object.keys(taskMap).map(key => ({
        name: key,
        value: taskMap[key]
      }));

      // // =========================
      // // 📊 2. Project Allocation Pie
      // // =========================
      // const projectMap = {};

      // myTasks.forEach(task => {
      //   const project = task.project_name || "General";

      //   projectMap[project] = (projectMap[project] || 0) + 1;
      // });

      // const projectData = Object.keys(projectMap).map(key => ({
      //   name: key,
      //   value: projectMap[key]
      // }));

      // =========================
      // 📈 3. Task Completion Trend
      // =========================
      const taskTrendMap = {};

      myTasks.forEach(task => {
        if (task.status !== "completed") return;

        const date = new Date(task.updated_at || task.completed_at);
        const week = `Week ${Math.ceil(date.getDate() / 7)}`;

        taskTrendMap[week] = (taskTrendMap[week] || 0) + 1;
      });

      const taskTrendData = Object.keys(taskTrendMap).map(key => ({
        week: key,
        value: taskTrendMap[key]
      }));

      // // =========================
      // // 📊 4. Bug Fix Trend
      // // =========================
      // const bugTrendMap = {};

      // myTasks.forEach(task => {
      //   if (task.type !== "bug") return;
      //   if (task.status !== "completed") return;

      //   const date = new Date(task.updated_at || task.completed_at);
      //   const month = date.toLocaleString("default", { month: "short" });

      //   bugTrendMap[month] = (bugTrendMap[month] || 0) + 1;
      // });

      // const bugTrendData = Object.keys(bugTrendMap).map(key => ({
      //   month: key,
      //   value: bugTrendMap[key]
      // }));

      // =========================
      // ✅ SET DATA
      // =========================
      setChartData({
        taskStatusData,
        // projectData,
        taskTrendData,
        // bugTrendData
      });

    } catch (error) {
      console.error("Developer chart error:", error);
    }
  };

  const developerStats = [
    { title: "My Tasks", value: stats.totalTasks, icon: <AssignmentIcon />, color: "error.main", bg: "action.hover" },
    { title: "Completed", value: stats.completedTasks, icon: <CheckCircleIcon />, color: "success.main", bg: "action.hover" },
    { title: "In Progress", value: stats.inProgressTasks, icon: <AccessTimeIcon />, color: "warning.main", bg: "action.hover" },
    { title: "Pending", value: stats.pendingTasks, icon: <PendingActionsIcon />, color: "text.secondary", bg: "action.hover" },
    { title: "Leave Balance", value: stats.leaveBalance, icon: <BeachAccessIcon />, color: "secondary.main", bg: "action.hover" },
    { title: "Hours (Week)", value: stats.totalHours, icon: <TimerIcon />, color: "primary.main", bg: "action.hover" }
  ];

  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.error.dark} 0%, ${theme.palette.error.main} 100%)`, color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" fontWeight="bold">
              Hello, {user?.name || "Developer"}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Track your tasks and stay productive
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
            <RealTimeClock />
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {developerStats.map((stat, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>

      {/* Task Status */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
              Task Status
            </Typography>

            <PieChartBox data={chartData.taskStatusData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Project Allocation
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
              Project Allocation
            </Typography>

            <PieChartBox data={chartData.projectData} />
          </CardContent>
        </Card>
      </Grid> */}

      {/* Task Trend */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "error.main" }}>
              Tasks Completed Over Time
            </Typography>

            <LineChartBox data={chartData.taskTrendData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Bug Fix Trend
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
              Bug Reports Fixed
            </Typography>

            <BarChartBox data={chartData.bugTrendData} />
          </CardContent>
        </Card>
      </Grid> */}

    </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* My Tasks */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "error.main" }}>
                  My Tasks
                </Typography>
                <Button size="small" onClick={() => navigate("/tasks")}>View All Tasks</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : myTasks.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No tasks assigned to you
                </Typography>
              ) : (
                myTasks.slice(0, 5).map((task, i) => (
                  <Box key={task.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "background.default", border: "1px solid", borderColor: "divider" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography fontWeight="600">{task.title}</Typography>
                        {task.priority && (
                          <Chip label={task.priority} size="small" color={getPriorityColor(task.priority)} />
                        )}
                      </Box>
                      {getStatusChip(task.status || "pending")}
                    </Box>
                    <Typography variant="caption" color="textSecondary" display="block">
                      Assigned by: {task.assigned_by_name || "Manager"} | Due: {task.due_date?.split("T")[0] || "Not set"}
                    </Typography>
                    {task.description && (
                      <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                        {task.description.substring(0, 100)}{task.description.length > 100 ? "..." : ""}
                      </Typography>
                    )}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Upcoming Deadlines & Quick Actions */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "error.main", mb: 3 }}>
                Upcoming Deadlines
              </Typography>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                  <CircularProgress size={30} />
                </Box>
              ) : upcomingDeadlines.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 2 }}>
                  No upcoming deadlines
                </Typography>
              ) : (
                upcomingDeadlines.map((item, i) => (
                  <Box key={item.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, bgcolor: "action.hover", borderLeft: `4px solid ${getDaysLeftColor(item.daysLeft)}` }}>
                    <Typography fontWeight="600">{item.title}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      Due: {item.due_date?.split("T")[0]}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: getDaysLeftColor(item.daysLeft), mt: 0.5 }}>
                      {item.daysLeft <= 0 ? "Overdue!" : `${item.daysLeft} day(s) left`}
                    </Typography>
                  </Box>
                ))
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" fontWeight="bold" sx={{ color: "error.main", mb: 2 }}>
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

        {/* Announcements & Holidays */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <AnnouncementCard announcements={announcements} loading={loading} />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <HolidayCard holidays={holidays} loading={loading} />
        </Grid>
      </Grid>
    </Box>
  );
}
