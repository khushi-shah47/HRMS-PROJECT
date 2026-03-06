import React from "react";
import {
Drawer,
List,
ListItemButton,
ListItemIcon,
ListItemText
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import AssignmentIcon from "@mui/icons-material/Assignment";
import BarChartIcon from "@mui/icons-material/BarChart";

const menu = [
{ text: "Dashboard", icon: <DashboardIcon /> },
{ text: "Employees", icon: <PeopleIcon /> },
{ text: "Attendance", icon: <EventIcon /> },
{ text: "Leave", icon: <EventIcon /> },
{ text: "WFH", icon: <EventIcon /> },
{ text: "Tasks", icon: <AssignmentIcon /> },
{ text: "Reports", icon: <BarChartIcon /> }
];

export default function Sidebar() {

return (

<Drawer
variant="permanent"
sx={{
width: 220,
"& .MuiDrawer-paper": {
width: 220,
background: "#FFFFFF"
}
}}
>

<List>

{menu.map((item, i) => (

<ListItemButton key={i}>

<ListItemIcon sx={{ color: "#3B82F6" }}>
{item.icon}
</ListItemIcon>

<ListItemText primary={item.text} />

</ListItemButton>

))}

</List>

</Drawer>

);

}