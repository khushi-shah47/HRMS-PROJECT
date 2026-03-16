// import React, { useEffect, useState } from "react";
// import {
//   Container,
//   Typography,
//   Button,
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableRow,
//   Paper,
//   Stack,
//   TablePagination
// } from "@mui/material";
// import api from "../services/api";

// function LeavePage({ user }) {
//   const [leaves, setLeaves] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [employeeId, setEmployeeId] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reason, setReason] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [totalCount, setTotalCount] = useState(0);
//   const [leaveBalance, setLeaveBalance] = useState(null);

//   // Load employees for dropdown
//   useEffect(() => {
//     api.get("/employees?page=1&limit=100")
//       .then(res => res.data)
//       .then(data => setEmployees(data.data || data.employees || []))
//       .catch(err => console.error(err));
//   }, []);

//   // Load leaves
//   const fetchLeaves = () => {
//     const query = new URLSearchParams({
//       page: page + 1,
//       limit: rowsPerPage
//     });

//     if (statusFilter) {
//       query.append("status", statusFilter);
//     }

//     api.get(`/leaves?${query.toString()}`)
//       .then(res => res.data)
//       .then(data => {
//         setLeaves(data.data || []);
//         setTotalCount(data.totalLeaves || 0);
//       })
//       .catch(err => console.error(err));
//   };

//   useEffect(() => {
//     fetchLeaves(page, rowsPerPage);
//   }, [page, rowsPerPage, statusFilter]);

//   // Apply Leave
//   const handleApply = async () => {
//     if (!employeeId || !startDate || !endDate) {
//       alert("Please fill required fields");
//       return;
//     }

//     const days =
//       (new Date(endDate) - new Date(startDate)) /
//         (1000 * 60 * 60 * 24) +
//       1;

//     if (leaveBalance !== null && days > leaveBalance) {
//       alert("Not enough leave balance");
//       return;
//     }

//     try {
//       await api.post("/leaves", {
//         employee_id: employeeId,
//         start_date: startDate,
//         end_date: endDate,
//         reason
//       });

//       alert("Leave applied!");
//       setEmployeeId("");
//       setStartDate("");
//       setEndDate("");
//       setReason("");
//       setPage(0);
//       fetchLeaves(0, rowsPerPage);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Update Leave Status
//   const updateStatus = async (id, newStatus) => {
//     try {
//       await api.put(`/leaves/${id}`, { status: newStatus });
//       fetchLeaves();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   return (
//     <Container sx={{ mt: 5 }}>
//       {/* Welcome message */}
//       <Typography variant="h5" sx={{ mb: 3, textAlign: "center" }}>
//         Welcome {user?.name} {user?.role}
//       </Typography>

//       {/* Apply Leave Form */}
//       <Paper sx={{ p: 3, mb: 4 }}>
//         <Typography variant="h6" sx={{ mb: 2 }}>Apply Leave</Typography>

//         <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">

//           <select
//             value={employeeId}
//             onChange={e => {
//               const id = e.target.value;
//               setEmployeeId(id);

//               const emp = employees.find(emp => emp.id == id);
//               setLeaveBalance(emp?.leave_balance ?? null);
//             }}
//             required
//           >
//             <option value="">Select Employee *</option>
//             {employees.map(emp => (
//               <option key={emp.id} value={emp.id}>
//                 {emp.name}
//               </option>
//             ))}
//           </select>

//           {leaveBalance !== null && (
//             <Typography>
//               Leave Balance: {leaveBalance} days
//             </Typography>
//           )}

//           <input
//             type="date"
//             value={startDate}
//             onChange={e => setStartDate(e.target.value)}
//             required
//           />

//           <input
//             type="date"
//             value={endDate}
//             onChange={e => setEndDate(e.target.value)}
//             required
//           />

//           <input
//             placeholder="Reason"
//             value={reason}
//             onChange={e => setReason(e.target.value)}
//             minLength="2"
//             required
//           />

//           <Button
//             variant="contained"
//             color="primary"
//             onClick={handleApply}
//           >
//             Apply
//           </Button>

//         </Stack>
//       </Paper>

//       {/* Status Filter */}
//       <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
//         <select
//           value={statusFilter}
//           onChange={e => setStatusFilter(e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="Pending">Pending</option>
//           <option value="Approved">Approved</option>
//           <option value="Rejected">Rejected</option>
//         </select>
//       </Stack>

//       {/* Leave Table */}
//       <Paper>
//         <Table>
//           <TableHead>
//             <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
//               <TableCell>ID</TableCell>
//               <TableCell>Name</TableCell>
//               <TableCell>Department</TableCell>
//               <TableCell>Start</TableCell>
//               <TableCell>End</TableCell>
//               <TableCell>Reason</TableCell>
//               <TableCell>Status</TableCell>
//               <TableCell>Action</TableCell>
//             </TableRow>
//           </TableHead>

//           <TableBody>
//             {leaves.length > 0 ? (
//               leaves.map(leave => (
//                 <TableRow key={leave.id} hover>

//                   <TableCell>{leave.id}</TableCell>
//                   <TableCell>{leave.name}</TableCell>
//                   <TableCell>{leave.department}</TableCell>
//                   <TableCell>{leave.start_date}</TableCell>
//                   <TableCell>{leave.end_date}</TableCell>
//                   <TableCell>{leave.reason}</TableCell>
//                   <TableCell>{leave.status}</TableCell>

//                   <TableCell>
// {(['Admin', 'HR', 'Manager'].includes(user?.role) && leave.status === "Pending") && (<Stack direction="row" spacing={1}><Button variant="contained" color="success" size="small" onClick={() => updateStatus(leave.id, "Approved") }>Approve</Button><Button variant="contained" color="error" size="small" onClick={() => updateStatus(leave.id, "Rejected")}>Reject</Button></Stack>)}
//                   </TableCell>

//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={8} align="center">
//                   No leave records
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>

//         </Table>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, 50]}
//           component="div"
//           count={totalCount}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />

//       </Paper>
//     </Container>
//   );
// }

// export default LeavePage;

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
import api from "../services/api";

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
    api.get("/employees?page=1&limit=100")
      .then(res => res.data)
      .then(data => setEmployees(data.data || data.employees || []))
      .catch(err => console.error(err));
  }, []);

  // Load leaves
  const fetchLeaves = () => {
    const query = new URLSearchParams({
      page: page + 1,
      limit: rowsPerPage
    });

    if (statusFilter) {
      query.append("status", statusFilter);
    }

    api.get(`/leaves?${query.toString()}`)
      .then(res => res.data)
      .then(data => {
        setLeaves(data.data || []);
        setTotalCount(data.totalLeaves || 0);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLeaves(page, rowsPerPage);
  }, [page, rowsPerPage, statusFilter]);

  // Apply Leave
  const handleApply = async () => {
    if (!employeeId || !startDate || !endDate) {
      alert("Please fill required fields");
      return;
    }

    const days =
      (new Date(endDate) - new Date(startDate)) /
        (1000 * 60 * 60 * 24) +
      1;

    if (leaveBalance !== null && days > leaveBalance) {
      alert("Not enough leave balance");
      return;
    }

    try {
      await api.post("/leaves", {
        employee_id: employeeId,
        start_date: startDate,
        end_date: endDate,
        reason
      });

      alert("Leave applied!");
      setEmployeeId("");
      setStartDate("");
      setEndDate("");
      setReason("");
      setPage(0);
      fetchLeaves(0, rowsPerPage);
    } catch (err) {
      console.error(err);
    }
  };

  // Update Leave Status
  const updateStatus = async (id, newStatus) => {
    try {
      await api.put(`/leaves/${id}`, { status: newStatus });
      fetchLeaves();
    } catch (err) {
      console.error(err);
    }
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
              setLeaveBalance(emp?.leave_balance ?? null);
            }}
            required
          >
            <option value="">Select Employee *</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>

          {leaveBalance !== null && (
            <Typography>
              Leave Balance: {leaveBalance} days
            </Typography>
          )}

          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />

          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />

          <input
            placeholder="Reason"
            value={reason}
            onChange={e => setReason(e.target.value)}
            minLength="2"
            required
          />

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
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
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
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
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
                    {['Admin', 'HR', 'Manager'].includes(user?.role) ? (
                      leave.status === "Pending" ? (
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
                      ) : (
                        leave.status
                      )
                    ) : (
                      <Typography>{leave.status}</Typography>
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