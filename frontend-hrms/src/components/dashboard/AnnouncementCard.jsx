import React from 'react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import { useNavigate } from 'react-router-dom';

const AnnouncementCard = ({ announcements = [], loading = false }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CampaignIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
              Announcements
            </Typography>
          </Box>
          <Button size="small" onClick={() => navigate("/announcements")}>View All</Button>
        </Box>
        
        {loading ? (
          <Typography color="textSecondary" align="center">Loading...</Typography>
        ) : announcements.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No recent announcements
          </Typography>
        ) : (
          announcements.slice(0, 3).map((ann) => (
            <Box 
              key={ann.id} 
              sx={{ 
                p: 2, 
                mb: 2, 
                borderRadius: 2, 
                bgcolor: "action.hover", 
                borderLeft: "4px solid",
                borderLeftColor: "primary.main",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateX(4px)" }
              }}
            >
              <Typography fontWeight="600" sx={{ color: "primary.main" }}>{ann.title}</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                {ann.content?.substring(0, 80)}{ann.content?.length > 80 ? "..." : ""}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
                {new Date(ann.created_at).toLocaleDateString()}
              </Typography>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AnnouncementCard;
