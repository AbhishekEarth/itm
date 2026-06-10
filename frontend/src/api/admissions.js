import api from './client';

export const admissionsApi = {
  // public submission
  submitLead: (payload) => api.post('/admissions/leads', payload).then((r) => r.data),

  // admin
  listLeads: (params = {}) => api.get('/admissions/leads', { params }).then((r) => r.data),
  updateLead: (id, payload) => api.patch(`/admissions/leads/${id}`, payload).then((r) => r.data),
  deleteLead: (id) => api.delete(`/admissions/leads/${id}`),

  // content
  steps: makeCrud('/admissions/steps'),
  documents: makeCrud('/admissions/documents'),
  counsellors: makeCrud('/admissions/counsellors'),
  fees: makeCrud('/admissions/fees'),
  quotas: makeCrud('/admissions/quotas'),
  faqs: makeCrud('/admissions/faqs'),
  timeline: makeCrud('/admissions/timeline'),
};

function makeCrud(prefix) {
  return {
    list: (params = {}) => api.get(prefix, { params }).then((r) => r.data),
    create: (p) => api.post(prefix, p).then((r) => r.data),
    update: (id, p) => api.patch(`${prefix}/${id}`, p).then((r) => r.data),
    delete: (id) => api.delete(`${prefix}/${id}`),
  };
}

export const formsApi = {
  submit: (payload) => api.post('/forms/submit', payload).then((r) => r.data),
  list: (params = {}) => api.get('/forms/submissions', { params }).then((r) => r.data),
  update: (id, payload) => api.patch(`/forms/submissions/${id}`, payload).then((r) => r.data),
};

export const careersApi = {
  // public
  listPositions: (params = {}) => api.get('/careers/positions', { params }).then((r) => r.data),
  apply: (payload) => api.post('/careers/applications', payload).then((r) => r.data),
  listJrf: (params = {}) => api.get('/careers/jrf', { params }).then((r) => r.data),

  // admin
  positions: makeCrud('/careers/positions'),
  jrf: makeCrud('/careers/jrf'),
  listApplications: (params = {}) => api.get('/careers/applications', { params }).then((r) => r.data),
  updateApplication: (id, payload) => api.patch(`/careers/applications/${id}`, payload).then((r) => r.data),
};

export const publicAdmissionsApi = {
  bundle: () => api.get('/public/admissions').then((r) => r.data),
  positions: (params = {}) => api.get('/public/careers/positions', { params }).then((r) => r.data),
  jrf: () => api.get('/public/careers/jrf').then((r) => r.data),
};
