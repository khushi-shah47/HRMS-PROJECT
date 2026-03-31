import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  Card,
  CardContent,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TablePagination,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import PolicyIcon from "@mui/icons-material/Policy";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import api from "../services/api";

const PolicyPage = () => {
  const theme = useTheme();
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const canManage = ["admin", "hr"].includes(user?.role);
  const isIntern = user?.role === "intern";

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await api.get("/policies/all");
      setPolicies(res.data);
    } catch (error) {
      console.error("Error fetching policies:", error);
      showSnackbar("Failed to load policies", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDescription("");
  };

  const handleAddOpen = () => {
    resetForm();
    setAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    resetForm();
  };

  const addPolicy = async () => {
    if (!title || !description) {
      showSnackbar("Please enter policy title and description", "error");
      return;
    }

    setLoading(true);
    try {
      await api.post("/policies/add", { title, description });
      handleAddClose();
      showSnackbar("Policy added successfully");
      fetchPolicies();
    } catch (error) {
      showSnackbar("Failed to add policy", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (policy) => {
    setDeleteId(policy.id);
    setDeleteTitle(policy.title);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteTitle("");
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await api.delete(`/policies/delete/${deleteId}`);
      handleDeleteClose();
      showSnackbar("Policy deleted successfully");
      fetchPolicies();
    } catch (error) {
      showSnackbar("Failed to delete policy", "error");
    } finally {
      setLoading(false);
    }
  };

  const companyGuidelines = [
    {
      icon: <AccessTimeIcon sx={{ color: "primary.main" }} />,
      title: "Working Hours",
      description: "Standard working hours are 9:00 AM to 6:00 PM, Monday through Friday.",
      color: "action.hover"
    },
    {
      icon: <EventAvailableIcon sx={{ color: "success.main" }} />,
      title: "Attendance Policy",
      description: "Employees are required to mark their attendance daily. Late arrivals should be reported to your manager.",
      color: "action.hover"
    },
    {
      icon: <BeachAccessIcon sx={{ color: "warning.main" }} />,
      title: "Leave Policy",
      description: "Employees can apply for leave through the Leave request system. Leave requests should be submitted in advance.",
      color: "action.hover"
    },
    {
      icon: <HomeWorkIcon sx={{ color: "info.main" }} />,
      title: "Work From Home",
      description: "WFH requests must be approved by the manager. Employees should maintain productivity while working remotely.",
      color: "action.hover"
    },
    {
      icon: <AttachMoneyIcon sx={{ color: "secondary.main" }} />,
      title: "Salary",
      description: "Salary is calculated based on working days, present days, and leave days. Salary reports can be viewed in the Salary section.",
      color: "action.hover"
    }
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ p: 3, mb: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <PolicyIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Company Policies
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                View and manage company policies
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {canManage && (
            //   <Button
            //     variant="contained"
            //     startIcon={<AddIcon />}
            //     onClick={handleAddOpen}
            //     sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "action.hover" } }}
            //   >
            //     Add Policy
            //   </Button>
            // )}
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddOpen}
                sx={(theme) => ({
                  // Base background changes with theme
                  bgcolor: theme.palette.mode === "light" 
                    ? theme.palette.common.white 
                    : theme.palette.grey[900],

                  // Text color: dark blue in light, sky blue in dark
                  color: theme.palette.mode === "light" 
                    ? "#0d47a1"   // dark blue
                    : "#38bdf8",  // sky blue

                  boxShadow: "none",

                  "&:hover": {
                    bgcolor: theme.palette.mode === "light" 
                      ? theme.palette.common.white 
                      : theme.palette.grey[900],
                    color: theme.palette.mode === "light" 
                      ? "#0d47a1" 
                      : "#38bdf8",
                    boxShadow: "none",
                  },

                  "&:active": {
                    bgcolor: theme.palette.mode === "light" 
                      ? theme.palette.common.white 
                      : theme.palette.grey[900],
                    color: theme.palette.mode === "light" 
                      ? "#0d47a1" 
                      : "#38bdf8",
                    boxShadow: "none",
                  },
                })}
              >
                Add Policy
              </Button>
            )}
            <Tooltip title="Refresh">
              <IconButton onClick={fetchPolicies} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Company Guidelines Cards */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
        Company Guidelines
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {companyGuidelines.map((guideline, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: "100%", bgcolor: "action.hover", border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  {guideline.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    {guideline.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {guideline.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Custom Policies Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Custom Policies
        </Typography>
        <Chip 
          label={`${policies.length} policies`} 
          color="primary" 
          variant="outlined" 
        />
      </Box>

      <Paper sx={{ overflow: "hidden", bgcolor: "background.paper" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress sx={{ color: "primary.main" }} />
          </Box>
        )}

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              {canManage && <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading && policies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No custom policies found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              policies
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((policy) => (
                  <TableRow key={policy.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{policy.title}</TableCell>
                    <TableCell>{policy.description}</TableCell>
                    {canManage && (
                      <TableCell align="center">
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(policy)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={policies.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add Policy Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon />
            Add New Policy
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Policy Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleAddClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={addPolicy}
            disabled={loading}
            sx={{ bgcolor: "primary.main", "&:hover": { bgcolor: "primary.dark" } }}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            Add Policy
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteClose} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: "error.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <DeleteIcon />
            Confirm Delete
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Are you sure you want to delete policy <strong>"{deleteTitle}"</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleDeleteClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={confirmDelete}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DeleteIcon />}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PolicyPage;