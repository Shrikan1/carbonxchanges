// src/api/endpoints/reversalApi.js
import api from '../axiosInstance';

export const getFlaggedReversals = () => api.get('/v1/admin/reversals/queue');
export const resolveReversal = (reportId) => api.put(`/v1/admin/reversals/${reportId}/resolve`);