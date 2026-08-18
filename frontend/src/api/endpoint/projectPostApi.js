// src/api/endpoints/projectPostApi.js
import api from '../axiosInstance';

export const createProjectPost = (data) => api.post('/v1/project-posts', data);
export const updateProjectPost = (id, data) => api.put(`/v1/project-posts/${id}`, data);
export const deleteProjectPost = (id) => api.delete(`/v1/project-posts/${id}`);
export const getProjectPost = (id) => api.get(`/v1/project-posts/${id}`);
export const getProjectPosts = (projectId) => api.get(`/v1/project-posts/project/${projectId}`);
export const getAllProjectPosts = () => api.get('/v1/project-posts/all');
export const likeProjectPost = (id) => api.post(`/v1/project-posts/${id}/like`);
export const shareProjectPost = (id) => api.post(`/v1/project-posts/${id}/share`);