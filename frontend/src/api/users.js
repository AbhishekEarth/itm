import api from './client';

export const usersApi = {
  list: (params = {}) => api.get('/users', { params }).then((r) => r.data),
  get: (id) => api.get(`/users/${id}`).then((r) => r.data),
  create: (payload) => api.post('/users', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/users/${id}`, payload).then((r) => r.data),
  deactivate: (id) => api.delete(`/users/${id}`),
  resetPassword: (id, payload) => api.post(`/users/${id}/password`, payload),
  updateScopes: (id, payload) => api.post(`/users/${id}/scopes`, payload).then((r) => r.data),
};

export const scopesApi = {
  list: () => api.get('/scopes').then((r) => r.data),
};

export const auditApi = {
  list: (params = {}) => api.get('/audit', { params }).then((r) => r.data),
};
