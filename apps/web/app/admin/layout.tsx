'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import { LayoutDashboard, Users, BookOpen, TrendingUp, Tag, FileText, ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

const ADMIN_NAV = [
  { href: '/admin', icon: LayoutDashboard, label: 'Overview' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/lessons', icon: BookOpen, label: 'Lessons' },
  { href: '/admin/analytics', icon: TrendingUp, label: 'Analytics' },
  { href: '/admin/subscriptions', icon: Tag, label: 'Subscriptions' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized, initAuth } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { initAuth(); }, [initAuth]);

  useEffect(() => {
    if (initialized) {
      if (!user) router.push('/login');
      else if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) router.push('/dashboard');
    }
  }, [user, initialized, router]);

  if (!initialized || !user) return null;

  return (
    <div className="min-h-screen bg-nordic-dark flex">
      <aside className="w-60 glass border-r border-white/5 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-finn-500 to-aurora-purple flex items-center justify-center text-white font-black text-sm">F</div>
            <span className="text-white font-black">FinnMate</span>
          </div>
          <span className="text-xs text-aurora-yellow font-bold px-2 py-0.5 bg-aurora-yellow/10 rounded-full">Admin Panel</span>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                pathname === item.href ? 'bg-finn-600/25 text-white border border-finn-500/30' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <Link href="/dashboard" className="flex items-center gap-2 text-slate-500 hover:text-white text-sm px-3 py-2 rounded-xl hover:bg-white/5 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to App
          </Link>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
