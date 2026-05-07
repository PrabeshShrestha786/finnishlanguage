'use client';

import { Bell, Flame, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { usePathname } from 'next/navigation';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/reading':    'Reading Practice',
  '/listening':  'Listening Practice',
  '/speaking':   'Speaking Practice',
  '/writing':    'Writing Practice',
  '/vocabulary': 'Vocabulary Builder',
  '/grammar':    'Grammar System',
  '/yki-prep':   'YKI Exam Prep',
  '/ai-tutor':    'FinnMate AI Tutor',
  '/profile':     'My Profile',
  '/leaderboard': 'Leaderboard',
  '/lessons':     'Learning Path',
};

export default function DashboardHeader() {
  const { user } = useAuthStore();
  const pathname = usePathname();

  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] || 'FinnMate';

  return (
    <header className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-4 shadow-sm">
      <div className="flex-1">
        <h2 className="text-slate-800 font-black text-lg">{title}</h2>
        <p className="text-slate-400 text-xs">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Streak + XP */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-xl">
          <Flame className="w-4 h-4 text-orange-500" />
          <span className="text-orange-600 text-sm font-bold">{user?.currentStreak || 0}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-xl">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-amber-600 text-sm font-bold">{(user?.totalXP || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Notifications */}
      <button className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all">
        <Bell className="w-5 h-5" />
        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full" />
      </button>

      {/* Avatar */}
      <Link href="/profile" className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden hover:shadow-md transition-all">
        {user?.avatar ? (
          <Image src={user.avatar} alt="" fill className="object-cover" />
        ) : (
          user?.firstName?.[0] || 'U'
        )}
      </Link>
    </header>
  );
}
