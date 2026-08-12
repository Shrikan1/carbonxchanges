import axios from 'axios';
import { useAuthStore } from '../store/Useauthstore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // sends the httpOnly refresh cookie automatically
});

// Attach the current access token to every outgoing request
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handles two things on every response:
// 1. X-New-Token header — fired whenever a role-upgrade or password change
//    invalidates the old token server-side and issues a fresh one. Swapped
//    in silently so the user never has to re-login mid-session.
// 2. 401 responses — attempts one silent refresh via the httpOnly cookie,
//    retries the original request once. If the refresh itself fails, forces
//    a real logout (the refresh token is expired/revoked too).
api.interceptors.response.use(
  (response) => {
    const newToken = response.headers['x-new-token'];
    if (newToken) useAuthStore.getState().setToken(newToken);
    return response;
  },
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post('/v1/auth/refresh');
        useAuthStore.getState().setToken(data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original);
      } catch {
        useAuthStore.getState().logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;