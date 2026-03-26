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
  TablePagination,
  Box,
  Chip,
  Snackbar,
  CircularProgress,
  Tooltip,
  InputAdornment,
  useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import PeopleIcon from "@mui/icons-material/People";
import RefreshIcon from "@mui/icons-material/Refresh";
import api from "../services/api";

const EmployeePage = () => {
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [positions, setPositions] = useState([]);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [salary, setSalary] = useState("");
  const [hrList, setHrList] = useState([]);
  const [managerList, setManagerList] = useState([]);
  const [selectedHrId, setSelectedHrId] = useState("");
  const [selectedManagerId, setSelectedManagerId] = useState("");
  
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editPosition, setEditPosition] = useState("");
  const [editDepartmentId, setEditDepartmentId] = useState("");
  const [editJoinDate, setEditJoinDate] = useState("");
  const [editSalary, setEditSalary] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteName, setDeleteName] = useState("");
  
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const canManage = ["admin", "hr"].includes(user?.role);

  const rolePositions = {
    admin: ["Administrator"],
    hr: ["HR Executive", "Senior HR", "HR Manager"],
    manager: ["Team Lead", "Engineering Manager", "Product Manager"],
    developer: ["Junior Developer", "Senior Developer"],
    intern: ["Intern"]
  };

  const [currentPositions, setCurrentPositions] = useState([]);

  const positionsList = [
    "Administrator",
    "HR Executive", "Senior HR", "HR Manager",
    "Team Lead", "Engineering Manager", "Product Manager",
    "Junior Developer", "Senior Developer", "Intern"
  ];

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setPosition("");
    setSelectedHrId("");
    setSelectedManagerId("");
    setManagerList([]);
    setDepartmentId("");

    // Set dynamic positions
    setCurrentPositions(rolePositions[selectedRole] || []);

    // If HR, auto-select HR department
    if (selectedRole === "hr") {
      const hrDept = departments.find(d => d.name === "HR");
      if (hrDept) setDepartmentId(hrDept.id);
    }

    // If Intern, force position
    if (selectedRole === "intern") {
      setPosition("Intern");
    }
    
    // If Admin, force position
    if (selectedRole === "admin") {
      setPosition("Administrator");
    }
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/employees");
      // const data = res.data;
      // let employeesArray = [];
      // if (Array.isArray(data)) {
      //   employeesArray = data;
      // } else if (data.employees) {
      //   employeesArray = data.employees;
      // }
      const employeesArray = res.data.employees || [];
      console.log(employeesArray);
      const formatted = employeesArray.map(emp => ({
        ...emp,
        join_date: emp.join_date ? emp.join_date.split("T")[0] : ""
      }));
      setEmployees(formatted);
    } catch (error) {
      console.error("Error:", error);
      showSnackbar("Failed to load employees", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get("/departments/all");
      setDepartments(res.data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  // const fetchPositions = async () => {
  //   try {
  //     const res = await api.get("/employees");
  //     const data = res.data;
  //     let employeesArray = Array.isArray(data) ? data : (data.employees || []);
  //     const uniquePositions = [...new Set(employeesArray.map(emp => emp.position).filter(Boolean))];
  //     setPositions(uniquePositions);
  //   } catch (error) {
  //     console.error("Error fetching positions:", error);
  //   }
  // };

  const resetAddForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setPhone("");
    setPosition("");
    setDepartmentId("");
    setJoinDate("");
    setSalary("");
    setSelectedHrId("");
    setSelectedManagerId("");
    setManagerList([]);
  };

  const fetchHrs = async () => {
    try {
      const res = await api.get("/admin/hrs");
      setHrList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch HR list:", err);
    }
  };

  const fetchManagers = async (hrId) => {
    if (!hrId) { setManagerList([]); return; }
    try {
      const res = await api.get(`/admin/managers?hrId=${hrId}`);
      setManagerList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch manager list:", err);
    }
  };

  const handleAddOpen = () => {
    resetAddForm();
    fetchHrs();
    setAddDialogOpen(true);
  };

  const handleHrChange = (hrId) => {
    setSelectedHrId(hrId);
    setSelectedManagerId("");
    fetchManagers(hrId);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    resetAddForm();
  };

  const validateEmployee = ({ name, email, phone, position, salary, joinDate }) => {
    if (!name || name.trim().length < 3) {
      return "Name must be at least 3 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Invalid email format";
    }

    if (phone && !/^\d{10}$/.test(phone)) {
      return "Phone must be 10 digits";
    }

    if (!position) {
      return "Position is required";
    }

    if (!salary || isNaN(salary) || Number(salary) <= 0) {
      return "Salary must be a positive number";
    }

    if (joinDate && new Date(joinDate) > new Date()) {
      return "Join date cannot be in the future";
    }

    return null; // valid
  };

  const validateAddForm = () => {
    if (!role) return "Role is required";
    if (!password || password.length < 6) return "Password must be at least 6 characters";
    const basicError = validateEmployee({ name, email, phone, position, salary, joinDate });
    if (basicError) return basicError;
    if (role === "manager" && !selectedHrId) return "Please select an HR for this manager";
    if ((role === "developer" || role === "intern") && !selectedManagerId) return "Please select a manager for this employee";
    return null;
  };

  const addEmployee = async () => {
    const error = validateAddForm();
    if (error) {
      showSnackbar(error, "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/admin/create-employee", {
        name,
        email,
        password,
        role,
        phone,
        position,
        department_id: departmentId || null,
        join_date: joinDate,
        basic_salary: parseFloat(salary) || 0,
        hr_id: selectedHrId || null,
        manager_id: selectedManagerId || null
      });

      handleAddClose();
      showSnackbar("Employee and user account created successfully");
      fetchEmployees();
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create employee";
      showSnackbar(msg, "error");
    } finally {
      setLoading(false);
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
    setEditSalary(emp.basic_salary || "");
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const handleEditSave = async () => {
    const error = validateEmployee({
      name: editName,
      email: editEmail,
      phone: editPhone,
      position: editPosition,
      salary: editSalary,
      joinDate: editJoinDate
    });

    if (error) {
      showSnackbar(error, "error");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/employees/update/${editId}`, {
        name: editName,
        email: editEmail,
        phone: editPhone,
        position: editPosition,
        department_id: editDepartmentId || null,
        join_date: editJoinDate,
        basic_salary: parseFloat(editSalary)
      });

      handleEditClose();
      showSnackbar("Employee updated successfully");
      fetchEmployees();
    } catch (error) {
      showSnackbar("Failed to update employee", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (emp) => {
    setDeleteId(emp.id);
    setDeleteName(emp.name);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteName("");
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/employees/delete/${deleteId}`);
      handleDeleteClose();
      showSnackbar("Employee deleted successfully");
      fetchEmployees();
    } catch (error) {
      showSnackbar("Failed to delete employee", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    // fetchPositions();
  }, []);

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.role?.toLowerCase().includes(searchQuery.toLowerCase()) ;

    const matchesRole =
      !roleFilter || emp.role === roleFilter;

    const matchesDepartment =
      !departmentFilter || emp.department_name === departmentFilter;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);

    if (value !== "hr" && departmentFilter === "HR") {
      setDepartmentFilter("");
    }
    // Auto fix department conflict
    if (value === "admin") {
      setDepartmentFilter(""); // admin → no department
    }

    if (value === "hr") {
      setDepartmentFilter("HR"); // force HR dept
    }
  };

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
            <PeopleIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Employee Management
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Manage all employee records
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {canManage && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddOpen}
                sx={{ bgcolor: "background.paper", color: "primary.main", "&:hover": { bgcolor: "action.hover" } }}
              >
                Add Employee
              </Button>
            )}
            <Tooltip title="Refresh">
              <IconButton onClick={fetchEmployees} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Search & Filter Bar */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "background.paper" }}>
        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          
          {/* Search */}
          <TextField
            placeholder="Search employees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 250 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Role Filter */}
          <TextField
            select
            size="small"
            label="Role"
            value={roleFilter}
            onChange={(e) => handleRoleFilterChange(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="manager">Manager</MenuItem>
            <MenuItem value="developer">Developer</MenuItem>
            <MenuItem value="intern">Intern</MenuItem>
          </TextField>

          {/* Department Filter */}
          <TextField
            select
            size="small"
            label="Department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            sx={{ minWidth: 180 }}
            disabled={roleFilter === "admin"}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => {
              const isHRDept = dept.name === "HR";
              const disableHR =
                roleFilter && roleFilter !== "hr" && isHRDept;

              return (
                <MenuItem
                  key={dept.id}
                  value={dept.name}
                  disabled={disableHR}
                >
                  {dept.name}
                </MenuItem>
              );
            })}
          </TextField>

          {/* Clear Filters */}
          <Button
            size="small"
            onClick={() => {
              setSearchQuery("");
              setRoleFilter("");
              setDepartmentFilter("");
            }}
          >
            Clear
          </Button>

          {/* Count */}
          <Chip 
            label={`${filteredEmployees.length} employees`} 
            color="primary" 
            variant="outlined" 
          />

        </Stack>
      </Paper>
      {/* Data Table */}
      <Paper sx={{ overflow: "hidden", bgcolor: "background.paper" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress />
          </Box>
        )}
        
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>

              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Role</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Position</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Department</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Join Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="right">Basic Salary</TableCell>
              {canManage && <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && filteredEmployees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={canManage ? 9 : 8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No employees found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredEmployees
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((emp) => (
                  <TableRow key={emp.id} hover>

                    <TableCell sx={{ fontWeight: 500 }}>{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>
                      <Chip label={emp.role} size="small" color="secondary" />
                    </TableCell>
                    <TableCell>{emp.phone || "-"}</TableCell>
                    <TableCell>
                      <Chip label={emp.position} size="small" color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>{emp.department_name || "Not Assigned"}</TableCell>
                    <TableCell>{emp.join_date}</TableCell>
                    <TableCell align="right">₹{parseFloat(emp.basic_salary || 0).toLocaleString()}</TableCell>
                    {canManage && (
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton color="primary" onClick={() => handleEditClick(emp)} size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton color="error" onClick={() => handleDeleteClick(emp)} size="small">
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredEmployees.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add Employee Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon />
            Add New Employee
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {/* Role — controls which hierarchy fields appear */}
            <TextField
              select
              label="Role"
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Select Role</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="developer">Developer</MenuItem>
              <MenuItem value="intern">Intern</MenuItem>
            </TextField>

            {/* HR dropdown — for Manager/Developer/Intern */}
            {(role === "manager" || role === "developer" || role === "intern") && (
              <TextField
                select
                label="Select HR"
                value={selectedHrId}
                onChange={(e) => handleHrChange(e.target.value)}
                fullWidth
                required
                disabled={role === "admin"}
                helperText={role === "manager" ? "HR this manager reports to" : "Filter managers by HR"}
              >
                <MenuItem value="">Select HR</MenuItem>
                {hrList.map((hr) => (
                  <MenuItem key={hr.id} value={hr.id}>{hr.name} ({hr.email})</MenuItem>
                ))}
              </TextField>
            )}

            {/* Manager dropdown — for developer/intern */}
            {(role === "developer" || role === "intern") && (
              <TextField
                select
                label="Assign Manager"
                value={selectedManagerId}
                onChange={(e) => setSelectedManagerId(e.target.value)}
                fullWidth
                required
                disabled={!selectedHrId || role === "admin"}
                helperText={selectedHrId ? "Manager for this employee" : "Select HR first"}
              >
                <MenuItem value="">Select Manager</MenuItem>
                {managerList.map((m) => (
                  <MenuItem key={m.id} value={m.id}>{m.name} ({m.email})</MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              error={name.length > 0 && name.length < 3}
              helperText={name.length > 0 && name.length < 3 ? "Minimum 3 characters" : ""}
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              error={email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)}
              helperText={email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Invalid email" : ""}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              error={password.length > 0 && password.length < 6}
              helperText={password.length > 0 && password.length < 6 ? "Minimum 6 characters" : "Login password for this employee"}
            />
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
              error={phone.length > 0 && !/^\d{10}$/.test(phone)}
              helperText={phone.length > 0 && !/^\d{10}$/.test(phone) ? "Enter 10 digit number" : ""}
            />
            <TextField
              select
              label="Position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              fullWidth
              required
              disabled={role === "admin" || role === "intern"}
            >
              <MenuItem value="">Select Position</MenuItem>
              {currentPositions.map((pos) => (
                <MenuItem key={pos} value={pos}>{pos}</MenuItem>
              ))}
            </TextField>

            {/* Department — Hidden for developer/intern (managed by manager) */}
            {!(role === "developer" || role === "intern") && (
              <TextField
                select
                label="Department"
                value={departmentId}
                onChange={(e) => setDepartmentId(e.target.value)}
                fullWidth
                required={role !== "admin"}
                disabled={role === "admin" || role === "hr"}
              >
                <MenuItem value="">Select Department</MenuItem>
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </TextField>
            )}
            <TextField
              type="date"
              label="Join Date"
              value={joinDate}
              onChange={(e) => setJoinDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Basic Salary"
              type="number"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>
              }}
              error={salary.length > 0 && Number(salary) <= 0}
              helperText={salary.length > 0 && Number(salary) <= 0 ? "Must be positive" : ""}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleAddClose} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={addEmployee}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon />
            Edit Employee
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField 
              label="Name" 
              value={editName} 
              onChange={(e) => setEditName(e.target.value)} 
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
              label="Phone" 
              value={editPhone} 
              onChange={(e) => setEditPhone(e.target.value)} 
              fullWidth 
            />
            <TextField
              select
              label="Position"
              value={editPosition}
              onChange={(e) => setEditPosition(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Select Position</MenuItem>
              {positionsList.map((pos) => (
                <MenuItem key={pos} value={pos}>
                  {pos}
                </MenuItem>
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
            <TextField
              label="Basic Salary"
              type="number"
              value={editSalary}
              onChange={e => setEditSalary(e.target.value)}
              fullWidth
              required
              InputProps={{
                startAdornment: <InputAdornment position="start">₹</InputAdornment>
              }}
            />
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
            Are you sure you want to delete <strong>{deleteName}</strong>?
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
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EmployeePage;
