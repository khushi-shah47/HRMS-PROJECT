import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Chip, LinearProgress, CircularProgress } from "@mui/material";
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
import PieChartBox from "../components/dashboard/PieChartBox";
import LineChartBox from "../components/dashboard/LineChartBox";

function StatCard({ title, value, icon, color, bg, loading }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            {loading ? (
              <CircularProgress size={30} sx={{ color: color }} />
            ) : (
              <Typography variant="h3" fontWeight="bold" sx={{ color: color }}>
                {value}
              </Typography>
            )}
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
        <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function InternDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    pendingTasks: 0,
    leaveBalance: 0
  });

  const [chartData, setChartData] = useState({
    taskStatusData: [],
    weeklyData: []
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

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTasks(),
        fetchAnnouncements(),
        fetchHolidays(),
        fetchLeaveBalance(),
        fetchInternData()
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
      "in_progress": { bg: "#FEF3C7", color: "#D97706", label: "In Progress" },
      "completed": { bg: "#ECFDF5", color: "#059669", label: "Completed" },
      "pending": { bg: "#F3F4F6", color: "#6B7280", label: "Pending" }
    };
    const style = colors[status] || colors.pending;
    return <Chip label={style.label || status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "error" : priority === "medium" ? "warning" : "info";
  };

  const taskCompletionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
    : 0;

  const internStats = [
    { title: "Assigned Tasks", value: stats.totalTasks, icon: <AssignmentIcon />, color: "#D97706", bg: "#FFFBEB" },
    { title: "Completed", value: stats.completedTasks, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "In Progress", value: stats.inProgressTasks, icon: <AccessTimeIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "Leave Balance", value: stats.leaveBalance, icon: <BeachAccessIcon />, color: "#8B5CF6", bg: "#F5F3FF" }
  ];

  const fetchInternData = async () => {
    try {
      const taskRes = await api.get("/tasks"); // change later to /tasks/my if needed
      const empRes = await api.get("/employees");

      // ✅ SAFE extraction
      const tasks = Array.isArray(taskRes.data)
        ? taskRes.data
        : taskRes.data?.tasks || [];

      const employees = Array.isArray(empRes.data)
        ? empRes.data
        : empRes.data?.employees || [];

      const userId = user?.id;

      // 🔥 My tasks
      const myTasks = tasks.filter(task => task.assigned_to === userId);

      // =========================
      // 📊 Task Status Pie
      // =========================
      const taskMap = {
        Completed: 0,
        "In Progress": 0,
        Pending: 0
      };

      myTasks.forEach(task => {
        if (task.status === "completed") taskMap.Completed++;
        else if (task.status === "in_progress") taskMap["In Progress"]++;
        else taskMap.Pending++;
      });

      const taskStatusData = Object.keys(taskMap).map(key => ({
        name: key,
        value: taskMap[key]
      }));

      // =========================
      // 📈 Weekly Progress
      // =========================
      const weeklyMap = {};

      myTasks.forEach(task => {
        if (task.status !== "completed") return;

        const date = new Date(task.updated_at || task.completed_at);
        const week = `Week ${Math.ceil(date.getDate() / 7)}`;

        weeklyMap[week] = (weeklyMap[week] || 0) + 1;
      });

      const weeklyData = Object.keys(weeklyMap).map(key => ({
        week: key,
        value: weeklyMap[key]
      }));

      // =========================
      // 🧾 Stats
      // =========================
      const completed = myTasks.filter(t => t.status === "completed").length;
      const pending = myTasks.length - completed;

      // 👨‍🏫 Mentor (manager)
      const me = employees.find(e => e.id === userId);
      const mentor = me?.manager_name || "Not Assigned";

      setStats({
        assigned: myTasks.length,
        completed,
        pending,
        mentor
      });

      // =========================
      // ✅ SET DATA
      // =========================
      setChartData({
        taskStatusData,
        weeklyData
      });

    } catch (error) {
      console.error("Intern dashboard error:", error);
    }
  };

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "white" }}>
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {internStats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>

        {/* Task Status */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
                Task Status
              </Typography>

              <PieChartBox data={chartData.taskStatusData} />
            </CardContent>
          </Card>
        </Grid>

        {/* Weekly Progress */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
                Weekly Task Progress
              </Typography>

              <LineChartBox data={chartData.weeklyData} />
            </CardContent>
          </Card>
        </Grid>

      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* My Tasks */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706" }}>
                  My Tasks
                </Typography>
                <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress sx={{ color: "#D97706" }} />
                </Box>
              ) : myTasks.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No tasks assigned to you yet
                </Typography>
              ) : (
                myTasks.slice(0, 4).map((task, i) => (
                  <Box key={task.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
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
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Task Progress */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706" }}>
                  Task Completion Progress
                </Typography>
                <Chip 
                  label={`${stats.completedTasks}/${stats.totalTasks} Completed`} 
                  sx={{ background: "#ECFDF5", color: "#059669", fontWeight: "bold" }} 
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <LinearProgressWithLabel value={taskCompletionRate} />
              </Box>
 
              <Grid container spacing={2}>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ p: 2, background: "#ECFDF5", borderRadius: 2, textAlign: "center" }}>
                    <CheckCircleIcon sx={{ color: "#059669", fontSize: 30 }} />
                    <Typography variant="h5" fontWeight="bold" color="#059669">{stats.completedTasks}</Typography>
                    <Typography variant="caption" color="textSecondary">Completed</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ p: 2, background: "#FEF3C7", borderRadius: 2, textAlign: "center" }}>
                    <AccessTimeIcon sx={{ color: "#D97706", fontSize: 30 }} />
                    <Typography variant="h5" fontWeight="bold" color="#D97706">{stats.inProgressTasks}</Typography>
                    <Typography variant="caption" color="textSecondary">In Progress</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <Box sx={{ p: 2, background: "#F3F4F6", borderRadius: 2, textAlign: "center" }}>
                    <PendingActionsIcon sx={{ color: "#6B7280", fontSize: 30 }} />
                    <Typography variant="h5" fontWeight="bold" color="#6B7280">{stats.pendingTasks}</Typography>
                    <Typography variant="caption" color="textSecondary">Pending</Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>


        {/* Quick Actions */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706", mb: 3 }}>
                Quick Actions
              </Typography>
              
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate("/attendance")} 
                    sx={{ p: 2, flexDirection: "column", height: 100 }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="body2">Mark Attendance</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate("/tasks")} 
                    sx={{ p: 2, flexDirection: "column", height: 100 }}
                  >
                    <AssignmentIcon sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="body2">View Tasks</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate("/leave")} 
                    sx={{ p: 2, flexDirection: "column", height: 100 }}
                  >
                    <BeachAccessIcon sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="body2">Request Leave</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate("/wfh")} 
                    sx={{ p: 2, flexDirection: "column", height: 100 }}
                  >
                    <HomeWorkIcon sx={{ fontSize: 30, mb: 1 }} />
                    <Typography variant="body2">Request WFH</Typography>
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>


        {/* Profile Info */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <PersonIcon sx={{ color: "#D97706" }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706" }}>
                  My Profile
                </Typography>
              </Box>
              
              <Box sx={{ p: 3, background: "#F8FAFC", borderRadius: 2 }}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="textSecondary">Name</Typography>
                    <Typography fontWeight="500">{user?.name || "-"}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="textSecondary">Email</Typography>
                    <Typography fontWeight="500">{user?.email || "-"}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="textSecondary">Role</Typography>
                    <Chip label={user?.role || "Intern"} size="small" sx={{ mt: 0.5, textTransform: "capitalize" }} />
                  </Grid>
                  <Grid size={{ xs: 6 }}>
                    <Typography variant="caption" color="textSecondary">Leave Balance</Typography>
                    <Typography fontWeight="500">{stats.leaveBalance} days</Typography>
                  </Grid>
                </Grid>
              </Box>
 
              <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: "#FEF3C7", textAlign: "center" }}>
                <Typography fontWeight="600" color="#D97706">
                  Keep up the great work!
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  You've completed {stats.completedTasks} tasks so far
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Resources */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                <MenuBookIcon sx={{ color: "#D97706" }} />
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706" }}>
                  Quick Links
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate("/policies")}
                    sx={{ p: 2, flexDirection: "column" }}
                  >
                    <Typography variant="h6" sx={{ color: "#3B82F6" }}>📋</Typography>
                    <Typography fontWeight="600">Company Policies</Typography>
                    <Typography variant="caption" color="textSecondary">View guidelines</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate("/holidays")}
                    sx={{ p: 2, flexDirection: "column" }}
                  >
                    <Typography variant="h6" sx={{ color: "#16A34A" }}>📅</Typography>
                    <Typography fontWeight="600">Holidays</Typography>
                    <Typography variant="caption" color="textSecondary">View calendar</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate("/announcements")}
                    sx={{ p: 2, flexDirection: "column" }}
                  >
                    <Typography variant="h6" sx={{ color: "#8B5CF6" }}>📢</Typography>
                    <Typography fontWeight="600">Announcements</Typography>
                    <Typography variant="caption" color="textSecondary">Stay updated</Typography>
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    onClick={() => navigate("/all-attendance")}
                    sx={{ p: 2, flexDirection: "column" }}
                  >
                    <Typography variant="h6" sx={{ color: "#DC2626" }}>📊</Typography>
                    <Typography fontWeight="600">Attendance History</Typography>
                    <Typography variant="caption" color="textSecondary">View records</Typography>
                  </Button>
                </Grid>
              </Grid>
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
