import api from '../axiosInstance';

export const createProject = (data) => api.post('/projects', data);
export const submitProjectForReview = (id) => api.put(`/projects/${id}/submit`);
export const getMyProjects = (params) => api.get('/projects/mine', { params });
export const getProjectById = (id) => api.get(`/projects/${id}`);
export const deleteProject = (id) => api.delete(`/projects/${id}`);