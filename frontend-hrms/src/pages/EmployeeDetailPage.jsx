import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Box,
  Typography,
  Avatar,
  Grid,
  Divider,
  Chip,
  Button,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
  Stack,
  Card,
  CardContent
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import BusinessIcon from "@mui/icons-material/Business";
import api from "../services/api";

const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const res = await api.get(`/employees/${id}`);
        setEmployee(res.data);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployeeDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!employee) {
    return (
      <Container sx={{ mt: 5, textAlign: "center" }}>
        <Typography variant="h5">Employee not found</Typography>
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
        Back to List
      </Button>

      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 4, 
              display: "flex", 
              alignItems: "center", 
              gap: 3,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              color: "white",
              borderRadius: 2,
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: "white", 
                color: "primary.main",
                fontSize: "2.5rem",
                fontWeight: "bold",
                boxShadow: 3
              }}
            >
              {employee.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: "bold" }}>{employee.name}</Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>{employee.position}</Typography>
              <Chip 
                label={employee.department_name || "General"} 
                sx={{ mt: 1, bgcolor: "rgba(255,255,255,0.2)", color: "white", fontWeight: "bold" }} 
              />
            </Box>
            
            {/* Background Decorative Icon */}
            <WorkIcon sx={{ 
              position: "absolute", 
              right: -20, 
              bottom: -20, 
              fontSize: 150, 
              opacity: 0.1, 
              transform: "rotate(-15deg)" 
            }} />
          </Paper>
        </Grid>

        {/* Info Cards */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EmailIcon color="primary" /> Contact Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Email Address</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{employee.email}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>{employee.phone || "Not provided"}</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: "100%", borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BusinessIcon color="primary" /> Employment Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Department</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>{employee.department_name || "N/A"}</Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Typography variant="caption" color="text.secondary">Join Date</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {employee.join_date ? new Date(employee.join_date).toLocaleDateString() : "N/A"}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">Basic Salary</Typography>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: "bold" }}>
                      ₹{parseFloat(employee.basic_salary || 0).toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip icon={<AccountBalanceWalletIcon />} label="Monthly Pay" color="success" variant="outlined" />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Additional Sections could go here (Projects, Performance, etc.) */}
      </Grid>
    </Container>
  );
};

export default EmployeeDetailPage;
