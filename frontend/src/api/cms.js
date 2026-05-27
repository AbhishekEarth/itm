import api from './client';

export const settingsApi = {
  publicAll: () => api.get('/public/settings').then((r) => r.data),
  list: (group) => api.get('/settings', { params: { group } }).then((r) => r.data),
  get: (key) => api.get(`/settings/${encodeURIComponent(key)}`).then((r) => r.data),
  upsert: (key, payload) =>
    api.put(`/settings/${encodeURIComponent(key)}`, payload).then((r) => r.data),
  delete: (key) => api.delete(`/settings/${encodeURIComponent(key)}`),
};

export const pagesApi = {
  list: () => api.get('/pages').then((r) => r.data),
  get: (id) => api.get(`/pages/${id}`).then((r) => r.data),
  create: (payload) => api.post('/pages', payload).then((r) => r.data),
  update: (id, payload) => api.patch(`/pages/${id}`, payload).then((r) => r.data),
  delete: (id) => api.delete(`/pages/${id}`),
  listSections: (id) => api.get(`/pages/${id}/sections`).then((r) => r.data),
  createSection: (id, payload) =>
    api.post(`/pages/${id}/sections`, payload).then((r) => r.data),
  updateSection: (id, key, payload) =>
    api.patch(`/pages/${id}/sections/${encodeURIComponent(key)}`, payload).then((r) => r.data),
  deleteSection: (id, key) =>
    api.delete(`/pages/${id}/sections/${encodeURIComponent(key)}`),
};

export const publicApi = {
  page: (path) => {
    const p = path.startsWith('/') ? path : `/${path}`;
    return api.get(`/public/page${p}`).then((r) => r.data);
  },
  home: () => api.get('/public/home').then((r) => r.data),
  settings: () => api.get('/public/settings').then((r) => r.data),
};

export const mediaApi = {
  list: (params = {}) => api.get('/media', { params }).then((r) => r.data),
  upload: (file, { folder, alt, caption } = {}) => {
    const fd = new FormData();
    fd.append('file', file);
    if (folder) fd.append('folder', folder);
    if (alt) fd.append('alt', alt);
    if (caption) fd.append('caption', caption);
    return api
      .post('/media', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  update: (id, payload) => api.patch(`/media/${id}`, payload).then((r) => r.data),
  delete: (id) => api.delete(`/media/${id}`),
};
