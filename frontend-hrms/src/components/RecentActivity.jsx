import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";

export default function RecentActivity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Fetch recent activities from API (you'll need to create this endpoint)
      const response = await fetch("http://localhost:5000/api/dashboard/recent-activity");
      const data = await response.json();
      setActivities(data.slice(0, 5)); // Show last 5 activities
    } catch (err) {
      console.error("Failed to load recent activities:", err);
      setActivities([
        "No recent activities found",
        "Check attendance records",
        "Review leave requests",
        "Pending tasks available"
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card sx={{ marginTop: 3 }}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <CircularProgress size={24} />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Loading recent activities...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ marginTop: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Recent Activity
        </Typography>
        {activities.length > 0 ? (
          activities.map((activity, index) => (
            <Typography key={index} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#3B82F6' }} />
              {activity}
            </Typography>
          ))
        ) : (
          <Typography color="textSecondary">
            No recent activities. Everything looks good!
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

