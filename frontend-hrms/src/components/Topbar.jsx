import React from "react";
import { AppBar, Toolbar, Typography, Avatar } from "@mui/material";

export default function Topbar() {

return (

<AppBar
position="static"
sx={{ background: "#FFFFFF", color: "#000", boxShadow: 1 }}
>

<Toolbar>

<Typography
variant="h6"
sx={{ flexGrow: 1, color: "#1E3A8A" }}
>
HRMS Dashboard
</Typography>

<Avatar sx={{ background:"#3B82F6" }}>
A
</Avatar>

</Toolbar>

</AppBar>

);

}