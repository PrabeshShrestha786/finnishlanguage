'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy, Zap, RotateCcw, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type InfoSlide = { kind: 'info'; word?: string; translation?: string; content?: string };
type QuizSlide = {
  kind: 'quiz';
  exerciseId: string;
  question: string;
  options: string[];
  correctIndex: number;
  correctText?: string;
  hint?: string;
  fillBlank?: boolean;
  explanation?: string;
  points: number;
};
type Slide = InfoSlide | QuizSlide;

function buildSlides(lesson: any): Slide[] {
  const slides: Slide[] = [];

  // Info slides from lesson content
  const contentSlides: any[] = lesson.content?.slides || [];
  for (const s of contentSlides) {
    slides.push({ kind: 'info', word: s.word, translation: s.translation, content: s.content });
  }

  // Quiz slides from exercises
  for (const ex of lesson.exercises || []) {
    if (ex.type === 'MCQ') {
      const choices: string[] = ex.options?.choices || [];
      slides.push({
        kind: 'quiz',
        exerciseId: ex.id,
        question: ex.question,
        options: choices,
        correctIndex: ex.correctAnswer?.index ?? 0,
        explanation: ex.explanation,
        points: ex.points,
      });
    } else if (ex.type === 'FILL_BLANK') {
      const choices: string[] = ex.options?.choices || [];
      if (choices.length > 0) {
        // Has word-bank choices — render like MCQ
        slides.push({
          kind: 'quiz',
          exerciseId: ex.id,
          question: ex.question,
          options: choices,
          correctIndex: ex.correctAnswer?.index ?? 0,
          correctText: ex.correctAnswer?.value,
          explanation: ex.explanation,
          points: ex.points,
        });
      } else {
        // Free-text answer
        slides.push({
          kind: 'quiz',
          exerciseId: ex.id,
          question: ex.question,
          options: [],
          correctIndex: 0,
          correctText: ex.correctAnswer?.value,
          hint: ex.options?.hint,
          fillBlank: true,
          explanation: ex.explanation,
          points: ex.points,
        });
      }
    }
  }

  return slides;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;
  const { user, updateUser, refreshUser } = useAuthStore();

  const [currentSlide, setCurrentSlide] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [textInput, setTextInput] = useState('');
  const [textSubmitted, setTextSubmitted] = useState(false);
  const [results, setResults] = useState<{ correct: boolean; xpEarned: number }[]>([]);
  const [completed, setCompleted] = useState(false);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const startTimeRef = useRef(Date.now());

  const { data: lesson, isLoading, error } = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => api.get(`/lessons/${lessonId}`).then((r) => r.data.data),
    enabled: !!lessonId,
  });

  const attemptMutation = useMutation({
    mutationFn: (body: { exerciseId: string; answer: any; timeSpentSec: number }) =>
      api.post(`/lessons/${lessonId}/attempt`, body).then((r) => r.data.data),
  });

  const completeMutation = useMutation({
    mutationFn: (score: number) => {
      const timeSpentSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
      return api.post(`/lessons/${lessonId}/attempt`, { answer: { score, completed: true }, timeSpentSec }).then((r) => r.data.data);
    },
    onSuccess: (data) => {
      const earned = data?.xpEarned || 0;
      setTotalXpEarned((prev) => prev + earned);
      updateUser({ totalXP: (user?.totalXP || 0) + totalXpEarned + earned });
      setCompleted(true);
      // Refresh user so streak + XP in header reflect DB values
      refreshUser();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-slate-500">Lesson not found.</p>
        <button onClick={() => router.push('/lessons')} className="btn-primary px-6 py-2 text-sm">Back to Lessons</button>
      </div>
    );
  }

  const slides = buildSlides(lesson);
  const slide = slides[currentSlide];
  const isLast = currentSlide === slides.length - 1;
  const quizSlides = slides.filter((s) => s.kind === 'quiz') as QuizSlide[];
  const correctCount = results.filter((r) => r.correct).length;
  const score = quizSlides.length > 0 ? Math.round((correctCount / quizSlides.length) * 100) : 100;

  const advanceSlide = (isCorrect: boolean, xpEarned: number, newResults: { correct: boolean; xpEarned: number }[]) => {
    setTimeout(() => {
      if (isLast) {
        const finalScore = quizSlides.length > 0
          ? Math.round((newResults.filter((r) => r.correct).length / quizSlides.length) * 100)
          : 100;
        completeMutation.mutate(finalScore);
      } else {
        setCurrentSlide((s) => s + 1);
        setSelected(null);
        setTextInput('');
        setTextSubmitted(false);
      }
    }, 1200);
  };

  const handleAnswer = async (idx: number) => {
    if (selected !== null || slide.kind !== 'quiz') return;
    setSelected(idx);

    const quizSlide = slide as QuizSlide;
    const isCorrect = idx === quizSlide.correctIndex;
    const answer = { index: idx, value: quizSlide.options[idx] };
    const timeSpentSec = Math.floor((Date.now() - startTimeRef.current) / 1000);

    let xpEarned = 0;
    try {
      const res = await attemptMutation.mutateAsync({ exerciseId: quizSlide.exerciseId, answer, timeSpentSec });
      xpEarned = res?.xpEarned || 0;
      if (xpEarned > 0) {
        setTotalXpEarned((prev) => prev + xpEarned);
        updateUser({ totalXP: (user?.totalXP || 0) + xpEarned });
      }
    } catch {}

    const newResults = [...results, { correct: isCorrect, xpEarned }];
    setResults(newResults);
    advanceSlide(isCorrect, xpEarned, newResults);
  };

  const handleTextSubmit = async () => {
    if (textSubmitted || slide.kind !== 'quiz') return;
    const quizSlide = slide as QuizSlide;
    const isCorrect = textInput.trim().toLowerCase() === (quizSlide.correctText || '').toLowerCase();
    const answer = { value: textInput.trim() };
    const timeSpentSec = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setTextSubmitted(true);

    let xpEarned = 0;
    try {
      const res = await attemptMutation.mutateAsync({ exerciseId: quizSlide.exerciseId, answer, timeSpentSec });
      xpEarned = res?.xpEarned || 0;
      if (xpEarned > 0) {
        setTotalXpEarned((prev) => prev + xpEarned);
        updateUser({ totalXP: (user?.totalXP || 0) + xpEarned });
      }
    } catch {}

    const newResults = [...results, { correct: isCorrect, xpEarned }];
    setResults(newResults);
    advanceSlide(isCorrect, xpEarned, newResults);
  };

  const next = () => {
    if (isLast) {
      completeMutation.mutate(score);
    } else {
      setCurrentSlide((s) => s + 1);
      setSelected(null);
      setTextInput('');
      setTextSubmitted(false);
    }
  };

  const restart = () => {
    setCurrentSlide(0);
    setSelected(null);
    setTextInput('');
    setTextSubmitted(false);
    setResults([]);
    setCompleted(false);
    setTotalXpEarned(0);
    startTimeRef.current = Date.now();
  };

  if (completed) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-10 h-10 text-amber-500" />
          </motion.div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">Lesson Complete!</h2>
          <p className="text-slate-500 text-sm mb-5">{lesson.title}</p>
          {quizSlides.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="text-3xl font-black text-slate-800 mb-1">{score}%</div>
              <div className="text-slate-400 text-sm">{correctCount}/{quizSlides.length} questions correct</div>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-lg mb-6">
            <Zap className="w-5 h-5 text-amber-500" />+{totalXpEarned} XP Earned!
          </div>
          <div className="flex gap-3">
            <button onClick={restart} className="btn-secondary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" /> Restart
            </button>
            <button onClick={() => router.push('/lessons')} className="btn-primary flex-1 py-2.5 text-sm">
              Back to Lessons
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/lessons')} className="text-slate-400 hover:text-slate-700 transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="text-slate-800 font-bold text-sm">{lesson.title}</div>
          <div className="text-slate-400 text-xs">{currentSlide + 1} / {slides.length}</div>
        </div>
        <div className="text-amber-600 text-sm font-bold flex items-center gap-1">
          <Zap className="w-4 h-4 text-amber-400" />+{lesson.xpReward} XP
        </div>
      </div>

      {/* Progress bar */}
      <div className="xp-bar">
        <motion.div className="xp-bar-fill"
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.4 }} />
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div key={currentSlide} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>

          {slide.kind === 'info' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-4 min-h-64 flex flex-col items-center justify-center">
              {slide.word && <div className="text-4xl font-black text-slate-800 tracking-tight">{slide.word}</div>}
              {slide.translation && <div className="text-lg font-semibold gradient-text">{slide.translation}</div>}
              {slide.content && <p className="text-slate-500 text-sm max-w-xs leading-6">{slide.content}</p>}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={next}
                className="btn-primary px-8 py-3 text-sm mt-2 flex items-center gap-2">
                {isLast ? 'Finish' : 'Continue'} <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {slide.kind === 'quiz' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <div className="text-center">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">
                  {slide.fillBlank ? 'Fill in the Blank' : 'Quiz'}
                </div>
                <h3 className="text-slate-800 font-bold text-xl">{slide.question}</h3>
              </div>

              {/* Fill-in-the-blank text input */}
              {slide.fillBlank ? (
                <div className="space-y-3">
                  {slide.hint && !textSubmitted && (
                    <p className="text-slate-400 text-xs text-center italic">{slide.hint}</p>
                  )}
                  <div className={`flex gap-2 rounded-xl border-2 p-1 transition-all ${
                    !textSubmitted ? 'border-slate-200 focus-within:border-blue-400'
                    : textInput.trim().toLowerCase() === (slide.correctText || '').toLowerCase()
                      ? 'border-emerald-400 bg-emerald-50'
                      : 'border-red-400 bg-red-50'
                  }`}>
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !textSubmitted && textInput.trim() && handleTextSubmit()}
                      disabled={textSubmitted}
                      placeholder="Type your answer…"
                      className="flex-1 px-3 py-3 text-slate-800 font-semibold bg-transparent outline-none placeholder:text-slate-300 text-base"
                      autoFocus
                    />
                    {!textSubmitted ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                        onClick={handleTextSubmit}
                        disabled={!textInput.trim()}
                        className="px-5 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Check
                      </motion.button>
                    ) : (
                      <div className="flex items-center px-3">
                        {textInput.trim().toLowerCase() === (slide.correctText || '').toLowerCase()
                          ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                          : <XCircle className="w-6 h-6 text-red-500" />}
                      </div>
                    )}
                  </div>
                  {textSubmitted && textInput.trim().toLowerCase() !== (slide.correctText || '').toLowerCase() && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-emerald-700 font-semibold">
                      Correct answer: <span className="font-black">{slide.correctText}</span>
                    </motion.div>
                  )}
                </div>
              ) : (
                /* Multiple-choice options */
                <div className="space-y-2.5">
                  {slide.options.map((opt, idx) => {
                    const isCorrect = idx === slide.correctIndex;
                    const isSelected = selected === idx;
                    return (
                      <motion.button key={idx} whileHover={selected === null ? { x: 4 } : {}}
                        whileTap={selected === null ? { scale: 0.99 } : {}}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          selected === null
                            ? 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700'
                            : isSelected && isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : isSelected && !isCorrect ? 'border-red-400 bg-red-50 text-red-700'
                            : isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}>
                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                          selected === null ? 'bg-slate-100 text-slate-500'
                          : isSelected && isCorrect ? 'bg-emerald-400 text-white'
                          : isSelected && !isCorrect ? 'bg-red-400 text-white'
                          : isCorrect ? 'bg-emerald-400 text-white'
                          : 'bg-slate-100 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium">{opt}</span>
                        {selected !== null && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto" />}
                        {selected !== null && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 ml-auto" />}
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {(selected !== null || textSubmitted) && slide.explanation && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
                  {slide.explanation}
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
