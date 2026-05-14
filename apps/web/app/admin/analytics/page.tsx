'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Users, DollarSign, Zap, Trophy } from 'lucide-react';
import { api } from '@/lib/api';

const LEVEL_COLORS: Record<string, string> = {
  A1: 'from-emerald-400 to-teal-500', A2: 'from-blue-400 to-blue-600',
  B1: 'from-violet-400 to-purple-600', B2: 'from-orange-400 to-orange-600',
  C1: 'from-rose-400 to-rose-600',     C2: 'from-red-500 to-red-700',
};

function BarChart({ data, valueKey, label, color, format = (v: number) => String(v) }: {
  data: { date: string; [k: string]: any }[];
  valueKey: string; label: string; color: string;
  format?: (v: number) => string;
}) {
  const values = data.map(d => d[valueKey] as number);
  const max = Math.max(...values, 1);
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-bold text-slate-700">{label}</div>
        <div className="text-xs text-slate-400">Last 30 days</div>
      </div>
      <div className="text-2xl font-black text-slate-800 mb-4">{format(total)}</div>
      <div className="flex items-end gap-0.5 h-20">
        {data.map((d, i) => {
          const h = max > 0 ? Math.max(2, (d[valueKey] / max) * 100) : 2;
          return (
            <div key={i} className="flex-1 flex flex-col justify-end group relative">
              <div className={`rounded-sm bg-gradient-to-t ${color} opacity-80 group-hover:opacity-100 transition-opacity`} style={{ height: `${h}%` }} />
              {d[valueKey] > 0 && (
                <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {format(d[valueKey])}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-1 text-xs text-slate-400">
        <span>{data[0]?.date?.slice(5)}</span>
        <span>{data[data.length - 1]?.date?.slice(5)}</span>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: () => api.get('/admin/analytics').then(r => r.data.data ?? r.data),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <div className="text-center text-slate-400 py-20 text-sm">Loading analytics…</div>;

  const { signups = [], revenue = [], activity = [], topUsers = [], levelBreakdown = [] } = data || {};

  const totalSignups = signups.reduce((s: number, d: any) => s + d.count, 0);
  const totalRevenue = revenue.reduce((s: number, d: any) => s + d.amount, 0);
  const totalXP = activity.reduce((s: number, d: any) => s + d.xp, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Analytics</h1>
          <p className="text-slate-500 text-sm">Platform activity — last 30 days</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users,     label: 'New Signups',   value: totalSignups,               color: 'from-blue-500 to-indigo-600',   fmt: (v: number) => v.toString() },
          { icon: DollarSign,label: 'Revenue',        value: totalRevenue,               color: 'from-amber-400 to-orange-500',  fmt: (v: number) => `€${v.toFixed(0)}` },
          { icon: Zap,       label: 'XP Earned',     value: totalXP,                    color: 'from-emerald-400 to-teal-500',  fmt: (v: number) => v.toLocaleString() },
        ].map(s => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-sm`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl font-black text-slate-800">{s.fmt(s.value)}</div>
            <div className="text-slate-500 text-sm mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-3 gap-4">
        <BarChart data={signups} valueKey="count" label="Daily Signups" color="from-blue-400 to-indigo-500" />
        <BarChart data={revenue} valueKey="amount" label="Daily Revenue" color="from-amber-400 to-orange-500" format={v => `€${v.toFixed(0)}`} />
        <BarChart data={activity} valueKey="xp" label="XP Activity" color="from-emerald-400 to-teal-500" format={v => v.toLocaleString()} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Top users */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-4 h-4 text-amber-500" />
            <h2 className="font-black text-slate-800 text-sm">Top Users by XP</h2>
          </div>
          <div className="space-y-3">
            {topUsers.map((u: any, i: number) => (
              <div key={u.username} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-400' : 'bg-slate-200 text-slate-600'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-700 truncate">{u.username}</div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mt-1">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (u.totalXP / (topUsers[0]?.totalXP || 1)) * 100)}%` }} />
                  </div>
                </div>
                <div className="text-sm font-bold text-slate-800 flex-shrink-0">{u.totalXP.toLocaleString()} XP</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-blue-500" />
            <h2 className="font-black text-slate-800 text-sm">Users by Level</h2>
          </div>
          <div className="space-y-2.5">
            {(['A1','A2','B1','B2','C1','C2']).map(level => {
              const entry = levelBreakdown.find((l: any) => l.finnishLevel === level);
              const count = entry?._count?.id || 0;
              const max = Math.max(...levelBreakdown.map((l: any) => l._count?.id || 0), 1);
              return (
                <div key={level} className="flex items-center gap-3">
                  <div className="w-7 text-xs font-bold text-slate-600">{level}</div>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div className={`bg-gradient-to-r ${LEVEL_COLORS[level]} h-2 rounded-full transition-all`} style={{ width: `${(count / max) * 100}%` }} />
                  </div>
                  <div className="w-8 text-right text-sm font-semibold text-slate-700">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
