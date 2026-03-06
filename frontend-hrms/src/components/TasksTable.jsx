import React from "react";
import {
Card,
CardContent,
Typography,
Table,
TableBody,
TableRow,
TableCell
} from "@mui/material";

const tasks = [
{ name:"Fix login bug", assigned:"Rahul", status:"Pending" },
{ name:"Update UI", assigned:"Sneha", status:"In Progress" },
{ name:"Prepare report", assigned:"Arjun", status:"Pending" }
];

export default function TasksTable(){

return(

<Card sx={{ marginTop:3 }}>

<CardContent>

<Typography variant="h6" sx={{ marginBottom:2 }}>
Pending Tasks
</Typography>

<Table>

<TableBody>

{tasks.map((task,i)=>(

<TableRow key={i}>

<TableCell>{task.name}</TableCell>
<TableCell>{task.assigned}</TableCell>
<TableCell>{task.status}</TableCell>

</TableRow>

))}

</TableBody>

</Table>

</CardContent>

</Card>

);

}