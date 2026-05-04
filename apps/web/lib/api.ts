import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('finnmate-auth');
      if (stored) {
        const { state } = JSON.parse(stored);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      }
    } catch {}
  }
  return config;
});

// Response interceptor — handle 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const stored = localStorage.getItem('finnmate-auth');
        if (stored) {
          const { state } = JSON.parse(stored);
          if (state?.refreshToken) {
            const res = await axios.post(
              `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/refresh`,
              { refreshToken: state.refreshToken },
            );
            const newToken = res.data.data.accessToken;
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            original.headers.Authorization = `Bearer ${newToken}`;
            return api(original);
          }
        }
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('finnmate-auth');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  },
);
