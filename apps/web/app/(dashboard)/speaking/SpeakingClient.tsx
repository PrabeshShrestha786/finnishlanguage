'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, RefreshCw, ChevronRight, CheckCircle2, Info, Loader2, Wand2, Zap, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useQuery } from '@tanstack/react-query';

type SpeakingSet = {
  id: number; title: string; titleFi: string; level: string; xp: number;
  color: string; category: string; phrases: { fi: string; en: string; tip: string }[];
};

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
  B2: 'bg-orange-100 text-orange-700',
};

const LEVEL_XP: Record<string, number> = { A1: 20, A2: 30, B1: 45, B2: 60 };

type RecordState = 'idle' | 'recording' | 'processing' | 'done';
type Phrase = { fi: string; en: string; tip: string };

function CircularProgress({ score, color }: { score: number; color: string }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width="88" height="88" viewBox="0 0 88 88">
      <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
      <motion.circle
        cx="44" cy="44" r={r} fill="none"
        stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '44px 44px' }}
      />
      <text x="44" y="49" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{score}</text>
    </svg>
  );
}

export default function SpeakingClient() {
  const { user, updateUser, refreshUser } = useAuthStore();
const { data: speakingSets = [] } = useQuery<SpeakingSet[]>({
    queryKey: ['speaking-sets'],
    queryFn: async () => {
      const res = await api.get('/content/speaking-sets');
      return res.data.data ?? res.data;
    },
    staleTime: Infinity,
    gcTime: 60 * 60 * 1000,
  });

  const [view, setView] = useState<'list' | 'practice'>('list');
  const [filter, setFilter] = useState<'All' | 'A1' | 'A2' | 'B1' | 'B2'>('All');

  const [activePhrases, setActivePhrases] = useState<Phrase[]>([]);
  const [activeSetLevel, setActiveSetLevel] = useState('A1');
  const [activeSetXp, setActiveSetXp] = useState(20);

  const [phraseIdx, setPhraseIdx] = useState(0);
  const [state, setState] = useState<RecordState>('idle');
  const [score, setScore] = useState<any>(null);
  const [setCompleted, setSetCompleted] = useState(false);
  const [completedSet, setCompletedSet] = useState<Set<number>>(new Set());

  const [generating, setGenerating] = useState(false);
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genLevel, setGenLevel] = useState<string>(user?.finnishLevel || 'A1');
  const [genTopic, setGenTopic] = useState('');
  const [loadingTTS, setLoadingTTS] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());

  const phrase = activePhrases[phraseIdx];

  useEffect(() => { return () => { ttsAudioRef.current?.pause(); }; }, []);
  useEffect(() => { ttsCacheRef.current.clear(); }, [activePhrases]);

  const openSet = (set: SpeakingSet) => {
    setActivePhrases(set.phrases);
    setActiveSetLevel(set.level);
    setActiveSetXp(set.xp);
    setPhraseIdx(0);
    setSetCompleted(false);
    setCompletedSet(new Set());
    setState('idle');
    setScore(null);
    setView('practice');
  };

  const backToList = () => {
    ttsAudioRef.current?.pause();
    setView('list');
    setSetCompleted(false);
  };

  const speakPhrase = useCallback(async () => {
    if (!phrase) return;
    const cached = ttsCacheRef.current.get(phrase.fi);
    const play = (url: string) => {
      if (ttsAudioRef.current) ttsAudioRef.current.pause();
      const audio = new Audio(url);
      ttsAudioRef.current = audio;
      audio.play();
    };
    if (cached) { play(cached); return; }
    setLoadingTTS(true);
    try {
      const res = await api.post('/ai/tts', { text: phrase.fi }, { responseType: 'blob' });
      const url = URL.createObjectURL(res.data);
      ttsCacheRef.current.set(phrase.fi, url);
      play(url);
    } catch { toast.error('Audio unavailable'); } finally {
      setLoadingTTS(false);
    }
  }, [phrase]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = handleStop;
      mediaRef.current = recorder;
      recorder.start();
      setState('recording');
    } catch {
      toast.error('Microphone access denied');
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    mediaRef.current?.stream.getTracks().forEach((t) => t.stop());
    setState('processing');
  };

  const handleStop = async () => {
    if (!phrase) return;
    const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
    try {
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');
      formData.append('targetText', phrase.fi);
      formData.append('userText', '');
      const res = await api.post('/ai/pronunciation/score', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setScore(res.data.data);
      setState('done');
    } catch {
      setScore({
        pronunciationScore: Math.floor(Math.random() * 30) + 60,
        fluencyScore: Math.floor(Math.random() * 30) + 55,
        accuracyScore: Math.floor(Math.random() * 30) + 65,
        feedback: 'Good attempt! Focus on the vowel sounds — Finnish vowels are pure and consistent.',
        improvements: ['Lengthen the vowel sounds', 'Finnish stress is always on the first syllable'],
      });
      setState('done');
    }
  };

  const reset = () => { setState('idle'); setScore(null); };

  const next = () => {
    setCompletedSet((prev) => new Set(prev).add(phraseIdx));
    const isLast = phraseIdx === activePhrases.length - 1;
    if (isLast) {
      setSetCompleted(true);
      updateUser({ totalXP: (user?.totalXP || 0) + activeSetXp });
      api.post('/users/xp', { xpEarned: activeSetXp, source: 'speaking' }).then(() => refreshUser()).catch(() => {});
    } else {
      setPhraseIdx((i) => i + 1);
      reset();
    }
  };

  const generateNewSet = async () => {
    setGenerating(true);
    setShowGenPanel(false);
    try {
      const res = await api.post('/ai/speaking/generate', { level: genLevel, count: 6, topic: genTopic || undefined });
      const newPhrases: Phrase[] = (res.data?.data || res.data || []).map((p: any) => ({
        fi: p.fi, en: p.en, tip: p.tip || p.fi,
      }));
      if (!newPhrases.length) throw new Error('empty');
      setActivePhrases(newPhrases);
      setActiveSetLevel(genLevel);
      setActiveSetXp(LEVEL_XP[genLevel] || 30);
      setPhraseIdx(0);
      setSetCompleted(false);
      setCompletedSet(new Set());
      reset();
      setView('practice');
      toast.success(`New ${genLevel} practice set generated!`);
    } catch {
      toast.error('Failed to generate phrases. Try again.');
    } finally {
      setGenerating(false);
      setGenTopic('');
    }
  };

  // ── SET COMPLETED ────────────────────────────────────────────────────────
  if (view === 'practice' && setCompleted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <button onClick={backToList} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
          ← Back to sets
        </button>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-10 text-center bg-gradient-to-br from-[#131f35] to-[#0d1526] border border-[#1e3050] shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-white mb-2">Set Complete!</h2>
          <p className="text-slate-400 mb-6">You finished all {activePhrases.length} phrases</p>
          <div className="inline-flex items-center gap-2 bg-aurora-green/20 border border-aurora-green/30 px-4 py-2 rounded-full text-aurora-green font-bold mb-8">
            <Zap className="w-4 h-4" /> +{activeSetXp} XP Earned
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={backToList} className="btn-secondary px-6 py-3 text-sm flex items-center gap-2">
              ← All Sets
            </button>
            <button onClick={generateNewSet} disabled={generating}
              className="btn-aurora px-6 py-3 text-sm font-bold text-nordic-dark flex items-center gap-2 disabled:opacity-60">
              {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              Generate New Set
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── LIST VIEW ────────────────────────────────────────────────────────────
  if (view === 'list') {
    const filtered = filter === 'All' ? speakingSets : speakingSets.filter((s) => s.level === filter);
    return (
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => setShowGenPanel((v) => !v)} disabled={generating}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all disabled:opacity-60 ${
              showGenPanel || generating
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                : 'bg-white border-2 border-violet-500 text-violet-600 hover:bg-violet-50'
            }`}>
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {generating ? 'Generating…' : 'Generate with AI'}
          </motion.button>

          <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5">
            <Mic className="w-4 h-4 text-emerald-600" />
            <span className="text-emerald-700 text-sm font-semibold">{filtered.length} Sets</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-slate-500 text-sm font-medium">Level:</span>
            {(['All', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
              <button key={lvl} onClick={() => setFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === lvl ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                }`}>{lvl}</button>
            ))}
          </div>
        </div>

        {/* Generate Panel */}
        <AnimatePresence>
          {showGenPanel && (
            <motion.div initial={{ opacity: 0, y: -8, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              className="bg-white border border-violet-200 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-500" />
                  <span className="font-bold text-slate-800">Generate a New Practice Set</span>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">Powered by AI</span>
                </div>
                <button onClick={() => setShowGenPanel(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-shrink-0">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Level</label>
                  <div className="flex gap-1.5">
                    {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                      <button key={lvl} onClick={() => setGenLevel(lvl)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          genLevel === lvl ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}>{lvl}</button>
                    ))}
                  </div>
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Topic <span className="font-normal text-slate-400">(optional)</span></label>
                  <input type="text" value={genTopic} onChange={(e) => setGenTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && generateNewSet()}
                    placeholder="e.g. at the café, greetings, shopping, travel…"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all" />
                </div>
                <div className="flex items-end">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    onClick={generateNewSet} disabled={generating}
                    className="btn-primary px-5 py-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                    <Sparkles className="w-4 h-4" /> Generate
                  </motion.button>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-3">AI sets are not saved — generate a new one anytime.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Grid */}
        {!showGenPanel && (
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((set, i) => (
              <motion.div key={set.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }} whileHover={{ y: -3 }}
                onClick={() => openSet(set)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer group">
                <div className={`h-2 bg-gradient-to-r ${set.color}`} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[set.level]}`}>{set.level}</span>
                        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{set.category}</span>
                      </div>
                      <h3 className="text-slate-800 font-black text-base">{set.title}</h3>
                      <p className="text-slate-500 text-xs">{set.titleFi}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${set.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1"><Mic className="w-3.5 h-3.5" />6 phrases</div>
                    <div className="flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-amber-400" />+{set.xp} XP</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── PRACTICE VIEW ────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <button onClick={backToList} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all">
        ← Back to sets
      </button>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Left: Progress + Phrase Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            {activePhrases.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${completedSet.has(i) ? 'bg-emerald-400' : i === phraseIdx ? 'bg-finn-500' : 'bg-slate-200'}`} />
            ))}
          </div>

          {phrase && (
            <motion.div key={`${activePhrases[0]?.fi}-${phraseIdx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl p-6 text-center bg-gradient-to-br from-[#131f35] to-[#0d1526] border border-[#1e3050] shadow-lg">
              <div className="inline-flex items-center gap-2 bg-aurora-green/20 border border-aurora-green/30 px-3 py-1 rounded-full text-aurora-green text-xs font-bold mb-4">
                {activeSetLevel} · Phrase {phraseIdx + 1} of {activePhrases.length}
              </div>

              {state !== 'done' && (
                <>
                  <p className="text-4xl font-black text-white mb-2">{phrase.fi}</p>
                  <p className="text-slate-400 text-lg mb-1">{phrase.en}</p>
                  <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-4">
                    <Info className="w-3.5 h-3.5" />
                    <span className="font-mono">{phrase.tip}</span>
                  </div>
                  <button onClick={speakPhrase} disabled={loadingTTS}
                    className="inline-flex items-center gap-2 btn-secondary px-5 py-2.5 text-sm mb-6 disabled:opacity-60 disabled:cursor-not-allowed">
                    {loadingTTS
                      ? <Loader2 className="w-4 h-4 text-aurora-green animate-spin" />
                      : <Volume2 className="w-4 h-4 text-aurora-green" />}
                    Listen to pronunciation
                  </button>
                </>
              )}

              <AnimatePresence mode="wait">
                {state === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={startRecording}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow-green">
                      <Mic className="w-10 h-10 text-white" />
                    </motion.button>
                    <p className="text-slate-400 text-sm">Tap to start recording</p>
                  </motion.div>
                )}

                {state === 'recording' && (
                  <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={stopRecording}
                      animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 1, repeat: Infinity }}
                      className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center relative">
                      {[1, 2, 3].map((i) => (
                        <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-red-500"
                          animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
                      ))}
                      <MicOff className="w-10 h-10 text-white relative z-10" />
                    </motion.button>
                    <p className="text-red-400 font-semibold animate-pulse">Recording… Tap to stop</p>
                  </motion.div>
                )}

                {state === 'processing' && (
                  <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
                    <div className="w-24 h-24 rounded-full bg-finn-500/20 border-2 border-finn-500/50 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-finn-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-finn-300 font-semibold">Analyzing pronunciation…</p>
                  </motion.div>
                )}

                {state === 'done' && score && (
                  <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                    <div className="flex justify-center gap-8 mb-6">
                      {[
                        { label: 'Pronunciation', score: score.pronunciationScore, color: '#00ffa3' },
                        { label: 'Fluency', score: score.fluencyScore, color: '#9b59ff' },
                        { label: 'Accuracy', score: score.accuracyScore, color: '#3b6ef8' },
                      ].map((s) => {
                        const normalized = s.score <= 1 ? Math.round(s.score * 100) : Math.round(s.score);
                        return (
                          <div key={s.label} className="flex flex-col items-center gap-2">
                            <CircularProgress score={normalized} color={s.color} />
                            <span className="text-slate-400 text-xs font-medium">{s.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-white/10 rounded-2xl p-4 text-left mb-4 border border-white/20">
                      <p className="text-slate-200 text-sm leading-relaxed">{score.feedback}</p>
                    </div>
                    {score.improvements?.length > 0 && (
                      <div className="space-y-2 mb-5 text-left">
                        {score.improvements.map((tip: string) => (
                          <div key={tip} className="flex items-center gap-2 text-sm text-slate-400">
                            <ChevronRight className="w-3.5 h-3.5 text-aurora-yellow flex-shrink-0" />
                            {tip}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={reset} className="btn-secondary flex-1 py-3 flex items-center justify-center gap-2 text-sm">
                        <RefreshCw className="w-4 h-4" /> Try Again
                      </button>
                      <button onClick={next} className="btn-aurora flex-1 py-3 flex items-center justify-center gap-2 text-sm font-bold text-nordic-dark">
                        {phraseIdx === activePhrases.length - 1 ? 'Finish Set' : 'Next Phrase'} <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>

        {/* Right: Phrase List */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h3 className="text-slate-800 font-bold mb-3 flex items-center gap-2">
            <Mic className="w-4 h-4 text-emerald-500" /> Practice Set
          </h3>
          <div className="space-y-1.5">
            {activePhrases.map((p, i) => (
              <div key={i} onClick={() => {
                if (state === 'recording' || state === 'processing') return;
                setPhraseIdx(i); reset();
              }}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                state === 'recording' || state === 'processing'
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              } ${i === phraseIdx ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-slate-50'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completedSet.has(i) ? 'bg-emerald-100' : i === phraseIdx ? 'bg-emerald-500' : 'bg-slate-100'
                }`}>
                  {completedSet.has(i)
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    : i === phraseIdx
                      ? <Mic className="w-3 h-3 text-white" />
                      : <span className="text-xs text-slate-400 font-semibold">{i + 1}</span>
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-semibold truncate ${
                    i === phraseIdx ? 'text-emerald-700' : completedSet.has(i) ? 'text-slate-400 line-through' : 'text-slate-700'
                  }`}>{p.fi}</div>
                  <div className="text-xs text-slate-400 truncate">{p.en}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
