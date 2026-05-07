'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Headphones, Play, Pause, RotateCcw, CheckCircle2, XCircle, Volume2, Eye, EyeOff, Star, Clock, Loader2, Wand2, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

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

type Track = typeof TRACKS[0];
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

const LEVEL_COLORS_GRADIENT: Record<string, string> = {
  A1: 'from-purple-500 to-violet-600',
  A2: 'from-pink-500 to-rose-600',
  B1: 'from-blue-500 to-indigo-600',
  B2: 'from-emerald-400 to-teal-500',
};

export default function ListeningPage() {
  const { user, updateUser } = useAuthStore();
  const [view, setView] = useState<ViewState>('list');
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [genLevel, setGenLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');
  const [generating, setGenerating] = useState(false);
  const [generatedTracks, setGeneratedTracks] = useState<(Track & { dbId?: string })[]>([]);
  const [loadingTracks, setLoadingTracks] = useState(true);

  useEffect(() => {
    api.get('/ai/listening-tracks')
      .then((res) => {
        const data = res.data.data ?? res.data;
        const tracks: (Track & { dbId?: string })[] = (Array.isArray(data) ? data : []).map((t: any) => ({
          id: t.id,
          dbId: t.id,
          title: t.title,
          titleEn: t.titleEn,
          level: t.level,
          duration: '~2:00',
          xp: t.xp,
          color: t.color,
          category: t.category,
          transcript: t.text,
          questions: t.questions as Track['questions'],
        }));
        setGeneratedTracks(tracks);
      })
      .catch(() => {})
      .finally(() => setLoadingTracks(false));
  }, []);

  const deleteGeneratedTrack = async (dbId: string) => {
    setGeneratedTracks((prev) => prev.filter((t) => t.dbId !== dbId));
    try { await api.delete(`/ai/listening-tracks/${dbId}`); } catch {}
  };
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<number, string>>(new Map());

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioCacheRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const loadAndPlayTrack = useCallback(async (track: typeof TRACKS[0]) => {
    const startAudio = (url: string) => {
      if (audioRef.current) audioRef.current.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.ontimeupdate = () => {
        if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
      };
      audio.onended = () => { setPlaying(false); setProgress(100); };
      audio.play();
      setPlaying(true);
    };

    const cached = audioCacheRef.current.get(track.id);
    if (cached) { startAudio(cached); return; }

    setLoadingAudio(true);
    try {
      const response = await api.post('/ai/tts', { text: track.transcript }, { responseType: 'blob' });
      const url = URL.createObjectURL(response.data);
      audioCacheRef.current.set(track.id, url);
      startAudio(url);
    } catch (err) {
      console.error('TTS failed:', err);
      setPlaying(false);
    } finally {
      setLoadingAudio(false);
    }
  }, []);

  const togglePlay = () => {
    if (!selectedTrack) return;
    if (playing) {
      audioRef.current?.pause();
      setPlaying(false);
    } else if (audioRef.current && progress > 0 && progress < 100) {
      audioRef.current.play();
      setPlaying(true);
    } else {
      setProgress(0);
      loadAndPlayTrack(selectedTrack);
    }
  };

  const restartTrack = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    setProgress(0);
    setPlaying(false);
    if (selectedTrack) loadAndPlayTrack(selectedTrack);
  };

  const generateTrack = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/ai/reading/generate', { level: genLevel });
      const data = res.data.data ?? res.data;
      const questions = (data.questions as any[]).slice(0, 4).map((q: any) => ({
        q: q.q, options: q.options as string[], correct: q.correct as number,
      }));
      const saved = await api.post('/ai/listening-tracks', {
        title: data.title,
        titleEn: data.titleEn,
        level: genLevel,
        xp: data.xp ?? 50,
        color: LEVEL_COLORS_GRADIENT[genLevel],
        category: data.category ?? 'AI Generated',
        transcript: data.text,
        questions,
      });
      const savedData = saved.data.data ?? saved.data;
      const track: Track & { dbId?: string } = {
        id: savedData.id,
        dbId: savedData.id,
        title: savedData.title,
        titleEn: savedData.titleEn,
        level: genLevel,
        duration: '~2:00',
        xp: savedData.xp,
        color: savedData.color,
        category: savedData.category,
        transcript: savedData.text,
        questions,
      };
      setGeneratedTracks((prev) => [track, ...prev]);
      openTrack(track);
    } catch {
      toast.error('Failed to generate track. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const openTrack = (track: Track) => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
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
      const newAnswers = [...answers, idx];
      setAnswers(newAnswers);
      if (currentQ + 1 < selectedTrack.questions.length) {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      } else {
        const finalCorrect = newAnswers.filter((a, i) => a === selectedTrack.questions[i]?.correct).length;
        const finalPct = Math.round((finalCorrect / selectedTrack.questions.length) * 100);
        if (finalPct >= 70) {
          const xp = selectedTrack.xp;
          updateUser({ totalXP: (user?.totalXP || 0) + xp });
          api.post('/users/xp', { xpEarned: xp, source: 'listening' }).catch(() => {});
        }
        setView('result');
      }
    }, 900);
  };

  const score = answers.filter((a, i) => a === selectedTrack?.questions[i]?.correct).length;
  const pct = selectedTrack ? Math.round((score / selectedTrack.questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">

        {/* TRACK LIST */}
        {view === 'list' && (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

            {/* AI Generate Card */}
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-5 mb-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-slate-800 font-bold flex items-center gap-2 text-sm">
                    <Wand2 className="w-4 h-4 text-violet-600" />
                    Generate AI Listening Track
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">AI creates a brand-new Finnish audio track at your chosen level</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex gap-1">
                    {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                      <button key={lvl} onClick={() => setGenLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          genLevel === lvl
                            ? 'bg-violet-600 text-white shadow-sm'
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-violet-300 hover:text-violet-600'
                        }`}>
                        {lvl}
                      </button>
                    ))}
                  </div>
                  <button onClick={generateTrack} disabled={generating}
                    className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm">
                    {generating
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Wand2 className="w-4 h-4" />}
                    {generating ? 'Generating…' : 'Generate'}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Generated Tracks */}
            {generatedTracks.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wand2 className="w-3.5 h-3.5" /> Your Generated Tracks
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {generatedTracks.map((track, i) => (
                    <motion.div key={track.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group relative">
                      <div className={`h-2 bg-gradient-to-r ${track.color}`} />
                      <div className="p-5 cursor-pointer" onClick={() => openTrack(track)}>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[track.level]}`}>{track.level}</span>
                              <span className="text-xs text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1"><Wand2 className="w-2.5 h-2.5" />AI</span>
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
                      <button onClick={(e) => { e.stopPropagation(); if (track.dbId) deleteGeneratedTrack(track.dbId); }}
                        className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-100 hover:bg-red-100 hover:text-red-500 text-slate-400 transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Static Tracks */}
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Featured Tracks</h3>
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
              Audio is generated by a native Finnish AI voice. First play may take a few seconds to load.
            </div>
          </motion.div>
        )}

        {/* PLAYER VIEW */}
        {view === 'player' && selectedTrack && !quizMode && (
          <motion.div key="player" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="max-w-2xl mx-auto space-y-4">
            <button onClick={() => { if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; } setView('list'); }} className="text-slate-400 hover:text-slate-700 text-sm flex items-center gap-1 transition-colors">
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
                      <button
                        onClick={togglePlay}
                        disabled={loadingAudio}
                        className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loadingAudio
                          ? <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
                          : playing
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
                  onClick={() => { if (audioRef.current) { audioRef.current.pause(); } setQuizMode(true); setCurrentQ(0); setAnswers([]); setSelected(null); }}
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
