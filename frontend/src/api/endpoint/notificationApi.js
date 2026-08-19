import api from '../axiosInstance';

export const getNotifications = (limit = 20) => {
  return api.get(`/notifications?limit=${limit}`);
};

export const markAsRead = (id) => {
  return api.patch(`/notifications/${id}/read`);
};
