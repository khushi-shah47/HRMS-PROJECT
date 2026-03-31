import React, { useState, useEffect } from "react";
import { Stack, Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Avatar, LinearProgress, CircularProgress, useTheme } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import PersonIcon from "@mui/icons-material/Person";
import RealTimeClock from "../components/dashboard/RealTimeClock";
import AnnouncementCard from "../components/dashboard/AnnouncementCard";
import HolidayCard from "../components/dashboard/HolidayCard";
import QuickActions from "../components/dashboard/QuickActions";
import ProfileCard from "../components/dashboard/ProfileCard";

function StatCard({ title, value, icon, color, bg, loading }) {
  return (
    <Card sx={{
      borderRadius: 4,
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      p: 2,
      transition: "transform 0.2s",
      "&:hover": { transform: "translateY(-4px)" }
    }}>
      <Box sx={{
        p: 1.5,
        mb: 1.5,
        borderRadius: "50%",
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 24, color: color } })}
      </Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 0.5, fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: 1 }}>
        {title}
      </Typography>
      {loading ? (
        <CircularProgress size={20} sx={{ color: color }} />
      ) : (
        <Typography variant="h4" fontWeight="bold" sx={{ color: color }}>
          {value}
        </Typography>
      )}
    </Card>
  );
}

export default function ManagerDashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    pendingLeaves: 0,
    activeTasks: 0,
    wfhRequests: 0,
    completedTasks: 0,
    teamMembers:0,
    leaveBalance: 0
  });


  const [pendingTasks, setPendingTasks] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [wfhList, setWfhList] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [holidays, setHolidays] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchAllData();
  }, []);


  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchTasks(),
        fetchLeaves(),
        fetchWFHRequests(),
        fetchTeamMembers(),
        fetchAnnouncements(),
        fetchHolidays()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchTeamMembers = async () => {
  //   try {
  //     const res = await api.get("/employees/team");
  //     setTeamMembers(res.data?.employees || res.data || []);
  //   } catch (error) {
  //     console.error("Error fetching team members:", error);
  //   }
  // };

  const fetchTeamMembers = async () => {
  try {
    const res = await api.get("/employees/team");
    const members = res.data?.employees || res.data || [];
    setTeamMembers(members);
    setStats(prev => ({ ...prev, teamMembers: members.length })); // <- Add this line
  } catch (error) {
    console.error("Error fetching team members:", error);
  }
};

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const tasks = res.data || [];

      const pending = tasks.filter(t => t.status === "pending" || t.status === "in_progress");
      const completed = tasks.filter(t => t.status === "completed");

      setPendingTasks(pending.slice(0, 4));
      setStats(prev => ({
        ...prev,
        activeTasks: pending.length,
        completedTasks: completed.length
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const fetchLeaves = async () => {
    try {
      const res = await api.get("/leaves/team");
      const leaves = res.data?.data || res.data || [];

      const pending = leaves.filter(l => l.status === "Pending");
      setLeaveRequests(pending.slice(0, 3));
      setStats(prev => ({ ...prev, pendingLeaves: pending.length }));
    } catch (error) {
      console.error("Error fetching leaves:", error);
    }
  };

  const fetchWFHRequests = async () => {
    try {
      const res = await api.get("/wfh/team");
      const wfh = res.data || [];

      const pending = wfh.filter(w => w.status === "pending");
      setWfhList(pending.slice(0, 3));
      setStats(prev => ({ ...prev, wfhRequests: pending.length }));
    } catch (error) {
      console.error("Error fetching WFH requests:", error);
    }
  };


  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements");
      setAnnouncements(res.data || []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const fetchHolidays = async () => {
    try {
      const res = await api.get("/holidays");
      setHolidays(res.data || []);
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  const getEmployeeName = (id) => {
    if (!id) return "-";
    const emp = teamMembers.find(e => e.id === id || e.id === parseInt(id));
    return emp ? emp.name : `ID: ${id}`;
  };

  const handleApproveLeave = async (id) => {
    try {
      await api.put(`/leaves/${id}`, { status: "Approved" });
      fetchLeaves();
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async (id) => {
    try {
      await api.put(`/leaves/${id}`, { status: "Rejected" });
      fetchLeaves();
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const handleApproveWFH = async (id) => {
    try {
      await api.post("/wfh/approve", { id });
      fetchWFHRequests();
    } catch (error) {
      console.error("Error approving WFH:", error);
    }
  };

  const handleRejectWFH = async (id) => {
    try {
      await api.post("/wfh/reject", { id });
      fetchWFHRequests();
    } catch (error) {
      console.error("Error rejecting WFH:", error);
    }
  };

  const getStatusChip = (status) => {
    const colors = {
      Present: { bg: "success.light", color: "success.dark" },
      WFH: { bg: "secondary.light", color: "secondary.dark" },
      Leave: { bg: "primary.light", color: "primary.dark" },
      Absent: { bg: "error.light", color: "error.dark" }
    };
    const style = colors[status] || colors.Present;
    return <Chip label={status} size="small" sx={{ background: style.bg, color: style.color, fontWeight: "bold" }} />;
  };

  const getPriorityColor = (priority) => {
    return priority === "high" ? "error" : priority === "medium" ? "warning" : "info";
  };

  const managerStats = [
    { title: "Team Members", value: stats.teamMembers, icon: <PeopleIcon />, color: "primary.main", bg: "action.hover" },
    { title: "Pending Leaves", value: stats.pendingLeaves, icon: <BeachAccessIcon />, color: "warning.main", bg: "action.hover" },
    { title: "Active Tasks", value: stats.activeTasks, icon: <AssignmentIcon />, color: "error.main", bg: "action.hover" },
    { title: "WFH Requests", value: stats.wfhRequests, icon: <HomeWorkIcon />, color: "info.main", bg: "action.hover" },
    { title: "Completed Tasks", value: stats.completedTasks, icon: <CheckCircleOutlineIcon />, color: "success.main", bg: "action.hover" },
    { title: "In Progress", value: stats.activeTasks, icon: <AccessTimeIcon />, color: "secondary.main", bg: "action.hover" }
  ];


  return (
    <Box sx={{ p: 3, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4, p: 4, borderRadius: 4, background: `linear-gradient(135deg, ${theme.palette.secondary.dark} 0%, ${theme.palette.secondary.main} 100%)`, color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h3" fontWeight="bold">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 18 ? "Afternoon" : "Evening"}, {user?.name || "Manager"}!
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
              Here's your team overview for today
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: "flex-start", md: "flex-end" }, gap: 2 }}>
            <RealTimeClock />
          </Grid>
        </Grid>
      </Box>
      {/* Stats Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {managerStats.map((stat, index) => (
          <Box key={index} sx={{ width: 190 }}>
            <StatCard {...stat} loading={loading} />
          </Box>
        ))}
      </Box>


      {/* Layout Grid */}
      <Grid container spacing={3}>
        {/* Left column (70%) */}
        <Grid size={{ xs: 12, lg: 8.5 }}>
          <Stack spacing={3}>
            {/* My Profile - Standardized */}
            {/* <ProfileCard user={user} leaveBalance={stats.leaveBalance} /> */}

             <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
           <CardContent>

    {/* Header */}
    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main", mr: 1.5 }}>
          <PersonIcon />
        </Avatar>

             <Typography
               variant="h6"
               fontWeight="bold"
                sx={{ color: "primary.main" }}
             >
               My Profile
             </Typography>
           </Box>
           
       
           {/* Profile Details */}
              <Grid container spacing={2} alignItems="center" justifyContent="space-between">
       
                 {/* Name */}
                 <Grid item xs={12} md={4}>
                   <Typography variant="body2" color="text.secondary">
                     Name
                   </Typography>
                   <Typography
                     variant="h6"
       sx={{ color: "primary.main" }}
                   >
                     {(user && user.name) ? user.name : "-"}
                   </Typography>
                 </Grid>
       
                 {/* Email */}
                 <Grid item xs={12} md={4}>
                   <Typography variant="body2" color="text.secondary">
                     Email
                   </Typography>
                   <Typography
                     variant="h6"
       sx={{ color: "primary.main" }}
                   >
                     {(user && user.email) ? user.email : "-"}
                   </Typography>
                 </Grid>
       
                 {/* Role */}
                 <Grid item xs={12} md={4}>
                   <Typography variant="body2" color="text.secondary">
                     Role
                   </Typography>
                   <Typography
                     variant="h6"
                     sx={{ color: "primary.main" }}
                   >
                     {(user && user.role) ? user.role : "-"}
                   </Typography>
       
                 </Grid>
       
               </Grid>       
            </CardContent>
                 </Card>

            {/* CARD 1: TEAM MEMBERS */}
            <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", mb: 4 }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ color: "secondary.main" }}>
                    Team Members
                  </Typography>
                  <Button size="small" onClick={() => navigate("/employees")}>View All</Button>
                </Box>
                {loading ? (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : teamMembers.length === 0 ? (
                  <Typography variant="body2" color="textSecondary">No team members found</Typography>
                ) : (
                  teamMembers.slice(0, 5).map((member, i) => (
                    <Box key={member.id || i} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: "secondary.light" }}>
                        {member.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="600">{member.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{member.position || member.role}</Typography>
                      </Box>
                    </Box>
                  ))
                )}
              </CardContent>
            </Card>

        {/* CARD 2: TEAM TASKS */}
        <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "error.main" }}>
                Team Tasks
              </Typography>
              <Button size="small" onClick={() => navigate("/tasks")}>View All</Button>
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            ) : pendingTasks.length === 0 ? (
              <Typography variant="body2" color="textSecondary">No pending tasks</Typography>
            ) : (
              pendingTasks.slice(0, 3).map((task, i) => (
                <Box
                  key={task.id || i}
                  sx={{
                    p: 1.5,
                    mb: 1.5,
                    borderRadius: 2,
                    bgcolor: "background.default",
                    border: "1px solid",
                    borderColor: "divider"
                  }}
                >
                  <Typography variant="body2" fontWeight="600" noWrap>{task.title}</Typography>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block' }}>
                    {getEmployeeName(task.assigned_to)} | Due: {task.due_date?.split("T")[0] || "N/A"}
                  </Typography>
                </Box>
              ))
            )}
          </CardContent>
        </Card>

           {/* CARD 1: LEAVE REQUESTS */}
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)", mb: 4 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "warning.main" }}>
                      Leave Requests
                    </Typography>
                    <Button size="small" color="warning" onClick={() => navigate("/leave")}>View All</Button>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                      <CircularProgress size={24} color="warning" />
                    </Box>
                  ) : leaveRequests.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">No pending leaves</Typography>
                  ) : (
                    leaveRequests.map((leave, i) => (
                      <Box key={leave.id || i} sx={{ p: 1.5, mb: 1, borderRadius: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
                        <Typography variant="body2" fontWeight="600">{leave.name || getEmployeeName(leave.employee_id)}</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                          {leave.start_date?.split("T")[0]} to {leave.end_date?.split("T")[0]}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button size="small" variant="contained" color="success" sx={{ fontSize: '0.65rem', px: 1 }} onClick={() => handleApproveLeave(leave.id)}>Approve</Button>
                          <Button size="small" variant="outlined" color="error" sx={{ fontSize: '0.65rem', px: 1 }} onClick={() => handleRejectLeave(leave.id)}>Reject</Button>
                        </Box>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* CARD 2: WFH REQUESTS */}
              <Card sx={{ borderRadius: 3, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: "info.main" }}>
                      WFH Requests
                    </Typography>
                    <Button size="small" color="info" onClick={() => navigate("/wfh")}>View All</Button>
                  </Box>

                  {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                      <CircularProgress size={24} color="info" />
                    </Box>
                  ) : wfhList.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">No pending WFH</Typography>
                  ) : (
                    wfhList.map((wfh, i) => (
                      <Box key={wfh.id || i} sx={{ p: 1.5, mb: 1, borderRadius: 2, bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
                        <Typography variant="body2" fontWeight="600">{wfh.name || getEmployeeName(wfh.employee_id)}</Typography>
                        <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 1 }}>
                          {wfh.start_date?.split("T")[0]} to {wfh.end_date?.split("T")[0]}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button size="small" variant="contained" color="info" sx={{ fontSize: '0.65rem', px: 1, color: 'white' }} onClick={() => handleApproveWFH(wfh.id)}>Approve</Button>
                          <Button size="small" variant="outlined" color="error" sx={{ fontSize: '0.65rem', px: 1 }} onClick={() => handleRejectWFH(wfh.id)}>Reject</Button>
                        </Box>
                      </Box>
                    ))
                  )}
                </CardContent>
              </Card>
          </Stack>
        </Grid>

        {/* Right column (30%) */}
        <Grid size={{ xs: 12, lg: 3.5 }}>
          <Stack spacing={3}>
            <QuickActions role="manager" />
            <AnnouncementCard announcements={announcements} loading={loading} />
            <HolidayCard holidays={holidays} loading={loading} />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
