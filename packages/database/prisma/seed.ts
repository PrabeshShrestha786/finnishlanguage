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
    // ── Greetings & Basics (A1) ──
    { finnish: 'hei', english: 'hi / hello', pronunciation: 'HEY', partOfSpeech: 'interjection', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hei! Mitä kuuluu?', exampleTranslation: 'Hi! How are you?' },
    { finnish: 'hyvää huomenta', english: 'good morning', pronunciation: 'HU-vaa HUO-men-ta', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää huomenta, Maria!', exampleTranslation: 'Good morning, Maria!' },
    { finnish: 'hyvää päivää', english: 'good day / good afternoon', pronunciation: 'HU-vaa PAI-vaa', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää päivää, olen Matti.', exampleTranslation: 'Good day, I am Matti.' },
    { finnish: 'hyvää iltaa', english: 'good evening', pronunciation: 'HU-vaa IL-taa', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Hyvää iltaa kaikille!', exampleTranslation: 'Good evening everyone!' },
    { finnish: 'näkemiin', english: 'goodbye (formal)', pronunciation: 'NA-ke-miin', partOfSpeech: 'interjection', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Näkemiin huomenna!', exampleTranslation: 'Goodbye, see you tomorrow!' },
    { finnish: 'kiitos', english: 'thank you', pronunciation: 'KII-tos', partOfSpeech: 'interjection', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Kiitos paljon!', exampleTranslation: 'Thank you very much!' },
    { finnish: 'ole hyvä', english: "you're welcome", pronunciation: 'O-le HU-vaa', partOfSpeech: 'phrase', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Ole hyvä, ei mitään!', exampleTranslation: "You're welcome, no problem!" },
    { finnish: 'anteeksi', english: 'excuse me / sorry', pronunciation: 'AN-teek-si', partOfSpeech: 'interjection', category: 'Greetings', level: FinnishLevel.A1, exampleSentence: 'Anteeksi, missä on pankki?', exampleTranslation: 'Excuse me, where is the bank?' },
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
    { finnish: 'kahvi', english: 'coffee', pronunciation: 'KAH-vi', partOfSpeech: 'noun', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Juon kahvia joka aamu.', exampleTranslation: 'I drink coffee every morning.' },
    { finnish: 'tee', english: 'tea', pronunciation: 'TEE', partOfSpeech: 'noun', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Haluatko teetä?', exampleTranslation: 'Would you like tea?' },
    { finnish: 'vesi', english: 'water', pronunciation: 'VE-si', partOfSpeech: 'noun', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Saisinko vettä?', exampleTranslation: 'Could I have water?' },
    { finnish: 'leipä', english: 'bread', pronunciation: 'LEI-paa', partOfSpeech: 'noun', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Ostan tuoretta leipää.', exampleTranslation: 'I buy fresh bread.' },
    { finnish: 'maito', english: 'milk', pronunciation: 'MAI-to', partOfSpeech: 'noun', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Lapsi juo maitoa.', exampleTranslation: 'The child drinks milk.' },
    { finnish: 'ruoka', english: 'food', pronunciation: 'RUO-ka', partOfSpeech: 'noun', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Ruoka on valmis!', exampleTranslation: 'The food is ready!' },
    { finnish: 'lohikeitto', english: 'salmon soup', pronunciation: 'LO-hi-kei-to', partOfSpeech: 'noun', category: 'Food & Drink', level: FinnishLevel.A1, exampleSentence: 'Lohikeitto on perinteinen suomalainen ruoka.', exampleTranslation: 'Salmon soup is a traditional Finnish dish.' },

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
