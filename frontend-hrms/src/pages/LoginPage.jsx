import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton, 
  InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const LoginPage = ({ setRole }) => {
  const navigate = useNavigate();
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
    } else {
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
          Welcome Back 👋
        </Typography>

        <Typography sx={{ color: "#3B82F6", mb: 3 }}>
          Login to your HRMS dashboard
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
            "&:hover": { color: "#3B82F6" },
          }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </Typography>

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

