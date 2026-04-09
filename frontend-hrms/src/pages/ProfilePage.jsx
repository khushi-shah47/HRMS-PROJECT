import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function ProfilePage() {
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [errors, setErrors] = useState({});
  // error state kept for future use, eslint ignore
  const { user } = useAuth();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const fetchEmployee = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      const res = await api.get(`/profile/${user.id}`);
      const emp = res.data?.employee || res.data; // adjust if it's nested
      setEmployee(emp);
      setFormData({
        name: emp?.name || user?.username || "",
        email: emp?.email || user?.email || "",
        phone: emp?.phone || ""
      });
    } catch (err) {
      console.error("Profile fetch error:", err);
      // Fallback display from auth user
      setFormData({
        name: user?.username || "User",
        email: user?.email || "",
        phone: ""
      });
      setEmployee({ name: user?.username });
    } finally {
      setLoading(false);
    }
  };
  // Fetch employee when user changes
  useEffect(() => {
    if (user?.id) {
      fetchEmployee();
    }
  }, [user?.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    if (!validateForm()) return;
    setSaving(true);
    try {
      await api.put(`/profile/${user.id}`, formData);
      await fetchEmployee(); // Full refetch for consistency
      setNotification({ open: true, message: "Profile updated successfully!", severity: "success" });
      setEditing(false);
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: "Failed to update profile", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone (optional but validate if entered)
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

      const uploadProfileImage = async () => {
    if (!selectedFile || !employee?.id) {
      setNotification({
        open: true,
        message: "No profile image or employee ID",
        severity: "error"
      });
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append("profile", selectedFile);

    try {
      const res = await api.post(
        `/employees/upload-profile/${employee.id}`,
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      // ✅ Update local state
      setEmployee((prev) => {
        const updated = { ...prev, profile_image: res.data.path };
        return updated;
      });

      // Update auth context indirectly via event
      window.dispatchEvent(new Event("profileUpdated"));

      setNotification({
        open: true,
        message: "Profile image updated",
        severity: "success"
      });

      setPreview(null);
      setSelectedFile(null);

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err.message);

      setNotification({
        open: true,
        message: err.response?.data?.message || "Upload failed",
        severity: "error"
      });
    }
  };
  if (loading) return <CircularProgress sx={{ display: "block", m: "auto", mt: 4 }} />;

  // Removed cached error display - backend always provides data now

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "primary.main" }}>
        My Profile
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ position: "relative", display: "inline-block", mr: 2 }}>
            <Avatar
              // src={
              //   preview
              //     ? preview
              //     : employee?.profile_image
              //       ? http://localhost:5000/${employee.profile_image}?t=${new Date().getTime()}
              //       : ""
              // }
              src={
                preview
                  ? preview
                  : employee?.profile_image
                    ? `http://localhost:5000/${employee.profile_image}?t=${Date.now()}`
                    : ""
              }
              sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
            >
              {!employee?.profile_image && <PersonIcon fontSize="medium" />}
            </Avatar>

            
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="profile-upload"
              onChange={handleFileChange}
            />

            <label htmlFor="profile-upload">
              <Box
                sx={(theme) => ({
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: theme.palette.background.paper,
                  border: "1px solid",
                  borderColor: theme.palette.divider,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: theme.palette.action.hover }
                })}
              >
                <CameraAltIcon sx={{ fontSize: 16, color: isDark ? "#ffffff" : "#000000" }} />
              </Box>
            </label>
          </Box>

          {selectedFile && (
              <Button
                variant="contained"
                size="small"
                sx={{ mt: 1 }}
                onClick={uploadProfileImage}
              >
                Upload Image
              </Button>
          )}
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold">
              {formData.name || employee?.name || user?.name || user?.username || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {(() => {
                const role = employee?.role || user?.role || "";
                const position = employee?.position;
                if (role.toLowerCase() === "admin") return "Admin";
                if (role.toLowerCase() === "hr") return "HR";
                if (position) return position;
                return role ? role.charAt(0).toUpperCase() + role.slice(1) : "N/A";
              })()}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth size="small" disabled={!editing} error={!!errors.name} helperText={errors.name}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth size="small" disabled={!editing} error={!!errors.email} helperText={errors.email}/>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth size="small" disabled={!editing} error={!!errors.phone} helperText={errors.phone}/>
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, textAlign: "right" }}>
          {!editing ? (
            <Button variant="contained" onClick={() => setEditing(true)}>Edit</Button>
          ) : (
            <Button variant="contained" color="success" onClick={saveProfile} disabled={saving}>
              {saving ? <CircularProgress size={20} color="inherit" /> : "Save"}
            </Button>
          )}
        </Box>
      </Paper>

      <Snackbar open={notification.open} autoHideDuration={6000} onClose={() => setNotification((prev) => ({ ...prev, open: false }))}>
        <Alert severity={notification.severity} sx={{ width: "100%" }}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
}