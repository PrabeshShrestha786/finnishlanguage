'use client';

import { motion } from 'framer-motion';
import { Trophy, Lock, Sparkles, CheckCircle2, BookOpen, Clock, Target, Zap } from 'lucide-react';

const FEATURES = [
  { icon: BookOpen,      text: 'Full-length mock exams in official YKI format' },
  { icon: Target,        text: 'A2 · B1 · B2 · C1 level tests with detailed scoring' },
  { icon: Clock,         text: 'Timed sessions with real exam pressure simulation' },
  { icon: Zap,           text: 'AI-powered answer analysis & personalised feedback' },
  { icon: CheckCircle2,  text: 'Progress tracking across multiple attempts' },
  { icon: Trophy,        text: 'XP rewards and certificate-readiness score' },
];

export default function YkiPrepPage() {
  return (
    <div className="grid lg:grid-cols-2 gap-6 items-stretch">

      {/* Left: Gradient hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl overflow-hidden shadow-lg flex flex-col"
      >
        <div className="relative flex-1 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 px-8 pt-12 pb-12 text-center overflow-hidden flex flex-col items-center justify-center">
          {/* Decorative rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-72 h-72 rounded-full border border-white/10" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 rounded-full border border-white/10" />
          </div>

          {/* Lock icon */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.25, type: 'spring', stiffness: 200 }}
            className="relative inline-flex w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/25 items-center justify-center mb-5 shadow-xl"
          >
            <Lock className="w-9 h-9 text-white" />
          </motion.div>

          {/* Premium badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
            className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wide uppercase"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Premium Feature
          </motion.div>

          <h2 className="text-white text-3xl font-black mb-2 tracking-tight">Coming Soon</h2>
          <p className="text-blue-100 text-sm leading-relaxed max-w-sm mx-auto">
            YKI Prep is being crafted for FinnMate Premium members. Full mock exams in the official national test format — launching very soon.
          </p>
        </div>

        {/* Footer strip inside left card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-slate-800 font-bold text-sm">Be the first to know</p>
            <p className="text-slate-500 text-xs mt-0.5">
              YKI Prep will be available exclusively to Premium subscribers. Stay tuned — it&apos;s almost here.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right: Header + Features */}
      <div className="flex flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">YKI Exam Preparation</h1>
          </div>
        </motion.div>

        {/* Features */}
        <div className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-lg p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">What&apos;s included in Premium</p>
          <div className="grid grid-cols-1 gap-3">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.06 }}
                className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-slate-600 text-sm leading-snug pt-0.5">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
