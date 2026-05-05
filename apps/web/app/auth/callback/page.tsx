'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';

function CallbackHandler() {
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

    const stored = { state: { accessToken: token, refreshToken: refresh || null } };
    localStorage.setItem('finnmate-auth', JSON.stringify(stored));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    initAuth().then(() => {
      router.replace('/dashboard');
    });
  }, [searchParams, router, initAuth]);

  return null;
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm">Signing you in...</p>
        <Suspense>
          <CallbackHandler />
        </Suspense>
      </div>
    </div>
  );
}
