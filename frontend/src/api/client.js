import axios from 'axios';

const STORAGE = {
  access: 'itm_token',
  refresh: 'itm_refresh',
  role: 'itm_role',
  user: 'itm_user',
  scopes: 'itm_scopes',
  legacyAdmin: 'itm_admin_token',
};

export function getAccessToken() {
  return localStorage.getItem(STORAGE.access);
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE.refresh);
}

export function getStoredAuth() {
  try {
    return {
      token: localStorage.getItem(STORAGE.access),
      refresh: localStorage.getItem(STORAGE.refresh),
      role: localStorage.getItem(STORAGE.role),
      user: JSON.parse(localStorage.getItem(STORAGE.user) || 'null'),
      scopes: JSON.parse(localStorage.getItem(STORAGE.scopes) || '[]'),
    };
  } catch {
    return { token: null, refresh: null, role: null, user: null, scopes: [] };
  }
}

export function storeAuth({ access_token, refresh_token, role, user, scopes }) {
  localStorage.setItem(STORAGE.access, access_token);
  localStorage.setItem(STORAGE.refresh, refresh_token);
  localStorage.setItem(STORAGE.role, role);
  localStorage.setItem(STORAGE.user, JSON.stringify(user ?? null));
  localStorage.setItem(STORAGE.scopes, JSON.stringify(scopes ?? []));
  if (role === 'admin' || role === 'super_admin' || role === 'editor') {
    localStorage.setItem(STORAGE.legacyAdmin, access_token);
  }
}

export function clearAuth() {
  Object.values(STORAGE).forEach((k) => localStorage.removeItem(k));
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshInFlight = null;

async function performRefresh() {
  if (refreshInFlight) return refreshInFlight;
  const refresh = getRefreshToken();
  if (!refresh) return Promise.reject(new Error('NO_REFRESH'));

  refreshInFlight = axios
    .post(`${api.defaults.baseURL}/auth/refresh`, { refresh_token: refresh })
    .then((res) => {
      storeAuth(res.data);
      return res.data.access_token;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

api.interceptors.response.use(
  (r) => {
    // Vercel's SPA-fallback rewrite (and any reverse proxy 404) sends back
    // HTML with status 200. axios happily resolves and downstream code that
    // expects an array/object iterates the HTML string → React render crash.
    // Treat any non-JSON response on a JSON-expecting request as an error so
    // react-query stores it under `error` and components fall back cleanly.
    const ct = String(r.headers?.['content-type'] || '').toLowerCase();
    const wantsJson = !r.config?.responseType || r.config.responseType === 'json';
    if (wantsJson && typeof r.data === 'string' && !ct.includes('application/json')) {
      return Promise.reject(
        Object.assign(new Error('Backend unavailable (non-JSON response)'), {
          response: r,
          isNonJson: true,
        })
      );
    }
    return r;
  },
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original?._retry &&
      !original?.url?.includes('/auth/login') &&
      !original?.url?.includes('/auth/refresh')
    ) {
      original._retry = true;
      try {
        const newToken = await performRefresh();
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api(original);
      } catch (e) {
        clearAuth();
        if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export function errorMessage(error) {
  return (
    error?.response?.data?.error?.message ||
    error?.response?.data?.detail ||
    error?.message ||
    'Something went wrong.'
  );
}

export default api;
