import { create } from 'zustand';
import * as sellerApi from '../api/endpoint/Sellerapi';

export const useSellerStore = create((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await sellerApi.getMyProjects();
      set({ projects: data.projects || data.data || [], loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to load projects', loading: false });
    }
  },

  createProject: async (formData) => {
    const { data } = await sellerApi.createProject(formData);
    set((state) => ({ projects: [data.project, ...state.projects] }));
    return data.project;
  },

  updateProject: async (projectId, formData) => {
    const { data } = await sellerApi.updateProject(projectId, formData);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? data.project : p)),
    }));
    return data.project;
  },

  submitForReview: async (projectId) => {
    const { data } = await sellerApi.submitProjectForReview(projectId);
    set((state) => ({
      projects: state.projects.map((p) => (p.id === projectId ? data.project : p)),
    }));
    return data.project;
  },

  deleteProject: async (projectId) => {
    await sellerApi.deleteProject(projectId);
    set((state) => ({ projects: state.projects.filter((p) => p.id !== projectId) }));
  },
}));