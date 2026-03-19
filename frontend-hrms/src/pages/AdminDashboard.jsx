import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, LinearProgress, CircularProgress } from "@mui/material";
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
import RealTimeClock from "../components/dashboard/RealTimeClock";
import AnnouncementCard from "../components/dashboard/AnnouncementCard";
import HolidayCard from "../components/dashboard/HolidayCard";
import PieChartBox from "../components/dashboard/PieChartBox";
import LineChartBox from "../components/dashboard/LineChartBox";
import BarChartBox from "../components/dashboard/BarChartBox";
import { useTheme } from "@mui/material/styles";

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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    wfhToday: 0,
    pendingTasks: 0,
    totalDepartments: 0
  });
  
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const [chartData, setChartData] = useState({
    departmentData: [],
    statusData: [],
    growthData: [],
    attendanceData: []
  });

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
        fetchTasks(),
        fetchLeaves(),
        fetchDepartments(),
        fetchAnnouncements(),
        fetchHolidays(),
        fetchChartData()
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
    switch(priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      default: return "info";
    }
  };

  const fetchChartData = async () => {
    try {
      // 🔹 Employees
      const empRes = await api.get("/employees");
      console.log("EMP API:", empRes.data);
      const employees = Array.isArray(empRes.data)
        ? empRes.data
        : empRes.data?.employees || [];

      if (!Array.isArray(employees)) {
        console.error("Employees is not an array", employees);
        return;
      }
      // 🔹 Departments
      const deptRes = await api.get("/departments/all");
      console.log("DEPT API:", deptRes.data);
      const departments = deptRes.data || [];

      // 🔹 Attendance
      const attendanceRes = await api.get("/attendance/all");
      const attendance = Array.isArray(attendanceRes.data)
        ? attendanceRes.data
        : attendanceRes.data?.data || [];

      // =========================
      // 📊 1. Department Pie
      // =========================
      const deptMap = {};

      employees.forEach(emp => {
        const dept = emp.department_name || "Unknown";
        deptMap[dept] = (deptMap[dept] || 0) + 1;
      });

      const departmentData = Object.keys(deptMap).map(key => ({
        name: key,
        value: deptMap[key]
      }));

      // =========================
      // 📊 2. Employee Status Pie
      // =========================
      const statusMap = {
        Active: 0,
        Leave: 0,
        Resigned: 0,
        Probation: 0
      };

      employees.forEach(emp => {
        const status = emp.status || "Active";
        if (statusMap[status] !== undefined) {
          statusMap[status]++;
        }
      });

      const statusData = Object.keys(statusMap).map(key => ({
        name: key,
        value: statusMap[key]
      }));

      // =========================
      // 📈 3. Employee Growth (Month-wise)
      // =========================
      const growthMap = {};

      employees.forEach(emp => {
        const date = new Date(emp.join_date || emp.created_at);
        const month = date.toLocaleString("default", { month: "short" });

        growthMap[month] = (growthMap[month] || 0) + 1;
      });

      const growthData = Object.keys(growthMap).map(month => ({
        month,
        value: growthMap[month]
      }));

      // =========================
      // 📊 4. Attendance % (Month-wise)
      // =========================
      const attendanceMap = {};

      attendance.forEach(att => {
        const date = new Date(att.date);
        const month = date.toLocaleString("default", { month: "short" });

        if (!attendanceMap[month]) {
          attendanceMap[month] = { present: 0, total: 0 };
        }

        if (att.status === "Present") {
          attendanceMap[month].present++;
        }

        attendanceMap[month].total++;
      });

      const attendanceData = Object.keys(attendanceMap).map(month => ({
        month,
        value: Math.round(
          (attendanceMap[month].present / attendanceMap[month].total) * 100
        )
      }));

      // =========================
      // ✅ SET DATA
      // =========================
      setChartData({
        departmentData,
        statusData,
        growthData,
        attendanceData
      });

    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  const adminStats = [
    { title: "Total Employees", value: stats.totalEmployees, icon: <PeopleIcon />, color: "#3B82F6", bg: "#EBF5FF" },
    { title: "Present Today", value: stats.presentToday, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "On Leave", value: stats.onLeave, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "WFH Today", value: stats.wfhToday, icon: <HomeWorkIcon />, color: "#8B5CF6", bg: "#F5F3FF" },
    { title: "Pending Tasks", value: stats.pendingTasks, icon: <AssignmentIcon />, color: "#EF4444", bg: "#FEF2F2" },
    { title: "Departments", value: stats.totalDepartments, icon: <BusinessIcon />, color: "#06B6D4", bg: "#ECFEFF" }
  ];


  return (
    <Box sx={{ p: 3, backgroundColor: "background.paper", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`, color: "common.white" }}>
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

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {adminStats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
  
      {/* Pie 1 */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
              Employees by Department
            </Typography>
            <PieChartBox data={chartData.departmentData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Pie 2 */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
              Employee Status
            </Typography>
            <PieChartBox data={chartData.statusData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Line Chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
              Employee Growth
            </Typography>
            <LineChartBox data={chartData.growthData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Bar Chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "primary.main" }}>
              Monthly Attendance
            </Typography>
            <BarChartBox data={chartData.attendanceData} />
          </CardContent>
        </Card>
      </Grid>

    </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Recent Employees */}
        <Grid size={{ xs: 12, lg: 6 }}>
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
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "action.hover" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentEmployees.map((emp, i) => (
                        <TableRow key={emp.id || i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main", fontSize: "0.8rem" }}>
                                {emp.name?.split(" ").map(n => n[0]).join("").substring(0, 2)}
                              </Avatar>
                              <Typography fontWeight="500">{emp.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{emp.position || "-"}</TableCell>
                          <TableCell>
                            <Chip label={emp.department_name || "Not Assigned"} size="small" color="primary" variant="filled" />
                          </TableCell>
                          <TableCell>{emp.join_date?.split("T")[0] || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Pending Tasks */}
        <Grid size={{ xs: 12, lg: 6 }}>
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
                  <Box key={task.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: "action.hover", border: "1px solid", borderColor: "divider" }}>
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
        </Grid>

        {/* Leave Requests */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
                  Pending Leave Requests
                </Typography>
                <Button size="small" onClick={() => navigate("/leave")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : leaveRequests.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No pending leave requests
                </Typography>
              ) : (
                leaveRequests.map((leave, i) => (
                  <Box key={leave.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography fontWeight="600">{leave.name || getEmployeeName(leave.employee_id)}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {leave.start_date?.split("T")[0]} to {leave.end_date?.split("T")[0]}
                      </Typography>
                      {leave.reason && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          Reason: {leave.reason}
                        </Typography>
                      )}
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
        </Grid>

        {/* Department Overview */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#3B82F6" }}>
                  Departments
                </Typography>
                <Button size="small" onClick={() => navigate("/departments")}>Manage</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : departments.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No departments found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "#1E293B" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departments.slice(0, 5).map((dept, i) => (
                        <TableRow key={dept.id || i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                          <TableCell>
                            <Chip label={dept.name} size="small" sx={{ background: "#EBF5FF", color: "#3B82F6", fontWeight: "bold" }} />
                          </TableCell>
                          <TableCell>{dept.description || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
