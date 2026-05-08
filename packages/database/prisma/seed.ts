import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import { PrismaClient, FinnishLevel, LessonType, ExerciseType, Difficulty, AchievementType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding FinnMate database...');

  // ─── ACHIEVEMENTS ──────────────────────────────────────────────────────────
  console.log('  → Seeding achievements...');
  const achievements = await Promise.all([
    prisma.achievement.upsert({ where: { id: 'ach-first-step' }, update: {}, create: { id: 'ach-first-step', title: 'First Step', description: 'Complete your first lesson', iconUrl: '🎯', type: AchievementType.LESSON_COUNT, threshold: 1, xpReward: 50 } }),
    prisma.achievement.upsert({ where: { id: 'ach-week-warrior' }, update: {}, create: { id: 'ach-week-warrior', title: 'Week Warrior', description: 'Maintain a 7-day streak', iconUrl: '🔥', type: AchievementType.STREAK, threshold: 7, xpReward: 100 } }),
    prisma.achievement.upsert({ where: { id: 'ach-month-master' }, update: {}, create: { id: 'ach-month-master', title: 'Month Master', description: 'Maintain a 30-day streak', iconUrl: '⚡', type: AchievementType.STREAK, threshold: 30, xpReward: 500 } }),
    prisma.achievement.upsert({ where: { id: 'ach-vocab-100' }, update: {}, create: { id: 'ach-vocab-100', title: 'Vocabulary Builder', description: 'Learn 100 Finnish words', iconUrl: '📚', type: AchievementType.VOCABULARY_MASTER, threshold: 100, xpReward: 200 } }),
    prisma.achievement.upsert({ where: { id: 'ach-xp-1000' }, update: {}, create: { id: 'ach-xp-1000', title: 'XP Milestone', description: 'Earn 1,000 XP', iconUrl: '⭐', type: AchievementType.XP_MILESTONE, threshold: 1000, xpReward: 100 } }),
    prisma.achievement.upsert({ where: { id: 'ach-perfect' }, update: {}, create: { id: 'ach-perfect', title: 'Perfectionist', description: 'Score 100% on a lesson', iconUrl: '💯', type: AchievementType.PERFECT_SCORE, threshold: 1, xpReward: 75 } }),
    prisma.achievement.upsert({ where: { id: 'ach-yki-pass' }, update: {}, create: { id: 'ach-yki-pass', title: 'YKI Ready', description: 'Pass a mock YKI exam', iconUrl: '🎓', type: AchievementType.EXAM_PASS, threshold: 1, xpReward: 300 } }),
    prisma.achievement.upsert({ where: { id: 'ach-level-up' }, update: {}, create: { id: 'ach-level-up', title: 'Level Up!', description: 'Advance to a new Finnish level', iconUrl: '📈', type: AchievementType.LEVEL_UP, threshold: 1, xpReward: 250 } }),
  ]);
  console.log(`  ✓ ${achievements.length} achievements`);

  // ─── VOCABULARY WORDS ─────────────────────────────────────────────────────
  console.log('  → Seeding vocabulary...');

  const vocabData = [
    // ── Greetings (A1) ──
    { finnish: 'Hei',            english: 'Hi',                              pronunciation: 'HEY',              partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hei! Mitä kuuluu?',                   exampleTranslation: 'Hi! How are you?' },
    { finnish: 'Moi',            english: 'Hi',                              pronunciation: 'MOI',              partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Moi, miten menee?',                   exampleTranslation: "Hi, how's it going?" },
    { finnish: 'Moikka',         english: 'Hey / Bye',                       pronunciation: 'MOIK-ka',          partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Moikka! Nähdään pian.',                exampleTranslation: 'Hey! See you soon.' },
    { finnish: 'Terve',          english: 'Hello',                           pronunciation: 'TER-ve',           partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Terve, olen Matti.',                   exampleTranslation: "Hello, I'm Matti." },
    { finnish: 'Heippa',         english: 'Bye',                             pronunciation: 'HEIP-pa',          partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Heippa! Hyvää viikonloppua!',         exampleTranslation: 'Bye! Have a good weekend!' },
    { finnish: 'Näkemiin',       english: 'Goodbye',                         pronunciation: 'NA-ke-miin',       partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Näkemiin huomenna!',                   exampleTranslation: 'Goodbye, see you tomorrow!' },
    { finnish: 'Hyvää huomenta', english: 'Good morning',                    pronunciation: 'HU-vaa HUO-men-ta',partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää huomenta, Maria!',              exampleTranslation: 'Good morning, Maria!' },
    { finnish: 'Hyvää päivää',   english: 'Good day',                        pronunciation: 'HU-vaa PAI-vaa',   partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää päivää, olen Matti.',            exampleTranslation: "Good day, I'm Matti." },
    { finnish: 'Hyvää iltaa',    english: 'Good evening',                    pronunciation: 'HU-vaa IL-taa',    partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää iltaa kaikille!',                exampleTranslation: 'Good evening everyone!' },
    { finnish: 'Hyvää yötä',     english: 'Good night',                      pronunciation: 'HU-vaa YÖ-taa',    partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää yötä! Nukutaan hyvin.',         exampleTranslation: 'Good night! Sleep well.' },
    { finnish: 'Kiitos',         english: 'Thank you',                       pronunciation: 'KII-tos',          partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Kiitos paljon!',                       exampleTranslation: 'Thank you very much!' },
    { finnish: 'Kiitti',         english: 'Thanks',                          pronunciation: 'KIIT-ti',          partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Kiitti avusta!',                       exampleTranslation: 'Thanks for the help!' },
    { finnish: 'Ole hyvä',       english: "You're welcome / Here you are",   pronunciation: 'O-le HU-vaa',      partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Ole hyvä, ei mitään!',                 exampleTranslation: "You're welcome, no problem!" },
    { finnish: 'Anteeksi',       english: 'Sorry / Excuse me',               pronunciation: 'AN-teek-si',       partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Anteeksi, missä on pankki?',           exampleTranslation: 'Excuse me, where is the bank?' },
    { finnish: 'Mitä kuuluu?',   english: 'How are you?',                    pronunciation: 'MI-taa KUU-luu',   partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hei! Mitä kuuluu?',                   exampleTranslation: 'Hi! How are you?' },
    { finnish: 'Hyvää kuuluu',   english: "I'm fine",                        pronunciation: 'HU-vaa KUU-luu',   partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää kuuluu, kiitos!',                exampleTranslation: "I'm fine, thank you!" },
    { finnish: 'Entä sinulle?',  english: 'And you?',                        pronunciation: 'EN-taa SI-nul-le', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää kuuluu. Entä sinulle?',          exampleTranslation: "I'm fine. And you?" },
    { finnish: 'Hauska tavata',  english: 'Nice to meet you',                pronunciation: 'HAUS-ka TA-va-ta', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hauska tavata, olen Liisa.',           exampleTranslation: "Nice to meet you, I'm Liisa." },
    { finnish: 'Nähdään',        english: 'See you',                         pronunciation: 'NAH-daan',         partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Nähdään huomenna!',                    exampleTranslation: 'See you tomorrow!' },
    { finnish: 'Moi moi',        english: 'Bye bye',                         pronunciation: 'MOI MOI',          partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Moi moi! Hyvää päivänjatkoa!',        exampleTranslation: 'Bye bye! Have a good rest of the day!' },

    // ── Greetings (A2) ──
    { finnish: 'Miten menee?',                english: "How's it going?",                  pronunciation: 'MI-ten ME-nee',             partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Hei! Miten menee?',                        exampleTranslation: "Hi! How's it going?" },
    { finnish: 'Mitäs kuuluu?',               english: "What's up?",                       pronunciation: 'MI-taas KUU-luu',           partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Mitäs kuuluu? Kauan ei näy!',              exampleTranslation: "What's up? Long time no see!" },
    { finnish: 'Kuinka voit?',                english: 'How are you feeling?',              pronunciation: 'KUIN-ka VOIT',              partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Kuinka voit tänään?',                       exampleTranslation: 'How are you feeling today?' },
    { finnish: 'Tervetuloa',                  english: 'Welcome',                           pronunciation: 'TER-ve-tu-loa',             partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Tervetuloa Suomeen!',                       exampleTranslation: 'Welcome to Finland!' },
    { finnish: 'Hauska nähdä pitkästä aikaa', english: 'Nice to see you after a long time', pronunciation: 'HAUS-ka NAH-daa PIT-kaas-ta AI-kaa', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Hauska nähdä pitkästä aikaa!', exampleTranslation: 'Nice to see you after a long time!' },
    { finnish: 'Hauska tutustua',             english: 'Nice to get to know you',           pronunciation: 'HAUS-ka TU-tus-tua',        partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Hauska tutustua, olen Mikko.',             exampleTranslation: "Nice to get to know you, I'm Mikko." },
    { finnish: 'Hyvää viikonloppua',          english: 'Have a nice weekend',               pronunciation: 'HU-vaa VII-kon-lop-pua',    partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Hyvää viikonloppua kaikille!',             exampleTranslation: 'Have a nice weekend everyone!' },
    { finnish: 'Hyvää matkaa',               english: 'Have a good trip',                  pronunciation: 'HU-vaa MAT-kaa',            partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Hyvää matkaa! Tule pian takaisin.',        exampleTranslation: 'Have a good trip! Come back soon.' },
    { finnish: 'Onnea!',                      english: 'Congratulations!',                  pronunciation: 'ON-ne-a',                   partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Onnea syntymäpäiväsi!',                    exampleTranslation: 'Congratulations on your birthday!' },
    { finnish: 'Paljon onnea',               english: 'Many congratulations',              pronunciation: 'PAL-yon ON-ne-a',           partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Paljon onnea uudesta työstä!',             exampleTranslation: 'Many congratulations on the new job!' },
    { finnish: 'Onneksi olkoon',             english: 'Congratulations',                   pronunciation: 'ON-nek-si OL-koon',         partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Onneksi olkoon! Olet ansainnut sen.',      exampleTranslation: 'Congratulations! You have earned it.' },
    { finnish: 'Ei kestä',                   english: 'No problem',                        pronunciation: 'EI KES-taa',                partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: '— Kiitos! — Ei kestä.',                    exampleTranslation: '— Thank you! — No problem.' },
    { finnish: 'Ei mitään',                  english: "It's nothing",                      pronunciation: 'EI MI-taan',                partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: '— Kiitti avusta! — Ei mitään.',            exampleTranslation: "— Thanks for the help! — It's nothing." },
    { finnish: 'Kuulemiin',                  english: 'Goodbye (on phone)',                pronunciation: 'KUU-le-miin',               partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Okei, kuulemiin sitten!',                  exampleTranslation: 'Okay, goodbye then!' },
    { finnish: 'Pidä huolta',               english: 'Take care',                         pronunciation: 'PI-daa HUOL-ta',            partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Pidä huolta itsestäsi!',                   exampleTranslation: 'Take care of yourself!' },
    { finnish: 'Tsemppiä!',                  english: 'Good luck / You got this',          pronunciation: 'TSEMP-pi-aa',               partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Tsemppiä kokeeseen!',                      exampleTranslation: 'Good luck on the exam!' },
    { finnish: 'Nauti päivästäsi',           english: 'Enjoy your day',                    pronunciation: 'NAU-ti PAI-vaas-ta-si',     partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Nauti päivästäsi, hei hei!',               exampleTranslation: 'Enjoy your day, bye bye!' },
    { finnish: 'Hyvää päivänjatkoa',         english: 'Have a nice rest of the day',       pronunciation: 'HU-vaa PAI-van-yat-koa',    partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A2, exampleSentence: 'Kiitos käynnistä! Hyvää päivänjatkoa.',   exampleTranslation: 'Thanks for coming! Have a nice rest of the day.' },

    // ── Greetings (B1) ──
    { finnish: 'Mitä uutta?',                 english: "What's new?",                       pronunciation: 'MI-taa UUT-ta',                 partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Hei! Mitä uutta sinulle kuuluu?',               exampleTranslation: "Hi! What's new with you?" },
    { finnish: 'Kuinka elämä sujuu?',          english: "How's life going?",                 pronunciation: 'KUIN-ka E-laa-maa SU-yuu',      partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Kauan ei näy — kuinka elämä sujuu?',            exampleTranslation: "Long time no see — how's life going?" },
    { finnish: 'Mitä sinulle kuuluu nykyään?', english: 'How have you been lately?',         pronunciation: 'MI-taa SI-nul-le KUU-luu NU-ku-aan', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Mitä sinulle kuuluu nykyään?',            exampleTranslation: 'How have you been lately?' },
    { finnish: 'Hauska kuulla sinusta',        english: 'Nice to hear from you',             pronunciation: 'HAUS-ka KUUL-la SI-nus-ta',     partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Hauska kuulla sinusta! Kauan ei ole kuulunut.', exampleTranslation: "Nice to hear from you! It's been a while." },
    { finnish: 'Kiva nähdä taas',             english: 'Nice to see you again',             pronunciation: 'KI-va NAH-daa TAAS',            partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Kiva nähdä taas! Missä olet ollut?',            exampleTranslation: 'Nice to see you again! Where have you been?' },
    { finnish: 'Terveisiä!',                  english: 'Greetings!',                        pronunciation: 'TER-vei-si-aa',                 partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Terveisiä kaikille kotona!',                    exampleTranslation: 'Greetings to everyone at home!' },
    { finnish: 'Lähetän terveisiä',           english: 'I send greetings',                  pronunciation: 'LA-he-taan TER-vei-si-aa',      partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Lähetän terveisiä Helsingistä.',               exampleTranslation: 'I send greetings from Helsinki.' },
    { finnish: 'Oikein hyvää päivää',         english: 'Very good day to you',              pronunciation: 'OI-kein HU-vaa PAI-vaa',        partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Oikein hyvää päivää teille!',                  exampleTranslation: 'Very good day to you all!' },
    { finnish: 'Ilo tavata',                  english: 'A pleasure to meet you',            pronunciation: 'I-lo TA-va-ta',                 partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Ilo tavata, olen johtaja Mäkinen.',             exampleTranslation: 'A pleasure to meet you, I am Director Mäkinen.' },
    { finnish: 'Toivottavasti voit hyvin',    english: 'Hope you are well',                 pronunciation: 'TOI-vot-ta-vas-ti VOIT HU-vin', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Toivottavasti voit hyvin!',                    exampleTranslation: 'Hope you are well!' },
    { finnish: 'Mukava tavata',               english: 'Nice to meet you',                  pronunciation: 'MU-ka-va TA-va-ta',             partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Mukava tavata, olen kuullut paljon sinusta.',   exampleTranslation: "Nice to meet you, I've heard a lot about you." },
    { finnish: 'Kiitos kutsusta',             english: 'Thanks for the invitation',         pronunciation: 'KII-tos KUT-sus-ta',            partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Kiitos kutsusta! Tulen mielelläni.',            exampleTranslation: 'Thanks for the invitation! I would love to come.' },
    { finnish: 'Nähdään pian',                english: 'See you soon',                      pronunciation: 'NAH-daan PI-an',                partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Oli mukava tavata — nähdään pian!',             exampleTranslation: 'It was nice meeting — see you soon!' },
    { finnish: 'Palaillaan asiaan',           english: "We'll get back to this",            pronunciation: 'PA-lail-laan A-si-aan',         partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Palaillaan asiaan ensi viikolla.',              exampleTranslation: "We'll get back to this next week." },
    { finnish: 'Hauskaa päivänjatkoa',        english: 'Have a pleasant rest of the day',   pronunciation: 'HAUS-kaa PAI-van-yat-koa',      partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B1, exampleSentence: 'Hauskaa päivänjatkoa! Nähdään huomenna.',       exampleTranslation: 'Have a pleasant rest of the day! See you tomorrow.' },

    // ── Greetings (B2) ──
    { finnish: 'Miten olet viihtynyt?',              english: 'How have you been enjoying yourself?',      pronunciation: 'MI-ten O-let VIIH-tu-nut',               partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Miten olet viihtynyt uudessa kaupungissa?',          exampleTranslation: 'How have you been enjoying yourself in the new city?' },
    { finnish: 'On ilo nähdä sinua jälleen',         english: "It's a pleasure to see you again",          pronunciation: 'ON I-lo NAH-daa SI-nu-a YAL-leen',      partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'On todella ilo nähdä sinua jälleen!',                exampleTranslation: "It's truly a pleasure to see you again!" },
    { finnish: 'Mitä elämässäsi tapahtuu nykyisin?', english: "What's happening in your life these days?", pronunciation: 'MI-taa E-laa-maas-sa-si TA-pah-tuu NU-ku-i-sin', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Mitä elämässäsi tapahtuu nykyisin?',        exampleTranslation: "What's happening in your life these days?" },
    { finnish: 'Tervehdys',                          english: 'Greetings',                                 pronunciation: 'TER-veh-dus',                            partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Tervehdys Helsingistä!',                              exampleTranslation: 'Greetings from Helsinki!' },
    { finnish: 'Sydämellisesti tervetuloa',          english: 'Warmly welcome',                            pronunciation: 'SU-daa-mel-li-ses-ti TER-ve-tu-loa',    partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Sydämellisesti tervetuloa joukkoomme!',               exampleTranslation: 'Warmly welcome to our team!' },
    { finnish: 'Kiitoksia paljon avustasi',          english: 'Thank you very much for your help',         pronunciation: 'KII-tok-si-a PAL-yon A-vus-ta-si',      partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Kiitoksia paljon avustasi tässä asiassa.',           exampleTranslation: 'Thank you very much for your help in this matter.' },
    { finnish: 'Arvostan suuresti apuasi',           english: 'I greatly appreciate your help',            pronunciation: 'AR-vos-tan SUU-res-ti A-pu-a-si',       partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Arvostan suuresti apuasi projektin aikana.',         exampleTranslation: 'I greatly appreciate your help during the project.' },
    { finnish: 'Toivotan sinulle kaikkea hyvää',     english: 'I wish you all the best',                   pronunciation: 'TOI-vo-tan SI-nul-le KAIK-ke-a HU-vaa', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Toivotan sinulle kaikkea hyvää uudessa tehtävässä.', exampleTranslation: 'I wish you all the best in your new role.' },
    { finnish: 'Mukavaa, että pääsit tulemaan',      english: 'Nice that you could come',                  pronunciation: 'MU-ka-vaa ET-taa PAA-sit TU-le-maan',   partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Mukavaa, että pääsit tulemaan tänä iltana!',         exampleTranslation: 'Nice that you could come this evening!' },
    { finnish: 'Oli ilo tavata sinut',               english: 'It was a pleasure meeting you',             pronunciation: 'O-li I-lo TA-va-ta SI-nut',             partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Oli todella ilo tavata sinut tänään.',               exampleTranslation: 'It was truly a pleasure meeting you today.' },
    { finnish: 'Hyvää jatkoa',                       english: 'All the best going forward',                pronunciation: 'HU-vaa YAT-ko-a',                        partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Hyvää jatkoa sinulle uudessa elämänvaiheessa!',      exampleTranslation: 'All the best going forward in your new chapter of life!' },
    { finnish: 'Voikaa hyvin',                       english: 'Farewell / Stay well',                      pronunciation: 'VOI-kaa HU-vin',                         partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Voikaa hyvin ja pitäkää yhteyttä.',                  exampleTranslation: 'Stay well and keep in touch.' },
    { finnish: 'Toivon sinulle menestystä',          english: 'I wish you success',                        pronunciation: 'TOI-von SI-nul-le ME-nes-tus-taa',      partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Toivon sinulle menestystä opinnoissasi.',            exampleTranslation: 'I wish you success in your studies.' },
    { finnish: 'Kiitos seurasta',                    english: 'Thanks for the company',                    pronunciation: 'KII-tos SEU-ras-ta',                     partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.B2, exampleSentence: 'Kiitos seurasta — oli mukava ilta!',                 exampleTranslation: 'Thanks for the company — it was a nice evening!' },

    { finnish: 'kyllä', english: 'yes', pronunciation: 'KUL-laa', partOfSpeech: 'adverb', category: 'Basics', level: FinnishLevel.A1, exampleSentence: 'Kyllä, ymmärrän.', exampleTranslation: 'Yes, I understand.' },
    { finnish: 'ei', english: 'no / not', pronunciation: 'EI', partOfSpeech: 'adverb', category: 'Basics', level: FinnishLevel.A1, exampleSentence: 'Ei, kiitos.', exampleTranslation: 'No, thank you.' },

    // ── Numbers (A1) ──
    { finnish: 'yksi', english: 'one', pronunciation: 'UK-si', partOfSpeech: 'numeral', category: 'Numbers', level: FinnishLevel.A1, exampleSentence: 'Haluan yksi kahvi.', exampleTranslation: 'I want one coffee.' },
    { finnish: 'kaksi', english: 'two', pronunciation: 'KAK-si', partOfSpeech: 'numeral', category: 'Numbers', level: FinnishLevel.A1, exampleSentence: 'Minulla on kaksi kissaa.', exampleTranslation: 'I have two cats.' },
    { finnish: 'kolme', english: 'three', pronunciation: 'KOL-me', partOfSpeech: 'numeral', category: 'Numbers', level: FinnishLevel.A1, exampleSentence: 'Kolme euroa, kiitos.', exampleTranslation: 'Three euros, please.' },
    { finnish: 'neljä', english: 'four', pronunciation: 'NEL-yaa', partOfSpeech: 'numeral', category: 'Numbers', level: FinnishLevel.A1, exampleSentence: 'Neljä henkilöä.', exampleTranslation: 'Four people.' },
    { finnish: 'viisi', english: 'five', pronunciation: 'VII-si', partOfSpeech: 'numeral', category: 'Numbers', level: FinnishLevel.A1, exampleSentence: 'Viisi minuuttia.', exampleTranslation: 'Five minutes.' },
    { finnish: 'kymmenen', english: 'ten', pronunciation: 'KUM-me-nen', partOfSpeech: 'numeral', category: 'Numbers', level: FinnishLevel.A1, exampleSentence: 'Kymmenen euroa.', exampleTranslation: 'Ten euros.' },

    // ── Family (A1) ──
    { finnish: 'äiti', english: 'mother', pronunciation: 'AI-ti', partOfSpeech: 'noun', category: 'Family', level: FinnishLevel.A1, exampleSentence: 'Minun äitini on opettaja.', exampleTranslation: 'My mother is a teacher.' },
    { finnish: 'isä', english: 'father', pronunciation: 'I-saa', partOfSpeech: 'noun', category: 'Family', level: FinnishLevel.A1, exampleSentence: 'Isä työskentelee toimistossa.', exampleTranslation: 'Father works in an office.' },
    { finnish: 'veli', english: 'brother', pronunciation: 'VE-li', partOfSpeech: 'noun', category: 'Family', level: FinnishLevel.A1, exampleSentence: 'Minulla on yksi veli.', exampleTranslation: 'I have one brother.' },
    { finnish: 'sisar', english: 'sister', pronunciation: 'SI-sar', partOfSpeech: 'noun', category: 'Family', level: FinnishLevel.A1, exampleSentence: 'Minulla on kaksi sisarta.', exampleTranslation: 'I have two sisters.' },
    { finnish: 'lapsi', english: 'child', pronunciation: 'LAP-si', partOfSpeech: 'noun', category: 'Family', level: FinnishLevel.A1, exampleSentence: 'Lapsi leikkii puistossa.', exampleTranslation: 'The child plays in the park.' },
    { finnish: 'perhe', english: 'family', pronunciation: 'PER-he', partOfSpeech: 'noun', category: 'Family', level: FinnishLevel.A1, exampleSentence: 'Meillä on suuri perhe.', exampleTranslation: 'We have a big family.' },

    // ── Food & Drink (A1) ──
    { finnish: 'ruoka',      english: 'food',       pronunciation: 'RUO-ka',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Ruoka on valmis!',                           exampleTranslation: 'The food is ready!' },
    { finnish: 'juoma',      english: 'drink',      pronunciation: 'YUO-ma',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Haluatko juomaa?',                           exampleTranslation: 'Would you like a drink?' },
    { finnish: 'vesi',       english: 'water',      pronunciation: 'VE-si',        partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Saisinko lasillisen vettä?',                 exampleTranslation: 'Could I have a glass of water?' },
    { finnish: 'maito',      english: 'milk',       pronunciation: 'MAI-to',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Lapsi juo maitoa.',                          exampleTranslation: 'The child drinks milk.' },
    { finnish: 'kahvi',      english: 'coffee',     pronunciation: 'KAH-vi',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Juon kahvia joka aamu.',                     exampleTranslation: 'I drink coffee every morning.' },
    { finnish: 'tee',        english: 'tea',        pronunciation: 'TEE',          partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Haluatko teetä?',                           exampleTranslation: 'Would you like tea?' },
    { finnish: 'leipä',      english: 'bread',      pronunciation: 'LEI-paa',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Ostan tuoretta leipää.',                     exampleTranslation: 'I buy fresh bread.' },
    { finnish: 'voi',        english: 'butter',     pronunciation: 'VOI',          partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Laitan voita leivälle.',                     exampleTranslation: 'I put butter on the bread.' },
    { finnish: 'juusto',     english: 'cheese',     pronunciation: 'YUUS-to',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Haluatko juustoa leivällä?',                 exampleTranslation: 'Would you like cheese on bread?' },
    { finnish: 'muna',       english: 'egg',        pronunciation: 'MU-na',        partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Syön munan aamupalaksi.',                    exampleTranslation: 'I eat an egg for breakfast.' },
    { finnish: 'kana',       english: 'chicken',    pronunciation: 'KA-na',        partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Tänään syömme kanaa.',                       exampleTranslation: 'Today we eat chicken.' },
    { finnish: 'liha',       english: 'meat',       pronunciation: 'LI-ha',        partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'En syö lihaa.',                              exampleTranslation: "I don't eat meat." },
    { finnish: 'kala',       english: 'fish',       pronunciation: 'KA-la',        partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Suomalaiset syövät paljon kalaa.',            exampleTranslation: 'Finns eat a lot of fish.' },
    { finnish: 'riisi',      english: 'rice',       pronunciation: 'RII-si',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Keitan riisiä illalliseksi.',                exampleTranslation: 'I cook rice for dinner.' },
    { finnish: 'pasta',      english: 'pasta',      pronunciation: 'PAS-ta',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Pasta on helppo tehdä.',                     exampleTranslation: 'Pasta is easy to make.' },
    { finnish: 'keitto',     english: 'soup',       pronunciation: 'KEIT-to',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Lohikeitto on herkullista.',                 exampleTranslation: 'Salmon soup is delicious.' },
    { finnish: 'salaatti',   english: 'salad',      pronunciation: 'SA-laat-ti',   partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Syön salaattia lounaalla.',                  exampleTranslation: 'I eat salad at lunch.' },
    { finnish: 'omena',      english: 'apple',      pronunciation: 'O-me-na',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Omena päivässä pitää lääkärin loitolla.',    exampleTranslation: 'An apple a day keeps the doctor away.' },
    { finnish: 'banaani',    english: 'banana',     pronunciation: 'BA-naa-ni',    partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Banaani on makeaa.',                         exampleTranslation: 'Banana is sweet.' },
    { finnish: 'appelsiini', english: 'orange',     pronunciation: 'AP-pel-sii-ni',partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Juon appelsiinimehua aamuisin.',             exampleTranslation: 'I drink orange juice in the mornings.' },
    { finnish: 'peruna',     english: 'potato',     pronunciation: 'PE-ru-na',     partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Peruna on suomalainen peruselintarvike.',    exampleTranslation: 'Potato is a Finnish staple food.' },
    { finnish: 'tomaatti',   english: 'tomato',     pronunciation: 'TO-maat-ti',   partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Laitan tomaattia salaattiin.',               exampleTranslation: 'I put tomato in the salad.' },
    { finnish: 'sipuli',     english: 'onion',      pronunciation: 'SI-pu-li',     partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Sipuli maistuu hyvältä ruoassa.',            exampleTranslation: 'Onion tastes good in food.' },
    { finnish: 'sokeri',     english: 'sugar',      pronunciation: 'SO-ke-ri',     partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Otatko sokeria kahviin?',                    exampleTranslation: 'Do you take sugar in coffee?' },
    { finnish: 'suola',      english: 'salt',       pronunciation: 'SUOL-a',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Lisää vähän suolaa.',                        exampleTranslation: 'Add a little salt.' },
    { finnish: 'jäätelö',    english: 'ice cream',  pronunciation: 'YAA-te-lö',    partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Kesällä syön jäätelöä.',                     exampleTranslation: 'In summer I eat ice cream.' },
    { finnish: 'kakku',      english: 'cake',       pronunciation: 'KAK-ku',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Syntymäpäiväkakku on herkullinen.',          exampleTranslation: 'Birthday cake is delicious.' },
    { finnish: 'suklaa',     english: 'chocolate',  pronunciation: 'SUK-laa',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Pidän suklaasta paljon.',                    exampleTranslation: 'I like chocolate a lot.' },
    { finnish: 'Minulla on nälkä', english: 'I am hungry',     pronunciation: 'MI-nul-la ON NAL-kaa',   partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Minulla on nälkä — mitä on ruoaksi?',   exampleTranslation: "I am hungry — what's for food?" },
    { finnish: 'Minulla on jano',  english: 'I am thirsty',    pronunciation: 'MI-nul-la ON YA-no',     partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Minulla on jano. Saanko vettä?',        exampleTranslation: 'I am thirsty. May I have water?' },
    { finnish: 'Haluan vettä',     english: 'I want water',    pronunciation: 'HA-lu-an VET-taa',       partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Haluan vettä, kiitos.',                  exampleTranslation: 'I want water, please.' },
    { finnish: 'Tämä on hyvää',    english: 'This is good',    pronunciation: 'TAM-aa ON HU-vaa',       partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Tämä on hyvää! Kuka teki tämän?',       exampleTranslation: 'This is good! Who made this?' },
    { finnish: 'Syön aamupalaa',   english: 'I eat breakfast', pronunciation: 'SU-ön AAM-u-pa-laa',     partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Syön aamupalaa kello seitsemän.',        exampleTranslation: "I eat breakfast at seven o'clock." },
    { finnish: 'Syön lounasta',    english: 'I eat lunch',     pronunciation: 'SU-ön LOU-nas-ta',       partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Syön lounasta töissä joka päivä.',       exampleTranslation: 'I eat lunch at work every day.' },
    { finnish: 'Syön illallista',  english: 'I eat dinner',    pronunciation: 'SU-ön IL-lal-lis-ta',    partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Syön illallista perheen kanssa.',        exampleTranslation: 'I eat dinner with the family.' },

    // ── Food & Drink (A2) ──
    { finnish: 'ravintola',        english: 'restaurant',    pronunciation: 'RA-vin-to-la',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Mennään ravintolaan illalliselle.',          exampleTranslation: "Let's go to a restaurant for dinner." },
    { finnish: 'kahvila',          english: 'café',          pronunciation: 'KAH-vi-la',          partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Tavataan kahvilassa kello kaksi.',           exampleTranslation: "Let's meet at the café at two o'clock." },
    { finnish: 'ruokalista',       english: 'menu',          pronunciation: 'RUO-ka-lis-ta',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Saanko ruokalistan?',                        exampleTranslation: 'Can I get the menu?' },
    { finnish: 'annos',            english: 'portion',       pronunciation: 'AN-nos',             partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Annos on todella iso.',                      exampleTranslation: 'The portion is really big.' },
    { finnish: 'jälkiruoka',       english: 'dessert',       pronunciation: 'YAL-ki-ruo-ka',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Jälkiruokana on jäätelöä.',                 exampleTranslation: 'For dessert there is ice cream.' },
    { finnish: 'välipala',         english: 'snack',         pronunciation: 'VA-li-pa-la',        partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Syön välipalana hedelmän.',                 exampleTranslation: 'I eat a fruit as a snack.' },
    { finnish: 'hedelmä',          english: 'fruit',         pronunciation: 'HE-del-maa',         partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Syön hedelmiä joka päivä.',                 exampleTranslation: 'I eat fruit every day.' },
    { finnish: 'vihannes',         english: 'vegetable',     pronunciation: 'VI-han-nes',         partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Vihannekset ovat terveellisiä.',             exampleTranslation: 'Vegetables are healthy.' },
    { finnish: 'naudanliha',       english: 'beef',          pronunciation: 'NAU-dan-li-ha',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Tilaan naudanliha-annoksen.',               exampleTranslation: 'I order a beef dish.' },
    { finnish: 'sianliha',         english: 'pork',          pronunciation: 'SI-an-li-ha',        partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Sianliha on suosittua Suomessa.',           exampleTranslation: 'Pork is popular in Finland.' },
    { finnish: 'makkara',          english: 'sausage',       pronunciation: 'MAK-ka-ra',          partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Grillattu makkara maistuu kesällä.',        exampleTranslation: 'Grilled sausage tastes good in summer.' },
    { finnish: 'lohi',             english: 'salmon',        pronunciation: 'LO-hi',              partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Lohi on suomalainen herkku.',               exampleTranslation: 'Salmon is a Finnish delicacy.' },
    { finnish: 'tonnikala',        english: 'tuna',          pronunciation: 'TON-ni-ka-la',       partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Laitan tonnikalan salaattiin.',             exampleTranslation: 'I put tuna in the salad.' },
    { finnish: 'jogurtti',         english: 'yogurt',        pronunciation: 'YO-gurt-ti',         partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Syön jogurttia aamupalaksi.',               exampleTranslation: 'I eat yogurt for breakfast.' },
    { finnish: 'kerma',            english: 'cream',         pronunciation: 'KER-ma',             partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Lisää kermaa kastikkeeseen.',               exampleTranslation: 'Add cream to the sauce.' },
    { finnish: 'hillo',            english: 'jam',           pronunciation: 'HIL-lo',             partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Laitan hilloa leivälle.',                   exampleTranslation: 'I put jam on the bread.' },
    { finnish: 'hunaja',           english: 'honey',         pronunciation: 'HU-na-ya',           partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Hunaja on luonnollinen makeutusaine.',       exampleTranslation: 'Honey is a natural sweetener.' },
    { finnish: 'mehu',             english: 'juice',         pronunciation: 'ME-hu',              partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Juon appelsiinimehua aamiaisella.',         exampleTranslation: 'I drink orange juice at breakfast.' },
    { finnish: 'limonadi',         english: 'soda',          pronunciation: 'LI-mo-na-di',        partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Haluatko limonadia?',                       exampleTranslation: 'Would you like soda?' },
    { finnish: 'kivennäisvesi',    english: 'mineral water', pronunciation: 'KI-ven-nais-ve-si',  partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Otatko kivennäisvettä vai hanavettä?',      exampleTranslation: 'Do you want mineral water or tap water?' },
    { finnish: 'teelusikka',       english: 'teaspoon',      pronunciation: 'TEE-lu-sik-ka',      partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Lisää yksi teelusikka sokeria.',            exampleTranslation: 'Add one teaspoon of sugar.' },
    { finnish: 'haarukka',         english: 'fork',          pronunciation: 'HAA-ruk-ka',         partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Tarvitsen haarukan.',                       exampleTranslation: 'I need a fork.' },
    { finnish: 'veitsi',           english: 'knife',         pronunciation: 'VEIT-si',            partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Veitsi on pöydällä.',                       exampleTranslation: 'The knife is on the table.' },
    { finnish: 'lusikka',          english: 'spoon',         pronunciation: 'LU-sik-ka',          partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Tarvitsen lusikan keitolle.',               exampleTranslation: 'I need a spoon for the soup.' },
    { finnish: 'lautanen',         english: 'plate',         pronunciation: 'LAU-ta-nen',         partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Lautanen on tyhjä.',                        exampleTranslation: 'The plate is empty.' },
    { finnish: 'kuppi',            english: 'cup',           pronunciation: 'KUP-pi',             partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Juon kahvin kupista.',                      exampleTranslation: 'I drink coffee from a cup.' },
    { finnish: 'lasi',             english: 'glass',         pronunciation: 'LA-si',              partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Täytä lasi vedellä.',                       exampleTranslation: 'Fill the glass with water.' },
    { finnish: 'pullo',            english: 'bottle',        pronunciation: 'PUL-lo',             partOfSpeech: 'noun',   category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Ostan pullon vettä.',                       exampleTranslation: 'I buy a bottle of water.' },
    { finnish: 'Saanko ruokalistan?',     english: 'Can I get the menu?',      pronunciation: 'SAAN-ko RUO-ka-lis-tan',       partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Saanko ruokalistan, kiitos?',                exampleTranslation: 'Can I get the menu, please?' },
    { finnish: 'Haluaisin kahvia',        english: 'I would like coffee',      pronunciation: 'HA-lu-ai-sin KAH-vi-a',        partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Haluaisin kahvia ja pienen kakun.',         exampleTranslation: 'I would like coffee and a small cake.' },
    { finnish: 'Mitä suosittelette?',     english: 'What do you recommend?',   pronunciation: 'MI-taa SU-o-sit-te-let-te',    partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Mitä suosittelette tänään?',                exampleTranslation: 'What do you recommend today?' },
    { finnish: 'Olen kasvissyöjä',        english: 'I am vegetarian',          pronunciation: 'O-len KAS-vis-syö-yaa',        partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Olen kasvissyöjä — onko teillä vegaanisia vaihtoehtoja?', exampleTranslation: 'I am vegetarian — do you have vegan options?' },
    { finnish: 'Tämä on liian suolaista', english: 'This is too salty',        pronunciation: 'TAM-aa ON LII-an SUOL-ais-ta', partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Anteeksi, tämä on liian suolaista.',        exampleTranslation: 'Excuse me, this is too salty.' },
    { finnish: 'Voinko maksaa kortilla?', english: 'Can I pay by card?',       pronunciation: 'VOIN-ko MAK-saa KOR-til-la',   partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Voinko maksaa kortilla vai vain käteisellä?', exampleTranslation: 'Can I pay by card or only cash?' },
    { finnish: 'Lasku, kiitos',           english: 'The bill, please',         pronunciation: 'LAS-ku KII-tos',               partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Lasku, kiitos! Ruoka oli erinomaista.',     exampleTranslation: 'The bill, please! The food was excellent.' },
    { finnish: 'Ruoka oli herkullista',   english: 'The food was delicious',   pronunciation: 'RUO-ka O-li HER-kul-lis-ta',   partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.A2, exampleSentence: 'Ruoka oli herkullista — tulemme uudelleen!', exampleTranslation: 'The food was delicious — we will come again!' },

    // ── Food & Drink (B1) ──
    { finnish: 'ateria',          english: 'meal',             pronunciation: 'A-te-ri-a',          partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Syön kolme ateriaa päivässä.',                  exampleTranslation: 'I eat three meals a day.' },
    { finnish: 'aamiainen',       english: 'breakfast',        pronunciation: 'AA-mi-ai-nen',       partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Aamiainen on päivän tärkein ateria.',           exampleTranslation: 'Breakfast is the most important meal of the day.' },
    { finnish: 'lounas',          english: 'lunch',            pronunciation: 'LOU-nas',            partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Syömme lounaan yhdessä töissä.',                exampleTranslation: 'We eat lunch together at work.' },
    { finnish: 'päivällinen',     english: 'dinner',           pronunciation: 'PAI-val-li-nen',     partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Päivällinen on kello kuusi.',                   exampleTranslation: "Dinner is at six o'clock." },
    { finnish: 'resepti',         english: 'recipe',           pronunciation: 'RE-sep-ti',          partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Voisitko jakaa reseptin?',                      exampleTranslation: 'Could you share the recipe?' },
    { finnish: 'uuni',            english: 'oven',             pronunciation: 'UU-ni',              partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Laitan piirakan uuniin.',                       exampleTranslation: 'I put the pie in the oven.' },
    { finnish: 'paistaa',         english: 'to fry / to bake', pronunciation: 'PAIS-taa',           partOfSpeech: 'verb',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Paistatko kanan uunissa vai pannulla?',         exampleTranslation: 'Do you bake the chicken in the oven or fry it in the pan?' },
    { finnish: 'keittää',         english: 'to boil',          pronunciation: 'KEIT-taa',           partOfSpeech: 'verb',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Keitetään pasta viisi minuuttia.',              exampleTranslation: 'Boil the pasta for five minutes.' },
    { finnish: 'pilkkoa',         english: 'to chop',          pronunciation: 'PIL-ko-a',           partOfSpeech: 'verb',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Pilko sipuli pieneksi.',                        exampleTranslation: 'Chop the onion into small pieces.' },
    { finnish: 'maistua',         english: 'to taste',         pronunciation: 'MAIS-tu-a',          partOfSpeech: 'verb',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Tämä maistuu todella hyvältä!',                 exampleTranslation: 'This tastes really good!' },
    { finnish: 'mauste',          english: 'spice',            pronunciation: 'MAUS-te',            partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Lisää mausteita makusi mukaan.',                exampleTranslation: 'Add spices to your taste.' },
    { finnish: 'tulinen',         english: 'spicy',            pronunciation: 'TU-li-nen',          partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'En pidä tulisesta ruoasta.',                    exampleTranslation: "I don't like spicy food." },
    { finnish: 'makea',           english: 'sweet',            pronunciation: 'MA-ke-a',            partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Kakku on liian makea.',                         exampleTranslation: 'The cake is too sweet.' },
    { finnish: 'hapan',           english: 'sour',             pronunciation: 'HA-pan',             partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Sitruuna on hapan hedelmä.',                    exampleTranslation: 'Lemon is a sour fruit.' },
    { finnish: 'katkera',         english: 'bitter',           pronunciation: 'KAT-ke-ra',          partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Kahvi ilman sokeria on katkera.',               exampleTranslation: 'Coffee without sugar is bitter.' },
    { finnish: 'suolainen',       english: 'salty',            pronunciation: 'SUOL-ai-nen',        partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Perunalastut ovat suolaisia.',                  exampleTranslation: 'Potato chips are salty.' },
    { finnish: 'tuore',           english: 'fresh',            pronunciation: 'TUO-re',             partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Ostan aina tuoretta kalaa.',                    exampleTranslation: 'I always buy fresh fish.' },
    { finnish: 'pakaste',         english: 'frozen food',      pronunciation: 'PA-kas-te',          partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Pakasteet ovat käteviä kiireisinä päivinä.',    exampleTranslation: 'Frozen foods are convenient on busy days.' },
    { finnish: 'luomu',           english: 'organic',          pronunciation: 'LUO-mu',             partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Ostan luomutuotteita aina kun mahdollista.',    exampleTranslation: 'I buy organic products whenever possible.' },
    { finnish: 'vähärasvainen',   english: 'low-fat',          pronunciation: 'VA-haa-ras-vai-nen', partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Valitsen vähärasvaisen maidon.',                exampleTranslation: 'I choose low-fat milk.' },
    { finnish: 'laktoositon',     english: 'lactose-free',     pronunciation: 'LAK-too-si-ton',     partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Onko teillä laktoositonta maitoa?',             exampleTranslation: 'Do you have lactose-free milk?' },
    { finnish: 'gluteeniton',     english: 'gluten-free',      pronunciation: 'GLU-tee-ni-ton',     partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Tarvitsen gluteenittoman vaihtoehdon.',         exampleTranslation: 'I need a gluten-free option.' },
    { finnish: 'kasvisruoka',     english: 'vegetarian food',  pronunciation: 'KAS-vis-ruo-ka',     partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Ravintolassa on hyvä kasvisruokavalikoimia.',   exampleTranslation: 'The restaurant has a good vegetarian food selection.' },
    { finnish: 'merenelävät',     english: 'seafood',          pronunciation: 'ME-ren-e-la-vat',    partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Pidän merenelävistä erittäin paljon.',          exampleTranslation: 'I like seafood very much.' },
    { finnish: 'Mitä aiot kokata tänään?',      english: 'What are you going to cook today?', pronunciation: 'MI-taa A-i-ot KO-ka-ta TA-naan',      partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Mitä aiot kokata tänään illalliseksi?',       exampleTranslation: 'What are you going to cook today for dinner?' },
    { finnish: 'Tämä maistuu todella hyvältä',  english: 'This tastes really good',           pronunciation: 'TAM-aa MAIS-tuu TO-del-la HU-val-ta',  partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Tämä maistuu todella hyvältä — mitä siinä on?', exampleTranslation: "This tastes really good — what's in it?" },
    { finnish: 'En pidä tulisesta ruoasta',     english: "I don't like spicy food",           pronunciation: 'EN PI-daa TU-li-ses-ta RUO-as-ta',     partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'En pidä tulisesta ruoasta, mutta pidän mausteisesta.', exampleTranslation: "I don't like spicy food, but I like flavourful." },
    { finnish: 'Yritän syödä terveellisesti',   english: 'I try to eat healthy',              pronunciation: 'U-ri-tan SU-ö-daa TER-veel-li-ses-ti', partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Yritän syödä terveellisesti joka päivä.',     exampleTranslation: 'I try to eat healthy every day.' },
    { finnish: 'Voisitko antaa reseptin?',      english: 'Could you give the recipe?',        pronunciation: 'VOI-sit-ko AN-taa RE-sep-tin',          partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Voisitko antaa reseptin? Tämä on niin herkullista!', exampleTranslation: 'Could you give the recipe? This is so delicious!' },
    { finnish: 'Olen allerginen pähkinöille',   english: 'I am allergic to nuts',             pronunciation: 'O-len AL-ler-gi-nen PAH-ki-nöil-le',   partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Olen allerginen pähkinöille — onko tässä pähkinöitä?', exampleTranslation: 'I am allergic to nuts — are there nuts in this?' },
    { finnish: 'Syötkö usein ulkona?',          english: 'Do you often eat out?',             pronunciation: 'SU-öt-kö U-sein UL-ko-na',             partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Syötkö usein ulkona vai kokkaat kotona?',     exampleTranslation: 'Do you often eat out or cook at home?' },
    { finnish: 'Tämä ruoka on liian rasvaista', english: 'This food is too fatty',            pronunciation: 'TAM-aa RUO-ka ON LII-an RAS-vais-ta',  partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B1, exampleSentence: 'Tämä ruoka on liian rasvaista minulle.',      exampleTranslation: 'This food is too fatty for me.' },

    // ── Food & Drink (B2) ──
    { finnish: 'ravitsemus',             english: 'nutrition',        pronunciation: 'RA-vit-se-mus',          partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Hyvä ravitsemus on terveyden perusta.',          exampleTranslation: 'Good nutrition is the foundation of health.' },
    { finnish: 'ruokavalio',             english: 'diet',             pronunciation: 'RUO-ka-va-li-o',         partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Lääkäri suositteli terveellistä ruokavaliota.',  exampleTranslation: 'The doctor recommended a healthy diet.' },
    { finnish: 'ruokakulttuuri',         english: 'food culture',     pronunciation: 'RUO-ka-kult-tuu-ri',     partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Suomalainen ruokakulttuuri arvostaa tuoreita raaka-aineita.', exampleTranslation: 'Finnish food culture values fresh ingredients.' },
    { finnish: 'gourmet-ruoka',          english: 'gourmet food',     pronunciation: 'GUR-met-RUO-ka',         partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Ravintola on erikoistunut gourmet-ruokaan.',      exampleTranslation: 'The restaurant specializes in gourmet food.' },
    { finnish: 'paikallinen erikoisuus', english: 'local specialty',  pronunciation: 'PAI-kal-li-nen E-ri-koi-suus', partOfSpeech: 'noun', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Kannattaa maistaa paikallisia erikoisuuksia matkaillessa.', exampleTranslation: 'It is worth tasting local specialties when travelling.' },
    { finnish: 'sesonkiruoka',           english: 'seasonal food',    pronunciation: 'SE-son-ki-ruo-ka',       partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Sesonkiruoka on tuoreinta ja edullisinta.',       exampleTranslation: 'Seasonal food is the freshest and most affordable.' },
    { finnish: 'lisuke',                 english: 'side dish',        pronunciation: 'LI-su-ke',               partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Lisukkeena tarjoillaan perunasalaattia.',         exampleTranslation: 'Potato salad is served as a side dish.' },
    { finnish: 'alkuruoka',              english: 'appetizer',        pronunciation: 'AL-ku-ruo-ka',           partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Alkuruokana on tomaattikeitto.',                  exampleTranslation: 'The appetizer is tomato soup.' },
    { finnish: 'pääruoka',               english: 'main course',      pronunciation: 'PAA-ruo-ka',             partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Pääruokana on grillattua lohta.',                 exampleTranslation: 'The main course is grilled salmon.' },
    { finnish: 'ruokahaluttomuus',       english: 'loss of appetite', pronunciation: 'RUO-ka-ha-lut-to-muus', partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Stressi aiheuttaa usein ruokahaluttomuutta.',     exampleTranslation: 'Stress often causes loss of appetite.' },
    { finnish: 'kypsä',                  english: 'ripe / cooked',    pronunciation: 'KUP-saa',                partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Onko liha jo kypsää?',                           exampleTranslation: 'Is the meat cooked yet?' },
    { finnish: 'raaka',                  english: 'raw',              pronunciation: 'RAA-ka',                 partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Syön mielelläni raakakasviksia.',                 exampleTranslation: 'I enjoy eating raw vegetables.' },
    { finnish: 'ylikypsä',              english: 'overcooked',        pronunciation: 'U-li-kup-saa',           partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Kana on ylikypsää — se on kuivaa.',              exampleTranslation: 'The chicken is overcooked — it is dry.' },
    { finnish: 'alikypsä',              english: 'undercooked',       pronunciation: 'A-li-kup-saa',           partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Perunat ovat alikypsät — laita ne takaisin.',     exampleTranslation: 'The potatoes are undercooked — put them back.' },
    { finnish: 'marinadi',               english: 'marinade',         pronunciation: 'MA-ri-na-di',            partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Liotan lihan marinadissa yön yli.',               exampleTranslation: 'I soak the meat in marinade overnight.' },
    { finnish: 'fermentoitu',            english: 'fermented',        pronunciation: 'FER-men-toi-tu',         partOfSpeech: 'adjective', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Fermentoitu ruoka on hyväksi suolistolle.',       exampleTranslation: 'Fermented food is good for the gut.' },
    { finnish: 'ravintoaine',            english: 'nutrient',         pronunciation: 'RA-vin-to-ai-ne',        partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Kasvikset sisältävät tärkeitä ravintoaineita.',  exampleTranslation: 'Vegetables contain important nutrients.' },
    { finnish: 'proteiini',              english: 'protein',          pronunciation: 'PRO-te-ii-ni',           partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Urheilijat tarvitsevat paljon proteiinia.',       exampleTranslation: 'Athletes need a lot of protein.' },
    { finnish: 'hiilihydraatti',         english: 'carbohydrate',     pronunciation: 'HII-li-hud-raat-ti',     partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Hiilihydraatit antavat energiaa.',               exampleTranslation: 'Carbohydrates provide energy.' },
    { finnish: 'kuitu',                  english: 'fiber',            pronunciation: 'KUI-tu',                 partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Täysjyväleipä sisältää paljon kuitua.',          exampleTranslation: 'Wholegrain bread contains a lot of fiber.' },
    { finnish: 'ruokamyrkytys',          english: 'food poisoning',   pronunciation: 'RUO-ka-mur-ku-tus',      partOfSpeech: 'noun',      category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Sain ruokamyrkytyksen ravintolassa.',            exampleTranslation: 'I got food poisoning at the restaurant.' },
    { finnish: 'Tämä annos on erittäin hyvin maustettu',            english: 'This dish is very well seasoned',          pronunciation: 'TAM-aa AN-nos ON E-rit-tain HU-vin MAUS-tet-tu',          partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Tämä annos on erittäin hyvin maustettu — kokki on taitava.', exampleTranslation: 'This dish is very well seasoned — the chef is skilled.' },
    { finnish: 'Suosin kotitekoista ruokaa',                         english: 'I prefer homemade food',                   pronunciation: 'SUO-sin KO-ti-te-kois-ta RUO-kaa',                         partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Suosin kotitekoista ruokaa, koska tiedän mitä siinä on.', exampleTranslation: "I prefer homemade food because I know what's in it." },
    { finnish: 'Ruokavalioni sisältää paljon proteiinia',            english: 'My diet contains a lot of protein',        pronunciation: 'RUO-ka-va-li-o-ni SI-sal-taa PAL-yon PRO-te-ii-ni-a',     partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Ruokavalioni sisältää paljon proteiinia, koska harrastan urheilua.', exampleTranslation: 'My diet contains a lot of protein because I do sports.' },
    { finnish: 'Tämä ravintola tarjoaa paikallisia erikoisuuksia',   english: 'This restaurant offers local specialties', pronunciation: 'TAM-aa RA-vin-to-la TAR-yo-aa PAI-kal-li-si-a E-ri-koi-suuk-si-a', partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Tämä ravintola tarjoaa paikallisia erikoisuuksia kauden mukaan.', exampleTranslation: 'This restaurant offers local specialties according to the season.' },
    { finnish: 'Ruoan esillepano oli vaikuttava',                    english: 'The food presentation was impressive',     pronunciation: 'RUO-an E-sil-le-pa-no O-li VAI-kut-ta-va',                partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Ruoan esillepano oli vaikuttava — kuin taidetta.',      exampleTranslation: 'The food presentation was impressive — like art.' },
    { finnish: 'Yritän vähentää sokerin käyttöä',                    english: 'I try to reduce sugar consumption',        pronunciation: 'U-ri-tan VA-hen-taa SO-ke-rin KAY-ttö-aa',                partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Yritän vähentää sokerin käyttöä terveyssyistä.',       exampleTranslation: 'I try to reduce sugar consumption for health reasons.' },
    { finnish: 'Tämä ateria oli tasapainoinen ja ravitseva',         english: 'This meal was balanced and nutritious',    pronunciation: 'TAM-aa A-te-ri-a O-li TA-sa-pai-noi-nen YA RA-vit-se-va',  partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Tämä ateria oli tasapainoinen ja ravitseva — juuri mitä tarvitsin.', exampleTranslation: 'This meal was balanced and nutritious — just what I needed.' },
    { finnish: 'Pidän erityisesti aasialaisesta ruokakulttuurista',  english: 'I especially like Asian food culture',     pronunciation: 'PI-dan E-ri-tui-ses-ti AA-si-a-lai-ses-ta RUO-ka-kult-tuu-ris-ta', partOfSpeech: 'phrase', category: 'Food & Drink', level: FinnishLevel.B2, exampleSentence: 'Pidän erityisesti aasialaisesta ruokakulttuurista — se on niin monipuolinen.', exampleTranslation: 'I especially like Asian food culture — it is so diverse.' },

    // ── Colors (A1) ──
    { finnish: 'punainen', english: 'red', pronunciation: 'PU-nai-nen', partOfSpeech: 'adjective', category: 'Colors', level: FinnishLevel.A1, exampleSentence: 'Minulla on punainen auto.', exampleTranslation: 'I have a red car.' },
    { finnish: 'sininen', english: 'blue', pronunciation: 'SI-ni-nen', partOfSpeech: 'adjective', category: 'Colors', level: FinnishLevel.A1, exampleSentence: 'Taivas on sininen.', exampleTranslation: 'The sky is blue.' },
    { finnish: 'vihreä', english: 'green', pronunciation: 'VIH-re-aa', partOfSpeech: 'adjective', category: 'Colors', level: FinnishLevel.A1, exampleSentence: 'Metsä on vihreä.', exampleTranslation: 'The forest is green.' },
    { finnish: 'keltainen', english: 'yellow', pronunciation: 'KEL-tai-nen', partOfSpeech: 'adjective', category: 'Colors', level: FinnishLevel.A1, exampleSentence: 'Aurinko on keltainen.', exampleTranslation: 'The sun is yellow.' },
    { finnish: 'musta', english: 'black', pronunciation: 'MUS-ta', partOfSpeech: 'adjective', category: 'Colors', level: FinnishLevel.A1, exampleSentence: 'Minulla on musta reppu.', exampleTranslation: 'I have a black backpack.' },
    { finnish: 'valkoinen', english: 'white', pronunciation: 'VAL-koi-nen', partOfSpeech: 'adjective', category: 'Colors', level: FinnishLevel.A1, exampleSentence: 'Lumi on valkoinen.', exampleTranslation: 'Snow is white.' },

    // ── Nature & Weather (A2) ──
    { finnish: 'sää', english: 'weather', pronunciation: 'SAA', partOfSpeech: 'noun', category: 'Nature', level: FinnishLevel.A2, exampleSentence: 'Millainen sää tänään on?', exampleTranslation: "What's the weather like today?" },
    { finnish: 'talvi', english: 'winter', pronunciation: 'TAL-vi', partOfSpeech: 'noun', category: 'Nature', level: FinnishLevel.A2, exampleSentence: 'Suomen talvi on kylmä.', exampleTranslation: "Finland's winter is cold." },
    { finnish: 'kesä', english: 'summer', pronunciation: 'KE-saa', partOfSpeech: 'noun', category: 'Nature', level: FinnishLevel.A2, exampleSentence: 'Kesällä päivät ovat pitkiä.', exampleTranslation: 'In summer the days are long.' },
    { finnish: 'lumi', english: 'snow', pronunciation: 'LU-mi', partOfSpeech: 'noun', category: 'Nature', level: FinnishLevel.A2, exampleSentence: 'Lunta sataa paljon.', exampleTranslation: 'A lot of snow is falling.' },
    { finnish: 'metsä', english: 'forest', pronunciation: 'MET-saa', partOfSpeech: 'noun', category: 'Nature', level: FinnishLevel.A2, exampleSentence: 'Suomessa on paljon metsiä.', exampleTranslation: 'Finland has many forests.' },
    { finnish: 'järvi', english: 'lake', pronunciation: 'YAR-vi', partOfSpeech: 'noun', category: 'Nature', level: FinnishLevel.A2, exampleSentence: 'Suomessa on yli 180 000 järveä.', exampleTranslation: 'Finland has over 180,000 lakes.' },
    { finnish: 'revontulet', english: 'northern lights', pronunciation: 'RE-von-tu-let', partOfSpeech: 'noun', category: 'Nature', level: FinnishLevel.A2, exampleSentence: 'Revontulet ovat upeita Lapissa.', exampleTranslation: 'The northern lights are spectacular in Lapland.' },

    // ── Travel & Transport (A2) ──
    { finnish: 'lentokenttä', english: 'airport', pronunciation: 'LEN-to-kent-taa', partOfSpeech: 'noun', category: 'Travel', level: FinnishLevel.A2, exampleSentence: 'Lentokenttä on kaupungin ulkopuolella.', exampleTranslation: 'The airport is outside the city.' },
    { finnish: 'juna', english: 'train', pronunciation: 'YU-na', partOfSpeech: 'noun', category: 'Travel', level: FinnishLevel.A2, exampleSentence: 'Juna lähtee kello kymmenen.', exampleTranslation: 'The train leaves at ten.' },
    { finnish: 'bussi', english: 'bus', pronunciation: 'BUS-si', partOfSpeech: 'noun', category: 'Travel', level: FinnishLevel.A2, exampleSentence: 'Bussi tulee viiden minuutin kuluttua.', exampleTranslation: 'The bus comes in five minutes.' },
    { finnish: 'hotelli', english: 'hotel', pronunciation: 'HO-tel-li', partOfSpeech: 'noun', category: 'Travel', level: FinnishLevel.A2, exampleSentence: 'Hotelli on aivan keskustassa.', exampleTranslation: 'The hotel is right in the center.' },
    { finnish: 'matka', english: 'trip / journey', pronunciation: 'MAT-ka', partOfSpeech: 'noun', category: 'Travel', level: FinnishLevel.A2, exampleSentence: 'Matka Helsingistä Tampereelle kestää kaksi tuntia.', exampleTranslation: 'The journey from Helsinki to Tampere takes two hours.' },

    // ── Work & Professions (A2) ──
    { finnish: 'työ', english: 'work / job', pronunciation: 'TU-oo', partOfSpeech: 'noun', category: 'Work', level: FinnishLevel.A2, exampleSentence: 'Pidän työstäni paljon.', exampleTranslation: 'I like my work a lot.' },
    { finnish: 'lääkäri', english: 'doctor', pronunciation: 'LAA-kaa-ri', partOfSpeech: 'noun', category: 'Work', level: FinnishLevel.A2, exampleSentence: 'Lääkäri on tärkeä ammatti.', exampleTranslation: 'Doctor is an important profession.' },
    { finnish: 'opettaja', english: 'teacher', pronunciation: 'O-pet-ta-ya', partOfSpeech: 'noun', category: 'Work', level: FinnishLevel.A2, exampleSentence: 'Opettaja opettaa suomea.', exampleTranslation: 'The teacher teaches Finnish.' },
    { finnish: 'insinööri', english: 'engineer', pronunciation: 'IN-si-nöö-ri', partOfSpeech: 'noun', category: 'Work', level: FinnishLevel.A2, exampleSentence: 'Hän on kokenut insinööri.', exampleTranslation: 'He is an experienced engineer.' },
    { finnish: 'toimisto', english: 'office', pronunciation: 'TOI-mis-to', partOfSpeech: 'noun', category: 'Work', level: FinnishLevel.A2, exampleSentence: 'Toimisto on auki maanantaista perjantaihin.', exampleTranslation: 'The office is open Monday to Friday.' },

    // ── Grammar & Abstract (B1) ──
    { finnish: 'ymmärtää', english: 'to understand', pronunciation: 'UM-mar-taa', partOfSpeech: 'verb', category: 'Verbs', level: FinnishLevel.B1, exampleSentence: 'Ymmärrän suomea hyvin.', exampleTranslation: 'I understand Finnish well.' },
    { finnish: 'oppia', english: 'to learn', pronunciation: 'OP-pi-a', partOfSpeech: 'verb', category: 'Verbs', level: FinnishLevel.B1, exampleSentence: 'Haluan oppia suomea.', exampleTranslation: 'I want to learn Finnish.' },
    { finnish: 'kertoa', english: 'to tell / to say', pronunciation: 'KER-to-a', partOfSpeech: 'verb', category: 'Verbs', level: FinnishLevel.B1, exampleSentence: 'Kerro minulle lisää.', exampleTranslation: 'Tell me more.' },
    { finnish: 'tärkeä', english: 'important', pronunciation: 'TAR-ke-aa', partOfSpeech: 'adjective', category: 'Adjectives', level: FinnishLevel.B1, exampleSentence: 'Koulutus on tärkeää.', exampleTranslation: 'Education is important.' },
    { finnish: 'yhteiskunta', english: 'society', pronunciation: 'UH-teis-kun-ta', partOfSpeech: 'noun', category: 'Society', level: FinnishLevel.B1, exampleSentence: 'Suomalainen yhteiskunta on tasa-arvoinen.', exampleTranslation: 'Finnish society is equal.' },
    { finnish: 'ympäristö', english: 'environment', pronunciation: 'UM-paa-ris-tö', partOfSpeech: 'noun', category: 'Nature', level: FinnishLevel.B1, exampleSentence: 'Meidän täytyy suojella ympäristöä.', exampleTranslation: 'We must protect the environment.' },
    { finnish: 'kehittää', english: 'to develop', pronunciation: 'KE-hit-taa', partOfSpeech: 'verb', category: 'Verbs', level: FinnishLevel.B1, exampleSentence: 'Haluamme kehittää osaamistamme.', exampleTranslation: 'We want to develop our skills.' },
    { finnish: 'mahdollisuus', english: 'opportunity / possibility', pronunciation: 'MAH-dol-li-suus', partOfSpeech: 'noun', category: 'Abstract', level: FinnishLevel.B1, exampleSentence: 'Tämä on hyvä mahdollisuus.', exampleTranslation: 'This is a good opportunity.' },
  ];

  let vocabCreated = 0;
  for (const word of vocabData) {
    await prisma.vocabWord.upsert({
      where: { finnish: word.finnish },
      update: {},
      create: {
        ...word,
        translation: { en: word.english },
        tags: [word.category, word.level],
      },
    });
    vocabCreated++;
  }
  console.log(`  ✓ ${vocabCreated} vocabulary words`);

  // ─── COURSES, MODULES & LESSONS ───────────────────────────────────────────
  console.log('  → Seeding courses and lessons...');

  const courseA1 = await prisma.course.upsert({
    where: { id: 'course-a1-basics' },
    update: {},
    create: {
      id: 'course-a1-basics',
      title: 'Finnish for Beginners',
      description: 'Start your Finnish journey from zero. Learn greetings, numbers, colors, and essential vocabulary.',
      level: FinnishLevel.A1,
      color: 'from-cyan-500 to-blue-500',
      isPublished: true,
      order: 1,
      totalXP: 300,
    },
  });

  const courseA2 = await prisma.course.upsert({
    where: { id: 'course-a2-elementary' },
    update: {},
    create: {
      id: 'course-a2-elementary',
      title: 'Elementary Finnish',
      description: 'Build on your basics. Discuss daily life, travel, and work in Finnish.',
      level: FinnishLevel.A2,
      color: 'from-blue-500 to-indigo-600',
      isPublished: true,
      order: 2,
      totalXP: 500,
    },
  });

  const courseB1 = await prisma.course.upsert({
    where: { id: 'course-b1-intermediate' },
    update: {},
    create: {
      id: 'course-b1-intermediate',
      title: 'Intermediate Finnish',
      description: 'Discuss complex topics, Finnish culture, and prepare for real-life conversations.',
      level: FinnishLevel.B1,
      color: 'from-violet-500 to-purple-600',
      isPublished: true,
      order: 3,
      totalXP: 800,
    },
  });

  // A1 Module: Greetings
  const modGreetings = await prisma.module.upsert({
    where: { id: 'mod-a1-greetings' },
    update: {},
    create: {
      id: 'mod-a1-greetings',
      courseId: courseA1.id,
      title: 'Greetings & Introductions',
      description: 'Learn how to say hello, goodbye, and introduce yourself',
      type: LessonType.VOCABULARY,
      order: 1,
      isPublished: true,
    },
  });

  const modNumbers = await prisma.module.upsert({
    where: { id: 'mod-a1-numbers' },
    update: {},
    create: {
      id: 'mod-a1-numbers',
      courseId: courseA1.id,
      title: 'Numbers & Colors',
      description: 'Count to 100 and describe colors in Finnish',
      type: LessonType.VOCABULARY,
      order: 2,
      isPublished: true,
    },
  });

  const modGrammarA1 = await prisma.module.upsert({
    where: { id: 'mod-a1-grammar' },
    update: {},
    create: {
      id: 'mod-a1-grammar',
      courseId: courseA1.id,
      title: 'Basic Grammar',
      description: 'Pronouns, verb to be, and simple sentence structure',
      type: LessonType.GRAMMAR,
      order: 3,
      isPublished: true,
    },
  });

  const modA2Daily = await prisma.module.upsert({
    where: { id: 'mod-a2-daily' },
    update: {},
    create: {
      id: 'mod-a2-daily',
      courseId: courseA2.id,
      title: 'Daily Life Vocabulary',
      description: 'Food, transport, shopping, and daily routines',
      type: LessonType.VOCABULARY,
      order: 1,
      isPublished: true,
    },
  });

  const modB1Grammar = await prisma.module.upsert({
    where: { id: 'mod-b1-grammar' },
    update: {},
    create: {
      id: 'mod-b1-grammar',
      courseId: courseB1.id,
      title: 'Finnish Cases Deep Dive',
      description: 'Master the 15 Finnish grammatical cases',
      type: LessonType.GRAMMAR,
      order: 1,
      isPublished: true,
    },
  });

  // ── Lessons ──
  const lesson1 = await prisma.lesson.upsert({
    where: { id: 'lesson-greetings-1' },
    update: {},
    create: {
      id: 'lesson-greetings-1',
      moduleId: modGreetings.id,
      title: 'Greetings & Introductions',
      description: 'Learn the essential Finnish greetings for every time of day',
      type: LessonType.VOCABULARY,
      level: FinnishLevel.A1,
      difficulty: Difficulty.BEGINNER,
      content: {
        slides: [
          { type: 'info', word: 'Hei', translation: 'Hi / Hello', content: 'The most common casual greeting in Finnish.' },
          { type: 'info', word: 'Hyvää huomenta', translation: 'Good morning', content: 'Used until around 10am.' },
          { type: 'info', word: 'Hyvää päivää', translation: 'Good day', content: 'Formal greeting used during the day.' },
          { type: 'info', word: 'Hyvää iltaa', translation: 'Good evening', content: 'Used after around 6pm.' },
          { type: 'info', word: 'Näkemiin', translation: 'Goodbye (formal)', content: 'Formal farewell. Literally "until we see again".' },
        ],
      },
      estimatedMinutes: 10,
      xpReward: 20,
      order: 1,
      isPublished: true,
      isFree: true,
      tags: ['greetings', 'basics', 'a1'],
    },
  });

  const lesson2 = await prisma.lesson.upsert({
    where: { id: 'lesson-numbers-1' },
    update: {},
    create: {
      id: 'lesson-numbers-1',
      moduleId: modNumbers.id,
      title: 'Numbers 1–20',
      description: 'Count from one to twenty in Finnish',
      type: LessonType.VOCABULARY,
      level: FinnishLevel.A1,
      difficulty: Difficulty.BEGINNER,
      content: {
        slides: [
          { type: 'info', word: 'yksi', translation: 'one', content: 'The number 1.' },
          { type: 'info', word: 'kaksi', translation: 'two', content: 'The number 2.' },
          { type: 'info', word: 'kolme', translation: 'three', content: 'The number 3.' },
          { type: 'info', word: 'neljä', translation: 'four', content: 'Note the ä (front vowel).' },
          { type: 'info', word: 'viisi', translation: 'five', content: 'The number 5.' },
          { type: 'info', word: 'kymmenen', translation: 'ten', content: 'Used in compound numbers: yksitoista (11), kaksitoista (12).' },
        ],
      },
      estimatedMinutes: 12,
      xpReward: 20,
      order: 1,
      isPublished: true,
      isFree: true,
      tags: ['numbers', 'basics', 'a1'],
    },
  });

  const lesson3 = await prisma.lesson.upsert({
    where: { id: 'lesson-grammar-verb-olla' },
    update: {},
    create: {
      id: 'lesson-grammar-verb-olla',
      moduleId: modGrammarA1.id,
      title: 'Verb "Olla" — To Be',
      description: 'Learn the most important Finnish verb and all its conjugations',
      type: LessonType.GRAMMAR,
      level: FinnishLevel.A1,
      difficulty: Difficulty.BEGINNER,
      content: {
        slides: [
          { type: 'info', word: 'olla', translation: 'to be', content: 'The most fundamental Finnish verb.' },
          { type: 'info', word: 'Minä olen', translation: 'I am', content: 'First person singular.' },
          { type: 'info', word: 'Sinä olet', translation: 'You are', content: 'Second person singular (informal).' },
          { type: 'info', word: 'Hän on', translation: 'He/She is', content: 'Finnish has one word for he AND she.' },
          { type: 'info', word: 'Me olemme', translation: 'We are', content: 'First person plural.' },
          { type: 'info', word: 'Te olette', translation: 'You are (plural)', content: 'Also the formal "you" singular.' },
        ],
      },
      estimatedMinutes: 15,
      xpReward: 25,
      order: 1,
      isPublished: true,
      isFree: true,
      tags: ['grammar', 'verbs', 'a1'],
    },
  });

  const lesson4 = await prisma.lesson.upsert({
    where: { id: 'lesson-a2-food' },
    update: {},
    create: {
      id: 'lesson-a2-food',
      moduleId: modA2Daily.id,
      title: 'Food & Drinks',
      description: 'Order food and drinks in Finnish restaurants and cafés',
      type: LessonType.VOCABULARY,
      level: FinnishLevel.A2,
      difficulty: Difficulty.ELEMENTARY,
      content: {
        slides: [
          { type: 'info', word: 'kahvi', translation: 'coffee', content: 'Finland drinks more coffee per capita than any other country!' },
          { type: 'info', word: 'lohikeitto', translation: 'salmon soup', content: 'A classic Finnish dish — creamy salmon soup with potatoes and dill.' },
          { type: 'info', word: 'pulla', translation: 'cardamom bun', content: 'Sweet Finnish bun, perfect with coffee.' },
        ],
      },
      estimatedMinutes: 15,
      xpReward: 30,
      order: 1,
      isPublished: true,
      isFree: false,
      tags: ['food', 'daily life', 'a2'],
    },
  });

  const lesson5 = await prisma.lesson.upsert({
    where: { id: 'lesson-b1-cases' },
    update: {},
    create: {
      id: 'lesson-b1-cases',
      moduleId: modB1Grammar.id,
      title: 'The 15 Finnish Cases',
      description: 'A comprehensive guide to all 15 Finnish grammatical cases',
      type: LessonType.GRAMMAR,
      level: FinnishLevel.B1,
      difficulty: Difficulty.INTERMEDIATE,
      content: {
        cases: [
          { name: 'Nominatiivi', english: 'Nominative', ending: '-', usage: 'Subject of sentence', example: 'Koira juoksee' },
          { name: 'Genetiivi', english: 'Genitive', ending: '-n', usage: 'Possession', example: 'Koiran ruoka' },
          { name: 'Partitiivi', english: 'Partitive', ending: '-a/-ä', usage: 'Partial action, negative sentences', example: 'Juon kahvia' },
          { name: 'Inessiiivi', english: 'Inessive', ending: '-ssa/-ssä', usage: 'Inside something', example: 'Talossa' },
          { name: 'Elatiivi', english: 'Elative', ending: '-sta/-stä', usage: 'Out of something', example: 'Talosta' },
          { name: 'Illatiivi', english: 'Illative', ending: '-Vn', usage: 'Into something', example: 'Taloon' },
        ],
      },
      estimatedMinutes: 25,
      xpReward: 50,
      order: 1,
      isPublished: true,
      isFree: false,
      tags: ['grammar', 'cases', 'b1'],
    },
  });

  // ── Exercises for Lesson 1 (Greetings) ──
  await prisma.exercise.upsert({
    where: { id: 'ex-greet-1' },
    update: {},
    create: {
      id: 'ex-greet-1',
      lessonId: lesson1.id,
      type: ExerciseType.MCQ,
      question: 'How do you say "Good morning" in Finnish?',
      instructions: 'Choose the correct answer',
      options: { choices: ['Hyvää iltaa', 'Hyvää huomenta', 'Hyvää päivää', 'Näkemiin'] },
      correctAnswer: { index: 1, value: 'Hyvää huomenta' },
      explanation: 'Hyvää huomenta is used in the morning until around 10am.',
      points: 10,
      order: 1,
    },
  });
  await prisma.exercise.upsert({
    where: { id: 'ex-greet-2' },
    update: {},
    create: {
      id: 'ex-greet-2',
      lessonId: lesson1.id,
      type: ExerciseType.MCQ,
      question: 'What does "Näkemiin" mean?',
      instructions: 'Choose the correct answer',
      options: { choices: ['Good morning', 'Hello', 'Goodbye (formal)', 'Thank you'] },
      correctAnswer: { index: 2, value: 'Goodbye (formal)' },
      explanation: 'Näkemiin is a formal goodbye. Literally "until we see each other".',
      points: 10,
      order: 2,
    },
  });
  await prisma.exercise.upsert({
    where: { id: 'ex-greet-3' },
    update: {},
    create: {
      id: 'ex-greet-3',
      lessonId: lesson1.id,
      type: ExerciseType.FILL_BLANK,
      question: 'Complete: "_____ huomenta, Matti!"',
      instructions: 'Fill in the blank',
      options: { hint: 'Think about the time of day greeting' },
      correctAnswer: { value: 'Hyvää' },
      explanation: 'Hyvää huomenta = Good morning',
      points: 15,
      order: 3,
    },
  });

  // ── Exercises for Lesson 2 (Numbers) ──
  await prisma.exercise.upsert({
    where: { id: 'ex-num-1' },
    update: {},
    create: {
      id: 'ex-num-1',
      lessonId: lesson2.id,
      type: ExerciseType.MCQ,
      question: 'What is "kolme" in English?',
      instructions: 'Choose the correct answer',
      options: { choices: ['One', 'Two', 'Three', 'Four'] },
      correctAnswer: { index: 2, value: 'Three' },
      explanation: 'Kolme = Three',
      points: 10,
      order: 1,
    },
  });
  await prisma.exercise.upsert({
    where: { id: 'ex-num-2' },
    update: {},
    create: {
      id: 'ex-num-2',
      lessonId: lesson2.id,
      type: ExerciseType.MCQ,
      question: 'How do you say "five" in Finnish?',
      instructions: 'Choose the correct answer',
      options: { choices: ['neljä', 'viisi', 'kuusi', 'seitsemän'] },
      correctAnswer: { index: 1, value: 'viisi' },
      explanation: 'Viisi = Five',
      points: 10,
      order: 2,
    },
  });

  console.log(`  ✓ 5 lessons with exercises created`);

  // ─── GRAMMAR RULES ────────────────────────────────────────────────────────
  console.log('  → Seeding grammar rules...');
  const grammarRules = [
    { id: 'gr-vowel-harmony', title: 'Vowel Harmony', explanation: 'Finnish vowels are divided into front (ä, ö, y) and back (a, o, u) vowels. Words use either all front or all back vowels, never mixed. This affects suffixes.', examples: ['talo → talossa (back)', 'kylä → kylässä (front)'], level: FinnishLevel.A1, category: 'Phonology', order: 1 },
    { id: 'gr-nominative', title: 'Nominative Case', explanation: 'The nominative is the basic form of a noun, used for the subject of a sentence. It has no ending.', examples: ['Koira juoksee (The dog runs)', 'Kirja on pöydällä (The book is on the table)'], level: FinnishLevel.A1, category: 'Cases', order: 2 },
    { id: 'gr-partitive', title: 'Partitive Case', explanation: 'The partitive is used for partial quantities, negative sentences, and after numbers. Ending: -a/-ä.', examples: ['Juon kahvia (I drink coffee)', 'Ei ole aikaa (There is no time)', 'Kolme kirjaa (Three books)'], level: FinnishLevel.A2, category: 'Cases', order: 3 },
    { id: 'gr-inessive', title: 'Inessive Case (in)', explanation: 'Expresses being inside something. Ending: -ssa/-ssä (vowel harmony applies).', examples: ['Olen talossa (I am in the house)', 'Hän on autossa (He is in the car)'], level: FinnishLevel.A2, category: 'Cases', order: 4 },
    { id: 'gr-verb-types', title: 'Verb Types 1–6', explanation: 'Finnish verbs are categorized into 6 types based on their infinitive ending. The type determines how the verb conjugates in different tenses.', examples: ['Type 1: puhua → puhun (to speak)', 'Type 2: syödä → syön (to eat)', 'Type 3: tulla → tulen (to come)'], level: FinnishLevel.A2, category: 'Verbs', order: 5 },
    { id: 'gr-consonant-gradation', title: 'Consonant Gradation', explanation: 'A key feature of Finnish morphology where certain consonants (k, p, t) weaken or disappear when case endings are added.', examples: ['tyttö → tytön (k→missing)', 'kauppa → kaupassa (pp→p)', 'katu → kadulla (t→d)'], level: FinnishLevel.B1, category: 'Phonology', order: 6 },
  ];

  for (const rule of grammarRules) {
    await prisma.grammarRule.upsert({
      where: { id: rule.id },
      update: {},
      create: rule,
    });
  }
  console.log(`  ✓ ${grammarRules.length} grammar rules`);

  console.log('\n✅ Seeding complete!');
  console.log(`   Achievements: ${achievements.length}`);
  console.log(`   Vocabulary words: ${vocabCreated}`);
  console.log(`   Courses: 3 (A1, A2, B1)`);
  console.log(`   Lessons: 5 with exercises`);
  console.log(`   Grammar rules: ${grammarRules.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
