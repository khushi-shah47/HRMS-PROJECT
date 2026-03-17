// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Paper,
//   Grid,
//   TextField,
//   Button,
//   Avatar,
//   Divider,
//   Alert,
//   Snackbar,
//   CircularProgress
// } from "@mui/material";
// import LockIcon from "@mui/icons-material/Lock";
// import PersonIcon from "@mui/icons-material/Person";
// import api from "../services/api";

// export default function ProfilePage() {
//   const [user, setUser] = useState(null);
//   const [employeeDetails, setEmployeeDetails] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Password state
//   const [passwords, setPasswords] = useState({
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: ""
//   });
//   const [passwordsMatch, setPasswordsMatch] = useState(true);
//   const [passwordsLoading, setPasswordsLoading] = useState(false);
//   const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const userDataString = localStorage.getItem("user");
//         if (userDataString) {
//           const parsedUser = JSON.parse(userDataString);
//           setUser(parsedUser);
          
//           if (parsedUser.employee_id) {
//             const empRes = await api.get(`/employees/${parsedUser.employee_id}`);
//             setEmployeeDetails(empRes.data);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to load user or employee data", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchUserData();
//   }, []);

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords(prev => ({ ...prev, [name]: value }));
    
//     // Check match dynamically if confirming
//     if (name === "confirmPassword") {
//       setPasswordsMatch(passwords.newPassword === value);
//     } else if (name === "newPassword") {
//       setPasswordsMatch(value === passwords.confirmPassword || passwords.confirmPassword === "");
//     }
//   };

//   const submitPasswordChange = async (e) => {
//     e.preventDefault();
//     if (passwords.newPassword !== passwords.confirmPassword) {
//       setPasswordsMatch(false);
//       return;
//     }

//     setPasswordsLoading(true);
//     try {
//       const res = await api.put("/auth/change-password", {
//         currentPassword: passwords.currentPassword,
//         newPassword: passwords.newPassword
//       });
//       setNotification({ open: true, message: res.data.message || "Password updated successfully", severity: "success" });
//       setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
//     } catch (error) {
//       setNotification({ 
//         open: true, 
//         message: error.response?.data?.message || "Failed to update password", 
//         severity: "error" 
//       });
//     } finally {
//       setPasswordsLoading(false);
//     }
//   };

//   const closeNotification = () => setNotification({ ...notification, open: false });

//   if (loading) {
//     return (
//       <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box sx={{ p: 4, maxWidth: 1000, margin: "auto" }}>
//       <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, color: "#1E3A8A" }}>
//         My Profile
//       </Typography>

//       <Grid container spacing={4}>
//         {/* Profile Information Card */}
//         <Grid item xs={12} md={7}>
//           <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: '100%' }}>
//             <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
//               <Avatar sx={{ bgcolor: "#3b82f6", width: 64, height: 64, mr: 2 }}>
//                 <PersonIcon fontSize="large" />
//               </Avatar>
//               <Box>
//                 <Typography variant="h5" fontWeight="bold">{user?.name || user?.username}</Typography>
//                 <Typography variant="body1" color="text.secondary">{employeeDetails?.position || user?.role}</Typography>
//               </Box>
//             </Box>
            
//             <Divider sx={{ mb: 3 }} />
            
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="caption" color="text.secondary">Email Address</Typography>
//                 <Typography variant="body1" fontWeight="500">{user?.email || "N/A"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="caption" color="text.secondary">Phone Number</Typography>
//                 <Typography variant="body1" fontWeight="500">{employeeDetails?.phone || "N/A"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="caption" color="text.secondary">Department</Typography>
//                 <Typography variant="body1" fontWeight="500">{employeeDetails?.department_name || "N/A"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="caption" color="text.secondary">System Role</Typography>
//                 <Typography variant="body1" fontWeight="500" sx={{ textTransform: "capitalize" }}>{user?.role || "N/A"}</Typography>
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <Typography variant="caption" color="text.secondary">Join Date</Typography>
//                 <Typography variant="body1" fontWeight="500">
//                   {employeeDetails?.join_date ? new Date(employeeDetails.join_date).toLocaleDateString() : "N/A"}
//                 </Typography>
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>

//         {/* Change Password Card */}
//         <Grid item xs={12} md={5}>
//           <Paper elevation={3} sx={{ p: 4, borderRadius: 2, height: '100%' }}>
//             <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
//               <LockIcon sx={{ color: "#1E3A8A", mr: 1 }} />
//               <Typography variant="h6" fontWeight="bold">Change Password</Typography>
//             </Box>
//             <Divider sx={{ mb: 3 }} />
            
//             <form onSubmit={submitPasswordChange}>
//               <TextField
//                 fullWidth
//                 label="Current Password"
//                 type="password"
//                 name="currentPassword"
//                 value={passwords.currentPassword}
//                 onChange={handlePasswordChange}
//                 required
//                 sx={{ mb: 2 }}
//                 size="small"
//               />
//               <TextField
//                 fullWidth
//                 label="New Password"
//                 type="password"
//                 name="newPassword"
//                 value={passwords.newPassword}
//                 onChange={handlePasswordChange}
//                 required
//                 sx={{ mb: 2 }}
//                 size="small"
//               />
//               <TextField
//                 fullWidth
//                 label="Confirm New Password"
//                 type="password"
//                 name="confirmPassword"
//                 value={passwords.confirmPassword}
//                 onChange={handlePasswordChange}
//                 required
//                 error={!passwordsMatch}
//                 helperText={!passwordsMatch ? "Passwords do not match" : ""}
//                 sx={{ mb: 3 }}
//                 size="small"
//               />
//               <Button 
//                 type="submit" 
//                 variant="contained" 
//                 color="primary" 
//                 fullWidth
//                 disabled={passwordsLoading || !passwords.currentPassword || !passwords.newPassword || !passwordsMatch}
//               >
//                 {passwordsLoading ? <CircularProgress size={24} color="inherit" /> : "Update Password"}
//               </Button>
//             </form>
//           </Paper>
//         </Grid>
//       </Grid>

//       <Snackbar open={notification.open} autoHideDuration={6000} onClose={closeNotification}>
//         <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
//           {notification.message}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// }
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
import api from "../services/api";

export default function ProfilePage() {
  const [employee, setEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    join_date: ""
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  useEffect(() => {
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
          join_date: emp.join_date
            ? emp.join_date.split("T")[0]
            : ""
        });

      } catch (err) {
        console.error(err);
        setNotification({
          open: true,
          message: "Failed to load profile",
          severity: "error"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const saveProfile = async () => {
    setSaving(true);

    try {
      await api.put(`/profile/${employee.id}`, formData);

      setEmployee((prev) => ({
        ...prev,
        ...formData
      }));

      setNotification({
        open: true,
        message: "Profile updated successfully",
        severity: "success"
      });

      setEditing(false);

    } catch (err) {
      console.error(err);

      setNotification({
        open: true,
        message: "Failed to update profile",
        severity: "error"
      });

    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <CircularProgress
        sx={{ display: "block", m: "auto", mt: 4 }}
      />
    );
  }

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 4, color: "#1E3A8A" }}
      >
        My Profile
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Avatar
            sx={{
              bgcolor: "#3b82f6",
              width: 64,
              height: 64,
              mr: 2
            }}
          >
            <PersonIcon fontSize="large" />
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" fontWeight="bold">
              {formData.name || ""}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {employee?.position || employee?.role || ""}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Form */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              disabled={!editing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              label="Join Date"
              name="join_date"
              type="date"
              value={formData.join_date || ""}
              onChange={handleChange}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              disabled={!editing}
            />
          </Grid>
        </Grid>

        {/* Buttons */}
        <Box sx={{ mt: 3, textAlign: "right" }}>
          {!editing ? (
            <Button
              variant="contained"
              onClick={() => setEditing(true)}
            >
              Edit
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={saveProfile}
              disabled={saving}
            >
              {saving ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                "Save"
              )}
            </Button>
          )}
        </Box>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() =>
          setNotification((prev) => ({ ...prev, open: false }))
        }
      >
        <Alert severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}