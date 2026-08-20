import api from '../axiosInstance';

export const getNotifications = (limit = 20) => {
  return api.get(`/v1/notifications?limit=${limit}`);
};

export const markAsRead = (id) => {
  return api.patch(`/v1/notifications/${id}/read`);
};
