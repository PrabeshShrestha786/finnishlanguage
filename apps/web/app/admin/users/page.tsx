'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, Ban, CheckCircle2, X, ChevronLeft, ChevronRight, Shield, User, Calendar, Zap, BookOpen } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700', A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',   B2: 'bg-orange-100 text-orange-700',
  C1: 'bg-rose-100 text-rose-700',       C2: 'bg-red-100 text-red-700',
};

const PLAN_COLORS: Record<string, string> = {
  FREE: 'bg-slate-100 text-slate-600', PRO: 'bg-blue-100 text-blue-700',
  PREMIUM: 'bg-violet-100 text-violet-700', TEAM: 'bg-emerald-100 text-emerald-700',
};

const ROLE_COLORS: Record<string, string> = {
  USER: 'bg-slate-100 text-slate-600', ADMIN: 'bg-amber-100 text-amber-700',
  SUPER_ADMIN: 'bg-red-100 text-red-700',
};

interface AdminUser {
  id: string; email: string; username: string; firstName: string; lastName: string;
  role: string; finnishLevel: string; totalXP: number; currentStreak: number;
  isBanned: boolean; banReason?: string; createdAt: string;
  subscription?: { plan: string; status: string };
  _count: { attempts: number };
}

function UserDetailModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [banReason, setBanReason] = useState('');
  const [showBanInput, setShowBanInput] = useState(false);

  const banMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${user.id}/ban`, { reason: banReason }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User banned'); onClose(); },
    onError: () => toast.error('Failed to ban user'),
  });

  const unbanMutation = useMutation({
    mutationFn: () => api.post(`/admin/users/${user.id}/unban`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User unbanned'); onClose(); },
    onError: () => toast.error('Failed to unban user'),
  });

  const roleMutation = useMutation({
    mutationFn: (role: string) => api.patch(`/admin/users/${user.id}/role`, { role }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Role updated'); onClose(); },
    onError: () => toast.error('Failed to update role'),
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }} onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h3 className="font-black text-slate-800">User Details</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-lg">
              {user.username[0].toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-slate-800">{user.username}</div>
              <div className="text-slate-500 text-sm">{user.email}</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-lg font-black text-slate-800">{user.totalXP.toLocaleString()}</div>
              <div className="text-xs text-slate-500">Total XP</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-lg font-black text-slate-800">{user._count.attempts}</div>
              <div className="text-xs text-slate-500">Attempts</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
              <div className="text-lg font-black text-slate-800">{user.currentStreak}</div>
              <div className="text-xs text-slate-500">Streak</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_COLORS[user.finnishLevel] || 'bg-slate-100 text-slate-600'}`}>{user.finnishLevel}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PLAN_COLORS[user.subscription?.plan || 'FREE']}`}>{user.subscription?.plan || 'FREE'}</span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ROLE_COLORS[user.role] || 'bg-slate-100 text-slate-600'}`}>{user.role}</span>
            {user.isBanned && <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">BANNED</span>}
          </div>

          <div className="text-xs text-slate-400">Joined {new Date(user.createdAt).toLocaleDateString()}</div>

          {user.isBanned && user.banReason && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">Ban reason: {user.banReason}</div>
          )}

          <div className="border-t border-slate-100 pt-4 space-y-3">
            <div>
              <div className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wide">Change Role</div>
              <div className="flex gap-2">
                {['USER', 'ADMIN', 'SUPER_ADMIN'].map(role => (
                  <button key={role} onClick={() => roleMutation.mutate(role)} disabled={role === user.role}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-all ${role === user.role ? 'bg-blue-50 text-blue-700 border-blue-200' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                    {role}
                  </button>
                ))}
              </div>
            </div>

            {user.isBanned ? (
              <button onClick={() => unbanMutation.mutate()}
                className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Unban User
              </button>
            ) : showBanInput ? (
              <div className="space-y-2">
                <input value={banReason} onChange={e => setBanReason(e.target.value)} placeholder="Ban reason..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-300" />
                <div className="flex gap-2">
                  <button onClick={() => banMutation.mutate()} disabled={!banReason.trim()}
                    className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50">Confirm Ban</button>
                  <button onClick={() => setShowBanInput(false)} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowBanInput(true)}
                className="w-full py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 text-sm font-semibold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                <Ban className="w-4 h-4" /> Ban User
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page, search],
    queryFn: () => api.get('/admin/users', { params: { page, limit: 20, search: search || undefined } }).then(r => r.data.data ?? r.data),
    placeholderData: (prev) => prev,
  });

  const users: AdminUser[] = data?.users || [];
  const totalPages = data?.totalPages || 1;
  const total = data?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
          <Users className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Users</h1>
          <p className="text-slate-500 text-sm">{total.toLocaleString()} total users</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by email or username…"
          className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white shadow-sm" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['User', 'Level', 'Plan', 'Role', 'XP', 'Joined', 'Status', ''].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-slate-400 text-sm">No users found</td></tr>
            ) : users.map((u, i) => (
              <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setSelected(u)}>
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{u.username}</div>
                  <div className="text-slate-400 text-xs">{u.email}</div>
                </td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${LEVEL_COLORS[u.finnishLevel] || 'bg-slate-100 text-slate-600'}`}>{u.finnishLevel}</span></td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLAN_COLORS[u.subscription?.plan || 'FREE']}`}>{u.subscription?.plan || 'FREE'}</span></td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] || 'bg-slate-100 text-slate-600'}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-slate-700 font-medium">{u.totalXP.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {u.isBanned
                    ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Banned</span>
                    : <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">Active</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">View →</button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <UserDetailModal user={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
