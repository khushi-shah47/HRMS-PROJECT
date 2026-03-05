import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Box,
  Chip,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import ListAltIcon from '@mui/icons-material/ListAlt';

const AttendancePage = ({ employeeId, onShowAll }) => {
  const [today, setToday] = useState({});
  const [attendanceData, setAttendanceData] = useState([]);
  const [workType, setWorkType] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchToday = async () => {
    const res = await fetch(`http://localhost:5000/api/attendance/today/${employeeId}`);
    setToday(await res.json());
  };

  const fetchTodayAttendance = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/attendance/history/${employeeId}`);
      const data = await res.json();
      const todayStr = new Date().toISOString().split('T')[0];
      const todayData = (Array.isArray(data) ? data : []).filter(rec => rec.date === todayStr);
      setAttendanceData(todayData);
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
      setAttendanceData([]);
    }
  };

  const handleWorkTypeChange = (event, newType) => {
    if (newType !== null) {
      setWorkType(newType);
      setErrorMsg("");
    }
  };

  const handleMarkAttendance = async () => {
    if (!workType) {
      setErrorMsg("Please select type first (Present or WFH)");
      return;
    }

    await fetch("http://localhost:5000/api/attendance/checkin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId, work_type: workType }),
    });
    fetchToday();
    fetchTodayAttendance();
    setWorkType("");
  };

  const handleCheckOut = async () => {
    await fetch("http://localhost:5000/api/attendance/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employee_id: employeeId }),
    });
    fetchToday();
    fetchTodayAttendance();
  };

  useEffect(() => {
    fetchToday();
    fetchTodayAttendance();
  }, []);

  const getStatusChip = (workType) => {
    if (workType === "wfh") {
      return <Chip icon={<HomeIcon />} label="WFH" color="info" size="small" />;
    } else if (workType === "leave") {
      return <Chip icon={<HomeIcon />} label="Leave" color="warning" size="small" />;
    } else {
      return <Chip icon={<CheckCircleIcon />} label="Present" color="success" size="small" />;
    }
  };

  const getCurrentStatusText = () => {
    if (today.work_type === "wfh") return "WFH";
    if (today.work_type === "leave") return "Leave";
    if (today.time_in) {
      return today.time_out ? "Checked-out" : "Checked-in";
    }
    return "";
  };

  const isAttendanceMarked = today.time_in || today.work_type;

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: "#f8f9fa" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Today's Attendance
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, color: today.work_type === "wfh" ? "info.main" : today.work_type === "leave" ? "warning.main" : today.time_in ? "success.main" : "text.secondary" }}>
            {getCurrentStatusText()}
          </Typography>
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Select Type
        </Typography>

        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            value={workType}
            exclusive
            onChange={handleWorkTypeChange}
            disabled={isAttendanceMarked}
            fullWidth
          >
            <ToggleButton 
              value="present" 
              sx={{ py: 1.5, color: "#2e7d32", '&.Mui-selected': { bgcolor: "#4caf50", color: "white", '&:hover': { bgcolor: "#388e3c" } } }}
            >
              <CheckCircleIcon sx={{ mr: 1 }} />
              Present
            </ToggleButton>
            <ToggleButton 
              value="wfh" 
              sx={{ py: 1.5, color: "#0288d1", '&.Mui-selected': { bgcolor: "#03a9f4", color: "white", '&:hover': { bgcolor: "#0288d1" } } }}
            >
              <HomeIcon sx={{ mr: 1 }} />
              WFH
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        {/* Check In and Check Out buttons side by side */}
        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            sx={{ backgroundColor: "#22c55e", '&:hover': { backgroundColor: "#16a34a" }, fontWeight: 'bold' }}
            startIcon={<CheckCircleIcon />}
            onClick={handleMarkAttendance}
            disabled={isAttendanceMarked}
            fullWidth
            size="large"
          >
            Check In
          </Button>

          <Button
            variant="contained"
            color="error"
            sx={{ backgroundColor: "#dc2626", color: "white", '&:hover': { backgroundColor: "#b91c1c" }, fontWeight: 'bold' }}
            startIcon={<LogoutIcon />}
            onClick={handleCheckOut}
            fullWidth
            size="large"
          >
            Check Out
          </Button>
        </Stack>

        {/* Show All Attendance button below */}
        <Button
          variant="outlined"
          startIcon={<ListAltIcon />}
          onClick={onShowAll}
          fullWidth
          size="large"
        >
          Show All Attendance
        </Button>
      </Paper>

      {/* Today's Attendance Table without pagination */}
      <Paper>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 600, bgcolor: "#f5f5f5" }}>
          Today's Attendance List
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time In</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time Out</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hours</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              attendanceData.map((rec) => (
                <TableRow key={rec.id} hover>
                  <TableCell>{rec.date}</TableCell>
                  <TableCell>{rec.name}</TableCell>
                  <TableCell>{rec.time_in ? new Date(rec.time_in).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>{rec.time_out ? new Date(rec.time_out).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>{rec.total_hours ? rec.total_hours.toFixed(2) : "-"}</TableCell>
                  <TableCell>{getStatusChip(rec.work_type)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AttendancePage;