'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { GraduationCap, ChevronDown, ChevronRight, BookOpen, CheckCircle2, Lightbulb, Play } from 'lucide-react';

const GRAMMAR_TOPICS = [
  {
    id: 'cases',
    title: 'Finnish Cases (Sijamuodot)',
    icon: '📐',
    level: 'A2',
    cases: [
      { name: 'Nominatiivi', english: 'Nominative', usage: 'Subject of sentence', example: 'Koira juoksee', translation: 'The dog runs', ending: '-' },
      { name: 'Genetiivi', english: 'Genitive', usage: 'Possession, of', example: 'Koiran ruoka', translation: 'The dog\'s food', ending: '-n' },
      { name: 'Akkusatiivi', english: 'Accusative', usage: 'Direct object (total)', example: 'Ostan koiran', translation: 'I buy the dog', ending: '-n/-t' },
      { name: 'Partitiivi', english: 'Partitive', usage: 'Partial action, negative, numbers', example: 'Juon kahvia', translation: 'I drink coffee', ending: '-a/-ä' },
      { name: 'Inessiiivi', english: 'Inessive', usage: 'Inside (in)', example: 'Olen talossa', translation: 'I am in the house', ending: '-ssa/-ssä' },
      { name: 'Elatiivi', english: 'Elative', usage: 'Out of (from inside)', example: 'Tulen talosta', translation: 'I come from the house', ending: '-sta/-stä' },
      { name: 'Illatiivi', english: 'Illative', usage: 'Into', example: 'Menen taloon', translation: 'I go into the house', ending: '-Vn/-seen' },
      { name: 'Adessiivi', english: 'Adessive', usage: 'On/at (surface)', example: 'Olen pöydällä', translation: 'I am on the table', ending: '-lla/-llä' },
      { name: 'Ablatiivi', english: 'Ablative', usage: 'From (surface)', example: 'Tulen pöydältä', translation: 'I come from the table', ending: '-lta/-ltä' },
      { name: 'Allatiivi', english: 'Allative', usage: 'To/onto (surface)', example: 'Menen pöydälle', translation: 'I go onto the table', ending: '-lle' },
    ],
  },
  {
    id: 'verbTypes',
    title: 'Verb Types (Verbitypit)',
    icon: '⚡',
    level: 'A1',
    verbs: [
      { type: 1, pattern: '-(V)da/-(V)dä → remove -a/-ä', example: 'puhua → puhun (to speak → I speak)', tip: 'Most common verb type' },
      { type: 2, pattern: '-da/-dä → remove -da/-dä + -n', example: 'syödä → syön (to eat → I eat)', tip: 'Verbs ending in vowel + da/dä' },
      { type: 3, pattern: '-lla/-llä/-nna/-sta etc.', example: 'tulla → tulen (to come → I come)', tip: 'Often movement/state verbs' },
      { type: 4, pattern: '-ata/-ätä/-ota/-etä', example: 'tavata → tapaan (to meet → I meet)', tip: 'Stem change aa/ää in personal forms' },
      { type: 5, pattern: '-ita/-itä', example: 'tarvita → tarvitsen (to need → I need)', tip: '-tse- added in conjugation' },
      { type: 6, pattern: '-eta/-etä', example: 'vanheta → vanhenen (to age → I age)', tip: 'Stem change ene/ene' },
    ],
  },
  {
    id: 'vowelHarmony',
    title: 'Vowel Harmony (Vokaalisointu)',
    icon: '🎵',
    level: 'A1',
    content: {
      rule: 'Finnish words use EITHER front vowels (ä, ö, y) OR back vowels (a, o, u) — never mixed in the same word stem.',
      front: ['ä', 'ö', 'y'],
      back: ['a', 'o', 'u'],
      examples: [
        { word: 'talo', suffix: '-ssa', result: 'talossa', why: '"talo" has back vowels → use -ssa' },
        { word: 'perhe', suffix: '-ssä', result: 'perheessä', why: '"perhe" has front vowels → use -ssä' },
        { word: 'auto', suffix: '-lla', result: 'autolla', why: '"auto" has back vowels → use -lla' },
        { word: 'pöytä', suffix: '-llä', result: 'pöydällä', why: '"pöytä" has front vowels → use -llä' },
      ],
    },
  },
];

export default function GrammarPage() {
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [quizMode, setQuizMode] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Finnish Grammar</h1>
            <p className="text-slate-400 text-sm">Master Finnish cases, verb types & grammar rules</p>
          </div>
        </div>
      </motion.div>

      {/* Quick facts */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Cases to Master', value: '15', sub: 'Each changes meaning', color: 'from-finn-500 to-finn-700' },
          { label: 'Verb Types', value: '6', sub: 'Different conjugation patterns', color: 'from-aurora-purple to-violet-600' },
          { label: 'Grammar Rules', value: '50+', sub: 'Systematic & logical', color: 'from-pink-500 to-rose-600' },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-4 text-center bg-grammar">
            <div className={`text-2xl font-black bg-gradient-to-br ${s.color} bg-clip-text text-transparent`}>{s.value}</div>
            <div className="text-white text-sm font-bold">{s.label}</div>
            <div className="text-slate-500 text-xs">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Topics */}
      <div className="space-y-3">
        {GRAMMAR_TOPICS.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-3xl overflow-hidden"
          >
            <button
              onClick={() => setActiveTopic(activeTopic === topic.id ? null : topic.id)}
              className="w-full p-5 flex items-center gap-4 hover:bg-white/3 transition-all"
            >
              <span className="text-2xl">{topic.icon}</span>
              <div className="flex-1 text-left">
                <div className="text-white font-bold">{topic.title}</div>
                <div className="text-slate-500 text-sm">Level {topic.level}</div>
              </div>
              <motion.div animate={{ rotate: activeTopic === topic.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-5 h-5 text-slate-500" />
              </motion.div>
            </button>

            <AnimatePresence>
              {activeTopic === topic.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-white/5"
                >
                  <div className="p-5">
                    {/* Cases */}
                    {topic.cases && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left border-b border-white/10">
                              <th className="pb-3 text-slate-400 font-medium">Case</th>
                              <th className="pb-3 text-slate-400 font-medium">Usage</th>
                              <th className="pb-3 text-slate-400 font-medium">Example</th>
                              <th className="pb-3 text-slate-400 font-medium">Ending</th>
                            </tr>
                          </thead>
                          <tbody>
                            {topic.cases.map((c, j) => (
                              <motion.tr key={c.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: j * 0.05 }}
                                className="border-b border-white/5 hover:bg-white/3 transition-colors">
                                <td className="py-3">
                                  <div className="text-white font-semibold">{c.name}</div>
                                  <div className="text-slate-500 text-xs">{c.english}</div>
                                </td>
                                <td className="py-3 text-slate-400 text-xs max-w-xs">{c.usage}</td>
                                <td className="py-3">
                                  <div className="text-aurora-green font-medium">{c.example}</div>
                                  <div className="text-slate-500 text-xs italic">{c.translation}</div>
                                </td>
                                <td className="py-3">
                                  <code className="text-finn-400 bg-finn-900/30 px-2 py-1 rounded text-xs">{c.ending}</code>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Verb Types */}
                    {topic.verbs && (
                      <div className="space-y-3">
                        {topic.verbs.map((v, j) => (
                          <motion.div key={v.type} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.05 }}
                            className="glass-light rounded-2xl p-4 border border-white/8">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-aurora-purple to-finn-500 flex items-center justify-center text-white font-black text-sm">{v.type}</div>
                              <code className="text-finn-400 text-sm">{v.pattern}</code>
                            </div>
                            <div className="text-aurora-green text-sm mb-1">{v.example}</div>
                            <div className="flex items-center gap-1 text-xs text-slate-500">
                              <Lightbulb className="w-3 h-3 text-aurora-yellow" />
                              {v.tip}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {/* Vowel Harmony */}
                    {topic.content && (
                      <div className="space-y-4">
                        <div className="glass-light rounded-2xl p-4 border border-aurora-yellow/20">
                          <div className="flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-aurora-yellow mt-0.5 flex-shrink-0" />
                            <p className="text-slate-300 text-sm">{topic.content.rule}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="glass-light rounded-2xl p-4 border border-aurora-green/20">
                            <div className="text-aurora-green font-bold mb-2 text-sm">Back Vowels</div>
                            <div className="flex gap-2">{topic.content.back.map((v) => (
                              <span key={v} className="text-2xl font-black text-white">{v}</span>
                            ))}</div>
                            <div className="text-slate-500 text-xs mt-1">Use -a, -ssa, -lla endings</div>
                          </div>
                          <div className="glass-light rounded-2xl p-4 border border-aurora-purple/20">
                            <div className="text-aurora-purple font-bold mb-2 text-sm">Front Vowels</div>
                            <div className="flex gap-2">{topic.content.front.map((v) => (
                              <span key={v} className="text-2xl font-black text-white">{v}</span>
                            ))}</div>
                            <div className="text-slate-500 text-xs mt-1">Use -ä, -ssä, -llä endings</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {topic.content.examples.map((ex) => (
                            <div key={ex.word} className="flex items-center gap-3 glass-light rounded-xl p-3 border border-white/8">
                              <span className="text-white font-semibold text-sm w-16">{ex.word}</span>
                              <ChevronRight className="w-3 h-3 text-slate-600" />
                              <span className="text-aurora-green font-bold text-sm">{ex.result}</span>
                              <span className="text-slate-500 text-xs ml-auto">{ex.why}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                      className="btn-primary w-full mt-5 py-3 flex items-center justify-center gap-2 text-sm font-bold">
                      <Play className="w-4 h-4 fill-current" />
                      Practice This Topic
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
