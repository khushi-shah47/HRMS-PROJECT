import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Stack,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  InputAdornment
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import api from "../services/api";
import { useTheme } from "@mui/material/styles";
const WFHPage = () => {
  const theme = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState("team"); // 'team' or 'my'

  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const employeeId = user?.employee_id || user?.id;

  const canApprove = ["admin", "hr", "manager"].includes(userRole);
  const canViewAll = ["admin", "hr"].includes(userRole);
  const isManager = userRole === "manager";

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchHistory = async () => {
    setLoading(true);
    try {
      let res;
      if (canViewAll) {
        res = await api.get("/wfh/all");
      } else if (isManager) {
        const endpoint = viewMode === "team" ? "/wfh/team" : "/wfh/my";
        res = await api.get(endpoint);
      } else {
        res = await api.get("/wfh/my");
      }
      const formatted = (res.data || []).map(rec => {
        const format = (date) => {
          if (!date) return "";
          const d = new Date(date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        };

        return {
          ...rec,
          start_date: format(rec.start_date),
          end_date: format(rec.end_date),
          wfh_date: format(rec.wfh_date)
        };
      });

      setHistory(formatted);
    } catch (error) {
      console.error("Error fetching WFH data:", error);
      showSnackbar("Failed to load WFH requests", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [viewMode]);

  const resetForm = () => {
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const handleApplyOpen = () => {
    resetForm();
    setApplyDialogOpen(true);
  };

  const handleApplyClose = () => {
    setApplyDialogOpen(false);
    resetForm();
  };

  const applyWFH = async () => {
    if (!startDate || !endDate) {
      showSnackbar("Please select start and end dates", "error");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      showSnackbar("End date must be after start date", "error");
      return;
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (startDate < todayStr) {
      showSnackbar("You can't apply the WFH of past date!", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/wfh/apply", {
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        reason: reason
      });

      handleApplyClose();
      showSnackbar("WFH request submitted successfully");
      fetchHistory();
    } catch (error) {
      console.error("Error applying WFH:", error);
      showSnackbar(error.response?.data?.message || "Failed to submit WFH request", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setLoading(true);
    try {
      await api.post("/wfh/approve", { id });
      showSnackbar("WFH request approved");
      fetchHistory();
    } catch (error) {
      console.error("Error approving WFH:", error);
      showSnackbar("Failed to approve WFH request", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (id) => {
    setLoading(true);
    try {
      await api.post("/wfh/reject", { id });
      showSnackbar("WFH request rejected");
      fetchHistory();
    } catch (error) {
      console.error("Error rejecting WFH:", error);
      showSnackbar("Failed to reject WFH request", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      approved: { color: "success", label: "Approved", icon: <CheckCircleIcon fontSize="small" /> },
      rejected: { color: "error", label: "Rejected", icon: <CancelIcon fontSize="small" /> },
      managerApproved: { color: "info", label: "Manager Approved", icon: <CheckCircleIcon fontSize="small" /> },
      pending: { color: "warning", label: "Pending", icon: null }
    };

    const key = Object.keys(statusConfig).find(k => k.toLowerCase() === status?.toLowerCase()) || "pending";
    const config = statusConfig[key];

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
      />
    );
  };

  const displayDateRange = (rec) => {
    const start = rec.start_date;
    const end = rec.end_date;

    if (start && end) {
      return `${start} to ${end}`;
    }
    return rec.wfh_date || start || "-";
  };

  const filteredHistory = history
    .filter(rec =>
      rec.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.reason?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => b.id - a.id); // 🔥 NEWEST ON TOP

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{
        p: 3,
        mb: 3,
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        color: "white"
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <HomeWorkIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Work From Home
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                {canViewAll || isManager ? "Manage WFH requests" : "Apply and track your WFH requests"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleApplyOpen}
              sx={{ bgcolor: "background.paper", color: "secondary.main", "&:hover": { bgcolor: "action.hover" } }}
            >
              Apply WFH
            </Button> */}
            {user.role !== "admin" && (<Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleApplyOpen}
                sx={(theme) => ({
                  bgcolor: "background.paper",
                  color: "primary.main",

                  "&:hover": {
                    bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#121212",
                  },

                  "&:active": {
                    bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#121212",
                  },
                })}
              >
                Apply WFH
              </Button>)}
            <Tooltip title="Refresh">
              <IconButton onClick={fetchHistory} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "background.paper" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search by name or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Chip
            label={`${filteredHistory.length} requests`}
            color="primary"
            variant="outlined"
          />
          {isManager && (
            <Stack direction="row" spacing={1}>
              <Button
                variant={viewMode === "team" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewMode("team")}
                color="primary"
              >
                Team Requests
              </Button>
              <Button
                variant={viewMode === "my" ? "contained" : "outlined"}
                size="small"
                onClick={() => setViewMode("my")}
                color="primary"
              >
                My Requests
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ overflow: "hidden" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress color="primary" />
          </Box>
        )}

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              {(canViewAll || (isManager && viewMode === "team")) && <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>}
              <TableCell sx={{ fontWeight: "bold" }}>Date Range</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              {canApprove && <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && filteredHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canApprove ? 5 : 4} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No WFH requests found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredHistory
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((rec) => (
                  <TableRow key={rec.id} hover>
                    {(canViewAll || (isManager && viewMode === "team")) && <TableCell sx={{ fontWeight: 500 }}>{rec.name}</TableCell>}
                    <TableCell>{displayDateRange(rec)}</TableCell>
                    <TableCell>{rec.reason || "-"}</TableCell>
                    <TableCell>{getStatusChip(rec.status)}</TableCell>
                    {canApprove && (
                      <TableCell align="center">
                        {String(rec.employee_id) !== String(employeeId) && (
                          <Stack direction="row" spacing={1} justifyContent="center">
                            {/* Manager Rule: Stage 1 (not for HR requests) */}
                            {userRole === "manager" && rec.status?.toLowerCase() === "pending" && rec.owner_role !== "hr" && (
                              <Button
                                variant="contained"
                                color="info"
                                size="small"
                                onClick={() => handleApprove(rec.id)}
                              >
                                Approve
                              </Button>
                            )}

                            {/* HR/Admin Rule: Stage 2 or Override */}
                            {(userRole === "hr" || userRole === "admin") && (rec.status?.toLowerCase() === "pending" || rec.status?.toLowerCase() === "managerapproved") && (
                              <Button
                                variant="contained"
                                color="success"
                                size="small"
                                onClick={() => handleApprove(rec.id)}
                              >
                                {rec.status?.toLowerCase() === "managerapproved" ? "Final Approve" : "Override Approve"}
                              </Button>
                            )}

                            {(rec.status?.toLowerCase() === "pending" || rec.status?.toLowerCase() === "managerapproved") && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleReject(rec.id)}
                              >
                                Reject
                              </Button>
                            )}
                          </Stack>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Apply WFH Dialog */}
      <Dialog open={applyDialogOpen} onClose={handleApplyClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <HomeWorkIcon />
            Apply Work From Home
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <TextField
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <TextField
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Enter reason for WFH request..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleApplyClose} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={applyWFH}
            disabled={loading}
            sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WFHPage;