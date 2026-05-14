'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, Clock, Star, ChevronRight, CheckCircle2, XCircle, RotateCcw, Trophy, Layers, Sparkles, Loader2, X, ChevronDown, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
  B2: 'bg-orange-100 text-orange-700',
};

const AI_COLORS = [
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
];

interface AnyStory {
  id: string | number;
  dbId?: string;
  title: string;
  titleEn: string;
  level: string;
  duration: string;
  xp: number;
  color: string;
  category: string;
  text: string;
  vocab: string[];
  questions: { q: string; options: string[]; correct: number }[];
}
type ViewState = 'list' | 'reading' | 'quiz' | 'result';

export default function ReadingClient() {
  const { user, updateUser, refreshUser } = useAuthStore();
const { data: baseStaticStories = [] } = useQuery<AnyStory[]>({
    queryKey: ['reading-stories'],
    queryFn: async () => {
      const res = await api.get('/content/stories');
      return res.data.data ?? res.data;
    },
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000,
  });
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<ViewState>('list');
  const [selectedStory, setSelectedStory] = useState<AnyStory | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<'All' | 'A1' | 'A2' | 'B1' | 'B2'>('All');
  const [showPassage, setShowPassage] = useState(false);
  const [completedStories, setCompletedStories] = useState<Record<string | number, { score: number; pct: number }>>({});
  const [wordBar, setWordBar] = useState<{
    word: string; x: number; y: number;
    translation: string | null;
    form: string | null;
    baseForm: string | null;
    grammaticalCase: string | null;
  } | null>(null);
  const [translating, setTranslating] = useState(false);

  // AI generation state
  const [aiStories, setAiStories] = useState<AnyStory[]>([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genLevel, setGenLevel] = useState<string>(user?.finnishLevel || 'A1');
  const [genTopic, setGenTopic] = useState('');

  useEffect(() => {
    if (!user?.id) return;
    try {
      const saved = localStorage.getItem(`finnmate-reading-history-${user.id}`);
      if (saved) setCompletedStories(JSON.parse(saved));
      else setCompletedStories({});
    } catch {}
  }, [user?.id]);

  useEffect(() => {
    api.get('/ai/stories')
      .then((res) => {
        const stories: AnyStory[] = (res.data?.data || []).map((s: any) => ({
          id: s.id,
          dbId: s.id,
          title: s.title,
          titleEn: s.titleEn,
          level: s.level,
          duration: '~5 min',
          xp: s.xp,
          color: s.color,
          category: s.category,
          text: s.text,
          vocab: s.vocab as string[],
          questions: s.questions as { q: string; options: string[]; correct: number }[],
        }));
        setAiStories(stories);
      })
      .catch(() => {})
      .finally(() => setAiLoading(false));
  }, []);

  useEffect(() => { setMounted(true); }, []);

  // Dismiss on click-outside or scroll — only attached while bar is open.
  // Click listener is delayed one tick so the opening click doesn't immediately close it.
  useEffect(() => {
    if (!wordBar) return;
    let id: ReturnType<typeof setTimeout>;
    const close = () => setWordBar(null);
    id = setTimeout(() => document.addEventListener('click', close), 0);
    window.addEventListener('scroll', close, true);
    return () => {
      clearTimeout(id);
      document.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordBar !== null]);

  const generateStory = async () => {
    setGenerating(true);
    setShowGenPanel(false);
    const toastId = toast.loading('Generating your story with AI...');
    try {
      const res = await api.post('/ai/reading/generate', { level: genLevel, topic: genTopic || undefined });
      const raw = res.data.data;
      if (!raw?.title || !raw?.text) throw new Error('Invalid response');
      const color = AI_COLORS[aiStories.length % AI_COLORS.length];
      const tempId = Date.now();
      const storyPayload = {
        title: raw.title,
        titleEn: raw.titleEn || '',
        level: genLevel,
        duration: '~5 min',
        xp: 40,
        color,
        category: raw.category || 'AI Generated',
        text: raw.text,
        vocab: raw.vocab || [],
        questions: (raw.questions || []).map((q: any) => ({
          q: q.q,
          options: q.options,
          correct: q.correct,
        })),
      };
      // Show story immediately (session only), then persist in background
      const sessionStory: AnyStory = { ...storyPayload, id: tempId };
      setAiStories((prev) => [sessionStory, ...prev]);
      startStory(sessionStory);
      toast.success('Story generated! 🇫🇮', { id: toastId });
      setGenTopic('');
      // Persist to backend — swap temp id for DB id on success
      api.post('/ai/stories', storyPayload)
        .then((saved) => {
          const dbId: string = saved.data?.data?.id;
          if (dbId) {
            setAiStories((prev) =>
              prev.map((s) => s.id === tempId ? { ...s, id: dbId, dbId } : s)
            );
          }
        })
        .catch(() => {/* story still visible for this session */});
    } catch {
      toast.error('Failed to generate story. Try again.', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const handleWordClick = useCallback(async (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    const clean = word.replace(/[.,!?;:"""''()[\]…—–]/g, '').trim();
    if (!clean || clean.length < 2) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const sentence = (e.target as HTMLElement).closest('p')?.textContent?.trim() || '';
    setWordBar({ word: clean, x: rect.left + rect.width / 2, y: rect.top, translation: null, form: null, baseForm: null, grammaticalCase: null });
    setTranslating(true);
    try {
      const res = await api.post('/ai/translate', { text: clean, from: 'fi', to: 'en', context: sentence });
      const d = res.data?.data || {};
      setWordBar((prev) => prev ? {
        ...prev,
        translation: d.translation || '—',
        form: d.form || null,
        baseForm: d.baseForm || null,
        grammaticalCase: d.grammaticalCase || null,
      } : null);
    } catch {
      setWordBar((prev) => prev ? { ...prev, translation: '(failed)' } : null);
    } finally {
      setTranslating(false);
    }
  }, []);

  const deleteStory = async (story: AnyStory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!story.dbId) return;
    try {
      await api.delete(`/ai/stories/${story.dbId}`);
      setAiStories((prev) => prev.filter((s) => s.dbId !== story.dbId));
      toast.success('Story deleted');
    } catch {
      toast.error('Failed to delete story');
    }
  };

  const baseStories: AnyStory[] = filter === 'All' ? baseStaticStories : baseStaticStories.filter((s) => s.level === filter);
  const filteredAi = filter === 'All' ? aiStories : aiStories.filter((s) => s.level === filter);
  const filtered: AnyStory[] = [...baseStories, ...filteredAi];

  const startStory = (story: AnyStory) => {
    setSelectedStory(story);
    setView('reading');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
  };

  const startQuiz = () => {
    if (!selectedStory) return;
    setView('quiz');
    setCurrentQ(0);
    setSelected(null);
    setShowPassage(false);
    setAnswers(Array(selectedStory.questions.length).fill(null));
  };

  const goToQuestion = (idx: number) => {
    setCurrentQ(idx);
    setSelected(answers[idx] ?? null);
  };

  const handleAnswer = (idx: number) => {
    if (answers[currentQ] !== null) return; // already answered — locked
    setSelected(idx);
    setTimeout(() => {
      const newAnswers = [...answers];
      newAnswers[currentQ] = idx;
      setAnswers(newAnswers);

      if (newAnswers.every((a) => a !== null)) {
        const finalCorrect = newAnswers.filter((a, i) => a === selectedStory?.questions[i]?.correct).length;
        const finalPct = selectedStory ? Math.round((finalCorrect / selectedStory.questions.length) * 100) : 0;
        if (finalPct >= 70 && selectedStory) {
          const xp = selectedStory.xp;
          updateUser({ totalXP: (user?.totalXP || 0) + xp });
          api.post('/users/xp', { xpEarned: xp, source: 'reading' }).then(() => refreshUser()).catch(() => {});
        }
        if (selectedStory) {
          setCompletedStories((prev) => {
            const updated = { ...prev, [selectedStory.id]: { score: finalCorrect, pct: finalPct } };
            try { if (user?.id) localStorage.setItem(`finnmate-reading-history-${user.id}`, JSON.stringify(updated)); } catch {}
            return updated;
          });
        }
        setView('result');
      } else {
        // advance to next unanswered question
        const next = newAnswers.findIndex((a, i) => i > currentQ && a === null);
        if (next !== -1) {
          setCurrentQ(next);
          setSelected(null);
        } else {
          const first = newAnswers.findIndex((a) => a === null);
          if (first !== -1) { setCurrentQ(first); setSelected(null); }
        }
      }
    }, 900);
  };

  const score = answers.filter((a, i) => a === selectedStory?.questions[i]?.correct).length;
  const pct = selectedStory ? Math.round((score / selectedStory.questions.length) * 100) : 0;

  const renderClickableText = (text: string) => (
    <>
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i}>
          {para.trim().split(/\s+/).map((word, wi) => (
            <span
              key={wi}
              onClick={(e) => handleWordClick(word, e)}
              className="cursor-pointer hover:bg-yellow-100 rounded px-0.5 transition-colors duration-100"
            >
              {word}{' '}
            </span>
          ))}
        </p>
      ))}
    </>
  );

  return (
    <div className="space-y-6">
      {/* Tap-to-translate tooltip */}
      {mounted && wordBar && createPortal(
        <div
          className="fixed z-[9999] bg-slate-800 text-white rounded-xl shadow-2xl px-3.5 py-2.5 pointer-events-none"
          style={{
            left: Math.max(8, Math.min(wordBar.x - 90, window.innerWidth - 200)),
            top: wordBar.y - 8,
            transform: 'translateY(-100%)',
            minWidth: 180,
            maxWidth: 260,
          }}
        >
          <div className="text-yellow-300 font-bold text-sm">{wordBar.word}</div>
          {translating ? (
            <div className="text-slate-400 text-xs mt-1 animate-pulse">Translating…</div>
          ) : (
            <>
              <div className="text-white text-sm mt-0.5 font-medium">{wordBar.form || wordBar.translation || '—'}</div>
              {(wordBar.baseForm || wordBar.grammaticalCase) && (
                <div className="border-t border-slate-600 mt-1.5 pt-1.5 flex flex-col gap-0.5">
                  {wordBar.baseForm && wordBar.baseForm !== wordBar.word && (
                    <div className="text-slate-400 text-xs">{wordBar.baseForm} = {wordBar.translation}</div>
                  )}
                  {wordBar.grammaticalCase && (
                    <div className="text-slate-500 text-xs italic">{wordBar.grammaticalCase}</div>
                  )}
                </div>
              )}
            </>
          )}
          <div className="absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-800 rotate-45" />
        </div>,
        document.body,
      )}



      <AnimatePresence mode="wait">

        {/* STORY LIST */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filter + actions row */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <button
                onClick={() => setShowGenPanel(false)}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
                  !showGenPanel
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-md'
                    : 'bg-white border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50'
                }`}>
                <BookOpen className="w-4 h-4" /> Reading Stories
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setShowGenPanel((v) => !v)}
                disabled={generating}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-60 ${
                  showGenPanel || generating
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                    : 'bg-white border-2 border-violet-500 text-violet-600 hover:bg-violet-50'
                }`}
              >
                {generating
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
                  : <><Sparkles className="w-4 h-4" /> Generate with AI</>}
              </motion.button>
              <div className="hidden md:flex items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-xl px-3 py-1.5">
                <BookOpen className="w-4 h-4 text-cyan-600" />
                <span className="text-cyan-700 text-sm font-semibold">{filtered.length} Stories{aiStories.length > 0 ? ` · ${filteredAi.length} saved` : ''}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="text-slate-500 text-sm font-medium">Level:</span>
                {(['All', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFilter(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      filter === lvl ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate with AI — full two-column view */}
            {showGenPanel && (
              <motion.div
                key="gen-panel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid md:grid-cols-3 gap-5"
              >
                {/* Left: controls */}
                <div className="md:col-span-2 space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <h3 className="text-slate-800 font-black text-base mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" /> Generate a Story
                    </h3>

                    {/* Level selector */}
                    <div className="flex items-center gap-3 mb-5 flex-wrap">
                      <span className="text-slate-700 font-semibold text-sm">Level:</span>
                      {(['A1', 'A2', 'B1', 'B2'] as const).map((l) => (
                        <button key={l} onClick={() => setGenLevel(l)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${genLevel === l ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                          {l}
                        </button>
                      ))}
                    </div>

                    {/* Topic input */}
                    <div className="mb-5">
                      <label className="text-slate-600 text-sm font-semibold block mb-1.5">Topic <span className="text-slate-400 font-normal">(optional)</span></label>
                      <input
                        value={genTopic}
                        onChange={(e) => setGenTopic(e.target.value)}
                        placeholder="e.g. shopping, weather, Finnish sauna…"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all"
                      />
                    </div>

                    {/* Generate button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      onClick={generateStory} disabled={generating}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
                    >
                      {generating
                        ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                        : <><Sparkles className="w-4 h-4" /> Generate Story</>}
                    </motion.button>

                    {/* Note */}
                    <p className="text-xs text-slate-400 mt-3 text-center">
                      Stories are saved to your library and earn you <span className="text-amber-500 font-semibold">+40 XP</span> on completion.
                    </p>
                  </div>
                </div>

                {/* Right: how it works */}
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h3 className="text-slate-700 font-black text-sm uppercase tracking-widest mb-4">How it works</h3>
                  <div className="space-y-4">
                    {[
                      { step: '1', title: 'Choose your level', desc: 'Pick A1–B2 to match your Finnish proficiency.' },
                      { step: '2', title: 'Add a topic (optional)', desc: 'Guide the AI with a theme like "café" or "nature".' },
                      { step: '3', title: 'Story is generated', desc: 'A unique Finnish story with vocabulary and quiz questions is created instantly.' },
                      { step: '4', title: 'Read & earn XP', desc: 'Complete the comprehension quiz to earn XP. Your story is saved to your library.' },
                    ].map(({ step, title, desc }) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5">
                          {step}
                        </div>
                        <div>
                          <div className="text-slate-800 text-sm font-semibold">{title}</div>
                          <div className="text-slate-400 text-xs mt-0.5 leading-relaxed">{desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Story grid — only shown when generate panel is closed */}
            {!showGenPanel && (
              <>
            {aiLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading your library…
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((story, i) => {
                const isAi = !!story.dbId;
                return (
                <motion.div
                  key={String(story.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden cursor-pointer group ${isAi ? 'border-violet-200' : 'border-slate-100'}`}
                  onClick={() => startStory(story)}
                >
                  <div className={`h-2 bg-gradient-to-r ${story.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[story.level]}`}>{story.level}</span>
                          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{story.category}</span>
                          {isAi && (
                            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                          {completedStories[story.id] && (
                            <span className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> {completedStories[story.id].pct}%
                            </span>
                          )}
                        </div>
                        <h3 className="text-slate-800 font-black text-base">{story.title}</h3>
                        <p className="text-slate-500 text-xs">{story.titleEn}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-3 shrink-0">
                        {isAi && (
                          <button
                            onClick={(e) => deleteStory(story, e)}
                            title="Delete story"
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${story.color} flex items-center justify-center shadow-sm`}>
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{story.duration}</div>
                      <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />+{story.xp} XP</div>
                      <div className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" />{story.questions.length} questions</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-1">
                        {story.vocab.slice(0, 4).map((v, vi) => (
                          <span key={vi} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">{v.split(' ')[0]}</span>
                        ))}
                      </div>
                      <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
              </>
            )}
          </motion.div>
        )}

        {/* READING VIEW */}
        {view === 'reading' && selectedStory && (
          <motion.div key="reading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-4">
            <button onClick={() => { setView('list'); setWordBar(null); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
              ← Back to stories
            </button>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${selectedStory.color}`} />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[selectedStory.level]}`}>{selectedStory.level}</span>
                  <span className="text-xs text-slate-400">{selectedStory.category}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-0.5">{selectedStory.title}</h2>
                <p className="text-slate-400 text-sm mb-6">{selectedStory.titleEn}</p>

                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-yellow-200 rounded" /> Tap any word to translate
                </p>
                <div className="text-slate-700 leading-8 text-base mb-6 bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                  {renderClickableText(selectedStory.text)}
                </div>

                {/* Key Vocabulary */}
                <div className="mb-6">
                  <h3 className="text-slate-800 font-bold text-sm mb-2">Key Vocabulary</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.vocab.map((v, i) => (
                      <span key={i} className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{v}</span>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={startQuiz}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  Test Comprehension <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QUIZ VIEW */}
        {view === 'quiz' && selectedStory && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-3">

            {/* Collapsible passage review */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowPassage((v) => !v)}
                className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-slate-700 text-sm">Review Passage</span>
                  <span className="text-xs text-slate-400 hidden sm:inline">— {selectedStory.title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showPassage ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showPassage && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-slate-100">
                      <p className="text-xs text-slate-400 mt-3 mb-1.5 flex items-center gap-1">
                        <span className="inline-block w-2 h-2 bg-yellow-200 rounded" /> Tap any word to translate
                      </p>
                      <div className="text-slate-700 leading-7 text-sm bg-slate-50 rounded-xl p-4 border border-slate-100 max-h-64 overflow-y-auto space-y-3">
                        {renderClickableText(selectedStory.text)}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {selectedStory.vocab.map((v, i) => (
                          <span key={i} className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{v}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {/* Progress dots — clickable to jump between questions */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 text-sm">
                  Question {currentQ + 1} of {selectedStory.questions.length}
                </span>
                <div className="flex gap-1.5">
                  {selectedStory.questions.map((_, i) => {
                    const isAnswered = answers[i] !== null;
                    const isCurrent = i === currentQ;
                    return (
                      <button
                        key={i}
                        onClick={() => goToQuestion(i)}
                        title={`Question ${i + 1}${isAnswered ? ' (answered)' : ''}`}
                        className={`h-2 rounded-full transition-all duration-200 ${
                          isCurrent
                            ? 'w-6 bg-blue-500'
                            : isAnswered
                            ? 'w-4 bg-blue-400 hover:bg-blue-500'
                            : 'w-4 bg-slate-200 hover:bg-slate-300'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-slate-800 font-bold text-lg mb-5">{selectedStory.questions[currentQ].q}</h3>

                {/* Already-answered indicator */}
                {answers[currentQ] !== null && (
                  <p className="text-xs text-slate-400 mb-3 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    Already answered — use the dots above to navigate
                  </p>
                )}

                <div className="space-y-2.5">
                  {selectedStory.questions[currentQ].options.map((opt, idx) => {
                    const isCorrect = idx === selectedStory.questions[currentQ].correct;
                    const isSelected = selected === idx;
                    const isLocked = answers[currentQ] !== null;
                    const showFeedback = selected !== null || isLocked;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={!showFeedback ? { x: 4 } : {}}
                        whileTap={!showFeedback ? { scale: 0.99 } : {}}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          !showFeedback
                            ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700'
                            : isSelected && isCorrect
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : isSelected && !isCorrect
                            ? 'border-red-400 bg-red-50 text-red-700'
                            : isCorrect
                            ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          !showFeedback ? 'bg-slate-100 text-slate-500' :
                          isSelected && isCorrect ? 'bg-emerald-400 text-white' :
                          isSelected && !isCorrect ? 'bg-red-400 text-white' :
                          isCorrect ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium text-sm">{opt}</span>
                        {showFeedback && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        {showFeedback && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>

            {/* Unanswered count hint */}
            {answers.some((a) => a === null) && (
              <p className="text-center text-xs text-slate-400">
                {answers.filter((a) => a === null).length} question{answers.filter((a) => a === null).length !== 1 ? 's' : ''} remaining
              </p>
            )}
          </motion.div>
        )}

        {/* RESULT VIEW */}
        {view === 'result' && selectedStory && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 ${pct >= 70 ? 'bg-emerald-100' : 'bg-orange-100'}`}
              >
                {pct >= 70 ? (
                  <Trophy className="w-10 h-10 text-emerald-600" />
                ) : (
                  <BookOpen className="w-10 h-10 text-orange-500" />
                )}
              </motion.div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">
                {pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Great job!' : 'Keep practicing!'}
              </h2>
              <p className="text-slate-500 text-sm mb-5">
                You answered {score} out of {selectedStory.questions.length} correctly
              </p>
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="text-4xl font-black text-slate-800 mb-1">{pct}%</div>
                <div className="text-slate-400 text-sm">Comprehension Score</div>
                {pct >= 70 && (
                  <div className="mt-2 text-emerald-600 font-bold text-sm">+{selectedStory.xp} XP Earned!</div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setView('reading'); setCurrentQ(0); setAnswers([]); setSelected(null); }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <button onClick={() => setView('list')} className="btn-primary flex-1 py-2.5 text-sm">
                  More Stories
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
