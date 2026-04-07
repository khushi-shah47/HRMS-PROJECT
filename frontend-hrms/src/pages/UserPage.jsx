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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  InputAdornment,
  TablePagination,
  useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import BadgeIcon from "@mui/icons-material/Badge";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const UserPage = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [users, setUsers] = useState([]);
  const [usersError, setUsersError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteUsername, setDeleteUsername] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const roleOptions = [
    { value: "admin", label: "Admin", color: "error.main", icon: <AdminPanelSettingsIcon fontSize="small" /> },
    { value: "manager", label: "Manager", color: "primary.main", icon: <SupervisorAccountIcon fontSize="small" /> },
    { value: "hr", label: "HR", color: "secondary.main", icon: <BadgeIcon fontSize="small" /> },
    { value: "developer", label: "Developer", color: "success.main", icon: <PersonIcon fontSize="small" /> },
    { value: "intern", label: "Intern", color: "warning.main", icon: <SchoolIcon fontSize="small" /> }
  ];

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchUsers = async () => {
// Backend middleware handles admin auth - always fetch

    setLoading(true);
    setUsersError(null);
    try {
      const res = await api.get("/users/all");
      setUsers(res.data || []);
    } catch (error) {
      console.error("Users fetch error:", error);
      setUsersError(error.response?.data?.message || "Failed to load users");
      showSnackbar("Failed to load users - Admin access required?", "error");
      setUsers([]);
    } finally {
      setLoading(false);
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

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const resetAddForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("");
    setDepartmentId("");
  };

  const handleAddOpen = () => {
    resetAddForm();
    setAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    resetAddForm();
  };

  const addUser = async () => {
    if (!username || !email || !password || !role) {
      showSnackbar("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/users/add", { 
        username, 
        email, 
        password, 
        role, 
        department_id: departmentId || null 
      });

      handleAddClose();
      showSnackbar("User added successfully");
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to add user", "error");
    } finally {
      setLoading(false);
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

  const handleEditClose = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const handleEditSave = async () => {
    if (!editUsername || !editEmail) {
      showSnackbar("Please fill in required fields", "error");
      return;
    }
    if (!editUsername.trim()) {
      showSnackbar("Username is required", "error");
      return;
    }

    if (editUsername.length < 3) {
      showSnackbar("Username must be at least 3 characters", "error");
      return;
    }

    if (!editEmail.trim()) {
      showSnackbar("Email is required", "error");
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(editEmail)) {
      showSnackbar("Invalid email format", "error");
      return;
    }

    // password optional but validate if entered
    if (editPassword && editPassword.length < 6) {
      showSnackbar("Password must be at least 6 characters", "error");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        username: editUsername,
        email: editEmail
      };

      // only include password if entered
      if (editPassword && editPassword.trim() !== "") {
        payload.password = editPassword;
      }

      await api.put(`/users/update/${editId}`, payload);

      handleEditClose();
      setEditPassword(""); // clear after save
      showSnackbar("User updated successfully");
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to update user", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (user) => {
    setDeleteId(user.id);
    setDeleteUsername(user.username);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteUsername("");
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/users/delete/${deleteId}`);
      handleDeleteClose();
      showSnackbar("User deleted successfully");
      fetchUsers();
    } catch (error) {
      showSnackbar("Failed to delete user", "error");
    } finally {
      setLoading(false);
    }
  };

  const getRoleChip = (roleValue) => {
    const roleConfig = roleOptions.find(r => r.value === roleValue);
    return (
      <Chip 
        label={roleConfig?.label || roleValue} 
        size="small"
        icon={roleConfig?.icon}
        sx={{ 
          bgcolor: roleConfig?.color || "grey.500",
          color: "white",
          "& .MuiChip-icon": { color: "white" }
        }}
      />
    );
  };

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ 
        p: 3, 
        mb: 3, 
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`, 
        color: "white" 
      }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PersonIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                User Management
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Manage system users and roles
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddOpen}
              sx={{ bgcolor: "background.paper", color: "error.main", "&:hover": { bgcolor: "action.hover" } }}
            >
              Add User
            </Button> */}
            {/* <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddOpen}
              sx={(theme) => ({
                  bgcolor: "background.paper",
                  color: "primary.main",

                  "&:hover": {
                    bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#121212",
                  },

                  "&:active": {
                    bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#121212",
                  },
                })}
            >
              Add User
            </Button> */}
            <Tooltip title="Refresh">
              <IconButton onClick={fetchUsers} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "background.paper" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Chip 
            label={`${filteredUsers.length} users`} 
            color="error" 
            variant="outlined" 
          />
        </Stack>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ overflow: "hidden", bgcolor: "background.paper" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress color="error" />
          </Box>
        )}

        {usersError ? (
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Alert severity="error" sx={{ maxWidth: 600, mx: "auto" }}>
                {usersError}
              </Alert>
            </Box>
          ) : null}
          <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>

              <TableCell sx={{ fontWeight: "bold" }}>Username</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id} hover>

                    <TableCell sx={{ fontWeight: 500 }}>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleChip(user.role)}</TableCell>
                    <TableCell>{user.department_name || "Not Assigned"}</TableCell>
                    <TableCell align="center">
                    {user?.role === "admin" ? (
                          <>
                            <Tooltip title="Edit">
                              <IconButton color="primary" onClick={() => handleEditClick(user)} size="small">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton color="error" onClick={() => handleDeleteClick(user)} size="small">
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title="Admin only">
                            <IconButton disabled size="small">
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        )}
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add User Dialog */}
      {/* <Dialog open={addDialogOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon />
            Add New User
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Select Role</MenuItem>
              {roleOptions.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {r.icon}
                    {r.label}
                  </Box>
                </MenuItem>
              ))}
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
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleAddClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={addUser}
            disabled={loading}
            color="error"
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog> */}

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon />
            Edit User
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField 
              label="Username" 
              value={editUsername} 
              onChange={(e) => setEditUsername(e.target.value)} 
              fullWidth 
              required 
            />
            <TextField 
              label="Email" 
              type="email" 
              value={editEmail} 
              onChange={(e) => setEditEmail(e.target.value)} 
              fullWidth 
              required 
            />
            <TextField
              label="Reset Password"
              helperText="Enter new password only if you want to change it"
              type="password"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              fullWidth
            />
            {/* <TextField
              select
              label="Role"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              fullWidth
              disabled
            >
              {roleOptions.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {r.icon}
                    {r.label}
                  </Box>
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Department"
              value={editDepartmentId}
              onChange={(e) => setEditDepartmentId(e.target.value)}
              disabled
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
              ))}
            </TextField> */}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleEditClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditSave}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteIcon />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Are you sure you want to delete user <strong>"{deleteUsername}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDeleteClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={confirmDelete}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default UserPage;