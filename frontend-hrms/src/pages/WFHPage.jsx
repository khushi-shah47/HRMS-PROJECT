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
  Alert
} from "@mui/material";
import api from "../services/api";

const WFHPage = ({ employeeId }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchHistory = async () => {
    try {
      const res = await api.get("/wfh/all");
      setHistory(res.data);
    } catch (error) {
      console.error("Error fetching WFH data:", error);
      setMessage({ type: "error", text: "Failed to load WFH requests" });
    }
  };

  const applyWFH = async () => {
    if (!startDate || !endDate) {
      setMessage({ type: "error", text: "Please select start and end dates" });
      return;
    }
    
    try {
      const res = await api.post("/wfh/apply", {
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        reason: reason
      });
      
      setStartDate("");
      setEndDate("");
      setReason("");
      setMessage({ type: "success", text: "WFH request submitted successfully" });
      fetchHistory();
    } catch (error) {
      console.error("Error applying WFH:", error);
      setMessage({ type: "error", text: "Failed to submit WFH request: " + error.response?.data?.message });
    }
  };

  const handleApprove = async (id) => {
    try {
      await api.post("/wfh/approve", { id });
      setMessage({ type: "success", text: "WFH request approved" });
      fetchHistory();
    } catch (error) {
      console.error("Error approving WFH:", error);
      setMessage({ type: "error", text: "Failed to approve WFH request" });
    }
  };

  const handleReject = async (id) => {
    try {
      await api.post("/wfh/reject", { id });
      setMessage({ type: "success", text: "WFH request rejected" });
      fetchHistory();
    } catch (error) {
      console.error("Error rejecting WFH:", error);
      setMessage({ type: "error", text: "Failed to reject WFH request" });
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status) => {
    if (status === "approved") {
      return <Chip label="Approved" color="success" size="small" />;
    } else if (status === "rejected") {
      return <Chip label="Rejected" color="error" size="small" />;
    } else {
      return <Chip label="Pending" color="warning" size="small" />;
    }
  };

  const paginatedHistory = history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  // Helper to display date range
  const displayDateRange = (rec) => {
    if (rec.start_date && rec.end_date) {
      return `${rec.start_date} to ${rec.end_date}`;
    }
    return rec.wfh_date || rec.start_date || "-";
  };

  return (
    <Container sx={{ mt: 3 }}>
      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: "", text: "" })}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Apply Work From Home
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            type="date"
            label="Start Date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            type="date"
            label="End Date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>

        <TextField
          label="Reason"
          multiline
          rows={2}
          fullWidth
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mt: 2 }}
          placeholder="Enter reason for WFH"
        />

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, display: 'flex', justifyContent: 'center', width: '100%' }}
          onClick={applyWFH}
        >
          Apply WFH
        </Button>
      </Paper>

      <Paper>
        <Typography sx={{ p: 2 }} variant="h6">
          WFH Requests
        </Typography>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Date Range</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Reason</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No WFH requests found
                </TableCell>
              </TableRow>
            ) : (
              paginatedHistory.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>{rec.name}</TableCell>
                  <TableCell>{displayDateRange(rec)}</TableCell>
                  <TableCell>{rec.reason || "-"}</TableCell>
                  <TableCell>
                    {getStatusChip(rec.status)}
                  </TableCell>
                  <TableCell>
                    {rec.status === "pending" && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApprove(rec.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleReject(rec.id)}
                        >
                          Reject
                        </Button>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={history.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default WFHPage;
