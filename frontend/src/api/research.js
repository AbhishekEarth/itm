import api from './client';

function crud(prefix) {
  return {
    list: (params = {}) => api.get(`/research/${prefix}`, { params }).then((r) => r.data),
    create: (p) => api.post(`/research/${prefix}`, p).then((r) => r.data),
    update: (id, p) => api.patch(`/research/${prefix}/${id}`, p).then((r) => r.data),
    delete: (id) => api.delete(`/research/${prefix}/${id}`),
  };
}

export const researchApi = {
  focusAreas: crud('focus-areas'),
  publications: crud('publications'),
  books: crud('books'),
  patents: crud('patents'),
  journal: crud('journal'),
  conferences: crud('conferences'),
  fdps: crud('fdps'),
  policies: crud('policies'),

  paperCreate: (cid, p) => api.post(`/research/conferences/${cid}/papers`, p).then((r) => r.data),
  paperUpdate: (cid, pid, p) => api.patch(`/research/conferences/${cid}/papers/${pid}`, p).then((r) => r.data),
  paperDelete: (cid, pid) => api.delete(`/research/conferences/${cid}/papers/${pid}`),

  sessionCreate: (fid, p) => api.post(`/research/fdps/${fid}/sessions`, p).then((r) => r.data),
  sessionUpdate: (fid, sid, p) => api.patch(`/research/fdps/${fid}/sessions/${sid}`, p).then((r) => r.data),
  sessionDelete: (fid, sid) => api.delete(`/research/fdps/${fid}/sessions/${sid}`),
};

export const publicResearchApi = {
  rdcell: () => api.get('/public/research/rdcell').then((r) => r.data),
  journal: () => api.get('/public/research/journal').then((r) => r.data),
  conferences: () => api.get('/public/research/conferences').then((r) => r.data),
  fdps: () => api.get('/public/research/fdps').then((r) => r.data),
  patents: () => api.get('/public/research/patents').then((r) => r.data),
};
