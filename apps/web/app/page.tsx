'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen, Headphones, Mic, PenTool, Brain, Trophy,
  Zap, Star, ChevronRight, Play, CheckCircle2, Globe,
  Flame, Target, Users, Award, ArrowRight, Volume2,
  MessageCircle, Sparkles, GraduationCap,
} from 'lucide-react';

// ─── AURORA CANVAS ────────────────────────────────────────────────────────────
function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let frame = 0;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const orbs = [
      { x: 0.2, y: 0.3, r: 0.4, color: '#00ffa3', speed: 0.0008 },
      { x: 0.8, y: 0.6, r: 0.35, color: '#9b59ff', speed: 0.0012 },
      { x: 0.5, y: 0.1, r: 0.3, color: '#3b6ef8', speed: 0.001 },
      { x: 0.7, y: 0.8, r: 0.25, color: '#00d4e8', speed: 0.0009 },
    ];

    function draw() {
      frame++;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.fillStyle = '#0a0e1a';
      ctx.fillRect(0, 0, canvas!.width, canvas!.height);

      orbs.forEach((orb, i) => {
        const x = (orb.x + Math.sin(frame * orb.speed + i) * 0.15) * canvas!.width;
        const y = (orb.y + Math.cos(frame * orb.speed + i) * 0.1) * canvas!.height;
        const r = orb.r * Math.min(canvas!.width, canvas!.height);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
        grad.addColorStop(0, orb.color + '18');
        grad.addColorStop(0.5, orb.color + '0a');
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }
    draw();
    return () => window.removeEventListener('resize', resize);
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}

// ─── FLOATING WORD ─────────────────────────────────────────────────────────────
function FloatingWord({ word, translation, delay = 0, x = '50%', y = '50%' }: {
  word: string; translation: string; delay?: number; x?: string; y?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 1, 1, 0], y: [20, 0, -10, -30] }}
      transition={{ duration: 4, delay, repeat: Infinity, repeatDelay: 6 }}
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div className="glass-card rounded-2xl px-4 py-2 text-sm font-medium">
        <span className="text-aurora-green">{word}</span>
        <span className="text-slate-400 ml-2">→</span>
        <span className="text-slate-300 ml-2">{translation}</span>
      </div>
    </motion.div>
  );
}

// ─── STAT COUNTER ─────────────────────────────────────────────────────────────
function StatCounter({ value, suffix = '', label, color }: {
  value: number; suffix?: string; label: string; color: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 2000;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          setCount(Math.floor(progress * value));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center">
      <div className={`text-4xl md:text-5xl font-black ${color} mb-1`}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-slate-400 text-sm font-medium">{label}</div>
    </div>
  );
}

// ─── FEATURE CARD ──────────────────────────────────────────────────────────────
const features = [
  {
    icon: BookOpen, title: 'Reading Practice', color: 'from-cyan-500 to-blue-500',
    glow: 'glow-blue', bg: 'bg-reading',
    desc: 'Finnish stories, news & dialogues with instant word lookup. Tap any word for translation + audio.',
    badge: 'A1–C1', items: ['Selkouutiset articles', 'Interactive vocab lookup', 'Comprehension quizzes'],
  },
  {
    icon: Headphones, title: 'Listening Practice', color: 'from-purple-500 to-violet-600',
    glow: 'glow-purple', bg: 'bg-listening',
    desc: 'Native Finnish audio at slow/normal speed. MCQ, dictation, fill-in-the-blank.',
    badge: 'A1–C2', items: ['Native speaker audio', 'Slow/Normal speed', 'Dictation mode'],
  },
  {
    icon: Mic, title: 'Speaking Practice', color: 'from-emerald-400 to-teal-500',
    glow: 'glow-green', bg: 'bg-speaking',
    desc: 'Speak into your mic and get instant AI pronunciation scoring, fluency feedback.',
    badge: 'AI-Powered', items: ['Pronunciation scoring', 'Accent feedback', 'Repeat-after-me'],
  },
  {
    icon: PenTool, title: 'Writing Practice', color: 'from-blue-500 to-indigo-600',
    glow: 'glow-blue', bg: 'bg-writing',
    desc: 'AI checks your grammar in real-time. Essay writing with instant corrections.',
    badge: 'AI Grammar', items: ['Real-time corrections', 'Essay feedback', 'Vocabulary suggestions'],
  },
  {
    icon: Brain, title: 'Vocabulary Builder', color: 'from-yellow-400 to-orange-500',
    glow: '', bg: 'bg-vocab',
    desc: 'Spaced repetition flashcards across 20+ categories. Daily new words tailored to your level.',
    badge: '5000+ Words', items: ['SM-2 spaced repetition', 'Audio pronunciation', 'Daily word goals'],
  },
  {
    icon: GraduationCap, title: 'YKI Exam Prep', color: 'from-finn-500 to-finn-700',
    glow: 'glow-blue', bg: 'bg-yki',
    desc: 'Full mock exams with timed sessions. Score analysis and personalized weak-area targeting.',
    badge: 'Exam Ready', items: ['Official YKI format', 'Timed mock tests', 'Score analysis'],
  },
];

// ─── LANGUAGE CHIP ────────────────────────────────────────────────────────────
const languages = [
  { flag: '🇬🇧', name: 'English' },
  { flag: '🇳🇵', name: 'Nepali' },
  { flag: '🇮🇳', name: 'Hindi' },
  { flag: '🇸🇦', name: 'Arabic' },
  { flag: '🇪🇸', name: 'Spanish' },
  { flag: '🇫🇷', name: 'French' },
  { flag: '🇩🇪', name: 'German' },
  { flag: '🇷🇺', name: 'Russian' },
  { flag: '🇨🇳', name: 'Chinese' },
  { flag: '🇵🇰', name: 'Urdu' },
  { flag: '🇯🇵', name: 'Japanese' },
  { flag: '🇰🇷', name: 'Korean' },
];

// ─── DEMO EXERCISE ─────────────────────────────────────────────────────────────
function DemoExercise() {
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const options = ['Hyvää huomenta', 'Hyvää yötä', 'Näkemiin', 'Kiitos'];
  const correct = 'Hyvää huomenta';

  const handleSelect = (opt: string) => {
    setSelected(opt);
    setShowResult(true);
  };

  return (
    <div className="glass-card rounded-3xl p-6 max-w-md w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-full bg-finn-600/30 flex items-center justify-center text-finn-400 text-sm font-bold">1</div>
        <span className="text-slate-400 text-sm">Choose the correct translation</span>
        <div className="ml-auto bg-aurora-green/20 text-aurora-green text-xs px-2 py-1 rounded-full font-medium">+10 XP</div>
      </div>

      <p className="text-xl font-semibold text-white mb-1">
        <span className="text-aurora-green font-bold">&quot;Good morning&quot;</span> in Finnish?
      </p>
      <p className="text-sm text-slate-500 mb-5">Select the correct answer below</p>

      <div className="space-y-3">
        {options.map((opt) => {
          let cls = 'glass-light border border-white/10 text-slate-200 hover:border-finn-500/50 hover:bg-finn-500/10';
          if (showResult && opt === correct) cls = 'border border-aurora-green bg-aurora-green/10 text-aurora-green';
          else if (showResult && opt === selected && opt !== correct) cls = 'border border-red-500 bg-red-500/10 text-red-400';
          return (
            <motion.button
              key={opt}
              whileHover={{ scale: showResult ? 1 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !showResult && handleSelect(opt)}
              className={`w-full px-4 py-3 rounded-2xl text-left font-medium transition-all duration-200 ${cls}`}
            >
              <span className="flex items-center gap-3">
                {showResult && opt === correct && <CheckCircle2 className="w-4 h-4 text-aurora-green flex-shrink-0" />}
                {opt}
              </span>
            </motion.button>
          );
        })}
      </div>
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 rounded-2xl bg-aurora-green/10 border border-aurora-green/30"
        >
          <p className="text-aurora-green text-sm font-medium">
            ✓ Correct! <span className="text-slate-300 font-normal">&quot;Hyvää huomenta&quot; means &quot;Good morning&quot; in Finnish</span>
          </p>
          <button onClick={() => { setSelected(null); setShowResult(false); }} className="mt-2 text-xs text-finn-400 hover:text-finn-300">
            Try again →
          </button>
        </motion.div>
      )}
    </div>
  );
}

// ─── MAIN LANDING ─────────────────────────────────────────────────────────────
export default function LandingPage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  const finnishWords = [
    { word: 'Hei', translation: 'Hello', x: '10%', y: '20%', delay: 0 },
    { word: 'Kiitos', translation: 'Thank you', x: '75%', y: '15%', delay: 2 },
    { word: 'Sauna', translation: 'Sauna', x: '85%', y: '60%', delay: 1 },
    { word: 'Talvi', translation: 'Winter', x: '5%', y: '65%', delay: 3 },
    { word: 'Kaunis', translation: 'Beautiful', x: '60%', y: '75%', delay: 1.5 },
  ];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AuroraCanvas />
      {finnishWords.map((w) => <FloatingWord key={w.word} {...w} />)}

      {/* ── NAVBAR ── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-finn-500 to-aurora-purple flex items-center justify-center text-white font-black text-lg shadow-glow-sm">
              F
            </div>
            <span className="font-black text-xl gradient-text">FinnMate</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            {[['Features', '#features'], ['Pricing', '/pricing'], ['About', '#about']].map(([label, href]) => (
              <Link key={label} href={href} className="hover:text-white transition-colors">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-secondary text-sm py-2 px-4">Sign in</Link>
            <Link href="/register" className="btn-primary text-sm py-2 px-5 flex items-center gap-2">
              Start Free <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── HERO ── */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-light px-4 py-2 rounded-full text-sm font-medium text-aurora-green border border-aurora-green/20 mb-8"
        >
          <Sparkles className="w-4 h-4" />
          Powered by Groq AI · 100% Free to Start
          <span className="bg-aurora-green text-nordic-dark px-2 py-0.5 rounded-full text-xs font-bold ml-1">NEW</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.95] mb-6"
        >
          <span className="text-white">Master</span>
          <br />
          <span className="gradient-text-aurora">Finnish</span>
          <br />
          <span className="text-white text-4xl sm:text-5xl md:text-6xl font-bold">the Smart Way</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed"
        >
          AI-powered lessons, real pronunciation coaching, YKI exam prep — all from your native language.
          Learn Finnish from <span className="text-white font-semibold">A1 to C2</span> the way it was meant to be learned.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 mb-16"
        >
          <Link href="/register" className="btn-aurora text-lg py-4 px-8 font-bold flex items-center gap-3 rounded-2xl">
            <Zap className="w-5 h-5" />
            Start Learning Free
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link href="#demo" className="btn-secondary text-lg py-4 px-8 flex items-center gap-3 rounded-2xl">
            <Play className="w-5 h-5 fill-current" />
            Try a Lesson
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16"
        >
          <StatCounter value={50000} suffix="+" label="Active Learners" color="text-aurora-green" />
          <StatCounter value={12} label="Native Languages" color="text-aurora-teal" />
          <StatCounter value={97} suffix="%" label="YKI Pass Rate" color="gradient-text" />
          <StatCounter value={5000} suffix="+" label="Finnish Words" color="text-aurora-purple" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600"
        >
          <span className="text-xs">Scroll to explore</span>
          <div className="w-5 h-8 border-2 border-slate-600 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-slate-500 rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* ── LEVEL PATH ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Your <span className="gradient-text">Learning Path</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Structured CEFR levels from complete beginner to professional fluency
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {[
              { level: 'A1', label: 'Beginner', desc: 'Greetings, numbers, basic phrases', color: 'from-emerald-400 to-teal-500', icon: '🌱' },
              { level: 'A2', label: 'Elementary', desc: 'Daily conversations, simple grammar', color: 'from-blue-400 to-cyan-500', icon: '🌿' },
              { level: 'B1', label: 'Intermediate', desc: 'Travel, work, Finnish cases', color: 'from-violet-500 to-purple-600', icon: '🌳' },
              { level: 'B2', label: 'Upper-Intermediate', desc: 'Complex topics, fluent speech', color: 'from-amber-400 to-orange-500', icon: '⚡' },
              { level: 'C1', label: 'Advanced', desc: 'Academic, professional, nuance', color: 'from-rose-500 to-pink-600', icon: '🔥' },
            ].map((item, i) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass-card rounded-3xl p-6 w-48 text-center card-hover cursor-pointer"
              >
                <div className={`text-3xl mb-3`}>{item.icon}</div>
                <div className={`text-2xl font-black bg-gradient-to-br ${item.color} bg-clip-text text-transparent mb-1`}>
                  {item.level}
                </div>
                <div className="text-white font-semibold text-sm mb-2">{item.label}</div>
                <div className="text-slate-500 text-xs leading-relaxed">{item.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Everything You Need to <span className="gradient-text">Speak Finnish</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              7 powerful learning modules, all in one platform, all AI-powered
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.01 }}
                className={`glass-card rounded-3xl p-6 card-hover ${f.bg}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-glow-sm`}>
                    <f.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full glass-light border border-white/10 text-slate-400">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{f.desc}</p>
                <ul className="space-y-2">
                  {f.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-slate-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-aurora-green flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE DEMO ── */}
      <section id="demo" className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-finn-600/20 border border-finn-500/30 px-3 py-1.5 rounded-full text-finn-400 text-sm font-medium mb-6">
                <Play className="w-3.5 h-3.5 fill-current" />
                Try it right now — no signup needed
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Learn by <span className="gradient-text">Doing</span>, Not Reading
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Every lesson is interactive. No boring text walls — just exercises that actually make Finnish stick in your brain.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Zap, text: 'Instant XP rewards keep you motivated' },
                  { icon: Target, text: 'Adaptive difficulty matches your level' },
                  { icon: Flame, text: 'Daily streaks build lasting habits' },
                  { icon: Trophy, text: 'Leaderboards make learning competitive' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3 text-slate-300">
                    <div className="w-8 h-8 rounded-xl bg-finn-600/20 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-finn-400" />
                    </div>
                    <span className="text-sm">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex justify-center"
            >
              <DemoExercise />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── AI TUTOR SECTION ── */}
      <section className="relative z-10 py-24 px-4 bg-ai-tutor">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-3xl p-6 order-2 md:order-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-aurora-purple to-finn-500 flex items-center justify-center text-white font-black">F</div>
                <div>
                  <div className="text-white font-bold">FinnMate AI</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-aurora-green rounded-full animate-pulse" />
                    <span className="text-aurora-green text-xs">Online — responding in Finnish</span>
                  </div>
                </div>
              </div>

              {[
                { role: 'user', msg: 'Miten sanotaan "I love Helsinki" suomeksi?' },
                { role: 'ai', msg: 'Hyvä kysymys! 🇫🇮\n"I love Helsinki" = **"Rakastan Helsinkiä"**\n\nNote: "Helsinki" becomes "Helsinkiä" because of the partitive case — we use it with the verb rakastaa (to love). Your Finnish is great, keep it up!' },
                { role: 'user', msg: 'Voinko harjoitella ääntämistä kanssasi?' },
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className={`mb-4 flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-finn-600/40 text-white border border-finn-500/30'
                      : 'glass-light border border-white/10 text-slate-200'
                  }`}>
                    {m.msg}
                  </div>
                </motion.div>
              ))}

              <div className="flex gap-2 mt-4">
                <div className="flex-1 glass-light border border-white/10 rounded-2xl px-4 py-3 text-slate-500 text-sm">
                  Kirjoita suomeksi...
                </div>
                <button className="btn-aurora w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 !px-0 !py-0">
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 md:order-2"
            >
              <div className="inline-flex items-center gap-2 bg-aurora-purple/20 border border-aurora-purple/30 px-3 py-1.5 rounded-full text-aurora-purple text-sm font-medium mb-6">
                <Brain className="w-3.5 h-3.5" />
                FinnMate AI Tutor
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Your Personal <span className="gradient-text">Finnish Tutor</span>, Available 24/7
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                FinnMate knows Finnish grammar inside out. Chat, practice pronunciation, get corrections, and generate custom exercises — all powered by Groq AI.
              </p>
              <Link href="/register" className="btn-primary inline-flex items-center gap-2 py-3 px-6">
                Meet FinnMate <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── LANGUAGES ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Learn From <span className="gradient-text">Any Language</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12">
              FinnMate translates explanations into your native language automatically
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((lang, i) => (
              <motion.div
                key={lang.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="glass-card px-5 py-3 rounded-2xl flex items-center gap-3 cursor-pointer card-hover"
              >
                <span className="text-2xl">{lang.flag}</span>
                <span className="text-white font-medium text-sm">{lang.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              People <span className="gradient-text">Love</span> FinnMate
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Priya Sharma', flag: '🇮🇳', level: 'Passed YKI B1',
                text: 'I went from zero Finnish to passing YKI in 8 months using FinnMate every day. The AI tutor explains grammar in Hindi which made all the difference!',
                stars: 5,
              },
              {
                name: 'Ahmed Al-Hassan', flag: '🇸🇦', level: 'A2 → B2 in 6 months',
                text: 'The speaking practice with pronunciation scoring is incredible. I can now have real conversations with my Finnish colleagues at work.',
                stars: 5,
              },
              {
                name: 'María García', flag: '🇪🇸', level: 'B1 Certified',
                text: 'Finally a platform that makes Finnish grammar fun! The daily streak system keeps me accountable. I haven\'t missed a single day in 3 months.',
                stars: 5,
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-3xl p-6"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} className="w-4 h-4 fill-aurora-yellow text-aurora-yellow" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-finn-700/50 flex items-center justify-center text-lg">{t.flag}</div>
                  <div>
                    <div className="text-white font-semibold text-sm">{t.name}</div>
                    <div className="text-aurora-green text-xs">{t.level}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING PREVIEW ── */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Start Free, <span className="gradient-text">Upgrade Anytime</span>
            </h2>
            <p className="text-slate-400 text-lg mb-12">7-day free trial on all paid plans — no credit card required</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { plan: 'Free', price: '0', period: 'forever', color: 'border-white/10',
                features: ['5 lessons/day', 'Basic vocabulary', 'Grammar reference', 'AI chat (10/day)'],
                cta: 'Get Started', ctaClass: 'btn-secondary w-full mt-6 justify-center' },
              { plan: 'Pro', price: '9', period: '/month', color: 'border-finn-500/50', popular: true,
                features: ['Unlimited lessons', 'Full AI tutor', 'Speaking practice', 'YKI prep', 'Offline mode'],
                cta: 'Start Free Trial', ctaClass: 'btn-primary w-full mt-6 justify-center' },
              { plan: 'Premium', price: '19', period: '/month', color: 'border-aurora-purple/50',
                features: ['Everything in Pro', 'AI pronunciation coach', 'Live certificates', 'Priority support', 'Team features'],
                cta: 'Start Free Trial', ctaClass: 'btn-secondary w-full mt-6 justify-center border-aurora-purple/40' },
            ].map((p, i) => (
              <motion.div
                key={p.plan}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-3xl p-6 border ${p.color} relative ${p.popular ? 'glow-blue' : ''}`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-finn-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-slate-400 text-sm font-medium mb-2">{p.plan}</div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-black text-white">€{p.price}</span>
                  <span className="text-slate-400 text-sm">{p.period}</span>
                </div>
                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-slate-300 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-aurora-green flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`flex items-center gap-2 ${p.ctaClass}`}>
                  {p.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-4xl p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-finn-600/10 via-aurora-purple/10 to-aurora-green/5 pointer-events-none" />
            <div className="text-6xl mb-6">🇫🇮</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to speak Finnish?
            </h2>
            <p className="text-slate-400 text-lg mb-10">
              Join 50,000+ learners who chose FinnMate. <br />
              Your first lesson is free — always.
            </p>
            <Link href="/register" className="btn-aurora inline-flex items-center gap-3 text-xl py-5 px-10 font-black">
              <Zap className="w-6 h-6" />
              Start Learning Finnish Now
              <ArrowRight className="w-6 h-6" />
            </Link>
            <p className="text-slate-600 text-sm mt-6">No credit card · No spam · Cancel anytime</p>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-finn-500 to-aurora-purple flex items-center justify-center text-white font-black">F</div>
              <span className="font-black text-lg gradient-text">FinnMate</span>
              <span className="text-slate-600 text-sm">· Learn Finnish with AI</span>
            </div>
            <div className="flex flex-wrap gap-6 text-slate-500 text-sm">
              {['Privacy', 'Terms', 'Blog', 'Contact', 'About'].map((link) => (
                <Link key={link} href="#" className="hover:text-slate-300 transition-colors">{link}</Link>
              ))}
            </div>
            <div className="text-slate-600 text-sm">🇫🇮 Made with love for Finnish learners</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
