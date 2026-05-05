'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Flame, Zap, BookOpen, Headphones, Mic, PenTool, Brain,
  Trophy, Target, ArrowRight, Star, TrendingUp,
  GraduationCap, ChevronRight, Play, Clock,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const MODULES = [
  { title: 'Reading',    icon: BookOpen,      href: '/reading',    color: 'from-cyan-500 to-blue-500',       desc: 'Stories & articles' },
  { title: 'Listening',  icon: Headphones,    href: '/listening',  color: 'from-purple-500 to-violet-600',   desc: 'Native audio' },
  { title: 'Speaking',   icon: Mic,           href: '/speaking',   color: 'from-emerald-400 to-teal-500',    desc: 'AI pronunciation' },
  { title: 'Writing',    icon: PenTool,       href: '/writing',    color: 'from-blue-500 to-indigo-600',     desc: 'AI feedback' },
  { title: 'Vocabulary', icon: Brain,         href: '/vocabulary', color: 'from-yellow-400 to-orange-500',   desc: 'Flashcards' },
  { title: 'Grammar',    icon: GraduationCap, href: '/grammar',    color: 'from-pink-500 to-rose-600',       desc: 'Finnish cases' },
  { title: 'YKI Prep',   icon: Trophy,        href: '/yki-prep',   color: 'from-blue-600 to-indigo-700',     desc: 'Mock exams' },
  { title: 'AI Tutor',   icon: Star,          href: '/ai-tutor',   color: 'from-violet-500 to-blue-600',     desc: 'FinnMate chat' },
];

function StatCard({ icon: Icon, label, value, sub, color, animate = false }: {
  icon: any; label: string; value: string | number; sub?: string; color: string; animate?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-10 rounded-bl-full`} />
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm`}>
        <Icon className={`w-5 h-5 text-white ${animate ? 'streak-flame' : ''}`} />
      </div>
      <div className="text-2xl font-black text-slate-800 mb-0.5">{value}</div>
      <div className="text-sm font-semibold text-slate-600">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function XPProgressBar({ current, target, level }: { current: number; target: number; level: string }) {
  const pct = Math.min(100, Math.round((current % target) / target * 100));
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-slate-800 font-bold">Level Progress</div>
          <div className="text-slate-400 text-sm">{level} → Next Level</div>
        </div>
        <div className="text-right">
          <div className="gradient-text font-black text-xl">{current.toLocaleString()} XP</div>
          <div className="text-slate-400 text-xs">total earned</div>
        </div>
      </div>
      <div className="xp-bar">
        <motion.div
          className="xp-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-xs text-slate-400">{pct}% to next level</span>
        <span className="text-xs text-emerald-600 font-medium">{target - (current % target)} XP needed</span>
      </div>
    </div>
  );
}

function WeeklyChart({ data }: { data: number[] }) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const max = Math.max(...data, 1);
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-slate-800 font-bold">Weekly XP</div>
          <div className="text-slate-400 text-xs">This week&apos;s activity</div>
        </div>
        <TrendingUp className="w-5 h-5 text-emerald-500" />
      </div>
      <div className="flex items-end gap-2 h-20">
        {days.map((day, i) => {
          const h = data[i] ? Math.max(8, (data[i] / max) * 80) : 4;
          const isToday = i === new Date().getDay() - 1;
          return (
            <div key={day} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: h }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: 'easeOut' }}
                className={`w-full rounded-lg ${isToday ? 'bg-gradient-to-t from-blue-600 to-indigo-500' : 'bg-slate-100'}`}
              />
              <span className={`text-xs ${isToday ? 'text-blue-600 font-bold' : 'text-slate-400'}`}>{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/users/dashboard').then((r) => r.data.data),
    staleTime: 30_000,
  });

  const weeklyXP: number[] = Array.isArray(stats?.weeklyXP) ? stats.weeklyXP : [20, 45, 30, 60, 80, 25, 90];
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Hyvää huomenta' : hour < 18 ? 'Hyvää päivää' : 'Hyvää iltaa';

  return (
    <div className="space-y-6">
      {/* GREETING */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-slate-800 mb-0.5">
          {greeting}, <span className="gradient-text">{user?.firstName}!</span> 🇫🇮
        </h1>
        <p className="text-slate-500 text-sm">Ready to learn some Finnish today?</p>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Flame} label="Day Streak" value={stats?.currentStreak || user?.currentStreak || 0}
          sub={`Best: ${stats?.longestStreak || 0}`} color="from-orange-400 to-red-500" animate />
        <StatCard icon={Zap} label="Total XP" value={(stats?.totalXP || user?.totalXP || 0).toLocaleString()}
          sub={`Today: +${stats?.todayXP || 0}`} color="from-blue-500 to-indigo-600" />
        <StatCard icon={Target} label="Minutes Today" value={stats?.todayMinutes || 0}
          sub="daily goal: 15 min" color="from-emerald-400 to-teal-500" />
        <StatCard icon={BookOpen} label="Words Learned" value={stats?.wordsStudied || 0}
          sub="spaced repetition" color="from-violet-500 to-purple-600" />
      </div>

      {/* XP + WEEKLY */}
      <div className="grid md:grid-cols-2 gap-4">
        <XPProgressBar
          current={stats?.totalXP || user?.totalXP || 0}
          target={1000}
          level={stats?.finnishLevel || user?.finnishLevel || 'A1'}
        />
        <WeeklyChart data={weeklyXP} />
      </div>

      {/* CONTINUE + DAILY CHALLENGE */}
      <div className="grid md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="md:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="flex items-center gap-2 mb-2">
            <Play className="w-4 h-4 text-blue-200" />
            <span className="text-blue-200 text-sm font-semibold">Continue Learning</span>
          </div>
          <h2 className="text-xl font-black mb-1">
            {stats?.recentLessons?.[0]?.lesson?.title || 'Finnish Cases: Nominative & Partitive'}
          </h2>
          <p className="text-blue-200 text-sm mb-4">
            {stats?.recentLessons?.[0]?.lesson?.type || 'Grammar'} · {stats?.finnishLevel || user?.finnishLevel || 'A1'} Level
          </p>
          <div className="flex items-center gap-2 mb-5">
            <div className="flex-1 h-1.5 bg-white/20 rounded-full max-w-48">
              <div className="h-full bg-white rounded-full" style={{ width: '65%' }} />
            </div>
            <span className="text-blue-200 text-xs">65%</span>
          </div>
          <Link href="/lessons" className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold text-sm py-2.5 px-5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
            <Play className="w-4 h-4 fill-current" />
            Resume Lesson
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500 streak-flame" />
            <span className="text-orange-600 font-bold text-sm">Daily Challenge</span>
          </div>
          <h3 className="text-slate-800 font-black text-lg mb-1">10 Questions</h3>
          <p className="text-slate-500 text-sm mb-4">Complete today&apos;s challenge to maintain your streak!</p>
          <div className="flex items-center gap-2 text-sm text-slate-400 mb-5">
            <Clock className="w-4 h-4" />
            <span>~5 minutes</span>
            <span className="ml-auto text-orange-600 font-bold">+50 XP</span>
          </div>
          <Link href="/lessons" className="btn-aurora w-full text-sm py-2.5 flex items-center justify-center gap-2 font-semibold">
            Start Challenge <Flame className="w-4 h-4" />
          </Link>
        </motion.div>
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

      {/* LEADERBOARD PREVIEW */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-black text-slate-800">Weekly Leaderboard</h2>
          </div>
          <Link href="/leaderboard" className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1 font-medium">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-2">
          {[
            { rank: 1, name: 'Antti_FI',     xp: 2840, flag: '🇫🇮', streak: 45 },
            { rank: 2, name: 'PriyaLearns',  xp: 2540, flag: '🇮🇳', streak: 32 },
            { rank: 3, name: user?.username || 'You', xp: stats?.totalXP || 1240, flag: '⭐', streak: stats?.currentStreak || 0, isUser: true },
          ].map((entry) => (
            <div key={entry.rank} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              entry.isUser ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                entry.rank === 1 ? 'bg-amber-400 text-white' :
                entry.rank === 2 ? 'bg-slate-300 text-slate-700' :
                'bg-orange-300 text-white'
              }`}>
                {entry.rank}
              </div>
              <span className="text-xl">{entry.flag}</span>
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
      </div>
    </div>
  );
}
