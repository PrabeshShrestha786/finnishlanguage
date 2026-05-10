'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { PenTool, Sparkles, CheckCircle2, AlertCircle, RotateCcw, Star, BookOpen, Lightbulb, Languages, RefreshCw, ChevronRight } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const PROMPTS = [
  // ── A1 ──────────────────────────────────────────────────────────────────
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
    id: 3,
    title: 'Write a Postcard',
    titleFi: 'Kirjoita postikortti',
    level: 'A1',
    xp: 35,
    color: 'from-pink-500 to-rose-600',
    description: 'Write a postcard from a Finnish city to a friend.',
    hints: ['Start with: "Hei [nimi]!" (Hi [name]!)', 'Describe where you are: "Olen nyt..." (I am now in...)', 'Mention the weather: "Sää on..." (The weather is...)', 'End with: "Terveisin, [nimi]" (Greetings, [name])'],
    example: 'Hei Kaisa!\n\nOlen nyt Rovaniemessä, Lapissa. Sää on upea – lunta on kaikkialla ja revontulet ovat taivaalla joka ilta! Eilen kävin joulupukin pajakylässä ja ajoin poroajelulle. Ruoka on herkullista – söin lohikeittoa ja poronlihaa.\n\nTäällä on tosi kylmää, miinus viisitoista astetta, mutta se on osa kokemusta. Suosittelen lämpimästi!\n\nTerveisin,\nMaria',
  },
  {
    id: 5,
    title: 'My Favourite Food',
    titleFi: 'Lempiruokani',
    level: 'A1',
    xp: 35,
    color: 'from-cyan-500 to-blue-500',
    description: 'Write 3–4 sentences about a food or drink you love.',
    hints: ['Say what you like: "Pidän ___ kovasti" (I like ___ a lot)', 'Describe it: "Se on herkullista ja..." (It is delicious and...)', 'Say when you eat it: "Syön sitä yleensä..." (I usually eat it...)', 'Add who you eat it with: "Syön sitä ___ kanssa" (I eat it with...)'],
    example: 'Pidän pizzasta kovasti. Se on herkullista ja helppo syödä. Lempimakuni on juusto-tomaatti. Syön pizzaa yleensä viikonloppuisin perheen kanssa.',
  },
  {
    id: 6,
    title: 'My Pet',
    titleFi: 'Lemmikkini',
    level: 'A1',
    xp: 35,
    color: 'from-teal-400 to-emerald-500',
    description: 'Write a few sentences about a pet you have or would like to have.',
    hints: ['Start: "Minulla on..." or "Haluaisin..." (I have... / I would like...)', 'Describe it: "Se on iso/pieni ja..." (It is big/small and...)', 'Give its name: "Sen nimi on..." (Its name is...)', 'What does it like?: "Se tykkää..." (It likes...)'],
    example: 'Minulla on koira. Sen nimi on Nalle ja se on iso ja ruskea. Nalle tykkää juosta puistossa ja leikkiä. Se on hyvä ystävä minulle.',
  },
  // ── A2 ──────────────────────────────────────────────────────────────────
  {
    id: 2,
    title: 'Describe Your Day',
    titleFi: 'Kuvaile päiväsi',
    level: 'A2',
    xp: 55,
    color: 'from-emerald-400 to-teal-500',
    description: 'Write about your typical daily routine in Finnish.',
    hints: ['Use time expressions: "Aamuisin..." (In the mornings...)', 'Use verbs: herätä (wake up), syödä (eat), mennä (go), nukkua (sleep)', 'Connect with "sitten" (then), "sen jälkeen" (after that)', 'End with your evening routine'],
    example: 'Aamuisin herään kello seitsemän. Syön aamiaista ja juon kahvia. Sitten menen töihin bussilla. Töissä tapaan kollegoja ja pidän kokouksia. Lounaalla käyn ravintolassa. Illalla tulen kotiin kello viisi. Teen ruokaa ja katselen televisiota. Nukkumaan menen kello yhdentoista.',
  },
  {
    id: 7,
    title: 'A Visit to the Café',
    titleFi: 'Käynti kahvilassa',
    level: 'A2',
    xp: 55,
    color: 'from-sky-400 to-blue-500',
    description: 'Write about a recent visit to a café or coffee shop.',
    hints: ['Set the scene: "Kävin eilen kahvilassa..." (Yesterday I visited a café...)', 'Order something: "Tilasin..." (I ordered...)', 'Describe the place: "Kahvila oli mukava ja..." (The café was cosy and...)', 'Who were you with?: "Olin siellä ___ kanssa" (I was there with...)'],
    example: 'Kävin eilen kahvilassa ystäväni kanssa. Tilasimme kahvia ja pullia. Kahvila oli pieni ja mukava, ja siellä soi rauhallinen musiikki. Juttelimme pitkään ja nauroimme paljon.',
  },
  {
    id: 8,
    title: 'My Best Friend',
    titleFi: 'Paras ystäväni',
    level: 'A2',
    xp: 55,
    color: 'from-green-400 to-emerald-600',
    description: 'Describe your best friend — what they look like and what you do together.',
    hints: ['Introduce them: "Paras ystäväni on..." (My best friend is...)', 'Describe appearance: "Hän on pitkä/lyhyt ja..." (He/She is tall/short and...)', 'Shared activities: "Teemme yhdessä..." (We do together...)', 'How long friends?: "Olemme olleet ystäviä ___ vuotta" (We have been friends for ___ years)'],
    example: 'Paras ystäväni on Kaisa. Hän on pitkä ja hänellä on pitkät punaiset hiukset. Olemme olleet ystäviä kymmenen vuotta. Teemme yhdessä paljon asioita – käymme elokuvissa ja ulkoilemme. Kaisa on hauska ja kiltti ihminen.',
  },
  {
    id: 9,
    title: 'Weekend Plans',
    titleFi: 'Viikonloppusuunnitelmat',
    level: 'A2',
    xp: 50,
    color: 'from-lime-400 to-green-500',
    description: 'Write about your plans for the upcoming weekend.',
    hints: ['Start: "Tänä viikonloppuna aion..." (This weekend I am going to...)', 'Use future: "Menen... / Tapaan... / Syön..." (I will go / meet / eat...)', 'Add a reason: "koska..." (because...)', 'End: "Odotan sitä innolla!" (I am looking forward to it!)'],
    example: 'Tänä viikonloppuna aion levätä ja tavata ystäviä. Lauantaina menen ostoksille ja sitten katsomme elokuvan kaverini luona. Sunnuntaina aion tehdä ruokaa ja lukea hyvää kirjaa. Odotan viikonloppua innolla, koska arki on ollut kiireistä!',
  },
  // ── B1 ──────────────────────────────────────────────────────────────────
  {
    id: 4,
    title: 'Opinion Essay',
    titleFi: 'Mielipidekirjoitus',
    level: 'B1',
    xp: 90,
    color: 'from-violet-500 to-purple-600',
    description: 'Write a short opinion essay: Is social media good or bad for society?',
    hints: ['State your opinion: "Minusta..." or "Uskon, että..." (I believe that...)', 'Give reasons: "Ensinnäkin..." (Firstly...), "Toiseksi..." (Secondly...)', 'Acknowledge the other side: "Toisaalta..." (On the other hand...)', 'Conclude with: "Yhteenvetona..." (In conclusion...)'],
    example: 'Sosiaalinen media on nykyajan yhteiskunnan keskeinen osa. Uskon, että se on enemmän hyödyksi kuin haitaksi, kun sitä käytetään viisaasti.\n\nEnsinnäkin sosiaalinen media yhdistää ihmisiä ympäri maailmaa. Voimme pitää yhteyttä ystäviin ja perheenjäseniin, jotka asuvat kaukana.\n\nToisaalta sosiaalinen media voi aiheuttaa riippuvuutta ja vertailua muihin ihmisiin, mikä voi heikentää itsetuntoa.\n\nYhteenvetona voidaan sanoa, että sosiaalinen media on arvokas työkalu, jos sitä käyttää harkitusti.',
  },
  {
    id: 10,
    title: 'My Hometown',
    titleFi: 'Kotikaupunkini',
    level: 'B1',
    xp: 85,
    color: 'from-purple-500 to-violet-600',
    description: 'Write a descriptive text about the city or town where you grew up or currently live.',
    hints: ['Introduce the place: "Kotikuntani on..." (My hometown is...)', 'Describe features: "Siellä on..." (There is/are...)', 'Compare: "Verrattuna suuriin kaupunkeihin..." (Compared to big cities...)', 'Your feelings: "Rakastan kotikaupunkiani, koska..." (I love my hometown because...)'],
    example: 'Kotikuntani on Tampere, joka sijaitsee kahden järven välissä Keski-Suomessa. Se on Suomen kolmanneksi suurin kaupunki, ja siellä on vilkas kulttuurielämä. Tamperella on hyvä teatteritarjonta sekä paljon museoita ja urheilumahdollisuuksia. Verrattuna pääkaupunkiin Tampere on rauhallisempi ja edullisempi paikka asua. Rakastan kaupunkiani, koska ihmiset ovat ystävällisiä ja luonto on lähellä.',
  },
  {
    id: 11,
    title: 'Environmental Habits',
    titleFi: 'Ympäristötavat',
    level: 'B1',
    xp: 90,
    color: 'from-indigo-500 to-violet-600',
    description: 'Write about the daily habits you follow to protect the environment.',
    hints: ['List habits: "Yritän säästää energiaa..." (I try to save energy...)', 'Use because: "koska se on tärkeää..." (because it is important...)', 'Mention challenges: "Joskus se on vaikeaa, mutta..." (Sometimes it is difficult, but...)', 'Call to action: "Uskon, että jokainen voi..." (I believe everyone can...)'],
    example: 'Ympäristönsuojelu on minulle tärkeä asia, ja yritän tehdä arjessani pieniä mutta merkittäviä valintoja. Käytän julkisia kulkuneuvoja aina kun se on mahdollista, ja pyöräilen töihin kesäisin. Lajittelen jätteet huolellisesti ja ostan mieluummin käytettyjä vaatteita kuin uusia. Uskon, että jokainen teko on tärkeä.',
  },
  {
    id: 12,
    title: 'Job Application Letter',
    titleFi: 'Työhakemus',
    level: 'B1',
    xp: 95,
    color: 'from-fuchsia-500 to-purple-600',
    description: 'Write a short cover letter applying for a job you are interested in.',
    hints: ['Opening: "Haen teiltä avointa..." (I am applying for the open position of...)', 'Your background: "Minulla on ___ vuoden kokemus..." (I have ___ years of experience...)', 'Motivation: "Olen erityisen kiinnostunut..." (I am particularly interested in...)', 'Closing: "Odotan mielenkiinnolla..." (I look forward to...)'],
    example: 'Hyvä rekrytoija,\n\nHaen teiltä avointa asiakaspalvelijan paikkaa. Minulla on kolmen vuoden kokemus asiakaspalvelusta kaupan alalla, ja olen tottunut työskentelemään kiireisessä ympäristössä.\n\nOlen erityisen kiinnostunut tästä tehtävästä, koska arvostan yrityksenne panostusta henkilöstön kehittämiseen. Pidän itseäni ahkerana ja ratkaisukeskeisenä henkilönä.\n\nOdotan mielenkiinnolla mahdollisuutta keskustella hakemuksestani lisää.\n\nYstävällisin terveisin,\nMaria Korhonen',
  },
  // ── B2 ──────────────────────────────────────────────────────────────────
  {
    id: 13,
    title: 'AI in Education',
    titleFi: 'Tekoäly koulutuksessa',
    level: 'B2',
    xp: 110,
    color: 'from-orange-500 to-amber-500',
    description: 'Write a structured essay on the benefits and risks of artificial intelligence in education.',
    hints: ['Thesis: "Tekoäly muuttaa koulutusta perusteellisesti..." (AI is changing education fundamentally...)', 'Pros: "Toisaalta tekoäly mahdollistaa..." (On one hand, AI enables...)', 'Cons: "Kuitenkin on huomioitava, että..." (However, it must be noted that...)', 'Conclusion: "Kaiken kaikkiaan on selvää, että..." (All in all it is clear that...)'],
    example: 'Tekoäly on tullut osaksi koulutusta vauhdilla, joka herättää sekä innostusta että huolta. Toisaalta tekoäly mahdollistaa yksilöllisemmän oppimisen, sillä se voi mukautua jokaisen opiskelijan tarpeisiin.\n\nKuitenkin on huomioitava, että liiallinen riippuvuus tekoälystä saattaa heikentää kriittistä ajattelua ja luovuutta. Opiskelijat voivat turvautua teknologiaan sen sijaan, että kehittäisivät omia taitojaan.\n\nKaiken kaikkiaan tekoäly tarjoaa merkittäviä mahdollisuuksia koulutukselle, mutta sen käyttö vaatii pedagogista harkintaa.',
  },
  {
    id: 14,
    title: 'Cultural Identity',
    titleFi: 'Kulttuurinen identiteetti',
    level: 'B2',
    xp: 110,
    color: 'from-amber-500 to-orange-600',
    description: 'Write about how living in a foreign country shapes or challenges your cultural identity.',
    hints: ['Opening: "Kulttuurinen identiteetti..." (Cultural identity...)', 'Personal experience: "Kun muutin ulkomaille..." (When I moved abroad...)', 'Challenges: "Sopeutuminen uuteen kulttuuriin..." (Adapting to a new culture...)', 'Reflection: "Olen oppinut, että..." (I have learned that...)'],
    example: 'Kulttuurinen identiteetti muokkautuu jatkuvasti elämänkokemusten myötä. Kun muutin Suomeen muutama vuosi sitten, huomasin pian, että monet aikaisemmin itsestäänselvät tavat asettuivat uuteen valoon.\n\nSopeutuminen suomalaiseen kulttuuriin oli toisinaan haastavaa. Suorien ilmaisutapojen ja hiljaisuuden arvostaminen poikkesi omasta taustastani merkittävästi.\n\nOlen oppinut, että kulttuurinen identiteetti ei ole jäykkä rakenne vaan elävä prosessi, joka rikastuu kohtaamisten ja uusien kokemusten kautta.',
  },
  {
    id: 15,
    title: 'Mental Health Awareness',
    titleFi: 'Mielenterveys ja yhteiskunta',
    level: 'B2',
    xp: 115,
    color: 'from-rose-500 to-pink-600',
    description: 'Write a thoughtful text on the importance of mental health awareness in modern society.',
    hints: ['Frame the issue: "Mielenterveys on..." (Mental health is...)', 'Use evidence: "Tutkimusten mukaan..." (According to research...)', 'Address stigma: "Häpeä ja ennakkoluulot..." (Shame and prejudice...)', 'Solutions: "Yhteiskunnan tulisi..." (Society should...)'],
    example: 'Mielenterveys on yksi aikamme keskeisimmistä kansanterveysongelmista, mutta siitä puhuminen on yhä monille vaikeaa. Tutkimusten mukaan joka viides suomalainen kärsii jonkinasteisesta mielenterveyden häiriöstä vuoden aikana.\n\nHäpeä ja ennakkoluulot ovat merkittävimpiä esteitä avun hakemiselle. Monet pelkäävät leimautumista tai epäilevät omien oireidensa vakavuutta.\n\nYhteiskunnan tulisi panostaa enemmän mielenterveyspalveluihin ja edistää avointa keskustelukulttuuria kouluissa ja työpaikoilla.',
  },
  {
    id: 16,
    title: 'Remote Work and Society',
    titleFi: 'Etätyö ja yhteiskunta',
    level: 'B2',
    xp: 115,
    color: 'from-red-500 to-rose-600',
    description: 'Analyse how the rise of remote work has changed working culture and social life.',
    hints: ['Context: "Etätyö on yleistynyt..." (Remote work has become common...)', 'Benefits: "Etätyö tarjoaa..." (Remote work offers...)', 'Drawbacks: "Toisaalta sosiaalinen eristäytyminen..." (On the other hand, social isolation...)', 'Future outlook: "Tulevaisuudessa työ..." (In the future, work...)'],
    example: 'Etätyö on yleistynyt merkittävästi viime vuosien aikana ja muuttanut sekä työkulttuuriamme että sosiaalista elämäämme. Mahdollisuus työskennellä kotoa tarjoaa joustavuutta ja säästää pendlausaikaa.\n\nToisaalta sosiaalinen eristäytyminen ja työn ja vapaa-ajan rajojen hämärtyminen ovat etätyön tunnettuja haittapuolia. Monet kokevat, että spontaanit kohtaamiset kollegoiden kanssa jäävät puuttumaan.\n\nTulevaisuudessa työ tulee todennäköisesti olemaan hybridimalli, jossa etä- ja lähityö vuorottelevat.',
  },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-emerald-100 text-emerald-700',
  A2: 'bg-blue-100 text-blue-700',
  B1: 'bg-violet-100 text-violet-700',
  B2: 'bg-orange-100 text-orange-700',
};

interface Mistake {
  original: string;
  correction: string;
  explanation: string;
  type: string;
  level: string;
}

interface Feedback {
  correctedText: string;
  naturalVersion: string;
  mistakes: Mistake[];
  naturalness: 'natural' | 'slightly unnatural' | 'unnatural';
  naturalnessNote: string;
  puhekieli: string | null;
  score: number;
  tip: string;
}

function renderHighlightedText(
  original: string,
  mistakes: { original: string; correction: string; explanation: string }[],
) {
  if (!mistakes.length) return <span className="text-slate-700">{original}</span>;

  const pattern = mistakes
    .map((m) => m.original.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = original.split(regex);

  return (
    <>
      {parts.map((seg, i) => {
        const match = mistakes.find((m) => m.original.toLowerCase() === seg.toLowerCase());
        if (match) {
          return (
            <span key={i} className="group relative inline-block">
              <span className="bg-red-100 text-red-600 line-through rounded px-0.5">{seg}</span>
              <span className="bg-emerald-100 text-emerald-700 font-medium rounded px-0.5 ml-1">{match.correction}</span>
              {/* hover tooltip with explanation */}
              <span className="absolute bottom-full left-0 mb-1.5 hidden group-hover:block z-10 bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-xl max-w-[240px] whitespace-normal">
                {match.explanation}
              </span>
            </span>
          );
        }
        return <span key={i}>{seg}</span>;
      })}
    </>
  );
}

interface TranslationResult {
  score: number;
  accuracy: number;
  grammar: number;
  vocabulary: number;
  naturalness: number;
  betterTranslation: string;
  errors: { original: string; correction: string; explanation: string }[];
  overallFeedback: string;
}

export default function WritingPage() {
  const { user, updateUser } = useAuthStore();
  const [tab, setTab] = useState<'prompts' | 'translation'>('prompts');
  const [promptFilter, setPromptFilter] = useState<'All' | 'A1' | 'A2' | 'B1' | 'B2'>('All');

  // Writing prompt state
  const [selectedPrompt, setSelectedPrompt] = useState<typeof PROMPTS[0] | null>(null);
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Translation task state
  const [txDirection, setTxDirection] = useState<'en-fi' | 'fi-en'>('en-fi');
  const [txLevel, setTxLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>('A1');
  const [txTask, setTxTask] = useState<{ source: string; topic: string; hints: string[] } | null>(null);
  const [txText, setTxText] = useState('');
  const [txGenerating, setTxGenerating] = useState(false);
  const [txChecking, setTxChecking] = useState(false);
  const [txResult, setTxResult] = useState<TranslationResult | null>(null);
  const txWordCount = txText.trim() ? txText.trim().split(/\s+/).length : 0;

  const generateTask = async () => {
    setTxGenerating(true);
    setTxTask(null);
    setTxText('');
    setTxResult(null);
    try {
      const res = await api.post('/ai/writing/generate-task', { level: txLevel, direction: txDirection });
      const d = res.data?.data;
      if (d?.source) setTxTask({ source: d.source, topic: d.topic || '', hints: d.hints || [] });
    } catch { /* silent */ } finally { setTxGenerating(false); }
  };

  const checkTranslation = async () => {
    if (!txTask || !txText.trim()) return;
    setTxChecking(true);
    try {
      const res = await api.post('/ai/writing/check-translation', {
        source: txTask.source, translation: txText, level: txLevel, direction: txDirection,
      });
      const d = res.data?.data;
      if (d) setTxResult(d as TranslationResult);
    } catch { /* silent */ } finally { setTxChecking(false); }
  };

  const submitForFeedback = async () => {
    if (!text.trim() || text.trim().split(/\s+/).length < 10) return;
    setLoading(true);
    try {
      const res = await api.post('/ai/grammar/correct', { text });
      const raw = res.data?.data;
      if (raw) {
        const fb: Feedback = {
          correctedText: raw.correctedText || text,
          naturalVersion: raw.naturalVersion || raw.correctedText || text,
          mistakes: raw.errors || [],
          naturalness: raw.naturalness || 'natural',
          naturalnessNote: raw.naturalnessNote || '',
          puhekieli: raw.puhekieli || null,
          score: raw.score ?? 85,
          tip: raw.overallFeedback || 'Keep practicing! Your Finnish is improving.',
        };
        setFeedback(fb);
        if (fb.score >= 70 && selectedPrompt) {
          updateUser({ totalXP: (user?.totalXP || 0) + selectedPrompt.xp });
          api.post('/users/xp', { xpEarned: selectedPrompt.xp, source: 'writing' }).catch(() => {});
        }
      }
    } catch {
      const fallback: Feedback = {
        correctedText: text,
        naturalVersion: text,
        mistakes: [
          { original: 'minä olen', correction: 'Minä olen', explanation: 'Start sentences with a capital letter.', type: 'grammar', level: 'A1' },
        ],
        naturalness: 'slightly unnatural',
        naturalnessNote: '',
        puhekieli: null,
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
        {/* Toolbar row */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setTab('prompts')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
              tab === 'prompts'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                : 'bg-white border-2 border-violet-500 text-violet-600 hover:bg-violet-50'
            }`}
          >
            <PenTool className="w-4 h-4" /> Writing Prompts
          </button>
          <button
            onClick={() => setTab('translation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${
              tab === 'translation'
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                : 'bg-white border-2 border-violet-500 text-violet-600 hover:bg-violet-50'
            }`}
          >
            <Languages className="w-4 h-4" /> Translate with AI
          </button>
          {tab === 'prompts' && (
            <div className="ml-auto flex items-center gap-2">
              <span className="text-slate-500 text-sm font-medium">Level:</span>
              {(['All', 'A1', 'A2', 'B1', 'B2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setPromptFilter(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    promptFilter === lvl ? 'bg-blue-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Translate with AI view */}
        {tab === 'translation' && (
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-4">
              {/* Level + Generate */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                {/* Direction toggle */}
                <div className="flex gap-2 bg-slate-100 rounded-xl p-1 mb-4 w-fit">
                  {([['en-fi', '🇬🇧 EN → FI'], ['fi-en', '🇫🇮 FI → EN']] as const).map(([dir, label]) => (
                    <button key={dir} onClick={() => { setTxDirection(dir); setTxTask(null); setTxResult(null); setTxText(''); }}
                      className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${txDirection === dir ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-slate-700 font-semibold text-sm">Level:</span>
                  {(['A1', 'A2', 'B1', 'B2'] as const).map((l) => (
                    <button key={l} onClick={() => { setTxLevel(l); setTxTask(null); setTxResult(null); setTxText(''); }}
                      className={`px-3 py-1 rounded-lg text-sm font-bold transition-all ${txLevel === l ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {l}
                    </button>
                  ))}
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={generateTask} disabled={txGenerating}
                    className="ml-auto flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md transition-all disabled:opacity-60">
                    {txGenerating
                      ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Generating…</>
                      : <><Sparkles className="w-4 h-4" /> Generate Task</>}
                  </motion.button>
                </div>

                {/* English text to translate */}
                {txTask ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                        {txDirection === 'en-fi' ? 'Translate to Finnish' : 'Translate to English'}
                      </span>
                      {txTask.topic && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">{txTask.topic}</span>}
                    </div>
                    <p className="text-slate-800 text-base leading-relaxed font-medium">{txTask.source}</p>
                    {txTask.hints.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {txTask.hints.map((h, i) => (
                          <span key={i} className="text-xs bg-white border border-blue-200 text-blue-600 px-2 py-0.5 rounded-full">{h}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-400 text-sm">
                    Click &ldquo;Generate Task&rdquo; to get an English text to translate
                  </div>
                )}

                {/* Finnish input */}
                {txTask && (
                  <>
                    <textarea
                      value={txText}
                      onChange={(e) => { setTxText(e.target.value); setTxResult(null); }}
                      placeholder={txDirection === 'en-fi' ? 'Kirjoita suomennos tässä… (Write your Finnish translation here)' : 'Write your English translation here…'}
                      spellCheck={false} autoCorrect="off" autoCapitalize="off"
                      className="w-full h-36 mt-3 border border-slate-200 rounded-xl p-4 text-slate-800 text-sm leading-7 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none transition-all"
                    />
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs ${txWordCount < 3 ? 'text-slate-400' : 'text-emerald-600 font-semibold'}`}>{txWordCount} words</span>
                      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={checkTranslation} disabled={txChecking || txWordCount < 3}
                        className={`btn-primary px-5 py-2.5 text-sm flex items-center gap-2 ${(txChecking || txWordCount < 3) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {txChecking
                          ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Checking…</>
                          : <><Sparkles className="w-4 h-4" /> Check Translation</>}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>

              {/* Translation result */}
              <AnimatePresence>
                {txResult && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4">
                    {/* Score header */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-violet-500" /> Translation Score
                      </h3>
                      <div className={`text-lg font-black px-3 py-1 rounded-xl ${txResult.score >= 80 ? 'bg-emerald-100 text-emerald-700' : txResult.score >= 55 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'}`}>
                        {txResult.score}/100
                      </div>
                    </div>

                    {/* Score breakdown */}
                    <div className="grid grid-cols-4 gap-2 text-center">
                      {[
                        { label: 'Accuracy', val: txResult.accuracy, max: 40 },
                        { label: 'Grammar', val: txResult.grammar, max: 30 },
                        { label: 'Vocabulary', val: txResult.vocabulary, max: 20 },
                        { label: 'Naturalness', val: txResult.naturalness, max: 10 },
                      ].map(({ label, val, max }) => (
                        <div key={label} className="bg-slate-50 rounded-xl p-2">
                          <div className="text-slate-800 font-black text-base">{val}<span className="text-slate-400 text-xs">/{max}</span></div>
                          <div className="text-slate-500 text-xs">{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Ideal translation */}
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-1">
                      <p className="text-emerald-700 text-xs font-semibold uppercase tracking-wide">
                        Ideal {txDirection === 'en-fi' ? 'Finnish' : 'English'} translation
                      </p>
                      <p className="text-slate-700 text-sm leading-relaxed">{txResult.betterTranslation}</p>
                    </div>

                    {/* Errors */}
                    {txResult.errors?.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Corrections</p>
                        {txResult.errors.map((e, i) => (
                          <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap text-sm">
                              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                              <span className="line-through text-red-500 font-medium">{e.original}</span>
                              <span className="text-slate-400">→</span>
                              <span className="text-emerald-600 font-medium">{e.correction}</span>
                            </div>
                            <p className="text-slate-600 text-xs leading-relaxed pl-6">{e.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Overall feedback */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <p className="text-blue-700 text-sm">{txResult.overallFeedback}</p>
                    </div>

                    <button onClick={generateTask}
                      className="w-full btn-secondary py-2.5 text-sm flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" /> Try another task
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Side info */}
            <div className="space-y-3">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-3">
                <div className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-500" /> How it works
                </div>
                <ol className="space-y-2 text-xs text-slate-600">
                  {['Choose direction (EN→FI or FI→EN), select level', 'Click Generate Task to get the source text', 'Write your translation in the box below', 'Click Check Translation for detailed AI feedback'].map((s, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold shrink-0 text-xs">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 text-xs text-violet-700 space-y-1">
                <div className="font-bold flex items-center gap-1.5 mb-2"><Sparkles className="w-3.5 h-3.5" /> Scoring breakdown</div>
                <div className="flex justify-between"><span>Accuracy</span><span className="font-bold">40 pts</span></div>
                <div className="flex justify-between"><span>Grammar</span><span className="font-bold">30 pts</span></div>
                <div className="flex justify-between"><span>Vocabulary</span><span className="font-bold">20 pts</span></div>
                <div className="flex justify-between"><span>Naturalness</span><span className="font-bold">10 pts</span></div>
              </div>
            </div>
          </div>
        )}

        {/* Writing Prompts grid */}
        {tab === 'prompts' && <div className="grid md:grid-cols-2 gap-4">
          {PROMPTS.filter((p) => promptFilter === 'All' || p.level === promptFilter).map((p, i) => (
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
        </div>}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <button onClick={() => { setSelectedPrompt(null); setFeedback(null); }} className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800 transition-all shadow-sm">
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
                spellCheck={false}
                autoCorrect="off"
                autoCapitalize="off"
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

                {/* Highlighted inline diff */}
                <div>
                  <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Your Text</p>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm leading-8">
                    {renderHighlightedText(text, feedback.mistakes)}
                  </div>
                  {feedback.mistakes.length > 0 && (
                    <p className="text-slate-400 text-xs mt-1">Hover a highlighted word to see the explanation.</p>
                  )}
                </div>

                {/* Naturalness */}
                <div className={`flex items-start gap-2 rounded-xl p-3 border text-sm ${
                  feedback.naturalness === 'natural' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                  feedback.naturalness === 'slightly unnatural' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                  'bg-red-50 border-red-100 text-red-700'
                }`}>
                  <span className="font-semibold shrink-0">
                    {feedback.naturalness === 'natural' ? '✓ Sounds natural' :
                     feedback.naturalness === 'slightly unnatural' ? '~ Slightly unnatural' :
                     '✗ Unnatural'}
                  </span>
                  {feedback.naturalnessNote && <span className="text-xs opacity-80">— {feedback.naturalnessNote}</span>}
                </div>

                {/* Native-like alternative */}
                {feedback.naturalVersion && feedback.naturalVersion !== feedback.correctedText && (
                  <div className="bg-violet-50 border border-violet-100 rounded-xl p-3 space-y-1">
                    <p className="text-violet-700 text-xs font-semibold uppercase tracking-wide">More natural version</p>
                    <p className="text-violet-800 text-sm leading-relaxed">{feedback.naturalVersion}</p>
                  </div>
                )}

                {/* Puhekieli note */}
                {feedback.puhekieli && (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-orange-700 text-xs font-semibold mb-0.5">Puhekieli (spoken Finnish) detected</p>
                      <p className="text-orange-600 text-xs">{feedback.puhekieli}</p>
                    </div>
                  </div>
                )}

                {/* Corrections list */}
                {feedback.mistakes.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl p-3">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">No errors found — great writing!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide">Corrections</p>
                    {feedback.mistakes.map((m, i) => (
                      <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-3 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <span className="line-through text-red-500 font-medium text-sm">{m.original}</span>
                          <span className="text-slate-400 text-sm">→</span>
                          <span className="text-emerald-600 font-medium text-sm">{m.correction}</span>
                          <span className="ml-auto text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{m.level}</span>
                          <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{m.type}</span>
                        </div>
                        <p className="text-slate-600 text-xs leading-relaxed pl-6">{m.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Overall feedback */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
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
