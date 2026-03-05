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
  MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  
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

  const fetchEmployees = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");
      const data = await res.json();
      const formatted = data.map(emp => ({
        ...emp,
        join_date: emp.join_date ? emp.join_date.split('T')[0] : ''
      }));
      setEmployees(formatted);
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Failed to load employees");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/departments/all");
      if (!res.ok) throw new Error("Failed to fetch departments");
      setDepartments(await res.json());
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
      const res = await fetch("http://localhost:5000/api/employees/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, position, department_id: departmentId || null, join_date: joinDate })
      });

      if (!res.ok) throw new Error("Failed to add employee");

      setName("");
      setEmail("");
      setPhone("");
      setPosition("");
      setDepartmentId("");
      setJoinDate("");
      setSuccessMsg("Employee added successfully");
      setErrorMsg("");
      fetchEmployees();
    } catch (error) {
      setErrorMsg("Failed to add employee");
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
      const res = await fetch(`http://localhost:5000/api/employees/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          email: editEmail,
          phone: editPhone,
          position: editPosition,
          department_id: editDepartmentId || null,
          join_date: editJoinDate
        })
      });

      if (!res.ok) throw new Error("Failed to update employee");

      setEditOpen(false);
      setSuccessMsg("Employee updated successfully");
      setErrorMsg("");
      fetchEmployees();
    } catch (error) {
      setErrorMsg("Failed to update employee");
      setSuccessMsg("");
    }
  };

  const deleteEmployee = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/employees/delete/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete employee");

      setSuccessMsg("Employee deleted successfully");
      setErrorMsg("");
      fetchEmployees();
    } catch (error) {
      setErrorMsg("Failed to delete employee");
      setSuccessMsg("");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

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
          />
          <TextField
            label="Email *"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />
          <TextField
            label="Position *"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Department"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
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
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Employee</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name *" value={editName} onChange={(e) => setEditName(e.target.value)} fullWidth />
            <TextField label="Email *" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} fullWidth />
            <TextField label="Phone" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} fullWidth />
            <TextField label="Position *" value={editPosition} onChange={(e) => setEditPosition(e.target.value)} fullWidth />
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