import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import BusinessIcon from "@mui/icons-material/Business";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssignmentIcon from "@mui/icons-material/Assignment";
import WorkIcon from "@mui/icons-material/Work";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
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

export default function HRDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    leaveRequests: 0,
    totalDepartments: 0,
    pendingTasks: 0,
    wfhToday: 0,
    wfhRequests: 0
  });
  
  const [chartData, setChartData] = useState({
    attendanceData: [],
    leaveTypeData: [],
    leaveTrendData: [],
    hiringData: []
  });

  const [recentEmployees, setRecentEmployees] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [wfhRequests, setWfhRequests] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);

  const fetchHRChartData = async () => {
    try {
      const empRes = await api.get("/employees");
      const leaveRes = await api.get("/leaves");

      // ✅ SAFE extraction
      const employees = Array.isArray(empRes.data)
        ? empRes.data
        : empRes.data?.employees || [];

      const leaves = Array.isArray(leaveRes.data)
        ? leaveRes.data
        : leaveRes.data?.data || [];

      // =========================
      // 📊 1. Attendance Today (Pie)
      // =========================
      const attendanceMap = {
        Present: 0,
        Absent: 0,
        Leave: 0,
        Late: 0
      };

      // ⚠️ If no attendance API → simulate using employee status
      employees.forEach(emp => {
        if (emp.status === "Active") attendanceMap.Present++;
        else if (emp.status === "Leave") attendanceMap.Leave++;
        else attendanceMap.Absent++;
      });

      const attendanceData = Object.keys(attendanceMap).map(key => ({
        name: key,
        value: attendanceMap[key]
      }));

      // =========================
      // 📊 2. Leave Types (Pie)
      // =========================
      const leaveTypeMap = {
        "Sick Leave": 0,
        "Casual Leave": 0,
        "Paid Leave": 0,
        "Unpaid Leave": 0
      };

      leaves.forEach(leave => {
        const type = leave.leave_type || "Casual Leave";

        if (leaveTypeMap[type] !== undefined) {
          leaveTypeMap[type]++;
        }
      });

      const leaveTypeData = Object.keys(leaveTypeMap).map(key => ({
        name: key,
        value: leaveTypeMap[key]
      }));

      // =========================
      // 📈 3. Leave Requests Trend
      // =========================
      const leaveTrendMap = {};

      leaves.forEach(leave => {
        const date = new Date(leave.start_date);
        const month = date.toLocaleString("default", { month: "short" });

        leaveTrendMap[month] = (leaveTrendMap[month] || 0) + 1;
      });

      const leaveTrendData = Object.keys(leaveTrendMap).map(key => ({
        month: key,
        value: leaveTrendMap[key]
      }));

      // =========================
      // 📈 4. Hiring Trend
      // =========================
      const hiringMap = {};

      employees.forEach(emp => {
        const date = new Date(emp.join_date || emp.created_at);
        const month = date.toLocaleString("default", { month: "short" });

        hiringMap[month] = (hiringMap[month] || 0) + 1;
      });

      const hiringData = Object.keys(hiringMap).map(key => ({
        month: key,
        value: hiringMap[key]
      }));

      // =========================
      // ✅ SET DATA
      // =========================
      setChartData({
        attendanceData,
        leaveTypeData,
        leaveTrendData,
        hiringData
      });

    } catch (error) {
      console.error("HR chart error:", error);
    }
  };

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
        fetchDepartments(),
        fetchAnnouncements(),
        fetchHolidays(),
        fetchHRChartData()
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

  const handleApproveWFH = async (id) => {
    try {
      await api.post("/wfh/approve", { id });
      fetchWFH();
    } catch (error) {
       console.error("Error approving WFH:", error);
    }
  };

  const handleRejectWFH = async (id) => {
    try {
      await api.post("/wfh/reject", { id });
      fetchWFH();
    } catch (error) {
      console.error("Error rejecting WFH:", error);
    }
  };

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

  const hrStats = [
    { title: "Total Employees", value: stats.totalEmployees, icon: <PeopleIcon />, color: "#059669", bg: "#ECFDF5" },
    { title: "Present Today", value: stats.presentToday, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
    { title: "Leave Requests", value: stats.leaveRequests, icon: <BeachAccessIcon />, color: "#F59E0B", bg: "#FFFBEB" },
    { title: "WFH Requests", value: stats.wfhRequests, icon: <HomeWorkIcon />, color: "#06B6D4", bg: "#ECFEFF" },
    { title: "Departments", value: stats.totalDepartments, icon: <BusinessIcon />, color: "#8B5CF6", bg: "#F5F3FF" },
    { title: "Active", value: stats.totalEmployees, icon: <AssignmentIcon />, color: "#EF4444", bg: "#FEF2F2" }
  ];

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #059669 0%, #10B981 100%)", color: "white" }}>
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
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {hrStats.map((stat, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
            <StatCard {...stat} loading={loading} />
          </Grid>
        ))}
      </Grid>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>

      {/* Attendance */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
              Attendance Status Today
            </Typography>

            <PieChartBox data={chartData.attendanceData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Leave Types */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
              Leave Types Distribution
            </Typography>

            <PieChartBox data={chartData.leaveTypeData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Leave Trend */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
              Leave Requests per Month
            </Typography>

            <BarChartBox data={chartData.leaveTrendData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Hiring Trend */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: "#1E3A8A" }}>
              Employee Hiring Trend
            </Typography>

            <LineChartBox data={chartData.hiringData} />
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
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#059669" }}>
                  Recent Employees
                </Typography>
                <Button size="small" onClick={() => navigate("/employees")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress sx={{ color: "#059669" }} />
                </Box>
              ) : recentEmployees.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No employees found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "#F8FAFC" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentEmployees.map((emp, i) => (
                        <TableRow key={emp.id || i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ width: 32, height: 32, background: "#059669", fontSize: "0.8rem" }}>
                                {emp.name?.split(" ").map(n => n[0]).join("").substring(0, 2)}
                              </Avatar>
                              <Typography fontWeight="500">{emp.name}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>{emp.position || "-"}</TableCell>
                          <TableCell>
                            <Chip label={emp.department_name || "Not Assigned"} size="small" sx={{ background: "#ECFDF5", color: "#059669" }} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Leave Requests */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#059669" }}>
                  Leave Requests
                </Typography>
                <Button size="small" onClick={() => navigate("/leave")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress sx={{ color: "#059669" }} />
                </Box>
              ) : leaveRequests.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No leave requests
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
                    {leave.status === "Pending" ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button size="small" variant="contained" color="success" onClick={() => handleApproveLeave(leave.id)}>
                          Approve
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleRejectLeave(leave.id)}>
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      getStatusChip(leave.status)
                    )}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* WFH Requests */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#06B6D4" }}>
                  WFH Requests
                </Typography>
                <Button size="small" onClick={() => navigate("/wfh")}>View All</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress sx={{ color: "#06B6D4" }} />
                </Box>
              ) : wfhRequests.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No WFH requests
                </Typography>
              ) : (
                wfhRequests.map((req, i) => (
                  <Box key={req.id || i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography fontWeight="600">{req.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {req.start_date?.split("T")[0]} to {req.end_date?.split("T")[0]}
                      </Typography>
                      {req.reason && (
                        <Typography variant="caption" display="block" color="textSecondary">
                          Reason: {req.reason}
                        </Typography>
                      )}
                    </Box>
                    {req.status === "pending" ? (
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <Button size="small" variant="contained" color="success" onClick={() => handleApproveWFH(req.id)}>
                          Approve
                        </Button>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleRejectWFH(req.id)}>
                          Reject
                        </Button>
                      </Box>
                    ) : (
                      <Chip 
                        label={req.status.charAt(0).toUpperCase() + req.status.slice(1)} 
                        size="small" 
                        color={req.status === "approved" ? "success" : "error"} 
                      />
                    )}
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Department Overview */}
        <Grid size={{ xs: 12 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#059669" }}>
                  Departments
                </Typography>
                <Button size="small" onClick={() => navigate("/departments")}>Manage Departments</Button>
              </Box>
              
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress sx={{ color: "#059669" }} />
                </Box>
              ) : departments.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                  No departments found
                </Typography>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ background: "#F8FAFC" }}>
                        <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {departments.map((dept, i) => (
                        <TableRow key={dept.id || i} sx={{ "&:hover": { background: "#F8FAFC" } }}>
                          <TableCell>
                            <Chip label={dept.name} size="small" sx={{ background: "#ECFDF5", color: "#059669", fontWeight: "bold" }} />
                          </TableCell>
                          <TableCell>{dept.description || "-"}</TableCell>
                          <TableCell>
                            <Button size="small" variant="outlined" onClick={() => navigate("/departments")}>
                              View
                            </Button>
                          </TableCell>
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
