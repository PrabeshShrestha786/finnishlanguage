'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  User, Mail, Globe, GraduationCap, Camera, Save, Flame,
  Zap, Trophy, BookOpen, CheckCircle2, Bell, Shield, LogOut, Pencil, X,
} from 'lucide-react';
import Image from 'next/image';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const LANGUAGES = [
  { code: 'ENGLISH', label: 'English', flag: '🇬🇧' },
  { code: 'FINNISH', label: 'Finnish', flag: '🇫🇮' },
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

const TABS = ['Profile', 'Stats', 'Settings'] as const;
type Tab = typeof TABS[number];

const BIO_MAX = 160;

const getAchievements = (streak: number, xp: number, words: number, chatMessages: number) => [
  { id: 1, title: 'First Step',        desc: 'Earn your first XP',            icon: '🎯', earned: xp > 0 },
  { id: 2, title: 'Week Warrior',      desc: '7-day streak',                  icon: '🔥', earned: streak >= 7 },
  { id: 3, title: 'Vocabulary Master', desc: 'Learn 100 words',               icon: '📚', earned: words >= 100 },
  { id: 4, title: 'Grammar Guru',      desc: 'Complete all grammar modules',  icon: '📐', earned: false },
  { id: 5, title: 'Chatterbox',        desc: 'Send 50 messages to AI tutor',  icon: '💬', earned: chatMessages >= 50 },
  { id: 6, title: 'YKI Ready',         desc: 'Pass a mock YKI exam',          icon: '🎓', earned: false },
];

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState<Tab>('Profile');
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [notificationsOn, setNotificationsOn] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rank, setRank] = useState<number | null>(null);
  const [wordsStudied, setWordsStudied] = useState(0);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [chatMessages, setChatMessages] = useState(0);

  useEffect(() => {
    api.get('/leaderboard/my-rank')
      .then((r) => setRank(r.data.data?.allTimeRank ?? null))
      .catch(() => {});
    api.get('/users/dashboard')
      .then((r) => {
        const d = r.data.data;
        setWordsStudied(d.wordsStudied || 0);
        setLessonsCompleted(d.lessonsCompleted || 0);
      })
      .catch(() => {});
    api.get('/users/profile')
      .then((r) => setChatMessages(r.data.data?._count?.chatMessages || 0))
      .catch(() => {});
  }, []);
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    username: user?.username || '',
    bio: user?.bio || '',
    nativeLanguage: user?.nativeLanguage || 'ENGLISH',
    finnishLevel: user?.finnishLevel || 'A1',
  });

  // Re-sync form when user data changes (e.g. after save updates the store)
  useEffect(() => {
    if (dirty) return;
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      bio: user?.bio || '',
      nativeLanguage: user?.nativeLanguage || 'ENGLISH',
      finnishLevel: user?.finnishLevel || 'A1',
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const updateForm = (patch: Partial<typeof form>) => {
    setForm((f) => ({ ...f, ...patch }));
    setDirty(true);
  };

  const switchTab = (tab: Tab) => {
    if (editMode && dirty && !confirm('You have unsaved changes. Leave without saving?')) return;
    setEditMode(false);
    setDirty(false);
    setActiveTab(tab);
  };

  const cancelEdit = () => {
    setForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      username: user?.username || '',
      bio: user?.bio || '',
      nativeLanguage: user?.nativeLanguage || 'ENGLISH',
      finnishLevel: user?.finnishLevel || 'A1',
    });
    setDirty(false);
    setEditMode(false);
  };

  const saveProfile = async () => {
    setLoading(true);
    try {
      const { bio: _bio, ...payload } = form;
      const res = await api.patch('/users/profile', payload);
      updateUser(res.data.data);
      setDirty(false);
      setEditMode(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
    setAvatarLoading(true);
    try {
      // Resize to max 256×256 and compress to JPEG 0.85 before encoding
      const base64 = await new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => {
          const MAX = 256;
          const scale = Math.min(MAX / img.width, MAX / img.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width  = Math.round(img.width  * scale);
          canvas.height = Math.round(img.height * scale);
          canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
      });
      const res = await api.patch('/users/profile', { avatar: base64 });
      updateUser(res.data.data);
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to update avatar');
    } finally {
      setAvatarLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const nativeLang = LANGUAGES.find((l) => l.code === (user?.nativeLanguage || 'ENGLISH'));
  const achievements = getAchievements(user?.currentStreak || 0, user?.totalXP || 0, wordsStudied, chatMessages);

  return (
    <div className="space-y-4">
      {/* Profile Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Aurora Borealis banner — Finland's Northern Lights */}
        <div
          className="h-24 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0c1445 0%, #0f2356 35%, #0d3b2e 65%, #1a0e40 100%)' }}
        >
          {/* Aurora green sweep */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(170deg, transparent 15%, rgba(52,211,153,0.28) 42%, rgba(6,182,212,0.22) 58%, transparent 78%)' }} />
          {/* Aurora violet sweep */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(210deg, transparent 25%, rgba(139,92,246,0.18) 52%, transparent 72%)' }} />
          {/* Horizon glow */}
          <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: 'linear-gradient(to top, rgba(52,211,153,0.12), transparent)' }} />

          {/* Floating Finnish words — watermark style */}
          <div className="absolute top-3 left-5 text-white/20 font-black text-4xl select-none" style={{ transform: 'rotate(-6deg)', letterSpacing: '-1px' }}>Hei!</div>
          <div className="absolute top-7 right-10 text-emerald-300/25 font-black text-2xl select-none" style={{ transform: 'rotate(4deg)' }}>Moi!</div>
          <div className="absolute bottom-3 left-[30%] text-cyan-200/15 font-black text-3xl select-none tracking-wide">Suomi</div>
          <div className="absolute top-1 left-[52%] text-white/10 font-black text-xl select-none" style={{ transform: 'rotate(2deg)' }}>Kiitos</div>
          <div className="absolute bottom-4 right-4 text-indigo-300/15 font-black text-5xl select-none tracking-widest">FIN</div>
          <div className="absolute top-8 left-[22%] text-white/10 text-sm font-bold select-none" style={{ transform: 'rotate(-3deg)' }}>Päivää!</div>
          <div className="absolute bottom-6 left-6 text-teal-200/10 font-black text-lg select-none">Terve</div>

          {/* Stars */}
          <div className="absolute top-2 right-[28%] w-1 h-1 rounded-full bg-white/80" />
          <div className="absolute top-5 right-[18%] w-0.5 h-0.5 rounded-full bg-white/60" />
          <div className="absolute top-1 left-[60%] w-1 h-1 rounded-full bg-cyan-100/70" />
          <div className="absolute top-9 left-[72%] w-0.5 h-0.5 rounded-full bg-white/50" />
          <div className="absolute top-3 left-[42%] w-1 h-1 rounded-full bg-emerald-100/60" />
          <div className="absolute top-6 right-[42%] w-0.5 h-0.5 rounded-full bg-white/40" />
          <div className="absolute bottom-9 right-[22%] w-1 h-1 rounded-full bg-white/50" />
        </div>
        <div className="px-5 pb-3 flex items-end gap-4">
          {/* Avatar overlapping the banner */}
          <div className="-mt-8 flex-shrink-0 relative w-fit">
            <div className="relative w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-black text-xl overflow-hidden">
              {user?.avatar ? (
                <Image src={user.avatar} alt="" width={64} height={64} className="object-cover w-full h-full" />
              ) : (
                user?.firstName?.[0] || 'U'
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {avatarLoading
                ? <div className="w-2.5 h-2.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <Camera className="w-3 h-3 text-white" />}
            </button>
          </div>

          {/* Name + meta */}
          <div className="flex-1 pb-1 min-w-0">
            <h2 className="text-slate-800 font-black text-lg leading-tight truncate">{user?.firstName} {user?.lastName}</h2>
            <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-0.5 flex-wrap">
              <span>@{user?.username || 'learner'}</span>
              <span>·</span>
              <span className="text-blue-600 font-semibold">{user?.finnishLevel || 'A1'} Level</span>
              {nativeLang && <span>{nativeLang.flag}</span>}
            </div>
          </div>

          {/* Compact stats row */}
          <div className="flex items-center gap-4 pb-1 flex-shrink-0">
            {[
              { icon: Flame, label: 'Streak', value: user?.currentStreak || 0, color: 'text-orange-500' },
              { icon: Zap, label: 'XP', value: (user?.totalXP || 0).toLocaleString(), color: 'text-amber-500' },
              { icon: Trophy, label: 'Rank', value: rank ? `#${rank}` : '—', color: 'text-blue-500' },
            ].map(({ icon: Icon, label, value, color }, i) => (
              <div key={label} className="flex items-center gap-3">
                {i > 0 && <div className="w-px h-6 bg-slate-100" />}
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Icon className={`w-3.5 h-3.5 ${color}`} />
                    <span className="font-black text-slate-800 text-sm">{value}</span>
                  </div>
                  <div className="text-slate-400 text-xs">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map((t) => (
          <button key={t} onClick={() => switchTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === t ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* PROFILE TAB — view mode */}
        {activeTab === 'Profile' && !editMode && (
          <motion.div key="profile-view" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black text-slate-800 text-sm">Profile Info</h3>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 active:scale-95 transition-all"
              >
                <Pencil className="w-3 h-3" /> Edit Profile
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
              {[
                { label: 'First Name', value: user?.firstName || '—' },
                { label: 'Last Name', value: user?.lastName || '—' },
                { label: 'Username', value: `@${user?.username || 'learner'}` },
                { label: 'Email', value: user?.email || '—' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-xs font-semibold text-slate-400 mb-0.5">{label}</div>
                  <div className="text-slate-800 font-medium text-sm truncate">{value}</div>
                </div>
              ))}
              <div className="col-span-2">
                <div className="text-xs font-semibold text-slate-400 mb-0.5">Bio</div>
                <div className="text-slate-600 text-sm">{user?.bio || <span className="text-slate-300 italic">No bio yet.</span>}</div>
              </div>
            </div>

            <div className="flex items-center gap-6 mt-3 pt-3 border-t border-slate-50">
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">Finnish Level</div>
                <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-xs font-bold">{user?.finnishLevel || 'A1'}</span>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-400 mb-1">Native Language</div>
                <span className="text-slate-800 font-medium text-sm">{nativeLang?.flag} {nativeLang?.label}</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* PROFILE TAB — edit mode */}
        {activeTab === 'Profile' && editMode && (
          <motion.div key="profile-edit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-sm">Edit Profile</h3>
              <button onClick={cancelEdit} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>

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
                      onChange={(e) => updateForm({ [key]: e.target.value })}
                      placeholder={placeholder}
                      className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">@</span>
                <input
                  value={form.username}
                  onChange={(e) => updateForm({ username: e.target.value.toLowerCase().replace(/\s/g, '') })}
                  placeholder="your_username"
                  className="w-full border border-slate-200 rounded-xl pl-7 pr-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={user?.email || ''} disabled
                  className="w-full border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-400 bg-slate-50 cursor-not-allowed" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-600">Bio</label>
                <span className={`text-xs ${form.bio.length > BIO_MAX ? 'text-red-500 font-semibold' : 'text-slate-400'}`}>
                  {form.bio.length}/{BIO_MAX}
                </span>
              </div>
              <textarea
                value={form.bio}
                onChange={(e) => updateForm({ bio: e.target.value.slice(0, BIO_MAX) })}
                placeholder="Tell us a bit about yourself..."
                rows={2}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Finnish Level</label>
              <div className="flex flex-wrap gap-2">
                {LEVELS.map((lvl) => (
                  <button key={lvl} onClick={() => updateForm({ finnishLevel: lvl })}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all border ${form.finnishLevel === lvl ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Native Language</label>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5">
                {LANGUAGES.map((lang) => (
                  <button key={lang.code} onClick={() => updateForm({ nativeLanguage: lang.code })}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium transition-all ${form.nativeLanguage === lang.code ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                    <span>{lang.flag}</span>{lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={cancelEdit}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                onClick={saveProfile}
                disabled={loading}
                className="flex-2 btn-primary px-8 py-2.5 flex items-center justify-center gap-2 text-sm"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* STATS TAB */}
        {activeTab === 'Stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total XP', value: (user?.totalXP || 0).toLocaleString(), icon: Zap, color: 'from-amber-400 to-orange-500' },
                { label: 'Day Streak', value: user?.currentStreak || 0, icon: Flame, color: 'from-orange-400 to-red-500' },
                { label: 'Words Learned', value: wordsStudied, icon: BookOpen, color: 'from-emerald-400 to-teal-500' },
                { label: 'Lessons Done', value: lessonsCompleted, icon: CheckCircle2, color: 'from-blue-500 to-indigo-600' },
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
                {achievements.map((ach, i) => (
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
            {/* Notifications — real toggle */}
            <div className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => setNotificationsOn((v) => !v)}>
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <div className="text-slate-800 font-semibold text-sm">Notifications</div>
                <div className="text-slate-400 text-xs">Daily reminders and streak alerts</div>
              </div>
              <div
                className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors ${notificationsOn ? 'bg-blue-600' : 'bg-slate-300'}`}
                onClick={(e) => { e.stopPropagation(); setNotificationsOn((v) => !v); }}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${notificationsOn ? 'right-1' : 'left-1'}`} />
              </div>
            </div>

            {/* Coming-soon settings */}
            {[
              { icon: Globe, label: 'Interface Language', desc: 'English (more coming soon)' },
              { icon: Shield, label: 'Privacy', desc: 'Manage your data and privacy' },
              { icon: GraduationCap, label: 'Learning Preferences', desc: 'Daily goal: 15 minutes' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label}
                onClick={() => toast('Coming soon!', { icon: '🚧' })}
                className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-slate-600" />
                </div>
                <div className="flex-1">
                  <div className="text-slate-800 font-semibold text-sm">{label}</div>
                  <div className="text-slate-400 text-xs">{desc}</div>
                </div>
                <span className="text-slate-300">›</span>
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
