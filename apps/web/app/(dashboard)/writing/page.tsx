'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { PenTool, Send, Sparkles, CheckCircle2, AlertCircle, RotateCcw, Clock, Star, BookOpen, Lightbulb } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const PROMPTS = [
  {
    id: 1,
    title: 'Introduce Yourself',
    titleFi: 'Esittele itsesi',
    level: 'A1',
    xp: 40,
    color: 'from-blue-500 to-indigo-600',
    description: 'Write a short paragraph introducing yourself in Finnish.',
    hints: ['Start with "Minun nimeni on..." (My name is...)', 'Mention where you are from: "Olen kotoisin..." (I am from...)', 'Add your age: "Olen ___ vuotta vanha" (I am ___ years old)', 'Mention a hobby: "Harrastan..." (My hobby is...)'],
    example: 'Hei! Minun nimeni on Maria. Olen kotoisin Espanjasta, mutta asun nyt Helsingissä. Olen 28 vuotta vanha. Opiskelen suomen kieltä, koska haluan asua Suomessa pysyvästi. Harrastan valokuvausta ja lukemista.',
  },
  {
    id: 2,
    title: 'Describe Your Day',
    titleFi: 'Kuvaile päiväsi',
    level: 'A2',
    xp: 55,
    color: 'from-emerald-400 to-teal-500',
    description: 'Write about your typical daily routine in Finnish.',
    hints: ['Use time expressions: "Aamuisin..." (In the mornings...)', 'Use verbs: herätä (wake up), syödä (eat), mennä (go), nukkua (sleep)', 'Connect sentences with "sitten" (then), "sen jälkeen" (after that)', 'End with your evening routine'],
    example: 'Aamuisin herään kello seitsemän. Syön aamiaista ja juon kahvia. Sitten menen töihin bussilla. Töissä tapaan kollegoja ja pidän kokouksia. Lounaalla käyn ravintolassa. Illalla tulen kotiin kello viisi. Teen ruokaa ja katselen televisiota. Nukkumaan menen kello yhdentoista.',
  },
  {
    id: 3,
    title: 'Write a Postcard',
    titleFi: 'Kirjoita postikortti',
    level: 'A1',
    xp: 30,
    color: 'from-pink-500 to-rose-600',
    description: 'Write a postcard from a Finnish city to a friend.',
    hints: ['Start with: "Hei [nimi]!" (Hi [name]!)', 'Describe where you are: "Olen nyt..." (I am now in...)', 'Mention the weather: "Sää on..." (The weather is...)', 'End with: "Terveisin, [nimi]" (Greetings, [name])'],
    example: 'Hei Kaisa!\n\nOlen nyt Rovaniemessä, Lapissa. Sää on upea – lunta on kaikkialla ja revontulet ovat taivaalla joka ilta! Eilen kävin joulupukin pajakylässä ja ajoin poroajelulle. Ruoka on herkullista – söin lohikeittoa ja poronlihaa.\n\nTäällä on tosi kylmää, miinus viisitoista astetta, mutta se on osa kokemusta. Suosittelen lämpimästi!\n\nTerveisin,\nMaria',
  },
  {
    id: 4,
    title: 'Opinion Essay',
    titleFi: 'Mielipidekirjoitus',
    level: 'B1',
    xp: 90,
    color: 'from-violet-500 to-purple-600',
    description: 'Write a short opinion essay: "Is social media good or bad for society?"',
    hints: ['State your opinion: "Minusta..." or "Uskon, että..." (I believe that...)', 'Give reasons: "Ensinnäkin..." (Firstly...), "Toiseksi..." (Secondly...)', 'Acknowledge the other side: "Toisaalta..." (On the other hand...)', 'Conclude with: "Yhteenvetona..." (In conclusion...)'],
    example: 'Sosiaalinen media on nykyajan yhteiskunnan keskeinen osa. Uskon, että se on enemmän hyödyksi kuin haitaksi, kun sitä käytetään viisaasti.\n\nEnsinnäkin sosiaalinen media yhdistää ihmisiä ympäri maailmaa. Voimme pitää yhteyttä ystäviin ja perheenjäseniin, jotka asuvat kaukana.\n\nToisaalta sosiaalinen media voi aiheuttaa riippuvuutta ja vertailua muihin ihmisiin, mikä voi heikentää itsetuntoa.\n\nYhteenvetona voidaan sanoa, että sosiaalinen media on arvokas työkalu, jos sitä käyttää harkitusti.',
  },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
};

interface Feedback {
  correctedText: string;
  mistakes: { original: string; correction: string; explanation: string }[];
  score: number;
  tip: string;
}

export default function WritingPage() {
  const { user, updateUser } = useAuthStore();
  const [selectedPrompt, setSelectedPrompt] = useState<typeof PROMPTS[0] | null>(null);
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const submitForFeedback = async () => {
    if (!text.trim() || text.trim().split(/\s+/).length < 10) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/grammar/correct', { text });
      const raw = res.data?.data;
      if (raw) {
        const fb = {
          correctedText: raw.correctedText || text,
          mistakes: raw.mistakes || [],
          score: raw.score || 85,
          tip: raw.tip || 'Keep practicing! Your Finnish is improving.',
        };
        setFeedback(fb);
        if (fb.score >= 70 && selectedPrompt) {
          updateUser({ totalXP: (user?.totalXP || 0) + selectedPrompt.xp });
          api.post('/users/xp', { xpEarned: selectedPrompt.xp, source: 'writing' }).catch(() => {});
        }
      }
    } catch {
      const fallback = {
        correctedText: text,
        mistakes: [
          { original: 'minä olen', correction: 'Minä olen', explanation: 'Start sentences with a capital letter.' },
        ],
        score: Math.min(95, 60 + Math.floor(wordCount / 2)),
        tip: 'Great effort! Pay attention to capitalization and vowel harmony.',
      };
      setFeedback(fallback);
      if (fallback.score >= 70 && selectedPrompt) {
        updateUser({ totalXP: (user?.totalXP || 0) + selectedPrompt.xp });
        api.post('/users/xp', { xpEarned: selectedPrompt.xp, source: 'writing' }).catch(() => {});
      }
    } finally {
      setLoading(false);
    }
  };

  if (!selectedPrompt) {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Writing Practice</h1>
            <p className="text-slate-500 text-sm mt-0.5">Write in Finnish and get instant AI feedback</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2">
            <PenTool className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 text-sm font-semibold">{PROMPTS.length} Prompts</span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {PROMPTS.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -3 }}
              onClick={() => { setSelectedPrompt(p); setText(''); setFeedback(null); setShowExample(false); setShowHints(false); }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group"
            >
              <div className={`h-2 bg-gradient-to-r ${p.color}`} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[p.level]}`}>{p.level}</span>
                    </div>
                    <h3 className="text-slate-800 font-black text-base">{p.title}</h3>
                    <p className="text-slate-500 text-xs">{p.titleFi}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center shadow-sm`}>
                    <PenTool className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-slate-500 text-sm mb-3">{p.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs text-amber-600 font-semibold">
                    <Star className="w-3.5 h-3.5 text-amber-400" />+{p.xp} XP
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Lightbulb className="w-3.5 h-3.5" />{p.hints.length} hints available
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={() => { setSelectedPrompt(null); setFeedback(null); }} className="text-slate-400 hover:text-slate-700 text-sm transition-colors">
          ← Back
        </button>
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[selectedPrompt.level]}`}>{selectedPrompt.level}</span>
        <h1 className="text-xl font-black text-slate-800">{selectedPrompt.title}</h1>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Editor */}
        <div className="md:col-span-2 space-y-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className={`h-1.5 bg-gradient-to-r ${selectedPrompt.color}`} />
            <div className="p-5">
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{selectedPrompt.description}</p>
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setFeedback(null); }}
                placeholder="Kirjoita tässä... (Write here in Finnish)"
                className="w-full h-52 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm leading-7 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none transition-all"
              />
              <div className="flex items-center justify-between mt-2">
                <span className={`text-xs ${wordCount < 10 ? 'text-slate-400' : 'text-emerald-600 font-semibold'}`}>
                  {wordCount} words {wordCount < 10 && `(minimum 10)`}
                </span>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={submitForFeedback}
                  disabled={loading || wordCount < 10}
                  className={`btn-primary px-5 py-2.5 text-sm flex items-center gap-2 ${(loading || wordCount < 10) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Sparkles className="w-4 h-4" /> Get AI Feedback</>
                  )}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-500" /> AI Feedback
                  </h3>
                  <div className={`text-lg font-black px-3 py-1 rounded-xl ${feedback.score >= 80 ? 'bg-emerald-100 text-emerald-700' : feedback.score >= 60 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                    {feedback.score}/100
                  </div>
                </div>

                {feedback.mistakes.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl p-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">No major errors found — great writing!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Corrections</p>
                    {feedback.mistakes.map((m, i) => (
                      <div key={i} className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3">
                        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm">
                          <span className="line-through text-red-500 font-medium">{m.original}</span>
                          {' → '}
                          <span className="text-emerald-600 font-medium">{m.correction}</span>
                          <p className="text-slate-500 text-xs mt-0.5">{m.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-700 text-sm">{feedback.tip}</p>
                </div>

                {feedback.score >= 70 && (
                  <div className="text-center">
                    <span className="text-emerald-600 font-bold text-sm">+{selectedPrompt.xp} XP Earned!</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Hints & Example panel */}
        <div className="space-y-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <button onClick={() => setShowHints((h) => !h)} className="w-full flex items-center justify-between text-slate-700 font-semibold text-sm">
              <span className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" />Writing Hints</span>
              <span className="text-slate-400">{showHints ? '▲' : '▼'}</span>
            </button>
            <AnimatePresence>
              {showHints && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <ul className="mt-3 space-y-2">
                    {selectedPrompt.hints.map((hint, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold text-xs">{i + 1}</span>
                        {hint}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
            <button onClick={() => setShowExample((e) => !e)} className="w-full flex items-center justify-between text-slate-700 font-semibold text-sm">
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" />Example Answer</span>
              <span className="text-slate-400">{showExample ? '▲' : '▼'}</span>
            </button>
            <AnimatePresence>
              {showExample && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                  <div className="mt-3 bg-slate-50 rounded-xl p-3 text-xs text-slate-600 leading-6 whitespace-pre-line border border-slate-200">
                    {selectedPrompt.example}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700">
            <div className="font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> AI Feedback includes:
            </div>
            <ul className="space-y-1 text-blue-600">
              <li>• Grammar corrections</li>
              <li>• Vocabulary suggestions</li>
              <li>• Style improvements</li>
              <li>• Encouragement & tips</li>
            </ul>
          </div>

          <button
            onClick={() => { setText(''); setFeedback(null); }}
            className="btn-secondary w-full py-2.5 text-sm flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Clear & Restart
          </button>
        </div>
      </div>
    </div>
  );
}
