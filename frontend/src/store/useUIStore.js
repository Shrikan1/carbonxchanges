import { create } from 'zustand';

// Global UI state that doesn't belong to any one page — modals, toasts, etc.
// The becomeMemberModal state has been removed; role selection now happens
// directly on the Signup page via /signup?intent=member.
export const useUIStore = create(() => ({
  // Reserved for future global UI state (toasts, modals, etc.)
}));