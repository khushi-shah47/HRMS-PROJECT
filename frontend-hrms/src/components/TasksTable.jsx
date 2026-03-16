import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Table, TableBody, TableRow, TableCell, Chip, CircularProgress } from "@mui/material";

export default function TasksTable() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
const response = await api.get("/tasks?status=pending&limit=5");
      const data = await response.json();
      setTasks(data.data || data.tasks || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
      setTasks([
        { name: "No pending tasks", assigned: "N/A", status: "Empty" },
        { name: "Check Tasks page", assigned: "You", status: "Info" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case "completed":
        return "success";
      case "in_progress":
        return "warning";
      case "pending":
        return "default";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Card sx={{ marginTop: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Loading pending tasks...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ marginTop: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Pending Tasks
        </Typography>
        <Table>
          <TableBody>
            {tasks.length > 0 && !loading ? (
              tasks.map((task) => (
                <TableRow key={task.id || Math.random()}>
                  <TableCell sx={{ fontWeight: 500, maxWidth: 200 }}>
                    {task.title || task.name}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {task.assigned_to_name || task.assigned || "Unassigned"}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={task.status || "Pending"} 
                      size="small" 
                      color={getStatusColor(task.status)} 
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  No pending tasks. Great job! 🎉
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

