import React from "react";
import {
AppBar,
Toolbar,
Typography,
Avatar,
Box,
Button
} from "@mui/material";

export default function Topbar(){

const user = {
name: "Admin"
};

const handleLogout = () => {

localStorage.removeItem("token");
window.location.href = "/login";

};

return(

<AppBar
position="static"
sx={{ background:"#FFFFFF", color:"#000", boxShadow:1 }}
>

<Toolbar>

<Typography
variant="h6"
sx={{ flexGrow:1, color:"#1E3A8A" }}
>
HRMS Dashboard
</Typography>

<Box sx={{ display:"flex", alignItems:"center", gap:2 }}>

<Typography>
{user.name}
</Typography>

<Avatar>
{user.name.charAt(0)}
</Avatar>

<Button
variant="contained"
color="error"
size="small"
onClick={handleLogout}
>
Logout
</Button>

</Box>

</Toolbar>

</AppBar>

);

}