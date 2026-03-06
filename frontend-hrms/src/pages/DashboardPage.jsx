import React from "react";
import { Box } from "@mui/material";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatsCards from "../components/StatsCards";
import AttendanceSummary from "../components/AttendanceSummary";
import TasksTable from "../components/TasksTable";
import RecentActivity from "../components/RecentActivity";

export default function DashboardPage(){

return(

<Box sx={{ display:"flex", background:"#F8FAFC" }}>

<Sidebar/>

<Box sx={{ flexGrow:1, padding:3 }}>

<Topbar/>

<StatsCards/>

<Box sx={{ mt:4 }}>

<AttendanceSummary/>

</Box>

<Box sx={{ mt:4 }}>

<TasksTable/>

</Box>

<Box sx={{ mt:4 }}>

<RecentActivity/>

</Box>

</Box>

</Box>

);

}