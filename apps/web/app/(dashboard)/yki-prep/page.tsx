'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Trophy, Clock, Target, BookOpen, Play, ChevronRight, AlertCircle, CheckCircle2, XCircle, BarChart3 } from 'lucide-react';

const MOCK_EXAM = {
  title: 'YKI B1 Mock Exam — Reading & Listening',
  level: 'B1',
  totalTime: 30 * 60,
  sections: [
    {
      id: 'reading',
      title: 'Reading Comprehension',
      icon: '📖',
      passage: `Suomen luonto on ainutlaatuinen. Maassa on tuhansia järviä ja laajoja metsiä.
Suomalaiset arvostavat luontoa suuresti. Monet viettävät kesälomansa mökillä, jossa he uivat järvessä ja nauttivat saunasta.

Sauna on tärkeä osa suomalaista kulttuuria. Lähes jokaisessa talossa on oma sauna. Suomalaiset saunovat viikoittain, usein lauantai-iltana. Saunassa on tapana puhua rauhallisesti ja rentoutua.`,
      questions: [
        {
          id: 'q1', type: 'MCQ',
          question: 'What is Finland known for according to the text?',
          options: ['Mountains and deserts', 'Lakes and forests', 'Beaches and cities', 'Snow and ice only'],
          correct: 1,
          points: 5,
        },
        {
          id: 'q2', type: 'MCQ',
          question: 'How often do Finns typically go to sauna?',
          options: ['Daily', 'Monthly', 'Weekly', 'Yearly'],
          correct: 2,
          points: 5,
        },
        {
          id: 'q3', type: 'MCQ',
          question: 'What is the atmosphere in a Finnish sauna like?',
          options: ['Loud and energetic', 'Calm and relaxing', 'Formal and business-like', 'Competitive'],
          correct: 1,
          points: 5,
        },
      ],
    },
  ],
};

type ExamState = 'intro' | 'exam' | 'results';

export default function YkiPrepPage() {
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

  const calcScore = () => {
    let score = 0;
    questions.forEach((q) => { if (answers[q.id] === q.correct) score += q.points; });
    return score;
  };

  const maxScore = questions.reduce((a, q) => a + q.points, 0);
  const score = calcScore();
  const passed = score >= maxScore * 0.6;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-finn-500 to-finn-700 flex items-center justify-center shadow-glow">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">YKI Exam Preparation</h1>
            <p className="text-slate-400 text-sm">Official format mock tests · A2–C1 levels</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {/* ── INTRO ── */}
        {state === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="glass-card rounded-3xl p-6 bg-yki border border-finn-500/20">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-aurora-yellow flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-white font-bold mb-2">About YKI (Yleinen kielitutkinto)</h2>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    YKI is Finland&apos;s official language proficiency test for non-native speakers. It&apos;s required for Finnish citizenship and many residency applications. FinnMate&apos;s mock tests follow the official format.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Time Limit', value: '30 min', icon: Clock, color: 'from-finn-500 to-finn-700' },
                { label: 'Total Points', value: `${maxScore} pts`, icon: Target, color: 'from-aurora-green to-teal-500' },
                { label: 'Pass Score', value: '60%', icon: Trophy, color: 'from-aurora-yellow to-orange-500' },
              ].map((s) => (
                <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mx-auto mb-2`}>
                    <s.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-white font-black text-xl">{s.value}</div>
                  <div className="text-slate-500 text-xs">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-finn-400" /> Available Mock Exams
              </h3>
              {['A2 — Elementary', 'B1 — Intermediate (Today)', 'B2 — Upper-Intermediate', 'C1 — Advanced'].map((level, i) => (
                <div key={level} className={`flex items-center gap-4 p-4 rounded-2xl mb-2 ${i === 1 ? 'bg-finn-600/20 border border-finn-500/30' : 'glass-light border border-white/8'}`}>
                  <div className="text-white font-semibold text-sm flex-1">{level}</div>
                  {i === 1 ? (
                    <span className="text-xs bg-finn-600 text-white px-2 py-1 rounded-full">Ready</span>
                  ) : (
                    <span className="text-xs text-slate-500 px-2 py-1 rounded-full bg-white/5">Coming soon</span>
                  )}
                </div>
              ))}
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              onClick={() => setState('exam')}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 text-lg font-black">
              <Play className="w-5 h-5 fill-current" />
              Start B1 Mock Exam
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {/* ── EXAM ── */}
        {state === 'exam' && (
          <motion.div key="exam" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="glass-card rounded-2xl p-4 flex items-center justify-between">
              <div className="text-white font-semibold text-sm">{MOCK_EXAM.title}</div>
              <div className={`flex items-center gap-2 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-400' : 'text-aurora-green'}`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${
                  answers[questions[i].id] !== undefined ? 'bg-aurora-green' : i === currentQ ? 'bg-finn-500' : 'bg-white/10'
                }`} />
              ))}
            </div>

            <div className="glass-card rounded-3xl p-6 bg-yki">
              <div className="mb-6">
                <div className="text-slate-400 text-xs font-medium mb-3 flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5" /> Reading Passage
                </div>
                <div className="glass-light rounded-2xl p-4 border border-white/8 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {MOCK_EXAM.sections[0].passage}
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="text-finn-400 text-xs font-bold mb-2">
                  Question {currentQ + 1} of {questions.length} · {question.points} points
                </div>
                <p className="text-white font-semibold mb-4">{question.question}</p>
                <div className="space-y-3">
                  {question.options.map((opt, i) => (
                    <motion.button key={opt} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      onClick={() => setAnswers((a) => ({ ...a, [question.id]: i }))}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl border text-sm font-medium transition-all ${
                        answers[question.id] === i
                          ? 'border-finn-500/60 bg-finn-600/25 text-white'
                          : 'border-white/10 glass-light text-slate-300 hover:border-finn-500/30'
                      }`}>
                      <span className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          answers[question.id] === i ? 'border-finn-500 bg-finn-600 text-white' : 'border-white/20 text-slate-500'
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
                  onClick={() => setState('results')}
                  className="btn-aurora flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold text-nordic-dark">
                  Submit Exam <Trophy className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* ── RESULTS ── */}
        {state === 'results' && (
          <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
            <div className={`glass-card rounded-3xl p-8 text-center ${passed ? 'bg-gradient-to-br from-aurora-green/10 to-teal-500/5 border border-aurora-green/30' : 'bg-gradient-to-br from-red-500/10 to-red-600/5 border border-red-500/30'}`}>
              <div className="text-6xl mb-4">{passed ? '🎉' : '💪'}</div>
              <div className={`text-5xl font-black mb-2 ${passed ? 'text-aurora-green' : 'text-red-400'}`}>
                {score}/{maxScore}
              </div>
              <div className={`text-2xl font-bold mb-3 ${passed ? 'text-white' : 'text-slate-300'}`}>
                {passed ? 'PASSED! Excellent work!' : 'Keep practicing — you\'re almost there!'}
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${passed ? 'bg-aurora-green/20 text-aurora-green' : 'bg-red-500/20 text-red-400'}`}>
                {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {Math.round(score / maxScore * 100)}% · {passed ? 'Pass' : 'Fail'} · B1 Level
              </div>
            </div>

            <div className="glass-card rounded-3xl p-6">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-finn-400" /> Answer Review
              </h3>
              {questions.map((q, i) => {
                const userAns = answers[q.id];
                const correct = userAns === q.correct;
                return (
                  <div key={q.id} className={`p-4 rounded-2xl mb-3 border ${correct ? 'border-aurora-green/30 bg-aurora-green/5' : 'border-red-500/30 bg-red-500/5'}`}>
                    <div className="flex items-start gap-3">
                      {correct ? <CheckCircle2 className="w-5 h-5 text-aurora-green mt-0.5" /> : <XCircle className="w-5 h-5 text-red-400 mt-0.5" />}
                      <div>
                        <p className="text-white text-sm font-medium mb-1">{q.question}</p>
                        <p className={`text-xs ${correct ? 'text-aurora-green' : 'text-red-400'}`}>
                          Your answer: {q.options[userAns ?? -1] || 'Not answered'}
                        </p>
                        {!correct && <p className="text-aurora-green text-xs">Correct: {q.options[q.correct]}</p>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setState('intro'); setAnswers({}); setTimeLeft(MOCK_EXAM.totalTime); setCurrentQ(0); }}
                className="btn-secondary flex-1 py-3 text-sm">
                Try Again
              </button>
              <button className="btn-primary flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold">
                <BarChart3 className="w-4 h-4" /> View Analysis
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
