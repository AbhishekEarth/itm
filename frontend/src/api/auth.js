import api from './client';

export const authApi = {
  login: async (username, password) => {
    const body = new URLSearchParams();
    body.append('username', username);
    body.append('password', password);
    const res = await api.post('/auth/login', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return res.data;
  },
  me: () => api.get('/auth/me').then((r) => r.data),
  logout: (refresh_token) => api.post('/auth/logout', { refresh_token }),
  changePassword: (current_password, new_password) =>
    api.post('/auth/password', { current_password, new_password }),
};
