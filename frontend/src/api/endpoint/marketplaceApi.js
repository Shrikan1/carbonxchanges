// src/api/endpoints/marketplaceApi.js
import api from '../axiosInstance';

export const createListing = (data) => api.post('/v1/marketplace/listings', data);
export const updateListingPrice = (id, data) => api.put(`/v1/marketplace/listings/${id}/price`, data);
export const cancelListing = (id) => api.delete(`/v1/marketplace/listings/${id}`);
export const getMyListings = () => api.get('/v1/marketplace/listings/mine');