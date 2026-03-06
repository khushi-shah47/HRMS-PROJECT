import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";

const stats = [
{
title: "Total Employees",
value: 18,
icon: <PeopleIcon sx={{ fontSize:40, color:"#3B82F6" }} />
},
{
title: "Present Today",
value: 12,
icon: <CheckCircleIcon sx={{ fontSize:40, color:"#16A34A" }} />
},
{
title: "Leaves Today",
value: 2,
icon: <BeachAccessIcon sx={{ fontSize:40, color:"#F59E0B" }} />
},
{
title: "WFH Today",
value: 3,
icon: <HomeWorkIcon sx={{ fontSize:40, color:"#8B5CF6" }} />
}
];

export default function StatsCards(){

return(

<Grid container spacing={3} sx={{ marginTop:2 }}>

{stats.map((item,i)=>(

<Grid item xs={12} sm={6} md={3} key={i}>

<Card
sx={{
borderRadius:3,
boxShadow:2
}}
>

<CardContent>

<Box
sx={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<Box>

<Typography color="textSecondary">
{item.title}
</Typography>

<Typography
variant="h5"
sx={{ fontWeight:"bold" }}
>
{item.value}
</Typography>

</Box>

{item.icon}

</Box>

</CardContent>

</Card>

</Grid>

))}

</Grid>

);

}