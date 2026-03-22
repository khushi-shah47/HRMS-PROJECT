import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Grid, Tooltip, CircularProgress, Badge } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import api from '../../services/api';

const AttendanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendance, setAttendance] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      
      const [attRes, holRes] = await Promise.all([
        api.get(`/attendance/month?month=${month}&year=${year}`),
        api.get('/holidays')
      ]);
      
      setAttendance(attRes.data || []);
      setHolidays(holRes.data || []);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getStatus = (day) => {
    if (!day) return null;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    // Check holiday first
    const holiday = holidays.find(h => h.holiday_date.split('T')[0] === dateStr);
    if (holiday) return { type: 'holiday', color: 'info.main', label: `Holiday: ${holiday.title}` };

    // Check attendance
    const record = attendance.find(a => a.date.split('T')[0] === dateStr);
    if (record) {
      if (record.work_type === 'present') return { type: 'present', color: 'success.main', label: 'Present' };
      if (record.work_type === 'wfh') return { type: 'wfh', color: 'secondary.main', label: 'WFH' };
      if (record.work_type === 'leave') return { type: 'leave', color: 'warning.main', label: 'Leave' };
    }

    // Check if it's a weekend
    const dateObj = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (dateObj.getDay() === 0 || dateObj.getDay() === 6) return { type: 'weekend', color: 'text.secondary', label: 'Weekend' };

    // Past date and no record -> Absent
    if (dateObj < new Date().setHours(0,0,0,0)) return { type: 'absent', color: 'error.main', label: 'Absent' };

    return null;
  };

  return (
    <Box sx={{ 
      p: 2, 
      bgcolor: 'background.paper', 
      borderRadius: 3, 
      boxShadow: 2,
      minWidth: 280,
      maxWidth: 320
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'primary.main' }}>
          {monthYear}
        </Typography>
        <Box>
          <IconButton size="small" onClick={handlePrevMonth}><ChevronLeftIcon /></IconButton>
          <IconButton size="small" onClick={handleNextMonth}><ChevronRightIcon /></IconButton>
        </Box>
      </Box>

      <Grid container spacing={0.5}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <Grid item xs={1.7} key={day}>
            <Typography variant="caption" align="center" display="block" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              {day}
            </Typography>
          </Grid>
        ))}
        {days.map((day, idx) => {
          const status = getStatus(day);
          const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
          
          return (
            <Grid item xs={1.7} key={idx}>
              {day ? (
                <Tooltip title={status?.label || ''} arrow>
                  <Box sx={{ 
                    aspectRatio: '1/1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'default',
                    borderRadius: '50%',
                    border: isToday ? '2px solid' : 'none',
                    borderColor: 'primary.main',
                    '&:hover': { background: 'action.hover' }
                  }}>
                    <Typography variant="caption" sx={{ 
                      fontWeight: isToday ? 'bold' : 'normal',
                      color: isToday ? 'primary.main' : 'inherit'
                    }}>
                      {day}
                    </Typography>
                    {status && (
                      <Box sx={{ 
                        position: 'absolute', 
                        bottom: 4, 
                        width: 4, 
                        height: 4, 
                        borderRadius: '50%', 
                        bgcolor: status.color 
                      }} />
                    )}
                  </Box>
                </Tooltip>
              ) : <Box sx={{ aspectRatio: '1/1' }} />}
            </Grid>
          );
        })}
      </Grid>
      
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <CircularProgress size={20} />
        </Box>
      )}

      {/* Legend */}
      <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1, borderTop: '1px solid', borderColor: 'divider', pt: 1 }}>
        {[
          { color: 'success.main', label: 'P' },
          { color: 'secondary.main', label: 'W' },
          { color: 'warning.main', label: 'L' },
          { color: 'error.main', label: 'A' },
          { color: 'info.main', label: 'H' }
        ].map(item => (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: item.color }} />
            <Typography variant="caption" sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AttendanceCalendar;
