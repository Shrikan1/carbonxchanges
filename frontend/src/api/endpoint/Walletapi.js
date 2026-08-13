import api from '../axiosInstance';

export const connectWallet = (wallet_address) => api.post('/v1/wallet/connect', { wallet_address });
export const disconnectWallet = () => api.post('/v1/wallet/disconnect');
export const getWalletDetails = () => api.get('/v1/wallet');