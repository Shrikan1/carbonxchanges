// src/api/endpoints/verificationApi.js
import api from '../axiosInstance';

export const getVerificationStatus = (projectId) => api.get(`/v1/verification/${projectId}/status`);
export const getAssignedAgent = (projectId) => api.get(`/v1/verification/${projectId}/agent`);
export const uploadProjectDocuments = (projectId, doc_type, ipfs_cid) =>
  api.post(`/v1/verification/${projectId}/documents`, { doc_type, ipfs_cid });
export const submitSellerResponse = (reportId, response_text) =>
  api.put(`/v1/verification/reports/${reportId}/response`, { response_text });
export const getReportThread = (reportId) => api.get(`/v1/verification/reports/${reportId}/messages`);
export const sendMessage = (reportId, message) => api.post(`/v1/verification/reports/${reportId}/messages`, { message });