'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Trophy, Zap, RotateCcw } from 'lucide-react';

const LESSON_DATA: Record<string, {
  title: string;
  xp: number;
  slides: { type: 'info' | 'quiz'; content?: string; word?: string; translation?: string; question?: string; options?: string[]; correct?: number }[];
}> = {
  '1': {
    title: 'Greetings & Introductions',
    xp: 20,
    slides: [
      { type: 'info', content: 'In Finnish, greetings change based on the time of day and formality level.', word: 'Hei', translation: 'Hi / Hello (informal)' },
      { type: 'info', word: 'Hyvää huomenta', translation: 'Good morning', content: 'Used until around 10am. Literally means "good morning".' },
      { type: 'info', word: 'Hyvää päivää', translation: 'Good day / Good afternoon', content: 'Used from morning until evening in formal situations.' },
      { type: 'info', word: 'Hyvää iltaa', translation: 'Good evening', content: 'Used in the evenings, roughly after 6pm.' },
      { type: 'info', word: 'Näkemiin', translation: 'Goodbye (formal)', content: 'Used in formal contexts. Literally "until we see each other".' },
      { type: 'info', word: 'Heippa / Moi moi', translation: 'Bye (informal)', content: 'Very casual goodbye, used with friends.' },
      { type: 'quiz', question: 'How do you say "Good morning" in Finnish?', options: ['Hyvää iltaa', 'Hyvää huomenta', 'Hyvää päivää', 'Näkemiin'], correct: 1 },
      { type: 'quiz', question: 'What does "Näkemiin" mean?', options: ['Good morning', 'Hello', 'Goodbye (formal)', 'Good night'], correct: 2 },
      { type: 'quiz', question: 'Which greeting would you use at 3pm?', options: ['Hyvää huomenta', 'Hyvää iltaa', 'Hyvää yötä', 'Hyvää päivää'], correct: 3 },
      { type: 'quiz', question: '"Heippa" is a...', options: ['Formal greeting', 'Informal goodbye', 'Formal goodbye', 'Morning greeting'], correct: 1 },
    ],
  },
  '7': {
    title: 'Verb Conjugation: To Be',
    xp: 25,
    slides: [
      { type: 'info', content: 'The Finnish verb "olla" means "to be". It conjugates based on the subject pronoun.', word: 'olla', translation: 'to be' },
      { type: 'info', word: 'Minä olen', translation: 'I am', content: 'First person singular. Often shortened to just "olen" in speech.' },
      { type: 'info', word: 'Sinä olet', translation: 'You are (singular)', content: 'Second person singular. Casual "you".' },
      { type: 'info', word: 'Hän on', translation: 'He/She is', content: 'Finnish has only one word for he and she: "hän".' },
      { type: 'info', word: 'Me olemme', translation: 'We are', content: 'First person plural.' },
      { type: 'info', word: 'Te olette', translation: 'You are (plural)', content: 'Also used as formal "you" singular.' },
      { type: 'info', word: 'He ovat', translation: 'They are', content: 'Third person plural.' },
      { type: 'quiz', question: 'How do you say "I am" in Finnish?', options: ['Sinä olet', 'Hän on', 'Minä olen', 'Me olemme'], correct: 2 },
      { type: 'quiz', question: 'Finnish "hän" means...', options: ['He only', 'She only', 'They', 'He or She'], correct: 3 },
      { type: 'quiz', question: '"Te olette" means?', options: ['I am', 'You are (singular)', 'We are', 'You are (plural/formal)'], correct: 3 },
    ],
  },
};

const DEFAULT_LESSON = {
  title: 'Finnish Lesson',
  xp: 30,
  slides: [
    { type: 'info' as const, word: 'Suomi', translation: 'Finland / Finnish language', content: 'Suomi is both the Finnish word for "Finland" (the country) and the Finnish language itself.' },
    { type: 'info' as const, word: 'Kiitos', translation: 'Thank you', content: 'One of the most important words! Finns use kiitos often in daily life.' },
    { type: 'info' as const, word: 'Ole hyvä', translation: 'You\'re welcome', content: 'The response to kiitos. Literally "be good".' },
    { type: 'info' as const, word: 'Anteeksi', translation: 'Excuse me / Sorry', content: 'Used for both apologizing and getting attention.' },
    { type: 'quiz' as const, question: 'What does "Kiitos" mean?', options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'], correct: 2 },
    { type: 'quiz' as const, question: '"Anteeksi" means...', options: ['Thank you', 'Excuse me', 'Goodbye', 'Good morning'], correct: 1 },
    { type: 'quiz' as const, question: 'How do you say "You\'re welcome" in Finnish?', options: ['Kiitos', 'Ole hyvä', 'Anteeksi', 'Hei'], correct: 1 },
  ],
};

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params?.id as string;
  const lesson = LESSON_DATA[lessonId] || DEFAULT_LESSON;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);

  const slide = lesson.slides[currentSlide];
  const isLast = currentSlide === lesson.slides.length - 1;
  const quizSlides = lesson.slides.filter((s) => s.type === 'quiz');
  const quizAnswers = lesson.slides.reduce((acc, s, i) => {
    if (s.type === 'quiz') acc.push({ slide: i, answer: answers[i] ?? null, correct: s.correct ?? 0 });
    return acc;
  }, [] as { slide: number; answer: number | null; correct: number }[]);
  const correctCount = quizAnswers.filter((q) => q.answer === q.correct).length;
  const score = quizSlides.length > 0 ? Math.round((correctCount / quizSlides.length) * 100) : 100;

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const newAnswers = [...answers];
    newAnswers[currentSlide] = idx;
    setAnswers(newAnswers);
    setTimeout(() => {
      if (isLast) { setCompleted(true); } else { setCurrentSlide((s) => s + 1); setSelected(null); }
    }, 1000);
  };

  const next = () => {
    if (isLast) { setCompleted(true); return; }
    setCurrentSlide((s) => s + 1);
    setSelected(null);
  };

  const restart = () => { setCurrentSlide(0); setAnswers([]); setSelected(null); setCompleted(false); };

  if (completed) {
    return (
      <div className="max-w-md mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
            className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
            <Trophy className="w-10 h-10 text-amber-500" />
          </motion.div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">Lesson Complete!</h2>
          <p className="text-slate-500 text-sm mb-5">{lesson.title}</p>
          {quizSlides.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <div className="text-3xl font-black text-slate-800 mb-1">{score}%</div>
              <div className="text-slate-400 text-sm">{correctCount}/{quizSlides.length} quiz questions correct</div>
            </div>
          )}
          <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-lg mb-6">
            <Zap className="w-5 h-5 text-amber-500" />+{lesson.xp} XP Earned!
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
          <div className="text-slate-400 text-xs">{currentSlide + 1} / {lesson.slides.length}</div>
        </div>
        <div className="text-amber-600 text-sm font-bold flex items-center gap-1">
          <Zap className="w-4 h-4 text-amber-400" />+{lesson.xp} XP
        </div>
      </div>

      {/* Progress bar */}
      <div className="xp-bar">
        <motion.div
          className="xp-bar-fill"
          animate={{ width: `${((currentSlide + 1) / lesson.slides.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          {slide.type === 'info' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center space-y-4 min-h-64 flex flex-col items-center justify-center">
              {slide.word && (
                <div className="text-4xl font-black text-slate-800 tracking-tight">{slide.word}</div>
              )}
              {slide.translation && (
                <div className="text-lg font-semibold gradient-text">{slide.translation}</div>
              )}
              {slide.content && (
                <p className="text-slate-500 text-sm max-w-xs leading-6">{slide.content}</p>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={next}
                className="btn-primary px-8 py-3 text-sm mt-2 flex items-center gap-2"
              >
                {isLast ? 'Finish' : 'Continue'} <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          )}

          {slide.type === 'quiz' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              <div className="text-center">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-2">Quiz</div>
                <h3 className="text-slate-800 font-bold text-xl">{slide.question}</h3>
              </div>
              <div className="space-y-2.5">
                {slide.options?.map((opt, idx) => {
                  const isCorrect = idx === slide.correct;
                  const isSelected = selected === idx;
                  return (
                    <motion.button
                      key={idx}
                      whileHover={selected === null ? { x: 4 } : {}}
                      whileTap={selected === null ? { scale: 0.99 } : {}}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                        selected === null
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
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                        selected === null ? 'bg-slate-100 text-slate-500' :
                        isSelected && isCorrect ? 'bg-emerald-400 text-white' :
                        isSelected && !isCorrect ? 'bg-red-400 text-white' :
                        isCorrect ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-400'
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
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
