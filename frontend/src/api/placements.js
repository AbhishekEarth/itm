import api from './client';

function crud(prefix) {
  return {
    list: (params = {}) => api.get(`/placements/${prefix}`, { params }).then((r) => r.data),
    create: (p) => api.post(`/placements/${prefix}`, p).then((r) => r.data),
    update: (id, p) => api.patch(`/placements/${prefix}/${id}`, p).then((r) => r.data),
    delete: (id) => api.delete(`/placements/${prefix}/${id}`),
  };
}

export const placementsApi = {
  categories: crud('categories'),
  recruiters: crud('recruiters'),
  records: crud('records'),
  stats: crud('stats'),
  team: crud('team'),
  services: crud('services'),
  mous: crud('mous'),
  testimonials: crud('testimonials'),
  events: crud('events'),
};

export const publicPlacementsApi = {
  recruiters: () => api.get('/public/recruiters').then((r) => r.data),
  tap: () => api.get('/public/tap').then((r) => r.data),
};
