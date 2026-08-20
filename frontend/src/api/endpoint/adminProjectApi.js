// src/api/endpoints/adminProjectApi.js
import api from '../axiosInstance';

export const getReviewQueue = (status) => api.get('/v1/admin/projects', { params: { status } });
export const getProjectDetails = (id) => api.get(`/v1/admin/projects/${id}`);
export const approveProject = (id) => api.put(`/v1/admin/projects/${id}/approve`);
export const rejectProject = (id) => api.put(`/v1/admin/projects/${id}/reject`);
export const assignAgent = (id, agentId) => api.put(`/v1/admin/projects/${id}/assign-agent`, { agentId });
export const removeAgent = (id) => api.put(`/v1/admin/projects/${id}/remove-agent`);
export const reviewKycDoc = (projectId, docType, status, reason = null) =>
  api.put(`/v1/admin/projects/${projectId}/kyc-doc-review`, { docType, status, reason });