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

// Mutex so only one token refresh happens at a time
let refreshPromise: Promise<string> | null = null;

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
            if (!refreshPromise) {
              refreshPromise = axios
                .post(
                  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/auth/refresh`,
                  { refreshToken: state.refreshToken },
                )
                .then((res) => res.data.data.accessToken)
                .finally(() => { refreshPromise = null; });
            }
            const newToken = await refreshPromise;
            // Persist new token back to localStorage so the request interceptor picks it up
            try {
              const raw = localStorage.getItem('finnmate-auth');
              if (raw) {
                const parsed = JSON.parse(raw);
                parsed.state.accessToken = newToken;
                localStorage.setItem('finnmate-auth', JSON.stringify(parsed));
              }
            } catch {}
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
