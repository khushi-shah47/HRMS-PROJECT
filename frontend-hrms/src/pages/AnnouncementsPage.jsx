import React, { useEffect, useState, useMemo } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  IconButton,
  Box,
  Card,
  CardContent,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  InputAdornment,
  useTheme
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CampaignIcon from "@mui/icons-material/Campaign";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import api from "../services/api";

const AnnouncementsPage = () => {
  const theme = useTheme();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteTitle, setDeleteTitle] = useState("");

  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const user = JSON.parse(localStorage.getItem("user"));
  const canManage = user?.role === "admin" || user?.role === "hr";

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get("/announcements");
      setAnnouncements(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      showSnackbar("Failed to load announcements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const filteredAnnouncements = useMemo(() => {
    return announcements.filter(a => 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (a.content && a.content.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [announcements, searchQuery]);

  const handleCreateOpen = () => {
    setTitle("");
    setContent("");
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setCreateDialogOpen(false);
    setTitle("");
    setContent("");
  };

  const createAnnouncement = async () => {
    if (!title.trim()) {
      showSnackbar("Please enter announcement title", "error");
      return;
    }

    setBtnLoading(true);
    try {
      await api.post("/announcements", { title: title.trim(), content: content.trim() });
      handleCreateClose();
      showSnackbar("Announcement posted successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      showSnackbar(error.response?.data?.message || "Failed to create announcement", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleDeleteClick = (announcement) => {
    setDeleteId(announcement.id);
    setDeleteTitle(announcement.title);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteId(null);
    setDeleteTitle("");
  };

  const confirmDelete = async () => {
    setBtnLoading(true);
    try {
      await api.delete(`/announcements/${deleteId}`);
      handleDeleteClose();
      showSnackbar("Announcement deleted successfully");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      showSnackbar("Failed to delete announcement", "error");
    } finally {
      setBtnLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = diffTime / (1000 * 60 * 60);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffHours < 1) return "Just now";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const isNew = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return (now - date) < (1000 * 60 * 60 * 24); // Within 24 hours
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
      {/* Page Header - Consistent with other modules */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 1, bgcolor: "rgba(255,255,255,0.2)", borderRadius: 1.5 }}>
              <CampaignIcon sx={{ fontSize: 32, color: "white" }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ color: "white", fontWeight: "bold" }}>
                Company Announcements
              </Typography>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                Stay updated with the latest news and updates
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            {canManage && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleCreateOpen}
                sx={{ 
                  bgcolor: "background.paper", 
                  color: "primary.main", 
                  px: 2,
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "action.hover" }
                }}
              >
                Create New
              </Button>
            )}
            <Tooltip title="Reload">
              <IconButton 
                onClick={fetchAnnouncements} 
                sx={{ color: "white" }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Toolbar - Consistent with other modules */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            placeholder="Search announcements by title or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            fullWidth
            sx={{ maxWidth: 500 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Chip 
            label={`${filteredAnnouncements.length} results`} 
            color="primary" 
            variant="outlined" 
            size="small"
          />
        </Stack>
      </Paper>

      {/* Announcements List Container - Consistent "shape" with other pages */}
      <Paper sx={{ p: 0, overflow: "hidden", borderRadius: 2 }}>
        {loading && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, gap: 2 }}>
            <CircularProgress size={50} thickness={4} />
            <Typography color="text.secondary" fontWeight={500}>Fetching announcements...</Typography>
          </Box>
        )}

        {!loading && filteredAnnouncements.length === 0 && (
          <Box 
            sx={{ 
              p: 10, 
              textAlign: "center", 
              bgcolor: "background.paper"
            }}
          >
            <SpeakerNotesOffIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "text.secondary", fontWeight: 700 }}>
              {searchQuery ? "No matches found" : "No announcements posted yet."}
            </Typography>
            {searchQuery && (
              <Button 
                onClick={() => setSearchQuery("")} 
                sx={{ mt: 2 }}
                size="small"
              >
                Clear Search
              </Button>
            )}
          </Box>
        )}

        {!loading && filteredAnnouncements.length > 0 && (
          <Stack spacing={0} divider={<Divider />}>
            {filteredAnnouncements.map((announcement) => {
              const isRecent = isNew(announcement.created_at);
              return (
                <Box 
                  key={announcement.id} 
                  sx={{ 
                    p: 4, 
                    transition: "all 0.2s",
                    position: "relative",
                    "&:hover": { bgcolor: "action.hover" },
                    "&::before": isRecent ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      background: theme.palette.primary.main
                    } : {}
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                          {announcement.title}
                        </Typography>
                        {isRecent && (
                          <Chip 
                            label="New" 
                            size="small" 
                            color="primary"
                            sx={{ 
                              height: 20, 
                              fontSize: "0.65rem", 
                              fontWeight: 900,
                              textTransform: "uppercase" 
                            }} 
                          />
                        )}
                      </Box>
                      <Typography variant="body1" sx={{ color: "text.secondary", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                        {announcement.content}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
                          {formatDate(announcement.created_at)}
                        </Typography>
                        {canManage && (
                          <Tooltip title="Delete">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleDeleteClick(announcement)}
                              sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: "text.primary" }}>
                          {announcement.author_name || "System Admin"}
                        </Typography>
                        <PersonIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        )}
      </Paper>

      {/* Create Announcement Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={handleCreateClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5" component="div" fontWeight={800} color="text.primary">
            Post Announcement
          </Typography>
          <Typography variant="body2" component="div" color="text.secondary">
            Broadcasting to all team members
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Subject / Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              required
              variant="filled"
              placeholder="E.g. Team Meeting Tomorrow"
              InputProps={{ disableUnderline: true, sx: { borderRadius: 2, bgcolor: "background.default" } }}
            />
            <TextField
              label="Message Body"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              multiline
              rows={5}
              fullWidth
              variant="filled"
              placeholder="Provide more details here..."
              InputProps={{ disableUnderline: true, sx: { borderRadius: 2, bgcolor: "background.default" } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleCreateClose} color="inherit" sx={{ fontWeight: 600 }}>
            Dismiss
          </Button>
          <Button 
            variant="contained" 
            onClick={createAnnouncement}
            disabled={btnLoading || !title.trim()}
            sx={{ px: 4, py: 1.2, borderRadius: 2.5, fontWeight: 700, boxShadow: 3 }}
          >
            {btnLoading ? <CircularProgress size={24} color="inherit" /> : "Broadcast Now"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={handleDeleteClose} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle>
          <Typography variant="h6" component="div" fontWeight={800}>Delete Announcement?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            Are you sure you want to delete <strong>"{deleteTitle}"</strong>? This message will be permanently removed for all employees.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleDeleteClose} color="inherit" sx={{ fontWeight: 600 }}>Keep it</Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={confirmDelete}
            disabled={btnLoading}
            sx={{ px: 3, fontWeight: 700, borderRadius: 2 }}
          >
            {btnLoading ? <CircularProgress size={22} color="inherit" /> : "Delete Permanently"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ borderRadius: 3, px: 3, py: 1, fontWeight: 600, boxShadow: 5 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AnnouncementsPage;
