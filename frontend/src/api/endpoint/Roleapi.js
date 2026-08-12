import api from '../axiosInstance';

export const requestRoleUpgrade = (role_type, name, phone_number) =>
  api.post('/role/request', { role_type, name, phone_number });

export const verifyRoleUpgrade = (otp_code) =>
  api.post('/role/verify', { otp_code });