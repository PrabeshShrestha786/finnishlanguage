'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, DollarSign, TrendingUp, Activity, Shield, BarChart3, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

function StatCard({ icon: Icon, label, value, sub, color }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -2 }}
      className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${color} opacity-5 rounded-bl-full`} />
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 shadow-sm`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-black text-slate-800 mb-0.5">{value}</div>
      <div className="text-sm text-slate-500">{label}</div>
      {sub && <div className="text-xs text-emerald-600 font-medium mt-1">{sub}</div>}
    </motion.div>
  );
}

export default function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then((r) => r.data.data),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">FinnMate platform management</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers?.toLocaleString() || '0'}
          sub={`+${stats?.newUsersThisWeek || 0} this week`} color="from-blue-500 to-indigo-600" />
        <StatCard icon={Activity} label="Active Subs" value={stats?.activeSubscriptions || 0}
          sub="Paid plan users" color="from-emerald-400 to-teal-500" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`€${(stats?.totalRevenue || 0).toFixed(0)}`}
          sub="All time" color="from-amber-400 to-orange-500" />
        <StatCard icon={BookOpen} label="Total Lessons" value={stats?.totalLessons || 0}
          sub="Published" color="from-violet-500 to-purple-600" />
      </div>

      {/* Plan Breakdown */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-500" /> Subscription Breakdown
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {[
            { plan: 'Free',    color: 'from-slate-400 to-slate-500',    count: stats?.planBreakdown?.find((p: any) => p.plan === 'FREE')?._count?.id || 0 },
            { plan: 'Pro',     color: 'from-blue-500 to-indigo-600',    count: stats?.planBreakdown?.find((p: any) => p.plan === 'PRO')?._count?.id || 0 },
            { plan: 'Premium', color: 'from-violet-500 to-purple-600',  count: stats?.planBreakdown?.find((p: any) => p.plan === 'PREMIUM')?._count?.id || 0 },
            { plan: 'Team',    color: 'from-emerald-400 to-teal-500',   count: stats?.planBreakdown?.find((p: any) => p.plan === 'TEAM')?._count?.id || 0 },
          ].map((p) => (
            <div key={p.plan} className="text-center bg-slate-50 rounded-xl p-4 border border-slate-100">
              <div className={`text-2xl font-black bg-gradient-to-br ${p.color} bg-clip-text text-transparent`}>{p.count}</div>
              <div className="text-slate-500 text-sm mt-0.5">{p.plan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick nav */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: '/admin/users',    icon: Users,        label: 'Manage Users',  desc: 'View, ban, search users',    color: 'from-blue-500 to-indigo-600' },
          { href: '/admin/lessons',  icon: BookOpen,     label: 'Content CMS',   desc: 'Add/edit/delete lessons',    color: 'from-violet-500 to-purple-600' },
          { href: '/admin/issues',   icon: AlertCircle,  label: 'Issue Reports', desc: 'View and resolve reports',   color: 'from-red-400 to-rose-500' },
        ].map((item, i) => (
          <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -3 }}>
            <Link href={item.href} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all block">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-sm`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-slate-800 font-bold text-sm">{item.label}</div>
              <div className="text-slate-400 text-xs mt-0.5">{item.desc}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
