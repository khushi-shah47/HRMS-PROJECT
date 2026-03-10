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
  TablePagination
} from "@mui/material";

function LeavePage({ user }) {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [leaveBalance, setLeaveBalance] = useState(null);

  // Load employees for dropdown
  useEffect(() => {
    fetch("/api/employees?page=1&limit=100")
      .then(res => res.json())
      .then(data => setEmployees(data.data || data.employees || []))
      .catch(err => console.error(err));
  }, []);

  // Load leaves
  const fetchLeaves = () => {
    const query = new URLSearchParams({
      page: page + 1,
      limit: rowsPerPage,
      status: statusFilter
    });

    fetch(`/api/leaves?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        setLeaves(data.data || []);
        setTotalCount(data.total || 0);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, rowsPerPage, statusFilter]);

  // Apply Leave
  const handleApply = async () => {
    if (!employeeId || !startDate || !endDate) {
      alert("Please fill required fields");
      return;
    }
    const days = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24) + 1;
    if (days > leaveBalance) {
      alert("Not enough leave balance");
      return;
    }
    await fetch("/api/leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        reason
      })
    });

    alert("Leave applied!");
    setEmployeeId("");
    setStartDate("");
    setEndDate("");
    setReason("");
    setPage(0);
    fetchLeaves();
  };

  // Update Leave Status
  const updateStatus = async (id, newStatus) => {
    await fetch(`/api/leaves/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    fetchLeaves();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container sx={{ mt: 5 }}>
      {/* Welcome message */}
      <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
        Welcome {user?.name} {user?.role}
      </Typography>

      {/* Apply Leave Form */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Apply Leave</Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
          <select 
            value={employeeId} 
            onChange={e => {
                const id = e.target.value;
                setEmployeeId(id);
                const emp = employees.find(emp => emp.id == id);
                setLeaveBalance(emp?.leave_balance || 0);
            }}>
            <option value="">Select Employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name}</option>
            ))}
          </select>
          {leaveBalance !== null && (
            <Typography sx={{ mb: 1 }}>
              Leave Balance: {leaveBalance} days
            </Typography>
          )}

          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <input placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} />

          <Button
            variant="contained"
            color="primary"
            onClick={handleApply}
          >
            Apply
          </Button>
        </Stack>
      </Paper>

      {/* Status Filter */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </Stack>

      {/* Leave Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Start</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>End</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaves.length > 0 ? (
              leaves.map(leave => (
                <TableRow key={leave.id} hover>
                  <TableCell>{leave.id}</TableCell>
                  <TableCell>{leave.name}</TableCell>
                  <TableCell>{leave.department}</TableCell>
                  <TableCell>{leave.start_date}</TableCell>
                  <TableCell>{leave.end_date}</TableCell>
                  <TableCell>{leave.reason}</TableCell>
                  <TableCell>{leave.status}</TableCell>
                  <TableCell>
                    {leave.status === "Pending" && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => updateStatus(leave.id, "Approved")}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => updateStatus(leave.id, "Rejected")}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No leave records
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
}

export default LeavePage;

