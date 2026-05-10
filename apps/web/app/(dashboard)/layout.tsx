'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from '@/components/layout/Sidebar';

const FINNISH_FACTS = [
  { emoji: '🇫🇮', label: 'Fun Fact', text: 'Finnish has 15 grammatical cases — English has only 3!' },
  { emoji: '🌲', label: 'Nature', text: 'Finland has over 188,000 lakes — more than any other country in the world.' },
  { emoji: '📚', label: 'Language', text: '"Kirjasto" means library in Finnish, from "kirja" (book). Finnish is very logical!' },
  { emoji: '☀️', label: 'Culture', text: 'In summer, Finland enjoys the Midnight Sun — the sun never fully sets for weeks.' },
  { emoji: '🛁', label: 'Tradition', text: 'Finland has over 3 million saunas for a population of 5.5 million people.' },
  { emoji: '🗣️', label: 'Language', text: '"Talkoot" is a uniquely Finnish word for coming together to help a neighbor with no expectation of pay.' },
  { emoji: '🎵', label: 'Culture', text: 'Finland has the most heavy metal bands per capita of any country in the world.' },
  { emoji: '📖', label: 'Language', text: 'Finnish and Hungarian are distantly related — both belong to the Finno-Ugric language family.' },
  { emoji: '❄️', label: 'Nature', text: 'Finland experiences four distinct seasons, with winter bringing beautiful snow-covered forests.' },
  { emoji: '🦌', label: 'Wildlife', text: 'Reindeer outnumber people in Lapland, the northernmost region of Finland.' },
  { emoji: '🏆', label: 'Achievement', text: 'Finland consistently ranks as one of the happiest countries in the world.' },
  { emoji: '🗺️', label: 'Language', text: '"Paikkakunta" means hometown in Finnish — Finns have a deep connection to their local community.' },
  { emoji: '🌌', label: 'Nature', text: 'Northern Finland is one of the best places on Earth to see the Northern Lights (Aurora Borealis).' },
  { emoji: '☕', label: 'Culture', text: 'Finland is the world\'s biggest coffee consumer per capita — averaging 12 kg per person per year!' },
  { emoji: '🏫', label: 'Education', text: 'Finland\'s education system is ranked among the best globally, with no standardized tests until age 16.' },
  { emoji: '🗣️', label: 'Language', text: '"Sisu" is a Finnish concept meaning inner strength and resilience — there\'s no exact English translation.' },
  { emoji: '🐟', label: 'Culture', text: 'Salmon soup (lohikeitto) is one of Finland\'s most beloved traditional dishes.' },
  { emoji: '📝', label: 'Language', text: 'Finnish words are spelled exactly as they are pronounced — it\'s a perfectly phonetic language.' },
  { emoji: '🌿', label: 'Nature', text: 'About 75% of Finland is covered by forest — it\'s one of the most forested nations in Europe.' },
  { emoji: '🎓', label: 'Language', text: '"Opiskella" means to study in Finnish. You\'re doing exactly that right now — hienoa (great)!' },
  { emoji: '🏊', label: 'Tradition', text: 'Ice swimming (avantouinti) is a beloved Finnish winter tradition practiced by thousands.' },
  { emoji: '🦅', label: 'Nature', text: 'The whooper swan (laulujoutsen) is Finland\'s national bird, symbolizing grace and freedom.' },
  { emoji: '🗣️', label: 'Language', text: '"Kalsarikännit" is a Finnish word for drinking at home in your underwear with no plans to go out.' },
  { emoji: '🌍', label: 'Language', text: 'Finnish has no future tense — the present tense is used to describe future events too!' },
  { emoji: '🎄', label: 'Culture', text: 'Santa Claus is said to live in Rovaniemi, Lapland — Finland\'s own Arctic Christmas destination.' },
  { emoji: '🏗️', label: 'Design', text: 'Finland is famous for its design heritage — Nokia, Marimekko, and Iittala all hail from Finland.' },
  { emoji: '🗣️', label: 'Language', text: '"Hiljaisuus" (silence) is deeply valued in Finnish culture — comfortable silence is a sign of respect.' },
  { emoji: '🌊', label: 'Nature', text: 'Finland has a coastline of over 1,100 km and thousands of islands in its archipelago.' },
  { emoji: '🎭', label: 'Language', text: '"Hauska tutustua!" means "Nice to meet you!" — a phrase you\'ll use from day one in Finland.' },
  { emoji: '🐻', label: 'Wildlife', text: 'The brown bear (karhu) is Finland\'s national animal, deeply rooted in Finnish mythology.' },
];

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;
    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        setDisplayed(text.slice(0, indexRef.current + 1));
        indexRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return displayed;
}

function LoadingScreen() {
  const [fact] = useState(() => FINNISH_FACTS[Math.floor(Math.random() * FINNISH_FACTS.length)]);
  const typed = useTypewriter(fact.text);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-5 text-center max-w-sm w-full">

        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-lg animate-pulse">
          F
        </div>

        {/* Dots */}
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>

        {/* Status */}
        <div className="space-y-1">
          <p className="text-slate-700 font-bold text-sm">We are preparing your content</p>
          <p className="text-slate-400 text-xs">for your better learning experience&hellip;</p>
        </div>

        {/* Fact card */}
        <div className="w-full bg-white border border-blue-100 rounded-2xl p-5 shadow-sm text-left">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{fact.emoji}</span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">{fact.label}</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed min-h-[3.5rem]">
            {typed}
            <span className="inline-block w-0.5 h-4 bg-blue-500 ml-0.5 animate-pulse align-middle" />
          </p>
        </div>

        <p className="text-slate-300 text-xs">Free-tier server wakes up in ~30&ndash;60 s</p>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized, initAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => { initAuth(); }, [initAuth]);
  useEffect(() => { if (initialized && !user) router.push('/login'); }, [user, initialized, router]);

  if (!initialized) return <LoadingScreen />;

  if (!user) return null;

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
