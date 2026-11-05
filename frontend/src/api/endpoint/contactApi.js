// frontend/src/api/endpoint/contactApi.js
import api from '../axiosInstance';

export const submitContact = (data) => api.post('/v1/contact', data);

export const getAdminMessages = (params = {}) => api.get('/v1/admin/messages', { params });

export const updateAdminMessageStatus = (id, status) =>
  api.patch(`/v1/admin/messages/${id}/status`, { status });

export const deleteAdminMessage = (id) =>
  api.delete(`/v1/admin/messages/${id}`);
