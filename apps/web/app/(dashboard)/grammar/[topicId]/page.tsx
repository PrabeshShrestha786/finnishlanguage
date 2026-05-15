'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Lightbulb, Play, X, CheckCircle2,
  XCircle, Zap, RotateCcw, Loader2, Trophy,
} from 'lucide-react';
import { GRAMMAR_TOPICS, type GrammarTopic } from '../data';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

// ─── Practice Quiz ─────────────────────────────────────────────────────────────

interface Exercise {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  points: number;
}

function PracticeQuiz({ topic, onClose }: { topic: GrammarTopic; onClose: () => void }) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      if (topic.quiz && topic.quiz.length > 0) {
        // Use predefined questions — shuffle and pick 5
        const shuffled = [...topic.quiz].sort(() => Math.random() - 0.5);
        setExercises(shuffled.slice(0, 5));
        setLoading(false);
        return;
      }
      const res = await api.post('/ai/exercises/generate', {
        topic: `${topic.title} (${topic.finnish}). Write all questions, options, explanations and hints in English only.`,
        level: topic.level,
        type: 'MCQ',
        count: 5,
      });
      const payload = res.data?.data ?? res.data;
      const raw: Exercise[] = Array.isArray(payload) ? payload : [];
      if (raw.length === 0) throw new Error('No exercises returned — the AI may be busy, please retry.');
      const cleaned = raw.map((ex) => {
        const opts = Array.isArray(ex.options) && ex.options.length >= 2
          ? ex.options
          : [ex.correctAnswer, 'ei', 'kyllä', 'ehkä'];
        const seen = new Set<string>();
        const unique = opts.filter((o: string) => seen.has(o) ? false : (seen.add(o), true));
        if (!unique.includes(ex.correctAnswer)) unique[0] = ex.correctAnswer;
        return { ...ex, options: unique };
      });
      setExercises(cleaned);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Could not generate exercises.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    if (option === exercises[current]?.correctAnswer) {
      setScore((s) => s + (exercises[current]?.points || 10));
    }
  };

  const handleNext = () => {
    if (current + 1 >= exercises.length) { setDone(true); return; }
    setCurrent((c) => c + 1);
    setSelected(null);
    setRevealed(false);
  };

  const ex = exercises[current];
  const maxScore = exercises.length * 10;
  const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const correct = Math.round(score / 10);

  if (loading) return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center gap-4 max-w-sm w-full">
        <div className={`w-14 h-14 rounded-2xl ${topic.accent} flex items-center justify-center text-2xl`}>{topic.icon}</div>
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-slate-800 font-bold text-lg text-center">Loading quiz…</p>
        <p className="text-slate-400 text-sm text-center">Preparing questions about {topic.title}</p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h2 className="text-lg font-black text-slate-800 mb-2">Couldn&apos;t load exercises</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">{error}</p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={load}
            className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Retry
          </button>
        </div>
      </motion.div>
    </div>
  );

  if (done) return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{pct >= 80 ? '🏆' : pct >= 60 ? '⭐' : '📚'}</div>
          <h2 className="text-2xl font-black text-slate-800">
            {pct >= 80 ? 'Excellent!' : pct >= 60 ? 'Good job!' : 'Keep practicing!'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">{topic.title} · {topic.level}</p>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: 'Correct', value: `${correct}/${exercises.length}`, cls: 'bg-emerald-50 text-emerald-700' },
            { label: 'Score', value: `${pct}%`, cls: 'bg-blue-50 text-blue-700' },
            { label: 'XP Earned', value: `+${score}`, cls: 'bg-amber-50 text-amber-700' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-3 text-center ${s.cls}`}>
              <div className="text-xl font-black">{s.value}</div>
              <div className="text-xs font-medium opacity-70 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" />
        </div>
        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.97 }}
            onClick={() => { setCurrent(0); setScore(0); setSelected(null); setRevealed(false); setDone(false); load(); }}
            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">
            <RotateCcw className="w-4 h-4" /> Try Again
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
            <Trophy className="w-4 h-4" /> Done
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  if (!ex) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full flex flex-col"
        style={{ maxHeight: 'calc(100dvh - 2rem)' }}>

        {/* Fixed header */}
        <div className="px-6 pt-6 pb-3 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-xl ${topic.accent} flex items-center justify-center text-sm`}>{topic.icon}</span>
              <span className="text-slate-700 font-bold text-sm">{topic.title}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-amber-600 text-sm font-bold bg-amber-50 px-2.5 py-1 rounded-lg">
                <Zap className="w-3.5 h-3.5" /> {score} pts
              </span>
              <button onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full mb-1 overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
              animate={{ width: `${(current / exercises.length) * 100}%` }} transition={{ duration: 0.3 }} />
          </div>
          <p className="text-slate-400 text-xs mt-1">Question {current + 1} of {exercises.length}</p>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 py-2 flex-1">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100">
            <p className="text-slate-800 font-semibold leading-relaxed">{ex.question}</p>
            {ex.hint && (
              <div className="flex items-center gap-1.5 mt-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span className="text-slate-500 text-xs">{ex.hint}</span>
              </div>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {ex.options.map((opt, oi) => {
              const isCorrect = opt === ex.correctAnswer;
              const isSelected = opt === selected;
              let cls = 'bg-white border border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-blue-50';
              if (revealed) {
                if (isCorrect) cls = 'bg-emerald-50 border-emerald-400 text-emerald-800';
                else if (isSelected) cls = 'bg-red-50 border-red-400 text-red-800';
                else cls = 'bg-white border border-slate-100 text-slate-400';
              }
              return (
                <motion.button key={`${oi}-${opt}`} onClick={() => handleSelect(opt)}
                  whileHover={!revealed ? { scale: 1.005 } : {}}
                  whileTap={!revealed ? { scale: 0.995 } : {}}
                  className={`w-full p-3.5 rounded-xl text-left text-sm font-medium transition-all flex items-center gap-3 border ${cls}`}>
                  {revealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                  {revealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  {(!revealed || (!isCorrect && !isSelected)) && <span className="w-4 shrink-0" />}
                  {opt}
                </motion.button>
              );
            })}
          </div>

          <AnimatePresence>
            {revealed && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    <p className="text-slate-700 text-sm">{ex.explanation}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Pinned Next button */}
        <AnimatePresence>
          {revealed && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="px-6 pb-6 pt-3 shrink-0 border-t border-slate-100">
              <motion.button whileTap={{ scale: 0.98 }} onClick={handleNext}
                className="btn-primary w-full py-3 font-bold text-sm">
                {current + 1 >= exercises.length ? 'See Results' : 'Next Question →'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─── Content Renderers ────────────────────────────────────────────────────────

function TableContent({ content }: { content: any }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-slate-200">
            {content.headers.map((h: string) => (
              <th key={h} className="pb-3 text-left text-slate-500 font-semibold text-xs uppercase tracking-wide pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {content.rows.map((row: string[], i: number) => (
            <motion.tr key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="py-3.5 pr-4 align-top">
                  {j === 0 ? (
                    <span className="text-slate-800 font-bold">{cell}</span>
                  ) : j === row.length - 1 && (content.headers[j] === 'Ending' || content.headers[j] === 'Suffix') ? (
                    <code className="text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded font-mono text-xs">{cell}</code>
                  ) : j === row.length - 2 ? (
                    <span className="text-emerald-700 font-medium">{cell}</span>
                  ) : (
                    <span className="text-slate-500 text-xs leading-relaxed">{cell}</span>
                  )}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
      {content.note && (
        <div className="mt-5 flex items-start gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-slate-600 text-sm">{content.note}</p>
        </div>
      )}
    </div>
  );
}

function CardsContent({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      {content.intro && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
            <p className="text-slate-700 text-sm leading-relaxed">{content.intro}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {content.items.map((item: any, i: number) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-slate-50 rounded-xl p-4 border border-slate-200">
            <code className="text-blue-600 text-xs font-mono block mb-1.5">{item.label}</code>
            <div className="text-emerald-700 font-semibold">{item.example}</div>
            {item.translation && <div className="text-slate-400 text-xs italic mt-1">{item.translation}</div>}
          </motion.div>
        ))}
      </div>
      {content.note && (
        <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-slate-600 text-sm">{content.note}</p>
        </div>
      )}
    </div>
  );
}

function VerbTypesContent({ content }: { content: any }) {
  return (
    <div className="space-y-3">
      {content.items.map((v: any, i: number) => (
        <motion.div key={v.type}
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black shrink-0">{v.type}</div>
            <code className="text-blue-600 text-sm font-mono">{v.pattern}</code>
          </div>
          <div className="text-emerald-700 font-semibold mb-1.5">{v.example}</div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            {v.tip}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function VowelHarmonyContent({ content }: { content: any }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <div className="flex items-start gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-slate-700 text-sm leading-relaxed">{content.rule}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5">
          <div className="text-emerald-700 font-bold mb-3 text-sm">Back Vowels</div>
          <div className="flex gap-4 mb-2">
            {content.back.map((v: string) => (
              <span key={v} className="text-3xl font-black text-emerald-800">{v}</span>
            ))}
          </div>
          <div className="text-slate-500 text-xs">Use -a, -ssa, -lla endings</div>
        </div>
        <div className="bg-violet-50 border border-violet-200 rounded-2xl p-5">
          <div className="text-violet-700 font-bold mb-3 text-sm">Front Vowels</div>
          <div className="flex gap-4 mb-2">
            {content.front.map((v: string) => (
              <span key={v} className="text-3xl font-black text-violet-800">{v}</span>
            ))}
          </div>
          <div className="text-slate-500 text-xs">Use -ä, -ssä, -llä endings</div>
        </div>
      </div>
      <div className="space-y-2">
        {content.examples.map((ex: any) => (
          <div key={ex.word} className="flex flex-wrap items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
            <span className="text-slate-800 font-semibold text-sm w-14">{ex.word}</span>
            <span className="text-slate-400 text-xs">+</span>
            <code className="text-blue-600 text-xs bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded font-mono">{ex.suffix}</code>
            <span className="text-slate-400 text-xs">→</span>
            <span className="text-emerald-700 font-bold text-sm">{ex.result}</span>
            <span className="text-slate-400 text-xs ml-auto">{ex.why}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Rich content renderer ────────────────────────────────────────────────────

function RichContentRenderer({ content }: { content: any }) {
  return (
    <div className="space-y-6">
      {/* Chapter intro */}
      {content.intro && (
        <p className="text-slate-600 text-base leading-relaxed border-l-4 border-amber-400 pl-4 bg-amber-50 py-3 pr-4 rounded-r-xl">
          {content.intro}
        </p>
      )}

      {content.sections.map((section: any, i: number) => {
        if (section.type === 'subheading') return (
          <h2 key={i} className="text-lg font-black text-slate-800 pt-2 border-b border-slate-200 pb-2">
            {section.text}
          </h2>
        );

        if (section.type === 'paragraph') return (
          <p key={i} className="text-slate-600 leading-relaxed">{section.text}</p>
        );

        if (section.type === 'note') return (
          <div key={i} className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <span className="text-lg shrink-0">{section.icon ?? '💡'}</span>
            <p className="text-slate-700 text-sm leading-relaxed">{section.text}</p>
          </div>
        );

        if (section.type === 'vowel-groups') return (
          <div key={i} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Back vowels */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl overflow-hidden">
                <div className="bg-orange-100 border-b border-orange-200 px-4 py-2.5">
                  <span className="text-orange-800 font-bold text-sm">{section.leftHeader}</span>
                </div>
                <div className="flex justify-around py-5">
                  {section.pairs.map(([back]: [string, string]) => (
                    <span key={back} className="text-4xl font-black text-orange-700">{back}</span>
                  ))}
                </div>
              </div>
              {/* Front vowels */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl overflow-hidden">
                <div className="bg-blue-100 border-b border-blue-200 px-4 py-2.5">
                  <span className="text-blue-800 font-bold text-sm">{section.rightHeader}</span>
                </div>
                <div className="flex justify-around py-5">
                  {section.pairs.map(([_, front]: [string, string]) => (
                    <span key={front} className="text-4xl font-black text-blue-700">{front}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Pairing arrows */}
            <div className="grid grid-cols-3 gap-2">
              {section.pairs.map(([back, front]: [string, string]) => (
                <div key={back} className="flex items-center justify-center gap-2 bg-slate-50 border border-slate-200 rounded-xl py-2.5">
                  <span className="text-lg font-black text-orange-600">{back}</span>
                  <span className="text-slate-400 text-sm">↔</span>
                  <span className="text-lg font-black text-blue-600">{front}</span>
                </div>
              ))}
            </div>
            {section.footnote && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-base shrink-0">📝</span>
                <p className="text-slate-600 text-sm">{section.footnote}</p>
              </div>
            )}
          </div>
        );

        if (section.type === 'example-table') return (
          <div key={i} className="space-y-3">
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {section.headers.map((h: string) => (
                      <th key={h} className="px-2 md:px-4 py-3 text-left text-slate-500 font-semibold text-xs uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.rows.map((row: string[], ri: number) => (
                    <tr key={ri} className={`border-b border-slate-100 ${ri % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-blue-50/40 transition-colors`}>
                      <td className="px-2 md:px-4 py-3.5 text-slate-800 font-semibold">{row[0]}</td>
                      <td className="px-2 md:px-4 py-3.5">
                        <code className="text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg font-mono text-sm font-bold">{row[1]}</code>
                      </td>
                      {row[2] && <td className="px-2 md:px-4 py-3.5 text-slate-500 text-sm">{row[2]}</td>}
                      {row[3] && <td className="px-2 md:px-4 py-3.5 text-xs text-slate-400">{row[3]}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {section.tip && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <p className="text-slate-600 text-sm">{section.tip}</p>
              </div>
            )}
          </div>
        );

        if (section.type === 'suffix-pairs') return (
          <div key={i} className="flex flex-wrap gap-2">
            {section.pairs.map((pair: string) => (
              <code key={pair} className="text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-xl font-mono text-sm">{pair}</code>
            ))}
          </div>
        );

        if (section.type === 'example-list') return (
          <div key={i} className="space-y-1.5">
            {section.title && (
              <p className="text-slate-600 text-sm font-semibold mb-2">{section.title}</p>
            )}
            <ul className="space-y-1.5">
              {section.items.map((item: string, j: number) => (
                <li key={j} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-blue-400 shrink-0 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

        return null;
      })}
    </div>
  );
}

function TopicContent({ topic }: { topic: GrammarTopic }) {
  const c = topic.content as any;
  if (c.type === 'rich') return <RichContentRenderer content={c} />;
  if (c.type === 'table') return <TableContent content={c} />;
  if (c.type === 'cards') return <CardsContent content={c} />;
  if (c.type === 'verbTypes') return <VerbTypesContent content={c} />;
  if (c.type === 'vowelHarmony') return <VowelHarmonyContent content={c} />;
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const [quizOpen, setQuizOpen] = useState(false);

  const topic = GRAMMAR_TOPICS.find((t) => t.id === params.topicId);

  if (!topic) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <p className="text-slate-500 text-lg">Topic not found.</p>
        <button onClick={() => router.push('/grammar')}
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
          ← Back to Grammar
        </button>
      </div>
    );
  }

  // Neighbour topics (same level, for next/prev navigation)
  const sameLevelTopics = GRAMMAR_TOPICS.filter((t) => t.level === topic.level);
  const currentIdx = sameLevelTopics.findIndex((t) => t.id === topic.id);
  const prevTopic = sameLevelTopics[currentIdx - 1] ?? null;
  const nextTopic = sameLevelTopics[currentIdx + 1] ?? null;

  return (
    <>
      {quizOpen && <PracticeQuiz topic={topic} onClose={() => setQuizOpen(false)} />}

      <div className="max-w-3xl mx-auto space-y-6">

        {/* Back nav */}
        <motion.button
          initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push('/grammar')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Grammar
        </motion.button>

        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${topic.accent} flex items-center justify-center text-3xl shrink-0 shadow-sm`}>
              {topic.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xs font-semibold text-slate-400">Chapter {topic.chapter}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${topic.badge}`}>{topic.level}</span>
              </div>
              <h1 className="text-2xl font-black text-slate-800 mb-1">{topic.title}</h1>
              <p className="text-slate-500 text-sm font-medium">{topic.finnish}</p>
              <p className="text-slate-400 text-sm mt-1">{topic.description}</p>
            </div>
          </div>
        </motion.div>

        {/* Content card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
          <TopicContent topic={topic} />
        </motion.div>

        {/* Practice button */}
        <motion.button
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14 }}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => setQuizOpen(true)}
          className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-base font-bold rounded-2xl">
          <Play className="w-5 h-5 fill-current" />
          Practice {topic.title}
        </motion.button>

        {/* Prev / Next navigation */}
        {(prevTopic || nextTopic) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-3">
            {prevTopic ? (
              <button onClick={() => router.push(`/grammar/${prevTopic.id}`)}
                className="bg-white border border-slate-200 rounded-2xl p-4 text-left hover:border-blue-300 hover:shadow-sm transition-all group">
                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                  <ArrowLeft className="w-3 h-3" /> Previous
                </div>
                <div className="flex items-center gap-2">
                  <span>{prevTopic.icon}</span>
                  <span className="text-slate-700 font-semibold text-sm group-hover:text-blue-600 transition-colors">{prevTopic.title}</span>
                </div>
              </button>
            ) : <div />}
            {nextTopic ? (
              <button onClick={() => router.push(`/grammar/${nextTopic.id}`)}
                className="bg-white border border-slate-200 rounded-2xl p-4 text-right hover:border-blue-300 hover:shadow-sm transition-all group">
                <div className="text-slate-400 text-xs mb-1 flex items-center gap-1 justify-end">
                  Next <ArrowLeft className="w-3 h-3 rotate-180" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="text-slate-700 font-semibold text-sm group-hover:text-blue-600 transition-colors">{nextTopic.title}</span>
                  <span>{nextTopic.icon}</span>
                </div>
              </button>
            ) : <div />}
          </motion.div>
        )}
      </div>
    </>
  );
}
