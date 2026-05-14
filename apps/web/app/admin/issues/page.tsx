'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, CheckCircle2, Clock, X, ChevronDown, ImageIcon, User, Calendar, Monitor } from 'lucide-react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  open:       { label: 'Open',       color: 'text-amber-400 bg-amber-400/10 border-amber-400/20',   icon: Clock },
  in_progress:{ label: 'In Progress',color: 'text-blue-400 bg-blue-400/10 border-blue-400/20',     icon: AlertCircle },
  resolved:   { label: 'Resolved',   color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 },
  closed:     { label: 'Closed',     color: 'text-slate-400 bg-slate-400/10 border-slate-400/20',  icon: X },
};

interface IssueReport {
  id: string;
  description: string;
  imageData?: string;
  page?: string;
  status: string;
  createdAt: string;
  user: { username: string; email: string; finnishLevel: string };
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color}`}>
      <Icon className="w-3 h-3" /> {cfg.label}
    </span>
  );
}

function StatusDropdown({ id, current }: { id: string; current: string }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (status: string) => api.patch(`/admin/issues/${id}/status`, { status }).then(r => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-issues'] });
      toast.success('Status updated');
      setOpen(false);
    },
    onError: () => toast.error('Failed to update status'),
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg px-2.5 py-1.5 transition-all"
      >
        Change status <ChevronDown className="w-3 h-3" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute right-0 top-full mt-1 z-10 bg-slate-800 border border-white/10 rounded-xl shadow-xl overflow-hidden min-w-[140px]"
          >
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => mutate(key)}
                disabled={key === current}
                className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center gap-2 ${
                  key === current ? 'text-slate-600 cursor-default' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <cfg.icon className="w-3 h-3" /> {cfg.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function IssueCard({ issue, onClick }: { issue: IssueReport; onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-5 cursor-pointer hover:border-white/15 transition-all"
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <StatusBadge status={issue.status} />
            {issue.imageData && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 border border-white/5 rounded-full px-2 py-0.5">
                <ImageIcon className="w-3 h-3" /> screenshot
              </span>
            )}
          </div>
          <p className="text-white text-sm leading-relaxed line-clamp-2 mb-3">{issue.description}</p>
          <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {issue.user.username} ({issue.user.finnishLevel})</span>
            {issue.page && <span className="flex items-center gap-1"><Monitor className="w-3 h-3" /> {issue.page}</span>}
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(issue.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <StatusDropdown id={issue.id} current={issue.status} />
      </div>
    </motion.div>
  );
}

function IssueModal({ issue, onClose }: { issue: IssueReport; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-slate-900 border border-white/10 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <StatusBadge status={issue.status} />
            <span className="text-slate-500 text-xs">{new Date(issue.createdAt).toLocaleString()}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <div className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">Reporter</div>
            <div className="text-white text-sm">{issue.user.username}</div>
            <div className="text-slate-400 text-xs">{issue.user.email} · Level {issue.user.finnishLevel}</div>
          </div>

          {issue.page && (
            <div>
              <div className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">Page</div>
              <div className="text-slate-300 text-sm font-mono">{issue.page}</div>
            </div>
          )}

          <div>
            <div className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">Description</div>
            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{issue.description}</p>
          </div>

          {issue.imageData && (
            <div>
              <div className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">Screenshot</div>
              <img src={issue.imageData} alt="screenshot" className="w-full rounded-xl border border-white/10" />
            </div>
          )}

          <div className="pt-2 border-t border-white/10">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-wide">Update Status</div>
            <StatusDropdown id={issue.id} current={issue.status} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AdminIssuesPage() {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selected, setSelected] = useState<IssueReport | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-issues', filterStatus],
    queryFn: () => api.get(`/admin/issues${filterStatus !== 'all' ? `?status=${filterStatus}` : ''}`).then(r => r.data.data ?? r.data),
  });

  const issues: IssueReport[] = data || [];
  const openCount = issues.filter(i => i.status === 'open').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-glow">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Issue Reports</h1>
          <p className="text-slate-400 text-sm">{openCount} open report{openCount !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All' },
          { key: 'open', label: 'Open' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'resolved', label: 'Resolved' },
          { key: 'closed', label: 'Closed' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterStatus(tab.key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
              filterStatus === tab.key
                ? 'bg-finn-600/30 text-white border-finn-500/40'
                : 'text-slate-400 border-white/5 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Issue list */}
      {isLoading ? (
        <div className="text-center text-slate-500 py-12 text-sm">Loading…</div>
      ) : issues.length === 0 ? (
        <div className="text-center text-slate-500 py-16">
          <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No reports found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} onClick={() => setSelected(issue)} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {selected && <IssueModal issue={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
