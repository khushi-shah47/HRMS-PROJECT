import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton, 
  InputAdornment,
  Alert,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import WorkIcon from "@mui/icons-material/Work";
import CodeIcon from "@mui/icons-material/Code";
import SchoolIcon from "@mui/icons-material/School";

// Get dashboard route based on role
const getDashboardRoute = (role) => {
  const routes = {
    admin: "/admin",
    manager: "/manager",
    hr: "/hr",
    developer: "/developer",
    intern: "/intern"
  };
  return routes[role] || "/";
};

// // Get icon based on role
// const getRoleIcon = (role) => {
//   const icons = {
//     admin: <AdminPanelSettingsIcon sx={{ fontSize: 40, color: "#1E3A8A" }} />,
//     manager: <SupervisedUserCircleIcon sx={{ fontSize: 40, color: "#7C3AED" }} />,
//     hr: <WorkIcon sx={{ fontSize: 40, color: "#059669" }} />,
//     developer: <CodeIcon sx={{ fontSize: 40, color: "#DC2626" }} />,
//     intern: <SchoolIcon sx={{ fontSize: 40, color: "#D97706" }} />
//   };
//   return icons[role] || icons.developer;
// };

// // Get color based on role
// const getRoleColor = (role) => {
//   const colors = {
//     admin: "#1E3A8A",
//     manager: "#7C3AED",
//     hr: "#059669",
//     developer: "#DC2626",
//     intern: "#D97706"
//   };
//   return colors[role] || colors.developer;
// };

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // Save user data and token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token || "loggedin");
      
      // Redirect to role-specific dashboard
      const dashboardRoute = getDashboardRoute(data.user.role);
      navigate(dashboardRoute);

    } catch (err) {
      console.error(err);
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  // Demo login function for testing
  const handleDemoLogin = (role) => {
    const demoUser = {
      id: 1,
      name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`,
      email: `demo@${role}.com`,
      role: role
    };
    localStorage.setItem("user", JSON.stringify(demoUser));
    localStorage.setItem("token", "demo_token");
    navigate(getDashboardRoute(role));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
        p: 2
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: "100%",
          maxWidth: "450px",
        }}
      >
        <Typography variant="h4" sx={{ color: "#1E3A8A", fontWeight: "bold", mb: 1 }}>
          Welcome Back 👋
        </Typography>

        <Typography sx={{ color: "#6B7280", mb: 3 }}>
          Login to your HRMS dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            mb: 2,
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#3B82F6" },
            py: 1.5,
            fontWeight: "bold"
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Typography
          sx={{
            mb: 2,
            cursor: "pointer",
            color: "#1E3A8A",
            textDecoration: "underline",
            "&:hover": { color: "#3B82F6" },
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </Typography>

        {/* <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="textSecondary">OR</Typography>
        </Divider>

        <Typography sx={{ mb: 2, fontWeight: "600" }}>
          Demo Login - Click to explore dashboards:
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => handleDemoLogin("admin")}
            sx={{ 
              borderColor: "#1E3A8A", 
              color: "#1E3A8A",
              justifyContent: "flex-start",
              "&:hover": { backgroundColor: "#EEF2FF", borderColor: "#1E3A8A" }
            }}
            startIcon={<AdminPanelSettingsIcon />}
          >
            Admin Dashboard
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => handleDemoLogin("manager")}
            sx={{ 
              borderColor: "#7C3AED", 
              color: "#7C3AED",
              justifyContent: "flex-start",
              "&:hover": { backgroundColor: "#F5F3FF", borderColor: "#7C3AED" }
            }}
            startIcon={<SupervisedUserCircleIcon />}
          >
            Manager Dashboard
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => handleDemoLogin("hr")}
            sx={{ 
              borderColor: "#059669", 
              color: "#059669",
              justifyContent: "flex-start",
              "&:hover": { backgroundColor: "#ECFDF5", borderColor: "#059669" }
            }}
            startIcon={<WorkIcon />}
          >
            HR Dashboard
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => handleDemoLogin("developer")}
            sx={{ 
              borderColor: "#DC2626", 
              color: "#DC2626",
              justifyContent: "flex-start",
              "&:hover": { backgroundColor: "#FEF2F2", borderColor: "#DC2626" }
            }}
            startIcon={<CodeIcon />}
          >
            Developer Dashboard
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => handleDemoLogin("intern")}
            sx={{ 
              borderColor: "#D97706", 
              color: "#D97706",
              justifyContent: "flex-start",
              "&:hover": { backgroundColor: "#FFFBEB", borderColor: "#D97706" }
            }}
            startIcon={<SchoolIcon />}
          >
            Intern Dashboard
          </Button>
        </Box> */}

        <Typography sx={{ mt: 3 }}>
          Don't have an account?
          <Button
            onClick={() => navigate("/signup")}
            sx={{ color: "#3B82F6", fontWeight: "bold" }}
          >
            Create a New Account
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;

