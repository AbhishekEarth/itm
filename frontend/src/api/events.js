import api from './client';

function crud(prefix) {
  return {
    list: (params = {}) => api.get(prefix, { params }).then((r) => r.data),
    create: (p) => api.post(prefix, p).then((r) => r.data),
    update: (id, p) => api.patch(`${prefix}/${id}`, p).then((r) => r.data),
    delete: (id) => api.delete(`${prefix}/${id}`),
  };
}

export const clubsApi = {
  list: (params = {}) => api.get('/clubs', { params }).then((r) => r.data),
  get: (code) => api.get(`/clubs/${code}`).then((r) => r.data),
  create: (p) => api.post('/clubs', p).then((r) => r.data),
  update: (code, p) => api.patch(`/clubs/${code}`, p).then((r) => r.data),
  delete: (code) => api.delete(`/clubs/${code}`),
};

export const eventsApi = crud('/events');
export const noticesApi = crud('/notices');
export const announcementsApi = crud('/announcements');
export const whatsNewApi = crud('/whats-new');

export const galleryApi = {
  listCategories: () => api.get('/gallery/categories').then((r) => r.data),
  createCategory: (p) => api.post('/gallery/categories', p).then((r) => r.data),
  updateCategory: (id, p) => api.patch(`/gallery/categories/${id}`, p).then((r) => r.data),
  deleteCategory: (id) => api.delete(`/gallery/categories/${id}`),

  listItems: (cid) => api.get(`/gallery/categories/${cid}/items`).then((r) => r.data),
  createItem: (cid, p) => api.post(`/gallery/categories/${cid}/items`, p).then((r) => r.data),
  bulkAdd: (cid, p) => api.post(`/gallery/categories/${cid}/items/bulk`, p).then((r) => r.data),
  updateItem: (id, p) => api.patch(`/gallery/items/${id}`, p).then((r) => r.data),
  deleteItem: (id) => api.delete(`/gallery/items/${id}`),

  listVideos: (params = {}) => api.get('/gallery/videos', { params }).then((r) => r.data),
  createVideo: (p) => api.post('/gallery/videos', p).then((r) => r.data),
  updateVideo: (id, p) => api.patch(`/gallery/videos/${id}`, p).then((r) => r.data),
  deleteVideo: (id) => api.delete(`/gallery/videos/${id}`),
};

export const publicEventsApi = {
  clubs: (params = {}) => api.get('/public/clubs', { params }).then((r) => r.data),
  events: (params = {}) => api.get('/public/events', { params }).then((r) => r.data),
  notices: (params = {}) => api.get('/public/notices', { params }).then((r) => r.data),
  announcements: () => api.get('/public/announcements').then((r) => r.data),
  gallery: () => api.get('/public/gallery').then((r) => r.data),
  galleryCategory: (slug) => api.get(`/public/gallery/${slug}`).then((r) => r.data),
  videos: (params = {}) => api.get('/public/videos', { params }).then((r) => r.data),
  whatsNew: (params = {}) => api.get('/public/whats-new', { params }).then((r) => r.data),
};
