import React, { useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, Divider } from "@mui/material";

const ProfileDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    alert("Logged out!"); // Replace with real logout logic
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Avatar>A</Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClose}>Profile Settings</MenuItem>
        <MenuItem onClick={handleClose}>Account</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileDropdown;