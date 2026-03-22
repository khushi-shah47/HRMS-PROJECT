import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  Alert,
  Snackbar,
  CircularProgress
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import api from "../services/api";

export default function ChangePasswordPage() {

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswords(prev => ({ ...prev, [name]: value }));

    if (name === "confirmPassword") {
      setPasswordsMatch(passwords.newPassword === value);
    } else if (name === "newPassword") {
      setPasswordsMatch(value === passwords.confirmPassword || passwords.confirmPassword === "");
    }
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordsMatch(false);
      return;
    }

    setLoading(true);

    try {
      const res = await api.put("/auth/change-password", {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });

      setNotification({
        open: true,
        message: res.data.message || "Password updated successfully",
        severity: "success"
      });

      setPasswords({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      setNotification({
        open: true,
        message: error.response?.data?.message || "Failed to update password",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const closeNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <Box sx={{ p: 4, maxWidth: 500, margin: "auto" }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <LockIcon sx={{ color: "primary.main", mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Change Password
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form onSubmit={submitPasswordChange}>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handlePasswordChange}
            required
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handlePasswordChange}
            required
            sx={{ mb: 2 }}
            size="small"
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handlePasswordChange}
            required
            error={!passwordsMatch}
            helperText={!passwordsMatch ? "Passwords do not match" : ""}
            sx={{ mb: 3 }}
            size="small"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={
              loading ||
              !passwords.currentPassword ||
              !passwords.newPassword ||
              !passwordsMatch
            }
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
          </Button>
        </form>
      </Paper>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={closeNotification}>
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}