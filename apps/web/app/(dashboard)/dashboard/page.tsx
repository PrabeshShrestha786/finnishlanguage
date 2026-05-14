'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState, useRef } from 'react';
import Link from 'next/link';
import {
  Flame, BookOpen, Headphones, Mic, PenTool, Brain,
  Trophy, GraduationCap, ChevronRight, Zap, TrendingUp, Loader2,
  AlertCircle, X, ImagePlus, Send, CheckCircle2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

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
  const queryClient = useQueryClient();

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDesc, setReportDesc] = useState('');
  const [reportImage, setReportImage] = useState<string | null>(null);
  const [reportImageName, setReportImageName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReportImageName(file.name);
    const reader = new FileReader();
    reader.onload = () => setReportImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const submitReport = async () => {
    if (!reportDesc.trim()) { toast.error('Please describe the issue'); return; }
    setSubmitting(true);
    try {
      await api.post('/issues', {
        description: reportDesc.trim(),
        imageData: reportImage ?? undefined,
        page: window.location.pathname,
      });
      setSubmitted(true);
      setReportDesc('');
      setReportImage(null);
      setReportImageName('');
    } catch {
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowReportModal(false);
    setTimeout(() => setSubmitted(false), 300);
  };

  const prefetchRoute = useCallback((href: string) => {
    if (href === '/lessons') {
      queryClient.prefetchQuery({
        queryKey: ['courses'],
        queryFn: () => api.get('/lessons/courses').then((r) => r.data.data),
        staleTime: Infinity,
      });
      if (user) {
        queryClient.prefetchQuery({
          queryKey: ['progress'],
          queryFn: () => api.get('/lessons/progress').then((r) => r.data.data),
          staleTime: 30_000,
        });
      }
    } else if (href === '/vocabulary') {
      queryClient.prefetchQuery({
        queryKey: ['vocab-stats'],
        queryFn: () => api.get('/vocabulary/stats').then((r) => r.data.data).catch(() => null),
        staleTime: 30_000,
      });
      queryClient.prefetchQuery({
        queryKey: ['vocab-categories', 'all'],
        queryFn: () => api.get('/vocabulary/categories').then((r) => r.data.data).catch(() => []),
        staleTime: Infinity,
      });
    } else if (href === '/leaderboard') {
      queryClient.prefetchQuery({
        queryKey: ['leaderboard', 'weekly'],
        queryFn: () => api.get('/leaderboard/weekly').then((r) => r.data.data),
        staleTime: 5 * 60 * 1000,
      });
      queryClient.prefetchQuery({
        queryKey: ['leaderboard', 'all-time'],
        queryFn: () => api.get('/leaderboard/all-time').then((r) => r.data.data),
        staleTime: 5 * 60 * 1000,
      });
      if (user) {
        queryClient.prefetchQuery({
          queryKey: ['leaderboard', 'my-rank'],
          queryFn: () => api.get('/leaderboard/my-rank').then((r) => r.data.data),
          staleTime: 5 * 60 * 1000,
        });
      }
    }
  }, [queryClient, user]);

  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/users/dashboard').then((r) => r.data.data),
    staleTime: 30_000,
  });

  const { data: weeklyRaw, isLoading: loadingLeaderboard } = useQuery({
    queryKey: ['leaderboard', 'weekly'],
    queryFn: () => api.get('/leaderboard/weekly').then((r) => r.data.data),
    staleTime: 5 * 60 * 1000,
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
            <Link href="/leaderboard" onMouseEnter={() => prefetchRoute('/leaderboard')} className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1 font-medium">
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
          <Link href="/lessons" onMouseEnter={() => prefetchRoute('/lessons')} className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1 font-medium">
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
              <Link href={mod.href} onMouseEnter={() => prefetchRoute(mod.href)} className="bg-white rounded-2xl p-4 flex flex-col items-start gap-3 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all block">
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

          {/* Report Issue card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: MODULES.length * 0.05 }}
            whileHover={{ y: -3 }}
          >
            <button
              onClick={() => setShowReportModal(true)}
              className="bg-white rounded-2xl p-4 flex flex-col items-start gap-3 border border-slate-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all w-full text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center shadow-sm">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-slate-800 font-bold text-sm">Report Issue</div>
                <div className="text-slate-400 text-xs">Found a bug?</div>
              </div>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Report Issue Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              {submitted ? (
                <div className="flex flex-col items-center gap-4 py-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-slate-800 font-bold text-lg">Report submitted!</div>
                    <div className="text-slate-500 text-sm mt-1">Thank you — we&apos;ll look into it.</div>
                  </div>
                  <button onClick={closeModal} className="btn-primary px-6 py-2 text-sm mt-2">Close</button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-400 to-rose-500 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <h2 className="text-slate-800 font-bold text-base">Report an Issue</h2>
                    </div>
                    <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-slate-700 text-sm font-medium block mb-1.5">Describe the issue</label>
                      <textarea
                        value={reportDesc}
                        onChange={(e) => setReportDesc(e.target.value)}
                        placeholder="What went wrong? What were you doing when it happened?"
                        rows={4}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 text-sm font-medium block mb-1.5">Screenshot (optional)</label>
                      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border-2 border-dashed border-slate-200 rounded-xl py-3 px-4 flex items-center gap-2 text-slate-500 text-sm hover:border-red-300 hover:text-red-400 transition-colors"
                      >
                        <ImagePlus className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{reportImageName || 'Click to attach a screenshot'}</span>
                      </button>
                      {reportImage && (
                        <div className="mt-2 relative">
                          <img src={reportImage} alt="preview" className="w-full rounded-lg max-h-32 object-cover" />
                          <button
                            onClick={() => { setReportImage(null); setReportImageName(''); }}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={submitReport}
                      disabled={submitting || !reportDesc.trim()}
                      className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {submitting ? 'Submitting…' : 'Submit Report'}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
