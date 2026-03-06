import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const activity = [
"Rahul checked in",
"Sneha applied leave",
"WFH request approved",
"Task assigned to Arjun"
];

export default function RecentActivity(){

return(

<Card sx={{ marginTop:3 }}>

<CardContent>

<Typography variant="h6" sx={{ marginBottom:2 }}>
Recent Activity
</Typography>

{activity.map((item,i)=>(
<Typography key={i}>{item}</Typography>
))}

</CardContent>

</Card>

);

}