import api from '@/lib/api'

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (ids) => api.post('/notifications/mark-read', { ids }),
  markAllAsRead: () => api.post('/notifications/mark-all-read'),
  delete: (id) => api.delete(`/notifications/${id}`),
}

export const alertRuleAPI = {
  getAll: () => api.get('/alert-rules'),
  create: (data) => api.post('/alert-rules', data),
  update: (id, data) => api.put(`/alert-rules/${id}`, data),
  delete: (id) => api.delete(`/alert-rules/${id}`),
}
