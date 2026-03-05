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
import AddIcon from "@mui/icons-material/Add";

const DepartmentPage = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchDepartments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/departments/all");
      if (!res.ok) throw new Error("Failed to fetch departments");
      setDepartments(await res.json());
    } catch (error) {
      console.error("Error:", error);
      setErrorMsg("Failed to load departments");
    }
  };

  const addDepartment = async () => {
    if (!name) {
      setErrorMsg("Please enter department name");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/departments/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
      });

      if (!res.ok) throw new Error("Failed to add department");

      setName("");
      setDescription("");
      setSuccessMsg("Department added successfully");
      setErrorMsg("");
      fetchDepartments();
    } catch (error) {
      setErrorMsg("Failed to add department");
      setSuccessMsg("");
    }
  };

  const handleEditClick = (dept) => {
    setEditId(dept.id);
    setEditName(dept.name);
    setEditDescription(dept.description || "");
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editName) {
      setErrorMsg("Please enter department name");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/departments/update/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, description: editDescription })
      });

      if (!res.ok) throw new Error("Failed to update department");

      setEditOpen(false);
      setSuccessMsg("Department updated successfully");
      setErrorMsg("");
      fetchDepartments();
    } catch (error) {
      setErrorMsg("Failed to update department");
      setSuccessMsg("");
    }
  };

  const deleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/departments/delete/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete department");

      setSuccessMsg("Department deleted successfully");
      setErrorMsg("");
      fetchDepartments();
    } catch (error) {
      setErrorMsg("Failed to delete department");
      setSuccessMsg("");
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#1E3A8A" }}>
        Department Management
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
        <Typography variant="h6" sx={{ mb: 2 }}>Add New Department</Typography>
        <Stack spacing={2}>
          <TextField
            label="Department Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
          />
          <Button variant="contained" onClick={addDepartment} startIcon={<AddIcon />}>
            Add Department
          </Button>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">No departments found</TableCell>
              </TableRow>
            ) : (
              departments.map((dept) => (
                <TableRow key={dept.id} hover>
                  <TableCell>{dept.id}</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>{dept.name}</TableCell>
                  <TableCell>{dept.description}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditClick(dept)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => deleteDepartment(dept.id)} size="small">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Department</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Department Name *"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DepartmentPage;