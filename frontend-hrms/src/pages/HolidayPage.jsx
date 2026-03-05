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
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const HolidayPage = () => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [holidays, setHolidays] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const fetchHolidays = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/holidays/all");
      if (!res.ok) {
        throw new Error("Failed to fetch holidays");
      }
      const data = await res.json();
      // Format the date for display
      const formatted = data.map(h => ({
        ...h,
        holiday_date: h.holiday_date ? h.holiday_date.split('T')[0] : ''
      }));
      setHolidays(formatted);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setErrorMsg("Failed to load holidays");
    }
  };

  const addHoliday = async () => {
    if (!title || !date) {
      setErrorMsg("Please enter holiday name and date");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:5000/api/holidays/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          holiday_date: date,
          description: desc
        })
      });
      
      if (!res.ok) {
        throw new Error("Failed to add holiday");
      }
      
      setTitle("");
      setDate("");
      setDesc("");
      setSuccessMsg("Holiday added successfully");
      setErrorMsg("");
      fetchHolidays();
    } catch (error) {
      setErrorMsg("Failed to add holiday");
      setSuccessMsg("");
    }
  };

  const handleEditClick = (holiday) => {
    setEditId(holiday.id);
    setEditTitle(holiday.title);
    setEditDate(holiday.holiday_date);
    setEditDesc(holiday.description || "");
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editTitle || !editDate) {
      setErrorMsg("Please enter holiday name and date");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/holidays/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          holiday_date: editDate,
          description: editDesc
        })
      });

      if (!res.ok) {
        throw new Error("Failed to update holiday");
      }

      setEditOpen(false);
      setSuccessMsg("Holiday updated successfully");
      setErrorMsg("");
      fetchHolidays();
    } catch (error) {
      setErrorMsg("Failed to update holiday");
      setSuccessMsg("");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this holiday?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/holidays/delete/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete holiday");
      }

      setSuccessMsg("Holiday deleted successfully");
      setErrorMsg("");
      fetchHolidays();
    } catch (error) {
      setErrorMsg("Failed to delete holiday");
      setSuccessMsg("");
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#1E3A8A" }}>
        Holiday Calendar Management
      </Typography>

      {errorMsg && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMsg("")}>
          {errorMsg}
        </Alert>
      )}

      {successMsg && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMsg("")}>
          {successMsg}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Holiday
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Holiday Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <TextField
            type="date"
            label="Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />

          <TextField
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />

          <Button variant="contained" onClick={addHoliday} sx={{ mt: 1 }}>
            Add Holiday
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Holiday</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Date</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {holidays.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No holidays found
                </TableCell>
              </TableRow>
            ) : (
              holidays.map((h) => (
                <TableRow key={h.id} hover>
                  <TableCell>{h.title}</TableCell>
                  <TableCell>{h.holiday_date}</TableCell>
                  <TableCell>{h.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(h)}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(h.id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Holiday</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Holiday Name"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              fullWidth
            />
            <TextField
              type="date"
              label="Date"
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="Description"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default HolidayPage;