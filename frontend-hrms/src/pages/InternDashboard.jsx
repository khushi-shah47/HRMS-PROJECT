import React, { useState, useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Button, Stepper, Step, StepLabel, StepContent, Chip, Avatar, LinearProgress, LinearProgressProps, BoxProps } from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SchoolIcon from "@mui/icons-material/School";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useNavigate } from "react-router-dom";

// Intern-specific stats
const internStats = [
  { title: "Assigned Tasks", value: 4, icon: <AssignmentIcon />, color: "#D97706", bg: "#FFFBEB" },
  { title: "Completed", value: 2, icon: <CheckCircleIcon />, color: "#16A34A", bg: "#ECFDF5" },
  { title: "In Progress", value: 2, icon: <AccessTimeIcon />, color: "#F59E0B", bg: "#FFFBEB" },
  { title: "Training Progress", value: "65%", icon: <SchoolIcon />, color: "#8B5CF6", bg: "#F5F3FF" }
];

const myTasks = [
  { task: "Learn codebase", status: "In Progress", deadline: "2024-01-20", progress: 40, mentor: "John Doe" },
  { task: "Complete training", status: "Completed", deadline: "2024-01-15", progress: 100, mentor: "Jane Smith" },
  { task: "Setup environment", status: "Completed", deadline: "2024-01-14", progress: 100, mentor: "Mike Johnson" },
  { task: "First assignment", status: "Pending", deadline: "2024-01-25", progress: 0, mentor: "Sarah Wilson" }
];

const trainingModules = [
  { title: "Company Orientation", status: "Completed", completedDate: "2024-01-10" },
  { title: "Development Tools", status: "Completed", completedDate: "2024-01-12" },
  { title: "Code Review Process", status: "In Progress", completedDate: "-" },
  { title: "Security Guidelines", status: "Pending", completedDate: "-" },
  { title: "Project Workflow", status: "Pending", completedDate: "-" }
];

const learningGoals = [
  { goal: "Complete React basics", deadline: "2024-01-20", status: "In Progress" },
  { goal: "Learn company coding standards", deadline: "2024-01-22", status: "In Progress" },
  { goal: "Submit first code review", deadline: "2024-01-25", status: "Pending" },
  { goal: "Complete database training", deadline: "2024-01-30", status: "Pending" }
];

const mentorFeedback = [
  { date: "2024-01-15", mentor: "John Doe", feedback: "Great progress on understanding the codebase. Keep it up!", rating: 4 },
  { date: "2024-01-10", mentor: "Jane Smith", feedback: "Excellent orientation completion. You're adapting well.", rating: 5 }
];

function StatCard({ title, value, icon, color, bg }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h3" fontWeight="bold" sx={{ color: color }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ 
            p: 2, 
            borderRadius: 3, 
            background: bg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            {React.cloneElement(icon, { sx: { fontSize: 28, color: color } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} sx={{ height: 8, borderRadius: 4 }} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function InternDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const getStatusChip = (status) => {
    const colors = {
      "In Progress": { bg: "#FEF3C7", color: "#D97706" },
      Completed: { bg: "#ECFDF5", color: "#059669" },
      Pending: { bg: "#F3F4F6", color: "#6B7280" }
    };
    const style = colors[status] || colors.Pending;
    return <Chip label={status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getRatingStars = (rating) => {
    return "⭐".repeat(rating);
  };

  const completedModules = trainingModules.filter(m => m.status === "Completed").length;
  const progressPercentage = (completedModules / trainingModules.length) * 100;

  return (
    <Box sx={{ p: 3, background: "#F8FAFC", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)", color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12} md={8}>
            <Typography variant="h3" fontWeight="bold">
              Welcome, {user?.name || "Intern"}! 🌟
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Track your learning journey and grow with us
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: "left", md: "right" } }}>
            <Box sx={{ display: "inline-flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,0.2)", p: 2, borderRadius: 3 }}>
              <SchoolIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography variant="h5" fontWeight="bold">Intern</Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>Learning Phase</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {internStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* My Tasks */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706" }}>
                  My Tasks
                </Typography>
                <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
              </Box>
              {myTasks.map((task, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography fontWeight="600">{task.task}</Typography>
                    {getStatusChip(task.status)}
                  </Box>
                  <Typography variant="caption" color="textSecondary" display="block">
                    Mentor: {task.mentor} | Due: {task.deadline}
                  </Typography>
                  {task.status !== "Pending" && (
                    <Box sx={{ mt: 1.5 }}>
                      <LinearProgressWithLabel value={task.progress} />
                    </Box>
                  )}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Training Progress */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706" }}>
                  Training Progress
                </Typography>
                <Chip 
                  label={`${completedModules}/${trainingModules.length} Completed`} 
                  sx={{ background: "#ECFDF5", color: "#059669", fontWeight: "bold" }} 
                />
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <LinearProgressWithLabel value={progressPercentage} />
              </Box>

              {trainingModules.map((module, i) => (
                <Box key={i} sx={{ p: 2, mb: 1, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {module.status === "Completed" ? (
                      <CheckCircleIcon sx={{ color: "#059669" }} />
                    ) : module.status === "In Progress" ? (
                      <AccessTimeIcon sx={{ color: "#D97706" }} />
                    ) : (
                      <MenuBookIcon sx={{ color: "#6B7280" }} />
                    )}
                    <Typography fontWeight="500">{module.title}</Typography>
                  </Box>
                  {getStatusChip(module.status)}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Learning Goals */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706", mb: 3 }}>
                Learning Goals
              </Typography>
              {learningGoals.map((goal, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography fontWeight="600">{goal.goal}</Typography>
                    <Typography variant="caption" color="textSecondary">Deadline: {goal.deadline}</Typography>
                  </Box>
                  {getStatusChip(goal.status)}
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Mentor Feedback */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#D97706", mb: 3 }}>
                Mentor Feedback
              </Typography>
              {mentorFeedback.map((feedback, i) => (
                <Box key={i} sx={{ p: 2, mb: 2, borderRadius: 2, background: "#F8FAFC", borderLeft: "4px solid #F59E0B" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                    <Typography fontWeight="600">{feedback.mentor}</Typography>
                    <Typography>{getRatingStars(feedback.rating)}</Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                    "{feedback.feedback}"
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Date: {feedback.date}
                  </Typography>
                </Box>
              ))}
              
              <Box sx={{ mt: 3, p: 2, borderRadius: 2, background: "#FEF3C7", textAlign: "center" }}>
                <Typography fontWeight="600" color="#D97706">
                  🎯 Keep up the great work!
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Your next review is scheduled for next week
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

