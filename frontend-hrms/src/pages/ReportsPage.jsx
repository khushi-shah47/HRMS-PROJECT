import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Stack,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  useTheme,
  IconButton,
  Tooltip,
  Tab,
  Tabs
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import AssessmentIcon from "@mui/icons-material/Assessment";
import GroupIcon from "@mui/icons-material/Group";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RefreshIcon from "@mui/icons-material/Refresh";
import DownloadIcon from "@mui/icons-material/Download";
import api from "../services/api";

const ReportsPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [reportType, setReportType] = useState("attendance");

  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main, theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main];
  const STATUS_COLORS = {
    Approved: theme.palette.success.main,
    Pending: theme.palette.warning.main,
    Rejected: theme.palette.error.main
  };

  const fetchSummary = async () => {
    try {
      const res = await api.get("/reports/summary");
      setSummary(res.data);
    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };

  const fetchReport = async (type) => {
    setLoading(true);
    setReportType(type);
    try {
      const res = await api.get(`/reports/${type}`);
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const init = async () => {
    setLoading(true);
    await fetchSummary();
    await fetchReport("attendance");
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const types = ["attendance", "leave", "tasks"];
    fetchReport(types[newValue]);
  };

  const StatCard = ({ title, value, icon, gradient, suffix = "" }) => (
    <Card sx={{ 
      borderRadius: 4, 
      background: gradient,
      color: "white",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      p: 2,
      position: "relative",
      overflow: "hidden",
      boxShadow: theme.shadows[4],
      transition: "all 0.2s",
      "&:hover": { transform: "translateY(-6px)", boxShadow: 6 }
    }}>
      <Box sx={{ 
        p: 1.5, 
        mb: 1, 
        bgcolor: "rgba(255,255,255,0.2)", 
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 24 } })}
      </Box>
      <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: "bold", fontSize: "0.7rem", lineHeight: 1.2, mb: 0.5 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          {value}{suffix}
      </Typography>
      
      {/* Subtle Background Icon */}
      <Box sx={{ 
        position: "absolute", 
        right: -10, 
        bottom: -10, 
        fontSize: 80, 
        opacity: 0.1, 
        transform: "rotate(-15deg)",
        zIndex: 0
      }}>
        {icon}
      </Box>
    </Card>
  );
console.log("RAW DATA:", data[0]);
const chartDataA = [...data]
  .sort((a, b) => Number(b.attendance_days || 0) - Number(a.attendance_days || 0)) // descending
  .slice(0, 8)
  .map(d => ({
    ...d,
    name: d.name?.slice(0, 6) // prevent long names overflow
}));

const chartDataB = [...data]
  .sort((a, b) => Number(b.completed || 0) - Number(a.completed || 0)) // descending
  .slice(0, 8)
  .map(d => ({
    name: d.name?.slice(0, 6),
    completed: Number(d.completed || 0),
    pending: Number(d.pending || 0)
  }));

const renderAttendanceChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={chartDataA} barSize={30}>
    <CartesianGrid 
      stroke={theme.palette.divider}
      strokeDasharray="3 3"
      opacity={0.3}
    />

    <XAxis 
      dataKey="name"
      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
    />

    <YAxis tick={{ fill: theme.palette.text.secondary }} />

    <ChartTooltip
      contentStyle={{
        background: theme.palette.background.paper,
        border: "none",
        borderRadius: "8px",
        color: theme.palette.text.primary
      }}
    />

      <Legend />

      <Bar 
        dataKey="attendance_days" 
        fill="#3B82F6"
        radius={[6, 6, 0, 0]}
        isAnimationActive
        animationDuration={800}
      />

      <Bar 
        dataKey="total_hours" 
        fill="#22C55E"
        radius={[6, 6, 0, 0]}
        isAnimationActive
        animationDuration={800}
      />
    </BarChart>
  </ResponsiveContainer>
);

const renderLeaveChart = () => {
  const pieData = [
    { name: "Approved", value: data.reduce((a, b) => a + Number(b.approved || 0), 0) },
    { name: "Pending", value: data.reduce((a, b) => a + Number(b.pending || 0), 0) },
    { name: "Rejected", value: data.reduce((a, b) => a + Number(b.rejected || 0), 0) }
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius={140}
          paddingAngle={3}
        >
          {pieData.map((entry, i) => (
            <Cell key={i} fill={STATUS_COLORS[entry.name]} />
          ))}
        </Pie>
        <Legend />
        <ChartTooltip
          contentStyle={{
            background: theme.palette.background.paper,
            border: "none",
            borderRadius: "8px",
            color: theme.palette.text.primary
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

const renderTaskChart = () => (
  <ResponsiveContainer width="100%" height="100%">
    <BarChart data={chartDataB} barSize={30} margin={{ bottom: 40 }}>
    <CartesianGrid 
      stroke={theme.palette.divider}
      strokeDasharray="3 3"
      opacity={0.3}
    />

    <XAxis 
      dataKey="name"
      tick={{ fill: theme.palette.text.secondary }}
      angle={-45}
      textAnchor="end"
    />

    <YAxis tick={{ fill: theme.palette.text.secondary }} />

    <ChartTooltip
      contentStyle={{
        background: theme.palette.background.paper,
        border: "none",
        borderRadius: "8px",
        color: theme.palette.text.primary
      }}
    />
      <Legend wrapperStyle={{ paddingTop: "20px" }} />

      <Bar 
        dataKey="completed" 
        stackId="a"
        fill={theme.palette.success.main} 
        isAnimationActive 
        animationDuration={800}
      />

      <Bar 
        dataKey="pending" 
        stackId="a"
        fill={theme.palette.error.main} 
        isAnimationActive 
        animationDuration={800}
      />
    </BarChart>
  </ResponsiveContainer>
);

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
     <Paper
        sx={{
          p: 3,
          mb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white"
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AssessmentIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold", mb: 1  }}>
                Reports & Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", fontWeight: 600, mb: 1 }}>
                Visualize organization data and performance
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh All Data">
            <IconButton onClick={init} sx={{ color: "white" }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Stats Summary Dashboard */}
      <Box sx={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 3,
        mb: 4
      }}>
        <Box sx={{ width: 300 }}>
          <StatCard 
            title="Total Employees" 
            value={summary?.totalEmployees || 0} 
            icon={<GroupIcon />} 
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Box>
        <Box sx={{ width: 300 }}>
          <StatCard 
            title="Pending Requests" 
            value={summary?.pendingRequests || 0} 
            icon={<PendingActionsIcon />} 
            gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
          />
        </Box>
        <Box sx={{ width: 300 }}>
          <StatCard 
            title="Task Velocity" 
            value={summary?.taskCompletionRate || 0} 
            suffix="%"
            icon={<CheckCircleIcon />} 
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
          />
        </Box>
        <Box sx={{ width: 300 }}>
          <StatCard 
            title="Attendance Rate" 
            value={summary?.attendanceRate || 0} 
            suffix="%"
            icon={<EventAvailableIcon />} 
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
          />
        </Box>
      </Box>

      {/* 🔥 Insights */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Key Insights
        </Typography>

        {activeTab === 0 && (
          <Typography color="warning.main" sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ Low attendance employees: {data.filter(d => d.attendance_days < 10).length}
          </Typography>
        )}
        {activeTab === 1 && (
          <Typography color="warning.main" sx={{ fontWeight: 600, mb: 1 }}>
            ⚠️ Pending leave requests: {data.reduce((a, b) => a + Number(b.pending || 0), 0)}
          </Typography>
        )}

        {activeTab === 2 && (
          <Typography color="success.main" sx={{ fontWeight: 600, mb: 1 }}>
            ✅ High task performers: {data.filter(d => d.completed > 5).length}
          </Typography>
        )}
      </Paper>

      {/* 🔥 Top & Needs Attention */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, width: "100%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Top Performers
          </Typography>
          {[...data].sort((a, b) => {
            if (activeTab === 0) return Number(b.attendance_days || 0) - Number(a.attendance_days || 0);
            if (activeTab === 1) return Number(a.pending || 0) - Number(b.pending || 0); // Less pending leaves == better
            return Number(b.completed || 0) - Number(a.completed || 0);
          }).slice(0, 3).map((emp, i) => (
            <Typography key={i}>🟢 {emp.name}</Typography>
          ))}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, width: "100%" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Needs Attention
          </Typography>
          {[...data].sort((a, b) => {
            if (activeTab === 0) return Number(a.attendance_days || 0) - Number(b.attendance_days || 0);
            if (activeTab === 1) return Number(b.pending || 0) - Number(a.pending || 0); 
            return Number(a.completed || 0) - Number(b.completed || 0);
          }).slice(0, 3).map((emp, i) => (
            <Typography key={i} color="error.main">
              🔴 {emp.name}
            </Typography>
          ))}
        </Paper>
      </Grid>
      </Grid>

{/* Main Reports Section */}
<Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
  <Box sx={{ borderBottom: 1, borderColor: "divider", bgcolor: "background.paper" }}>
    <Tabs value={activeTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
      <Tab label="Attendance Summary" sx={{ fontWeight: "bold" }} />
      <Tab label="Leaves & Requests" sx={{ fontWeight: "bold" }} />
      <Tab label="Task Progress" sx={{ fontWeight: "bold" }} />
    </Tabs>
  </Box>

  <Box sx={{ p: 4, bgcolor: "background.paper" }}>
    {/* 🔥 CENTERED TITLE */}
    <Typography 
      variant="h6" 
      sx={{ mb: 1, fontWeight: 600, textAlign: "center" }}
    >
      {activeTab === 0 && "Attendance Overview"}
      {activeTab === 1 && "Leave Trends"}
      {activeTab === 2 && "Task Performance"}
    </Typography>
    {loading ? (
      <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Grid container spacing={3} justifyContent="center">

        {/* LEFT: CHART */}
        <Grid item xs={12} md={6}>
          


          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
          >
            Visual Analysis
          </Typography>

          {/* 🔥 RESPONSIVE WRAPPER */}
          <Paper
            variant="outlined"
            sx={{
              p: { xs: 1, sm: 3 },
              width: "100%",
              height: { xs: 400, md: 600 },
              borderRadius: 4,
              display: "flex",
              flexDirection: "column",
              margin: "0 auto",
              background: theme.palette.background.default,
              boxShadow: "inset 0 0 20px rgba(255,255,255,0.02)"
            }}
          >
            <Box sx={{ height: "100%", width: "100%" }}>
              {activeTab === 0 && renderAttendanceChart()}
              {activeTab === 1 && renderLeaveChart()}
              {activeTab === 2 && (
                chartDataB.every(d => d.completed === 0 && d.pending === 0) ? (
                  <Typography textAlign="center" mt={5}>
                    No task data available
                  </Typography>
                ) : (
                  renderTaskChart()
                )
              )}
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT: TABLE */}
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
          >
            Important Records
          </Typography>

          {/* 🔥 RESPONSIVE WRAPPER */}
          <Paper
            variant="outlined"
            sx={{
              height: { xs: 400, md: 600 },
              width: "100%",
              overflowY: "auto",
              overflowX: "auto",
              p: 1,
              margin: "0 auto"
            }}
          >
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Showing top 8 records
            </Typography>

            <Table size="small">
              <TableHead sx={{ bgcolor: "grey.100" }}>
                <TableRow>
                  {data.length > 0 &&
                    Object.keys(data[0]).map((key) => (
                      <TableCell
                        key={key}
                        sx={{ fontWeight: 600, textTransform: "capitalize" }}
                      >
                        {key.replace(/_/g, " ")}
                      </TableCell>
                    ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {data.slice(0, 8).map((row, i) => (
                  <TableRow
                    key={i}
                    hover
                    sx={{
                      bgcolor: i % 2 === 0 ? "background.default" : "transparent",
                      "&:hover": { bgcolor: "action.hover" }
                    }}
                  >
                    {Object.values(row).map((val, index) => (
                      <TableCell key={index}>
                        {typeof val === "number" && val % 1 !== 0
                          ? val.toFixed(1)
                          : val}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

      </Grid>
    )}
  </Box>
</Paper>

    </Container>
  );
};

export default ReportsPage;
