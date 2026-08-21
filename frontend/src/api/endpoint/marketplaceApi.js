// src/api/endpoints/marketplaceApi.js
import api from '../axiosInstance';

export const createListing = (data) => api.post('/v1/marketplace/listings', data);
export const updateListingPrice = (id, data) => api.put(`/v1/marketplace/listings/${id}/price`, data);
export const cancelListing = (id) => api.delete(`/v1/marketplace/listings/${id}`);
export const getMyListings = () => api.get('/v1/marketplace/listings/mine');
export const browseMarketplace = (params) => api.get('/v1/buyer/marketplace', { params });
export const getMarketplaceListing = (id) => api.get(`/v1/buyer/marketplace/${id}`);
export const uploadMedia = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};