import React, { useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton, 
  InputAdornment
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

const roles = ["Admin", "Manager", "Developer"];

const LoginPage = ({ setRole, goToSignup, goToForgot }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
  if (!email || !password) {
    alert("Please fill all fields!");
    return;
  }

  if(email === "admin@company.com" && password === "123456"){

    localStorage.setItem("token","loggedin");

    window.location.href="/";

    }else{

    alert("Invalid credentials");

  }
  try {
    const res = await fetch("/api/auth/login", {
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
      alert(data.message);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));
    setRole(data.user.role);

  } catch (error) {
    console.error(error);
  }
};

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: 5,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ color: "#1E3A8A", fontWeight: "bold" }}>
          Welcome Back 👋
        </Typography>

        <Typography sx={{ color: "#3B82F6", mb: 3 }}>
         login to your HRMS dashboard
        </Typography>

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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

        {/* <FormControl fullWidth margin="normal">
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
        </FormControl> */}

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "#1E3A8A",
            "&:hover": { backgroundColor: "#3B82F6" },
          }}
          onClick={handleLogin}
        >
          Login
        </Button>

        <Typography
          sx={{
            mt: 2,
            cursor: "pointer",
            color: "#1E3A8A",
            textDecoration: "underline",
          }}
          onClick={goToForgot}
        >
          Forgot Password?
        </Typography>

        <Typography sx={{ mt: 3 }}>
          Don't have an account?
          <Button
            onClick={goToSignup}
            sx={{ color: "#3B82F6", fontWeight: "bold" }}
          >
            Create a New Account
          </Button>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;