'use client';

import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BookOpen, ChevronDown, ChevronRight, Eye, EyeOff, Layers } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useState } from 'react';

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',   B2: 'bg-orange-100 text-orange-700',
  C1: 'bg-rose-100 text-rose-700',       C2: 'bg-red-100 text-red-700',
};

interface Lesson { id: string; title: string; type: string; level: string; xpReward: number; isPublished: boolean; estimatedMinutes: number; }
interface Module  { id: string; title: string; type: string; isPublished: boolean; _count: { lessons: number }; lessons?: Lesson[]; }
interface Course  { id: string; title: string; description: string; level: string; isPublished: boolean; order: number; _count: { modules: number }; modules: Module[]; }

function PublishToggle({ published, onToggle, loading }: { published: boolean; onToggle: () => void; loading?: boolean }) {
  return (
    <button onClick={onToggle} disabled={loading}
      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border transition-all ${
        published ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
      }`}>
      {published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
      {published ? 'Published' : 'Draft'}
    </button>
  );
}

function CourseRow({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const courseToggle = useMutation({
    mutationFn: () => api.patch(`/admin/courses/${course.id}/publish`, { isPublished: !course.isPublished }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-courses'] }); toast.success('Course updated'); },
    onError: () => toast.error('Failed'),
  });

  const lessonToggle = useMutation({
    mutationFn: ({ id, val }: { id: string; val: boolean }) => api.patch(`/admin/lessons/${id}/publish`, { isPublished: val }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-courses'] }); toast.success('Lesson updated'); },
    onError: () => toast.error('Failed'),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setOpen(o => !o)}>
        <button className="text-slate-400 flex-shrink-0">{open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-slate-800 text-sm">{course.title}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[course.level] || 'bg-slate-100 text-slate-600'}`}>{course.level}</span>
          </div>
          <div className="text-slate-400 text-xs mt-0.5">{course._count.modules} modules</div>
        </div>
        <div onClick={e => e.stopPropagation()}>
          <PublishToggle published={course.isPublished} onToggle={() => courseToggle.mutate()} loading={courseToggle.isPending} />
        </div>
      </div>

      {open && (
        <div className="border-t border-slate-100">
          {course.modules.map(mod => (
            <div key={mod.id} className="px-5 py-3 border-b border-slate-50 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                <Layers className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 ml-6" />
                <span className="font-semibold text-slate-700 text-sm flex-1">{mod.title}</span>
                <span className="text-xs text-slate-400">{mod._count.lessons} lessons</span>
              </div>
            </div>
          ))}
          {course.modules.length === 0 && (
            <div className="px-5 py-4 text-slate-400 text-sm text-center">No modules yet</div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminLessonsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => api.get('/admin/courses').then(r => r.data.data ?? r.data),
  });

  const courses: Course[] = data || [];
  const totalLessons = courses.reduce((sum, c) => sum + c.modules.reduce((s, m) => s + m._count.lessons, 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Lessons</h1>
          <p className="text-slate-500 text-sm">{courses.length} courses · {totalLessons} lessons</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Courses', value: courses.length, color: 'from-violet-500 to-purple-600' },
          { label: 'Published', value: courses.filter(c => c.isPublished).length, color: 'from-emerald-400 to-teal-500' },
          { label: 'Total Lessons', value: totalLessons, color: 'from-blue-500 to-indigo-600' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className={`text-2xl font-black bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
            <div className="text-slate-500 text-sm mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center text-slate-400 py-12 text-sm">Loading…</div>
      ) : courses.length === 0 ? (
        <div className="text-center text-slate-400 py-16">
          <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No courses found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course, i) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <CourseRow course={course} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
