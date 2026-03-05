// import { useEffect, useState } from "react";

// function LeavePage() {
//   const [leaves, setLeaves] = useState([]);
//   const [employees, setEmployees] = useState([]);
//   const [employeeId, setEmployeeId] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [reason, setReason] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const perPage = 5;

//   // Load employees for dropdown
//   useEffect(() => {
//     fetch("/api/employees?page=1&limit=100")
//       .then(res => res.json())
//       .then(data => setEmployees(data.data))
//       .catch(err => console.error(err));
//   }, []);

//   // Load leaves
// const fetchLeaves = () => {
//   const query = new URLSearchParams({
//     page,
//     limit: perPage,
//     status: statusFilter
//   });

//   fetch(`/api/leaves?${query.toString()}`)
//     .then(res => res.json())
//     .then(data => {
//       setLeaves(data.data);
//       setTotalPages(data.totalPages);
//     })
//     .catch(err => console.error(err));
// };

// useEffect(() => {
//       fetchLeaves();
// }, [page, statusFilter]);

//   // Apply Leave
//   const handleApply = async () => {
//     if (!employeeId || !startDate || !endDate) {
//       alert("Please fill required fields");
//       return;
//     }

//     await fetch("/api/leaves", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         employee_id: employeeId,
//         start_date: startDate,
//         end_date: endDate,
//         reason
//       })
//     });

//     alert("Leave applied!");
//     setEmployeeId("");
//     setStartDate("");
//     setEndDate("");
//     setReason("");
//     setPage(1);
//   };

//   // Update Leave Status
//   const updateStatus = async (id, newStatus) => {
//     await fetch(`/api/leaves/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ status: newStatus })
//     });

//     fetchleaves();
//   };

//   return (
//     <div>
//       <h2>Leave Management</h2>

//       {/* Apply Leave Form */}
//       <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
//         <h4>Apply Leave</h4>

//         <select
//           value={employeeId}
//           onChange={e => setEmployeeId(e.target.value)}
//         >
//           <option value="">Select Employee</option>
//           {employees.map(emp => (
//             <option key={emp.id} value={emp.id}>
//               {emp.name}
//             </option>
//           ))}
//         </select>

//         <input
//           type="date"
//           value={startDate}
//           onChange={e => setStartDate(e.target.value)}
//         />

//         <input
//           type="date"
//           value={endDate}
//           onChange={e => setEndDate(e.target.value)}
//         />

//         <input
//           placeholder="Reason"
//           value={reason}
//           onChange={e => setReason(e.target.value)}
//         />

//         <button onClick={handleApply}>Apply</button>
//       </div>

//       {/* Status Filter */}
//       <div style={{ marginBottom: "10px" }}>
//         <select
//           value={statusFilter}
//           onChange={e => setStatusFilter(e.target.value)}
//         >
//           <option value="">All Status</option>
//           <option value="Pending">Pending</option>
//           <option value="Approved">Approved</option>
//           <option value="Rejected">Rejected</option>
//         </select>
//       </div>

//       {/* Leave Table */}
//       <table border="1" width="100%">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Department</th>
//             <th>Start</th>
//             <th>End</th>
//             <th>Reason</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {leaves.length > 0 ? (
//             leaves.map(leave => (
//               <tr key={leave.id}>
//                 <td>{leave.id}</td>
//                 <td>{leave.name}</td>
//                 <td>{leave.department}</td>
//                 <td>{leave.start_date}</td>
//                 <td>{leave.end_date}</td>
//                 <td>{leave.reason}</td>
//                 <td>{leave.status}</td>
//                 <td>
//                   {leave.status === "Pending" && (
//                     <>
//                       <button onClick={() => updateStatus(leave.id, "Approved")}>
//                         Approve
//                       </button>
//                       <button onClick={() => updateStatus(leave.id, "Rejected")}>
//                         Reject
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="8" style={{ textAlign: "center" }}>
//                 No leave records
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Pagination */}
//       <div style={{ marginTop: "10px" }}>
//         <button disabled={page === 1} onClick={() => setPage(page - 1)}>
//           Previous
//         </button>
//         <span style={{ margin: "0 10px" }}>
//           Page {page} of {totalPages}
//         </span>
//         <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
//           Next
//         </button>
//       </div>
//     </div>
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
} from "@mui/material";

function LeavePage({ user }) {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [leaveBalance,setLeaveBalance] = useState(null);

  const perPage = 5;

  // Load employees for dropdown
  useEffect(() => {
    fetch("/api/employees?page=1&limit=100")
      .then(res => res.json())
      .then(data => setEmployees(data.data))
      .catch(err => console.error(err));
  }, []);

  // Load leaves
  const fetchLeaves = () => {
    const query = new URLSearchParams({
      page,
      limit: perPage,
      status: statusFilter
    });

    fetch(`/api/leaves?${query.toString()}`)
      .then(res => res.json())
      .then(data => {
        setLeaves(data.data);
        setTotalPages(data.totalPages);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchLeaves();
  }, [page, statusFilter]);

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
    setPage(1);
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
            <TableRow>
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
                <TableRow key={leave.id}>
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
      </Paper>

      {/* Pagination */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </Button>
        <Typography sx={{ mt: 1 }}>
          Page {page} of {totalPages}
        </Typography>
        <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </Button>
      </Stack>
    </Container>
  );
}

export default LeavePage;