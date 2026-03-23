import React from "react";
import { Card, CardContent, Typography, Button, Box, useTheme, Stack } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useNavigate } from "react-router-dom";

const PayslipCard = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card sx={{ 
      borderRadius: 3, 
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      background: `linear-gradient(135deg, ${theme.palette.success.light}88 0%, #ffffff 100%)`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        position: 'absolute', 
        top: -15, 
        right: -15, 
        opacity: 0.1,
        transform: 'rotate(20deg)'
      }}>
        <AttachMoneyIcon sx={{ fontSize: 100, color: 'success.main' }} />
      </Box>
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: "success.dark", mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <AttachMoneyIcon fontSize="small" /> My Payslips
        </Typography>
        
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Typography variant="body2" color="textSecondary">
            Quickly access your monthly salary statements and tax documents.
          </Typography>

          <Button 
            variant="contained" 
            color="success" 
            fullWidth
            onClick={() => navigate("/salary")}
            sx={{ borderRadius: 2, fontWeight: 'bold', textTransform: 'none' }}
          >
            View My Payslips
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PayslipCard;
