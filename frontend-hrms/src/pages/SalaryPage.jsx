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
  TablePagination
} from "@mui/material";

const SalaryPage = ({ employeeId }) => {
  const [basicSalary, setBasicSalary] = useState("");
  const [workingDays, setWorkingDays] = useState("");
  const [presentDays, setPresentDays] = useState("");
  const [leaveDays, setLeaveDays] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [history, setHistory] = useState([]);
  const [report, setReport] = useState([]);

  const [showHistory, setShowHistory] = useState(false);
  const [showReport, setShowReport] = useState(false);

  // Pagination state for history
  const [historyPage, setHistoryPage] = useState(0);
  const [historyRowsPerPage, setHistoryRowsPerPage] = useState(10);

  // Pagination state for report
  const [reportPage, setReportPage] = useState(0);
  const [reportRowsPerPage, setReportRowsPerPage] = useState(10);

  const fetchHistory = async () => {
    const res = await fetch(`http://localhost:5000/api/salary/history/${employeeId}`);
    setHistory(await res.json());
  };

  const calculateSalary = async () => {
    await fetch("http://localhost:5000/api/salary/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: employeeId,
        month,
        year,
        basic_salary: Number(basicSalary),
        working_days: Number(workingDays),
        present_days: Number(presentDays),
        leave_days: Number(leaveDays)
      })
    });
    fetchHistory();
  };

  const fetchReport = async () => {
    const query = new URLSearchParams({ month, year }).toString();
    const res = await fetch(`http://localhost:5000/api/salary/report?${query}`);
    setReport(await res.json());
  };

  useEffect(() => { fetchHistory(); }, []);

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

  return (
    <Container 
      sx={{ 
        mt: 5, 
        background: "#ffffff", 
        padding: 3,
        minHeight: "100vh"
      }}
    >
      <Typography 
        variant="h5" 
        sx={{ mb: 3, color: "#1E3A8A", textAlign: "center" }}
      >
        Welcome to HRMS Application
      </Typography>
      <Typography 
        variant="h5" 
        sx={{ mb: 3, color: "#1E3A8A", textAlign: "center" }}
      >
        Salary Calculation
      </Typography>

      <Stack spacing={2} sx={{ mb: 3 }}>
        <TextField 
          label="Month" 
          value={month} 
          onChange={e => setMonth(e.target.value)}
          sx={{ backgroundColor: "#ffffff" }}
        />
        <TextField 
          label="Year" 
          value={year} 
          onChange={e => setYear(e.target.value)}
          sx={{ backgroundColor: "#ffffff" }}
        />
        <TextField 
          label="Basic Salary" 
          value={basicSalary} 
          onChange={e => setBasicSalary(e.target.value)}
          sx={{ backgroundColor: "#ffffff" }}
        />
        <TextField 
          label="Working Days" 
          value={workingDays} 
          onChange={e => setWorkingDays(e.target.value)}
          sx={{ backgroundColor: "#ffffff" }}
        />
        <TextField 
          label="Present Days" 
          value={presentDays} 
          onChange={e => setPresentDays(e.target.value)}
          sx={{ backgroundColor: "#ffffff" }}
        />
        <TextField 
          label="Leave Days" 
          value={leaveDays} 
          onChange={e => setLeaveDays(e.target.value)}
          sx={{ backgroundColor: "#ffffff" }}
        />

        <Button 
          variant="contained" 
          sx={{ background: "#3B82F6" }} 
          onClick={calculateSalary}
        >
          Calculate Salary
        </Button>

        <Button 
          variant="contained" 
          sx={{ background: "#10B981" }} 
          onClick={handleShowHistory}
        >
          Salary History
        </Button>

        <Button 
          variant="contained" 
          sx={{ background: "#8B5CF6" }} 
          onClick={handleShowReport}
        >
          Generate Monthly Report
        </Button>
      </Stack>

      {showHistory && (
        <Box>
          <Typography 
            variant="h6" 
            sx={{ color: "#1E3A8A", mb: 1 }}
          >
            Salary History
          </Typography>
          <Paper sx={{ borderTop: "4px solid #60A5FA", backgroundColor: "#ffffff" }}>
            <Table>
              <TableHead sx={{ background: "#E0ECFF" }}>
                <TableRow>
                  <TableCell>Month</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Basic Salary</TableCell>
                  <TableCell>Working Days</TableCell>
                  <TableCell>Present Days</TableCell>
                  <TableCell>Leave Days</TableCell>
                  <TableCell>Per Day Salary</TableCell>
                  <TableCell>Deduction</TableCell>
                  <TableCell>Final Salary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.slice(historyPage * historyRowsPerPage, historyPage * historyRowsPerPage + historyRowsPerPage).map(rec => (
                  <TableRow key={rec.id}>
                    <TableCell>{rec.month}</TableCell>
                    <TableCell>{rec.year}</TableCell>
                    <TableCell>{rec.basic_salary}</TableCell>
                    <TableCell>{rec.working_days}</TableCell>
                    <TableCell>{rec.present_days}</TableCell>
                    <TableCell>{rec.leave_days}</TableCell>
                    <TableCell>{rec.per_day_salary}</TableCell>
                    <TableCell>{rec.deduction}</TableCell>
                    <TableCell style={{ color: "#16A34A", fontWeight: "bold" }}>{rec.final_salary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={history.length}
              rowsPerPage={historyRowsPerPage}
              page={historyPage}
              onPageChange={(event, newPage) => setHistoryPage(newPage)}
              onRowsPerPageChange={(event) => {
                setHistoryRowsPerPage(parseInt(event.target.value, 10));
                setHistoryPage(0);
              }}
            />
          </Paper>
        </Box>
      )}

      {showReport && (
        <Box>
          <Typography 
            variant="h6" 
            sx={{ color: "#1E3A8A", mb: 1 }}
          >
            Monthly Salary Report
          </Typography>
          <Paper sx={{ borderTop: "4px solid #60A5FA", backgroundColor: "#ffffff" }}>
            <Table>
              <TableHead sx={{ background: "#E0ECFF" }}>
                <TableRow>
                  <TableCell>Employee</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Month</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Final Salary</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.slice(reportPage * reportRowsPerPage, reportPage * reportRowsPerPage + reportRowsPerPage).map(rec => (
                  <TableRow key={rec.id}>
                    <TableCell>{rec.name}</TableCell>
                    <TableCell>{rec.department}</TableCell>
                    <TableCell>{rec.month}</TableCell>
                    <TableCell>{rec.year}</TableCell>
                    <TableCell style={{ color: "#16A34A", fontWeight: "bold" }}>{rec.final_salary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={report.length}
              rowsPerPage={reportRowsPerPage}
              page={reportPage}
              onPageChange={(event, newPage) => setReportPage(newPage)}
              onRowsPerPageChange={(event) => {
                setReportRowsPerPage(parseInt(event.target.value, 10));
                setReportPage(0);
              }}
            />
          </Paper>
        </Box>
      )}

    </Container>
  );
};

export default SalaryPage;