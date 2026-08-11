import api from '../axiosInstance';

export const getProfile = () => api.get('/profile');
export const updateProfile = (name) => api.put('/profile', { name });
export const changePassword = (current_password, new_password) =>
  api.put('/profile/password', { current_password, new_password });