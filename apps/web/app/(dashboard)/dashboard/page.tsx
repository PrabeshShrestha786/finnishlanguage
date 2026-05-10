'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Flame, BookOpen, Headphones, Mic, PenTool, Brain,
  Trophy, GraduationCap, ChevronRight, Zap, TrendingUp, Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const MODULES = [
  { title: 'Vocabulary', icon: Brain,         href: '/vocabulary', color: 'from-yellow-400 to-orange-500',   desc: 'Flashcards' },
  { title: 'Grammar',    icon: GraduationCap, href: '/grammar',    color: 'from-pink-500 to-rose-600',       desc: 'Finnish cases' },
  { title: 'Reading',    icon: BookOpen,      href: '/reading',    color: 'from-cyan-500 to-blue-500',       desc: 'Stories & articles' },
  { title: 'Writing',    icon: PenTool,       href: '/writing',    color: 'from-blue-500 to-indigo-600',     desc: 'AI feedback' },
  { title: 'Listening',  icon: Headphones,    href: '/listening',  color: 'from-purple-500 to-violet-600',   desc: 'Native audio' },
  { title: 'Speaking',   icon: Mic,           href: '/speaking',   color: 'from-emerald-400 to-teal-500',    desc: 'AI pronunciation' },
  { title: 'YKI Prep',   icon: Trophy,        href: '/yki-prep',   color: 'from-blue-600 to-indigo-700',     desc: 'Mock exams' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/users/dashboard').then((r) => r.data.data),
    staleTime: 30_000,
  });

  const { data: weeklyRaw, isLoading: loadingLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'weekly'],
    queryFn: () => api.get('/leaderboard/weekly').then((r) => r.data.data),
    staleTime: 60_000,
  });

  const totalXP: number = stats?.totalXP || user?.totalXP || 0;
  const weeklyXPArr: number[] = Array.isArray(stats?.weeklyXP) ? stats.weeklyXP : [0, 0, 0, 0, 0, 0, 0];
  const weeklyXP: number = weeklyXPArr.reduce((sum: number, v: number) => sum + v, 0);

  const LANGUAGE_CODES: Record<string, string> = {
    ENGLISH: 'gb', FINNISH: 'fi', NEPALI: 'np', HINDI: 'in', ARABIC: 'sa',
    URDU: 'pk', SPANISH: 'es', FRENCH: 'fr', GERMAN: 'de', RUSSIAN: 'ru',
    CHINESE: 'cn', JAPANESE: 'jp', KOREAN: 'kr', PORTUGUESE: 'pt', ITALIAN: 'it', SWEDISH: 'se',
  };

  const leaderboardEntries: { rank: number; name: string; xp: number; streak: number; isUser: boolean; flagCode?: string }[] =
    Array.isArray(weeklyRaw)
      ? weeklyRaw.slice(0, 3).map((e: any, i: number) => ({
          rank: i + 1,
          name: e.user?.username || e.user?.firstName || 'User',
          xp: e.xp,
          streak: e.user?.currentStreak || 0,
          isUser: e.user?.username === user?.username,
          flagCode: LANGUAGE_CODES[e.user?.nativeLanguage],
        }))
      : [];

  return (
    <div className="space-y-6">
      {/* XP STATS + LEADERBOARD */}
      <div className="grid md:grid-cols-5 gap-4">
        {/* XP STATS */}
        <div className="md:col-span-2 flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
            className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full" />
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-200 text-xs font-semibold uppercase tracking-wide">Grand Total XP</span>
            </div>
            <div className="text-2xl font-black">{totalXP.toLocaleString()}</div>
            <div className="text-blue-200 text-xs mt-0.5">since you started</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="flex-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-bl-full" />
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wide">Weekly XP</span>
            </div>
            <div className="text-2xl font-black">{weeklyXP.toLocaleString()}</div>
            <div className="text-emerald-100 text-xs mt-0.5">last 7 days</div>
          </motion.div>
        </div>

        {/* LEADERBOARD */}
        <div className="md:col-span-3 bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-black text-slate-800">Weekly Leaderboard</h2>
            </div>
            <Link href="/leaderboard" className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1 font-medium">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {loadingLeaderboard ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
            </div>
          ) : leaderboardEntries.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">No activity this week yet.</div>
          ) : (
            <div className="space-y-2">
              {leaderboardEntries.map((entry) => (
                <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  entry.isUser ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    entry.rank === 1 ? 'bg-amber-400 text-white' :
                    entry.rank === 2 ? 'bg-slate-300 text-slate-700' :
                    'bg-orange-300 text-white'
                  }`}>
                    {entry.rank}
                  </div>
                  {entry.flagCode ? (
                    <img src={`https://flagcdn.com/w40/${entry.flagCode}.png`} alt="" width={24} height={17} className="rounded-sm object-cover flex-shrink-0" />
                  ) : (
                    <span className="text-base flex-shrink-0">🌍</span>
                  )}
                  <div className="flex-1">
                    <div className="text-slate-800 font-semibold text-sm">{entry.name}</div>
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <Flame className="w-3 h-3 text-orange-400" /> {entry.streak} day streak
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-600 font-black text-sm">{entry.xp.toLocaleString()}</div>
                    <div className="text-slate-400 text-xs">XP this week</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LEARNING MODULES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-800">Learning Modules</h2>
          <Link href="/lessons" className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1 font-medium">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MODULES.map((mod, i) => (
            <motion.div
              key={mod.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3 }}
            >
              <Link href={mod.href} className="bg-white rounded-2xl p-4 flex flex-col items-start gap-3 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all block">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.color} flex items-center justify-center shadow-sm`}>
                  <mod.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-slate-800 font-bold text-sm">{mod.title}</div>
                  <div className="text-slate-400 text-xs">{mod.desc}</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
