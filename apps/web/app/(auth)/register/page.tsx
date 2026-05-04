'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Check, Chrome, User, Mail, Lock, Globe, GraduationCap } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const LEVELS = [
  { id: 'A1', label: 'Complete Beginner', desc: 'Never studied Finnish', emoji: '🌱' },
  { id: 'A2', label: 'Elementary', desc: 'Know basic greetings', emoji: '🌿' },
  { id: 'B1', label: 'Intermediate', desc: 'Can hold simple conversations', emoji: '🌳' },
  { id: 'B2', label: 'Upper-Intermediate', desc: 'Discuss most topics', emoji: '⚡' },
  { id: 'C1', label: 'Advanced', desc: 'Near fluent', emoji: '🔥' },
];

const LANGUAGES = [
  { code: 'ENGLISH', label: 'English', flag: '🇬🇧' },
  { code: 'NEPALI', label: 'Nepali', flag: '🇳🇵' },
  { code: 'HINDI', label: 'Hindi', flag: '🇮🇳' },
  { code: 'ARABIC', label: 'Arabic', flag: '🇸🇦' },
  { code: 'URDU', label: 'Urdu', flag: '🇵🇰' },
  { code: 'SPANISH', label: 'Spanish', flag: '🇪🇸' },
  { code: 'FRENCH', label: 'French', flag: '🇫🇷' },
  { code: 'GERMAN', label: 'German', flag: '🇩🇪' },
  { code: 'RUSSIAN', label: 'Russian', flag: '🇷🇺' },
  { code: 'CHINESE', label: 'Chinese', flag: '🇨🇳' },
];

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', username: '', password: '',
    nativeLanguage: 'ENGLISH', finnishLevel: 'A1',
  });
  const { register } = useAuthStore();
  const router = useRouter();

  const next = () => setStep((s) => Math.min(3, s + 1) as Step);
  const prev = () => setStep((s) => Math.max(1, s - 1) as Step);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await register(form);
      toast.success('Tervetuloa FinnMateen! 🇫🇮 Welcome!');
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, label: 'Account' },
    { num: 2, label: 'Background' },
    { num: 3, label: 'Your Level' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      {/* Decorative blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-100 rounded-full opacity-60 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
              F
            </div>
            <span className="font-black text-xl gradient-text">FinnMate</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm">Join 50,000+ Finnish learners worldwide</p>
        </motion.div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                step > s.num
                  ? 'bg-emerald-100 text-emerald-700'
                  : step === s.num
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {step > s.num ? <Check className="w-3 h-3" /> : <span>{s.num}</span>}
                <span>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 h-px transition-colors duration-300 ${step > s.num ? 'bg-emerald-300' : 'bg-slate-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Account ── */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <button
                  onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
                  className="w-full btn-secondary flex items-center justify-center gap-2.5 py-3 mb-5"
                >
                  <Chrome className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-sm">Continue with Google</span>
                </button>

                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-slate-400 text-xs font-medium">or with email</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  {[
                    { key: 'firstName', label: 'First Name', placeholder: 'Matti', icon: User },
                    { key: 'lastName', label: 'Last Name', placeholder: 'Virtanen', icon: User },
                  ].map(({ key, label, placeholder, icon: Icon }) => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                      <div className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder={placeholder}
                          value={(form as any)[key]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {[
                  { key: 'username', label: 'Username', placeholder: 'matti_fi', icon: User, type: 'text' },
                  { key: 'email', label: 'Email address', placeholder: 'matti@example.com', icon: Mail, type: 'email' },
                  { key: 'password', label: 'Password', placeholder: 'Min 8 characters', icon: Lock, type: 'password' },
                ].map(({ key, label, placeholder, icon: Icon, type }) => (
                  <div key={key} className="mb-3">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type={type}
                        placeholder={placeholder}
                        value={(form as any)[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        className="w-full border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                      />
                    </div>
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={next}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2 text-sm"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {/* ── STEP 2: Native Language ── */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-5 h-5 text-blue-500" />
                  <h2 className="text-base font-bold text-slate-800">What&apos;s your native language?</h2>
                </div>
                <p className="text-slate-500 text-sm mb-5">FinnMate will explain Finnish in your language</p>

                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {LANGUAGES.map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={() => setForm({ ...form, nativeLanguage: lang.code })}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all text-sm ${
                        form.nativeLanguage === lang.code
                          ? 'border-blue-400 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium flex-1">{lang.label}</span>
                      {form.nativeLanguage === lang.code && <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={prev} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={next}
                    className="btn-primary flex-1 py-2.5 flex items-center justify-center gap-2 text-sm"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Level ── */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-5 h-5 text-emerald-500" />
                  <h2 className="text-base font-bold text-slate-800">What&apos;s your Finnish level?</h2>
                </div>
                <p className="text-slate-500 text-sm mb-5">We&apos;ll personalize your learning path accordingly</p>

                <div className="space-y-2">
                  {LEVELS.map((level) => (
                    <motion.button
                      key={level.id}
                      whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => setForm({ ...form, finnishLevel: level.id })}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        form.finnishLevel === level.id
                          ? 'border-emerald-400 bg-emerald-50'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{level.emoji}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-sm ${form.finnishLevel === level.id ? 'text-emerald-600' : 'text-slate-700'}`}>{level.id}</span>
                          <span className="text-slate-700 font-medium text-sm">{level.label}</span>
                        </div>
                        <span className="text-slate-400 text-xs">{level.desc}</span>
                      </div>
                      {form.finnishLevel === level.id && <Check className="w-4 h-4 text-emerald-500 shrink-0" />}
                    </motion.button>
                  ))}
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={prev} className="btn-secondary flex items-center gap-2 px-4 py-2.5 text-sm">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="btn-aurora flex-1 py-2.5 flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    {loading
                      ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      : <><span>Start Learning!</span> 🇫🇮</>
                    }
                  </motion.button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </motion.div>

        <p className="text-center text-slate-400 text-xs mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          {' · '}
          <Link href="#" className="hover:underline">Terms</Link>
          {' · '}
          <Link href="#" className="hover:underline">Privacy</Link>
        </p>
      </div>
    </div>
  );
}
