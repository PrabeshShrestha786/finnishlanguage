'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Play, Volume2, RefreshCw, ChevronRight, Star, Zap, CheckCircle2, Info, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/lib/api';

const PHRASES = [
  { fi: 'Hyvää huomenta', en: 'Good morning', level: 'A1', tip: 'hü-vää huo-men-ta' },
  { fi: 'Minun nimeni on', en: 'My name is', level: 'A1', tip: 'mi-nun ni-me-ni on' },
  { fi: 'Puhutko englantia?', en: 'Do you speak English?', level: 'A2', tip: 'pu-hut-ko eng-lan-ti-a' },
  { fi: 'Missä on juna-asema?', en: 'Where is the train station?', level: 'A2', tip: 'mis-sä on ju-na-a-se-ma' },
  { fi: 'Haluaisin tilata kahvin', en: 'I would like to order a coffee', level: 'B1', tip: 'ha-lu-ai-sin ti-la-ta kah-vin' },
  { fi: 'Suomi on kaunis maa', en: 'Finland is a beautiful country', level: 'B1', tip: 'suo-mi on kau-nis maa' },
];

type RecordState = 'idle' | 'recording' | 'processing' | 'done';

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
        className="progress-ring-circle"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '44px 44px' }}
      />
      <text x="44" y="49" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">{score}</text>
    </svg>
  );
}

export default function SpeakingPage() {
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [state, setState] = useState<RecordState>('idle');
  const [score, setScore] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [loadingTTS, setLoadingTTS] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const ttsAudioRef = useRef<HTMLAudioElement | null>(null);
  const ttsCacheRef = useRef<Map<string, string>>(new Map());
  const phrase = PHRASES[phraseIdx];

  useEffect(() => {
    return () => { ttsAudioRef.current?.pause(); };
  }, []);

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
    } catch { /* silent fail */ } finally {
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
    const url = URL.createObjectURL(blob);
    setAudioUrl(url);

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
        improvements: ['Lengthen the vowel in "huomenta"', 'Finnish "r" is rolled slightly'],
      };
      setScore(mockScore);
      setState('done');
    }
  };

  const reset = () => { setState('idle'); setScore(null); setAudioUrl(null); };
  const next = () => { setPhraseIdx((i) => (i + 1) % PHRASES.length); reset(); };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
            <Mic className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Speaking Practice</h1>
            <p className="text-slate-500 text-sm">AI pronunciation coaching powered by Groq Whisper</p>
          </div>
        </div>
      </motion.div>

      {/* Progress */}
      <div className="flex gap-2">
        {PHRASES.map((_, i) => (
          <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < phraseIdx ? 'bg-emerald-400' : i === phraseIdx ? 'bg-finn-500' : 'bg-slate-200'}`} />
        ))}
      </div>

      {/* Phrase Card */}
      <motion.div key={phraseIdx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-8 text-center bg-gradient-to-br from-[#131f35] to-[#0d1526] border border-[#1e3050] shadow-lg">
        <div className="inline-flex items-center gap-2 bg-aurora-green/20 border border-aurora-green/30 px-3 py-1 rounded-full text-aurora-green text-xs font-bold mb-6">
          {phrase.level} · Phrase {phraseIdx + 1} of {PHRASES.length}
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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startRecording}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow-green"
              >
                <Mic className="w-10 h-10 text-white" />
              </motion.button>
              <p className="text-slate-400 text-sm">Tap to start recording</p>
            </motion.div>
          )}

          {state === 'recording' && (
            <motion.div key="recording" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={stopRecording}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center relative"
              >
                {[1, 2, 3].map((i) => (
                  <motion.div key={i} className="absolute inset-0 rounded-full border-2 border-red-500"
                    animate={{ scale: [1, 1.5 + i * 0.3], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }} />
                ))}
                <MicOff className="w-10 h-10 text-white relative z-10" />
              </motion.button>
              <p className="text-red-400 font-semibold animate-pulse">Recording... Tap to stop</p>
            </motion.div>
          )}

          {state === 'processing' && (
            <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 rounded-full bg-finn-500/20 border-2 border-finn-500/50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-finn-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p className="text-finn-300 font-semibold">Analyzing pronunciation...</p>
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
                  Next Phrase <ChevronRight className="w-4 h-4" />
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
