import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import WorkIcon from "@mui/icons-material/Work";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const AttendancePage = () => {
  const navigate = useNavigate();
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user?.employee_id || user?.id;

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchTodayAttendance = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/today/${employeeId}`);
      // If backend returns { message: "Not checked in yet" }, it's not a record
      setAttendance(res.data.id ? res.data : null);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to fetch attendance status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayAttendance();
  }, []);

  const handleAutoCheckIn = async (type) => {
    setActionLoading(true);
    setErrorMsg("");
    try {
      const res = await api.post("/attendance/checkin", {
        employee_id: employeeId,
        work_type: type,
      });
      setAttendance(res.data);
      await fetchTodayAttendance(); // Refresh to get full record
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Check-in failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setErrorMsg("");
    try {
      await api.post("/attendance/checkout", {
        employee_id: employeeId,
      });
      await fetchTodayAttendance();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Check-out failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "--:--";
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Container sx={{ mt: 10, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  const hasCheckedIn = !!attendance?.time_in;
  const hasCheckedOut = !!attendance?.time_out;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: 4,
          background: "linear-gradient(145deg, #ffffff 0%, #f1f4f8 100%)",
          border: "1px solid #e0e6ed",
        }}
      >
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a202c", mb: 1 }}>
            Attendance Terminal
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
            {formatDate(currentTime)}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontFamily: "monospace",
              fontWeight: 700,
              color: "#3182ce",
              mt: 1,
              letterSpacing: 2,
            }}
          >
            {currentTime.toLocaleTimeString()}
          </Typography>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Workflow Logic */}
        {!hasCheckedIn ? (
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 3, fontWeight: 700, textAlign: "center", color: "#4a5568" }}
            >
              Select Work Mode to Check-In
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
                    border: "2px solid #e2e8f0",
                  }}
                >
                  <CardActionArea
                    onClick={() => handleAutoCheckIn("present")}
                    disabled={actionLoading}
                    sx={{ p: 2, textAlign: "center" }}
                  >
                    <WorkIcon sx={{ fontSize: 60, color: "#38a169", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Office
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Regular Check-In
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    borderRadius: 3,
                    transition: "0.3s",
                    "&:hover": { transform: "translateY(-5px)", boxShadow: 4 },
                    border: "2px solid #e2e8f0",
                  }}
                >
                  <CardActionArea
                    onClick={() => handleAutoCheckIn("wfh")}
                    disabled={actionLoading}
                    sx={{ p: 2, textAlign: "center" }}
                  >
                    <HomeIcon sx={{ fontSize: 60, color: "#3182ce", mb: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Work From Home
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Remote Session
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box>
            {/* Active/Completed Session Card */}
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                bgcolor: hasCheckedOut ? "#f8fafc" : "#ebf8ff",
                border: `2px solid ${hasCheckedOut ? "#cbd5e0" : "#bee3f8"}`,
                p: 3,
                mb: 4,
                position: "relative",
                overflow: "hidden",
              }}
            >
              {!hasCheckedOut && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    animation: "pulse 2s infinite",
                    "@keyframes pulse": {
                      "0%": { opacity: 1 },
                      "50%": { opacity: 0.4 },
                      "100%": { opacity: 1 },
                    },
                  }}
                >
                  <Chip
                    label="Live Session"
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 700 }}
                  />
                </Box>
              )}

              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                <AccessTimeIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  {hasCheckedOut ? "Shift Summary" : "Currently On Duty"}
                </Typography>
                <Chip
                  label={attendance?.work_type === "wfh" ? "WFH" : "Office"}
                  variant="outlined"
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Stack>

              <Grid container spacing={4} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Check In Time
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#2d3748" }}>
                    {formatTime(attendance?.time_in)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Check Out Time
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#2d3748" }}>
                    {formatTime(attendance?.time_out)}
                  </Typography>
                </Grid>
              </Grid>

              {hasCheckedOut && (
                <>
                  <Divider sx={{ mb: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      Total Working Hours:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "#38a169" }}>
                      {attendance?.total_hours || "0.00"} hrs
                    </Typography>
                  </Box>
                </>
              )}

              {!hasCheckedOut && (
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  size="large"
                  startIcon={<LogoutIcon />}
                  onClick={handleCheckOut}
                  disabled={actionLoading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    boxShadow: "0 4px 14px 0 rgba(229, 62, 62, 0.39)",
                  }}
                >
                  {actionLoading ? <CircularProgress size={24} color="inherit" /> : "Check Out Now"}
                </Button>
              )}
            </Card>

            {hasCheckedOut && (
              <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                Your attendance for today has been completed. Check back tomorrow!
              </Alert>
            )}
          </Box>
        )}

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            variant="text"
            onClick={() => navigate("/all-attendance")}
            fullWidth
            sx={{ color: "#4a5568", fontWeight: 600 }}
            startIcon={<EventAvailableIcon />}
          >
            M-Attendance History
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AttendancePage;