'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, BookOpen, DollarSign, TrendingUp, Activity, AlertCircle, Shield, BarChart3 } from 'lucide-react';
import { api } from '@/lib/api';
import Link from 'next/link';

function StatCard({ icon: Icon, label, value, sub, color, trend }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ y: -2 }}
      className="glass-card rounded-3xl p-5 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full`} />
      <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="text-2xl font-black text-white mb-0.5">{value}</div>
      <div className="text-sm text-slate-400">{label}</div>
      {sub && <div className="text-xs text-aurora-green mt-1">{sub}</div>}
    </motion.div>
  );
}

export default function AdminPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then((r) => r.data.data),
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-finn-500 to-aurora-purple flex items-center justify-center shadow-glow">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm">FinnMate platform management</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers?.toLocaleString() || '0'}
          sub={`+${stats?.newUsersThisWeek || 0} this week`} color="from-finn-500 to-finn-700" />
        <StatCard icon={Activity} label="Active Subs" value={stats?.activeSubscriptions || 0}
          sub="Paid plan users" color="from-aurora-green to-teal-500" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`€${(stats?.totalRevenue || 0).toFixed(0)}`}
          sub="All time" color="from-aurora-yellow to-orange-500" />
        <StatCard icon={BookOpen} label="Total Lessons" value={stats?.totalLessons || 0}
          sub="Published" color="from-aurora-purple to-violet-600" />
      </div>

      {/* Plan Breakdown */}
      <div className="glass-card rounded-3xl p-6">
        <h2 className="text-lg font-black text-white mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-finn-400" /> Subscription Breakdown
        </h2>
        <div className="grid grid-cols-4 gap-4">
          {[
            { plan: 'Free', color: 'from-white/20 to-white/10', count: stats?.planBreakdown?.find((p: any) => p.plan === 'FREE')?._count?.id || 0 },
            { plan: 'Pro', color: 'from-finn-500 to-finn-700', count: stats?.planBreakdown?.find((p: any) => p.plan === 'PRO')?._count?.id || 0 },
            { plan: 'Premium', color: 'from-aurora-purple to-violet-600', count: stats?.planBreakdown?.find((p: any) => p.plan === 'PREMIUM')?._count?.id || 0 },
            { plan: 'Team', color: 'from-aurora-green to-teal-500', count: stats?.planBreakdown?.find((p: any) => p.plan === 'TEAM')?._count?.id || 0 },
          ].map((p) => (
            <div key={p.plan} className="text-center glass-light rounded-2xl p-4 border border-white/8">
              <div className={`text-2xl font-black bg-gradient-to-br ${p.color} bg-clip-text text-transparent`}>{p.count}</div>
              <div className="text-slate-400 text-sm">{p.plan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Nav */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { href: '/admin/users', icon: Users, label: 'Manage Users', desc: 'View, ban, search users', color: 'from-finn-500 to-finn-700' },
          { href: '/admin/lessons', icon: BookOpen, label: 'Content CMS', desc: 'Add/edit/delete lessons', color: 'from-aurora-purple to-violet-600' },
          { href: '/admin/analytics', icon: TrendingUp, label: 'Analytics', desc: 'Revenue & engagement', color: 'from-aurora-green to-teal-500' },
        ].map((item, i) => (
          <motion.div key={item.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ y: -3 }}>
            <Link href={item.href} className="glass-card rounded-3xl p-6 block card-hover">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-3 shadow-glow-sm`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-white font-bold">{item.label}</div>
              <div className="text-slate-500 text-sm">{item.desc}</div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
