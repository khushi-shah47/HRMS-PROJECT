import React, { useEffect, useState } from "react";
import api from "../services/api";
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
  TablePagination
} from "@mui/material";

const TaskPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  // Priority options
  const priorityOptions = [
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" }
  ];

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      let employeesArray = [];
      if (Array.isArray(res.data)) {
        employeesArray = res.data;
      } else if (res.data.employees) {
        employeesArray = res.data.employees;
      }
      setEmployees(employeesArray);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const createTask = async () => {
    try {
      await api.post("/tasks", {
        title,
        description,
        assigned_to: assignedTo,
        assigned_by: assignedBy,
        priority,
        due_date: dueDate
      });

      setTitle("");
      setDescription("");
      setAssignedTo("");
      setAssignedBy("");
      setPriority("medium");
      setDueDate("");

      fetchTasks();
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Helper function to get employee name by ID
  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = employees.find(e => e.id === parseInt(id) || e.id === id);
    return emp ? emp.name : `ID: ${id}`;
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "error";
      case "medium":
        return "warning";
      case "low":
        return "success";
      default:
        return "default";
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "success";
      case "in_progress":
        return "primary";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const isTaskCompleted = (task) => task.status?.toLowerCase() === "completed";

  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Task Management
      </Typography>

      {/* Create Task */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
          />

          <TextField
            select
            label="Assigned To (Employee)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          >
            <MenuItem value="">Select Employee</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Assigned By (Manager)"
            value={assignedBy}
            onChange={(e) => setAssignedBy(e.target.value)}
          >
            <MenuItem value="">Select Manager</MenuItem>
            {employees.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            {priorityOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>

          <TextField
            type="date"
            label="Due Date"
            InputLabelProps={{ shrink: true }}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          <Button variant="contained" onClick={createTask}>
            Create Task
          </Button>
        </Stack>
      </Paper>

      {/* Task Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Assigned By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(task => (
              <TableRow key={task.id}>
                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{getEmployeeName(task.assigned_to)}</TableCell>
                <TableCell>{getEmployeeName(task.assigned_by)}</TableCell>
                <TableCell>
                  <Chip 
                    label={task.status || "Pending"} 
                    color={getStatusColor(task.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={task.priority || "Medium"} 
                    color={getPriorityColor(task.priority)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{task.due_date || "-"}</TableCell>

                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      onClick={() => updateStatus(task.id, "in_progress")}
                      disabled={isTaskCompleted(task)}
                    >
                      Start
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={() => updateStatus(task.id, "pending")}
                      disabled={isTaskCompleted(task)}
                    >
                      Pending
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => updateStatus(task.id, "completed")}
                      disabled={isTaskCompleted(task)}
                    >
                      Complete
                    </Button>

                    <Button
                      color="error"
                      size="small"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Container>
  );
};

export default TaskPage;
