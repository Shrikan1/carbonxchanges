import api from '../axiosInstance';

export const signup = (name, email, password , confirmPassword) =>
  api.post('/auth/signup', { name, email, password , confirmPassword});

export const verifyOtp = (userId, otpCode) =>
  api.post('/auth/verify-otp', { userId, otpCode });

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const refreshToken = () => api.post('/auth/refresh');

export const logout = () => api.post('/auth/logout');

export const getProfile = () => api.get('/auth/me');