'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Volume2, RotateCcw, CheckCircle2, Brain, Zap, BookOpen, Star, ChevronRight, RefreshCw, Heart } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all',          label: 'All Words',  emoji: '📚' },
  { id: 'Favorites',    label: 'Favorites',  emoji: '❤️' },
  { id: 'Greetings',    label: 'Greetings',  emoji: '👋' },
  { id: 'Food & Drink', label: 'Food',       emoji: '🍽️' },
  { id: 'Travel',       label: 'Travel',     emoji: '✈️' },
  { id: 'Family',       label: 'Family',     emoji: '👨‍👩‍👧' },
  { id: 'Work',         label: 'Work',       emoji: '💼' },
  { id: 'Nature',       label: 'Nature',     emoji: '🌲' },
  { id: 'Numbers',      label: 'Numbers',    emoji: '🔢' },
  { id: 'Colors',       label: 'Colors',     emoji: '🎨' },
  { id: 'Verbs',        label: 'Verbs',      emoji: '⚡' },
];

const RATINGS = [
  { quality: 1, label: 'Again',  sub: 'Forgot',        color: 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300' },
  { quality: 2, label: 'Hard',   sub: 'Struggled',     color: 'border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100 hover:border-orange-300' },
  { quality: 4, label: 'Good',   sub: 'Remembered',    color: 'border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-300' },
  { quality: 5, label: 'Easy',   sub: 'Knew it!',      color: 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300' },
];

type View = 'categories' | 'flashcard' | 'summary';

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

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const u = new SpeechSynthesisUtterance(word.finnish);
    u.lang = 'fi-FI'; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Progress bar */}
      <div className="w-full flex items-center gap-3">
        <span className="text-slate-400 text-xs tabular-nums flex-shrink-0">{index + 1} / {total}</span>
        <div className="flex-1 flex gap-0.5">
          {Array.from({ length: Math.min(total, 20) }).map((_, i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < index ? 'bg-amber-400' : i === index ? 'bg-amber-300' : 'bg-slate-100'}`} />
          ))}
        </div>
        {isExtraPractice && (
          <span className="flex-shrink-0 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-100 px-2 py-0.5 rounded-full">
            Extra Practice
          </span>
        )}
      </div>

      {/* Card with flip */}
      <motion.div
        key={word.id}
        className="cursor-pointer w-full"
        onClick={() => setFlipped((f) => !f)}
        style={{ perspective: '1200px' }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', height: 240 }}
        >
          {/* Front — Finnish word */}
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <button
              onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
              className="absolute top-4 right-4 p-1.5 rounded-full transition-colors hover:bg-white/10"
            >
              <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-400 text-red-400' : 'text-blue-300'}`} />
            </button>
            <div className="text-5xl font-black text-white mb-2 tracking-tight text-center">{word.finnish}</div>
            {word.pronunciation && (
              <div className="text-blue-200 font-mono text-sm mb-3">[{word.pronunciation}]</div>
            )}
            <button onClick={speak} className="flex items-center gap-1.5 text-blue-200 hover:text-white text-sm transition-colors mt-1">
              <Volume2 className="w-4 h-4" /> Listen
            </button>
            <p className="text-blue-300/70 text-xs mt-5">Tap to reveal</p>
          </div>

          {/* Back — translation */}
          <div
            className="absolute inset-0 bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg border border-slate-100"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            <div className="text-3xl font-black text-slate-800 mb-1 text-center">{word.english}</div>
            {word.exampleSentence && (
              <div className="text-center mt-3 px-2">
                <p className="text-slate-500 text-sm italic">&ldquo;{word.exampleSentence}&rdquo;</p>
                {word.exampleTranslation && (
                  <p className="text-slate-400 text-xs mt-1">{word.exampleTranslation}</p>
                )}
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">{word.level}</span>
              {word.category && (
                <span className="text-xs bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">{word.category}</span>
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
            <p className="text-center text-xs text-slate-400 mb-2">How well did you remember?</p>
            <div className="grid grid-cols-4 gap-2">
              {RATINGS.map((r) => (
                <motion.button
                  key={r.quality}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.95 }}
                  onClick={() => onRate(r.quality)}
                  className={`py-3 rounded-xl border-2 font-bold text-sm flex flex-col items-center gap-0.5 transition-all ${r.color}`}
                >
                  <span>{r.label}</span>
                  <span className="text-xs font-normal opacity-70">{r.sub}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-slate-400 text-xs"
          >
            Tap the card to reveal the answer
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VocabularyPage() {
  const [view, setView] = useState<View>('categories');
  const [category, setCategory] = useState('all');
  const [level, setLevel] = useState('all');
  const [cardIdx, setCardIdx] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [summary, setSummary] = useState<{ total: number; correct: number; xp: number; category: string } | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: statsData } = useQuery({
    queryKey: ['vocab-stats'],
    queryFn: () => api.get('/vocabulary/stats').then((r) => r.data.data).catch(() => null),
    staleTime: 30_000,
  });

  const { data: categoryCounts } = useQuery({
    queryKey: ['vocab-categories'],
    queryFn: () => api.get('/vocabulary/categories').then((r) => r.data.data as { category: string; count: number }[]).catch(() => []),
    staleTime: 60_000,
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
    queryKey: category === 'Favorites' ? ['vocab-favorites'] : ['vocab-words', category, level],
    queryFn: () => {
      if (category === 'Favorites') {
        return api.get('/vocabulary/favorites')
          .then((r) => ({ words: r.data.data, total: r.data.data.length }))
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
      queryClient.invalidateQueries({ queryKey: ['vocab-favorites'] });
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

  // If SRS has cards, use them. Otherwise fall back to all words (extra practice).
  const allCards: Word[] = srsCards.length > 0 ? srsCards : extraCards;
  const isExtraPractice = view === 'flashcard' && !loadingCards && srsCards.length === 0 && extraCards.length > 0;

  const currentWord = allCards[cardIdx];

  // Auto-redirect when both queries finish but the category truly has no words
  useEffect(() => {
    if (view !== 'flashcard') return;
    if (loadingCards || loadingWords) return;
    if (allCards.length === 0) {
      toast('No vocabulary in this category yet', { icon: '📭' });
      setView('categories');
      setCategory('all');
      setCardIdx(0);
      setGoodCount(0);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, loadingCards, loadingWords, allCards.length]);

  const goBack = () => {
    setView('categories');
    setCategory('all');
    setCardIdx(0);
    setGoodCount(0);
    setSummary(null);
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
    reviewMutation.mutate({ wordId: currentWord.id, quality });
    if (quality >= 3) setGoodCount((k) => k + 1);

    if (cardIdx < allCards.length - 1) {
      setCardIdx((i) => i + 1);
    } else {
      const finalGood = quality >= 3 ? goodCount + 1 : goodCount;
      queryClient.invalidateQueries({ queryKey: ['vocab-flashcards'] });
      queryClient.invalidateQueries({ queryKey: ['vocab-stats'] });
      setSummary({ total: allCards.length, correct: finalGood, xp: finalGood * 2, category });
      setView('summary');
    }
  };

  const startFlashcards = (cat: string) => {
    setCategory(cat);
    setView('flashcard');
    setCardIdx(0);
    setGoodCount(0);
  };

  const levelLabel = LEVELS.find((l) => l.id === level)?.label ?? 'All Levels';

  // ── SUMMARY VIEW ─────────────────────────────────────────────────────────────
  if (view === 'summary' && summary) {
    const pct = Math.round((summary.correct / summary.total) * 100);
    const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '💪' : '📖';
    const catLabel = CATEGORIES.find((c) => c.id === summary.category)?.label ?? 'All Words';
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
              onClick={() => { setCardIdx(0); setGoodCount(0); setView('flashcard'); setSummary(null); }}
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
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Vocabulary Builder</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              Spaced repetition · {wordsData?.total ?? '...'}+ Finnish words
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2">
            <Brain className="w-4 h-4 text-amber-600" />
            <span className="text-amber-700 text-sm font-semibold">SM-2 Algorithm</span>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Studied', value: statsData?.totalStudied ?? 0, icon: BookOpen, color: 'from-blue-500 to-indigo-600' },
            { label: 'Learned',       value: statsData?.learned ?? 0,       icon: CheckCircle2, color: 'from-emerald-400 to-teal-500' },
            { label: 'Due for Review', value: statsData?.dueForReview ?? 0, icon: RotateCcw,   color: 'from-amber-400 to-orange-500' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-black text-slate-800">{s.value}</div>
              <div className="text-slate-400 text-xs">{s.label}</div>
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

        {/* Start Review CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between gap-4">
            <div>
              <div className="font-black text-lg mb-0.5">
                {(statsData?.dueForReview ?? 0) > 0 ? 'Daily Review Ready' : 'All Caught Up!'}
              </div>
              <div className="text-orange-100 text-sm">
                {(statsData?.dueForReview ?? 0) > 0
                  ? `${statsData.dueForReview} cards due · +2 XP per card`
                  : 'No due cards — jump in for extra practice anytime'}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => startFlashcards('all')}
              className="bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-orange-50 transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <Brain className="w-4 h-4" />
              {(statsData?.dueForReview ?? 0) > 0 ? 'Review Now' : 'Practice'}
            </motion.button>
          </div>
        </motion.div>

        {/* Categories grid */}
        <div>
          <h2 className="text-base font-black text-slate-800 mb-3">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => {
              const count = cat.id === 'all'
                ? (categoryCounts ?? []).reduce((s, c) => s + c.count, 0)
                : (categoryCounts ?? []).find((c) => c.category === cat.id)?.count ?? null;
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
      </div>
    );
  }

  // ── FLASHCARD VIEW ───────────────────────────────────────────────────────────
  // Wait for both queries — prevents flash of "No words found" during fetch
  const isLoading = loadingCards || (srsCards.length === 0 && loadingWords);

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={goBack} className="text-slate-400 hover:text-slate-700 transition-colors text-sm flex items-center gap-1">
          ← Back
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-slate-800 font-bold truncate">
            {CATEGORIES.find((c) => c.id === category)?.emoji}{' '}
            {CATEGORIES.find((c) => c.id === category)?.label || 'All Words'}
          </div>
          <div className="text-slate-400 text-xs">
            {level !== 'all' && <span className="text-blue-500 font-semibold mr-1">{level}</span>}
            {goodCount} correct · +{goodCount * 2} XP earned
          </div>
        </div>
        <button
          onClick={() => { setCardIdx(0); setGoodCount(0); }}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-600 text-xs transition-colors"
          title="Restart deck"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
        <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
          <Star className="w-4 h-4 text-amber-400" />
          {(user?.totalXP || 0).toLocaleString()}
        </div>
      </div>

      {/* Card area */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {isLoading || allCards.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="w-10 h-10 border-[3px] border-amber-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 text-sm">Loading cards...</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
