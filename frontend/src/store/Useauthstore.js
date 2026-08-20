import { create } from 'zustand';
import { logout as apiLogout } from '../api/endpoint/Authapi';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isInitializing: true, // true until the initial /auth/refresh attempt on app load resolves

  setSession: (user, token) => set({ user, token, isAuthenticated: true, isInitializing: false }),

  
  setToken: (token) => set({ token }),

  updateUser: (partialUser) =>
    set((state) => ({ user: { ...state.user, ...partialUser } })),

  logout: async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error('Logout API failed', err);
    }
    set({ user: null, token: null, isAuthenticated: false, isInitializing: false });
  },

  finishInitializing: () => set({ isInitializing: false }),
}));