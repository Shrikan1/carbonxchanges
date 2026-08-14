// src/api/endpoints/mintApi.js
import api from '../axiosInstance';

export const getMintableProjects = () => api.get('/v1/admin/mint/queue');
export const retryMint = (id) => api.post(`/v1/admin/mint/${id}/retry`);