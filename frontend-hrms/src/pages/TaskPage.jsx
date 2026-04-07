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
  MenuItem,
  Chip,
  TablePagination,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  InputAdornment,
  useTheme
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseIcon from "@mui/icons-material/Pause";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import DownloadIcon from "@mui/icons-material/Download";
import { Tabs, Tab, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, Avatar } from "@mui/material";
import api from "../services/api";

const TaskPage = () => {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [tab, setTab] = useState(0);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editAssignedTo, setEditAssignedTo] = useState("");
  const [editPriority, setEditPriority] = useState("medium");
  const [editDueDate, setEditDueDate] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role;
  const employeeId = user?.employee_id || user?.id;
  
  const canCreateTask = ["admin","hr", "manager"].includes(userRole);
  const canDeleteTask = ["admin","hr", "manager"].includes(userRole);
  const canViewAll = ["admin", "manager", "hr"].includes(userRole);
  // const isMonitorOnly = ["admin", "manager"].includes(userRole);
  const canSeeTabs = ["admin", "hr", "manager"].includes(userRole);

  const priorityOptions = [
    { value: "high", label: "High", color: "error" },
    { value: "medium", label: "Medium", color: "warning" },
    { value: "low", label: "Low", color: "success" }
  ];

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      let res;
      if (canSeeTabs) {
        if (tab === 0) {
          res = await api.get("/tasks/my");
        } else {
          res = await api.get("/tasks/given");
        }
      } else {
        res = await api.get("/tasks/my"); // dev/intern unchanged
      }
      setTasks(res.data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      showSnackbar("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    if (!canCreateTask) return;
    try {
      const endpoint = userRole === "manager" ? "/employees/team?limit=100" : "/employees?limit=100";
      const res = await api.get(endpoint);
      let employeesArray = [];
      if (Array.isArray(res.data)) {
        employeesArray = res.data;
      } else if (res.data.employees) {
        employeesArray = res.data.employees;
      } else if (res.data.data) {
        employeesArray = res.data.data;
      }
      setEmployees(employeesArray);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    if (canSeeTabs) {
      fetchTasks();
    }
  }, [tab]);

  useEffect(() => {
    setStatusFilter("");
    setPriorityFilter("");
  }, [tab]);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const resetAddForm = () => {
    setTitle("");
    setDescription("");
    setAssignedTo("");
    setPriority("medium");
    setDueDate("");
  };

  const handleAddOpen = () => {
    resetAddForm();
    setAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    resetAddForm();
  };

  const createTask = async () => {
    if (!title || !assignedTo) {
      showSnackbar("Please fill required fields (Title, Assigned To)", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/tasks", {
        title,
        description,
        assigned_to: assignedTo,
        assigned_by: employeeId,
        priority,
        due_date: dueDate
      });

      handleAddClose();
      showSnackbar("Task created successfully");
      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
      showSnackbar(error.response?.data?.message || "Failed to create task", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task) => {
    setEditId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
    setEditAssignedTo(task.assigned_to || "");
    setEditPriority(task.priority || "medium");
    setEditDueDate(task.due_date?.split("T")[0] || "");
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setEditId(null);
  };

  const handleEditSave = async () => {
    if (!editTitle) {
      showSnackbar("Please fill required fields", "error");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/tasks/${editId}`, {
        title: editTitle,
        description: editDescription,
        assigned_to: editAssignedTo,
        assigned_by: employeeId,
        priority: editPriority,
        due_date: editDueDate
      });

      handleEditClose();
      showSnackbar("Task updated successfully");
      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
      showSnackbar("Failed to update task", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (task) => {
    setDeleteId(task.id);
    setDeleteTitle(task.title);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteTitle("");
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/tasks/${deleteId}`);
      handleDeleteClose();
      showSnackbar("Task deleted successfully");
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
      showSnackbar("Failed to delete task", "error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    setLoading(true);
    try {
      await api.put(`/tasks/${id}/status`, { status });
      showSnackbar(`Task marked as ${status.replace("_", " ")}`);
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
      showSnackbar("Failed to update status", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewClick = async (task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
    setActiveTab(0);
    fetchComments(task.id);
    fetchAttachments(task.id);
  };

  const fetchComments = async (taskId) => {
    try {
      const res = await api.get(`/tasks/${taskId}/comments`);
      setComments(res.data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchAttachments = async (taskId) => {
    try {
      const res = await api.get(`/tasks/${taskId}/attachments`);
      setAttachments(res.data || []);
    } catch (error) {
      console.error("Error fetching attachments:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      await api.post(`/tasks/${selectedTask.id}/comments`, {
        employee_id: employeeId,
        comment: newComment
      });
      setNewComment("");
      fetchComments(selectedTask.id);
      showSnackbar("Comment added");
    } catch (error) {
      console.error("Error adding comment:", error);
      showSnackbar("Failed to add comment", "error");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/tasks/comments/${commentId}`);
      fetchComments(selectedTask.id);
      showSnackbar("Comment deleted");
    } catch (error) {
      console.error("Error deleting comment:", error);
      showSnackbar("Failed to delete comment", "error");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploadLoading(true);
    try {
      await api.post(`/tasks/${selectedTask.id}/attachments`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      fetchAttachments(selectedTask.id);
      showSnackbar("File uploaded successfully");
    } catch (error) {
      console.error("Error uploading file:", error);
      showSnackbar("Failed to upload file", "error");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await api.delete(`/tasks/attachments/${attachmentId}`);
      fetchAttachments(selectedTask.id);
      showSnackbar("Attachment removed");
    } catch (error) {
      console.error("Error removing attachment:", error);
      showSnackbar("Failed to remove attachment", "error");
    }
  };

  const getPriorityColor = (priority) => {
    const option = priorityOptions.find(p => p.value === priority?.toLowerCase());
    return option?.color || "default";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "success";
      case "in_progress": return "primary";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assigned_to_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assigned_by_name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      !statusFilter || task.status === statusFilter;

    const matchesPriority =
      !priorityFilter || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPageSubtitle = () => {
    if (canViewAll) return "Manage and assign tasks";
    return "View and update your assigned tasks";
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
            <AssignmentIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Task Management
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                {getPageSubtitle()}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {canCreateTask && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddOpen}
                sx={(theme) => ({
                  bgcolor: "background.paper",
                  color: "primary.main",
                  boxShadow: "none",

                  "&:hover": {
                    bgcolor:
                      theme.palette.mode === "light"
                        ? theme.palette.common.white   // white in light mode
                        : theme.palette.grey[900],     // dark in dark mode
                    boxShadow: "none",
                  },

                  "&:active": {
                    bgcolor:
                      theme.palette.mode === "light"
                        ? theme.palette.common.white
                        : theme.palette.grey[900],
                  },
                })}
              >
                Create Task
              </Button>
            )}
            <Tooltip title="Refresh">
              <IconButton onClick={fetchTasks} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: "background.paper" }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        gap={2}
      >
        {/* LEFT SIDE */}
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ width: 250 }}   // 👈 fixed width
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Chip label={`${filteredTasks.length} tasks`} />

          <TextField
            select
            size="small"
            label="Status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ width: 130 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="in_progress">In Progress</MenuItem>
            <MenuItem value="completed">Completed</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            label="Priority"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            sx={{ width: 130 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="high">High</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="low">Low</MenuItem>
          </TextField>
        </Stack>

        {/* RIGHT SIDE → TABS */}
        {canSeeTabs && (
          <Tabs value={tab} onChange={(e, val) => setTab(val)}>
            <Tab label="My Tasks" />
            <Tab label="Team Tasks" />
          </Tabs>
        )}
      </Stack>
      </Paper>

      

      {/* Data Table */}
      <Paper sx={{ overflow: "hidden", bgcolor: "background.paper" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress color="secondary" />
          </Box>
        )}

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              {/* <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell> */}
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assigned To</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Assigned By</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Priority</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Due Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No tasks found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(task => (
                  <TableRow key={task.id} hover>
                    {/* <TableCell>{task.id}</TableCell> */}
                    <TableCell sx={{ fontWeight: 500 }}>{task.title}</TableCell>
                    <TableCell>{task.assigned_to_name || "-"}</TableCell>
                    <TableCell>{task.assigned_by_name || "-"}</TableCell>
                    <TableCell>
                      <Chip 
                        label={task.status || "pending"} 
                        color={getStatusColor(task.status)} 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={task.priority || "medium"} 
                        color={getPriorityColor(task.priority)} 
                        size="small" 
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{task.due_date?.split("T")[0] || "-"}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} justifyContent="center">
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewClick(task)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        {tab === 0 && (
                          <>
                            <Tooltip title="Start Task">
                              <IconButton 
                                size="small" 
                                color="primary"
                                onClick={() => updateStatus(task.id, "in_progress")}
                                disabled={task.status === "in_progress" || task.status === "completed"}
                              >
                                <PlayArrowIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Mark Complete">
                              <IconButton 
                                size="small" 
                                color="success"
                                onClick={() => updateStatus(task.id, "completed")}
                                disabled={task.status === "completed" || task.status === "pending" || !task.status}
                              >
                                <CheckCircleIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Reopen Task">
                              <IconButton 
                                size="small" 
                                color="warning"
                                onClick={() => updateStatus(task.id, "pending")}
                                disabled={task.status === "pending" || !task.status}
                              >
                                <PauseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        {canCreateTask && (!canSeeTabs || tab === 1) && (
                          <>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                color="info"
                                onClick={() => handleEditClick(task)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDeleteClick(task)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredTasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add Task Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "secondary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon />
            Create New Task
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              select
              label="Assign To Employee"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Select Employee</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              fullWidth
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  <Chip label={option.label} color={option.color} size="small" sx={{ mr: 1 }} />
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleAddClose} color="inherit">Cancel</Button>
          {/* <Button 
            variant="contained" 
            onClick={createTask}
            disabled={loading}
            sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" } }}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            Create Task
          </Button> */}
          <Button 
              variant="contained" 
              onClick={createTask}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
              sx={(theme) => ({
                bgcolor: "secondary.main",
                color: theme.palette.getContrastText(theme.palette.secondary.main),
                boxShadow: "none",

                "&:hover": {
                  bgcolor: theme.palette.mode === "light"
                    ? theme.palette.common.white  // hover white in light mode
                    : theme.palette.grey[900],    // hover dark in dark mode
                  color: theme.palette.mode === "light"
                    ? theme.palette.secondary.main
                    : theme.palette.common.white,
                  boxShadow: "none",
                },

                "&:active": {
                  bgcolor: theme.palette.mode === "light"
                    ? theme.palette.common.white
                    : theme.palette.grey[900],
                  color: theme.palette.mode === "light"
                    ? theme.palette.secondary.main
                    : theme.palette.common.white,
                  boxShadow: "none",
                },
              })}
            >
              Create Task
            </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={editDialogOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon />
            Edit Task
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
            <TextField
              select
              label="Assign To Employee"
              value={editAssignedTo}
              onChange={(e) => setEditAssignedTo(e.target.value)}
              fullWidth
              required
            >
              <MenuItem value="">Select Employee</MenuItem>
              {employees.map((emp) => (
                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Priority"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              fullWidth
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              fullWidth
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
            Are you sure you want to delete task <strong>"{deleteTitle}"</strong>?
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

      {/* Task Detail Dialog */}
      <Dialog 
        open={detailDialogOpen} 
        onClose={() => setDetailDialogOpen(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, minHeight: '60vh' } }}
      >
        <DialogTitle sx={{ bgcolor: "secondary.dark", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <VisibilityIcon />
            <Typography variant="h6">Task Details: {selectedTask?.title}</Typography>
          </Box>
          <Chip 
            label={selectedTask?.status || "pending"} 
            size="small" 
            sx={{ bgcolor: "background.paper", color: "secondary.main", fontWeight: "bold" }} 
          />
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, val) => setActiveTab(val)} 
              variant="fullWidth"
              textColor="secondary"
              indicatorColor="secondary"
            >
              <Tab icon={<AssignmentIcon />} label="DETAILS" />
              <Tab icon={<CommentIcon />} label={`COMMENTS (${comments.length})`} />
              <Tab icon={<AttachFileIcon />} label={`ATTACHMENTS (${attachments.length})`} />
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {/* Tab 0: Details */}
            {activeTab === 0 && (
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                    {selectedTask?.description || "No description provided."}
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                    <Typography variant="body1" fontWeight="500">{selectedTask?.assigned_to_name}</Typography>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Assigned By</Typography>
                    <Typography variant="body1" fontWeight="500">{selectedTask?.assigned_by_name}</Typography>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Priority</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Chip 
                        label={selectedTask?.priority} 
                        color={getPriorityColor(selectedTask?.priority)} 
                        size="small" 
                      />
                    </Box>
                  </Paper>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary">Due Date</Typography>
                    <Typography variant="body1" fontWeight="500">
                      {selectedTask?.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : "-"}
                    </Typography>
                  </Paper>
                </Box>
              </Stack>
            )}

            {/* Tab 1: Comments */}
            {activeTab === 1 && (
              <Box>
                <List sx={{ maxHeight: 300, overflow: 'auto', mb: 2 }}>
                  {comments.length === 0 ? (
                    <Typography align="center" color="text.secondary" sx={{ py: 4 }}>No comments yet.</Typography>
                  ) : (
                    comments.map((comment, index) => (
                      <React.Fragment key={comment.id}>
                        <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                          <Avatar sx={{ mr: 2, bgcolor: index % 2 === 0 ? 'primary.main' : 'secondary.main' }}>
                            {comment.employee_name?.charAt(0)}
                          </Avatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="subtitle2" component="span" fontWeight="bold">
                                  {comment.employee_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(comment.created_at).toLocaleString()}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                                {comment.comment}
                              </Typography>
                            }
                          />
                          {comment.employee_id === employeeId && (
                            <ListItemSecondaryAction>
                              <IconButton edge="end" size="small" onClick={() => handleDeleteComment(comment.id)}>
                                <DeleteIcon fontSize="inherit" color="error" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          )}
                        </ListItem>
                        {index < comments.length - 1 && <Divider variant="inset" component="li" />}
                      </React.Fragment>
                    ))
                  )}
                </List>
                <Divider sx={{ mb: 2 }} />
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                  />
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    endIcon={<SendIcon />}
                  >
                    Post
                  </Button>
                </Stack>
              </Box>
            )}

            {/* Tab 2: Attachments */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ mb: 3, p: 2, border: '2px dashed', borderColor: 'divider', borderRadius: 2, textAlign: 'center' }}>
                  <input
                    type="file"
                    id="task-file-upload"
                    hidden
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="task-file-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={uploadLoading ? <CircularProgress size={20} /> : <AttachFileIcon />}
                      disabled={uploadLoading}
                    >
                      {uploadLoading ? "Uploading..." : "Click to Upload File"}
                    </Button>
                  </label>
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
                    Images, PDFs, and Documents up to 10MB
                  </Typography>
                </Box>

                <List>
                  {attachments.length === 0 ? (
                    <Typography align="center" color="text.secondary" sx={{ py: 2 }}>No attachments found.</Typography>
                  ) : (
                    attachments.map((file) => (
                      <Paper variant="outlined" key={file.id} sx={{ mb: 1.5, overflow: 'hidden' }}>
                        <ListItem>
                          <Avatar sx={{ bgcolor: 'action.hover', color: 'text.secondary', mr: 2 }}>
                            <AttachFileIcon />
                          </Avatar>
                          <ListItemText 
                            primary={file.file_url.split('-').slice(1).join('-')}
                            secondary={new Date(file.uploaded_at).toLocaleString()}
                            primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                          />
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Download">
                              <IconButton 
                                size="small" 
                                component="a" 
                                href={`${api.defaults.baseURL.replace('/api', '')}${file.file_url}`} 
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <DownloadIcon fontSize="small" color="primary" />
                              </IconButton>
                            </Tooltip>
                            {/* Allow deletion of attachments by those who can delete tasks (admin/manager) or owners? 
                                Actually, keep it simple: admin/manager can always delete attachments if they are monitors?
                                User said "not able to add", let's enable delete for them too if they are admin/manager.
                            */}
                            {canDeleteTask && (
                              <Tooltip title="Delete">
                                <IconButton size="small" onClick={() => handleDeleteAttachment(file.id)}>
                                  <DeleteIcon fontSize="small" color="error" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </ListItem>
                      </Paper>
                    ))
                  )}
                </List>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDetailDialogOpen(false)} variant="contained" color="secondary">
            Close
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

export default TaskPage;