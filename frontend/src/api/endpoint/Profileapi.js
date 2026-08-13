import api from '../axiosInstance';

export const getProfile = () => api.get('/v1/profile');
export const updateProfile = (name) => api.put('/v1/profile', { name });
export const changePassword = (current_password, new_password) =>
  api.put('/v1/profile/password', { current_password, new_password });