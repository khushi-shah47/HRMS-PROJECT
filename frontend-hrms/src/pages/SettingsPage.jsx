
import React, { useState } from "react";

import {
  Container,
  Typography,
  Paper,
  Stack,
  TextField,
  Button,
  Alert
} from "@mui/material";

import api from "../services/api";

const SettingsPage = () => {

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const changePassword = async () => {

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
      return;
    }

    try {

      await api.put("/auth/change-password", {
        password
      });

      setSuccessMsg("Password changed successfully");
      setErrorMsg("");

      setPassword("");
      setConfirmPassword("");

    } catch (error) {

      setErrorMsg("Failed to change password");

    }

  };

  return (

    <Container sx={{ mt: 4 }}>

      <Typography variant="h5" sx={{ mb: 3 }}>
        Settings
      </Typography>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      <Paper sx={{ p: 3 }}>

        <Stack spacing={2}>

          <Typography variant="h6">
            Change Password
          </Typography>

          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button variant="contained" onClick={changePassword}>
            Update Password
          </Button>

        </Stack>

      </Paper>

    </Container>

  );

};

export default SettingsPage;