import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  role: string;
  nativeLanguage: string;
  finnishLevel: string;
  targetLevel: string;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveAt?: string | null;
  subscription?: { plan: string; status: string };
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  initAuth: () => Promise<void>;
  loginWithTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  updateUser: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      initialized: false,

      login: async (email, password) => {
        const res = await api.post('/auth/login', { email, password });
        const { user, accessToken, refreshToken } = res.data.data;
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        set({ user, accessToken, refreshToken, initialized: true });
      },

      register: async (data) => {
        const res = await api.post('/auth/register', data);
        const { user, accessToken, refreshToken } = res.data.data;
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        set({ user, accessToken, refreshToken, initialized: true });
      },

      logout: () => {
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, accessToken: null, refreshToken: null, initialized: true });
      },

      initAuth: async () => {
        const { accessToken, refreshToken } = get();
        if (!accessToken) { set({ initialized: true }); return; }

        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          const res = await api.get('/auth/me');
          set({ user: res.data.data, initialized: true });
        } catch {
          if (refreshToken) {
            try {
              const res = await api.post('/auth/refresh', { refreshToken });
              const { accessToken: newToken } = res.data.data;
              api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
              set({ accessToken: newToken, initialized: true });
              const me = await api.get('/auth/me');
              set({ user: me.data.data });
            } catch {
              set({ user: null, accessToken: null, refreshToken: null, initialized: true });
            }
          } else {
            set({ user: null, accessToken: null, initialized: true });
          }
        }
      },

      loginWithTokens: async (accessToken, refreshToken) => {
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        set({ accessToken, refreshToken });
        const res = await api.get('/auth/me');
        set({ user: res.data.data, initialized: true });
      },

      updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),

      refreshUser: async () => {
        try {
          const res = await api.get('/auth/me');
          set({ user: res.data.data });
        } catch {}
      },
    }),
    {
      name: 'finnmate-auth',
      partialize: (state) => ({ accessToken: state.accessToken, refreshToken: state.refreshToken }),
    },
  ),
);
