'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  LayoutDashboard, BookOpen, Headphones, Mic, PenTool,
  Brain, GraduationCap, Trophy, MessageCircle, Medal,
  Settings, LogOut, ChevronLeft, ChevronRight, Flame, Zap,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const NAV_ITEMS = [
  { href: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard',  color: 'from-blue-500 to-indigo-600' },
  { href: '/reading',    icon: BookOpen,         label: 'Reading',    color: 'from-cyan-500 to-blue-500' },
  { href: '/writing',    icon: PenTool,          label: 'Writing',    color: 'from-blue-500 to-indigo-600' },
  { href: '/listening',  icon: Headphones,       label: 'Listening',  color: 'from-purple-500 to-violet-600' },
  { href: '/speaking',   icon: Mic,              label: 'Speaking',   color: 'from-emerald-400 to-teal-500' },
  { href: '/vocabulary', icon: Brain,            label: 'Vocabulary', color: 'from-yellow-400 to-orange-500' },
  { href: '/grammar',    icon: GraduationCap,    label: 'Grammar',    color: 'from-pink-500 to-rose-600' },
  { href: '/yki-prep',   icon: Trophy,           label: 'YKI Prep',   color: 'from-blue-600 to-indigo-700' },
  { href: '/ai-tutor',   icon: MessageCircle,    label: 'AI Tutor',   color: 'from-violet-500 to-blue-600' },
  { href: '/leaderboard', icon: Medal,           label: 'Leaderboard', color: 'from-amber-400 to-orange-500' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="relative z-20 h-screen bg-white border-r border-slate-100 flex flex-col flex-shrink-0 shadow-sm"
    >
      {/* Logo */}
      <div className="p-4 flex items-center gap-3 border-b border-slate-100">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm flex-shrink-0">
            F
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-black text-lg gradient-text overflow-hidden whitespace-nowrap"
              >
                FinnMate
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all flex-shrink-0"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </motion.button>
      </div>

      {/* Streak pill */}
      {!collapsed && (
        <div className="p-3 mx-2 mt-3 rounded-xl bg-orange-50 border border-orange-100">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500 streak-flame" />
            <span className="text-orange-600 text-xs font-bold">{user?.currentStreak || 0} day streak</span>
            <Zap className="w-3.5 h-3.5 text-amber-500 ml-auto" />
            <span className="text-amber-600 text-xs font-bold">{user?.totalXP?.toLocaleString() || 0}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 mt-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative ${
                  active
                    ? 'bg-blue-50 border border-blue-100'
                    : 'hover:bg-slate-50 border border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 ${
                  active ? '' : 'opacity-70 group-hover:opacity-100'
                } transition-all`}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className={`text-sm font-medium overflow-hidden whitespace-nowrap ${
                        active ? 'text-blue-700' : 'text-slate-600 group-hover:text-slate-800'
                      } transition-colors`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-blue-500" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Profile + Logout */}
      <div className="p-2 border-t border-slate-100 space-y-0.5">
        <Link href="/profile">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {user?.avatar ? (
                <Image src={user.avatar} alt="" fill className="object-cover" />
              ) : (
                <span className="text-white font-bold text-sm">{user?.firstName?.[0] || 'U'}</span>
              )}
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="overflow-hidden">
                  <div className="text-slate-800 text-xs font-semibold whitespace-nowrap">{user?.firstName} {user?.lastName}</div>
                  <div className="text-slate-400 text-xs whitespace-nowrap">{user?.finnishLevel || 'A1'} level</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Link>

        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0">
            <LogOut className="w-4 h-4" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="text-sm font-medium whitespace-nowrap overflow-hidden">
                Sign out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  );
}
