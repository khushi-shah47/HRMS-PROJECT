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
  Stack
} from "@mui/material";

const TaskPage = () => {

  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:5000/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const createTask = async () => {

    await fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        assigned_to: assignedTo,
        assigned_by: assignedBy,
        priority,
        due_date: dueDate
      })
    });

    setTitle("");
    setDescription("");
    setAssignedTo("");
    setAssignedBy("");
    setDueDate("");

    fetchTasks();
  };

  const updateStatus = async (id, status) => {

    await fetch(`http://localhost:5000/api/tasks/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {

    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE"
    });

    fetchTasks();
  };

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
          />

          <TextField
            label="Assigned To (Employee ID)"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />

          <TextField
            label="Assigned By (Manager ID)"
            value={assignedBy}
            onChange={(e) => setAssignedBy(e.target.value)}
          />

          <TextField
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          />

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
              <TableCell>Status</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>

            {tasks.map(task => (

              <TableRow key={task.id}>

                <TableCell>{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.priority}</TableCell>

                <TableCell>

                  <Stack direction="row" spacing={1}>

                    <Button
                      size="small"
                      onClick={() => updateStatus(task.id, "in_progress")}
                    >
                      Start
                    </Button>

                    <Button
                      size="small"
                      onClick={() => updateStatus(task.id, "completed")}
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

      </Paper>

    </Container>
  );
};

export default TaskPage;