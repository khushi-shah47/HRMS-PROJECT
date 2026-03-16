import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use((config) => {

  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Dashboard API functions
export const getRoleStats = () => api.get('/dashboard/role-stats');
export const getDashboardStats = () => api.get('/dashboard/stats');

export default api;

