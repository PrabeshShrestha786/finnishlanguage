'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Flame, Zap, Crown, Medal, Star, TrendingUp, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const MOCK_LEADERS = [
  { rank: 1,  name: 'Antti_FI',       flag: '🇫🇮', xp: 4820, streak: 67, level: 'B2', badge: '🏆' },
  { rank: 2,  name: 'PriyaLearns',    flag: '🇮🇳', xp: 4540, streak: 42, level: 'B1', badge: '🥈' },
  { rank: 3,  name: 'YukiSuomi',      flag: '🇯🇵', xp: 4230, streak: 38, level: 'B1', badge: '🥉' },
  { rank: 4,  name: 'MarcoFinnland',  flag: '🇮🇹', xp: 3980, streak: 29, level: 'A2', badge: '' },
  { rank: 5,  name: 'SarahFiLearner', flag: '🇬🇧', xp: 3720, streak: 21, level: 'A2', badge: '' },
  { rank: 6,  name: 'KimuraFi',       flag: '🇰🇷', xp: 3450, streak: 18, level: 'A2', badge: '' },
  { rank: 7,  name: 'AmirHelsinki',   flag: '🇮🇷', xp: 3120, streak: 15, level: 'A1', badge: '' },
  { rank: 8,  name: 'IvanaFinska',    flag: '🇷🇺', xp: 2950, streak: 14, level: 'A1', badge: '' },
  { rank: 9,  name: 'ChenSuomi',      flag: '🇨🇳', xp: 2780, streak: 12, level: 'A1', badge: '' },
  { rank: 10, name: 'KalidouFi',      flag: '🇸🇳', xp: 2540, streak: 10, level: 'A1', badge: '' },
];

const TABS = ['Weekly', 'All Time', 'By Level'] as const;
type Tab = typeof TABS[number];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
  return <span className="text-slate-500 font-black text-sm w-5 text-center">{rank}</span>;
}

export default function LeaderboardPage() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('Weekly');

  const { data: leaderData } = useQuery({
    queryKey: ['leaderboard', tab],
    queryFn: () => api.get('/leaderboard/weekly').then((r) => r.data.data).catch(() => null),
    staleTime: 60_000,
  });

  const leaders = leaderData || MOCK_LEADERS;
  const userRank = 3;
  const userEntry = { rank: userRank, name: user?.username || 'You', flag: '⭐', xp: user?.totalXP || 1240, streak: user?.currentStreak || 0, level: user?.finnishLevel || 'A1', badge: '' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-slate-800 mb-0.5">Leaderboard</h1>
        <p className="text-slate-500 text-sm">Compete with Finnish learners worldwide</p>
      </motion.div>

      {/* Top 3 Podium */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30" />
        <div className="relative">
          <div className="text-center text-white/60 text-xs font-bold uppercase tracking-wide mb-5">Top Learners This Week</div>
          <div className="flex items-end justify-center gap-4">
            {/* 2nd */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-400 flex items-center justify-center text-xl mb-2">{leaders[1]?.flag}</div>
              <div className="text-white font-bold text-sm mb-1">{leaders[1]?.name}</div>
              <div className="text-slate-300 text-xs mb-2">{leaders[1]?.xp.toLocaleString()} XP</div>
              <div className="w-16 h-16 bg-slate-500 rounded-t-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">2</span>
              </div>
            </motion.div>
            {/* 1st */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
              <Crown className="w-6 h-6 text-amber-400 mb-1" />
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-amber-300 flex items-center justify-center text-2xl mb-2 shadow-lg shadow-amber-500/30">{leaders[0]?.flag}</div>
              <div className="text-white font-black text-base mb-1">{leaders[0]?.name}</div>
              <div className="text-amber-400 font-bold text-sm mb-2">{leaders[0]?.xp.toLocaleString()} XP</div>
              <div className="w-16 h-24 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">1</span>
              </div>
            </motion.div>
            {/* 3rd */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-amber-700 flex items-center justify-center text-xl mb-2">{leaders[2]?.flag}</div>
              <div className="text-white font-bold text-sm mb-1">{leaders[2]?.name}</div>
              <div className="text-slate-300 text-xs mb-2">{leaders[2]?.xp.toLocaleString()} XP</div>
              <div className="w-16 h-12 bg-amber-800 rounded-t-xl flex items-center justify-center">
                <span className="text-white font-black text-xl">3</span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Leaderboard List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Your rank */}
        <div className="bg-blue-50 border-b border-blue-100 px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-blue-500" />
            <span className="text-blue-700 font-bold text-sm">Your Rank: #{userRank}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold">{userEntry.xp.toLocaleString()} XP this week</span>
          </div>
        </div>

        {leaders.slice(0, 10).map((entry, i) => {
          const isUser = entry.rank === userRank;
          return (
            <motion.div
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-4 px-5 py-4 ${
                i < leaders.length - 1 ? 'border-b border-slate-50' : ''
              } ${isUser ? 'bg-blue-50/50' : 'hover:bg-slate-50'} transition-colors`}
            >
              <div className="w-8 flex items-center justify-center flex-shrink-0">
                <RankBadge rank={entry.rank} />
              </div>
              <div className="text-2xl flex-shrink-0">{entry.flag}</div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-sm ${isUser ? 'text-blue-700' : 'text-slate-800'}`}>
                  {entry.name} {isUser && <span className="text-blue-500 font-normal">(You)</span>}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <Flame className="w-3 h-3 text-orange-400" />
                  <span>{entry.streak} day streak</span>
                  <span className={`px-1.5 py-0.5 rounded-full font-semibold ${
                    entry.level === 'B2' ? 'bg-orange-100 text-orange-700' :
                    entry.level === 'B1' ? 'bg-violet-100 text-violet-700' :
                    entry.level === 'A2' ? 'bg-blue-100 text-blue-700' :
                    'bg-emerald-100 text-emerald-700'
                  }`}>{entry.level}</span>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-amber-600 font-black text-sm">{entry.xp.toLocaleString()}</div>
                <div className="text-slate-400 text-xs">XP this week</div>
              </div>
              {entry.rank <= 3 && (
                <div className="text-xl flex-shrink-0">{entry.badge}</div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Active Learners', value: '12,840', color: 'from-blue-500 to-indigo-600' },
          { icon: TrendingUp, label: 'XP This Week', value: '2.4M', color: 'from-emerald-400 to-teal-500' },
          { icon: Star, label: 'Top Country', value: '🇫🇮 Finland', color: 'from-amber-400 to-orange-500' },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.07 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
              <Icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-slate-800 font-black text-lg">{value}</div>
            <div className="text-slate-400 text-xs">{label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
