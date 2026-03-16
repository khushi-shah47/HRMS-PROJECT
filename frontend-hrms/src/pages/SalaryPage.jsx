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
  Paper,
  Stack,
  Box,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from "@mui/material";
import api from "../services/api";

const SalaryPage = ({ user }) => {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [monthlySalary, setMonthlySalary] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [leaveDays, setLeaveDays] = useState("");
  const [history, setHistory] = useState([]);
  const [report, setReport] = useState([]);

  const [showHistory, setShowHistory] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Pagination state
  const [historyPage, setHistoryPage] = useState(0);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);
  const [reportPage, setReportPage] = useState(0);
  const [reportRowsPerPage, setReportRowsPerPage] = useState(10);

  // Load employees
  useEffect(() => {
    api.get("/employees?page=1&limit=100")
      .then(res => res.data)
      .then(data => setEmployees(data.employees || data.data || []));
  }, []);

  // Load salary history
  const fetchHistory = async () => {
    if (!employeeId) return;
    try {
      const res = await api.get(`/salary/history/${employeeId}`);
      setHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate salary
  const calculateSalary = async () => {
    if (!employeeId || !month || !year || !monthlySalary || !workingDays || leaveDays === "") {
      alert("Please fill all required fields");
      return;
    }

    try {
      await api.post("/salary/calculate", {
        employee_id: employeeId,
        month,
        year,
        monthly_salary: monthlySalary,
        working_days: parseInt(workingDays),
        leave_days: parseInt(leaveDays)
      });

      alert("Salary calculated successfully!");
      setMonthlySalary("");
      setWorkingDays("");
      setLeaveDays("");
      fetchHistory();
    } catch (err) {
      console.error(err);
      alert("Error calculating salary");
    }
  };

  // Load salary report
  const fetchReport = async () => {
    if (!month || !year) return;
    try {
      const res = await api.get(`/salary/report?month=${month}&year=${year}`);
      setReport(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleShowHistory = () => {
    setShowHistory(true);
    setShowReport(false);
    fetchHistory();
  };

  const handleShowReport = () => {
    setShowHistory(false);
    setShowReport(true);
    fetchReport();
  };

  const handleChangePage = (event, newPage, type) => {
    if (type === 'history') setHistoryPage(newPage);
    else setReportPage(newPage);
  };

  const handleChangeRowsPerPage = (event, type) => {
    const value = parseInt(event.target.value, 10);
    if (type === 'history') {
      setHistoryRowsPerPage(value);
      setHistoryPage(0);
    } else {
      setReportRowsPerPage(value);
      setReportPage(0);
    }
  };

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Salary Management
      </Typography>

      {/* Salary Calculation Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Calculate Salary</Typography>

        <Stack spacing={2}>
          <FormControl fullWidth>
            <InputLabel>Employee</InputLabel>
            <Select
              value={employeeId}
              label="Employee"
              onChange={(e) => {
                setEmployeeId(e.target.value);
              }}
            >
              <MenuItem value="">
                <em>Select Employee</em>
              </MenuItem>
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>
                  {emp.name} ({emp.position})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Month</InputLabel>
            <Select
              value={month}
              label="Month"
              onChange={(e) => setMonth(e.target.value)}
            >
              <MenuItem value="">Select Month</MenuItem>
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <MenuItem key={m} value={m}>
                  {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              value={year}
              label="Year"
              onChange={(e) => setYear(e.target.value)}
            >
              <MenuItem value="">Select Year</MenuItem>
              {Array.from({length: 10}, (_, i) => new Date().getFullYear() - i).map(y => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Monthly Salary"
            value={monthlySalary}
            onChange={(e) => setMonthlySalary(e.target.value)}
            type="number"
            fullWidth
          />

          <TextField
            label="Working Days"
            value={workingDays}
            onChange={(e) => setWorkingDays(e.target.value)}
            type="number"
            fullWidth
          />

          <TextField
            label="Leave Days"
            value={leaveDays}
            onChange={(e) => setLeaveDays(e.target.value)}
            type="number"
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={calculateSalary}
            size="large"
          >
            Calculate & Save Salary
          </Button>
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleShowHistory}
          disabled={!employeeId}
        >
          View Salary History
        </Button>
        <Button
          variant="contained"
          color="info"
          onClick={handleShowReport}
          disabled={!month || !year}
        >
          View Monthly Report
        </Button>
      </Stack>

      {/* Salary History */}
      {showHistory && history.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Salary History</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Basic Salary</TableCell>
                <TableCell>Working Days</TableCell>
                <TableCell>Present Days</TableCell>
                <TableCell>Leave Days</TableCell>
                <TableCell>Per Day</TableCell>
                <TableCell>Deduction</TableCell>
                <TableCell>Final Salary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.slice(historyPage * historyRowsPerPage, historyPage * historyRowsPerPage + historyRowsPerPage).map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>{new Date(0, rec.month - 1).toLocaleString('default', { month: 'long' })}</TableCell>
                  <TableCell>{rec.year}</TableCell>
                  <TableCell>${parseFloat(rec.basic_salary).toFixed(2)}</TableCell>
                  <TableCell>{rec.working_days}</TableCell>
                  <TableCell>{rec.present_days}</TableCell>
                  <TableCell>{rec.leave_days}</TableCell>
                  <TableCell>${parseFloat(rec.per_day_salary).toFixed(2)}</TableCell>
                  <TableCell>${parseFloat(rec.deduction).toFixed(2)}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: 'green' }}>
                    ${parseFloat(rec.final_salary).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={history.length}
            rowsPerPage={historyRowsPerPage}
            page={historyPage}
            onPageChange={(e, page) => handleChangePage(e, page, 'history')}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage(e, 'history')}
          />
        </Paper>
      )}

      {/* Salary Report */}
      {showReport && report.length > 0 && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Monthly Salary Report</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Final Salary</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {report.slice(reportPage * reportRowsPerPage, reportPage * reportRowsPerPage + reportRowsPerPage).map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>{rec.name}</TableCell>
                  <TableCell>{new Date(0, rec.month - 1).toLocaleString('default', { month: 'long' })}</TableCell>
                  <TableCell>{rec.year}</TableCell>
                  <TableCell style={{ fontWeight: 'bold', color: 'green' }}>
                    ${parseFloat(rec.final_salary).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={report.length}
            rowsPerPage={reportRowsPerPage}
            page={reportPage}
            onPageChange={(e, page) => handleChangePage(e, page, 'report')}
            onRowsPerPageChange={(e) => handleChangeRowsPerPage(e, 'report')}
          />
        </Paper>
      )}
    </Container>
  );
};

export default SalaryPage;

