import api from '../axiosInstance';

export const signup = (name, email, password, confirmPassword, role_type) =>
  api.post('/v1/auth/signup', { name, email, password, confirmPassword, role_type });


export const verifyOtp = (userId, otpCode) =>
  api.post('/v1/auth/verify-otp', { userId, otpCode });

export const login = (email, password) =>
  api.post('/v1/auth/login', { email, password });

export const refreshToken = () => api.post('/v1/auth/refresh');

export const logout = () => api.post('/v1/auth/logout');

export const getProfile = () => api.get('/v1/auth/me');