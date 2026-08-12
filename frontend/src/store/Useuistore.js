import { create } from 'zustand';

// Global UI state that doesn't belong to any one page — modals, toasts, etc.
// The "Become Member" modal is the first real use: opened either by the
// user clicking a dedicated "Become Member" button, OR automatically when
// the axios interceptor sees a 403 ROLE_VERIFICATION_REQUIRED response
// (the capabilityGate safety-net case) — both paths land here.
export const useUIStore = create((set) => ({
  becomeMemberModal: {
    open: false,
    presetRole: null, // 'seller' | 'buyer' | null — pre-selects the radio if opened from a gated action
  },

  openBecomeMemberModal: (presetRole = null) =>
    set({ becomeMemberModal: { open: true, presetRole } }),

  closeBecomeMemberModal: () =>
    set({ becomeMemberModal: { open: false, presetRole: null } }),
}));