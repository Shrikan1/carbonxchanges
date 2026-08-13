// src/api/endpoints/creditApi.js
import api from '../axiosInstance';

export const getIssuedCredits = () => api.get('/v1/credits/issued');
export const getCreditHistory = () => api.get('/v1/credits/history');
export const getCreditBalance = () => api.get('/v1/credits/balance');