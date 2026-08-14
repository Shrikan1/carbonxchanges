// src/api/endpoints/dashboardApi.js
import api from '../axiosInstance';

export const getSellerDashboard = () => api.get('/v1/dashboard');
export const getAdminDashboard = () => api.get('/v1/admin/dashboard');
export const getAgentDashboard = () => api.get('/v1/agent/dashboard');
export const getBuyerDashboard = () => api.get('/v1/buyer/dashboard');