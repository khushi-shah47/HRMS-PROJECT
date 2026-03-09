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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const roles = ["Admin", "Manager", "HR", "Developer"];

const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const handleSignup = async () => {
    if (!name || !email || !password || !selectedRole) {
      alert("Please fill all fields!");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role: selectedRole,
        }),
      });

      const Data = await res.json();

      if (!res.ok) {
        alert("Signup failed");
        return;
      }

      alert("Signup successful!");
      navigate("/login");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F8FAFC",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
          textAlign: "center",
          width: "100%",
          maxWidth: "400px",
          mx: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: "#1E3A8A", fontWeight: "bold", mb: 1 }}>
          Create Your Account 
        </Typography>

        <Typography sx={{ color: "#3B82F6", mb: 3 }}>
          Sign up for HRMS Dashboard
        </Typography>

        <TextField
          label="Name"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
                {role}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#3B82F6" },
          }}
          onClick={handleSignup}
        >
          Sign Up
        </Button>

        <Typography sx={{ mt: 3 }}>
          Already have an account?
          <Button
            onClick={() => navigate("/login")}
            sx={{ color: "#3B82F6", fontWeight: "bold" }}
          >
            Login Here
          </Button>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignupPage;

