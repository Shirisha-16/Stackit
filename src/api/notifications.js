import api from './auth';

export const getNotifications = () => api.get('/notifications');
export const markAsRead = (id) => api.put(`/notifications/${id}/read`); // Template string
export const markAllAsRead = () => api.put('/notifications/mark-all-read');
export const getUnreadCount = () => api.get('/notifications/unread-count');