import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Stack,
  TablePagination,
  Box,
  Chip,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import FilterListIcon from "@mui/icons-material/FilterList";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import EventIcon from "@mui/icons-material/Event";
import api from "../services/api";
import { useTheme } from "@mui/material/styles";
function LeavePage() {
  const theme = useTheme();
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [viewMode, setViewMode] = useState("team"); // 'team' or 'my'
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveBalance, setLeaveBalance] = useState(null);

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

  useEffect(() => {
    if (canViewAll) {
      api.get("/employees?page=1&limit=100")
        .then(res => res.data)
        .then(data => setEmployees(data.data || data.employees || []))
        .catch(err => console.error(err));
    }

    fetchLeaveBalance();
  }, []);

  const fetchLeaveBalance = async () => {
    if (employeeId) {
      try {
        const res = await api.get(`/employees/${employeeId}`);
        setLeaveBalance(res.data?.leave_balance ?? null);
      } catch (err) {
        console.error("Error fetching leave balance:", err);
      }
    }
  };

  const fetchLeaves = async () => {
    setLoading(true);
    const query = new URLSearchParams({
      page: page + 1,
      limit: rowsPerPage
    });

    if (statusFilter) {
      query.append("status", statusFilter);
    }

    try {
      let res;
      if (canViewAll) {
        res = await api.get(`/leaves?${query.toString()}`);
      } else if (isManager) {
        const endpoint = viewMode === "team" ? "/leaves/team" : "/leaves/my";
        res = await api.get(`${endpoint}?${query.toString()}`);
      } else {
        res = await api.get(`/leaves/my?${query.toString()}`);
      }

      setLeaves(res.data.data || []);
      setTotalCount(res.data.totalLeaves || res.data.total || 0);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load leaves", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, rowsPerPage, statusFilter, viewMode]);

  const handleApplyOpen = () => {
    setStartDate("");
    setEndDate("");
    setReason("");
    fetchLeaveBalance();
    setApplyDialogOpen(true);
  };

  const handleApplyClose = () => {
    setApplyDialogOpen(false);
  };

  const handleApply = async () => {
    if (!startDate || !endDate) {
      showSnackbar("Please fill required fields", "error");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      showSnackbar("End date must be after start date", "error");
      return;
    }

    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;

    if (leaveBalance !== null && days > leaveBalance) {
      showSnackbar(`Not enough leave balance. You have ${leaveBalance} days available.`, "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/leaves", {
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        reason
      });

      handleApplyClose();
      showSnackbar("Leave applied successfully!");
      setPage(0);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      showSnackbar(err.response?.data?.message || "Failed to apply leave", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      await api.put(`/leaves/${id}`, { status: newStatus });
      showSnackbar(`Leave ${newStatus.toLowerCase()} successfully!`);
      fetchLeaves();
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      pending: { color: "warning", label: "Pending", icon: <EventIcon fontSize="small" /> },
      managerApproved: { color: "info", label: "Manager Approved", icon: <CheckCircleIcon fontSize="small" /> },
      approved: { color: "success", label: "Approved", icon: <CheckCircleIcon fontSize="small" /> },
      rejected: { color: "error", label: "Rejected", icon: <CancelIcon fontSize="small" /> }
    };

    // Handle case-insensitivity if backend returns differently
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

  const getPageSubtitle = () => {
    if (canViewAll) return "Manage all leave requests";
    if (isManager) return "Manage team leave requests";
    return "Apply and track your leave requests";
  };

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
            <BeachAccessIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Leave Management
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                {getPageSubtitle()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {leaveBalance !== null && !canViewAll && (
              <Chip
                label={`Balance: ${leaveBalance} days`}
                sx={{ bgcolor: "background.paper", color: "primary.main", fontWeight: "bold" }}
              />
            )}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleApplyOpen}
              sx={{ bgcolor: "background.paper", color: "primary.main", "&:hover": { bgcolor: "action.hover" } }}
            >
              Apply Leave
            </Button>
            <Tooltip title="Refresh">
              <IconButton onClick={fetchLeaves} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Filter Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <FilterListIcon color="action" />
          <TextField
            select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            size="small"
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Rejected">Rejected</MenuItem>
          </TextField>
          <Chip
            label={`${totalCount} requests`}
            color="warning"
            variant="outlined"
          />
          {isManager && (
            <Stack direction="row" spacing={1}>
              <Button
                variant={viewMode === "team" ? "contained" : "outlined"}
                size="small"
                onClick={() => { setViewMode("team"); setPage(0); }}
                color="warning"
              >
                Team Requests
              </Button>
              <Button
                variant={viewMode === "my" ? "contained" : "outlined"}
                size="small"
                onClick={() => { setViewMode("my"); setPage(0); }}
                color="warning"
              >
                My Requests
              </Button>
            </Stack>
          )}
        </Stack>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ overflow: "hidden", bgcolor: "background.paper" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress color="warning" />
          </Box>
        )}

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Employee</TableCell>
              {(canViewAll || isManager) && <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>}
              <TableCell sx={{ fontWeight: "bold" }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              {canApprove && <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && leaves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canApprove ? 8 : 7} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No leave records found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              leaves.map(leave => (
                <TableRow key={leave.id} hover>
                  <TableCell>{leave.id}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{leave.name}</TableCell>
                  {(canViewAll || isManager) && <TableCell>{leave.department || "-"}</TableCell>}
                  <TableCell>{leave.start_date?.split("T")[0]}</TableCell>
                  <TableCell>{leave.end_date?.split("T")[0]}</TableCell>
                  <TableCell>{leave.reason || "-"}</TableCell>
                  <TableCell>{getStatusChip(leave.status)}</TableCell>
                  {canApprove && (
                    <TableCell align="center">
                      {String(leave.employee_id) !== String(employeeId) && (
                        <Stack direction="row" spacing={1} justifyContent="center">
                          {/* Manager: Approve Stage 1 (only if not an HR request) */}
                          {userRole === "manager" && leave.status?.toLowerCase() === "pending" && leave.owner_role !== "hr" && (
                            <Button
                              variant="contained"
                              color="info"
                              size="small"
                              onClick={() => updateStatus(leave.id, "Approved")}
                            >
                              Approve
                            </Button>
                          )}

                          {/* HR/Admin: Final Approval or Override */}
                          {(userRole === "hr" || userRole === "admin") && (leave.status?.toLowerCase() === "pending" || leave.status?.toLowerCase() === "managerapproved") && (
                            <Button
                              variant="contained"
                              color="success"
                              size="small"
                              onClick={() => updateStatus(leave.id, "Approved")}
                            >
                              {leave.status?.toLowerCase() === "managerapproved" ? "Final Approve" : "Override Approve"}
                            </Button>
                          )}

                          {(leave.status?.toLowerCase() === "pending" || leave.status?.toLowerCase() === "managerapproved") && (
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => updateStatus(leave.id, "Rejected")}
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
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Apply Leave Dialog */}
      <Dialog open={applyDialogOpen} onClose={handleApplyClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BeachAccessIcon />
            Apply for Leave
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {leaveBalance !== null && (
              <Alert severity="info">
                Current Leave Balance: <strong>{leaveBalance} days</strong>
              </Alert>
            )}

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

            {startDate && endDate && new Date(startDate) <= new Date(endDate) && (
              <Alert severity={
                Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1 > (leaveBalance || 0)
                  ? "warning"
                  : "success"
              }>
                Requesting: <strong>
                  {Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} day(s)
                </strong>
              </Alert>
            )}

            <TextField
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              multiline
              rows={3}
              fullWidth
              placeholder="Enter reason for leave..."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleApplyClose} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={loading}
            sx={{ bgcolor: "warning.main", "&:hover": { bgcolor: "warning.dark" } }}
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
}

export default LeavePage;
