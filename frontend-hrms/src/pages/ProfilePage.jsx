import React, { useEffect, useState } from "react";



import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Stack,
  Avatar,
  Alert
} from "@mui/material";

import api from "../services/api";
import ProfileDropdown from "../components/ProfileDropdown";

const ProfilePage = () => {

  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fetchProfile = async () => {

    try {

      const res = await api.get("/profile");

      setProfile(res.data);
      setName(res.data.name);
      setPhone(res.data.phone);

    } catch (error) {

      setErrorMsg("Failed to load profile");

    }

  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async () => {

    try {

      await api.put("/profile/update", {
        name,
        phone
      });

      setSuccessMsg("Profile updated successfully");
      setErrorMsg("");

      fetchProfile();

    } catch (error) {

      setErrorMsg("Failed to update profile");

    }

  };

  return (

    <Container sx={{ mt: 4 }}>

      <Typography variant="h5" sx={{ mb: 3 }}>
        My Profile
      </Typography>

      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
      {successMsg && <Alert severity="success">{successMsg}</Alert>}

      <Paper sx={{ p: 3, mt: 2 }}>

        <Stack spacing={2}>

          <Avatar sx={{ width: 70, height: 70 }}>
            {profile.name?.charAt(0)}
          </Avatar>

          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <TextField
            label="Email"
            value={profile.email || ""}
            disabled
          />

          <TextField
            label="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <TextField
            label="Position"
            value={profile.position || ""}
            disabled
          />

          <TextField
            label="Department"
            value={profile.department || ""}
            disabled
          />

          <TextField
            label="Join Date"
            value={profile.join_date || ""}
            disabled
          />

          <Button variant="contained" onClick={updateProfile}>
            Update Profile
          </Button>

        </Stack>

      </Paper>

    </Container>

  );

};

export default ProfilePage;

