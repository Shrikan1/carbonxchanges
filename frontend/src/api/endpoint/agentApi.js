import api from '../axiosInstance';

export const getAssignedProjects = (status) => api.get('/v1/agent/projects', { params: { status } });
export const getDueForCompletion = () => api.get('/v1/agent/projects/due-for-completion');
export const getAssignedProjectDetails = (id) => api.get(`/v1/agent/projects/${id}`);
export const submitInitialVerification = (projectId, payload) =>
  api.post(`/v1/agent/projects/${projectId}/verify/initial`, payload);

export const submitCompletionVerification = (projectId, payload) =>
  api.post(`/v1/agent/projects/${projectId}/verify/completion`, payload);

export const flagProject = (projectId, payload) =>
  api.post(`/v1/agent/projects/${projectId}/flag`, payload);

export const updateReviewProgress = (projectId, review_progress) => api.put(`/v1/agent/projects/${projectId}/progress`, { review_progress });
export const reviewDocument = (projectId, docId, status, rejection_reason) => api.post(`/v1/agent/projects/${projectId}/documents/${docId}/review`, { status, rejection_reason });
export const reviewKycDocument = (projectId, docType, status, rejection_reason) => api.post(`/v1/agent/projects/${projectId}/kyc-review`, { docType, status, rejection_reason });

export const getProjectDocuments = (id) => api.get(`/v1/agent/projects/${id}/documents`);
export const submitReinspection = (id, data) => api.post(`/v1/agent/projects/${id}/reinspect`, data);
export const getProjectReinspections = (id) => api.get(`/v1/agent/projects/${id}/reinspections`);
export const getVerificationHistory = () => api.get('/v1/agent/history');
export const getReportThread = (reportId) => api.get(`/v1/agent/reports/${reportId}/messages`);
export const sendMessage = (reportId, message) => api.post(`/v1/agent/reports/${reportId}/messages`, { message });
export const uploadKycDocument = (formData) => api.post('/upload/kyc', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});