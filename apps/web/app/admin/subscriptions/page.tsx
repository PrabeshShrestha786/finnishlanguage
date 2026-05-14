'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tag, Plus, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const PLAN_COLORS: Record<string, string> = {
  FREE: 'bg-slate-100 text-slate-600', PRO: 'bg-blue-100 text-blue-700',
  PREMIUM: 'bg-violet-100 text-violet-700', TEAM: 'bg-emerald-100 text-emerald-700',
};
const STATUS_COLORS: Record<string, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700', CANCELED: 'bg-red-100 text-red-600',
  PAST_DUE: 'bg-amber-100 text-amber-700', TRIALING: 'bg-blue-100 text-blue-600',
};

interface Sub {
  id: string; plan: string; status: string; createdAt: string;
  currentPeriodEnd?: string; discountPercent?: number;
  user: { id: string; email: string; username: string; finnishLevel: string };
}
interface Coupon {
  id: string; code: string; discountPercent: number; maxUses?: number; usedCount: number;
  validUntil?: string; isActive: boolean; createdAt: string;
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: () => api.patch(`/admin/coupons/${coupon.id}/toggle`, { isActive: !coupon.isActive }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon updated'); },
    onError: () => toast.error('Failed'),
  });

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-4 transition-all ${coupon.isActive ? 'border-slate-100' : 'border-slate-100 opacity-60'}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-bold text-slate-800 font-mono text-sm">{coupon.code}</div>
          <div className="text-emerald-600 font-black text-lg">{coupon.discountPercent}% off</div>
          <div className="text-xs text-slate-400 mt-1">
            {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ''} uses
            {coupon.validUntil && ` · expires ${new Date(coupon.validUntil).toLocaleDateString()}`}
          </div>
        </div>
        <button onClick={() => mutate()} disabled={isPending}
          className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 mt-1">
          {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : coupon.isActive ? <ToggleRight className="w-5 h-5 text-emerald-500" /> : <ToggleLeft className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}

function CreateCouponForm({ onClose }: { onClose: () => void }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ code: '', discountPercent: 10, maxUses: '', validUntil: '' });

  const { mutate, isPending } = useMutation({
    mutationFn: () => api.post('/admin/coupons', {
      code: form.code.toUpperCase(),
      discountPercent: form.discountPercent,
      maxUses: form.maxUses ? Number(form.maxUses) : undefined,
      validUntil: form.validUntil || undefined,
    }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-coupons'] }); toast.success('Coupon created'); onClose(); },
    onError: () => toast.error('Failed to create coupon'),
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
      <h3 className="font-black text-slate-800 text-sm">New Coupon</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Code</label>
          <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
            placeholder="SUMMER20" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Discount %</label>
          <input type="number" min={1} max={100} value={form.discountPercent}
            onChange={e => setForm(f => ({ ...f, discountPercent: Number(e.target.value) }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Max Uses (optional)</label>
          <input type="number" value={form.maxUses} onChange={e => setForm(f => ({ ...f, maxUses: e.target.value }))}
            placeholder="Unlimited" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-500 mb-1 block">Expires (optional)</label>
          <input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={() => mutate()} disabled={isPending || !form.code.trim()}
          className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
          {isPending && <Loader2 className="w-4 h-4 animate-spin" />} Create Coupon
        </button>
        <button onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-sm hover:bg-slate-50 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  const [page, setPage] = useState(1);
  const [planFilter, setPlanFilter] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const { data: subData, isLoading: loadingSubs } = useQuery({
    queryKey: ['admin-subs', page, planFilter],
    queryFn: () => api.get('/admin/subscriptions', { params: { page, limit: 20, plan: planFilter || undefined } }).then(r => r.data.data ?? r.data),
    placeholderData: (prev) => prev,
  });

  const { data: coupons = [], isLoading: loadingCoupons } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => api.get('/admin/coupons').then(r => r.data.data ?? r.data),
  });

  const subs: Sub[] = subData?.subscriptions || [];
  const totalPages = subData?.totalPages || 1;
  const total = subData?.total || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm">
          <Tag className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Subscriptions</h1>
          <p className="text-slate-500 text-sm">{total} total subscriptions</p>
        </div>
      </div>

      {/* Plan filter */}
      <div className="flex gap-2 flex-wrap">
        {['', 'FREE', 'PRO', 'PREMIUM', 'TEAM'].map(plan => (
          <button key={plan} onClick={() => { setPlanFilter(plan); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              planFilter === plan ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
            }`}>
            {plan || 'All Plans'}
          </button>
        ))}
      </div>

      {/* Subscriptions table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              {['User', 'Plan', 'Status', 'Level', 'Discount', 'Renews', 'Since'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loadingSubs ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">Loading…</td></tr>
            ) : subs.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-slate-400 text-sm">No subscriptions found</td></tr>
            ) : subs.map((s, i) => (
              <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-semibold text-slate-800">{s.user.username}</div>
                  <div className="text-slate-400 text-xs">{s.user.email}</div>
                </td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PLAN_COLORS[s.plan]}`}>{s.plan}</span></td>
                <td className="px-4 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[s.status] || 'bg-slate-100 text-slate-600'}`}>{s.status}</span></td>
                <td className="px-4 py-3 text-slate-600 text-xs font-semibold">{s.user.finnishLevel}</td>
                <td className="px-4 py-3 text-slate-600">{s.discountPercent ? `${s.discountPercent}%` : '—'}</td>
                <td className="px-4 py-3 text-slate-400">{s.currentPeriodEnd ? new Date(s.currentPeriodEnd).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
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
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      )}

      {/* Coupons */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-black text-slate-800">Coupons</h2>
          <button onClick={() => setShowCreate(v => !v)}
            className="flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-xl transition-colors shadow-sm">
            <Plus className="w-4 h-4" /> New Coupon
          </button>
        </div>

        {showCreate && <div className="mb-4"><CreateCouponForm onClose={() => setShowCreate(false)} /></div>}

        {loadingCoupons ? (
          <div className="text-center text-slate-400 py-8 text-sm">Loading…</div>
        ) : (coupons as Coupon[]).length === 0 ? (
          <div className="text-center text-slate-400 py-8 text-sm">No coupons yet</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {(coupons as Coupon[]).map(c => <CouponCard key={c.id} coupon={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}
