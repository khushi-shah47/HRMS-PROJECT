import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  useTheme,
  Avatar
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import api from "../services/api";

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const res = await api.get(`/tasks/${id}`);
        setTask(res.data);
      } catch (error) {
        console.error("Error fetching task details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskDetails();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed": return "success";
      case "in_progress": return "primary";
      case "pending": return "warning";
      default: return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "success";
      default: return "default";
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (!task) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h5">Task not found</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
        color="inherit"
      >
        Back to Tasks
      </Button>

      <Grid container spacing={3}>
        {/* Task Header */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 4, 
              background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
              color: "white",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>{task.title}</Typography>
                <Stack direction="row" spacing={1}>
                  <Chip 
                    label={task.status?.toUpperCase() || "PENDING"} 
                    sx={{ bgcolor: "white", color: getStatusColor(task.status) + ".main", fontWeight: "bold" }} 
                  />
                  <Chip 
                    icon={<PriorityHighIcon sx={{ color: "inherit !important" }} />}
                    label={`${task.priority?.toUpperCase()} PRIORITY`} 
                    sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "white", border: "1px solid white" }} 
                  />
                </Stack>
              </Box>
              <AssignmentIcon sx={{ fontSize: 80, opacity: 0.2 }} />
            </Box>
          </Paper>
        </Grid>

        {/* Task Content */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="secondary.main">Description</Typography>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "text.primary", lineHeight: 1.7 }}>
                {task.description || "No description provided for this task."}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Assignment Side Card */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
                  <PersonIcon color="secondary" /> Assignment
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.light", fontSize: "0.9rem" }}>
                      {task.assigned_to_name?.charAt(0)}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{task.assigned_to_name}</Typography>
                  </Stack>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">Assigned By</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "grey.400", fontSize: "0.9rem" }}>
                      {task.assigned_by_name?.charAt(0)}
                    </Avatar>
                    <Typography variant="body1">{task.assigned_by_name}</Typography>
                  </Stack>
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold" }}>
                  <CalendarTodayIcon color="secondary" /> Timeline
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Due Date</Typography>
                  <Typography variant="h6" sx={{ color: "error.main", fontWeight: "bold" }}>
                    {task.due_date ? new Date(task.due_date).toLocaleDateString() : "No due date"}
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">Created At</Typography>
                  <Typography variant="body2">
                    {new Date(task.created_at).toLocaleString()}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TaskDetailPage;
