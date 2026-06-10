import api from './client';

function crud(prefix) {
  return {
    list: (params = {}) => api.get(prefix, { params }).then((r) => r.data),
    create: (p) => api.post(prefix, p).then((r) => r.data),
    update: (id, p) => api.patch(`${prefix}/${id}`, p).then((r) => r.data),
    delete: (id) => api.delete(`${prefix}/${id}`),
  };
}

export const complianceApi = {
  naacDocs: crud('/compliance/naac/docs'),
  naacGrades: {
    list: () => api.get('/compliance/naac/grades').then((r) => r.data),
    upsert: (cycle, p) => api.put(`/compliance/naac/grades/${cycle}`, p).then((r) => r.data),
  },
  nirf: crud('/compliance/nirf'),
  committees: crud('/compliance/committees'),
};

export const peopleApi = {
  board: crud('/people/board'),
  officials: crud('/people/officials'),
};

export const alumniApi = {
  profiles: crud('/alumni/profiles'),
  chapters: crud('/alumni/chapters'),
  mentorships: crud('/alumni/mentorships'),
};

export const publicComplianceApi = {
  naac: () => api.get('/public/compliance/naac').then((r) => r.data),
  nirf: () => api.get('/public/compliance/nirf').then((r) => r.data),
  committees: () => api.get('/public/compliance/committees').then((r) => r.data),
  officials: (params = {}) => api.get('/public/about/officials', { params }).then((r) => r.data),
  board: () => api.get('/public/about/board').then((r) => r.data),
  alumniSpeaks: () => api.get('/public/alumni/speaks').then((r) => r.data),
  alumniChapters: () => api.get('/public/alumni/chapters').then((r) => r.data),
  alumniMentorships: () => api.get('/public/alumni/mentorships').then((r) => r.data),
};
