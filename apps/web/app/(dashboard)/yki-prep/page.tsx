'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Trophy, Clock, Target, BookOpen, Play, ChevronRight, AlertCircle, CheckCircle2, XCircle, BarChart3, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const MOCK_EXAM = {
  title: 'YKI B1 Mock Exam — Reading Comprehension',
  level: 'B1',
  totalTime: 30 * 60,
  xpReward: 100,
  sections: [
    {
      id: 'reading',
      title: 'Reading Comprehension',
      passage: `Suomen luonto on ainutlaatuinen. Maassa on tuhansia järviä ja laajoja metsiä. Suomalaiset arvostavat luontoa suuresti. Monet viettävät kesälomansa mökillä, jossa he uivat järvessä ja nauttivat saunasta.

Sauna on tärkeä osa suomalaista kulttuuria. Lähes jokaisessa talossa on oma sauna. Suomalaiset saunovat viikoittain, usein lauantai-iltana. Saunassa on tapana puhua rauhallisesti ja rentoutua.`,
      questions: [
        { id: 'q1', question: 'What is Finland known for according to the text?', options: ['Mountains and deserts', 'Lakes and forests', 'Beaches and cities', 'Snow and ice only'], correct: 1, points: 5 },
        { id: 'q2', question: 'How often do Finns typically go to sauna?', options: ['Daily', 'Monthly', 'Weekly', 'Yearly'], correct: 2, points: 5 },
        { id: 'q3', question: 'What is the atmosphere in a Finnish sauna like?', options: ['Loud and energetic', 'Calm and relaxing', 'Formal and business-like', 'Competitive'], correct: 1, points: 5 },
      ],
    },
  ],
};

type ExamState = 'intro' | 'exam' | 'results';

export default function YkiPrepPage() {
  const { user, updateUser } = useAuthStore();
  const [state, setState] = useState<ExamState>('intro');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(MOCK_EXAM.totalTime);
  const [currentQ, setCurrentQ] = useState(0);

  const questions = MOCK_EXAM.sections[0].questions;
  const question = questions[currentQ];

  useEffect(() => {
    if (state !== 'exam') return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setState('results'); clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state]);

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const calcScore = () => questions.reduce((acc, q) => acc + (answers[q.id] === q.correct ? q.points : 0), 0);
  const maxScore = questions.reduce((a, q) => a + q.points, 0);

  const handleSubmit = () => {
    const score = calcScore();
    const passed = score >= maxScore * 0.6;
    if (passed) {
      updateUser({ totalXP: (user?.totalXP || 0) + MOCK_EXAM.xpReward });
      api.post('/users/xp', { xpEarned: MOCK_EXAM.xpReward, source: 'yki-prep' }).catch(() => {});
    }
    setState('results');
  };

  const score = calcScore();
  const passed = score >= maxScore * 0.6;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800">YKI Exam Preparation</h1>
          <p className="text-slate-500 text-sm">Official format mock tests · A2–C1 levels</p>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* ── INTRO ── */}
        {state === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="text-slate-800 font-bold mb-1">About YKI (Yleinen kielitutkinto)</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  YKI is Finland&apos;s official language proficiency test for non-native speakers. It&apos;s required for Finnish citizenship and many residency applications. FinnMate&apos;s mock tests follow the official format.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Time Limit', value: '30 min', icon: Clock, color: 'from-blue-500 to-indigo-600' },
                { label: 'Total Points', value: `${maxScore} pts`, icon: Target, color: 'from-emerald-400 to-teal-500' },
                { label: 'Pass Score', value: '60%', icon: Trophy, color: 'from-amber-400 to-orange-500' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2 shadow-sm`}>
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-slate-800 font-black text-xl">{s.value}</div>
                  <div className="text-slate-400 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" /> Available Mock Exams
              </h3>
              {[
                { label: 'A2 — Elementary', ready: false },
                { label: 'B1 — Intermediate', ready: true },
                { label: 'B2 — Upper-Intermediate', ready: false },
                { label: 'C1 — Advanced', ready: false },
              ].map(({ label, ready }) => (
                <div key={label} className={`flex items-center gap-4 p-4 rounded-xl mb-2 ${ready ? 'bg-blue-50 border border-blue-200' : 'bg-slate-50 border border-slate-100'}`}>
                  <div className={`text-sm font-semibold flex-1 ${ready ? 'text-blue-800' : 'text-slate-500'}`}>{label}</div>
                  {ready ? (
                    <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold">Ready</span>
                  ) : (
                    <span className="text-xs text-slate-400 px-2 py-0.5 rounded-full bg-slate-200">Coming soon</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Pass the mock exam (60%+) to earn <strong>+{MOCK_EXAM.xpReward} XP</strong></span>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => { setState('exam'); setTimeLeft(MOCK_EXAM.totalTime); setAnswers({}); setCurrentQ(0); }}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-base font-bold">
              <Play className="w-5 h-5 fill-current" />
              Start B1 Mock Exam
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* ── EXAM ── */}
        {state === 'exam' && (
          <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {/* Timer bar */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between">
              <div className="text-slate-700 font-semibold text-sm">{MOCK_EXAM.title}</div>
              <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-500' : 'text-emerald-600'}`}>
                <Clock className="w-5 h-5" />{formatTime(timeLeft)}
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex gap-1.5">
              {questions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                  answers[questions[i].id] !== undefined ? 'bg-emerald-400' : i === currentQ ? 'bg-blue-500' : 'bg-slate-200'
                }`} />
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
              {/* Passage */}
              <div>
                <div className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Reading Passage
                </div>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-slate-700 text-sm leading-7 whitespace-pre-line">
                  {MOCK_EXAM.sections[0].passage}
                </div>
              </div>

              {/* Question */}
              <div className="border-t border-slate-100 pt-5">
                <div className="text-blue-600 text-xs font-bold mb-2 uppercase tracking-wide">
                  Question {currentQ + 1} of {questions.length} · {question.points} points
                </div>
                <p className="text-slate-800 font-semibold text-base mb-4">{question.question}</p>
                <div className="space-y-2.5">
                  {question.options.map((opt, i) => (
                    <motion.button key={opt} whileHover={{ x: 3 }} whileTap={{ scale: 0.99 }}
                      onClick={() => setAnswers((a) => ({ ...a, [question.id]: i }))}
                      className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all ${
                        answers[question.id] === i
                          ? 'border-blue-400 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700'
                      }`}>
                      <span className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          answers[question.id] === i ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-300 text-slate-500'
                        }`}>{String.fromCharCode(65 + i)}</span>
                        {opt}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {currentQ > 0 && (
                <button onClick={() => setCurrentQ((i) => i - 1)} className="btn-secondary px-6 py-3 text-sm">← Previous</button>
              )}
              {currentQ < questions.length - 1 ? (
                <button onClick={() => setCurrentQ((i) => i + 1)} className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
                  Next Question <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={handleSubmit}
                  className="btn-aurora flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
                  Submit Exam <Trophy className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RESULTS ── */}
        {state === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
            <div className={`bg-white rounded-2xl border shadow-sm p-8 text-center ${passed ? 'border-emerald-200' : 'border-red-200'}`}>
              <div className="text-6xl mb-4">{passed ? '🎉' : '💪'}</div>
              <div className={`text-5xl font-black mb-2 ${passed ? 'text-emerald-600' : 'text-red-500'}`}>
                {score}/{maxScore}
              </div>
              <div className="text-slate-800 font-black text-xl mb-3">
                {passed ? 'Excellent work!' : 'Keep practicing!'}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm mb-4 ${passed ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>
                {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {Math.round(score / maxScore * 100)}% · {passed ? 'PASSED' : 'FAILED'} · B1 Level
              </div>
              {passed && (
                <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold">
                  <Zap className="w-5 h-5 text-amber-500" />+{MOCK_EXAM.xpReward} XP Earned!
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-slate-800 font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-500" /> Answer Review
              </h3>
              <div className="space-y-3">
                {questions.map((q) => {
                  const userAns = answers[q.id];
                  const correct = userAns === q.correct;
                  return (
                    <div key={q.id} className={`p-4 rounded-xl border ${correct ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'}`}>
                      <div className="flex items-start gap-3">
                        {correct ? <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" /> : <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />}
                        <div>
                          <p className="text-slate-800 text-sm font-semibold mb-1">{q.question}</p>
                          <p className={`text-xs ${correct ? 'text-emerald-600' : 'text-red-500'}`}>
                            Your answer: {q.options[userAns ?? -1] || 'Not answered'}
                          </p>
                          {!correct && <p className="text-emerald-600 text-xs mt-0.5">Correct: {q.options[q.correct]}</p>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setState('intro'); setAnswers({}); setTimeLeft(MOCK_EXAM.totalTime); setCurrentQ(0); }}
                className="btn-secondary flex-1 py-3 text-sm">Try Again</button>
              <button className="btn-primary flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" /> View Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
