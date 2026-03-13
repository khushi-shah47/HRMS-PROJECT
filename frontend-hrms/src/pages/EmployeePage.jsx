import React, { useEffect, useState } from "react";
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
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TablePagination
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import api from "../services/api"
const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Predefined departments
  const departmentOptions = [
    { id: 1, name: "HR" },
    { id: 2, name: "Software Developer" },
    { id: 3, name: "DevOps" },
    { id: 4, name: "QA" }
  ];

  // Predefined positions
  const positionOptions = [
    "Junior Developer",
    "Senior Developer",
    "Intern",
    "Project Manager"
  ];
  
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [joinDate, setJoinDate] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState("");
  const [editJoinDate, setEditJoinDate] = useState("");

  const fetchEmployees = async (currentPage = page + 1, limit = rowsPerPage) => {
    try {
      console.log('Fetching employees page:', currentPage, 'limit:', limit);
      const res = await api.get(`/employees?page=${currentPage}&limit=${limit}`);
      const data = res.data;
      console.log('Employees response:', data);
      setEmployees(data.employees || []);
      setTotalCount(data.pagination?.totalEmployees || data.totalCount || 0);
    } catch (error) {
      console.error("Employee API Error:", error.response?.data || error.message);
      setErrorMsg("Failed to load employees: " + (error.response?.data?.message || error.message));
      setEmployees([]);
      setTotalCount(0);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments/all");
      setDepartments(res.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const addEmployee = async () => {
    if (!name || !email || !position) {
      setErrorMsg("Please fill in required fields");
      return;
    }

    try {
      console.log('Adding employee:', { name, email, phone, position, department_id: departmentId || null, join_date: joinDate });
      const res = await api.post("/employees/add", { name, email, phone, position, department_id: departmentId || null, join_date: joinDate });
      console.log('Add employee response:', res.data);

      setName("");
      setEmail("");
      setPhone("");
      setPosition("");
      setDepartmentId("");
      setJoinDate("");
      setSuccessMsg("Employee added successfully");
      setErrorMsg("");
      setPage(0);
      fetchEmployees();
    } catch (error) {
      console.error('Add employee error:', error.response?.data || error.message);
      setErrorMsg("Failed to add employee: " + (error.response?.data?.message || error.message));
      setSuccessMsg("");
    }
  };

  const handleEditClick = (emp) => {
    setEditId(emp.id);
    setEditName(emp.name);
    setEditEmail(emp.email);
    setEditPhone(emp.phone || "");
    setEditPosition(emp.position);
    setEditDepartmentId(emp.department_id || "");
    setEditJoinDate(emp.join_date);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editName || !editEmail || !editPosition) {
      setErrorMsg("Please fill in required fields");
      return;
    }

    try {
      const res = await api.put(`/employees/update/${editId}`, {
          name: editName,
          email: editEmail,
          phone: editPhone,
          position: editPosition,
          department_id: editDepartmentId || null,
          join_date: editJoinDate
      });

      const data = res.data;
      setEditOpen(false);
      setSuccessMsg("Employee updated successfully");
      setErrorMsg("");
      setPage(0);
      fetchEmployees();
    } catch (error) {
      setErrorMsg("Failed to update employee");
      setSuccessMsg("");
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await api.delete(`/employees/delete/${id}`);

      setSuccessMsg("Employee deleted successfully");
      setErrorMsg("");
      setPage(0);
      fetchEmployees();
    } catch (error) {
      setErrorMsg("Failed to delete employee");
      setSuccessMsg("");
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, [page, rowsPerPage]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#1E3A8A" }}>
        Employee Management
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Employee</Typography>
        <Stack spacing={2}>
          <TextField
            label="Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            inputProps={{ pattern: "[A-Za-z\\s]+" }}
            required
          />
          <TextField
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Position *"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            fullWidth
            required
          >
            <MenuItem value="">Select Position</MenuItem>
            {positionOptions.map((pos) => (
              <MenuItem key={pos} value={pos}>{pos}</MenuItem>
            ))}
          </TextField>
          <TextField
                     select
                     label="Department"
                     value={departmentId}
                     onChange={(e) => setDepartmentId(e.target.value)}
                     fullWidth
                   >
                     <MenuItem value="">Select department</MenuItem>
                     <MenuItem value="hr">HR</MenuItem>
                     <MenuItem value="software developer">Software Developer</MenuItem>
                     <MenuItem value="devops">DevOps</MenuItem>
                     <MenuItem value="qa">QA</MenuItem>
                     {departments.map((dept) => (
                       <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                     ))}
                   </TextField>
          <TextField
            type="date"
            label="Join Date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button variant="contained" onClick={addEmployee} startIcon={<AddIcon />}>
            Add Employee
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">No employees found</TableCell>
              </TableRow>
            ) : (
              employees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.position}</TableCell>
                  <TableCell>{emp.department_name || "Not Assigned"}</TableCell>
                  <TableCell>{emp.join_date}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(emp)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteEmployee(emp.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
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

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name *" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth inputProps={{ pattern: "[A-Za-z\\s]+" }} required />
            <TextField label="Email *" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} fullWidth required />
            <TextField label="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} fullWidth />
            <TextField
              select
              label="Position *"
              value={editPosition}
              onChange={(e) => setEditPosition(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Select Position</MenuItem>
              {positionOptions.map((pos) => (
                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Department"
              value={editDepartmentId}
              onChange={(e) => setEditDepartmentId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Join Date"
              value={editJoinDate}
              onChange={(e) => setEditJoinDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EmployeePage;