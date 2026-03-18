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
import PersonIcon from "@mui/icons-material/Person";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import api from "../services/api";

export default function ProfilePage() {
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    join_date: ""
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

  const fetchEmployee = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.employee_id) return;
      const res = await api.get(`/profile/${user.employee_id}`);
      const emp = res.data;
      setEmployee(emp);
      setFormData({
        name: emp.name || "",
        email: emp.email || "",
        phone: emp.phone || "",
        join_date: emp.join_date ? emp.join_date.split("T")[0] : ""
      });
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: "Failed to load profile", severity: "error" });
    } finally {
      setLoading(false);
    }
  };
  // Fetch employee
  useEffect(() => {
    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put(`/profile/${employee.id}`, formData);
      setEmployee((prev) => ({ ...prev, ...formData }));
      setNotification({ open: true, message: "Profile updated successfully", severity: "success" });
      setEditing(false);
    } catch (err) {
      console.error(err);
      setNotification({ open: true, message: "Failed to update profile", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  // // Upload image
  // const handleFileChange = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !file.type.startsWith("image/")) return;
  //   setPreview(URL.createObjectURL(file));

  //   const formDataUpload = new FormData();
  //   // formDataUpload.append("profile", file);
  //   formDataUpload.append("profile", file); 

  //   try {
  //     const res = await api.post(`/employees/upload-profile/${employee.id}`, formDataUpload, {
  //       headers: { "Content-Type": "multipart/form-data" }
  //     });

  //     // Update employee and localStorage for navbar
  //     setEmployee((prev) => {
  //       const updated = { ...prev, profile_image: res.data.path };
  //       const user = JSON.parse(localStorage.getItem("user"));
  //       if (user) {
  //         user.profile_image = res.data.path;
  //         localStorage.setItem("user", JSON.stringify(user));
  //       }
  //       return updated;
  //     });

  //     setNotification({ open: true, message: "Profile image updated", severity: "success" });
  //     setPreview(null);
  //   } catch (err) {
  //     console.error(err);
  //     setNotification({ open: true, message: "Upload failed. Check backend!", severity: "error" });
  //   }
  // };

  // const uploadProfileImage = async () => {
  //   if (!selectedFile) return;

  //   const formDataUpload = new FormData();
  //   formDataUpload.append("profile", selectedFile);

  //   try {
  //     const res = await api.post(
  //       `/employees/upload-profile/${employee.id}`,
  //       formDataUpload,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data"
  //         }
  //       }
  //     );

  //     console.log("UPLOAD SUCCESS:", res.data);

  //   } catch (err) {
  //     console.error("UPLOAD ERROR:", err.response?.data || err.message);
  //   }
  // };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadProfileImage = async () => {
    if (!selectedFile) return;

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

        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
          user.profile_image = res.data.path;
          localStorage.setItem("user", JSON.stringify(user));
        }

        return updated;
      });

      // ✅ FORCE PROFILE REFRESH
      await fetchEmployee();

      // ✅ Notify Topbar
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

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#1E3A8A" }}>
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
                    ? `http://localhost:5000/${employee.profile_image}?t=${new Date().getTime()}`
                    : ""
              }
              sx={{ bgcolor: "#3b82f6", width: 48, height: 48 }}
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
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  bgcolor: "white",
                  border: "1px solid #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#f0f0f0" }
                }}
              >
                <CameraAltIcon sx={{ fontSize: 16, color: "#555" }} />
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
            <Typography variant="h6" fontWeight="bold">{formData.name}</Typography>
            <Typography variant="body2" color="text.secondary">{employee?.position || employee?.role}</Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth size="small" disabled={!editing} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth size="small" disabled={!editing} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth size="small" disabled={!editing} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Join Date" name="join_date" type="date" value={formData.join_date} onChange={handleChange} fullWidth size="small" InputLabelProps={{ shrink: true }} disabled={!editing} />
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