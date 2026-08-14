// src/api/endpoints/oversightApi.js
import api from '../axiosInstance';

export const getAllUsers = (params) => api.get('/v1/admin/oversight/users', { params });
export const getAllProjects = (params) => api.get('/v1/admin/oversight/projects', { params });
export const getAllTransactions = () => api.get('/v1/admin/oversight/transactions');