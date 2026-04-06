import api from '@/lib/api'

export const campaignAPI = {
  getAll: (params) => api.get('/campaigns', { params }),
  getById: (id) => api.get(`/campaigns/${id}`),
  create: (data) => api.post('/campaigns', data),
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  delete: (id) => api.delete(`/campaigns/${id}`),
  getAnalytics: (id) => api.get(`/campaigns/${id}/analytics`),
  pause: (id) => api.post(`/campaigns/${id}/pause`),
  resume: (id) => api.post(`/campaigns/${id}/resume`),
}

export const clientAPI = {
  getAll: (params) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
}

export const creativeAPI = {
  generate: (data) => api.post('/creative/generate', data),
  getAll: (params) => api.get('/creative', { params }),
  getById: (id) => api.get(`/creative/${id}`),
  approve: (id) => api.post(`/creative/${id}/approve`),
  reject: (id, data) => api.post(`/creative/${id}/reject`, data),
}

export const analyticsAPI = {
  getOverview: (params) => api.get('/analytics/overview', { params }),
  getPerformance: (params) => api.get('/analytics/performance', { params }),
  getDemographics: (params) => api.get('/analytics/demographics', { params }),
  exportReport: (params) => api.get('/analytics/export', { params, responseType: 'blob' }),
}

export const billingAPI = {
  getInvoices: () => api.get('/billing/invoices'),
  getPaymentMethods: () => api.get('/billing/payment-methods'),
  addPaymentMethod: (data) => api.post('/billing/payment-methods', data),
  createInvoice: (data) => api.post('/billing/invoices', data),
}
