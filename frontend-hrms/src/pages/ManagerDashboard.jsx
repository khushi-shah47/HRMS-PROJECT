import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, LinearProgress, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import RealTimeClock from "../components/dashboard/RealTimeClock";
import AnnouncementCard from "../components/dashboard/AnnouncementCard";
import HolidayCard from "../components/dashboard/HolidayCard";
import PieChartBox from "../components/dashboard/PieChartBox";
import LineChartBox from "../components/dashboard/LineChartBox";
import BarChartBox from "../components/dashboard/BarChartBox";
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

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    teamMembers: 0,
    presentToday: 0,
    pendingLeaves: 0,
    activeTasks: 0,
    wfhRequests: 0,
    completedTasks: 0
  });

  const [chartData, setChartData] = useState({
    attendanceData: [],
    taskStatusData: [],
    productivityData: [],
    leaveData: []
  });
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
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
        fetchEmployees(),
        fetchTasks(),
        fetchLeaves(),
        fetchWFHRequests(),
        fetchAnnouncements(),
        fetchHolidays(),
        fetchManagerChartData()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      const data = res.data;
      let employeesArray = Array.isArray(data) ? data : (data.employees || []);
      setEmployees(employeesArray);
      setTeamMembers(employeesArray.slice(0, 5));
      setStats(prev => ({ ...prev, teamMembers: employeesArray.length }));
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const tasks = res.data || [];
      
      const pending = tasks.filter(t => t.status === "pending" || t.status === "in_progress");
      const completed = tasks.filter(t => t.status === "completed");
      
      setPendingTasks(pending.slice(0, 4));
      setStats(prev => ({ 
        ...prev, 
        activeTasks: pending.length,
        completedTasks: completed.length
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/team");
      const leaves = res.data?.data || res.data || [];
      
      const pending = leaves.filter(l => l.status === "Pending");
      setLeaveRequests(pending.slice(0, 3));
      setStats(prev => ({ ...prev, pendingLeaves: pending.length }));
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchWFHRequests = async () => {
    try {
      const res = await api.get("/wfh/all");
      const wfh = res.data || [];
      
      const pending = wfh.filter(w => w.status === "pending");
      setStats(prev => ({ ...prev, wfhRequests: pending.length }));
    } catch (error) {
      console.error("Error fetching WFH requests:", error);
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
      Present: { bg: "#ECFDF5", color: "#16A34A" },
      WFH: { bg: "#F5F3FF", color: "#8B5CF6" },
      Leave: { bg: "#FFFBEB", color: "#F59E0B" },
      Absent: { bg: "#FEF2F2", color: "#EF4444" }
    };
    const style = colors[status] || colors.Present;
    return <Chip label={status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "error" : priority === "medium" ? "warning" : "info";
  };

  const managerStats = [
    { title: "Team Members", value: stats.teamMembers, icon: <PeopleIcon />, color: "#7C3AED", bg: "#F5F3FF" },
    { title: "Pending Leaves", value: stats.pendingLeaves, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "Active Tasks", value: stats.activeTasks, icon: <AssignmentIcon />, color: "#EF4444", bg: "#FEF2F2" },
    { title: "WFH Requests", value: stats.wfhRequests, icon: <HomeWorkIcon />, color: "#8B5CF6", bg: "#F5F3FF" },
    { title: "Completed Tasks", value: stats.completedTasks, icon: <CheckCircleOutlineIcon />, color: "#06B6D4", bg: "#ECFEFF" },
    { title: "In Progress", value: stats.activeTasks, icon: <AccessTimeIcon />, color: "#16A34A", bg: "#ECFDF5" }
  ];

  const fetchManagerChartData = async () => {
    try {
      // 🔹 Fetch all data
      const empRes = await api.get("/employees");
      const taskRes = await api.get("/tasks");
      const leaveRes = await api.get("/leaves");

      // ✅ SAFE extraction (VERY IMPORTANT)
      const employees = Array.isArray(empRes.data)
        ? empRes.data
        : empRes.data?.employees || [];

      const tasks = Array.isArray(taskRes.data)
        ? taskRes.data
        : taskRes.data?.tasks || [];

      const leaves = Array.isArray(leaveRes.data)
        ? leaveRes.data
        : leaveRes.data?.data || [];

      // 🔥 Filter only manager team
      const managerId = user?.id;

      const teamEmployees = employees.filter(
        emp => emp.manager_id === managerId
      );

      const teamIds = teamEmployees.map(emp => emp.id);

      // =========================
      // 📊 1. Team Attendance Pie
      // =========================
      const attendanceMap = {
        Present: 0,
        Absent: 0,
        Leave: 0
      };

      // If you don’t have attendance API yet → fallback
      teamEmployees.forEach(emp => {
        if (emp.status === "Active") attendanceMap.Present++;
        else if (emp.status === "Leave") attendanceMap.Leave++;
        else attendanceMap.Absent++;
      });

      const attendanceData = Object.keys(attendanceMap).map(key => ({
        name: key,
        value: attendanceMap[key]
      }));

      // =========================
      // 📊 2. Task Status Pie
      // =========================
      const taskMap = {
        Completed: 0,
        "In Progress": 0,
        Pending: 0
      };

      tasks.forEach(task => {
        if (!teamIds.includes(task.assigned_to)) return;

        if (task.status === "completed") taskMap.Completed++;
        else if (task.status === "in_progress") taskMap["In Progress"]++;
        else taskMap.Pending++;
      });

      const taskStatusData = Object.keys(taskMap).map(key => ({
        name: key,
        value: taskMap[key]
      }));

      // =========================
      // 📈 3. Productivity (Tasks Completed Over Time)
      // =========================
      const productivityMap = {};

      tasks.forEach(task => {
        if (!teamIds.includes(task.assigned_to)) return;
        if (task.status !== "completed") return;

        const date = new Date(task.updated_at || task.completed_at);
        const label = date.toLocaleString("default", { month: "short" });

        productivityMap[label] = (productivityMap[label] || 0) + 1;
      });

      const productivityData = Object.keys(productivityMap).map(key => ({
        month: key,
        value: productivityMap[key]
      }));

      // =========================
      // 📊 4. Leave Requests (Monthly)
      // =========================
      const leaveMap = {};

      leaves.forEach(leave => {
        if (!teamIds.includes(leave.employee_id)) return;

        const date = new Date(leave.start_date);
        const month = date.toLocaleString("default", { month: "short" });

        leaveMap[month] = (leaveMap[month] || 0) + 1;
      });

      const leaveData = Object.keys(leaveMap).map(key => ({
        month: key,
        value: leaveMap[key]
      }));

      // =========================
      // ✅ SET DATA
      // =========================
      setChartData({
        attendanceData,
        taskStatusData,
        productivityData,
        leaveData
      });

    } catch (error) {
      console.error("Manager chart error:", error);
    }
  };

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)", color: "white" }}>
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {managerStats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>

  {/* Attendance Pie */}
  <Grid size={{ xs: 12, md: 6 }}>
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
          Team Attendance
        </Typography>

        {chartData.attendanceData.length === 0 ? (
          <Typography textAlign="center">No data</Typography>
        ) : (
          <PieChartBox data={chartData.attendanceData} />
        )}
      </CardContent>
    </Card>
  </Grid>

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

  {/* Productivity */}
  <Grid size={{ xs: 12, md: 6 }}>
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
          Team Productivity
        </Typography>

        <LineChartBox data={chartData.productivityData} />
      </CardContent>
    </Card>
  </Grid>

  {/* Leaves */}
  <Grid size={{ xs: 12, md: 6 }}>
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
          Leave Requests
        </Typography>

        <BarChartBox data={chartData.leaveData} />
      </CardContent>
    </Card>
  </Grid>

</Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Team Members */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#7C3AED" }}>
                  Team Members
                </Typography>
                <Button size="small" onClick={() => navigate("/employees")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress sx={{ color: "#7C3AED" }} />
                </Box>
              ) : teamMembers.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No team members found
                </Typography>
              ) : (
                teamMembers.map((member, i) => (
                  <Box key={member.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ background: "#7C3AED" }}>
                        {member.name?.split(" ").map(n => n[0]).join("").substring(0, 2)}
                      </Avatar>
                      <Box>
                        <Typography fontWeight="600">{member.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{member.position || "Employee"}</Typography>
                      </Box>
                    </Box>
                    <Chip 
                      label={member.department_name || "Not Assigned"} 
                      size="small" 
                      sx={{ background: "#F5F3FF", color: "#7C3AED" }} 
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Team Tasks */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#7C3AED" }}>
                  Team Tasks
                </Typography>
                <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress sx={{ color: "#7C3AED" }} />
                </Box>
              ) : pendingTasks.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No active tasks
                </Typography>
              ) : (
                pendingTasks.map((task, i) => (
                  <Box key={task.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography fontWeight="600">{task.title}</Typography>
                      <Chip label={task.priority || "medium"} size="small" color={getPriorityColor(task.priority)} />
                    </Box>
                    <Typography variant="caption" color="textSecondary">
                      Assigned to: {getEmployeeName(task.assigned_to)} | Due: {task.due_date?.split("T")[0] || "Not set"}
                    </Typography>
                    <Chip 
                      label={task.status === "in_progress" ? "In Progress" : "Pending"} 
                      size="small" 
                      sx={{ mt: 1, background: task.status === "in_progress" ? "#FEF3C7" : "#F3F4F6", color: task.status === "in_progress" ? "#D97706" : "#6B7280" }}
                    />
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Leave Requests */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#7C3AED" }}>
                  Pending Leave Requests
                </Typography>
                <Button size="small" onClick={() => navigate("/leave")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress sx={{ color: "#7C3AED" }} />
                </Box>
              ) : leaveRequests.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No pending leave requests
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {leaveRequests.map((leave, i) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={leave.id || i}>
                      <Box sx={{ p: 2, borderRadius: 2, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                        <Typography fontWeight="600">{leave.name || getEmployeeName(leave.employee_id)}</Typography>
                        <Typography variant="caption" color="textSecondary" display="block">
                          {leave.start_date?.split("T")[0]} to {leave.end_date?.split("T")[0]}
                        </Typography>
                        {leave.reason && (
                          <Typography variant="caption" color="textSecondary" display="block">
                            Reason: {leave.reason}
                          </Typography>
                        )}
                        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                          <Button size="small" variant="contained" color="success" fullWidth onClick={() => handleApproveLeave(leave.id)}>
                            Approve
                          </Button>
                          <Button size="small" variant="outlined" color="error" fullWidth onClick={() => handleRejectLeave(leave.id)}>
                            Reject
                          </Button>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
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
