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

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users/all");
      if (!res.ok) throw new Error("Failed to fetch users");
      setUsers(await res.json());
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Failed to load users");
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

  const addUser = async () => {
    if (!username || !email || !password || !role) {
      setErrorMsg("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          username, 
          email, 
          password, 
          role, 
          department_id: departmentId || null 
        })
      });

      if (!res.ok) throw new Error("Failed to add user");

      setUsername("");
      setEmail("");
      setPassword("");
      setRole("");
      setDepartmentId("");
      setSuccessMsg("User added successfully");
      setErrorMsg("");
      fetchUsers();
    } catch (error) {
      setErrorMsg("Failed to add user");
      setSuccessMsg("");
    }
  };

  const handleEditClick = (user) => {
    setEditId(user.id);
    setEditUsername(user.username);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditDepartmentId(user.department_id || "");
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editUsername || !editEmail || !editRole) {
      setErrorMsg("Please fill in required fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
          role: editRole,
          department_id: editDepartmentId || null
        })
      });

      if (!res.ok) throw new Error("Failed to update user");

      setEditOpen(false);
      setSuccessMsg("User updated successfully");
      setErrorMsg("");
      fetchUsers();
    } catch (error) {
      setErrorMsg("Failed to update user");
      setSuccessMsg("");
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/users/delete/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setSuccessMsg("User deleted successfully");
      setErrorMsg("");
      fetchUsers();
    } catch (error) {
      setErrorMsg("Failed to delete user");
      setSuccessMsg("");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#1E3A8A" }}>
        User Management
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
        <Typography variant="h6" sx={{ mb: 2 }}>Add New User</Typography>
        <Stack spacing={2}>
          <TextField
            label="Username *"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
            label="Password *"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <TextField
            select
            label="Role *"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="">Select Role</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="employee">Employee</MenuItem>
          </TextField>
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
          <Button variant="contained" onClick={addUser} startIcon={<AddIcon />}>
            Add User
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">No users found</TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.id}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        display: "inline-block",
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: user.role === "admin" ? "#dc2626" : user.role === "manager" ? "#2563eb" : "#16a34a",
                        color: "white",
                        textTransform: "capitalize"
                      }}
                    >
                      {user.role}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.department_name || "Not Assigned"}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(user)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteUser(user.id)} size="small">
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
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Username *" value={editUsername} onChange={(e) => setEditUsername(e.target.value)} fullWidth />
            <TextField label="Email *" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} fullWidth />
            <TextField
              select
              label="Role *"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              fullWidth
            >
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="employee">Employee</MenuItem>
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

export default UserPage;