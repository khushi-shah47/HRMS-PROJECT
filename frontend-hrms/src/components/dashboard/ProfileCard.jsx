import React from "react";
import { Card, CardContent, Box, Typography, Grid, Chip, useTheme } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

const ProfileCard = ({ user, leaveBalance }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
          <PersonIcon sx={{ color: theme.palette.primary.main }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: theme.palette.primary.main }}>
            My Profile
          </Typography>
        </Box>

        <Box sx={{ p: 3, bgcolor: "background.paper", borderRadius: 2, border: "1px solid", borderColor: "divider" }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="textSecondary">Name</Typography>
                <Typography fontWeight="600" variant="body1">{user?.name || "-"}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: 1.5 }}>
                <Typography variant="caption" color="textSecondary">Email</Typography>
                <Typography fontWeight="600" variant="body1">{user?.email || "-"}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ mb: { xs: 1.5, sm: 0 } }}>
                <Typography variant="caption" color="textSecondary">Role</Typography>
                <Box sx={{ mt: 0.5 }}>
                  <Chip 
                    label={user?.role?.toUpperCase() || "EMPLOYEE"} 
                    size="small" 
                    color="primary" 
                    variant="outlined"
                    sx={{ fontWeight: "bold", fontSize: "0.7rem" }}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box>
                <Typography variant="caption" color="textSecondary">Leave Balance</Typography>
                <Typography fontWeight="600" variant="body1" sx={{ color: "success.main" }}>{leaveBalance ?? "0"} Days</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
