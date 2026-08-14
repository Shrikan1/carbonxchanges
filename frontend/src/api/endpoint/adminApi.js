// src/api/endpoints/adminApi.js
import api from '../axiosInstance';

export const createAgent = (name, email) => api.post('/v1/admin/agents', { name, email });
export const getAllAgents = () => api.get('/v1/admin/agents');
export const getAgentWorkload = (agentId) => api.get(`/v1/admin/agents/${agentId}/workload`);