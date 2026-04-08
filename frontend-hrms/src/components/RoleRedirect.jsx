import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardRoute } from './ProtectedRoute';

const RoleRedirect = () => {
  const navigate = useNavigate();
  const userData = localStorage.getItem('user');

  useEffect(() => {
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const dashboardPath = getDashboardRoute(user.role);
        navigate(dashboardPath, { replace: true });
      } catch (error) {
        console.error('Invalid user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      }
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  return null;
};

export default RoleRedirect;
