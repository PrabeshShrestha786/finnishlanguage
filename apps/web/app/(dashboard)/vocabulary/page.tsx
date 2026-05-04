'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Volume2, RotateCcw, CheckCircle2, XCircle, Star, Zap, BookOpen, Brain, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '📚' },
  { id: 'greetings', label: 'Greetings', emoji: '👋' },
  { id: 'food', label: 'Food', emoji: '🍕' },
  { id: 'travel', label: 'Travel', emoji: '✈️' },
  { id: 'emotions', label: 'Emotions', emoji: '❤️' },
  { id: 'body', label: 'Body', emoji: '🫀' },
  { id: 'work', label: 'Work', emoji: '💼' },
  { id: 'nature', label: 'Nature', emoji: '🌲' },
  { id: 'numbers', label: 'Numbers', emoji: '🔢' },
  { id: 'colors', label: 'Colors', emoji: '🎨' },
];

const DEMO_WORDS = [
  { id: '1', finnish: 'Hyvä', english: 'Good / Great', pronunciation: 'HÜ-vä', category: 'greetings', exampleSentence: 'Hyvä päivä! — Have a good day!', level: 'A1' },
  { id: '2', finnish: 'Talvi', english: 'Winter', pronunciation: 'TAL-vi', category: 'nature', exampleSentence: 'Suomen talvi on kylmä. — Finnish winter is cold.', level: 'A1' },
  { id: '3', finnish: 'Rakastan', english: 'I love', pronunciation: 'RA-kas-tan', category: 'emotions', exampleSentence: 'Rakastan kahvia. — I love coffee.', level: 'A1' },
  { id: '4', finnish: 'Kauppa', english: 'Shop / Store', pronunciation: 'KAUP-pa', category: 'travel', exampleSentence: 'Missä on kauppa? — Where is the shop?', level: 'A1' },
  { id: '5', finnish: 'Metsä', english: 'Forest', pronunciation: 'MET-sä', category: 'nature', exampleSentence: 'Suomessa on paljon metsiä. — Finland has many forests.', level: 'A1' },
];

type View = 'categories' | 'flashcard' | 'quiz';
type CardSide = 'front' | 'back';

function FlashCard({ word, onKnow, onStudyMore }: {
  word: typeof DEMO_WORDS[0];
  onKnow: () => void;
  onStudyMore: () => void;
}) {
  const [side, setSide] = useState<CardSide>('front');

  const speak = () => {
    const u = new SpeechSynthesisUtterance(word.finnish);
    u.lang = 'fi-FI'; u.rate = 0.8;
    window.speechSynthesis.speak(u);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        className="cursor-pointer w-full max-w-sm"
        onClick={() => setSide(side === 'front' ? 'back' : 'front')}
        style={{ perspective: '1000px' }}
      >
        <motion.div
          animate={{ rotateY: side === 'back' ? 180 : 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d', position: 'relative', height: 240 }}
        >
          {/* Front */}
          <div className="absolute inset-0 glass-card rounded-3xl p-8 flex flex-col items-center justify-center bg-gradient-to-br from-finn-950/60 to-aurora-purple/10 border border-finn-500/20" style={{ backfaceVisibility: 'hidden' }}>
            <div className="text-5xl font-black text-white mb-3">{word.finnish}</div>
            <div className="font-mono text-slate-500 text-sm mb-4">{word.pronunciation}</div>
            <button onClick={(e) => { e.stopPropagation(); speak(); }}
              className="flex items-center gap-2 text-aurora-green hover:text-aurora-green/80 text-sm">
              <Volume2 className="w-4 h-4" /> Listen
            </button>
            <p className="text-slate-600 text-xs mt-6">Tap to reveal translation</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 glass-card rounded-3xl p-8 flex flex-col items-center justify-center bg-gradient-to-br from-aurora-green/10 to-teal-500/5 border border-aurora-green/20" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
            <div className="text-3xl font-black text-aurora-green mb-2">{word.english}</div>
            <div className="text-slate-400 text-sm text-center italic mb-4">&quot;{word.exampleSentence}&quot;</div>
            <div className="text-xs text-slate-500 bg-white/5 px-3 py-1.5 rounded-full">
              Level {word.level} · {word.category}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {side === 'back' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
            className="flex gap-4 w-full max-w-sm">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onStudyMore}
              className="flex-1 py-4 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-400 font-bold flex items-center justify-center gap-2 hover:border-red-500/60 transition-all">
              <XCircle className="w-5 h-5" /> Study More
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={onKnow}
              className="flex-1 py-4 rounded-2xl border border-aurora-green/40 bg-aurora-green/10 text-aurora-green font-bold flex items-center justify-center gap-2 hover:border-aurora-green/60 transition-all">
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
  const [known, setKnown] = useState(0);
  const { user } = useAuthStore();

  const { data: statsData } = useQuery({
    queryKey: ['vocab-stats'],
    queryFn: () => api.get('/vocabulary/stats').then((r) => r.data.data),
  });

  const mutation = useMutation({
    mutationFn: ({ wordId, quality }: { wordId: string; quality: number }) =>
      api.post('/vocabulary/review', { wordId, quality }).then((r) => r.data.data),
  });

  const words = DEMO_WORDS;
  const currentWord = words[cardIdx];

  const handleKnow = () => {
    setKnown((k) => k + 1);
    mutation.mutate({ wordId: currentWord.id, quality: 4 });
    if (cardIdx < words.length - 1) {
      setCardIdx((i) => i + 1);
    } else {
      toast.success(`Great job! You reviewed ${words.length} words! +${words.length * 2} XP 🎉`);
      setCardIdx(0);
      setKnown(0);
    }
  };

  const handleStudyMore = () => {
    mutation.mutate({ wordId: currentWord.id, quality: 1 });
    if (cardIdx < words.length - 1) setCardIdx((i) => i + 1);
    else setCardIdx(0);
  };

  if (view === 'categories') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Vocabulary Builder</h1>
              <p className="text-slate-400 text-sm">Spaced repetition · 5000+ Finnish words</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Studied', value: statsData?.totalStudied || 0, icon: BookOpen, color: 'from-finn-500 to-finn-700' },
            { label: 'Learned', value: statsData?.learned || 0, icon: CheckCircle2, color: 'from-aurora-green to-teal-500' },
            { label: 'Due for Review', value: statsData?.dueForReview || 0, icon: RotateCcw, color: 'from-aurora-yellow to-orange-500' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-3xl p-4 text-center">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2`}>
                <s.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-black text-white mb-4">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => { setCategory(cat.id); setView('flashcard'); setCardIdx(0); }}
                className="glass-card rounded-2xl p-4 flex flex-col items-center gap-2 card-hover border border-white/5 hover:border-aurora-yellow/30"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <span className="text-white text-xs font-semibold">{cat.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Daily Words */}
        <div className="glass-card rounded-3xl p-6 bg-vocab">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-aurora-yellow" /> Daily Words
            </h2>
            <span className="text-xs text-slate-500">Resets midnight</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {DEMO_WORDS.slice(0, 5).map((w) => (
              <div key={w.id} className="glass-light rounded-2xl p-3 text-center border border-white/8">
                <div className="text-white font-bold text-sm">{w.finnish}</div>
                <div className="text-slate-400 text-xs mt-1">{w.english}</div>
              </div>
            ))}
          </div>
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => setView('flashcard')}
            className="btn-aurora w-full mt-5 py-3 font-bold text-nordic-dark flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4" /> Start Daily Review
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div className="flex items-center gap-3">
        <button onClick={() => setView('categories')} className="btn-secondary px-4 py-2 text-sm">← Back</button>
        <div>
          <h1 className="text-xl font-black text-white">Flashcards</h1>
          <p className="text-slate-400 text-sm">{cardIdx + 1} of {words.length} · {known} known</p>
        </div>
      </div>

      {/* Progress */}
      <div className="xp-bar">
        <div className="xp-bar-fill transition-all duration-500" style={{ width: `${(cardIdx / words.length) * 100}%` }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={cardIdx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          {currentWord && (
            <FlashCard word={currentWord} onKnow={handleKnow} onStudyMore={handleStudyMore} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
