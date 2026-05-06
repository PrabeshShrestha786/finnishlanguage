'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  User, Mail, Globe, GraduationCap, Camera, Save, Flame,
  Zap, Trophy, BookOpen, CheckCircle2, Settings, Bell, Shield, LogOut,
} from 'lucide-react';
import Image from 'next/image';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LANGUAGES = [
  { code: 'ENGLISH', label: 'English', flag: '🇬🇧' },
  { code: 'NEPALI', label: 'Nepali', flag: '🇳🇵' },
  { code: 'HINDI', label: 'Hindi', flag: '🇮🇳' },
  { code: 'ARABIC', label: 'Arabic', flag: '🇸🇦' },
  { code: 'SPANISH', label: 'Spanish', flag: '🇪🇸' },
  { code: 'FRENCH', label: 'French', flag: '🇫🇷' },
  { code: 'GERMAN', label: 'German', flag: '🇩🇪' },
  { code: 'RUSSIAN', label: 'Russian', flag: '🇷🇺' },
  { code: 'CHINESE', label: 'Chinese', flag: '🇨🇳' },
];

const TABS = ['Profile', 'Stats', 'Settings'] as const;
type Tab = typeof TABS[number];

const ACHIEVEMENTS = [
  { id: 1, title: 'First Step', desc: 'Complete your first lesson', icon: '🎯', earned: true },
  { id: 2, title: 'Week Warrior', desc: '7-day streak', icon: '🔥', earned: true },
  { id: 3, title: 'Vocabulary Master', desc: 'Learn 100 words', icon: '📚', earned: false },
  { id: 4, title: 'Grammar Guru', desc: 'Complete all grammar modules', icon: '📐', earned: false },
  { id: 5, title: 'Chatterbox', desc: 'Send 50 messages to AI tutor', icon: '💬', earned: false },
  { id: 6, title: 'YKI Ready', desc: 'Pass a mock YKI exam', icon: '🎓', earned: false },
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: (user as any)?.bio || '',
    nativeLanguage: user?.nativeLanguage || 'ENGLISH',
    finnishLevel: user?.finnishLevel || 'A1',
  });

  const saveProfile = async () => {
    setLoading(true);
    try {
      const res = await api.patch('/users/profile', form);
      updateUser(res.data.data);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const nativeLang = LANGUAGES.find((l) => l.code === (user?.nativeLanguage || 'ENGLISH'));

  return (
    <div className="space-y-6">
      {/* Profile Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/50 to-violet-600/50" />
        </div>
        <div className="px-6 pb-6">
          {/* Avatar — overlaps the banner */}
          <div className="-mt-10 mb-3">
            <div className="relative w-fit">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-2xl overflow-hidden">
                {user?.avatar ? (
                  <Image src={user.avatar} alt="" fill className="object-cover" />
                ) : (
                  user?.firstName?.[0] || 'U'
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
          </div>
          {/* Name — always below the banner */}
          <div className="mb-4">
            <h2 className="text-slate-800 font-black text-xl">{user?.firstName} {user?.lastName}</h2>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <span>@{user?.username || 'learner'}</span>
              <span>·</span>
              <span className="text-blue-600 font-semibold">{user?.finnishLevel || 'A1'} Level</span>
              {nativeLang && <span>{nativeLang.flag}</span>}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Flame, label: 'Day Streak', value: user?.currentStreak || 0, color: 'text-orange-500', bg: 'bg-orange-50' },
              { icon: Zap, label: 'Total XP', value: (user?.totalXP || 0).toLocaleString(), color: 'text-amber-500', bg: 'bg-amber-50' },
              { icon: Trophy, label: 'Rank', value: '#3', color: 'text-blue-500', bg: 'bg-blue-50' },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-3 text-center`}>
                <Icon className={`w-5 h-5 ${color} mx-auto mb-1`} />
                <div className="text-slate-800 font-black text-lg">{value}</div>
                <div className="text-slate-400 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* PROFILE TAB */}
        {activeTab === 'Profile' && (
          <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
            <h3 className="font-black text-slate-800">Edit Profile</h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'firstName', label: 'First Name', icon: User, placeholder: 'Your first name' },
                { key: 'lastName', label: 'Last Name', icon: User, placeholder: 'Your last name' },
              ].map(({ key, label, icon: Icon, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      value={(form as any)[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={user?.email || ''} disabled
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-slate-400 bg-slate-50 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bio</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Tell us a bit about yourself..."
                rows={3}
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Finnish Level</label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lvl) => (
                  <button key={lvl} onClick={() => setForm({ ...form, finnishLevel: lvl })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${form.finnishLevel === lvl ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Native Language</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} onClick={() => setForm({ ...form, nativeLanguage: lang.code })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${form.nativeLanguage === lang.code ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    <span>{lang.flag}</span>{lang.label}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={saveProfile}
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
            </motion.button>
          </motion.div>
        )}

        {/* STATS TAB */}
        {activeTab === 'Stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total XP', value: (user?.totalXP || 0).toLocaleString(), icon: Zap, color: 'from-amber-400 to-orange-500' },
                { label: 'Day Streak', value: user?.currentStreak || 0, icon: Flame, color: 'from-orange-400 to-red-500' },
                { label: 'Words Learned', value: '124', icon: BookOpen, color: 'from-emerald-400 to-teal-500' },
                { label: 'Lessons Done', value: '23', icon: CheckCircle2, color: 'from-blue-500 to-indigo-600' },
              ].map(({ label, value, icon: Icon, color }, i) => (
                <motion.div key={label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 text-center">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-2xl font-black text-slate-800 mb-0.5">{value}</div>
                  <div className="text-slate-400 text-sm">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Achievements
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ACHIEVEMENTS.map((ach, i) => (
                  <motion.div key={ach.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
                    className={`rounded-xl p-4 border text-center transition-all ${ach.earned ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-60'}`}>
                    <div className="text-3xl mb-2">{ach.icon}</div>
                    <div className={`font-bold text-sm ${ach.earned ? 'text-amber-700' : 'text-slate-500'}`}>{ach.title}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{ach.desc}</div>
                    {ach.earned && <div className="mt-2 text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" />Earned</div>}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'Settings' && (
          <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            {[
              { icon: Bell, label: 'Notifications', desc: 'Daily reminders and streak alerts', toggle: true },
              { icon: Globe, label: 'Interface Language', desc: 'English (more coming soon)', toggle: false },
              { icon: Shield, label: 'Privacy', desc: 'Manage your data and privacy', toggle: false },
              { icon: GraduationCap, label: 'Learning Preferences', desc: 'Daily goal: 15 minutes', toggle: false },
            ].map(({ icon: Icon, label, desc, toggle }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-800 font-semibold text-sm">{label}</div>
                  <div className="text-slate-400 text-xs">{desc}</div>
                </div>
                {toggle ? (
                  <div className="w-10 h-6 bg-blue-600 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                  </div>
                ) : (
                  <span className="text-slate-300">›</span>
                )}
              </div>
            ))}

            <div className="px-6 py-4">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 text-red-500 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 group-hover:bg-red-100 flex items-center justify-center flex-shrink-0 transition-colors">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm">Sign Out</div>
                  <div className="text-xs text-red-400">Log out of your account</div>
                </div>
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
