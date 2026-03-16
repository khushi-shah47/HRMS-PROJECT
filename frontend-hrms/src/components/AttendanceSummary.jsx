import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function AttendanceSummary(){

    return(

        <Card sx={{ marginTop:3 }}>

            <CardContent>

                <Typography variant="h6" sx={{ marginBottom:2 }}>
                Today's Attendance
                </Typography>

                <Typography>Present : 12</Typography>
                <Typography>WFH : 3</Typography>
                <Typography>Leave : 2</Typography>
                <Typography>Absent : 4</Typography>

            </CardContent>

        </Card>

    );

}