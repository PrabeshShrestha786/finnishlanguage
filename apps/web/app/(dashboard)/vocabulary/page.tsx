'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Volume2, RotateCcw, CheckCircle2, Brain, Zap, BookOpen, Star, ChevronRight, RefreshCw, Heart, Clock, Sparkles, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all',          label: 'All Words',  emoji: '📚' },
  { id: 'Favorites',    label: 'Your Favorites',  emoji: '❤️' },
  { id: 'Greetings',    label: 'Greetings',  emoji: '👋' },
  { id: 'Food & Drink', label: 'Food',       emoji: '🍽️' },
  { id: 'Travel',       label: 'Travel',     emoji: '✈️' },
  { id: 'Family',       label: 'Family',     emoji: '👨‍👩‍👧' },
  { id: 'Work',         label: 'Work',       emoji: '💼' },
  { id: 'Nature',       label: 'Nature',     emoji: '🌲' },
  { id: 'Numbers',      label: 'Numbers',    emoji: '🔢' },
  { id: 'Colors',       label: 'Colors',     emoji: '🎨' },
  { id: 'Verbs',        label: 'Verbs',      emoji: '⚡' },
  { id: 'Home',         label: 'Home',       emoji: '🏠' },
  { id: 'Shopping',     label: 'Shopping',   emoji: '🛒' },
  { id: 'Transportation', label: 'Transportation', emoji: '🚗' },
  { id: 'School',       label: 'School',     emoji: '🏫' },
  { id: 'Health',       label: 'Health',     emoji: '🏥' },
  { id: 'Money',        label: 'Money & Banking', emoji: '💰' },
  { id: 'Time',         label: 'Time & Dates', emoji: '📅' },
  { id: 'Weather',      label: 'Weather',    emoji: '🌦️' },
  { id: 'Household',    label: 'Household',  emoji: '🧹' },
  { id: 'Clothes',      label: 'Clothes',    emoji: '👕' },
  { id: 'Phrases',      label: 'Common Phrases', emoji: '💬' },
  { id: 'Questions',    label: 'Questions',  emoji: '❓' },
  { id: 'Emotions',     label: 'Emotions',   emoji: '😊' },
  { id: 'Conversations', label: 'Conversations', emoji: '🗣️' },
  { id: 'Phone',        label: 'Phone Calls', emoji: '📞' },
  { id: 'Government',   label: 'Kela & Government', emoji: '🧾' },
  { id: 'Winter',       label: 'Winter',     emoji: '🧊' },
  { id: 'Sauna',        label: 'Sauna',      emoji: '🧖' },
  { id: 'IT',           label: 'Networking & IT', emoji: '🔧' },
  { id: 'Tools',        label: 'Tools & Equipment', emoji: '🧰' },
  { id: 'Interview',    label: 'Interview',  emoji: '📄' },
  

  
];

const RATINGS = [
  { quality: 1, label: 'Again',  sub: 'Forgot',        color: 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300' },
  { quality: 2, label: 'Hard',   sub: 'Struggled',     color: 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:border-orange-300' },
  { quality: 4, label: 'Good',   sub: 'Remembered',    color: 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300' },
  { quality: 5, label: 'Easy',   sub: 'Knew it!',      color: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300' },
];

type View = 'categories' | 'flashcard' | 'summary';
type SessionMode = 'category' | 'due' | 'learned' | 'ai';

interface Word {
  id: string;
  finnish: string;
  english: string;
  pronunciation?: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  category?: string;
  level: string;
}

function FlashCard({ word, onRate, index, total, isExtraPractice, isFavorite, onToggleFavorite }: {
  word: Word;
  onRate: (quality: number) => void;
  index: number;
  total: number;
  isExtraPractice: boolean;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const speak = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speaking) return;
    setSpeaking(true);
    try {
      const res = await api.post('/ai/tts', { text: word.finnish }, { responseType: 'arraybuffer' });
      const ctx = new AudioContext();
      const buffer = await ctx.decodeAudioData(res.data);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
      source.onended = () => setSpeaking(false);
    } catch {
      // fallback to browser TTS
      const u = new SpeechSynthesisUtterance(word.finnish);
      u.lang = 'fi-FI'; u.rate = 0.8;
      window.speechSynthesis.speak(u);
      setSpeaking(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Progress bar */}
      <div className="w-full flex items-center gap-3">
        <span className="text-slate-400 text-sm tabular-nums flex-shrink-0">{index + 1} / {total}</span>
        <div className="flex-1 flex gap-1">
          {Array.from({ length: Math.min(total, 20) }).map((_, i) => (
            <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i < index ? 'bg-amber-400' : i === index ? 'bg-amber-300' : 'bg-slate-100'}`} />
          ))}
        </div>
        {isExtraPractice && (
          <span className="flex-shrink-0 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-0.5 rounded-full">
            Extra Practice
          </span>
        )}
      </div>

      {/* Card with flip */}
      <motion.div
        key={word.id}
        className="cursor-pointer w-full"
        onClick={() => setFlipped((f) => !f)}
        style={{ perspective: '1400px' }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', height: 250 }}
        >
          {/* Front — Finnish word */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors hover:bg-white/10"
            >
              <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-400 text-red-400' : 'text-blue-300'}`} />
            </button>
            <div className="text-5xl font-black text-white mb-1.5 tracking-tight text-center leading-tight">{word.finnish}</div>
            {word.pronunciation && (
              <div className="text-blue-200 font-mono text-sm mb-2">[{word.pronunciation}]</div>
            )}
            <button onClick={speak} disabled={speaking} className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm transition-colors mt-1 disabled:opacity-60">
              <Volume2 className={`w-4 h-4 ${speaking ? 'animate-pulse' : ''}`} /> {speaking ? 'Playing…' : 'Listen'}
            </button>
            <p className="text-blue-300/70 text-xs mt-3">Tap to reveal</p>
          </div>

          {/* Back — translation */}
          <div
            className="absolute inset-0 bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl border border-slate-100"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-3xl font-black text-slate-800 mb-1 text-center leading-tight">{word.english}</div>
            {word.exampleSentence && (
              <div className="text-center mt-2 px-2">
                <p className="text-slate-500 text-sm italic">&ldquo;{word.exampleSentence}&rdquo;</p>
                {word.exampleTranslation && (
                  <p className="text-slate-400 text-xs mt-1">{word.exampleTranslation}</p>
                )}
              </div>
            )}
            <div className="mt-3 flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full font-semibold">{word.level}</span>
              {word.category && (
                <span className="text-xs bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded-full">{word.category}</span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Rating buttons — Anki style, only after flip */}
      <AnimatePresence>
        {flipped ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="w-full"
          >
            <p className="text-center text-sm text-slate-400 mb-2">How well did you remember?</p>
            <div className="grid grid-cols-4 gap-3">
              {RATINGS.map((r) => (
                <motion.button
                  key={r.quality}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  onClick={() => onRate(r.quality)}
                  className={`py-3.5 rounded-2xl border-2 font-bold text-base flex flex-col items-center gap-0.5 transition-all ${r.color}`}
                >
                  <span>{r.label}</span>
                  <span className="text-sm font-normal opacity-70">{r.sub}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-slate-400 text-sm"
          >
            Tap the card to reveal the answer
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VocabularyPage() {
  const [view, setView] = useState<View>('categories');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [cardIdx, setCardIdx] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [sessionKey, setSessionKey] = useState(0);
  const [sessionMode, setSessionMode] = useState<SessionMode>('category');
  const [summary, setSummary] = useState<{ total: number; correct: number; xp: number; category: string } | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genLevel, setGenLevel] = useState('A2');
  const [genTopic, setGenTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [aiWords, setAiWords] = useState<Word[]>([]);
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: statsData } = useQuery({
    queryKey: ['vocab-stats'],
    queryFn: () => api.get('/vocabulary/stats').then((r) => r.data.data).catch(() => null),
    staleTime: 30_000,
  });

  const { data: categoryCounts } = useQuery({
    queryKey: ['vocab-categories', level],
    queryFn: () => api.get('/vocabulary/categories', {
      params: level !== 'all' ? { level } : {},
    }).then((r) => r.data.data as { category: string; count: number }[]).catch(() => []),
    staleTime: 60_000,
  });

  const { data: favoritesCount } = useQuery({
    queryKey: ['vocab-favorites-count', level],
    queryFn: () => api.get('/vocabulary/favorites', {
      params: level !== 'all' ? { level } : {},
    }).then((r) => (r.data.data as any[]).length).catch(() => 0),
    staleTime: 30_000,
  });

  const { data: flashcardData, isLoading: loadingCards } = useQuery({
    queryKey: ['vocab-flashcards', category, level],
    queryFn: () => api.get('/vocabulary/flashcards', {
      params: {
        limit: 20,
        ...(category !== 'all' ? { category } : {}),
        ...(level !== 'all' ? { level } : {}),
      },
    }).then((r) => r.data.data).catch(() => null),
    enabled: view === 'flashcard',
    staleTime: 60_000,
  });

  const { data: wordsData, isLoading: loadingWords } = useQuery({
    queryKey: category === 'Favorites' ? ['vocab-favorites', level] : ['vocab-words', category, level],
    queryFn: () => {
      if (category === 'Favorites') {
        return api.get('/vocabulary/favorites', {
          params: level !== 'all' ? { level } : {},
        }).then((r) => ({ words: r.data.data, total: r.data.data.length }))
          .catch(() => null);
      }
      return api.get('/vocabulary', {
        params: {
          limit: 50,
          ...(category !== 'all' ? { category } : {}),
          ...(level !== 'all' ? { level } : {}),
        },
      }).then((r) => r.data.data).catch(() => null);
    },
    staleTime: 60_000,
  });

  const { data: statusCardsData, isLoading: loadingStatusCards } = useQuery({
    queryKey: ['vocab-status-cards', sessionMode, sessionKey],
    queryFn: () => {
      if (sessionMode === 'due') return api.get('/vocabulary/due').then((r) => r.data.data as any[]).catch(() => null);
      if (sessionMode === 'learned') return api.get('/vocabulary/learned').then((r) => r.data.data as any[]).catch(() => null);
      return Promise.resolve(null);
    },
    enabled: view === 'flashcard' && sessionMode !== 'category',
    staleTime: 30_000,
  });

  const reviewMutation = useMutation({
    mutationFn: ({ wordId, quality }: { wordId: string; quality: number }) =>
      api.post('/vocabulary/review', { wordId, quality }).then((r) => r.data.data),
    onSuccess: (_data, variables) => {
      if (variables.quality >= 3) {
        updateUser({ totalXP: (user?.totalXP || 0) + 2 });
      }
      queryClient.invalidateQueries({ queryKey: ['vocab-stats'] });
    },
  });

  const favoriteMutation = useMutation({
    mutationFn: (wordId: string) => api.post(`/vocabulary/${wordId}/favorite`),
    onSuccess: (_data, wordId) => {
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        next.has(wordId) ? next.delete(wordId) : next.add(wordId);
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ['vocab-favorites'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['vocab-favorites-count'], exact: false });
    },
  });

  const mapWord = (w: any): Word => ({
    id: w.id, finnish: w.finnish, english: w.english,
    pronunciation: w.pronunciation, exampleSentence: w.exampleSentence,
    exampleTranslation: w.exampleTranslation, category: w.category, level: w.level,
  });

  // Seed favoriteIds from progress data when it loads
  useEffect(() => {
    if (!flashcardData?.flashcards) return;
    const ids = new Set<string>(
      flashcardData.flashcards.filter((p: any) => p.isFavorite).map((p: any) => p.wordId as string)
    );
    setFavoriteIds(ids);
  }, [flashcardData]);

  // Build card deck: SRS due cards first, then fall back to all words for extra practice
  const srsCards: Word[] = (() => {
    if (!flashcardData) return [];
    const fromProgress = (flashcardData.flashcards || [])
      .map((p: any) => mapWord({ ...p.word, id: p.wordId || p.word?.id }))
      .filter((w: Word) => w.finnish);
    const fromNew = (flashcardData.newWords || []).map(mapWord);
    return [...fromProgress, ...fromNew];
  })();

  const extraCards: Word[] = (wordsData?.words || []).map(mapWord);

  // Build card deck depending on session mode.
  const rawCardIds = sessionMode === 'ai'
    ? aiWords.map((w) => w.id).join(',')
    : sessionMode !== 'category'
      ? (statusCardsData || []).map((w: any) => w.id).join(',')
      : [...srsCards.map((w) => w.id), ...extraCards.map((w) => w.id)].join(',');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allCards: Word[] = useMemo(() => {
    if (sessionMode === 'ai') return shuffled(aiWords);
    if (sessionMode !== 'category') return shuffled((statusCardsData || []).map(mapWord));
    if (srsCards.length === 0) return shuffled(extraCards);
    const srsIds = new Set(srsCards.map((w) => w.id));
    const remaining = extraCards.filter((w) => !srsIds.has(w.id));
    return [...shuffled(srsCards), ...shuffled(remaining)];
  }, [sessionKey, rawCardIds, sessionMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const isExtraPractice = view === 'flashcard' && !loadingCards && srsCards.length === 0 && extraCards.length > 0;

  const currentWord = allCards[cardIdx];

  // Auto-redirect when queries finish but no words found (skip for AI mode — words are already loaded)
  useEffect(() => {
    if (view !== 'flashcard') return;
    if (sessionMode === 'ai') return;
    const loading = sessionMode !== 'category' ? loadingStatusCards : (loadingCards || loadingWords);
    if (loading) return;
    if (allCards.length === 0) {
      toast('No vocabulary in this category yet', { icon: '📭' });
      setView('categories');
      setCategory('all');
      setCardIdx(0);
      setGoodCount(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, loadingCards, loadingWords, loadingStatusCards, allCards.length, sessionMode]);

  const goBack = () => {
    setView('categories');
    setCategory('all');
    setSessionMode('category');
    setCardIdx(0);
    setGoodCount(0);
    setSummary(null);
  };

  const startStatusSession = (mode: 'due' | 'learned') => {
    setSessionMode(mode);
    setCategory('all');
    setView('flashcard');
    setCardIdx(0);
    setGoodCount(0);
    setSessionKey((k) => k + 1);
  };

  const generateAISet = async () => {
    setGenerating(true);
    setShowGenPanel(false);
    try {
      const res = await api.post('/ai/vocabulary/generate', { level: genLevel, topic: genTopic || undefined, count: 10 });
      const data = res.data.data ?? res.data;
      const words: Word[] = (data.words || []).map((w: any) => ({
        id: w.id, finnish: w.finnish, english: w.english,
        pronunciation: w.pronunciation, exampleSentence: w.exampleSentence,
        exampleTranslation: w.exampleTranslation, level: w.level,
      }));
      setAiWords(words);
      setSessionMode('ai');
      setView('flashcard');
      setCardIdx(0);
      setGoodCount(0);
      setSessionKey((k) => k + 1);
      toast.success(`Generated ${words.length} words — ${data.topic}`, { icon: '✨' });
    } catch {
      toast.error('Failed to generate. Try again.');
      setShowGenPanel(true);
    } finally {
      setGenerating(false);
    }
  };

  const LEVELS = [
    { id: 'all', label: 'All Levels' },
    { id: 'A1', label: 'A1 · Beginner' },
    { id: 'A2', label: 'A2 · Elementary' },
    { id: 'B1', label: 'B1 · Intermediate' },
    { id: 'B2', label: 'B2 · Upper Intermediate' },
  ];

  const handleRate = (quality: number) => {
    if (!currentWord) return;
    // AI session words don't exist in the DB — just award XP for good ratings
    if (sessionMode !== 'ai') {
      reviewMutation.mutate({ wordId: currentWord.id, quality });
    } else if (quality >= 3) {
      updateUser({ totalXP: (user?.totalXP || 0) + 2 });
    }
    if (quality >= 3) setGoodCount((k) => k + 1);

    if (cardIdx < allCards.length - 1) {
      setCardIdx((i) => i + 1);
    } else {
      const finalGood = quality >= 3 ? goodCount + 1 : goodCount;
      if (sessionMode !== 'ai') {
        queryClient.invalidateQueries({ queryKey: ['vocab-flashcards'] });
        queryClient.invalidateQueries({ queryKey: ['vocab-stats'] });
      }
      setSummary({ total: allCards.length, correct: finalGood, xp: finalGood * 2, category });
      setView('summary');
    }
  };

  const startFlashcards = (cat: string) => {
    setCategory(cat);
    setView('flashcard');
    setCardIdx(0);
    setGoodCount(0);
    setSessionKey((k) => k + 1);
  };

  const levelLabel = LEVELS.find((l) => l.id === level)?.label ?? 'All Levels';

  // ── SUMMARY VIEW ─────────────────────────────────────────────────────────────
  if (view === 'summary' && summary) {
    const pct = Math.round((summary.correct / summary.total) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '💪' : '📖';
    const catLabel = sessionMode === 'ai' ? 'AI Practice Set'
      : sessionMode === 'due' ? 'Due for Review'
      : sessionMode === 'learned' ? 'Learned Words'
      : CATEGORIES.find((c) => c.id === summary.category)?.label ?? 'All Words';
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-lg p-8 max-w-sm w-full text-center space-y-6"
        >
          <div className="text-6xl">{emoji}</div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Session Complete!</h2>
            <p className="text-slate-400 text-sm mt-1">{catLabel}</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Reviewed', value: summary.total, color: 'bg-slate-50 text-slate-700' },
              { label: 'Correct', value: summary.correct, color: 'bg-emerald-50 text-emerald-700' },
              { label: 'XP Earned', value: `+${summary.xp}`, color: 'bg-amber-50 text-amber-700' },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl p-3 ${s.color}`}>
                <div className="text-2xl font-black">{s.value}</div>
                <div className="text-xs font-medium opacity-70 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-2.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
            />
          </div>
          <p className="text-slate-500 text-sm -mt-3">{pct}% accuracy</p>

          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setCardIdx(0); setGoodCount(0); setView('flashcard'); setSummary(null); setSessionKey((k) => k + 1); }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors"
            >
              Practice Again
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={goBack}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
            >
              Done
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── CATEGORIES VIEW ──────────────────────────────────────────────────────────
  if (view === 'categories') {
    return (
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowGenPanel(false)}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 ${
              !showGenPanel
                ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
                : 'bg-white border-2 border-yellow-400 text-yellow-600 hover:bg-yellow-50'
            }`}>
            <Brain className="w-4 h-4" /> Vocabulary
          </button>

          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowGenPanel((v) => !v)}
            disabled={generating}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-60 ${
              showGenPanel || generating
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                : 'bg-white border-2 border-violet-500 text-violet-600 hover:bg-violet-50'
            }`}>
            {generating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              : <><Sparkles className="w-4 h-4" /> Practice with AI</>}
          </motion.button>

          <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2">
            <Brain className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-semibold">SM-2 Algorithm</span>
          </div>
        </div>

        {/* Practice with AI — full two-column view */}
        {showGenPanel && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid md:grid-cols-3 gap-5"
          >
            {/* Left: controls */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="text-slate-800 font-black text-base mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-violet-500" /> Generate a Practice Set
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
                    onKeyDown={(e) => e.key === 'Enter' && generateAISet()}
                    placeholder="e.g. at the café, shopping, travel…"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-400/30 focus:border-violet-400 transition-all"
                  />
                </div>

                {/* Generate button */}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={generateAISet} disabled={generating}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
                >
                  {generating
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
                    : <><Sparkles className="w-4 h-4" /> Generate Practice Set</>}
                </motion.button>

                <p className="text-xs text-slate-400 mt-3 text-center">
                  Earn <span className="text-amber-500 font-semibold">+2 XP</span> per correct card. Sets are not saved — generate a new one anytime.
                </p>
              </div>
            </div>

            {/* Right: how it works */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="text-slate-700 font-black text-sm uppercase tracking-widest mb-4">How it works</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Choose your level', desc: 'Pick A1–B2 to match your current Finnish level.' },
                  { step: '2', title: 'Add a topic (optional)', desc: 'Focus on a theme like "food" or "workplace" vocabulary.' },
                  { step: '3', title: 'Cards are generated', desc: 'AI creates 10 Finnish–English flashcards with example sentences.' },
                  { step: '4', title: 'Practice & earn XP', desc: 'Rate each card and earn XP for correct answers. Use SM-2 categories for scheduled review.' },
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

        {/* Stats + categories — hidden while generate panel is open */}
        {!showGenPanel && (
        <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Studied',  value: statsData?.totalStudied ?? 0,  icon: BookOpen,     color: 'from-blue-500 to-indigo-600',   onClick: undefined },
            { label: 'Learned',        value: statsData?.learned ?? 0,        icon: CheckCircle2, color: 'from-emerald-400 to-teal-500', onClick: () => startStatusSession('learned') },
            { label: 'Scheduled',      value: Math.max(0, statsData?.scheduled ?? 0), icon: Clock, color: 'from-violet-400 to-purple-500', onClick: undefined },
            { label: 'Due for Review', value: statsData?.dueForReview ?? 0,   icon: RotateCcw,   color: 'from-amber-400 to-orange-500',  onClick: () => startStatusSession('due') },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              onClick={s.onClick}
              whileHover={s.onClick ? { y: -2 } : {}}
              whileTap={s.onClick ? { scale: 0.97 } : {}}
              className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center transition-shadow ${s.onClick ? 'cursor-pointer hover:shadow-md hover:border-blue-100' : ''}`}
            >
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-black text-slate-800">{s.value}</div>
              <div className="text-slate-400 text-xs">{s.label}</div>
              {s.onClick && <div className="text-blue-500 text-xs font-semibold mt-1">Review →</div>}
            </motion.div>
          ))}
        </div>

        {/* Level filter — hidden on Favorites */}
        <div className={`flex gap-2 flex-wrap ${category === 'Favorites' ? 'hidden' : ''}`}>
          {LEVELS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLevel(l.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                level === l.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-blue-200 hover:text-blue-600'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Categories grid */}
        <div>
          <h2 className="text-base font-black text-slate-800 mb-3">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => {
              // Favorites lives in VocabProgress, not in category groupBy — use dedicated query
              const found = cat.id === 'Favorites'
                ? favoritesCount
                : cat.id === 'all'
                  ? (categoryCounts ?? []).reduce((s, c) => s + c.count, 0)
                  : (categoryCounts ?? []).find((c) => c.category === cat.id)?.count;
              const count = found !== undefined ? found : (level !== 'all' ? 0 : null);
              return (
                <motion.button
                  key={cat.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => startFlashcards(cat.id)}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
                >
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="text-slate-700 text-xs font-semibold">{cat.label}</span>
                  {count !== null ? (
                    <span className="text-xs text-slate-400 font-medium">{count} words</span>
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <span className="font-bold">+2 XP</span> for each correct card · SM-2 spaced repetition schedules reviews at the optimal time · Extra Practice always available
          </div>
        </div>
        </>
        )}
      </div>
    );
  }

  // ── FLASHCARD VIEW ───────────────────────────────────────────────────────────
  // Wait for both queries — prevents flash of "No words found" during fetch
  const isLoading = sessionMode !== 'category'
    ? loadingStatusCards
    : (loadingCards || (srsCards.length === 0 && loadingWords));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
          ← Back
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-slate-800 font-bold text-lg truncate">
            {sessionMode === 'ai' ? '✨ AI Practice Set'
              : sessionMode === 'due' ? '🔄 Due for Review'
              : sessionMode === 'learned' ? '✅ Learned Words'
              : `${CATEGORIES.find((c) => c.id === category)?.emoji ?? ''} ${CATEGORIES.find((c) => c.id === category)?.label ?? 'All Words'}`}
          </div>
          <div className="text-slate-400 text-sm">
            {sessionMode === 'category' && level !== 'all' && <span className="text-blue-500 font-semibold mr-1">{level}</span>}
            {goodCount} correct · +{goodCount * 2} XP earned
          </div>
        </div>
        <button
          onClick={() => { setCardIdx(0); setGoodCount(0); }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-sm transition-colors"
          title="Restart deck"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-1 text-amber-600 font-bold">
          <Star className="w-5 h-5 text-amber-400" />
          {(user?.totalXP || 0).toLocaleString()}
        </div>
      </div>

      {/* Card area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        {isLoading || allCards.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-10 h-10 border-[3px] border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading cards...</p>
          </div>
        ) : currentWord ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={cardIdx}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.18 }}
            >
              <FlashCard
                word={currentWord}
                onRate={handleRate}
                index={cardIdx}
                total={allCards.length}
                isExtraPractice={isExtraPractice}
                isFavorite={favoriteIds.has(currentWord.id)}
                onToggleFavorite={() => favoriteMutation.mutate(currentWord.id)}
              />
            </motion.div>
          </AnimatePresence>
        ) : null}
      </div>
    </div>
  );
}
