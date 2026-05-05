'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Volume2, RotateCcw, CheckCircle2, XCircle, Brain, Zap, BookOpen, Star, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all',       label: 'All Words',  emoji: '📚' },
  { id: 'Greetings', label: 'Greetings',  emoji: '👋' },
  { id: 'Food & Drink', label: 'Food',    emoji: '🍽️' },
  { id: 'Travel',    label: 'Travel',     emoji: '✈️' },
  { id: 'Family',    label: 'Family',     emoji: '👨‍👩‍👧' },
  { id: 'Work',      label: 'Work',       emoji: '💼' },
  { id: 'Nature',    label: 'Nature',     emoji: '🌲' },
  { id: 'Numbers',   label: 'Numbers',    emoji: '🔢' },
  { id: 'Colors',    label: 'Colors',     emoji: '🎨' },
  { id: 'Verbs',     label: 'Verbs',      emoji: '⚡' },
];

type View = 'categories' | 'flashcard';

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

function FlashCard({ word, onKnow, onStudyMore, index, total }: {
  word: Word; onKnow: () => void; onStudyMore: () => void; index: number; total: number;
}) {
  const [flipped, setFlipped] = useState(false);

  const speak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const u = new SpeechSynthesisUtterance(word.finnish);
    u.lang = 'fi-FI'; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  // Reset flip when word changes
  const key = word.id;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Progress */}
      <div className="w-full flex items-center justify-between text-sm text-slate-400 mb-1">
        <span>{index + 1} of {total}</span>
        <div className="flex gap-1">
          {Array.from({ length: Math.min(total, 10) }).map((_, i) => (
            <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i <= index ? 'bg-amber-400' : 'bg-slate-200'}`} />
          ))}
        </div>
      </div>

      {/* Card */}
      <motion.div
        key={key}
        className="cursor-pointer w-full max-w-sm"
        onClick={() => setFlipped((f) => !f)}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', height: 260 }}
        >
          {/* Front */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl" style={{ backfaceVisibility: 'hidden' }}>
            <div className="text-5xl font-black text-white mb-3 tracking-tight">{word.finnish}</div>
            {word.pronunciation && (
              <div className="text-blue-200 font-mono text-sm mb-4">[{word.pronunciation}]</div>
            )}
            <button onClick={speak} className="flex items-center gap-2 text-blue-200 hover:text-white text-sm transition-colors">
              <Volume2 className="w-4 h-4" /> Listen
            </button>
            <p className="text-blue-300 text-xs mt-6 opacity-70">Tap to reveal translation</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 bg-white rounded-3xl p-8 flex flex-col items-center justify-center shadow-xl border border-slate-100" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="text-3xl font-black text-slate-800 mb-2">{word.english}</div>
            {word.exampleSentence && (
              <div className="text-center mt-3">
                <p className="text-slate-600 text-sm italic">&ldquo;{word.exampleSentence}&rdquo;</p>
                {word.exampleTranslation && (
                  <p className="text-slate-400 text-xs mt-1">&ldquo;{word.exampleTranslation}&rdquo;</p>
                )}
              </div>
            )}
            <div className="mt-4 flex items-center gap-2 flex-wrap justify-center">
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full font-semibold">
                {word.level}
              </span>
              {word.category && (
                <span className="text-xs bg-slate-50 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-full">
                  {word.category}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Action buttons — only show when flipped */}
      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex gap-4 w-full max-w-sm"
          >
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onStudyMore}
              className="flex-1 py-4 rounded-2xl border-2 border-red-200 bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2 hover:border-red-300 hover:bg-red-100 transition-all"
            >
              <XCircle className="w-5 h-5" /> Study More
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onKnow}
              className="flex-1 py-4 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center gap-2 hover:border-emerald-300 hover:bg-emerald-100 transition-all"
            >
              <CheckCircle2 className="w-5 h-5" /> I Know It!
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VocabularyPage() {
  const [view, setView] = useState<View>('categories');
  const [category, setCategory] = useState('all');
  const [cardIdx, setCardIdx] = useState(0);
  const [knownCount, setKnownCount] = useState(0);
  const { user, updateUser } = useAuthStore();
  const queryClient = useQueryClient();

  // Load stats
  const { data: statsData } = useQuery({
    queryKey: ['vocab-stats'],
    queryFn: () => api.get('/vocabulary/stats').then((r) => r.data.data).catch(() => null),
    staleTime: 30_000,
  });

  // Load flashcards (due + new words)
  const { data: flashcardData, isLoading: loadingCards } = useQuery({
    queryKey: ['vocab-flashcards', category],
    queryFn: () => api.get('/vocabulary/flashcards', {
      params: { limit: 20 }
    }).then((r) => r.data.data).catch(() => null),
    enabled: view === 'flashcard',
    staleTime: 60_000,
  });

  // Load words by category for browsing
  const { data: wordsData } = useQuery({
    queryKey: ['vocab-words', category],
    queryFn: () => api.get('/vocabulary', {
      params: category !== 'all' ? { category } : {}
    }).then((r) => r.data.data).catch(() => null),
    enabled: view === 'flashcard',
    staleTime: 60_000,
  });

  // Review mutation
  const reviewMutation = useMutation({
    mutationFn: ({ wordId, quality }: { wordId: string; quality: number }) =>
      api.post('/vocabulary/review', { wordId, quality }).then((r) => r.data.data),
    onSuccess: (data, variables) => {
      if (variables.quality >= 3) {
        updateUser({ totalXP: (user?.totalXP || 0) + 2 });
      }
      queryClient.invalidateQueries({ queryKey: ['vocab-stats'] });
    },
  });

  // Merge due flashcards and new words into one list
  const allCards: Word[] = (() => {
    if (!flashcardData && !wordsData) return [];
    if (flashcardData) {
      const fromProgress: Word[] = (flashcardData.flashcards || []).map((p: any) => ({
        id: p.wordId || p.word?.id,
        finnish: p.word?.finnish,
        english: p.word?.english,
        pronunciation: p.word?.pronunciation,
        exampleSentence: p.word?.exampleSentence,
        exampleTranslation: p.word?.exampleTranslation,
        category: p.word?.category,
        level: p.word?.level,
      })).filter((w: Word) => w.finnish);
      const fromNew: Word[] = (flashcardData.newWords || []).map((w: any) => ({
        id: w.id, finnish: w.finnish, english: w.english,
        pronunciation: w.pronunciation, exampleSentence: w.exampleSentence,
        exampleTranslation: w.exampleTranslation, category: w.category, level: w.level,
      }));
      return [...fromProgress, ...fromNew];
    }
    // fallback: use words from category query
    return (wordsData?.words || []).map((w: any) => ({
      id: w.id, finnish: w.finnish, english: w.english,
      pronunciation: w.pronunciation, exampleSentence: w.exampleSentence,
      exampleTranslation: w.exampleTranslation, category: w.category, level: w.level,
    }));
  })();

  const currentWord = allCards[cardIdx];

  const handleKnow = () => {
    if (!currentWord) return;
    reviewMutation.mutate({ wordId: currentWord.id, quality: 4 });
    setKnownCount((k) => k + 1);
    if (cardIdx < allCards.length - 1) {
      setCardIdx((i) => i + 1);
    } else {
      toast.success(`Session complete! ${knownCount + 1} words known · +${(knownCount + 1) * 2} XP 🎉`);
      queryClient.invalidateQueries({ queryKey: ['vocab-flashcards'] });
      queryClient.invalidateQueries({ queryKey: ['vocab-stats'] });
      setView('categories');
      setCardIdx(0);
      setKnownCount(0);
    }
  };

  const handleStudyMore = () => {
    if (!currentWord) return;
    reviewMutation.mutate({ wordId: currentWord.id, quality: 1 });
    if (cardIdx < allCards.length - 1) setCardIdx((i) => i + 1);
    else setCardIdx(0);
  };

  const startFlashcards = (cat: string) => {
    setCategory(cat);
    setView('flashcard');
    setCardIdx(0);
    setKnownCount(0);
  };

  // ── CATEGORIES VIEW ────────────────────────────────────────────────────────
  if (view === 'categories') {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Vocabulary Builder</h1>
            <p className="text-slate-500 text-sm mt-0.5">Spaced repetition · {wordsData?.total || 60}+ Finnish words</p>
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
            { label: 'Learned', value: statsData?.learned ?? 0, icon: CheckCircle2, color: 'from-emerald-400 to-teal-500' },
            { label: 'Due for Review', value: statsData?.dueForReview ?? 0, icon: RotateCcw, color: 'from-amber-400 to-orange-500' },
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

        {/* Start Review CTA */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
          <div className="relative flex items-center justify-between">
            <div>
              <div className="font-black text-xl mb-1">Start Daily Review</div>
              <div className="text-orange-100 text-sm">
                {(statsData?.dueForReview ?? 0) > 0
                  ? `${statsData.dueForReview} cards due · earn +2 XP per card`
                  : 'Browse all words to start learning'}
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => startFlashcards('all')}
              className="bg-white text-orange-600 font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-orange-50 transition-colors flex items-center gap-2 flex-shrink-0"
            >
              <Brain className="w-4 h-4" /> Review Now
            </motion.button>
          </div>
        </motion.div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-black text-slate-800 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => startFlashcards(cat.id)}
                className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-slate-700 text-xs font-semibold">{cat.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              </motion.button>
            ))}
          </div>
        </div>

        {/* XP info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-3">
          <Zap className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="text-sm text-blue-700">
            <span className="font-bold">+2 XP</span> for each word you know · Words use SM-2 spaced repetition to reappear at the optimal review time
          </div>
        </div>
      </div>
    );
  }

  // ── FLASHCARD VIEW ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => { setView('categories'); setCardIdx(0); setKnownCount(0); }}
          className="text-slate-400 hover:text-slate-700 transition-colors text-sm">
          ← Back
        </button>
        <div className="flex-1">
          <div className="text-slate-800 font-bold">
            {CATEGORIES.find((c) => c.id === category)?.label || 'All Words'}
          </div>
          <div className="text-slate-400 text-xs">{knownCount} known so far · +{knownCount * 2} XP</div>
        </div>
        <div className="flex items-center gap-1 text-amber-600 font-bold text-sm">
          <Star className="w-4 h-4 text-amber-400" />
          {(user?.totalXP || 0).toLocaleString()} XP
        </div>
      </div>

      {loadingCards || allCards.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
          {loadingCards ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm">Loading flashcards...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              <div className="text-slate-800 font-bold">All caught up!</div>
              <p className="text-slate-400 text-sm">No words due for review in this category.</p>
              <button onClick={() => setView('categories')} className="btn-primary px-6 py-2.5 text-sm mt-2">
                Back to Categories
              </button>
            </div>
          )}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={cardIdx}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.2 }}
          >
            <FlashCard
              word={currentWord}
              onKnow={handleKnow}
              onStudyMore={handleStudyMore}
              index={cardIdx}
              total={allCards.length}
            />
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
