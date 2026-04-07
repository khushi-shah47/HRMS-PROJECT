import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const roles = ["admin","HR","Manager","Developer","Intern"];



const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
  const errors = {};

  if (!name.trim()) {
    errors.name = "Name is required";
  } else if (name.length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!email.trim()) {
    errors.email = "Email is required";
  } else if (!/^\S+@\S+\.\S+$/.test(email)) {
    errors.email = "Invalid email format";
  }

  if (!password) {
    errors.password = "Password is required";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!selectedRole) {
    errors.role = "Please select a role";
  }

  setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    if (!name || !email || !password || !selectedRole) {
      setError("Please fill in all fields!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/signup", {
        name,
        email,
        password,
        role: selectedRole,
      });

      alert("Signup successful! Please login.");
      navigate("/login");

    } catch (error) {
      console.error(error);
      setError(error.response?.data?.message || "Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSignup();
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.default",
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
          mx: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
          Create Your Account 
        </Typography>

        <Typography sx={{ color: "primary.main", mb: 3, opacity: 0.8 }}>
          Sign up for HRMS Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!formErrors.name}
          helperText={formErrors.name}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!formErrors.email}
          helperText={formErrors.email}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          error={!!formErrors.password}
          helperText={formErrors.password}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            label="Role"
          >
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
          onClick={handleSignup}
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <Box sx={{ mt: 2 }}>
          <Button
            fullWidth
            variant="text"
            onClick={() => navigate("/forgot-password")}
            sx={{ color: "primary.main", fontWeight: "bold", textTransform: "none" }}
          >
            Forget Password?
          </Button>
        </Box>

        <Typography sx={{ mt: 3 }}>
          Already have an account?
          <Button
            onClick={() => navigate("/login")}
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            Login Here
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupPage;


