'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  BookOpen, Headphones, Mic, PenTool, Brain, GraduationCap,
  Trophy, MessageCircle, Lock, CheckCircle2, ChevronRight, Star, Zap, Loader2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const TYPE_ICON: Record<string, any> = {
  VOCABULARY: Brain,
  GRAMMAR: GraduationCap,
  READING: BookOpen,
  LISTENING: Headphones,
  SPEAKING: Mic,
  WRITING: PenTool,
  YKI_PREP: Trophy,
  CONVERSATION: MessageCircle,
  DEFAULT: BookOpen,
};

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  A2: 'bg-blue-100 text-blue-700 border-blue-200',
  B1: 'bg-violet-100 text-violet-700 border-violet-200',
  B2: 'bg-orange-100 text-orange-700 border-orange-200',
};

const COURSE_COLORS: Record<string, string> = {
  'course-a1-basics': 'from-cyan-500 to-blue-500',
  'course-a2-elementary': 'from-blue-500 to-indigo-600',
  'course-b1-intermediate': 'from-violet-500 to-purple-600',
};

export default function LessonsClient() {
  const { user } = useAuthStore();

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/lessons/courses').then((r) => r.data.data),
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000,
  });

  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: () => api.get('/lessons/progress').then((r) => r.data.data),
    enabled: !!user,
    staleTime: 30_000,
  });

  const completedLessonIds = new Set<string>(
    (progress?.attempts || []).map((a: any) => a.lessonId).filter(Boolean)
  );

  const allLessons = (courses || []).flatMap((c: any) =>
    c.modules.flatMap((m: any) => m.lessons)
  );
  const totalLessons = allLessons.length;
  const completedCount = allLessons.filter((l: any) => completedLessonIds.has(l.id)).length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  if (coursesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

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
            <div className="text-slate-400 text-sm">{completedCount} of {totalLessons} lessons completed</div>
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
          <div className="flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />{completedCount} completed</div>
          <div className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" />{user?.totalXP?.toLocaleString() || 0} XP total</div>
          <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-blue-400" />{user?.finnishLevel || 'A1'} current level</div>
        </div>
      </motion.div>

      {/* Courses */}
      <div className="space-y-6">
        {(courses || []).map((course: any, ci: number) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.08 }}>
            {/* Course Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`h-1 w-6 rounded-full bg-gradient-to-r ${COURSE_COLORS[course.id] || 'from-slate-400 to-slate-500'}`} />
              <h2 className="text-base font-black text-slate-700">{course.title}</h2>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[course.level] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {course.level}
              </span>
            </div>

            {/* Modules */}
            <div className="space-y-3">
              {course.modules.map((module: any, mi: number) => {
                const Icon = TYPE_ICON[module.type] || TYPE_ICON.DEFAULT;
                const color = COURSE_COLORS[course.id] || 'from-slate-400 to-slate-500';
                const moduleCompleted = module.lessons.filter((l: any) => completedLessonIds.has(l.id)).length;
                const modulePct = module.lessons.length > 0
                  ? Math.round((moduleCompleted / module.lessons.length) * 100) : 0;

                return (
                  <motion.div key={module.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: ci * 0.08 + mi * 0.04 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Module Header */}
                    <div className="p-5 flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-slate-800 font-black text-base mb-0.5">{module.title}</h3>
                        <p className="text-slate-400 text-sm mb-2">{module.description}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 xp-bar max-w-32">
                            <motion.div className="xp-bar-fill" initial={{ width: 0 }}
                              animate={{ width: `${modulePct}%` }}
                              transition={{ duration: 0.8, delay: ci * 0.08 + mi * 0.04 + 0.3 }} />
                          </div>
                          <span className="text-xs text-slate-400">{moduleCompleted}/{module.lessons.length}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lessons */}
                    <div className="border-t border-slate-50">
                      {module.lessons.map((lesson: any, li: number) => {
                        const isCompleted = completedLessonIds.has(lesson.id);
                        const isLocked = !lesson.isFree && !user?.subscription;
                        return (
                          <Link key={lesson.id} href={`/lessons/${lesson.id}`}
                            className={`flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors group ${
                              li < module.lessons.length - 1 ? 'border-b border-slate-50' : ''
                            }`}>
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isCompleted ? 'bg-emerald-100 text-emerald-600'
                              : isLocked ? 'bg-slate-100 text-slate-300'
                              : 'bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600'
                            }`}>
                              {isCompleted ? <CheckCircle2 className="w-4 h-4" />
                                : isLocked ? <Lock className="w-3.5 h-3.5" />
                                : <span className="text-xs font-bold">{li + 1}</span>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className={`text-sm font-semibold ${isCompleted ? 'text-slate-400' : 'text-slate-700'}`}>
                                {lesson.title}
                              </div>
                              <div className="text-xs text-slate-400">{lesson.estimatedMinutes} min</div>
                            </div>
                            <div className="flex items-center gap-2">
                              {lesson.isFree && (
                                <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-1.5 py-0.5 rounded-full font-semibold">Free</span>
                              )}
                              <span className="text-xs text-amber-600 font-semibold">+{lesson.xpReward} XP</span>
                              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
