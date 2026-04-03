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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  Chip,
  InputAdornment,
  useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RefreshIcon from "@mui/icons-material/Refresh";
import EventIcon from "@mui/icons-material/Event";
import SearchIcon from "@mui/icons-material/Search";
import api from "../services/api";

const HolidayPage = () => {
  const theme = useTheme();
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const canManage = ["admin", "hr"].includes(user?.role);
  const isIntern = user?.role === "intern";

  const formatDateSafe = (dateStr) => {
    if (!dateStr) return "";

    // handle both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ss"
    const clean = dateStr.split("T")[0];

    const [y, m, d] = clean.split("-");
    return `${d}-${m}-${y}`; // 🔥 no timezone issue ever
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchHolidays = async () => {
    setLoading(true);
    try {
      const res = await api.get("/holidays/all");
      const formatted = res.data.map(h => {
        let date = h.holiday_date;

        if (date) {
          // 🔥 force local date (no timezone shift)
          const d = new Date(date);
          date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        }

        return {
          ...h,
          holiday_date: date || ""
        };
      });
      setHolidays(formatted);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      showSnackbar("Failed to load holidays", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const resetAddForm = () => {
    setTitle("");
    setDate("");
    setDesc("");
  };

  const handleAddOpen = () => {
    resetAddForm();
    setAddDialogOpen(true);
  };

  const handleAddClose = () => {
    setAddDialogOpen(false);
    resetAddForm();
  };

  const addHoliday = async () => {
    if (!title || !date) {
      showSnackbar("Please enter holiday name and date", "error");
      return;
    }
    
    setLoading(true);
    try {
      await api.post("/holidays/add", {
        title,
        holiday_date: date,
        description: desc
      });
      
      handleAddClose();
      showSnackbar("Holiday added successfully");
      fetchHolidays();
    } catch (error) {
      showSnackbar("Failed to add holiday", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (holiday) => {
    setEditId(holiday.id);
    setEditTitle(holiday.title);
    setEditDate(holiday.holiday_date);
    setEditDesc(holiday.description || "");
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const handleEditSave = async () => {
    if (!editTitle || !editDate) {
      showSnackbar("Please enter holiday name and date", "error");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/holidays/update/${editId}`, {
        title: editTitle,
        holiday_date: editDate,
        description: editDesc
      });

      handleEditClose();
      showSnackbar("Holiday updated successfully");
      fetchHolidays();
    } catch (error) {
      showSnackbar("Failed to update holiday", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (holiday) => {
    setDeleteId(holiday.id);
    setDeleteTitle(holiday.title);
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
      await api.delete(`/holidays/delete/${deleteId}`);
      handleDeleteClose();
      showSnackbar("Holiday deleted successfully");
      fetchHolidays();
    } catch (error) {
      showSnackbar("Failed to delete holiday", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredHolidays = holidays.filter(h =>
    h.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isUpcoming = (dateStr) => {
    const holidayDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return holidayDate >= today;
  };
  const getStatusChip = (status) => {
    const isUpcomingStatus = status === "Upcoming";
    return (
      <Chip
        label={status}
        size="small"
        sx={{
          bgcolor: isUpcomingStatus ? "success.light" : "action.hover",
          color: isUpcomingStatus ? "success.dark" : "text.secondary",
          fontWeight: "bold",
        }}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Page Header */}
      <Paper sx={{ p: 3, mb: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <EventIcon sx={{ fontSize: 40, color: "white" }} />
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Holiday Calendar
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Manage company holidays
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {canManage && (
              <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddOpen}
                  sx={(theme) => ({
                  bgcolor: "background.paper",
                  color: "primary.main",

                  "&:hover": {
                    bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#121212",
                  },

                  "&:active": {
                    bgcolor: theme.palette.mode === "light" ? "#ffffff" : "#121212",
                  },
                })}
                >
                  Add Holiday
                </Button>
            )}
            <Tooltip title="Refresh">
              <IconButton onClick={fetchHolidays} sx={{ color: "white" }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search holidays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ minWidth: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          /> 
          <Chip
              label={`${filteredHolidays.length} holidays`}
              variant="outlined" // outlined style
              sx={(theme) => ({
                color: theme.palette.mode === "light"
                  ? "#0d47a1"   // dark blue
                  : "#38bdf8",  // sky blue
                borderColor: theme.palette.mode === "light"
                  ? "#0d47a1"
                  : "#38bdf8",
                bgcolor: "transparent", // keep background transparent
              })}
            />
        </Stack>
      </Paper>

      {/* Data Table */}
      <Paper sx={{ overflow: "hidden", bgcolor: "background.paper" }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
            <CircularProgress sx={{ color: "secondary.main" }} />
          </Box>
        )}

        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Holiday</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
              {!isIntern && <TableCell sx={{ fontWeight: "bold" }} align="center">Actions</TableCell>}
            </TableRow>
          </TableHead>

          <TableBody>
            {!loading && filteredHolidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No holidays found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredHolidays
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((h) => (
                  <TableRow key={h.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{h.title}</TableCell>
                    <TableCell>
                      <Chip 
                        label={formatDateSafe(h.holiday_date)}
                        size="small" 
                        icon={<EventIcon fontSize="small" />}
                        variant="outlined"
                        sx={{ color: "primary.main", borderColor: "primary.main" }}
                      />
                    </TableCell>
                    <TableCell>{h.description || "-"}</TableCell>
                    <TableCell>{getStatusChip(isUpcoming(h.holiday_date) ? "Upcoming" : "Past")}</TableCell>
                    {canManage && (
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(h)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(h)}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredHolidays.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>

      {/* Add Holiday Dialog */}
      <Dialog open={addDialogOpen} onClose={handleAddClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "secondary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AddIcon />
            Add New Holiday
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Holiday Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleAddClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={addHoliday}
            disabled={loading}
            sx={{ bgcolor: "secondary.main", "&:hover": { bgcolor: "secondary.dark" } }}
            startIcon={loading ? <CircularProgress size={20} /> : <AddIcon />}
          >
            Add Holiday
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Holiday Dialog */}
      <Dialog open={editOpen} onClose={handleEditClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EditIcon />
            Edit Holiday
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Holiday Name"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
              required
            />
            <TextField
              type="date"
              label="Date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
            <TextField
              label="Description"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button onClick={handleEditClose} color="inherit">Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleEditSave}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Save Changes"}
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
            Are you sure you want to delete <strong>"{deleteTitle}"</strong>?
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

export default HolidayPage;