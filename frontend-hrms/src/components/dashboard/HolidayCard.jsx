import React from 'react';
import { Box, Card, CardContent, Typography, Button, Divider } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import { useNavigate } from 'react-router-dom';

const HolidayCard = ({ holidays = [], loading = false }) => {
  const navigate = useNavigate();
  const upcomingHolidays = holidays
    .filter(h => new Date(h.holiday_date) >= new Date().setHours(0,0,0,0))
    .slice(0, 3);

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2, height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <EventIcon sx={{ color: "primary.main" }} />
            <Typography variant="h6" fontWeight="bold" sx={{ color: "primary.main" }}>
              Upcoming Holidays
            </Typography>
          </Box>
          <Button size="small" onClick={() => navigate("/holidays")}>View All</Button>
        </Box>
        
        {loading ? (
          <Typography color="textSecondary" align="center">Loading...</Typography>
        ) : upcomingHolidays.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
            No upcoming holidays
          </Typography>
        ) : (
          upcomingHolidays.map((holiday, i) => (
            <React.Fragment key={holiday.id}>
              <Box sx={{ py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography fontWeight="600">{holiday.title}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(holiday.holiday_date).toLocaleDateString([], { day: 'numeric', month: 'long', weekday: 'short' })}
                  </Typography>
                </Box>
                <Box sx={{ 
                  bgcolor: "primary.light", 
                  color: "primary.dark", 
                  p: 1, 
                  borderRadius: 2, 
                  textAlign: "center",
                  minWidth: 50
                }}>
                  <Typography variant="h6" fontWeight="bold" lineHeight={1}>
                    {new Date(holiday.holiday_date).getDate()}
                  </Typography>
                  <Typography variant="caption" fontWeight="bold">
                    {new Date(holiday.holiday_date).toLocaleDateString([], { month: 'short' }).toUpperCase()}
                  </Typography>
                </Box>
              </Box>
              {i < upcomingHolidays.length - 1 && <Divider />}
            </React.Fragment>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default HolidayCard;
