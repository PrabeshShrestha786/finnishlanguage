'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { BookOpen, Clock, Star, ChevronRight, CheckCircle2, XCircle, RotateCcw, Trophy, Layers, Sparkles, Loader2, X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

const STORIES = [
  {
    id: 1,
    title: 'Perhe Helsingissä',
    titleEn: 'A Family in Helsinki',
    level: 'A1',
    duration: '5 min',
    xp: 30,
    color: 'from-cyan-500 to-blue-500',
    category: 'Daily Life',
    text: `Matti ja Anna asuvat Helsingissä. Heillä on kaksi lasta: Liisa ja Pekka. Matti on lääkäri ja Anna on opettaja. He asuvat suuressa talossa lähellä merta.

Aamuisin Matti juoksee puistossa. Anna tekee aamiaista lapsille. Liisa ja Pekka käyvät koulua kaupungissa. Koulu alkaa kello kahdeksan.

Illalla perhe syö yhdessä. He puhuvat päivästä. Lapset tekevät läksyjä. Viikonloppuisin he käyvät mökillä järven rannalla.

Matti sanoo: "Rakastamme Helsinkiä, mutta mökki on paras paikka!"`,
    vocab: ['asuvat (live)', 'lääkäri (doctor)', 'opettaja (teacher)', 'aamuisin (in the mornings)', 'yhdessä (together)'],
    questions: [
      { q: 'Missä Matti ja Anna asuvat?', options: ['Turussa', 'Helsingissä', 'Tampereella', 'Oulussa'], correct: 1 },
      { q: 'Mitä Matti tekee aamuisin?', options: ['Tekee aamiaista', 'Juoksee puistossa', 'Käy kaupassa', 'Lukee kirjaa'], correct: 1 },
      { q: 'Kuinka monta lasta heillä on?', options: ['Yksi', 'Kolme', 'Kaksi', 'Neljä'], correct: 2 },
      { q: 'Mihin perhe menee viikonloppuisin?', options: ['Kauppaan', 'Puistoon', 'Mökille', 'Kouluun'], correct: 2 },
    ],
  },
  {
    id: 2,
    title: 'Suomen Talvi',
    titleEn: 'The Finnish Winter',
    level: 'A2',
    duration: '7 min',
    xp: 50,
    color: 'from-blue-500 to-indigo-600',
    category: 'Nature',
    text: `Suomen talvi on kylmä ja pimeä, mutta myös erittäin kaunis. Lumi peittää maan joulukuusta maaliskuuhun. Lapset rakastavat leikkiä lumessa ja rakentaa lumiukkoja.

Pohjois-Suomessa, Lapissa, aurinko ei nouse ollenkaan joulukuun aikana. Tätä kutsutaan kaamos-ajaksi. Kuitenkin revontulet eli aurora borealis valaisevat taivaan vihreillä ja punaisilla väreillä.

Suomalaiset viettävät talvea hiihtämällä, luistelemalla ja käymällä saunassa. Sauna on suomalaiselle kulttuurille tärkeä osa elämää – noin kolme miljoonaa saunaa löytyy Suomesta!

Talvella suomalaiset juovat paljon kahvia ja teetä pitääkseen itsensä lämpimänä.`,
    vocab: ['kylmä (cold)', 'lumi (snow)', 'revontulet (northern lights)', 'hiihtämällä (by skiing)', 'sauna (sauna)'],
    questions: [
      { q: 'Milloin lumi peittää maan Suomessa?', options: ['Syyskuusta tammikuuhun', 'Joulukuusta maaliskuuhun', 'Lokakuusta helmikuuhun', 'Marraskuusta huhtikuuhun'], correct: 1 },
      { q: 'Mitä revontulet ovat englanniksi?', options: ['Northern lights', 'Snowflakes', 'Ice storms', 'Dark period'], correct: 0 },
      { q: 'Kuinka monta saunaa Suomessa on?', options: ['Yksi miljoona', 'Kaksi miljoona', 'Kolme miljoona', 'Neljä miljoona'], correct: 2 },
    ],
  },
  {
    id: 3,
    title: 'Ravintolassa',
    titleEn: 'At the Restaurant',
    level: 'A1',
    duration: '4 min',
    xp: 25,
    color: 'from-emerald-400 to-teal-500',
    category: 'Dialogue',
    text: `Tarjoilija: Hyvää päivää! Haluatteko pöydän kahdelle?
Asiakas: Kyllä, kiitos.
Tarjoilija: Tässä olette. Mitä saisi olla juotavaksi?
Asiakas: Vettä, kiitos. Ja voisiko nähdä ruokalistan?
Tarjoilija: Tietenkin. Tässä on ruokalista. Suosittelen päivän keittoloisen – tänään on lohikeitto.
Asiakas: Kuulostaa hyvältä! Otan lohikeiton ja salaatin.
Tarjoilija: Loistava valinta. Haluatteko leipää keiton kanssa?
Asiakas: Kyllä, mielellään. Kiitos paljon!
Tarjoilija: Ole hyvä. Ruoka tulee pian.`,
    vocab: ['tarjoilija (waiter)', 'pöytä (table)', 'ruokalista (menu)', 'lohikeitto (salmon soup)', 'loistava (excellent)'],
    questions: [
      { q: 'Mitä asiakas tilaa juotavaksi?', options: ['Kahvia', 'Teetä', 'Vettä', 'Mehua'], correct: 2 },
      { q: 'Mikä on päivän keitto?', options: ['Tomaattikeitto', 'Lohikeitto', 'Kasviskeitto', 'Hernekeitto'], correct: 1 },
      { q: 'Mitä tarjoilija suosittelee?', options: ['Salaattia', 'Jälkiruokaa', 'Päivän keittoloisen', 'Pihviä'], correct: 2 },
    ],
  },
  {
    id: 4,
    title: 'Teknologia ja Tulevaisuus',
    titleEn: 'Technology and the Future',
    level: 'B1',
    duration: '10 min',
    xp: 80,
    color: 'from-violet-500 to-purple-600',
    category: 'Technology',
    text: `Teknologia muuttaa maailmaa nopeammin kuin koskaan ennen. Tekoäly, robotiikka ja digitalisaatio vaikuttavat kaikkiin elämän osa-alueisiin – työhön, koulutukseen, terveydenhuoltoon ja sosiaalisiin suhteisiin.

Suomi on yksi maailman johtavista digitaalisista yhteiskunnista. Lähes kaikki julkiset palvelut ovat saatavilla verkossa, ja suomalaiset ovat nopeita omaksumaan uusia teknologioita.

Tulevaisuudessa tekoäly voi auttaa lääkäreitä diagnosoimaan sairauksia nopeammin ja tarkemmin. Oppimisessa tekoäly pystyy personoimaan opetuksen jokaiselle oppilaalle erikseen, mikä voi mullistaa koulutuksen.

Kuitenkin teknologian nopea kehitys tuo myös haasteita: työpaikkojen katoaminen, tietosuoja ja eriarvoisuuden kasvu ovat merkittäviä huolenaiheita, joihin yhteiskunnan täytyy vastata.`,
    vocab: ['tekoäly (artificial intelligence)', 'digitalisaatio (digitalization)', 'diagnosoimaan (to diagnose)', 'personoimaan (to personalize)', 'tietosuoja (data privacy)'],
    questions: [
      { q: 'Minkälainen digitaalinen yhteiskunta Suomi on?', options: ['Jälkijäänyt', 'Yksi johtavista', 'Keskitasoinen', 'Kehittymätön'], correct: 1 },
      { q: 'Mitä tekoäly voi tehdä lääketieteessä?', options: ['Korvata lääkärit', 'Auttaa diagnosoimaan sairauksia', 'Hoitaa potilaita yksin', 'Kehittää lääkkeitä'], correct: 1 },
      { q: 'Mikä on yksi teknologian haasteista?', options: ['Liian hidas kehitys', 'Tietosuoja', 'Liian kallista', 'Ei tarpeeksi käyttäjiä'], correct: 1 },
    ],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
  B2: 'bg-orange-100 text-orange-700',
};

const AI_COLORS = [
  'from-violet-500 to-purple-600',
  'from-pink-500 to-rose-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
];

type AnyStory = typeof STORIES[0];
type ViewState = 'list' | 'reading' | 'quiz' | 'result';

export default function ReadingPage() {
  const { user, updateUser } = useAuthStore();
  const [view, setView] = useState<ViewState>('list');
  const [selectedStory, setSelectedStory] = useState<AnyStory | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [filter, setFilter] = useState<'All' | 'A1' | 'A2' | 'B1' | 'B2'>('All');

  // AI generation state
  const [aiStories, setAiStories] = useState<AnyStory[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genLevel, setGenLevel] = useState<string>(user?.finnishLevel || 'A1');
  const [genTopic, setGenTopic] = useState('');

  const generateStory = async () => {
    setGenerating(true);
    setShowGenPanel(false);
    const toastId = toast.loading('Generating your story with AI...');
    try {
      const res = await api.post('/ai/reading/generate', { level: genLevel, topic: genTopic || undefined });
      const raw = res.data.data;
      if (!raw?.title || !raw?.text) throw new Error('Invalid response');
      const newStory: AnyStory = {
        id: Date.now(),
        title: raw.title,
        titleEn: raw.titleEn || '',
        level: genLevel,
        duration: '~5 min',
        xp: 40,
        color: AI_COLORS[aiStories.length % AI_COLORS.length],
        category: raw.category || 'AI Generated',
        text: raw.text,
        vocab: raw.vocab || [],
        questions: (raw.questions || []).map((q: any) => ({
          q: q.q,
          options: q.options,
          correct: q.correct,
        })),
      };
      setAiStories((prev) => [newStory, ...prev]);
      toast.success('Story generated! 🇫🇮', { id: toastId });
      setGenTopic('');
    } catch {
      toast.error('Failed to generate story. Try again.', { id: toastId });
    } finally {
      setGenerating(false);
    }
  };

  const baseStories = filter === 'All' ? STORIES : STORIES.filter((s) => s.level === filter);
  const filteredAi = filter === 'All' ? aiStories : aiStories.filter((s) => s.level === filter);
  const filtered = [...filteredAi, ...baseStories];

  const startStory = (story: typeof STORIES[0]) => {
    setSelectedStory(story);
    setView('reading');
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
  };

  const startQuiz = () => { setView('quiz'); setCurrentQ(0); setSelected(null); };

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setTimeout(() => {
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      if (currentQ + 1 < (selectedStory?.questions.length || 0)) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      } else {
        const finalCorrect = newAnswers.filter((a, i) => a === selectedStory?.questions[i]?.correct).length;
        const finalPct = selectedStory ? Math.round((finalCorrect / selectedStory.questions.length) * 100) : 0;
        if (finalPct >= 70 && selectedStory) {
          const xp = selectedStory.xp;
          updateUser({ totalXP: (user?.totalXP || 0) + xp });
          api.post('/users/xp', { xpEarned: xp, source: 'reading' }).catch(() => {});
        }
        setView('result');
      }
    }, 900);
  };

  const score = answers.filter((a, i) => a === selectedStory?.questions[i]?.correct).length;
  const pct = selectedStory ? Math.round((score / selectedStory.questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Reading Practice</h1>
          <p className="text-slate-500 text-sm mt-0.5">Read Finnish texts and test your comprehension</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 bg-cyan-50 border border-cyan-100 rounded-xl px-3 py-2">
            <BookOpen className="w-4 h-4 text-cyan-600" />
            <span className="text-cyan-700 text-sm font-semibold">{STORIES.length + aiStories.length} Stories</span>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowGenPanel((v) => !v)}
            disabled={generating}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60"
          >
            {generating
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</>
              : <><Sparkles className="w-4 h-4" /> Generate with AI</>
            }
          </motion.button>
        </div>
      </motion.div>

      {/* AI Generate Panel */}
      <AnimatePresence>
        {showGenPanel && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="bg-white border border-violet-200 rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-500" />
                <span className="font-bold text-slate-800">Generate a New Story</span>
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">Powered by Groq AI</span>
              </div>
              <button onClick={() => setShowGenPanel(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-shrink-0">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Level</label>
                <div className="flex gap-1.5">
                  {['A1', 'A2', 'B1', 'B2'].map((lvl) => (
                    <button key={lvl} onClick={() => setGenLevel(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        genLevel === lvl ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}>
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Topic <span className="font-normal text-slate-400">(optional)</span></label>
                <input
                  type="text"
                  value={genTopic}
                  onChange={(e) => setGenTopic(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && generateStory()}
                  placeholder="e.g. Finnish seasons, coffee culture, Helsinki trams…"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                />
              </div>
              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={generateStory}
                  className="btn-primary px-5 py-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}
                >
                  <Sparkles className="w-4 h-4" /> Generate
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Stories are generated fresh each time. Each AI story gives +40 XP on completion.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">

        {/* STORY LIST */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Filter */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className="text-slate-500 text-sm font-medium">Level:</span>
              {(['All', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    filter === lvl ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((story, i) => {
                const isAi = aiStories.some((s) => s.id === story.id);
                return (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  className={`bg-white rounded-2xl border shadow-sm overflow-hidden cursor-pointer group ${isAi ? 'border-violet-200' : 'border-slate-100'}`}
                  onClick={() => startStory(story)}
                >
                  <div className={`h-2 bg-gradient-to-r ${story.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[story.level]}`}>{story.level}</span>
                          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{story.category}</span>
                          {isAi && (
                            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" /> AI
                            </span>
                          )}
                        </div>
                        <h3 className="text-slate-800 font-black text-base">{story.title}</h3>
                        <p className="text-slate-500 text-xs">{story.titleEn}</p>
                      </div>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${story.color} flex items-center justify-center shadow-sm`}>
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{story.duration}</div>
                      <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />+{story.xp} XP</div>
                      <div className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" />{story.questions.length} questions</div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex gap-1">
                        {story.vocab.slice(0, 3).map((v, vi) => (
                          <span key={vi} className="text-xs bg-slate-50 border border-slate-200 text-slate-500 px-2 py-0.5 rounded-full">{v.split(' ')[0]}</span>
                        ))}
                      </div>
                      <span className="text-blue-600 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Read <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* READING VIEW */}
        {view === 'reading' && selectedStory && (
          <motion.div key="reading" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-3xl mx-auto space-y-4">
            <button onClick={() => setView('list')} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1 transition-colors">
              ← Back to stories
            </button>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${selectedStory.color}`} />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[selectedStory.level]}`}>{selectedStory.level}</span>
                  <span className="text-xs text-slate-400">{selectedStory.category}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-0.5">{selectedStory.title}</h2>
                <p className="text-slate-400 text-sm mb-6">{selectedStory.titleEn}</p>

                <div className="text-slate-700 leading-8 text-base whitespace-pre-line mb-6 bg-slate-50 rounded-xl p-5 border border-slate-100">
                  {selectedStory.text}
                </div>

                {/* Key Vocabulary */}
                <div className="mb-6">
                  <h3 className="text-slate-800 font-bold text-sm mb-2">Key Vocabulary</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedStory.vocab.map((v, i) => (
                      <span key={i} className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">{v}</span>
                    ))}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={startQuiz}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                >
                  Test Comprehension <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QUIZ VIEW */}
        {view === 'quiz' && selectedStory && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {/* Progress */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 text-sm">Question {currentQ + 1} of {selectedStory.questions.length}</span>
                <div className="flex gap-1">
                  {selectedStory.questions.map((_, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full transition-all ${i < currentQ ? 'bg-blue-500' : i === currentQ ? 'bg-blue-300' : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>

              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
              >
                <h3 className="text-slate-800 font-bold text-lg mb-5">{selectedStory.questions[currentQ].q}</h3>
                <div className="space-y-2.5">
                  {selectedStory.questions[currentQ].options.map((opt, idx) => {
                    const isCorrect = idx === selectedStory.questions[currentQ].correct;
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
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          selected === null ? 'bg-slate-100 text-slate-500' :
                          isSelected && isCorrect ? 'bg-emerald-400 text-white' :
                          isSelected && !isCorrect ? 'bg-red-400 text-white' :
                          isCorrect ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="font-medium text-sm">{opt}</span>
                        {selected !== null && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto" />}
                        {selected !== null && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* RESULT VIEW */}
        {view === 'result' && selectedStory && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 ${pct >= 70 ? 'bg-emerald-100' : 'bg-orange-100'}`}
              >
                {pct >= 70 ? (
                  <Trophy className="w-10 h-10 text-emerald-600" />
                ) : (
                  <BookOpen className="w-10 h-10 text-orange-500" />
                )}
              </motion.div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">
                {pct >= 90 ? 'Excellent!' : pct >= 70 ? 'Great job!' : 'Keep practicing!'}
              </h2>
              <p className="text-slate-500 text-sm mb-5">
                You answered {score} out of {selectedStory.questions.length} correctly
              </p>
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="text-4xl font-black text-slate-800 mb-1">{pct}%</div>
                <div className="text-slate-400 text-sm">Comprehension Score</div>
                {pct >= 70 && (
                  <div className="mt-2 text-emerald-600 font-bold text-sm">+{selectedStory.xp} XP Earned!</div>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setView('reading'); setCurrentQ(0); setAnswers([]); setSelected(null); }}
                  className="btn-secondary flex-1 flex items-center justify-center gap-2 py-2.5 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <button onClick={() => setView('list')} className="btn-primary flex-1 py-2.5 text-sm">
                  More Stories
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
