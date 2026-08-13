import api from '../axiosInstance';

export const createProject = (data) => api.post('/v1/projects', data);
export const submitProjectForReview = (id) => api.put(`/v1/projects/${id}/submit`);
export const getMyProjects = (params) => api.get('/v1/projects/mine', { params });
export const getProjectById = (id) => api.get(`/v1/projects/${id}`);
export const deleteProject = (id) => api.delete(`/v1/projects/${id}`);