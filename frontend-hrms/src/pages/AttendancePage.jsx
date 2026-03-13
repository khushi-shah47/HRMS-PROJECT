import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Stack,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
const AttendancePage = () => {
  const navigate = useNavigate();
  const [today, setToday] = useState({});
  const [workType, setWorkType] = useState(""); // Present or WFH
  const [errorMsg, setErrorMsg] = useState("");
  const hasSelectedType = workType !== "";
  const hasCheckedIn = !!today?.time_in;
  const hasCheckedOut = !!today?.time_out;
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user?.employee_id || user?.id;
  // Fetch today's attendance
  const fetchToday = async () => {
    try {
      const res = await api.get(`/attendance/today/${employeeId}`);
      const data = await res.data;
      setToday(data);
    } catch (err) {
      console.error(err);
      setToday({});
    }
  };

  useEffect(() => {
    fetchToday();
  }, []);

  const handleWorkTypeChange = (event, newType) => {
    if (newType) {
      setWorkType(newType);
      setErrorMsg("");
    }
  };

  const handleCheckIn = async () => {
    if (!workType) {
      setErrorMsg("Please select type first (Present or WFH).");
      return;
    }
    try {
      console.log('Checkin with type:', workType);
      const res = await api.post("/attendance/checkin", { employee_id: employeeId, work_type: workType });
      console.log('Checkin response:', res.data);
      setWorkType(""); // reset type selection
      setErrorMsg("");
      fetchToday();
    } catch (err) {
      console.error('Checkin error:', err);
      setErrorMsg("Checkin failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCheckOut = async () => {
    try {
      const res = await api.post("/attendance/checkout", { employee_id: employeeId });
      console.log('Checkout response:', res.data);
      setWorkType("");
      setErrorMsg("");
      fetchToday();
    } catch (err) {
      console.error('Checkout error:', err);
      setErrorMsg("Checkout failed");
    }
  };


  const getStatusText = () => {
    if (today.work_type === "wfh") return "WFH";
    if (today.work_type === "present") return today.time_out ? "Checked-out" : "Checked-in";
    return "Not Marked";
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: "#f8f9fa" }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Today's Attendance
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {getStatusText()}
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
            fullWidth
            disabled={hasCheckedIn && !hasCheckedOut} // disable after checkin
          >
            <ToggleButton
              value="present"
              sx={{
                py: 1.5,
                color: "#2e7d32",
                "&.Mui-selected": {
                  bgcolor: "#4caf50",
                  color: "white",
                  "&:hover": { bgcolor: "#388e3c" },
                },
              }}
            >
              <CheckCircleIcon sx={{ mr: 1 }} /> Present
            </ToggleButton>

            <ToggleButton
              value="wfh"
              sx={{
                py: 1.5,
                color: "#0288d1",
                "&.Mui-selected": {
                  bgcolor: "#03a9f4",
                  color: "white",
                  "&:hover": { bgcolor: "#0288d1" },
                },
              }}
            >
              <HomeIcon sx={{ mr: 1 }} /> WFH
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMsg}
          </Alert>
        )}

        <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircleIcon />}
            onClick={handleCheckIn}
            disabled={!hasSelectedType || (hasCheckedIn && !hasCheckedOut)}
            fullWidth
            size="large"
          >
            Check In
          </Button>

          <Button
            variant="contained"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleCheckOut}
            disabled={!hasCheckedIn || hasCheckedOut}
            fullWidth
            size="large"
          >
            Check Out
          </Button>
        </Stack>

        <Button
          variant="outlined"
          onClick={() => navigate("/all-attendance")}
          fullWidth
          size="large"
        >
          Show All Attendance
        </Button>
      </Paper>
    </Container>
  );
};

export default AttendancePage;