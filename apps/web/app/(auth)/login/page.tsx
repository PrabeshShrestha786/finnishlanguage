'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, BookOpen, Headphones, Mic, PenTool, Star, Zap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const FEATURES = [
  { icon: BookOpen, label: 'AI Reading', desc: 'Stories at your CEFR level' },
  { icon: Headphones, label: 'Listening', desc: 'Native Finnish audio' },
  { icon: Mic, label: 'Speaking', desc: 'Pronunciation coaching' },
  { icon: PenTool, label: 'Writing', desc: 'AI grammar feedback' },
];

const WORDS = ['Hyvää huomenta', 'Kiitos paljon', 'Anteeksi', 'Tervetuloa', 'Nähdään pian'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Tervetuloa takaisin! 🇫🇮');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0d1526] via-[#131f35] to-[#0a1020] relative overflow-hidden flex-col justify-between p-12">

        {/* Background glow effects */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl" />

        {/* Top — Logo */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
              F
            </div>
            <span className="font-black text-xl text-white">FinnMate</span>
          </Link>
        </motion.div>

        {/* Center — Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
          {/* Finnish flag stripe */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🇫🇮</span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
          </div>

          <h1 className="text-4xl font-black text-white leading-tight mb-4">
            Master Finnish.<br />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              One step at a time.
            </span>
          </h1>
          <p className="text-slate-400 text-base leading-relaxed mb-10 max-w-sm">
            Your AI-powered Finnish tutor. Learn at your own pace with personalised stories, listening exercises, and real-time pronunciation feedback.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-3 mb-10">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-xl p-3.5 flex items-center gap-3 hover:bg-white/8 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/30 to-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-blue-300" />
                </div>
                <div>
                  <p className="text-white text-xs font-bold">{label}</p>
                  <p className="text-slate-500 text-xs">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Floating Finnish words */}
          <div className="flex flex-wrap gap-2">
            {WORDS.map((word, i) => (
              <motion.span key={word}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-xs bg-white/5 border border-white/10 text-slate-400 px-3 py-1.5 rounded-full font-mono">
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Bottom — Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="flex items-center gap-6 relative z-10">
          {[
            { icon: Star, value: 'A1–B2', label: 'CEFR Levels' },
            { icon: Zap, value: '500+', label: 'XP Activities' },
            { icon: BookOpen, value: '17+', label: 'Stories' },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5">
                <Icon className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-white font-black text-sm">{value}</span>
              </div>
              <p className="text-slate-500 text-xs">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">F</div>
              <span className="font-black text-xl text-slate-800">FinnMate</span>
            </Link>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h2 className="text-2xl font-black text-slate-800 mb-1">Welcome back</h2>
            <p className="text-slate-500 text-sm mb-7">Continue your Finnish journey</p>

            {/* Google */}
            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2.5 py-3 mb-5 border border-slate-200 bg-white rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <Chrome className="w-4 h-4 text-blue-500" />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs font-medium">or with email</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" required
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all" />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 accent-blue-600" />
                  <span className="text-slate-500 text-sm">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-blue-600 text-sm hover:text-blue-700 transition-colors font-medium">
                  Forgot password?
                </Link>
              </div>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full py-3 flex items-center justify-center gap-2 mt-2 text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/25 transition-all disabled:opacity-60">
                {loading
                  ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
              </motion.button>
            </form>

            <p className="text-center text-slate-500 text-sm mt-6">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                Sign up free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
