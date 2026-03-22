import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }
    alert("Password reset link sent to your email!");
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
          Reset Your Password 🔐
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          Enter your registered email to receive reset password
        </Typography>

        <TextField
          label="Email Address"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button
          variant="contained"
          fullWidth
          sx={{
            mt: 2,
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
          }}
          onClick={handleSubmit}
        >
          Send Reset Link
        </Button>

        <Button 
          onClick={() => navigate("/login")} 
          sx={{ mt: 2, color: "text.secondary" }}
        >
          Back to Login
        </Button>
      </Box>
    </Box>
  );
};

export default ForgetPassword;

