'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Trophy, Flame, Zap, Crown, Medal, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const TABS = ['Weekly', 'All Time'] as const;

const LANGUAGE_CODES: Record<string, string> = {
  ENGLISH: 'gb',
  FINNISH: 'fi',
  NEPALI: 'np',
  HINDI: 'in',
  ARABIC: 'sa',
  URDU: 'pk',
  SPANISH: 'es',
  FRENCH: 'fr',
  GERMAN: 'de',
  RUSSIAN: 'ru',
  CHINESE: 'cn',
  JAPANESE: 'jp',
  KOREAN: 'kr',
  PORTUGUESE: 'pt',
  ITALIAN: 'it',
  SWEDISH: 'se',
};

function FlagImage({ code }: { code?: string }) {
  if (!code) return <span className="text-lg">🌍</span>;
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code.toUpperCase()}
      width={28}
      height={20}
      className="rounded-sm object-cover flex-shrink-0"
    />
  );
}
type Tab = typeof TABS[number];

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <Crown className="w-5 h-5 text-amber-500" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-slate-400" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
  return <span className="text-slate-500 font-black text-sm w-5 text-center">{rank}</span>;
}

function mapWeekly(entries: any[]): any[] {
  return entries.map((e, i) => ({
    rank: i + 1,
    name: e.user?.username || e.user?.firstName || 'User',
    flagCode: LANGUAGE_CODES[e.user?.nativeLanguage],
    xp: e.xp,
    streak: e.user?.currentStreak || 0,
    level: e.user?.finnishLevel || 'A1',
    badge: i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '',
  }));
}

function mapAllTime(users: any[]): any[] {
  return users.map((u, i) => ({
    rank: i + 1,
    name: u.username || u.firstName || 'User',
    flagCode: LANGUAGE_CODES[u.nativeLanguage],
    xp: u.totalXP,
    streak: u.currentStreak || 0,
    level: u.finnishLevel || 'A1',
    badge: i === 0 ? '🏆' : i === 1 ? '🥈' : i === 2 ? '🥉' : '',
  }));
}

export default function LeaderboardClient() {
  const { user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('Weekly');

  const { data: weeklyRaw, isLoading: loadingWeekly } = useQuery({
    queryKey: ['leaderboard', 'weekly'],
    queryFn: () => api.get('/leaderboard/weekly').then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: allTimeRaw, isLoading: loadingAllTime } = useQuery({
    queryKey: ['leaderboard', 'all-time'],
    queryFn: () => api.get('/leaderboard/all-time').then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: myRank } = useQuery({
    queryKey: ['leaderboard', 'my-rank'],
    queryFn: () => api.get('/leaderboard/my-rank').then((r) => r.data.data),
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });

  const weeklyLeaders = weeklyRaw?.length ? mapWeekly(weeklyRaw) : [];
  const allTimeLeaders = allTimeRaw?.length ? mapAllTime(allTimeRaw) : [];
  const leaders = tab === 'Weekly' ? weeklyLeaders : allTimeLeaders;
  const isLoading = tab === 'Weekly' ? loadingWeekly : loadingAllTime;

  const weeklyXP = myRank?.weeklyXP || 0;
  const weeklyRankNum = myRank?.weeklyRank;
  const allTimeRankNum = myRank?.allTimeRank;
  const displayRank = tab === 'Weekly' ? weeklyRankNum : allTimeRankNum;

  return (
    <div className="space-y-6">

      <div className="grid lg:grid-cols-2 gap-6 items-start">

      {/* Top 3 Podium */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 to-indigo-900/30" />
        <div className="relative">
          <div className="text-center text-white/60 text-xs font-bold uppercase tracking-wide mb-5">
            {tab === 'Weekly' ? 'Top Learners This Week' : 'All-Time Top Learners'}
          </div>
          {isLoading ? (
            <div className="text-center text-white/40 text-sm py-4">Loading...</div>
          ) : leaders.length === 0 ? (
            <div className="text-center text-white/40 text-sm py-4">Start learning to appear here!</div>
          ) : (
            <div className="flex items-end justify-center gap-4">
              {/* 2nd place */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
                {leaders[1] ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-400 flex items-center justify-center overflow-hidden mb-2"><FlagImage code={leaders[1].flagCode} /></div>
                    <div className="text-white font-bold text-sm mb-1 max-w-20 truncate">{leaders[1].name}</div>
                    <div className="text-slate-300 text-xs mb-2">{leaders[1].xp.toLocaleString()} XP</div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-700/40 border-2 border-slate-600 flex items-center justify-center mb-2">
                      <span className="text-slate-500 text-xs">?</span>
                    </div>
                    <div className="text-slate-600 text-sm mb-1">—</div>
                    <div className="text-slate-600 text-xs mb-2">—</div>
                  </>
                )}
                <div className="w-16 h-16 bg-slate-500 rounded-t-xl flex items-center justify-center"><span className="text-white font-black text-xl">2</span></div>
              </motion.div>
              {/* 1st place */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col items-center">
                <Crown className="w-6 h-6 text-amber-400 mb-1" />
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-4 border-amber-300 flex items-center justify-center overflow-hidden mb-2 shadow-lg shadow-amber-500/30"><FlagImage code={leaders[0].flagCode} /></div>
                <div className="text-white font-black text-base mb-1 max-w-24 truncate">{leaders[0].name}</div>
                <div className="text-amber-400 font-bold text-sm mb-2">{leaders[0].xp.toLocaleString()} XP</div>
                <div className="w-16 h-24 bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl flex items-center justify-center shadow-lg"><span className="text-white font-black text-2xl">1</span></div>
              </motion.div>
              {/* 3rd place */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col items-center">
                {leaders[2] ? (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-amber-700 flex items-center justify-center overflow-hidden mb-2"><FlagImage code={leaders[2].flagCode} /></div>
                    <div className="text-white font-bold text-sm mb-1 max-w-20 truncate">{leaders[2].name}</div>
                    <div className="text-slate-300 text-xs mb-2">{leaders[2].xp.toLocaleString()} XP</div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 rounded-full bg-slate-700/40 border-2 border-amber-900/40 flex items-center justify-center mb-2">
                      <span className="text-slate-500 text-xs">?</span>
                    </div>
                    <div className="text-slate-600 text-sm mb-1">—</div>
                    <div className="text-slate-600 text-xs mb-2">—</div>
                  </>
                )}
                <div className="w-16 h-12 bg-amber-800 rounded-t-xl flex items-center justify-center"><span className="text-white font-black text-xl">3</span></div>
              </motion.div>
            </div>
          )}

        </div>
      </motion.div>

      {/* Right column: Tabs + List */}
      <div className="space-y-4 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl flex-shrink-0">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                tab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}>
              {t}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-400 hidden sm:block">
          {tab === 'Weekly' ? 'Resets every Monday' : 'All-time rankings'}
        </span>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="bg-blue-50 border-b border-blue-100 px-3 md:px-5 py-2.5 flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="text-blue-700 font-bold text-sm whitespace-nowrap">
              Your Rank: {displayRank ? `#${displayRank}` : 'Unranked'}
            </span>
          </div>
          <div className="flex items-center gap-1 text-sm text-blue-600">
            <Zap className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">
              {tab === 'Weekly' ? `${weeklyXP.toLocaleString()} XP this week` : `${(user?.totalXP || 0).toLocaleString()} XP total`}
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <Trophy className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-semibold">No entries yet</p>
            <p className="text-sm mt-1">Complete lessons to appear on the leaderboard!</p>
          </div>
        ) : (
          leaders.slice(0, 3).map((entry: any, i: number) => {
            const isMe = entry.name === (user?.username || user?.firstName);
            return (
              <motion.div key={entry.rank} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-2 md:gap-4 px-3 md:px-5 py-3 md:py-4 ${i < 2 ? 'border-b border-slate-50' : ''} ${isMe ? 'bg-blue-50/50' : 'hover:bg-slate-50'} transition-colors`}>
                <div className="w-6 md:w-8 flex items-center justify-center flex-shrink-0">
                  <RankBadge rank={entry.rank} />
                </div>
                <div className="flex-shrink-0"><FlagImage code={entry.flagCode} /></div>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm truncate ${isMe ? 'text-blue-700' : 'text-slate-800'}`}>
                    {entry.name} {isMe && <span className="text-blue-500 font-normal">(You)</span>}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 flex-wrap">
                    <Flame className="w-3 h-3 text-orange-400 flex-shrink-0" />
                    <span className="whitespace-nowrap">{entry.streak}d streak</span>
                    <span className={`px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                      entry.level === 'B2' ? 'bg-orange-100 text-orange-700' :
                      entry.level === 'B1' ? 'bg-violet-100 text-violet-700' :
                      entry.level === 'A2' ? 'bg-blue-100 text-blue-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>{entry.level}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-amber-600 font-black text-sm whitespace-nowrap">{entry.xp.toLocaleString()}</div>
                  <div className="text-slate-400 text-xs whitespace-nowrap">{tab === 'Weekly' ? 'XP/week' : 'XP total'}</div>
                </div>
                {entry.rank <= 3 && <div className="text-lg md:text-xl flex-shrink-0">{entry.badge}</div>}
              </motion.div>
            );
          })
        )}
      </div>
      </div> {/* end right column */}
      </div> {/* end grid */}

      {/* How to climb the ranks */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">How to climb the ranks</p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[
            { emoji: '📖', label: 'Reading', xp: '+35–55 XP' },
            { emoji: '✍️', label: 'Writing', xp: '+30–60 XP' },
            { emoji: '🎧', label: 'Listening', xp: '+25–65 XP' },
            { emoji: '🎤', label: 'Speaking', xp: '+20–60 XP' },
            { emoji: '🧠', label: 'Vocabulary', xp: '+5–15 XP' },
            { emoji: '📚', label: 'Grammar', xp: '+20–50 XP' },
          ].map(({ emoji, label, xp }) => (
            <div key={label} className="flex flex-col items-center bg-slate-50 rounded-xl px-3 py-3 text-center">
              <span className="text-2xl mb-1.5">{emoji}</span>
              <div className="text-slate-700 text-xs font-semibold">{label}</div>
              <div className="text-blue-600 text-xs font-bold mt-0.5">{xp}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
