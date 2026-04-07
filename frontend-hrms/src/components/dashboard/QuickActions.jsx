import React from "react";
import { Card, CardContent, Typography, Stack, Button, Box } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import GroupIcon from "@mui/icons-material/Group";
import { useNavigate } from "react-router-dom";

const QuickActions = ({ role }) => {
  const navigate = useNavigate();

  const actions = {
    admin: [
      { label: "Add Employee", icon: <PersonAddIcon />, path: "/employees", color: "primary" },
      { label: "Generate Report", icon: <AssessmentIcon />, path: "/reports", color: "primary" },
      { label: "Manage Departments", icon: <BusinessIcon />, path: "/departments", color: "primary" }
    ],
    hr: [
      { label: "Manage Departments", icon: <BusinessIcon />, path: "/departments", color: "primary" },
      { label: "View Reports", icon: <AssessmentIcon />, path: "/reports", color: "primary" }
    ],
    manager: [
      { label: "Assign Task", icon: <AssignmentIcon />, path: "/tasks", color: "primary" },
      { label: "Approve Leave", icon: <CheckCircleIcon />, path: "/leave", color: "primary" }
    ]
  };

  const roleActions = actions[role?.toLowerCase()] || [];

  if (roleActions.length === 0) return null;

  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <CardContent>
        {/* <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Quick Actions
        </Typography> */}
        <Typography 
          variant="h6" 
          fontWeight="bold" 
          sx={{ mb: 2, color: 'primary.main' }}
        >
          Quick Actions
        </Typography>
        <Stack spacing={1.5}>
          {roleActions.map((action, index) => (
            <Button
              key={index}
              variant="outlined"
              color={action.color}
              fullWidth
              startIcon={action.icon}
              onClick={() => navigate(action.path)}
              sx={{ justifyContent: "flex-start", py: 1, borderRadius: 2 }}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default QuickActions;