import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HomeIcon from "@mui/icons-material/Home";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../services/api";

const AllAttendancePage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user?.employee_id || user?.id;

  const [attendanceData, setAttendanceData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchAllAttendance = async () => {
    try {
      const res = await api.get(`/attendance/history/${employeeId}`);
      setAttendanceData(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = attendanceData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusChip = (workType) => {
    if (workType === "wfh") return <Chip icon={<HomeIcon />} label="WFH" color="info" size="small" />;
    return <Chip icon={<CheckCircleIcon />} label="Present" color="success" size="small" />;
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/attendance")}
          >
            Back
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            All Attendance
          </Typography>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time In</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Time Out</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Hours</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  No attendance records found
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((rec) => (
                <TableRow key={rec.id} hover>
                  <TableCell>{rec.date}</TableCell>
                  <TableCell>{rec.time_in ? new Date(rec.time_in).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>{rec.time_out ? new Date(rec.time_out).toLocaleTimeString() : "-"}</TableCell>
                  <TableCell>{rec.total_hours ? rec.total_hours.toFixed(2) : "-"}</TableCell>
                  <TableCell>{getStatusChip(rec.work_type)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={attendanceData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ display: "flex", justifyContent: "center" }}
        />
      </Paper>
    </Container>
  );
};

export default AllAttendancePage;