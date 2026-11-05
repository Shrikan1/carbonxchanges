import axios from 'axios';

import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends the httpOnly refresh cookie automatically
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['x-new-token'];
    if (newToken) useAuthStore.getState().setToken(newToken);
    return response;
  },
  async (error) => {
    const original = error.config;

    if (error.response?.data?.code === 'ROLE_VERIFICATION_REQUIRED') {
      useUIStore.getState().openBecomeMemberModal(error.response.data.role_required);
      return Promise.reject(error);
    }

    // Only retry 401 errors for protected routes, not for auth routes
    if (
      error.response?.status === 401 &&
      !original._retry &&
      !original.url?.includes('/auth/')
    ) {
      original._retry = true;
      try {
        const { data } = await api.post('/v1/auth/refresh');
        
        if (data?.token) {
          useAuthStore.getState().setToken(data.token);
          original.headers.Authorization = `Bearer ${data.token}`;
          return api(original);
        } else {
          // If no token in response, don't retry again
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // Only logout if we're not already on the login page
        if (!window.location.pathname.includes('/login')) {
          useAuthStore.getState().logout();
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;