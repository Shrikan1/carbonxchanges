import api from '../axiosInstance';

export const connectWallet = (wallet_address) => api.post('/wallet/connect', { wallet_address });
export const disconnectWallet = () => api.post('/wallet/disconnect');
export const getWalletDetails = () => api.get('/wallet');