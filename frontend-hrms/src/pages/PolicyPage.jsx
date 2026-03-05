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
  Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const PolicyPage = () => {
  const [policies, setPolicies] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchPolicies = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/policies/all");
      if (!res.ok) {
        throw new Error("Failed to fetch policies");
      }
      setPolicies(await res.json());
    } catch (error) {
      console.error("Error fetching policies:", error);
      setErrorMsg("Failed to load policies");
    }
  };

  const addPolicy = async () => {
    if (!title || !description) {
      setErrorMsg("Please enter policy title and description");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/policies/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });

      if (!res.ok) {
        throw new Error("Failed to add policy");
      }

      setTitle("");
      setDescription("");
      setSuccessMsg("Policy added successfully");
      setErrorMsg("");
      fetchPolicies();
    } catch (error) {
      setErrorMsg("Failed to add policy");
      setSuccessMsg("");
    }
  };

  const deletePolicy = async (id) => {
    if (!window.confirm("Are you sure you want to delete this policy?")) {
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/policies/delete/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        throw new Error("Failed to delete policy");
      }

      setSuccessMsg("Policy deleted successfully");
      setErrorMsg("");
      fetchPolicies();
    } catch (error) {
      setErrorMsg("Failed to delete policy");
      setSuccessMsg("");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, color: "#1E3A8A" }}>
        Company Policies Management
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

      {/* Add Policy Form */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Add New Policy
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Policy Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
          <Button 
            variant="contained" 
            onClick={addPolicy}
            startIcon={<AddIcon />}
            sx={{ mt: 1 }}
          >
            Add Policy
          </Button>
        </Stack>
      </Paper>

      {/* Policies List */}
      <Paper sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ p: 2, pb: 0 }}>
          Company Guidelines
        </Typography>
        
        {/* Static Company Policies */}
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "#1E3A8A" }}>
            Working Hours
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Standard working hours are 9:00 AM to 6:00 PM, Monday through Friday.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "#1E3A8A" }}>
            Attendance Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Employees are required to mark their attendance daily. Late arrivals should be reported.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "#1E3A8A" }}>
            Leave Policy
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Employees can apply for leave through the WFH/Leave request system. Leave requests should be submitted in advance.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "#1E3A8A" }}>
            Work From Home
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            WFH requests must be approved by the manager. Employees should maintain productivity while working remotely.
          </Typography>

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1, color: "#1E3A8A" }}>
            Salary
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Salary is calculated based on working days, present days, and leave days. Salary reports can be viewed in the Salary section.
          </Typography>
        </Box>
      </Paper>

      {/* Custom Policies from Database */}
      <Paper>
        <Typography variant="h6" sx={{ p: 2 }}>
          Custom Policies
        </Typography>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {policies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No custom policies found
                </TableCell>
              </TableRow>
            ) : (
              policies.map((policy) => (
                <TableRow key={policy.id} hover>
                  <TableCell sx={{ fontWeight: "bold" }}>{policy.title}</TableCell>
                  <TableCell>{policy.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => deletePolicy(policy.id)}
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
    </Container>
  );
};

export default PolicyPage;
