import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
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
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Chip,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  useTheme,
  Divider,
  Avatar,
  Checkbox,
  LinearProgress,
  TablePagination,
  Autocomplete
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HistoryIcon from "@mui/icons-material/History";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CalculateIcon from "@mui/icons-material/Calculate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DownloadIcon from "@mui/icons-material/Download";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PaymentsIcon from "@mui/icons-material/Payments";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SummarizeIcon from "@mui/icons-material/Summarize";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../services/api";

const squareCardStyle = {
  borderRadius: 4,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  p: 2,
  transition: "transform 0.2s",
  "&:hover": { transform: "translateY(-4px)" }
};

const iconCircle = {
  p: 1.5,
  mb: 1.5,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44
};

const SalaryPage = () => {
  const theme = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdminOrHR, setIsAdminOrHR] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  // Modals
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [payslipDialogOpen, setPayslipDialogOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  // Bulk Config State
  const [defAllowance, setDefAllowance] = useState("1000");
  const [defBonus, setDefBonus] = useState("0");
  const [defOtherDeduction, setDefOtherDeduction] = useState("0");
  const [selectedEmpIds, setSelectedEmpIds] = useState([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkRoleFilter, setBulkRoleFilter] = useState("");

  // Edit State
  const [editRecord, setEditRecord] = useState(null);
  const [editAllowance, setEditAllowance] = useState("");
  const [editBonus, setEditBonus] = useState("");
  const [editDeduction, setEditDeduction] = useState("");

  // Period State
  const [reportMonth, setReportMonth] = useState(new Date().getMonth() + 1);
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [historyEmployeeId, setHistoryEmployeeId] = useState("");

  // Data State
  const [report, setReport] = useState([]);
  const [history, setHistory] = useState([]);
  const [myLatestSalary, setMyLatestSalary] = useState(null);
  const [payrollSummary, setPayrollSummary] = useState({ totalEmployees: 0, processedCount: 0 });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [roleFilter, setRoleFilter] = useState("");
  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  const [statusFilter, setStatusFilter] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user);
    setIsAdminOrHR(user.role === "admin" || user.role === "hr");
    fetchEmployees();
    if (user.role !== "admin" && user.role !== "hr") {
      fetchMyLatestSalary();
    }
  }, []);

  useEffect(() => {
    if (isAdminOrHR) {
      fetchReport();
      fetchPayrollSummary();
    }
  }, [reportMonth, reportYear, isAdminOrHR, page, rowsPerPage, roleFilter, statusFilter]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees?page=1&limit=10000");
      setEmployees(res.data.employees || res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const fetchPayrollSummary = async () => {
    try {
      const res = await api.get(`/salary/summary?month=${reportMonth}&year=${reportYear}`);
      setPayrollSummary(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/salary/report`, {
        params: {
          month: reportMonth,
          year: reportYear,
          page: page + 1,
          limit: rowsPerPage,
          role: roleFilter || undefined,
          status: statusFilter || undefined
        }
      });
      setReport(res.data.data);
      setTotalRecords(res.data.total);
    } catch (err) { showSnackbar("Failed to fetch report", "error"); }
    finally { setLoading(false); }
  };

  const fetchHistory = async () => {
    if (!historyEmployeeId) return;
    setLoading(true);
    try {
      const res = await api.get(`/salary/history/${historyEmployeeId}`);
      setHistory(res.data);
    } catch (err) { setHistory([]); }
    finally { setLoading(false); }
  };

  const fetchMyLatestSalary = async () => {
    setLoading(true);
    try {
      const res = await api.get("/salary/my");
      if (res.data && res.data.length > 0) {
        setMyLatestSalary(res.data[0]); // Most recent
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleBulkGenerate = async () => {
    setBulkLoading(true);
    try {
      await api.post("/salary/bulk-generate", {
        month: reportMonth,
        year: reportYear,
        employeeIds: selectedEmpIds.length > 0 ? selectedEmpIds : null,
        defaultAllowance: parseFloat(defAllowance),
        defaultBonus: parseFloat(defBonus),
        otherDeduction: parseFloat(defOtherDeduction)
      });
      showSnackbar("Bulk generation successful!");
      setBulkDialogOpen(false);
      fetchReport();
      fetchPayrollSummary();
    } catch (err) { 
        const message =
          err.response?.data?.message || "Bulk generation failed";

        showSnackbar(message, "error");
      }
    finally { setBulkLoading(false); }
  };

  const handleEditOpen = (rec) => {
    setEditRecord(rec);
    setEditAllowance(rec.allowance);
    setEditBonus(rec.bonus);
    setEditDeduction(rec.deduction);
    setEditDialogOpen(true);
  };

  const handleUpdateRecord = async () => {
    const final_salary = parseFloat(editRecord.basic_salary) + parseFloat(editAllowance) + parseFloat(editBonus) - parseFloat(editDeduction);
    try {
      await api.put(`/salary/${editRecord.id}`, {
        allowance: editAllowance,
        bonus: editBonus,
        deduction: editDeduction,
        final_salary
      });
      showSnackbar("Record updated successfully");
      setEditDialogOpen(false);
      fetchReport();
      if (historyEmployeeId) fetchHistory();
    } catch (err) { showSnackbar("Failed to update", "error"); }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await api.patch(`/salary/status/${id}`, { status: newStatus });
      showSnackbar(`Marked as ${newStatus}`);
      fetchReport();
      if (historyEmployeeId) fetchHistory();
    } catch (err) { showSnackbar("Failed to update status", "error"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary record?")) return;
    try {
      await api.delete(`/salary/${id}`);
      showSnackbar("Record deleted successfully");
      fetchReport();
      if (historyEmployeeId) fetchHistory();
      fetchPayrollSummary();
    } catch (err) { showSnackbar("Failed to delete record", "error"); }
  };

  const handleDownloadPDF = (payslip = null) => {
    const slip = payslip || selectedPayslip;
    if (!slip) return;
    
    const monthName = months.find(m => m.value == slip.month)?.label || "";
    
    const printWindow = window.open("", "", "width=800,height=600");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip - ${monthName} ${slip.year}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #1976d2; padding-bottom: 20px; margin-bottom: 30px; }
            .header h1 { margin: 0; color: #1976d2; }
            .row { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .total { font-weight: bold; font-size: 18px; border-top: 2px solid #333; padding-top: 15px; margin-top: 20px; border-bottom: none; }
            .text-error { color: #d32f2f; }
            .text-success { color: #2e7d32; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PAYSLIP</h1>
            <h2>${monthName} ${slip.year}</h2>
          </div>
          <div class="row"><span>Basic Salary</span><span>Rs. ${parseFloat(slip.basic_salary).toLocaleString()}</span></div>
          <div class="row"><span>Allowance</span><span>+ Rs. ${parseFloat(slip.allowance || 0).toLocaleString()}</span></div>
          <div class="row"><span>Bonus</span><span>+ Rs. ${parseFloat(slip.bonus || 0).toLocaleString()}</span></div>
          <div class="row text-error"><span>Leave Deduction (${slip.leave_days || 0} Days)</span><span>- Rs. ${parseFloat(slip.deduction || 0).toLocaleString()}</span></div>
          <div class="row total text-success"><span>Net Payout</span><span>Rs. ${parseFloat(slip.final_salary).toLocaleString()}</span></div>
          <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #777;">
            <p>This is a computer-generated document and does not require a signature.</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // const totalCount = data.length === paginatedReport.length ? filteredReport.length : data.length;
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(0, i).toLocaleString('default', { month: 'long' })
  }));
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  // Financial Summary Calculation
  const totals = payrollSummary.totals || { basic: 0, allowance: 0, bonus: 0, deduction: 0, net: 0 };

  const renderTable = (data, totalCount, isHistory = false) => (
    <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
        <TableHead sx={{ bgcolor: "action.hover" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>{isHistory ? "Period" : "Employee"}</TableCell>
            {!isHistory && <TableCell sx={{ fontWeight: "bold" }}>Period</TableCell>}
            <TableCell sx={{ fontWeight: "bold" }} align="right">Basic</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">Allow/Bonus</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              <Tooltip title="Tracked from Approved Leave Requests">
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5, cursor: "help" }}>
                    Deduction <TrendingUpIcon sx={{ fontSize: 14, opacity: 0.6 }} />
                </Box>
              </Tooltip>
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">Net Salary</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">Status</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((rec) => (
            <TableRow key={rec.id} hover>
              <TableCell>
                {isHistory ? <Chip label={`${months.find(m => m.value == rec.month).label} ${rec.year}`} size="small" variant="outlined" /> : (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {/* <Avatar sx={{ width: 30, height: 30, fontSize: "0.8rem", bgcolor: "primary.main" }}>{rec.name?.charAt(0)}</Avatar> */}
                    {rec.name}
                  </Box>
                )}
              </TableCell>
              {!isHistory && <TableCell>{months.find(m => m.value == rec.month).label} {rec.year}</TableCell>}
              <TableCell align="right">₹{parseFloat(rec.basic_salary).toLocaleString()}</TableCell>
              <TableCell align="right">₹{(parseFloat(rec.allowance || 0) + parseFloat(rec.bonus || 0)).toLocaleString()}</TableCell>
              <TableCell align="center" sx={{ color: "error.main" }}>-₹{parseFloat(rec.deduction || 0).toLocaleString()}</TableCell>
              <TableCell align="right">
                <Typography sx={{ fontWeight: "bold", color: "success.main" }}>₹{parseFloat(rec.final_salary).toLocaleString()}</Typography>
              </TableCell>
              <TableCell align="center">
                <Chip label={rec.status} color={rec.status === "Paid" ? "success" : "primary"} size="small" />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                  <Tooltip title="View Payslip">
                    <IconButton size="small" color="primary" onClick={() => { setSelectedPayslip(rec); setPayslipDialogOpen(true); }}>
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {isAdminOrHR && rec.status === "Generated" && (
                    <>
                      <Tooltip title="Manual Override">
                        <IconButton size="small" color="secondary" onClick={() => handleEditOpen(rec)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Mark as Paid">
                        <IconButton size="small" color="success" onClick={() => updateStatus(rec.id, "Paid")}>
                            <PaymentsIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Record">
                        <IconButton size="small" color="error" onClick={() => handleDelete(rec.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
        </TableContainer>
      <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
      />
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Dynamic Header */}
      <Paper sx={{ 
        p: 3, mb: 3, borderRadius: 2, color: "white",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{isAdminOrHR ? "Enterprise Payroll Dashboard" : "My Payout Dashboard"}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>{isAdminOrHR ? "Monthly expenditure summary & bulk automation" : "Real-time visibility into your latest payslips"}</Typography>
            </Box>
          </Box>
          {isAdminOrHR && (
            <Button
                variant="contained"
                startIcon={<GroupAddIcon />}
                onClick={() => setBulkDialogOpen(true)}
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
                Bulk Generation
            </Button>
          )}
        </Box>
      </Paper>

      {/* Admin Summary View */}
      {isAdminOrHR ? (
        <>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 3 }}>
                <Box sx={{ width: 240 }}>
                    <Card sx={squareCardStyle}>
                        <Box sx={{ ...iconCircle, background: "action.hover" }}><AttachMoneyIcon sx={{ color: "primary.main" }} /></Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.65rem", fontWeight: "bold" }}>Total Payout</Typography>
                        <Typography variant="h5" color="primary.main" sx={{ fontWeight: "bold" }}>₹{totals.net.toLocaleString()}</Typography>
                    </Card>
                </Box>
                <Box sx={{ width: 240 }}>
                    <Card sx={squareCardStyle}>
                        <Box sx={{ ...iconCircle, background: "action.hover" }}><TrendingUpIcon sx={{ color: "success.main" }} /></Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.65rem", fontWeight: "bold" }}>Total Allowances</Typography>
                        <Typography variant="h5" sx={{ fontWeight: "bold" }}>₹{(totals.allowance + totals.bonus).toLocaleString()}</Typography>
                    </Card>
                </Box>
                <Box sx={{ width: 240 }}>
                    <Card sx={squareCardStyle}>
                        <Box sx={{ ...iconCircle, background: "action.hover" }}><SummarizeIcon sx={{ color: "error.main" }} /></Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.65rem", fontWeight: "bold" }}>Total Deductions</Typography>
                        <Typography variant="h5" color="error.main" sx={{ fontWeight: "bold" }}>₹{totals.deduction.toLocaleString()}</Typography>
                    </Card>
                </Box>
                <Box sx={{ width: 240 }}>
                    <Card sx={squareCardStyle}>
                        <Box sx={{ ...iconCircle, background: "action.hover" }}><CheckCircleOutlineIcon sx={{ color: "info.main" }} /></Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.65rem", fontWeight: "bold" }}>Payroll Status</Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>{payrollSummary.processedCount}/{payrollSummary.totalEmployees}</Typography>
                    </Card>
                </Box>
                <Box sx={{ width: 240 }}>
                    <Card sx={squareCardStyle}>
                        <Box sx={{ ...iconCircle, background: "action.hover" }}><AssessmentIcon sx={{ color: "secondary.main" }} /></Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontSize: "0.65rem", fontWeight: "bold" }}>Efficiency</Typography>
                        <Box sx={{ width: '80%', mt: 1 }}>
                            <LinearProgress variant="determinate" value={(payrollSummary.processedCount / payrollSummary.totalEmployees) * 100 || 0} sx={{ height: 6, borderRadius: 3 }} />
                        </Box>
                    </Card>
                </Box>
            </Box>

            {/* Filter Bar */}
            <Paper sx={{ p: 2, mb: 3, display: "flex", alignItems: "center", gap: 3, borderRadius: 2 }}>
                <TextField select label="Target Month" value={reportMonth} onChange={(e) => { setReportMonth(e.target.value); setPage(0); }} size="small" sx={{ minWidth: 150 }}>
                    {months.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                </TextField>
                <TextField select label="Target Year" value={reportYear} onChange={(e) => { setReportYear(e.target.value); setPage(0); }} size="small" sx={{ minWidth: 120 }}>
                    {years.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                </TextField>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body2" color="text.secondary">Showing Report for <b>{months.find(m => m.value == reportMonth)?.label} {reportYear}</b></Typography>
                <TextField
                  select
                  label="Role"
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
                  size="small"
                  sx={{ minWidth: 150 }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="hr">HR</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="developer">Developer</MenuItem>
                  <MenuItem value="intern">Intern</MenuItem>
                </TextField>
                <TextField select label="Status" value={statusFilter} sx={{ minWidth: 150 }} size="small" onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Generated">Generated</MenuItem>
                  <MenuItem value="Paid">Paid</MenuItem>
                </TextField>
                <Box flexGrow={1} />
                <Button variant="contained" color="success" onClick={fetchReport} startIcon={<RefreshIcon />}>Reload</Button>
            </Paper>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", display: "flex", alignItems: "center", gap: 1 }}>
                <SummarizeIcon color="primary" /> Monthly Payout List
            </Typography>

            <Tabs value={activeTab} onChange={(e, v) => setActiveTab(v)} sx={{ mb: 2 }}>
                <Tab label="Current Report" />
                <Tab label="Search Employee History" />
            </Tabs>

            {activeTab === 0 && (loading ? <Box sx={{ textAlign: "center", py: 5 }}><CircularProgress /></Box> : renderTable(report, totalRecords))}
            {activeTab === 1 && (
                <Box>
                    <Paper sx={{ p: 2, mb: 3, display: "flex", gap: 2, alignItems: "center" }}>
                        <Autocomplete
                          options={employees}
                          getOptionLabel={(option) => `${option.name} (${option.position})`}
                          value={employees.find(emp => emp.id === historyEmployeeId) || null}
                          onChange={(e, newValue) => setHistoryEmployeeId(newValue?.id || "")}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Select Employee"
                              size="small"
                              sx={{ minWidth: 300 }}
                            />
                          )}
                        />
                        <Button variant="outlined" onClick={fetchHistory} disabled={!historyEmployeeId}>View History</Button>
                    </Paper>
                    {loading ? <Box sx={{ textAlign: "center", py: 5 }}><CircularProgress /></Box> : renderTable(history, history.length, true)}
                </Box>
            )}
        </>
      ) : (
        /* Regular Employee Dashboard View */
        <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
            {myLatestSalary ? (
                <Card sx={{ borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <Box sx={{ p: 4, bgcolor: "primary.main", color: "white" }}>
                        <Typography variant="overline">MY LATEST PAYOUT</Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", my: 1 }}>₹{parseFloat(myLatestSalary.final_salary).toLocaleString()}</Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip 
                                label={myLatestSalary.status} 
                                sx={{ bgcolor: myLatestSalary.status === "Paid" ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)", color: "white", fontWeight: "bold" }} 
                            />
                            <Typography variant="body2">{months.find(m => m.value == myLatestSalary.month).label} {myLatestSalary.year}</Typography>
                        </Stack>
                    </Box>
                    <CardContent sx={{ p: 4 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Basic Salary</Typography>
                                <Typography variant="h6">₹{parseFloat(myLatestSalary.basic_salary).toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="caption" color="text.secondary">Allow/Bonus</Typography>
                                <Typography variant="h6">₹{(parseFloat(myLatestSalary.allowance || 0) + parseFloat(myLatestSalary.bonus || 0)).toLocaleString()}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    fullWidth 
                                    variant="outlined" 
                                    startIcon={<VisibilityIcon />}
                                    onClick={() => { setSelectedPayslip(myLatestSalary); setPayslipDialogOpen(true); }}
                                    sx={{ py: 1.5, borderRadius: 2 }}
                                >
                                    View Detailed Payslip
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Box sx={{ position: "absolute", top: -20, right: -20, opacity: 0.1 }}>
                        <AccountBalanceWalletIcon sx={{ fontSize: 180 }} />
                    </Box>
                </Card>
            ) : (
                <Paper sx={{ p: 5, textAlign: "center", borderRadius: 4 }}>
                    <AttachMoneyIcon sx={{ fontSize: 60, color: "text.disabled", mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">No payday records found yet.</Typography>
                    <Typography variant="body2" color="text.secondary">Your payslip will appear here once generated by HR.</Typography>
                </Paper>
            )}
        </Box>
      )}

      {/* Bulk Modal */}
      <Dialog open={bulkDialogOpen} onClose={() => setBulkDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Automated Bulk Generation ({months.find(m => m.value == reportMonth)?.label})</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ mt: 1, mb: 3 }}>
            <Grid item xs={12} md={4}>
              <TextField label="Default Allowance" type="number" fullWidth value={defAllowance} onChange={(e) => setDefAllowance(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Default Bonus" type="number" fullWidth value={defBonus} onChange={(e) => setDefBonus(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField label="Other Deduction" type="number" fullWidth value={defOtherDeduction} onChange={(e) => setDefOtherDeduction(e.target.value)} />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                select
                fullWidth
                label="Filter by Role"
                value={bulkRoleFilter}
                onChange={(e) => setBulkRoleFilter(e.target.value)}
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="hr">HR</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="developer">Developer</MenuItem>
                <MenuItem value="intern">Intern</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>Selected Employees ({selectedEmpIds.length || 'All'})</Typography>
          <Paper variant="outlined" sx={{ maxHeight: 300, overflow: "auto" }}>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead><TableRow>
                <TableCell padding="checkbox"><Checkbox checked={selectedEmpIds.length === employees.length} indeterminate={selectedEmpIds.length > 0 && selectedEmpIds.length < employees.length} onChange={(e) => setSelectedEmpIds(e.target.checked ? employees.map(emp => emp.id) : [])} /></TableCell>
                <TableCell>Name</TableCell><TableCell>Position</TableCell>
              </TableRow></TableHead>
              <TableBody>
                {employees
                  .filter(emp => !bulkRoleFilter || emp.position?.toLowerCase().includes(bulkRoleFilter.toLowerCase()))
                  .map(emp => (
                    <TableRow key={emp.id} hover onClick={() => setSelectedEmpIds(prev => prev.includes(emp.id) ? prev.filter(i => i !== emp.id) : [...prev, emp.id])} sx={{ cursor: "pointer" }}>
                      <TableCell padding="checkbox"><Checkbox checked={selectedEmpIds.includes(emp.id)} /></TableCell>
                      <TableCell>{emp.name}</TableCell><TableCell>{emp.position}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
        </TableContainer>
          </Paper>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setBulkDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBulkGenerate} disabled={bulkLoading}>
            {bulkLoading ? <CircularProgress size={24} /> : "Start Automated Generation"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manual Override Modal */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Manual Override - {editRecord?.name}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Allowance" type="number" fullWidth value={editAllowance} onChange={(e) => setEditAllowance(e.target.value)} />
            <TextField label="Bonus" type="number" fullWidth value={editBonus} onChange={(e) => setEditBonus(e.target.value)} />
            <TextField label="Other Deduction" type="number" fullWidth value={editDeduction} onChange={(e) => setEditDeduction(e.target.value)} />
            <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary">Net Salary Calculation:</Typography>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                ₹{(parseFloat(editRecord?.basic_salary || 0) + parseFloat(editAllowance || 0) + parseFloat(editBonus || 0) - parseFloat(editDeduction || 0)).toLocaleString()}
              </Typography>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateRecord}>Save Correction</Button>
        </DialogActions>
      </Dialog>

      {/* Payslip Modal */}
      <Dialog open={payslipDialogOpen} onClose={() => setPayslipDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ textAlign: "center", borderBottom: 1, borderColor: "divider" }}>
          PAYSLIP BREAKDOWN - {selectedPayslip && months.find(m => m.value == selectedPayslip.month).label} {selectedPayslip?.year}
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedPayslip && (
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography color="text.secondary">Basic Salary</Typography><Typography>₹{parseFloat(selectedPayslip.basic_salary).toLocaleString()}</Typography></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography color="text.secondary">Allowance</Typography><Typography>+₹{parseFloat(selectedPayslip.allowance || 0).toLocaleString()}</Typography></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography color="text.secondary">Bonus</Typography><Typography>+₹{parseFloat(selectedPayslip.bonus || 0).toLocaleString()}</Typography></Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography color="text.secondary">Leave Deduction ({selectedPayslip.leave_days} Days)</Typography><Typography color="error.main">-₹{parseFloat(selectedPayslip.deduction || 0).toLocaleString()}</Typography></Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}><Typography variant="h6">Net Payout</Typography><Typography variant="h6" color="success.main">₹{parseFloat(selectedPayslip.final_salary).toLocaleString()}</Typography></Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button startIcon={<DownloadIcon />} variant="contained" color="primary" onClick={() => handleDownloadPDF()}>
            Download PDF
          </Button>
          <Button fullWidth variant="outlined" onClick={() => setPayslipDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default SalaryPage;
