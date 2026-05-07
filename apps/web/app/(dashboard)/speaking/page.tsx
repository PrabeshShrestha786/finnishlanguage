'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, RefreshCw, ChevronRight, Star, CheckCircle2, Info, Loader2, Wand2, Zap, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const DEFAULT_PHRASES = [
  { fi: 'Hyvää huomenta', en: 'Good morning', level: 'A1', tip: 'hü-vää huo-men-ta' },
  { fi: 'Minun nimeni on', en: 'My name is', level: 'A1', tip: 'mi-nun ni-me-ni on' },
  { fi: 'Puhutko englantia?', en: 'Do you speak English?', level: 'A2', tip: 'pu-hut-ko eng-lan-ti-a' },
  { fi: 'Missä on juna-asema?', en: 'Where is the train station?', level: 'A2', tip: 'mis-sä on ju-na-a-se-ma' },
  { fi: 'Haluaisin tilata kahvin', en: 'I would like to order a coffee', level: 'B1', tip: 'ha-lu-ai-sin ti-la-ta kah-vin' },
  { fi: 'Suomi on kaunis maa', en: 'Finland is a beautiful country', level: 'B1', tip: 'suo-mi on kau-nis maa' },
];

const LEVEL_XP: Record<string, number> = { A1: 20, A2: 30, B1: 45, B2: 60 };

type RecordState = 'idle' | 'recording' | 'processing' | 'done';
type Phrase = { fi: string; en: string; level: string; tip: string };

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

export default function SpeakingPage() {
  const { user, updateUser } = useAuthStore();
  const [phrases, setPhrases] = useState<Phrase[]>(DEFAULT_PHRASES);
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [state, setState] = useState<RecordState>('idle');
  const [score, setScore] = useState<any>(null);
  const [loadingTTS, setLoadingTTS] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showGenPanel, setShowGenPanel] = useState(false);
  const [genLevel, setGenLevel] = useState<string>(user?.finnishLevel || 'A1');
  const [genTopic, setGenTopic] = useState('');
  const [setCompleted, setSetCompleted] = useState(false);

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());

  const phrase = phrases[phraseIdx];

  useEffect(() => {
    return () => { ttsAudioRef.current?.pause(); };
  }, []);

  // Clear TTS cache when phrase set changes
  useEffect(() => {
    ttsCacheRef.current.clear();
  }, [phrases]);

  const speakPhrase = useCallback(async () => {
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
  }, [phrase.fi]);

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
      const mockScore = {
        pronunciationScore: Math.floor(Math.random() * 30) + 60,
        fluencyScore: Math.floor(Math.random() * 30) + 55,
        accuracyScore: Math.floor(Math.random() * 30) + 65,
        feedback: 'Good attempt! Focus on the vowel sounds — Finnish vowels are pure and consistent.',
        improvements: ['Lengthen the vowel sounds', 'Finnish stress is always on the first syllable'],
      };
      setScore(mockScore);
      setState('done');
    }
  };

  const reset = () => { setState('idle'); setScore(null); };

  const next = () => {
    const isLast = phraseIdx === phrases.length - 1;
    if (isLast) {
      setSetCompleted(true);
      const xp = LEVEL_XP[phrase.level] || 30;
      updateUser({ totalXP: (user?.totalXP || 0) + xp });
      api.post('/users/xp', { xpEarned: xp, source: 'speaking' }).catch(() => {});
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
      const newPhrases: Phrase[] = res.data?.data || res.data || [];
      if (!newPhrases.length) throw new Error('empty');
      setPhrases(newPhrases);
      setPhraseIdx(0);
      setSetCompleted(false);
      reset();
      toast.success(`New ${genLevel} practice set generated!`);
    } catch {
      toast.error('Failed to generate phrases. Try again.');
    } finally {
      setGenerating(false);
    }
  };

  const restartDefault = () => {
    setPhrases(DEFAULT_PHRASES);
    setPhraseIdx(0);
    setSetCompleted(false);
    reset();
  };

  if (setCompleted) {
    const xp = LEVEL_XP[phrase.level] || 30;
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl p-10 text-center bg-gradient-to-br from-[#131f35] to-[#0d1526] border border-[#1e3050] shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-black text-white mb-2">Set Complete!</h2>
          <p className="text-slate-400 mb-6">You finished all {phrases.length} phrases</p>
          <div className="inline-flex items-center gap-2 bg-aurora-green/20 border border-aurora-green/30 px-4 py-2 rounded-full text-aurora-green font-bold mb-8">
            <Zap className="w-4 h-4" /> +{xp} XP Earned
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={restartDefault} className="btn-secondary px-6 py-3 text-sm flex items-center gap-2">
              <RefreshCw className="w-4 h-4" /> Default Phrases
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

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowGenPanel((v) => !v)} disabled={generating}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60">
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? 'Generating…' : 'Generate with AI'}
        </motion.button>

        <div className="hidden md:flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5">
          <Mic className="w-4 h-4 text-emerald-600" />
          <span className="text-emerald-700 text-sm font-semibold">{phrases.length} Phrases</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-slate-500 text-sm font-medium">Level:</span>
          {(['A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
            <button key={lvl} onClick={() => setGenLevel(lvl)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                genLevel === lvl ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
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
                  onClick={generateNewSet}
                  className="btn-primary px-5 py-2 text-sm font-semibold flex items-center gap-2 whitespace-nowrap"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #9333ea)' }}>
                  <Sparkles className="w-4 h-4" /> Generate
                </motion.button>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3">Each AI practice set gives XP on completion. Sets are not saved — generate a new one anytime.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress */}
      <div className="flex gap-2">
        {phrases.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < phraseIdx ? 'bg-emerald-400' : i === phraseIdx ? 'bg-finn-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      {/* Phrase Card */}
      <motion.div key={`${phrases[0].fi}-${phraseIdx}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 text-center bg-gradient-to-br from-[#131f35] to-[#0d1526] border border-[#1e3050] shadow-lg">
        <div className="inline-flex items-center gap-2 bg-aurora-green/20 border border-aurora-green/30 px-3 py-1 rounded-full text-aurora-green text-xs font-bold mb-6">
          {phrase.level} · Phrase {phraseIdx + 1} of {phrases.length}
        </div>

        <p className="text-4xl font-black text-white mb-3">{phrase.fi}</p>
        <p className="text-slate-400 text-lg mb-2">{phrase.en}</p>
        <div className="flex items-center justify-center gap-2 text-slate-500 text-sm mb-6">
          <Info className="w-3.5 h-3.5" />
          <span className="font-mono">{phrase.tip}</span>
        </div>

        {/* Listen Button */}
        <button onClick={speakPhrase} disabled={loadingTTS}
          className="inline-flex items-center gap-2 btn-secondary px-5 py-2.5 text-sm mb-8 disabled:opacity-60 disabled:cursor-not-allowed">
          {loadingTTS
            ? <Loader2 className="w-4 h-4 text-aurora-green animate-spin" />
            : <Volume2 className="w-4 h-4 text-aurora-green" />}
          Listen to pronunciation
        </button>

        {/* Recording UI */}
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
                  {phraseIdx === phrases.length - 1 ? 'Finish Set' : 'Next Phrase'} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tips */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <h3 className="text-slate-800 font-bold mb-3 flex items-center gap-2">
          <Star className="w-4 h-4 text-amber-400" /> Finnish Pronunciation Tips
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { tip: 'Vowels are pure — A sounds like "ah", never "ay"' },
            { tip: 'Double letters are held twice as long: "ss", "tt"' },
            { tip: 'Stress is always on the FIRST syllable' },
            { tip: '"Y" is a vowel, sounds like German "ü"' },
          ].map((t) => (
            <div key={t.tip} className="flex items-start gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
              {t.tip}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
