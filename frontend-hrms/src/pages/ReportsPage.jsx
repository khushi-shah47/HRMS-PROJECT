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
      transition: "transform 0.2s",
      "&:hover": { transform: "translateY(-4px)" }
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

  const renderAttendanceChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip 
          contentStyle={{ backgroundColor: theme.palette.background.paper, borderRadius: 8, border: "none", boxShadow: theme.shadows[3] }}
        />
        <Legend />
        <Bar dataKey="attendance_days" name="Days Present" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
        <Bar dataKey="total_hours" name="Total Hours" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLeaveChart = () => {
    const totalApproved = data.reduce((acc, curr) => acc + (curr.approved || 0), 0);
    const totalPending = data.reduce((acc, curr) => acc + (curr.pending || 0), 0);
    const totalRejected = data.reduce((acc, curr) => acc + (curr.rejected || 0), 0);

    const pieData = [
      { name: "Approved", value: totalApproved },
      { name: "Pending", value: totalPending },
      { name: "Rejected", value: totalRejected }
    ];

    return (
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={7}>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={80}
                outerRadius={140}
                paddingAngle={5}
                dataKey="value"
              >
                <Cell fill={theme.palette.success.main} />
                <Cell fill={theme.palette.warning.main} />
                <Cell fill={theme.palette.error.main} />
              </Pie>
              <ChartTooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
        <Grid item xs={12} md={5}>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data.slice(0, 5)}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="total_leaves" fill={theme.palette.primary.main} name="Total Requests" />
            </BarChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    );
  };

  const renderTaskChart = () => (
    <ResponsiveContainer width="100%" height={500}>
      <BarChart data={data.slice(0, 10)}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis dataKey="name" />
        <YAxis />
        <ChartTooltip />
        <Legend />
        <Bar dataKey="completed" name="Completed" stackId="a" fill={theme.palette.success.main} />
        <Bar dataKey="pending" name="Pending" stackId="a" fill={theme.palette.warning.main} />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Header */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white"
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AssessmentIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Reports & Analytics
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
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
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Visual Analysis */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="text.secondary">
                  Visual Analysis
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", height: "100%", width: "600px" }}>
                  {activeTab === 0 && renderAttendanceChart()}
                  {activeTab === 1 && renderLeaveChart()}
                  {activeTab === 2 && renderTaskChart()}
                </Paper>
              </Grid>

              {/* Detailed Data */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  Detailed Data
                </Typography>
                <Paper variant="outlined" sx={{ overflowX: "auto", height: "100%", width: "600px" }}>
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "action.hover" }}>
                      <TableRow>
                        {data.length > 0 &&
                          Object.keys(data[0]).map(key => (
                            <TableCell key={key} sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                              {key.replace("_", " ")}
                            </TableCell>
                          ))
                        }
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.map((row, i) => (
                        <TableRow key={i} hover>
                          {Object.values(row).map((val, index) => (
                            <TableCell key={index}>
                              {typeof val === 'number' && val % 1 !== 0 ? val.toFixed(1) : val}
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