import { create } from 'zustand';
import { logout as apiLogout } from '../api/endpoint/Authapi';

const getCachedUser = () => {
  try {
    const raw = localStorage.getItem('carbonx_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = getCachedUser();

export const useAuthStore = create((set, get) => ({
  user: initialUser,
  token: null,
  isAuthenticated: !!initialUser,
  isInitializing: true, // true until the initial /auth/refresh attempt on app load resolves

  setSession: (user, token) => {
    try {
      if (user) {
        localStorage.setItem('carbonx_user', JSON.stringify(user));
      }
    } catch {}
    set({ user, token, isAuthenticated: !!user, isInitializing: false });
  },

  setToken: (token) => set({ token }),

  updateUser: (partialUser) =>
    set((state) => {
      const updatedUser = { ...state.user, ...partialUser };
      try {
        localStorage.setItem('carbonx_user', JSON.stringify(updatedUser));
      } catch {}
      return { user: updatedUser };
    }),

  logout: () => {
    // 1. Optimistic synchronous clear (0ms delay):
    try {
      localStorage.removeItem('carbonx_user');
    } catch {}
    set({ user: null, token: null, isAuthenticated: false, isInitializing: false });

    // 2. Invalidate server-side session and cookie in the background
    apiLogout().catch((err) => {
      console.error('Logout API failed', err);
    });
  },

  finishInitializing: () => {
    if (!get().token && !get().user) {
      try {
        localStorage.removeItem('carbonx_user');
      } catch {}
      set({ user: null, isAuthenticated: false, isInitializing: false });
    } else {
      set({ isInitializing: false });
    }
  },
}));