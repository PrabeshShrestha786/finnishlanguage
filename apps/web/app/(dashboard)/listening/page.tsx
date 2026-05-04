'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { Headphones, Play, Pause, RotateCcw, CheckCircle2, XCircle, Volume2, Eye, EyeOff, Star, Clock } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Sääennuste',
    titleEn: 'Weather Forecast',
    level: 'A1',
    duration: '1:20',
    xp: 35,
    color: 'from-purple-500 to-violet-600',
    category: 'Daily Life',
    transcript: `Hyvää huomenta! Tänään on maanantai, toinen helmikuuta. Sää on kylmä – lämpötila on miinus kymmenen astetta. Pohjoisessa sataa lunta runsaasti. Etelässä on pilvistä, mutta ei sadetta.

Iltapäivällä tuulee voimakkaasti. Pukekaa lämpimästi, jos menette ulos! Huomenna lämpenee hieman – lämpötila nousee miinus viiteen asteeseen.

Viikonlopuksi on luvassa aurinkoinen sää. Nauttikaa ulkoilusta!`,
    questions: [
      { q: 'What is the temperature today?', options: ['-5°C', '-10°C', '+2°C', '0°C'], correct: 1 },
      { q: 'Where is it snowing heavily?', options: ['In the south', 'In the east', 'In the north', 'Everywhere'], correct: 2 },
      { q: 'What will the weather be like on the weekend?', options: ['Rainy', 'Cloudy', 'Snowy', 'Sunny'], correct: 3 },
      { q: 'What does the speaker advise if you go outside?', options: ['Bring an umbrella', 'Dress warmly', 'Stay home', 'Drive carefully'], correct: 1 },
    ],
  },
  {
    id: 2,
    title: 'Kaupassa',
    titleEn: 'At the Store',
    level: 'A1',
    duration: '0:55',
    xp: 25,
    color: 'from-emerald-400 to-teal-500',
    category: 'Dialogue',
    transcript: `Myyjä: Hei! Voinko auttaa?
Asiakas: Kyllä kiitos. Etsin maitotuotteita.
Myyjä: Ne ovat tuolla kolmannessa hyllyssä oikealla.
Asiakas: Paljonko tämä maito maksaa?
Myyjä: Se maksaa euro seitsemänkymmentä.
Asiakas: Hyvä. Otan kaksi litraa. Onko teillä myös tuoretta leipää?
Myyjä: Kyllä, paistopiste on tuolla taustalla.
Asiakas: Kiitos paljon!
Myyjä: Ole hyvä. Hyvää päivää!`,
    questions: [
      { q: 'What is the customer looking for?', options: ['Vegetables', 'Dairy products', 'Bread', 'Meat'], correct: 1 },
      { q: 'Where are the dairy products?', options: ['First shelf on left', 'Second shelf', 'Third shelf on right', 'At the back'], correct: 2 },
      { q: 'How much does the milk cost?', options: ['€1.50', '€1.70', '€2.00', '€0.90'], correct: 1 },
      { q: 'How much milk does the customer buy?', options: ['One liter', 'Two liters', 'Three liters', 'Half a liter'], correct: 1 },
    ],
  },
  {
    id: 3,
    title: 'Uutislähetys',
    titleEn: 'News Broadcast',
    level: 'B1',
    duration: '2:10',
    xp: 65,
    color: 'from-blue-500 to-indigo-600',
    category: 'News',
    transcript: `Hyvää iltaa, tässä YLE Uutiset. Tänään pääuutisena: Suomen hallitus on julkistanut uuden ilmastostrategian, jonka tavoitteena on hiilineutraalius vuoteen 2035 mennessä.

Strategia sisältää merkittäviä investointeja uusiutuvaan energiaan, julkiseen liikenteeseen ja rakennusten energiatehokkuuteen. Lisäksi metsiä suojellaan entistä tiukemmin hiilinieluina.

Elinkeinoelämän edustajat ovat suhtautuneet strategiaan varauksellisesti. He pelkäävät, että nopeat muutokset voivat heikentää Suomen kilpailukykyä kansainvälisillä markkinoilla.

Ympäristöjärjestöt puolestaan pitävät tavoitteita riittämättöminä ja vaativat nopeampia toimia.

Seuraavassa uutisessa: Suomen jalkapallomaajoukko voitti Ruotsin kolmella maalilla nollaan.`,
    questions: [
      { q: 'What is Finland\'s climate goal?', options: ['Carbon neutral by 2030', 'Carbon neutral by 2035', 'Carbon neutral by 2040', 'Reduce emissions by 50%'], correct: 1 },
      { q: 'What are businesses concerned about?', options: ['Higher taxes', 'Loss of jobs', 'Competitive disadvantage', 'Energy prices'], correct: 2 },
      { q: 'What do environmental organizations think of the targets?', options: ['Too ambitious', 'Just right', 'Insufficient', 'Excellent'], correct: 2 },
      { q: 'What was the football result?', options: ['Finland won 2-0', 'Finland won 3-0', 'Draw 1-1', 'Sweden won 3-1'], correct: 1 },
    ],
  },
  {
    id: 4,
    title: 'Lääkärissä',
    titleEn: 'At the Doctor',
    level: 'A2',
    duration: '1:40',
    xp: 45,
    color: 'from-pink-500 to-rose-600',
    category: 'Healthcare',
    transcript: `Lääkäri: Hyvää päivää! Mikä teitä vaivaa?
Potilas: Hyvää päivää. Minulla on kurkkukipu ja kuumetta kolme päivää.
Lääkäri: Kuinka korkea kuume teillä on?
Potilas: Eilen illalla 38 ja puoli astetta.
Lääkäri: Ymmärrän. Onko teillä myös yskää tai nuhaa?
Potilas: Kyllä, hieman yskää. Ja olen hyvin väsynyt.
Lääkäri: Kuuntelen keuhkonne. Hengittäkää syvään... Hyvä. Teillä on flunssa. Teidän tulee levätä ja juoda paljon nesteitä. Kirjoitan reseptin kipulääkkeeseen.
Potilas: Täytyykö minun mennä töihin huomenna?
Lääkäri: Ei, jäätte kotiin vähintään kaksi päivää. Palataan asiaan, jos ette ole parempi viikon kuluessa.`,
    questions: [
      { q: 'How long has the patient had symptoms?', options: ['One day', 'Two days', 'Three days', 'A week'], correct: 2 },
      { q: 'What was the temperature last night?', options: ['37.5°C', '38°C', '38.5°C', '39°C'], correct: 2 },
      { q: 'What does the doctor prescribe?', options: ['Antibiotics', 'Cough syrup', 'Painkillers', 'Vitamins'], correct: 2 },
      { q: 'How many days should the patient stay home?', options: ['One day', 'Two days', 'Three days', 'A week'], correct: 1 },
    ],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
};

type ViewState = 'list' | 'player' | 'result';

function AudioWave({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-violet-400 rounded-full"
          animate={playing ? {
            height: [4, Math.random() * 24 + 8, 4],
          } : { height: 4 }}
          transition={playing ? {
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          } : { duration: 0.3 }}
        />
      ))}
    </div>
  );
}

export default function ListeningPage() {
  const [view, setView] = useState<ViewState>('list');
  const [selectedTrack, setSelectedTrack] = useState<typeof TRACKS[0] | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speakTrack = useCallback((track: typeof TRACKS[0]) => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(track.transcript);
    utter.lang = 'fi-FI';
    utter.rate = 0.85;
    utter.onstart = () => setPlaying(true);
    utter.onend = () => { setPlaying(false); setProgress(100); };
    utteranceRef.current = utter;
    window.speechSynthesis.speak(utter);

    if (intervalRef.current) clearInterval(intervalRef.current);
    const totalMs = track.transcript.length * 55;
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / totalMs) * 100);
      setProgress(pct);
      if (pct >= 100 && intervalRef.current) clearInterval(intervalRef.current);
    }, 100);
  }, []);

  const togglePlay = () => {
    if (!selectedTrack) return;
    if (playing) {
      window.speechSynthesis.pause();
      setPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      if (progress > 0 && progress < 100) {
        window.speechSynthesis.resume();
        setPlaying(true);
      } else {
        setProgress(0);
        speakTrack(selectedTrack);
      }
    }
  };

  const restartTrack = () => {
    window.speechSynthesis.cancel();
    setProgress(0);
    setPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (selectedTrack) speakTrack(selectedTrack);
  };

  const openTrack = (track: typeof TRACKS[0]) => {
    setSelectedTrack(track);
    setView('player');
    setPlaying(false);
    setProgress(0);
    setShowTranscript(false);
    setQuizMode(false);
    setCurrentQ(0);
    setAnswers([]);
    setSelected(null);
  };

  const handleAnswer = (idx: number) => {
    if (selected !== null || !selectedTrack) return;
    setSelected(idx);
    setTimeout(() => {
      setAnswers((a) => [...a, idx]);
      if (currentQ + 1 < selectedTrack.questions.length) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      } else {
        setView('result');
      }
    }, 900);
  };

  const score = answers.filter((a, i) => a === selectedTrack?.questions[i]?.correct).length;
  const pct = selectedTrack ? Math.round((score / selectedTrack.questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Listening Practice</h1>
          <p className="text-slate-500 text-sm mt-0.5">Listen to Finnish audio and test your comprehension</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-xl px-4 py-2">
          <Headphones className="w-4 h-4 text-violet-600" />
          <span className="text-violet-700 text-sm font-semibold">{TRACKS.length} Tracks Available</span>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">

        {/* TRACK LIST */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid md:grid-cols-2 gap-4">
              {TRACKS.map((track, i) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileHover={{ y: -3 }}
                  onClick={() => openTrack(track)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group"
                >
                  <div className={`h-2 bg-gradient-to-r ${track.color}`} />
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[track.level]}`}>{track.level}</span>
                          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{track.category}</span>
                        </div>
                        <h3 className="text-slate-800 font-black text-base">{track.title}</h3>
                        <p className="text-slate-500 text-xs">{track.titleEn}</p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${track.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{track.duration}</div>
                      <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" />+{track.xp} XP</div>
                      <div className="flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" />{track.questions.length} questions</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-violet-50 border border-violet-100 rounded-xl text-sm text-violet-700 flex items-center gap-2">
              <Volume2 className="w-4 h-4 flex-shrink-0" />
              Audio uses your device's text-to-speech. Make sure your volume is on and Finnish language is installed for best results.
            </div>
          </motion.div>
        )}

        {/* PLAYER VIEW */}
        {view === 'player' && selectedTrack && !quizMode && (
          <motion.div key="player" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-4">
            <button onClick={() => { window.speechSynthesis.cancel(); setView('list'); }} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1 transition-colors">
              ← Back to tracks
            </button>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${selectedTrack.color}`} />
              <div className="p-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[selectedTrack.level]}`}>{selectedTrack.level}</span>
                  <span className="text-xs text-slate-400">{selectedTrack.category}</span>
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-4">{selectedTrack.title} — {selectedTrack.titleEn}</h2>

                {/* Player */}
                <div className={`rounded-xl p-6 mb-4 bg-gradient-to-br ${selectedTrack.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10" />
                  <div className="relative flex flex-col items-center gap-4">
                    <AudioWave playing={playing} />
                    <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-white rounded-full" animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={restartTrack} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button onClick={togglePlay} className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                        {playing
                          ? <Pause className="w-6 h-6 text-violet-600" />
                          : <Play className="w-6 h-6 text-violet-600 fill-violet-600 ml-0.5" />
                        }
                      </button>
                      <button onClick={() => setShowTranscript((s) => !s)} className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all">
                        {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-white/70 text-xs">{showTranscript ? 'Hide transcript' : 'Show transcript'}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {showTranscript && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4 text-slate-600 text-sm leading-7 whitespace-pre-line overflow-hidden"
                    >
                      {selectedTrack.transcript}
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  onClick={() => { setQuizMode(true); setCurrentQ(0); setAnswers([]); setSelected(null); window.speechSynthesis.cancel(); }}
                  className="btn-primary w-full py-3 text-sm"
                >
                  Answer Comprehension Questions →
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* QUIZ MODE */}
        {view === 'player' && selectedTrack && quizMode && (
          <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-slate-500 text-sm">Question {currentQ + 1} of {selectedTrack.questions.length}</span>
                <div className="flex gap-1">
                  {selectedTrack.questions.map((_, i) => (
                    <div key={i} className={`h-1.5 w-8 rounded-full ${i < currentQ ? 'bg-violet-500' : i === currentQ ? 'bg-violet-300' : 'bg-slate-200'}`} />
                  ))}
                </div>
              </div>
              <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="text-slate-800 font-bold text-lg mb-5">{selectedTrack.questions[currentQ].q}</h3>
                <div className="space-y-2.5">
                  {selectedTrack.questions[currentQ].options.map((opt, idx) => {
                    const isCorrect = idx === selectedTrack.questions[currentQ].correct;
                    const isSelected = selected === idx;
                    return (
                      <motion.button
                        key={idx}
                        whileHover={selected === null ? { x: 4 } : {}}
                        onClick={() => handleAnswer(idx)}
                        className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          selected === null
                            ? 'border-slate-200 hover:border-violet-300 hover:bg-violet-50 text-slate-700'
                            : isSelected && isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : isSelected && !isCorrect ? 'border-red-400 bg-red-50 text-red-700'
                            : isCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                            : 'border-slate-200 bg-slate-50 text-slate-400'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          selected === null ? 'bg-slate-100 text-slate-500' :
                          isSelected && isCorrect ? 'bg-emerald-400 text-white' :
                          isSelected && !isCorrect ? 'bg-red-400 text-white' :
                          isCorrect ? 'bg-emerald-400 text-white' : 'bg-slate-100 text-slate-400'
                        }`}>{String.fromCharCode(65 + idx)}</span>
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

        {/* RESULT */}
        {view === 'result' && selectedTrack && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${pct >= 70 ? 'bg-violet-100' : 'bg-orange-100'}`}>
                <Headphones className={`w-8 h-8 ${pct >= 70 ? 'text-violet-600' : 'text-orange-500'}`} />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-1">{pct >= 80 ? 'Excellent hearing!' : pct >= 60 ? 'Good job!' : 'Keep listening!'}</h2>
              <p className="text-slate-500 text-sm mb-5">{score}/{selectedTrack.questions.length} correct answers</p>
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <div className="text-4xl font-black text-slate-800">{pct}%</div>
                {pct >= 70 && <div className="text-emerald-600 font-bold text-sm mt-1">+{selectedTrack.xp} XP Earned!</div>}
              </div>
              <div className="flex gap-3">
                <button onClick={() => { setView('player'); setQuizMode(false); setProgress(0); }} className="btn-secondary flex-1 py-2.5 text-sm flex items-center justify-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Listen Again
                </button>
                <button onClick={() => setView('list')} className="btn-primary flex-1 py-2.5 text-sm">More Tracks</button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
