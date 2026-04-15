import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Box,
  Chip,
  Stack,
  useTheme
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import api from "../services/api";

const AllAttendancePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const fetchAllAttendance = async () => {
    try {
      const res = await api.get("/attendance/my?limit=10000");
      const data = res.data.data || res.data;
      setAttendanceData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    fetchAllAttendance();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = attendanceData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusChip = (workType) => {
    if (workType === "wfh") {
      return <Chip icon={<HomeIcon />} label="WFH" color="info" size="small" />;
    } else if (workType === "leave") {
      return <Chip icon={<HomeIcon />} label="Leave" color="warning" size="small" />;
    } else {
      return <Chip icon={<CheckCircleIcon />} label="Present" color="success" size="small" />;
    }
  };

  const formatDateOnly = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTimeOnly = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, mb: 3, bgcolor: "background.paper" }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/attendance")}
          >
            Back
          </Button>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Attendance History
          </Typography>
        </Stack>

        <TableContainer sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "action.hover" }}>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Time In</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Time Out</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Hours</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No attendance records found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((rec) => (
                  <TableRow key={rec.id} hover>
                    {/* Date */}
                    <TableCell>
                      {rec.time_in ? formatDateOnly(rec.time_in) : (rec.date ? formatDateOnly(rec.date) : "-")}
                    </TableCell>
                    <TableCell>{rec.name}</TableCell>
                    {/* Time In */}
                    <TableCell>
                      {rec.time_in ? formatTimeOnly(rec.time_in) : "-"}
                    </TableCell>
                    {/* Time Out */}
                    <TableCell>
                      {rec.time_out ? formatTimeOnly(rec.time_out) : "-"}
                    </TableCell>
                    <TableCell>
                      {rec.total_hours ? Number(rec.total_hours).toFixed(2) : "-"}
                    </TableCell>
                    <TableCell>{getStatusChip(rec.work_type)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50, 100]}
          component="div"
          count={attendanceData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ justifyContent: "center" }}
        />
      </Paper>
    </Container>
  );
};

export default AllAttendancePage;
