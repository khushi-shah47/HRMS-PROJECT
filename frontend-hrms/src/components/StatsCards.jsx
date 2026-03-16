import React, { useState, useEffect } from "react";
import { Grid, Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import BusinessIcon from "@mui/icons-material/Business";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { getRoleStats } from "../services/api.js";

export default function StatsCards(){

    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchStats = async () => {
            try {
                setLoading(true);
                const response = await getRoleStats();
                // Backend returns [{title, value, change}], add icons/colors based on title
                const icons = {
                    "Total Employees": <PeopleIcon sx={{ fontSize:40, color:"#3B82F6" }} />,
                    "Present Today": <CheckCircleIcon sx={{ fontSize:40, color:"#16A34A" }} />,
                    "Pending Leaves": <BeachAccessIcon sx={{ fontSize:40, color:"#F59E0B" }} />,
                    "WFH Today": <HomeWorkIcon sx={{ fontSize:40, color:"#8B5CF6" }} />,
                    "Total Departments": <BusinessIcon sx={{ fontSize:40, color:"#10B981" }} />,
                    "Pending Requests": <AssignmentIcon sx={{ fontSize:40, color:"#EF4444" }} />,
                    "Team Tasks": <AssignmentIcon sx={{ fontSize:40, color:"#8B5CF6" }} />,
                    "Total Tasks": <AssignmentIcon sx={{ fontSize:40, color:"#DC2626" }} />,
                    "New Hires (30d)": <PeopleIcon sx={{ fontSize:40, color:"#F59E0B" }} />
                };
                const mappedStats = response.data.map(stat => ({
                    ...stat,
                    icon: icons[stat.title] || <PeopleIcon sx={{ fontSize:40, color:"#6B7280" }} />
                }));
                setStats(mappedStats);
            } catch (err) {
                console.error("Stats fetch error:", err);
                setError("Failed to load stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <Grid container spacing={4} sx={{ marginTop: 3, px: { xs: 2, md: 0 } }}>

                {[0,1,2,3].map((i) => (

                <Grid item xs={12} sm={6} lg={3} key={i}>

                        <Card sx={{ borderRadius:3, boxShadow:2, height: { xs: 'auto', sm: 140 } }}>
                            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <CircularProgress size={24} />
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3, textAlign: "center", color: "error.main" }}>
                <Typography>{error}</Typography>
            </Box>
        );
    }

    return(
        <Grid container spacing={4} sx={{ marginTop: 3, px: { xs: 2, md: 0 } }}>

            {stats.map((item,i)=>(

                <Grid item xs={12} sm={6} lg={3} key={i}>

                <Card

                sx={{

                borderRadius:3,

                boxShadow:2,

                height: { xs: 'auto', sm: 140 }

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
