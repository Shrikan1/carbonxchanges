import { create } from 'zustand';
import * as buyerApi from '../api/endpoint/buyerApi';

export const useBuyerStore = create((set, get) => ({
  portfolio: { summary: null, holdings: [] },
  certificates: [],
  transactions: [],
  loading: false,
  error: null,



  // Returns the response so the page can show the exact backend message
  // ("request sent, seller will complete it...") without duplicating it here
  requestPurchase: async (listingId, amount) => {
    const { data } = await buyerApi.createPurchaseIntent(listingId, amount);
    return data;
  },

  fetchPortfolio: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await buyerApi.getPortfolio();
      set({ portfolio: { summary: data.summary, holdings: data.holdings }, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.error || 'Failed to load portfolio', loading: false });
    }
  },

  retireCredits: async (payload) => {
    const { data } = await buyerApi.retireCredits(payload);
    // Optimistically drop the retired amount from local holdings so the UI
    // reflects it immediately, without waiting for a full refetch
    set((state) => ({
      portfolio: {
        ...state.portfolio,
        holdings: state.portfolio.holdings.map((h) =>
          h.batch_id === payload.batch_id
            ? { ...h, current_holding: h.current_holding - payload.amount }
            : h
        ),
      },
    }));
    return data;
  },

  fetchCertificates: async () => {
    const { data } = await buyerApi.getMyCertificates();
    set({ certificates: data.certificates });
  },

  fetchTransactions: async () => {
    const { data } = await buyerApi.getTransactionHistory();
    set({ transactions: data.data || data.transactions || [] });
  },
}));
