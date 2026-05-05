'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { initAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');
    const refresh = searchParams.get('refresh');

    if (!token) {
      router.replace('/login?error=oauth_failed');
      return;
    }

    // Store tokens in Zustand persist layer
    const stored = { state: { accessToken: token, refreshToken: refresh || null } };
    localStorage.setItem('finnmate-auth', JSON.stringify(stored));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    // Load user profile then redirect
    initAuth().then(() => {
      router.replace('/dashboard');
    });
  }, [searchParams, router, initAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Signing you in...</p>
      </div>
    </div>
  );
}
