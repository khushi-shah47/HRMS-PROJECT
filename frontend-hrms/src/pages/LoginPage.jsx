import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton, 
  InputAdornment,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../services/api.js";

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

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Saved accounts
  const [savedAccounts, setSavedAccounts] = useState([]);
  const [showSavedDropdown, setShowSavedDropdown] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [currentLogin, setCurrentLogin] = useState(null); // temporary storage for save popup

  const emailRef = useRef();

  useEffect(() => {
    const accounts = JSON.parse(localStorage.getItem("savedAccounts") || "[]");
    setSavedAccounts(accounts);
  }, []);

  const saveAccount = (email, password) => {
    const accounts = [...savedAccounts];
    const existingIndex = accounts.findIndex(acc => acc.email === email);
    if (existingIndex !== -1) {
      accounts[existingIndex].password = password; // update password
    } else {
      accounts.push({ email, password });
    }
    localStorage.setItem("savedAccounts", JSON.stringify(accounts));
    setSavedAccounts(accounts);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      // Save user data and token
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);

      // Show save password popup only if account not already saved
      const existingAccount = savedAccounts.find(acc => acc.email === email);

      if (!existingAccount || existingAccount.password !== password) {
        setCurrentLogin({ email, password });
        setShowSavePopup(true);
      } else {
        //Redirect Directly
        navigate(getDashboardRoute(data.user.role));
      }


    } catch (err) {
      console.error(err);
      if (err.response) setError(err.response.data.message);
      else setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  const handleSelectSavedAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setShowSavedDropdown(false);
  };

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

  const handleSavePassword = () => {
    if (currentLogin) {
      saveAccount(currentLogin.email, currentLogin.password);
      setShowSavePopup(false);
      navigate(getDashboardRoute(JSON.parse(localStorage.getItem("user")).role));
    }
  };

  const handleCancelSave = () => {
    setShowSavePopup(false);
    navigate(getDashboardRoute(JSON.parse(localStorage.getItem("user")).role));
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.default",
        p: 2
      }}
    >
      <Box
        sx={{
          backgroundColor: "background.paper",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
          textAlign: "center",
          width: "100%",
          maxWidth: "450px",
          position: "relative"
        }}
      >
        <Typography variant="h4" sx={{ color: "primary.main", fontWeight: "bold", mb: 1 }}>
          Welcome Back 👋
        </Typography>

        <Typography sx={{ color: "text.secondary", mb: 3 }}>
          Login to your HRMS dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Email Field with saved accounts dropdown */}
        <Box sx={{ position: "relative" }}>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setShowSavedDropdown(true)}
            onBlur={() => setTimeout(() => setShowSavedDropdown(false), 150)}
            onKeyPress={handleKeyPress}
            inputRef={emailRef}
          />
          {showSavedDropdown && savedAccounts.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                width: "100%",
                zIndex: 10,
                mt: 0.5,
                maxHeight: 150,
                overflowY: "auto",
                boxShadow: 3
              }}
            >
              <List dense>
                {savedAccounts.map((acc, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemButton onMouseDown={() => handleSelectSavedAccount(acc)}>
                      <ListItemText primary={acc.email} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

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
            backgroundColor: "primary.main",
            "&:hover": { backgroundColor: "primary.dark" },
            py: 1.5,
            fontWeight: "bold"
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <Typography sx={{ mt: 3 }}>
          Don't have an account?
          <Button
            onClick={() => navigate("/signup")}
            sx={{ color: "primary.main", fontWeight: "bold" }}
          >
            Create a New Account
          </Button>
        </Typography>

        {/* Save password popup */}
        <Dialog open={showSavePopup} onClose={handleCancelSave}>
          <DialogTitle>Save Password?</DialogTitle>
          <DialogContent>
            Do you want to save the password for <strong>{currentLogin?.email}</strong>?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelSave}>Cancel</Button>
            <Button onClick={handleSavePassword} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default LoginPage;