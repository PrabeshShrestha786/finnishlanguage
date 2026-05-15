'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, AlertCircle, Flame, Zap, Bell,
  Trophy, UserCircle, X, ImagePlus, Send, CheckCircle2, Loader2,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/layout/Sidebar';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

// ── Mobile bottom nav items ──────────────────────────────────────────────────
const MOBILE_NAV = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Home' },
  { href: '/leaderboard',icon: Trophy,           label: 'Ranks' },
  { href: '/profile',    icon: UserCircle,       label: 'Profile' },
];

const REPORT_NAV = { icon: AlertCircle, label: 'Report issue' };

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':  'Dashboard',
  '/reading':    'Reading',
  '/listening':  'Listening',
  '/speaking':   'Speaking',
  '/writing':    'Writing',
  '/vocabulary': 'Vocabulary',
  '/grammar':    'Grammar',
  '/yki-prep':   'YKI Prep',
  '/ai-tutor':   'AI Tutor',
  '/profile':    'Profile',
  '/leaderboard':'Leaderboard',
  '/lessons':    'Lessons',
};

// ── Finnish loading facts ────────────────────────────────────────────────────
const FINNISH_FACTS = [
  { emoji: '🇫🇮', label: 'Fun Fact', text: 'Finnish has 15 grammatical cases — English has only 3!' },
  { emoji: '🌲', label: 'Nature', text: 'Finland has over 188,000 lakes — more than any other country in the world.' },
  { emoji: '📚', label: 'Language', text: '"Kirjasto" means library in Finnish, from "kirja" (book). Finnish is very logical!' },
  { emoji: '☀️', label: 'Culture', text: 'In summer, Finland enjoys the Midnight Sun — the sun never fully sets for weeks.' },
  { emoji: '🛁', label: 'Tradition', text: 'Finland has over 3 million saunas for a population of 5.5 million people.' },
  { emoji: '🗣️', label: 'Language', text: '"Talkoot" is a uniquely Finnish word for coming together to help a neighbor.' },
  { emoji: '🎵', label: 'Culture', text: 'Finland has the most heavy metal bands per capita of any country in the world.' },
  { emoji: '📖', label: 'Language', text: 'Finnish and Hungarian are distantly related — both belong to the Finno-Ugric family.' },
  { emoji: '❄️', label: 'Nature', text: 'Finland experiences four distinct seasons, with stunning snow-covered winters.' },
  { emoji: '🏆', label: 'Achievement', text: 'Finland consistently ranks as one of the happiest countries in the world.' },
  { emoji: '☕', label: 'Culture', text: 'Finland is the world\'s biggest coffee consumer per capita — 12 kg per person per year!' },
  { emoji: '📝', label: 'Language', text: 'Finnish words are spelled exactly as they are pronounced — perfectly phonetic.' },
  { emoji: '🌿', label: 'Nature', text: 'About 75% of Finland is covered by forest — one of the most forested nations in Europe.' },
  { emoji: '🎓', label: 'Language', text: '"Opiskella" means to study in Finnish. You\'re doing exactly that — hienoa (great)!' },
  { emoji: '🌍', label: 'Language', text: 'Finnish has no future tense — the present tense is used to describe future events too!' },
  { emoji: '🗣️', label: 'Language', text: '"Sisu" means inner strength and resilience — there\'s no exact English translation.' },
];

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

function LoadingScreen() {
  const [facts, setFacts] = useState(FINNISH_FACTS);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setFacts([...FINNISH_FACTS].sort(() => Math.random() - 0.5));
  }, []);

  const fact = facts[index];
  const typed = useTypewriter(fact.text);

  useEffect(() => {
    if (typed.length < fact.text.length) return;
    const timer = setTimeout(() => {
      setIndex(i => (i + 1) % facts.length);
    }, 2500);
    return () => clearTimeout(timer);
  }, [typed, fact.text, facts.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm w-full">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-lg animate-pulse">
          F
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <div className="space-y-1">
          <p className="text-slate-700 font-bold text-sm">We are preparing your content</p>
          <p className="text-slate-400 text-xs">for your better learning experience&hellip;</p>
        </div>
        <div className="w-full bg-white border border-blue-100 rounded-2xl p-5 shadow-sm text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{fact.emoji}</span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{fact.label}</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed min-h-[3.5rem]">
            {typed}
            <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
          </p>
        </div>
        <p className="text-slate-300 text-xs">Free-tier server wakes up in ~30&ndash;60 s</p>
      </div>
    </div>
  );
}

// ── Mobile header ────────────────────────────────────────────────────────────
function MobileHeader() {
  const { user } = useAuthStore();
  const pathname = usePathname();
  const title = Object.entries(PAGE_TITLES).find(([k]) => pathname.startsWith(k))?.[1] || 'FinnMate';

  return (
    <header className="md:hidden sticky top-0 z-30 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
      <Link href="/dashboard" className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-base flex-shrink-0">
        F
      </Link>
      <span className="flex-1 font-black text-slate-800 text-base truncate">{title}</span>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg">
          <Flame className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-orange-600 text-xs font-bold">{user?.currentStreak || 0}</span>
        </div>
        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-2 py-1 rounded-lg">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-amber-600 text-xs font-bold">{(user?.totalXP || 0).toLocaleString()}</span>
        </div>
        <button className="relative p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 transition-all">
          <Bell className="w-4 h-4" />
          <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </button>
        <Link href="/profile" className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
          {user?.avatar ? (
            <Image src={user.avatar} alt="" width={32} height={32} className="object-cover w-full h-full" />
          ) : (
            user?.firstName?.[0] || 'U'
          )}
        </Link>
      </div>
    </header>
  );
}

// ── Mobile bottom nav ────────────────────────────────────────────────────────
function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const openReport = () => window.dispatchEvent(new CustomEvent('open-report-modal'));

  // Navigate on touchStart so document-level click listeners on child pages
  // (e.g. reading/listening word-tooltip close handlers) don't intercept the tap.
  const handleNavTouch = (href: string) => (e: React.TouchEvent) => {
    e.preventDefault();
    router.push(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 shadow-lg">
      <div className="flex items-center justify-around px-1 py-2">
        {/* Home */}
        {MOBILE_NAV.slice(0, 1).map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              onTouchStart={handleNavTouch(item.href)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px] touch-manipulation">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm' : 'bg-slate-100'}`}>
                <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-blue-600' : 'text-slate-400'}`}>{item.label}</span>
            </Link>
          );
        })}

        {/* Report Issues button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); openReport(); }}
          onClick={openReport}
          className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px] touch-manipulation">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center transition-all hover:bg-red-100">
            <REPORT_NAV.icon className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-[10px] font-semibold text-slate-400">{REPORT_NAV.label}</span>
        </button>

        {/* Ranks + Profile */}
        {MOBILE_NAV.slice(1).map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}
              onTouchStart={handleNavTouch(item.href)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 min-w-[56px] touch-manipulation">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${active ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-sm' : 'bg-slate-100'}`}>
                <item.icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
              </div>
              <span className={`text-[10px] font-semibold ${active ? 'text-blue-600' : 'text-slate-400'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ── Report Issue Modal ───────────────────────────────────────────────────────
function ReportModal({ onClose }: { onClose: () => void }) {
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
    } catch {
      toast.error('Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => { setSubmitted(false); setReportDesc(''); setReportImage(null); setReportImageName(''); }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={close}
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
            <button onClick={close} className="btn-primary px-6 py-2 text-sm mt-2">Close</button>
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
              <button onClick={close} className="text-slate-400 hover:text-slate-600 transition-colors">
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
  );
}

// ── Layout ───────────────────────────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized, initAuth } = useAuthStore();
  const router = useRouter();
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { if (initialized && !user) router.push('/login'); }, [user, initialized, router]);

  useEffect(() => {
    const handler = () => setShowReportModal(true);
    window.addEventListener('open-report-modal', handler);
    return () => window.removeEventListener('open-report-modal', handler);
  }, []);

  if (!initialized) return <LoadingScreen />;
  if (!user) return null;

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar — desktop only */}
      <div className="hidden md:flex h-full">
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <MobileHeader />

        <main className="flex-1 overflow-y-auto">
          {/* pb-20 on mobile leaves room above the bottom nav */}
          <div className="max-w-7xl mx-auto p-4 md:p-6 pb-24 md:pb-6">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom nav — mobile only */}
      <MobileBottomNav />

      {/* Report modal — available on every page */}
      <AnimatePresence>
        {showReportModal && <ReportModal onClose={() => setShowReportModal(false)} />}
      </AnimatePresence>
    </div>
  );
}
