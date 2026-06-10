import api from './client';

export const departmentsApi = {
  // Authenticated (admin) endpoints
  list: () => api.get('/departments').then((r) => r.data),
  get: (code) => api.get(`/departments/${code}`).then((r) => r.data),
  update: (code, payload) => api.patch(`/departments/${code}`, payload).then((r) => r.data),

  upsertHod: (code, payload) =>
    api.put(`/departments/${code}/hod`, payload).then((r) => r.data),
  deleteHod: (code) => api.delete(`/departments/${code}/hod`),

  faculty: {
    list: (code) => api.get(`/departments/${code}/faculty`).then((r) => r.data),
    create: (code, p) => api.post(`/departments/${code}/faculty`, p).then((r) => r.data),
    update: (code, id, p) => api.patch(`/departments/${code}/faculty/${id}`, p).then((r) => r.data),
    delete: (code, id) => api.delete(`/departments/${code}/faculty/${id}`),
  },
  labs: makeChildApi('labs'),
  partners: makeChildApi('partners'),
  projects: makeChildApi('projects'),
  awards: makeChildApi('awards'),
};

function makeChildApi(prefix) {
  return {
    list: (code) => api.get(`/departments/${code}/${prefix}`).then((r) => r.data),
    create: (code, p) => api.post(`/departments/${code}/${prefix}`, p).then((r) => r.data),
    update: (code, id, p) =>
      api.patch(`/departments/${code}/${prefix}/${id}`, p).then((r) => r.data),
    delete: (code, id) => api.delete(`/departments/${code}/${prefix}/${id}`),
  };
}

export const publicDeptApi = {
  list: () => api.get('/public/departments').then((r) => r.data),
  get: (code) => api.get(`/public/department/${code}`).then((r) => r.data),
};
