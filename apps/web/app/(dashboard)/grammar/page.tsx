'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { GRAMMAR_TOPICS, type Level } from './data';

const LEVEL_FILTERS = [
  { id: 'all' as const, label: 'All Levels' },
  { id: 'A1' as const, label: 'A1 · Beginner' },
  { id: 'A2' as const, label: 'A2 · Elementary' },
  { id: 'B1' as const, label: 'B1 · Intermediate' },
  { id: 'B2' as const, label: 'B2 · Upper Intermediate' },
];

const LEVEL_STYLES: Record<string, { badge: string; heading: string; section: string }> = {
  A1: {
    badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    heading: 'text-emerald-600',
    section: 'border-l-4 border-emerald-400 pl-3',
  },
  A2: {
    badge: 'bg-blue-50 text-blue-700 border border-blue-200',
    heading: 'text-blue-600',
    section: 'border-l-4 border-blue-400 pl-3',
  },
  B1: {
    badge: 'bg-purple-50 text-purple-700 border border-purple-200',
    heading: 'text-purple-600',
    section: 'border-l-4 border-purple-400 pl-3',
  },
  B2: {
    badge: 'bg-rose-50 text-rose-700 border border-rose-200',
    heading: 'text-rose-600',
    section: 'border-l-4 border-rose-400 pl-3',
  },
};

export default function GrammarPage() {
  const [levelFilter, setLevelFilter] = useState<'all' | Level>('all');

  const filtered = levelFilter === 'all'
    ? GRAMMAR_TOPICS
    : GRAMMAR_TOPICS.filter((t) => t.level === levelFilter);

  const levels = (['A1', 'A2', 'B1', 'B2'] as Level[]).filter(
    (lvl) => levelFilter === 'all' || lvl === levelFilter,
  );

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        {[
          { label: 'Cases to Master', value: '15', sub: 'Each changes meaning', cls: 'bg-blue-50 border-blue-100', valCls: 'text-blue-600' },
          { label: 'Verb Types', value: '6', sub: 'Conjugation patterns', cls: 'bg-violet-50 border-violet-100', valCls: 'text-violet-600' },
          { label: 'Topics', value: `${GRAMMAR_TOPICS.length}`, sub: 'Across A1 → B2', cls: 'bg-pink-50 border-pink-100', valCls: 'text-pink-600' },
        ].map((s) => (
          <div key={s.label} className={`${s.cls} border rounded-2xl p-2.5 md:p-4 text-center`}>
            <div className={`text-xl md:text-2xl font-black ${s.valCls}`}>{s.value}</div>
            <div className="text-slate-700 text-xs md:text-sm font-bold mt-0.5 leading-tight">{s.label}</div>
            <div className="text-slate-400 text-[10px] md:text-xs hidden sm:block">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Level filter */}
      <div className="flex gap-2 flex-wrap">
        {LEVEL_FILTERS.map((lv) => (
          <motion.button key={lv.id}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setLevelFilter(lv.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
              levelFilter === lv.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600'
            }`}>
            {lv.label}
          </motion.button>
        ))}
      </div>

      {/* Topic grid grouped by level */}
      {levels.map((lvl) => {
        const topics = filtered.filter((t) => t.level === lvl).sort((a, b) => a.chapter - b.chapter);
        if (topics.length === 0) return null;
        const s = LEVEL_STYLES[lvl];
        return (
          <div key={lvl}>
            {levelFilter === 'all' && (
              <div className="flex items-center gap-3 mb-3">
                <div className={s.section}>
                  <span className={`text-sm font-black uppercase tracking-widest ${s.heading}`}>Level {lvl}</span>
                </div>
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-slate-400 text-xs">{topics.length} topics</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topics.map((topic, i) => (
                <motion.div key={topic.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}>
                  <Link href={`/grammar/${topic.id}`}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all block">
                    <div className={`w-12 h-12 rounded-2xl ${topic.accent} flex items-center justify-center text-2xl shrink-0 shadow-sm group-hover:scale-105 transition-transform`}>
                      {topic.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-400 mb-0.5">
                        Chapter {topic.chapter}
                      </div>
                      <div className="text-slate-800 font-bold leading-snug">{topic.title}</div>
                      <div className="text-slate-400 text-xs mt-0.5">{topic.finnish}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}

    </div>
  );
}
