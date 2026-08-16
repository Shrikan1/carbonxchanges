import api from '../axiosInstance';

export const getAssignedProjects = (status) => api.get('/agent/projects', { params: { status } });
export const getDueForCompletion = () => api.get('/agent/projects/due-for-completion');
export const getAssignedProjectDetails = (id) => api.get(`/agent/projects/${id}`);
export const submitInitialVerification = (id, data) => api.post(`/agent/projects/${id}/verify/initial`, data);
export const submitCompletionVerification = (id, data) => api.post(`/agent/projects/${id}/verify/completion`, data);
export const getProjectDocuments = (id) => api.get(`/agent/projects/${id}/documents`);
export const submitReinspection = (id, data) => api.post(`/agent/projects/${id}/reinspect`, data);
export const getProjectReinspections = (id) => api.get(`/agent/projects/${id}/reinspections`);
export const getVerificationHistory = () => api.get('/agent/history');
export const getReportThread = (reportId) => api.get(`/agent/reports/${reportId}/messages`);
export const sendMessage = (reportId, message) => api.post(`/agent/reports/${reportId}/messages`, { message });