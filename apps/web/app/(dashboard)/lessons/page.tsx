'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen, Headphones, Mic, PenTool, Brain, GraduationCap,
  Trophy, MessageCircle, Lock, CheckCircle2, ChevronRight, Star, Zap,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const LESSON_MODULES = [
  {
    id: 'basics',
    title: 'Finnish Basics',
    description: 'Greetings, numbers, and daily phrases',
    icon: BookOpen,
    color: 'from-cyan-500 to-blue-500',
    level: 'A1',
    lessons: [
      { id: '1', title: 'Greetings & Introductions', xp: 20, completed: true, duration: '10 min' },
      { id: '2', title: 'Numbers 1–100', xp: 20, completed: true, duration: '12 min' },
      { id: '3', title: 'Colors & Shapes', xp: 25, completed: true, duration: '10 min' },
      { id: '4', title: 'Days & Months', xp: 25, completed: false, duration: '15 min' },
      { id: '5', title: 'Basic Phrases', xp: 30, completed: false, duration: '12 min' },
    ],
  },
  {
    id: 'grammar-a1',
    title: 'Grammar Level A1',
    description: 'Nominative, partitive, and basic verbs',
    icon: GraduationCap,
    color: 'from-pink-500 to-rose-600',
    level: 'A1',
    lessons: [
      { id: '6', title: 'Subject Pronouns', xp: 20, completed: true, duration: '8 min' },
      { id: '7', title: 'Verb Conjugation: To Be', xp: 25, completed: false, duration: '15 min' },
      { id: '8', title: 'Nominative Case', xp: 30, completed: false, duration: '20 min' },
      { id: '9', title: 'Partitive Case Intro', xp: 35, completed: false, duration: '20 min' },
    ],
  },
  {
    id: 'vocabulary-a2',
    title: 'Vocabulary Builder A2',
    description: 'Food, travel, work, and nature',
    icon: Brain,
    color: 'from-yellow-400 to-orange-500',
    level: 'A2',
    lessons: [
      { id: '10', title: 'Food & Drinks', xp: 30, completed: false, duration: '15 min' },
      { id: '11', title: 'Transport & Travel', xp: 30, completed: false, duration: '15 min' },
      { id: '12', title: 'Work & Professions', xp: 35, completed: false, duration: '18 min' },
      { id: '13', title: 'Nature & Seasons', xp: 35, completed: false, duration: '15 min' },
    ],
  },
  {
    id: 'listening-a2',
    title: 'Listening Skills A2',
    description: 'Real dialogues and everyday situations',
    icon: Headphones,
    color: 'from-purple-500 to-violet-600',
    level: 'A2',
    lessons: [
      { id: '14', title: 'At the Café', xp: 30, completed: false, duration: '10 min' },
      { id: '15', title: 'Public Transport', xp: 35, completed: false, duration: '12 min' },
      { id: '16', title: 'Phone Conversations', xp: 40, completed: false, duration: '15 min' },
    ],
  },
  {
    id: 'speaking-b1',
    title: 'Speaking Practice B1',
    description: 'Pronunciation and fluency exercises',
    icon: Mic,
    color: 'from-emerald-400 to-teal-500',
    level: 'B1',
    lessons: [
      { id: '17', title: 'Vowel Harmony', xp: 40, completed: false, duration: '15 min' },
      { id: '18', title: 'Long vs Short Vowels', xp: 40, completed: false, duration: '15 min' },
      { id: '19', title: 'Stress Patterns', xp: 45, completed: false, duration: '18 min' },
    ],
  },
  {
    id: 'writing-b1',
    title: 'Writing Skills B1',
    description: 'Essays, letters, and formal writing',
    icon: PenTool,
    color: 'from-blue-500 to-indigo-600',
    level: 'B1',
    lessons: [
      { id: '20', title: 'Formal Letters', xp: 50, completed: false, duration: '20 min' },
      { id: '21', title: 'Opinion Paragraphs', xp: 55, completed: false, duration: '25 min' },
      { id: '22', title: 'Story Writing', xp: 60, completed: false, duration: '30 min' },
    ],
  },
  {
    id: 'yki-b2',
    title: 'YKI Exam Prep B2',
    description: 'Mock tests and exam strategies',
    icon: Trophy,
    color: 'from-blue-600 to-indigo-700',
    level: 'B2',
    lessons: [
      { id: '23', title: 'Reading Comprehension Mock', xp: 80, completed: false, duration: '30 min' },
      { id: '24', title: 'Writing Task Mock', xp: 80, completed: false, duration: '30 min' },
      { id: '25', title: 'Listening Mock', xp: 80, completed: false, duration: '30 min' },
    ],
  },
  {
    id: 'ai-conversation',
    title: 'AI Conversation Practice',
    description: 'Chat with FinnMate AI tutor',
    icon: MessageCircle,
    color: 'from-violet-500 to-blue-600',
    level: 'All',
    lessons: [
      { id: '26', title: 'Daily Conversations', xp: 40, completed: false, duration: 'Open-ended' },
      { id: '27', title: 'Role-play: Restaurant', xp: 40, completed: false, duration: 'Open-ended' },
      { id: '28', title: 'Role-play: Doctor', xp: 45, completed: false, duration: 'Open-ended' },
    ],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  A2: 'bg-blue-100 text-blue-700 border-blue-200',
  B1: 'bg-violet-100 text-violet-700 border-violet-200',
  B2: 'bg-orange-100 text-orange-700 border-orange-200',
  All: 'bg-slate-100 text-slate-700 border-slate-200',
};

export default function LessonsPage() {
  const { user } = useAuthStore();
  const totalLessons = LESSON_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = LESSON_MODULES.reduce((acc, m) => acc + m.lessons.filter((l) => l.completed).length, 0);
  const progressPct = Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-slate-800 mb-0.5">Learning Path</h1>
        <p className="text-slate-500 text-sm">Your structured Finnish learning curriculum</p>
      </motion.div>

      {/* Overall Progress */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-slate-800 font-bold">Overall Progress</div>
            <div className="text-slate-400 text-sm">{completedLessons} of {totalLessons} lessons completed</div>
          </div>
          <div className="text-right">
            <div className="gradient-text font-black text-2xl">{progressPct}%</div>
            <div className="text-slate-400 text-xs">completion</div>
          </div>
        </div>
        <div className="xp-bar">
          <motion.div
            className="xp-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
          <div className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{completedLessons} completed</div>
          <div className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" />{user?.totalXP?.toLocaleString() || 0} XP total</div>
          <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-blue-400" />{user?.finnishLevel || 'A1'} current level</div>
        </div>
      </motion.div>

      {/* Modules Grid */}
      <div className="space-y-4">
        {LESSON_MODULES.map((module, mi) => {
          const moduleCompleted = module.lessons.filter((l) => l.completed).length;
          const modulePct = Math.round((moduleCompleted / module.lessons.length) * 100);
          const isLocked = module.level === 'B2' && (user?.finnishLevel || 'A1') < 'B1';

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mi * 0.06 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              {/* Module Header */}
              <div className="p-5 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-sm flex-shrink-0 ${isLocked ? 'opacity-50' : ''}`}>
                  {isLocked ? <Lock className="w-5 h-5 text-white" /> : <module.icon className="w-5 h-5 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <h3 className="text-slate-800 font-black text-base">{module.title}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[module.level]}`}>{module.level}</span>
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{module.description}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 xp-bar max-w-32">
                      <motion.div
                        className="xp-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${modulePct}%` }}
                        transition={{ duration: 0.8, delay: mi * 0.06 + 0.3 }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{moduleCompleted}/{module.lessons.length}</span>
                  </div>
                </div>
              </div>

              {/* Lesson List */}
              {!isLocked && (
                <div className="border-t border-slate-50">
                  {module.lessons.map((lesson, li) => (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.id}`}
                      className={`flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors group ${
                        li < module.lessons.length - 1 ? 'border-b border-slate-50' : ''
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        lesson.completed
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                      } transition-all`}>
                        {lesson.completed
                          ? <CheckCircle2 className="w-4 h-4" />
                          : <span className="text-xs font-bold">{li + 1}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-semibold ${lesson.completed ? 'text-slate-500' : 'text-slate-700'}`}>
                          {lesson.title}
                        </div>
                        <div className="text-xs text-slate-400">{lesson.duration}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-amber-600 font-semibold">+{lesson.xp} XP</span>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {isLocked && (
                <div className="px-5 py-4 border-t border-slate-50 flex items-center gap-3 text-slate-400">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Complete B1 modules to unlock</span>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
