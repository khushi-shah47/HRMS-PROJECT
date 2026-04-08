import React, { useState, useEffect } from "react";
import { Box, Grid, CircularProgress, Alert, Typography, useTheme } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import api from "../../services/api";
import StatCard from "./dashboard/StatCard";

export default function AttendanceSummary() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    leavesToday: 0,
    wfhToday: 0,
    absentToday: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const theme = useTheme();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/dashboard/stats");
      const data = res.data || {};
      setStats({
        totalEmployees: data.totalEmployees || 0,
        presentToday: data.presentToday || 0,
        leavesToday: data.leavesToday || data.onLeave || 0,
        wfhToday: data.wfhToday || 0,
        absentToday: data.absentToday || Math.max(0, (data.totalEmployees || 0) - (data.presentToday || 0) - (data.leavesToday || 0) - (data.wfhToday || 0))
      });
    } catch (err) {
      console.error("Failed to fetch attendance stats:", err);
      setError("Failed to load attendance data");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: "Present", value: stats.presentToday, icon: <CheckCircleIcon />, color: "success.main", bg: "success.50" },
    { title: "WFH", value: stats.wfhToday, icon: <HomeWorkIcon />, color: "secondary.main", bg: "secondary.50" },
    { title: "Leave", value: stats.leavesToday, icon: <BeachAccessIcon />, color: "warning.main", bg: "warning.50" },
    { title: "Absent", value: stats.absentToday, icon: <PeopleIcon />, color: "error.main", bg: "error.50" }
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
        Today's Attendance Summary
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error} <Typography variant="body2" sx={{ mt: 1 }}>Showing cached/fallback data</Typography>
        </Alert>
      )}

      <Grid container spacing={2}>
        {statCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard 
              title={stat.title} 
              value={stat.value || 0} 
              icon={stat.icon} 
              color={stat.color} 
              bg={stat.bg || "action.hover"}
              loading={false}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Total Employees: <strong>{stats.totalEmployees || 0}</strong> | 
          Last Updated: <strong>{new Date().toLocaleTimeString()}</strong>
        </Typography>
      </Box>
    </Box>
  );
}

