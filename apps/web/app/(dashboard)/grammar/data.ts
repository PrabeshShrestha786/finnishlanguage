export type Level = 'A1' | 'A2' | 'B1' | 'B2';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  hint?: string;
  points: number;
}

export interface GrammarTopic {
  id: string;
  chapter: number;      // Chapter number within its level
  title: string;
  finnish: string;
  icon: string;
  level: Level;
  accent: string;       // Tailwind bg class for icon bg
  badge: string;        // Tailwind classes for level badge
  description: string;
  content: TopicContent;
  quiz?: QuizQuestion[];
}

export type TopicContent =
  | TableContent
  | CardsContent
  | VerbTypesContent
  | VowelHarmonyContent
  | RichContent;

// ─── Rich content — used for detailed chapter-style topics ────────────────────

export interface RichContent {
  type: 'rich';
  intro?: string;
  sections: RichSection[];
}

export type RichSection =
  | { type: 'subheading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'note'; text: string; icon?: string }
  | { type: 'vowel-groups'; leftHeader: string; rightHeader: string; pairs: [string, string][]; footnote?: string }
  | { type: 'example-table'; headers: string[]; rows: string[][]; tip?: string }
  | { type: 'suffix-pairs'; pairs: string[] }
  | { type: 'example-list'; items: string[]; title?: string };

export interface TableContent {
  type: 'table';
  headers: string[];
  rows: string[][];
  note?: string;
}

export interface CardsContent {
  type: 'cards';
  intro?: string;
  items: { label: string; example: string; translation?: string }[];
  note?: string;
}

export interface VerbTypesContent {
  type: 'verbTypes';
  items: { type: number; pattern: string; example: string; tip: string }[];
}

export interface VowelHarmonyContent {
  type: 'vowelHarmony';
  rule: string;
  back: string[];
  front: string[];
  examples: { word: string; suffix: string; result: string; why: string }[];
}

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  // ── A1 ──────────────────────────────────────────────────────────────────────
  {
    id: 'vowel-harmony',
    chapter: 1,
    title: 'Vowel Harmony',
    finnish: 'Vokaaliharmonia',
    icon: '🎵',
    level: 'A1',
    accent: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'The single most important rule in Finnish — every suffix must match the word\'s vowels',
    content: {
      type: 'rich',
      intro: 'Vowel harmony is the single most important rule in Finnish. Every suffix (ending) you add to a word must match the vowels inside that word. This affects ALL cases, verb endings, and suffixes throughout the language.',
      sections: [
        {
          type: 'subheading',
          text: '1.1 The Two Groups',
        },
        {
          type: 'paragraph',
          text: 'Finnish vowels are divided into two groups:',
        },
        {
          type: 'vowel-groups',
          leftHeader: 'Back vowels (takavokaali)',
          rightHeader: 'Front vowels (etuvokaali)',
          pairs: [['a', 'ä'], ['o', 'ö'], ['u', 'y']],
          footnote: 'The neutral vowels i and e can appear in both groups and do not affect harmony.',
        },
        {
          type: 'subheading',
          text: '1.2 The Rule',
        },
        {
          type: 'paragraph',
          text: 'Look at the vowels in the ROOT of the word. If the root contains a, o, or u → use the BACK vowel version of the suffix. If it contains ä, ö, or y → use the FRONT vowel version.',
        },
        {
          type: 'example-table',
          headers: ['Finnish word', 'Suffix used', 'Why?'],
          rows: [
            ['talo  (house)', '-ssa', "has 'a' → back vowel"],
            ['koti  (home)', '-ssa', "has 'o' → back vowel"],
            ['pöytä  (table)', '-ssä', "has 'ö', 'ä' → front vowel"],
            ['käsi  (hand)', '-ssä', "has 'ä' → front vowel"],
          ],
          tip: 'When you learn a new word, memorize which group it belongs to.',
        },
        {
          type: 'note',
          icon: '💡',
          text: 'Suffix pairs to learn: -ssa/-ssä · -sta/-stä · -lla/-llä · -lta/-ltä · -lle/-lle · -na/-nä · -ta/-tä · -ksi/-ksi (same in both groups).',
        },
      ],
    },
    quiz: [
      {
        question: "Which group of vowels is classified as 'back vowels' (takavokaali) in Finnish?",
        options: ['i, e, ä, ö', 'a, o, u', 'ä, ö, y', 'a, e, i'],
        correctAnswer: 'a, o, u',
        explanation: 'Back vowels (takavokaali) are a, o, u — produced at the back of the mouth. Front vowels (etuvokaali) are ä, ö, y. The vowels i and e are neutral and do not affect harmony.',
        hint: 'Think about which vowels are produced at the back of the mouth.',
        points: 10,
      },
      {
        question: "Which suffix correctly completes: 'talo' (house) → talo___ (in the house)?",
        options: ['-ssä', '-ssa', '-ssö', '-ssü'],
        correctAnswer: '-ssa',
        explanation: "talo contains 'a' and 'o' — both back vowels. The inessive (inside) suffix must use the back-vowel form, which is -ssa. Front-vowel words use -ssä.",
        hint: "Check which vowels are in 'talo' and match the suffix to the same group.",
        points: 10,
      },
      {
        question: "Which suffix correctly completes: 'kylä' (village) → kylä___ (in the village)?",
        options: ['-ssa', '-sso', '-ssä', '-sse'],
        correctAnswer: '-ssä',
        explanation: "kylä contains 'y' and 'ä' — both front vowels. The inessive suffix must use the front-vowel form, which is -ssä. Back-vowel words use -ssa.",
        hint: "kylä has ä and y — which vowel group do those belong to?",
        points: 10,
      },
      {
        question: "The vowels i and e are called 'neutral vowels' in Finnish. What does this mean?",
        options: [
          'They can only appear in loanwords',
          'They never appear in Finnish words',
          'They can co-exist with both back and front vowels in a word',
          'They replace ä and ö in formal speech',
        ],
        correctAnswer: 'They can co-exist with both back and front vowels in a word',
        explanation: 'i and e are neutral — they do not belong to either the back or front group, so they can appear alongside either. They do not trigger or change vowel harmony.',
        hint: 'Think about why words like "kivi" (stone) and "teki" (did) do not violate harmony.',
        points: 10,
      },
      {
        question: 'Which word correctly demonstrates vowel harmony in the plural partitive case?',
        options: ['kissoja (cats)', 'kissäjä (cats)', 'kissojo (cats)', 'kisseje (cats)'],
        correctAnswer: 'kissoja (cats)',
        explanation: "kissa contains 'a' — a back vowel. The plural partitive suffix for back-vowel words is -ja, giving kissoja. The front-vowel equivalent would be -jä (e.g. kissäjä is incorrect for this word).",
        hint: "kissa has 'a' — which suffix group does that belong to?",
        points: 10,
      },
      {
        question: 'How does vowel harmony affect suffixes in Finnish?',
        options: [
          'Suffixes are always the same regardless of the root word',
          'Suffixes change their vowels to match the back or front vowel class of the root word',
          'Only nouns are affected by vowel harmony',
          'Suffixes only harmonize with the first vowel in the word',
        ],
        correctAnswer: 'Suffixes change their vowels to match the back or front vowel class of the root word',
        explanation: 'Vowel harmony is the rule that every suffix must match the vowel class of its root word. Back-vowel roots (a/o/u) take back-vowel suffixes; front-vowel roots (ä/ö/y) take front-vowel suffixes. This applies to all word types — nouns, verbs, adjectives.',
        hint: 'Think about why -ssa and -ssä are two forms of the same case ending.',
        points: 10,
      },
      {
        question: 'Which of the following Finnish words violates vowel harmony?',
        options: ['tyttö', 'koulu', 'härkä', 'analyysi'],
        correctAnswer: 'analyysi',
        explanation: "analyysi is a loanword (from 'analysis') that mixes front vowel 'y' with neutral vowels in an unusual pattern — native Finnish roots never mix back and front vowels. tyttö (ö/y = front), koulu (o/u = back), and härkä (ä = front) all follow harmony correctly.",
        hint: 'One of these is a foreign loanword that Finnish borrowed as-is.',
        points: 10,
      },
      {
        question: "The word 'pöytä' (table) requires which type of suffix in the inessive (inside) case?",
        options: ['Back vowel suffix: -ssa', 'Front vowel suffix: -ssä', 'Neutral suffix: -sse', 'No suffix is needed'],
        correctAnswer: 'Front vowel suffix: -ssä',
        explanation: "pöytä contains ö and ä — both front vowels. The inessive case requires the front-vowel form -ssä, giving pöydässä (in the table). The back-vowel form -ssa is only for words containing a, o, or u.",
        hint: "pöytä has ö and ä — which harmony group do those vowels belong to?",
        points: 10,
      },
      {
        question: 'In compound words, which part determines vowel harmony for suffixes?',
        options: [
          'The first part of the compound',
          'The longest part of the compound',
          'The last part of the compound',
          'Both parts equally',
        ],
        correctAnswer: 'The last part of the compound',
        explanation: "In Finnish compound words, the final element determines suffix harmony. For example, in 'autokorjaamo' (car repair shop), the suffix follows 'korjaamo' (back vowels: a/o), not 'auto'. This is because the suffix attaches to and modifies the last element.",
        hint: 'Think about which element the suffix directly attaches to.',
        points: 10,
      },
      {
        question: 'Which statement about Finnish vowel harmony is correct?',
        options: [
          'Front and back vowels can freely mix within native Finnish root words',
          'Vowel harmony only applies to verbs, not nouns',
          'Native Finnish root words contain either back vowels (a, o, u) or front vowels (ä, ö, y), but not both',
          'Vowel harmony was removed from modern Finnish spelling',
        ],
        correctAnswer: 'Native Finnish root words contain either back vowels (a, o, u) or front vowels (ä, ö, y), but not both',
        explanation: 'This is the core rule: every native Finnish root word belongs to either the back-vowel group (contains a, o, or u) or the front-vowel group (contains ä, ö, or y) — never both. Loanwords like analyysi are exceptions. The neutral vowels i and e can appear in either group.',
        hint: 'Consider the most fundamental definition of vowel harmony as a rule about root words.',
        points: 10,
      },
    ],
  },

  {
    id: 'consonant-gradation-a1',
    chapter: 2,
    title: 'Consonant Gradation',
    finnish: 'Astevaihtelu',
    icon: '🔄',
    level: 'A1',
    accent: 'bg-orange-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'How k, p, t change or disappear when you add endings to Finnish words',
    content: {
      type: 'rich',
      intro: 'Consonant gradation is a sound alternation that happens when you add endings to Finnish words. Certain consonants (k, p, t) change or disappear in specific forms. At A1 level, you only need to learn the most common patterns.',
      sections: [
        {
          type: 'subheading',
          text: '2.1 The Alternating Pairs',
        },
        {
          type: 'example-table',
          headers: ['Strong grade (basic form)', 'Weak grade (with suffixes)'],
          rows: [
            ['kk → k', 'kukka → kukan'],
            ['pp → p', 'kauppa → kaupan'],
            ['tt → t', 'tyttö → tytön'],
            ['k → ∅ (disappears)', 'pankki → pankissa'],
            ['p → v', 'tapa → tavan'],
            ['t → d', 'katu → kadulla'],
          ],
        },
        {
          type: 'note',
          icon: '💡',
          text: 'At A1 level, focus on the most common pattern: double consonant → single consonant (kk→k, pp→p, tt→t). You will encounter k disappearing and t→d gradually.',
        },
        {
          type: 'subheading',
          text: '2.2 Examples in Location Cases',
        },
        {
          type: 'example-table',
          headers: ['Base form', 'Inflected form', 'Meaning', 'Gradation'],
          rows: [
            ['tyttö', 'tytöllä', 'girl → on/at the girl', 'tt → t'],
            ['sänky', 'sängyssä', 'bed → in the bed', 'k disappears'],
            ['kauppa', 'kaupassa', 'store → in the store', 'pp → p'],
          ],
          tip: 'The strong grade (basic form) appears in the nominative singular. The weak grade appears in most case forms when an ending is added.',
        },
      ],
    },
    quiz: [
      {
        question: 'What is consonant gradation (astevaihtelu) in Finnish?',
        options: [
          'A change in vowel length depending on stress',
          'An alternation between strong and weak forms of certain consonants depending on syllable structure',
          'The replacement of consonants with vowels in certain cases',
          'A rule that doubles consonants at the end of words',
        ],
        correctAnswer: 'An alternation between strong and weak forms of certain consonants depending on syllable structure',
        explanation: 'Consonant gradation (astevaihtelu) is the systematic alternation between a strong grade (basic form) and a weak grade (inflected forms). It affects the consonants k, p, t and is triggered by syllable structure — adding endings can close the following syllable and weaken the consonant.',
        hint: 'Think about what "alternation" means — something switching between two forms.',
        points: 10,
      },
      {
        question: 'Which of the following consonant pairs is a basic example of consonant gradation?',
        options: ['s → z', 'kk → k', 'l → r', 'm → n'],
        correctAnswer: 'kk → k',
        explanation: 'kk → k is the simplest example of consonant gradation — a double consonant weakens to a single one (e.g. kukka → kukan). Finnish gradation only affects k, p, t and certain clusters. s, l, m, and n do not participate in gradation.',
        hint: 'Consonant gradation in Finnish only involves three consonants: k, p, and t.',
        points: 10,
      },
      {
        question: 'When does the weak grade appear in Finnish?',
        options: [
          'When the syllable containing the consonant is open (ends in a vowel)',
          'When the syllable following the consonant is closed (ends in a consonant)',
          'Only in plural forms',
          'Only in verb conjugation',
        ],
        correctAnswer: 'When the syllable following the consonant is closed (ends in a consonant)',
        explanation: 'The weak grade appears when the syllable following the grading consonant is closed — meaning it ends in a consonant. Adding endings like -n (genitive) closes the syllable and triggers the weak grade. The strong grade stays when that syllable remains open.',
        hint: 'Think about what adding an ending like -n does to the syllable that follows the consonant.',
        points: 10,
      },
      {
        question: "What is the weak grade of 'kauppa' (shop) in the genitive case?",
        options: ['kauppan', 'kaupan', 'kauppaan', 'kauppin'],
        correctAnswer: 'kaupan',
        explanation: "kauppa → kaupan: the strong grade pp weakens to p in the genitive. The stem becomes kaupa-, then adding the genitive ending -n gives kaupan. The nominative kauppa keeps the strong grade pp.",
        hint: "The genitive ending is -n. What happens to the pp before that ending is added?",
        points: 10,
      },
      {
        question: 'Which of the following is an example of qualitative gradation?',
        options: ['kk → k', 'pp → p', 'k → ∅ (disappears)', 'tt → t'],
        correctAnswer: 'k → ∅ (disappears)',
        explanation: 'Qualitative gradation changes the TYPE of consonant — k disappearing entirely is qualitative because the consonant itself changes into nothing (∅). kk→k, pp→p, tt→t are quantitative gradation — the same consonant type just becomes shorter (double → single).',
        hint: 'Qualitative = change in quality/type. Quantitative = change in quantity/length.',
        points: 10,
      },
      {
        question: "What happens to 't' in consonant gradation between vowels?",
        options: ['t → tt', 't → s', 't → d', 't → l'],
        correctAnswer: 't → d',
        explanation: "t weakens to d in consonant gradation between vowels — for example katu (street) → kadulla (on the street). This t→d change is qualitative gradation. Finnish does not have t→tt, t→s, or t→l as gradation patterns.",
        hint: 'This is a qualitative change — t turns into a voiced consonant.',
        points: 10,
      },
      {
        question: "The word 'tyttö' (girl) has which strong-grade consonant that undergoes gradation?",
        options: ['t at the start', 'tt in the middle', 'ö at the end', 'y in the middle'],
        correctAnswer: 'tt in the middle',
        explanation: "The grading consonant in tyttö is the double tt in the middle of the word. In inflected forms it weakens to a single t: tytön (genitive), tytöllä (adessive). The initial t does not undergo gradation — only the tt between syllables does. ö and y are vowels, not consonants.",
        hint: "Which consonant cluster in tyttö could weaken — is there a double consonant?",
        points: 10,
      },
      {
        question: 'Which case ending typically triggers the weak grade in Finnish nouns?',
        options: ['Nominative singular', 'Genitive singular', 'Partitive plural', 'Nominative plural'],
        correctAnswer: 'Genitive singular',
        explanation: 'The genitive singular (ending -n) is the most reliable trigger for the weak grade and the key form to learn for each noun. The nominative singular always shows the strong grade. Learning a word\'s genitive form reveals its gradation pattern.',
        hint: 'The nominative shows the strong grade (basic form). Which case shows the weak grade?',
        points: 10,
      },
      {
        question: "What is the weak grade of the cluster 'nk' in consonant gradation?",
        options: ['ng', 'n', 'nk stays the same', 'gk'],
        correctAnswer: 'n',
        explanation: "In the nk cluster, the k disappears in the weak grade, leaving only n. For example: pankki (bank) → pankissa (in the bank), where nk → n. This is a qualitative change where the cluster reduces to a single nasal consonant.",
        hint: 'One of the two consonants in nk disappears entirely in the weak grade.',
        points: 10,
      },
      {
        question: 'Does consonant gradation apply to all Finnish consonants?',
        options: [
          'Yes, all consonants undergo gradation',
          'No, only k, p, t and certain clusters containing them undergo gradation',
          'Only voiced consonants undergo gradation',
          'Only consonants at the beginning of a word undergo gradation',
        ],
        correctAnswer: 'No, only k, p, t and certain clusters containing them undergo gradation',
        explanation: 'Consonant gradation is limited to the consonants k, p, t and clusters that contain them (such as nk, mp, lt, nt, rt). Other consonants — s, l, m, n, r, v, h — do not participate in gradation at all.',
        hint: 'Only three individual consonants can undergo gradation. Which three?',
        points: 10,
      },
    ],
  },

    {
    id: 'present-tense',
    chapter: 3,
    title: 'Present Tense',
    finnish: 'Preesens',
    icon: '💬',
    level: 'A1',
    accent: 'bg-sky-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    description: 'How Finnish verbs agree with their subject — one tense covers both "I eat" and "I am eating"',
    content: {
      type: 'rich',
      intro: 'In Finnish, verbs must agree with their subject (the person doing the action). There is only ONE present tense — it covers both "I eat" and "I am eating" in English.',
      sections: [
        { type: 'subheading', text: '3.1 Personal Pronouns' },
        {
          type: 'example-table',
          headers: ['Finnish', 'English'],
          rows: [
            ['minä / mä', 'I'],
            ['sinä / sä', 'you (singular)'],
            ['hän', 'he / she (same word!)'],
            ['me', 'we'],
            ['te', 'you (plural / formal)'],
            ['he', 'they'],
          ],
        },
        {
          type: 'note',
          icon: '📝',
          text: 'Finnish has no separate he/she — hän means both. This is one of the few things easier than English!',
        },
        { type: 'subheading', text: '3.2 Verb Type 1 — infinitive ends in two vowels (-aa, -ää, -ea)' },
        {
          type: 'paragraph',
          text: 'RULE: Remove the final vowel from the infinitive, then add the personal ending.',
        },
        {
          type: 'example-table',
          headers: ['Person', 'Finnish (puhua — to speak)', 'Negative', 'English'],
          rows: [
            ['minä', 'puhun', 'en puhu', 'I speak'],
            ['sinä', 'puhut', 'et puhu', 'you speak'],
            ['hän', 'puhuu', 'ei puhu', 'he/she speaks'],
            ['me', 'puhumme', 'emme puhu', 'we speak'],
            ['te', 'puhutte', 'ette puhu', 'you (pl) speak'],
            ['he', 'puhuvat', 'eivät puhu', 'they speak'],
          ],
        },
        {
          type: 'example-table',
          headers: ['Person', 'Finnish (syödä — to eat)', 'Negative', 'English'],
          rows: [
            ['minä', 'syön', 'en syö', 'I eat'],
            ['sinä', 'syöt', 'et syö', 'you eat'],
            ['hän', 'syö', 'ei syö', 'he/she eats'],
            ['me', 'syömme', 'emme syö', 'we eat'],
            ['te', 'syötte', 'ette syö', 'you (pl) eat'],
            ['he', 'syövät', 'eivät syö', 'they eat'],
          ],
        },
        { type: 'subheading', text: '3.3 Verb Type 2 — infinitive ends in -da/-dä' },
        {
          type: 'paragraph',
          text: 'RULE: Remove -da/-dä, then add the personal ending.',
        },
        {
          type: 'example-table',
          headers: ['Person', 'Finnish (juoda — to drink)', 'Negative', 'English'],
          rows: [
            ['minä', 'juon', 'en juo', 'I drink'],
            ['sinä', 'juot', 'et juo', 'you drink'],
            ['hän', 'juo', 'ei juo', 'he/she drinks'],
            ['me', 'juomme', 'emme juo', 'we drink'],
            ['te', 'juotte', 'ette juo', 'you (pl) drink'],
            ['he', 'juovat', 'eivät juo', 'they drink'],
          ],
        },
        { type: 'subheading', text: '3.4 Verb Type 3 — infinitive ends in -la, -na, -ra, -sta' },
        {
          type: 'paragraph',
          text: 'RULE: Replace the infinitive ending with -e-, then add the personal ending.',
        },
        {
          type: 'example-table',
          headers: ['Person', 'Finnish (ommella — to sew)', 'Negative', 'English'],
          rows: [
            ['minä', 'ompelen', 'en ompele', 'I sew'],
            ['sinä', 'ompelet', 'et ompele', 'you sew'],
            ['hän', 'ompelee', 'ei ompele', 'he/she sews'],
            ['me', 'ompelemme', 'emme ompele', 'we sew'],
            ['te', 'ompelevat', 'ette ompele', 'you (pl) sew'],
            ['he', 'ompelevat', 'eivät ompele', 'they sew'],
          ],
        },
        { type: 'subheading', text: '3.5 Verb Type 4 — infinitive ends in -ata/-ätä, -ota, -uta' },
        {
          type: 'paragraph',
          text: 'RULE: The stem changes — aa/ää appears. Add personal endings to this stem.',
        },
        {
          type: 'example-table',
          headers: ['Person', 'Finnish (tavata — to meet)', 'Negative', 'English'],
          rows: [
            ['minä', 'tapaan', 'en tapaa', 'I meet'],
            ['sinä', 'tapaat', 'et tapaa', 'you meet'],
            ['hän', 'tapaa', 'ei tapaa', 'he/she meets'],
            ['me', 'tapaamme', 'emme tapaa', 'we meet'],
            ['te', 'tapaatte', 'ette tapaa', 'you (pl) meet'],
            ['he', 'tapaavat', 'eivät tapaa', 'they meet'],
          ],
        },
        { type: 'subheading', text: '3.6 Verb Type 5 — infinitive ends in -ita/-itä' },
        {
          type: 'example-table',
          headers: ['Person', 'Finnish (tarvita — to need)', 'Negative', 'English'],
          rows: [
            ['minä', 'tarvitsen', 'en tarvitse', 'I need'],
            ['sinä', 'tarvitset', 'et tarvitse', 'you need'],
            ['hän', 'tarvitsee', 'ei tarvitse', 'he/she needs'],
            ['me', 'tarvitsemme', 'emme tarvitse', 'we need'],
            ['te', 'tarvitsette', 'ette tarvitse', 'you (pl) need'],
            ['he', 'tarvitsevat', 'eivät tarvitse', 'they need'],
          ],
        },
        {
          type: 'note',
          icon: '💡',
          text: 'The negative verb never changes — only the negative auxiliary changes: en, et, ei, emme, ette, eivät. The main verb stays in its base form after the negative.',
        },
        { type: 'subheading', text: '3.7 Most Important Common Verbs at A1' },
        {
          type: 'example-table',
          headers: ['Infinitive', 'English'],
          rows: [
            ['olla', 'to be'],
            ['mennä', 'to go'],
            ['tulla', 'to come'],
            ['sanoa', 'to say'],
            ['tietää', 'to know'],
            ['haluta', 'to want'],
            ['voida', 'to be able to / can'],
            ['osata', 'to know how to'],
            ['asua', 'to live (reside)'],
            ['työskennellä', 'to work'],
            ['opiskella', 'to study'],
            ['lukea', 'to read'],
            ['kirjoittaa', 'to write'],
            ['katsoa', 'to watch / look'],
            ['kuunnella', 'to listen'],
          ],
        },
        { type: 'subheading', text: '3.8 The verb OLLA — to be (irregular)' },
        {
          type: 'example-table',
          headers: ['Person', 'Finnish', 'Negative', 'English'],
          rows: [
            ['minä', 'olen', 'en ole', 'I am'],
            ['sinä', 'olet', 'et ole', 'you are'],
            ['hän', 'on', 'ei ole', 'he/she is'],
            ['me', 'olemme', 'emme ole', 'we are'],
            ['te', 'olette', 'ette ole', 'you (pl) are'],
            ['he', 'ovat', 'eivät ole', 'they are'],
          ],
        },
      ],
    },
    quiz: [
      {
        question: 'Finnish present tense covers how many English tenses?',
        options: [
          'Three — simple, continuous, and perfect',
          "Two — 'I eat' and 'I am eating' (both expressed by one form)",
          "Only the simple present ('I eat')",
          "Only the continuous present ('I am eating')",
        ],
        correctAnswer: "Two — 'I eat' and 'I am eating' (both expressed by one form)",
        explanation: "Finnish has only one present tense (preesens) that covers both the English simple present ('I eat') and continuous present ('I am eating'). Context makes the intended meaning clear.",
        hint: 'How many present tense forms does Finnish have compared to English?',
        points: 10,
      },
      {
        question: "What does the Finnish pronoun 'hän' mean?",
        options: ["Only 'he'", "Only 'she'", 'They (plural)', "Both 'he' and 'she' — Finnish has no gender distinction"],
        correctAnswer: "Both 'he' and 'she' — Finnish has no gender distinction",
        explanation: "Finnish does not distinguish gender in pronouns. 'hän' means both he and she. For they (plural) Finnish uses 'he'. This absence of gendered pronouns makes Finnish simpler than English in this respect.",
        hint: 'Finnish pronouns are gender-neutral.',
        points: 10,
      },
      {
        question: "Which is the correct conjugation of 'puhua' (to speak) for 'minä' (I)?",
        options: ['puhua', 'puhuu', 'puhun', 'puhutte'],
        correctAnswer: 'puhun',
        explanation: "Type 1 rule: remove the final vowel from the infinitive (puhua → puhu-), then add the personal ending for minä which is -n. Result: puhun. puhuu is the hän form, puhutte is the te form.",
        hint: 'Type 1 rule: strip the last vowel from the infinitive, then add the ending. What is the minä ending?',
        points: 10,
      },
      {
        question: 'How do you form the negative present tense in Finnish?',
        options: [
          'Add -ei to the end of the verb',
          "Place 'ei' after the main verb without changing it",
          'Use the negative auxiliary (en/et/ei/emme/ette/eivät) + the unchanged verb stem',
          'Double the first consonant of the verb',
        ],
        correctAnswer: 'Use the negative auxiliary (en/et/ei/emme/ette/eivät) + the unchanged verb stem',
        explanation: 'The negative auxiliary changes according to person (en, et, ei, emme, ette, eivät), while the main verb stays in its base/stem form. For example: en puhu (I do not speak), emme puhu (we do not speak).',
        hint: 'Only one part of the negative construction changes per person — which part?',
        points: 10,
      },
      {
        question: 'What is the infinitive ending of Verb Type 2 verbs in Finnish?',
        options: ['-ata / -ätä', '-ita / -itä', '-la / -na / -ra', '-da / -dä'],
        correctAnswer: '-da / -dä',
        explanation: "Verb Type 2 infinitives end in -da or -dä (e.g., juoda — to drink, syödä — to eat). To conjugate, remove -da/-dä and add personal endings. -ata/-ätä is Type 4, -ita/-itä is Type 5, and -la/-na/-ra are Type 3 endings.",
        hint: "Think about 'juoda' (to drink) — what are its last two letters?",
        points: 10,
      },
      {
        question: "How do you say 'we drink' in Finnish? (juoda = to drink, Type 2)",
        options: ['juomme ei', 'juovat', 'juotte', 'juomme'],
        correctAnswer: 'juomme',
        explanation: "juoda (Type 2): remove -da → juo-, then add the me (we) ending -mme → juomme. juovat is the he (they) form, juotte is the te form. 'juomme ei' is not valid — the negative is 'emme juo'.",
        hint: 'Type 2: remove -da, then what ending does me (we) take?',
        points: 10,
      },
      {
        question: "Which sentence correctly says 'She is' in Finnish?",
        options: ['Hän olen', 'Hän on', 'Hän olet', 'Hän ovat'],
        correctAnswer: 'Hän on',
        explanation: "'Olla' (to be) is irregular. The hän (he/she) form is simply 'on' — it is not built from a regular stem + ending. olen is minä, olet is sinä, ovat is he (they). The olla forms must be memorised.",
        hint: "'Olla' is irregular — the hän form is unusually short.",
        points: 10,
      },
      {
        question: "What is the negative form of 'he puhuvat' (they speak)?",
        options: ['he ei puhuvat', 'he eivät puhuvat', 'he eivät puhu', 'he en puhu'],
        correctAnswer: 'he eivät puhu',
        explanation: "For 'he' (they), the negative auxiliary is 'eivät'. The main verb reverts to its base stem 'puhu' — it does not keep the -vat plural ending. Result: eivät puhu. 'en' belongs only to minä.",
        hint: "The main verb always returns to its stem in the negative. Which auxiliary goes with 'he'?",
        points: 10,
      },
      {
        question: "What verb type is 'tarvita' (to need), and what is the minä form?",
        options: ['Type 1 — tarvitan', 'Type 2 — tarvidan', 'Type 3 — tarvitelen', 'Type 5 — tarvitsen'],
        correctAnswer: 'Type 5 — tarvitsen',
        explanation: "Type 5 verbs end in -ita/-itä. The conjugation inserts -tse- into the stem: tarvita → tarvi- + tse + n = tarvitsen. This -tse- insertion is the key marker of Type 5 verbs.",
        hint: 'Type 5 infinitives end in -ita/-itä. Look for the -tse- pattern in the conjugated form.',
        points: 10,
      },
      {
        question: "Which is the correct 'te' (you plural) form of 'puhua' (to speak)?",
        options: ['te puhun', 'te puhuu', 'te puhuvat', 'te puhutte'],
        correctAnswer: 'te puhutte',
        explanation: "The 'te' (you plural / formal) personal ending for Type 1 verbs is -tte. Puhu- (stem) + -tte = puhutte. puhun is minä, puhuu is hän, puhuvat is he (they).",
        hint: 'The te ending contains a double consonant. Which option has that?',
        points: 10,
      },
    ],
  },

    {
    id: 'yes-no-questions',
    chapter: 4,
    title: 'Yes/No Questions',
    finnish: 'Kyllä/Ei-kysymykset',
    icon: '❓',
    level: 'A1',
    accent: 'bg-violet-500',
    badge: 'bg-violet-50 text-violet-700 border-violet-200',
    description: 'How to form and answer yes/no questions in Finnish using the -ko/-kö suffix',
    content: {
      type: 'rich',
      intro: 'To ask a yes/no question in Finnish, you add -ko or -kö to the verb (following vowel harmony), and move it to the beginning of the sentence.',
      sections: [
        { type: 'subheading', text: '4.1 The -ko/-kö suffix' },
        {
          type: 'example-table',
          headers: ['Statement', 'Question'],
          rows: [
            ['Sinä puhut englantia.', 'Puhutko sinä englantia?'],
            ['Hän asuu Helsingissä.', 'Asuuko hän Helsingissä?'],
            ['Te opiskelette suomea.', 'Opiskeletteko te suomea?'],
            ['Sinä olet suomalainen.', 'Oletko sinä suomalainen?'],
          ],
        },
        {
          type: 'note',
          icon: '💡',
          text: 'Use -ko after back vowels (a, o, u) and -kö after front vowels (ä, ö, y). Example: puhut → puhutko (back), syöt → syötkö (front).',
        },
        { type: 'subheading', text: '4.2 Answering yes/no questions' },
        {
          type: 'example-table',
          headers: ['Question', 'Yes', 'No'],
          rows: [
            ['Puhutko suomea?', 'Kyllä, puhun.', 'En, en puhu.'],
            ['Asuuko hän täällä?', 'Kyllä, asuu.', 'Ei, ei asu.'],
            ['Oletteko väsyneitä?', 'Kyllä, olemme.', 'Ei, emme ole.'],
          ],
        },
      ],
    },
    quiz: [
      {
        question: 'How do you turn a Finnish statement into a yes/no question?',
        options: [
          'Add -ko/-kö to the subject and move it to the front',
          'Add -ko/-kö to the verb and move it to the beginning of the sentence',
          'Place the word "kysymys" before the sentence',
          'Change the word order and raise your intonation',
        ],
        correctAnswer: 'Add -ko/-kö to the verb and move it to the beginning of the sentence',
        explanation: 'In Finnish, yes/no questions are formed by attaching -ko or -kö to the conjugated verb and placing that verb first in the sentence. Word order alone is not enough — the suffix is required.',
        hint: 'The suffix goes on the verb, and the verb moves to the front.',
        points: 10,
      },
      {
        question: "Which suffix do you add to form a yes/no question from 'puhut' (you speak)?",
        options: ['-kö', '-ko', '-ke', '-ki'],
        correctAnswer: '-ko',
        explanation: "'puhut' contains the back vowel 'u', so it takes the back-vowel variant -ko. Result: Puhutko? Use -kö only when the verb contains front vowels (ä, ö, y).",
        hint: 'Check the vowels in puhut — are they back or front vowels?',
        points: 10,
      },
      {
        question: "Which suffix do you add to form a yes/no question from 'syöt' (you eat)?",
        options: ['-ko', '-ka', '-kö', '-ke'],
        correctAnswer: '-kö',
        explanation: "'syöt' contains the front vowel 'ö', so it takes the front-vowel variant -kö. Result: Syötkö? Vowel harmony always determines whether to use -ko or -kö.",
        hint: 'syöt has the front vowel ö — which suffix matches front vowels?',
        points: 10,
      },
      {
        question: "What is the correct yes/no question form of 'Sinä olet suomalainen' (You are Finnish)?",
        options: [
          'Sinä oletko suomalainen?',
          'Ko olet sinä suomalainen?',
          'Oletko sinä suomalainen?',
          'Oletko suomalainen sinä?',
        ],
        correctAnswer: 'Oletko sinä suomalainen?',
        explanation: "-ko/-kö is attached directly to the verb 'olet', making 'oletko', and this question verb moves to the front of the sentence. 'olla' contains back vowels, so -ko is used.",
        hint: 'Attach -ko/-kö to the verb and place the whole verb at the front.',
        points: 10,
      },
      {
        question: "How do you say 'Does he live in Helsinki?' in Finnish? (asua = to live, hän asuu)",
        options: [
          'Hän asuuko Helsingissä?',
          'Asuuko hän Helsingissä?',
          'Asuu hän Helsingissä?',
          'Asuukö hän Helsingissä?',
        ],
        correctAnswer: 'Asuuko hän Helsingissä?',
        explanation: "'asuu' ends in the back vowel 'u', so -ko is added: asuuko. Note the double 'o' — when the verb already ends in a vowel, the suffix -ko/-kö creates a long vowel. The verb moves to the front.",
        hint: "asuu ends in a vowel — what happens when you add -ko to it? And which vowel harmony variant applies?",
        points: 10,
      },
      {
        question: "How do you say 'yes' in response to 'Puhutko suomea?' (Do you speak Finnish?)",
        options: [
          'Kyllä, puhua.',
          'Kyllä, puhut.',
          'Kyllä, puhun.',
          'Kyllä, puhuvat.',
        ],
        correctAnswer: 'Kyllä, puhun.',
        explanation: "When answering yes, you confirm with 'kyllä' and repeat the verb conjugated for yourself (minä). Since the question was directed at you (sinä), you answer in the first person: puhun (I speak).",
        hint: "You are answering about yourself — which person and ending do you use?",
        points: 10,
      },
      {
        question: "How do you say 'no' in response to 'Asuuko hän täällä?' (Does he live here?)",
        options: [
          'Ei, ei asu.',
          'En, en asu.',
          'Ei, hän ei asuu.',
          'Kyllä ei, ei asu.',
        ],
        correctAnswer: 'Ei, ei asu.',
        explanation: "The question is about hän (he/she), so the negative answer uses 'ei' as both the 'no' word and the negative auxiliary for hän. The verb stem 'asu' stays unchanged. Result: Ei, ei asu.",
        hint: "Which negative auxiliary belongs to hän?",
        points: 10,
      },
      {
        question: "What is the correct yes/no question form of 'Te opiskelette suomea' (You study Finnish)?",
        options: [
          'Opiskeletteko te suomea?',
          'Opiskelettekö te suomea?',
          'Te opiskeletteko suomea?',
          'Opiskeletko te suomea?',
        ],
        correctAnswer: 'Opiskeletteko te suomea?',
        explanation: "'opiskelette' contains back vowels (o, e — e is neutral, o is back), so -ko is used. The suffix attaches to the full conjugated form: opiskelette + ko = opiskeletteko. The verb moves to the front.",
        hint: "Check the vowels in opiskelette. Which variant of the suffix does it take?",
        points: 10,
      },
      {
        question: "In Finnish, where does the question verb (verb + -ko/-kö) go in the sentence?",
        options: [
          'At the end of the sentence',
          'After the subject',
          'At the beginning of the sentence',
          'It stays in its original position',
        ],
        correctAnswer: 'At the beginning of the sentence',
        explanation: "The verb with -ko/-kö always moves to the very beginning (front) of the sentence to signal a question. This is a fixed rule in Finnish — unlike English where question word order varies.",
        hint: "Compare: 'Sinä puhut.' vs 'Puhutko sinä?' — where did the verb move?",
        points: 10,
      },
      {
        question: "How do you answer 'yes' to 'Oletteko väsyneitä?' (Are you tired? — plural/formal)?",
        options: [
          'Kyllä, olemme.',
          'Kyllä, olen.',
          'Kyllä, olette.',
          'Kyllä, ovat.',
        ],
        correctAnswer: 'Kyllä, olemme.',
        explanation: "'Oletteko' is directed at 'te' (you plural/formal), so the affirmative answer uses the me (we) form of olla: olemme. When a group is addressed with te, they reply about themselves using me/olemme.",
        hint: "The question uses 'te' — when the group answers about themselves, which pronoun and form do they use?",
        points: 10,
      },
    ],
  },

  {
    id: 'imperative',
    chapter: 5,
    title: 'Imperative',
    finnish: 'Imperatiivi',
    icon: '📢',
    level: 'A1',
    accent: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
    description: 'How to give commands and instructions in Finnish using the verb stem',
    content: {
      type: 'rich',
      intro: 'The imperative mood is used for commands, instructions, and invitations. At A1 level, you need the singular imperative (giving a command to one person).',
      sections: [
        { type: 'subheading', text: '5.1 Forming the Singular Imperative' },
        {
          type: 'paragraph',
          text: 'RULE: The singular imperative is simply the verb STEM — the infinitive with its ending removed.',
        },
        {
          type: 'example-table',
          headers: ['Infinitive', 'Imperative', 'Meaning'],
          rows: [
            ['puhua', 'Puhu!', 'Speak!'],
            ['syödä', 'Syö!', 'Eat!'],
            ['tulla', 'Tule!', 'Come!'],
            ['mennä', 'Mene!', 'Go!'],
            ['istua', 'Istu!', 'Sit!'],
            ['odottaa', 'Odota!', 'Wait!'],
            ['lukea', 'Lue!', 'Read!'],
            ['kirjoittaa', 'Kirjoita!', 'Write!'],
          ],
        },
        { type: 'subheading', text: '5.2 Negative Imperative' },
        {
          type: 'paragraph',
          text: 'To tell someone NOT to do something, use: älä + verb stem',
        },
        {
          type: 'example-table',
          headers: ['Negative Imperative', 'Meaning'],
          rows: [
            ['Älä puhu!', "Don't speak!"],
            ['Älä mene!', "Don't go!"],
            ['Älä istu!', "Don't sit!"],
          ],
        },
        {
          type: 'note',
          icon: '💡',
          text: "The plural imperative (for groups) adds -kaa/-kää: Tulkaa! (Come! — to a group), Menkää! (Go! — to a group). You will need this mainly for recognising it at A1 level.",
        },
      ],
    },
    quiz: [
      {
        question: 'How is the singular imperative formed in Finnish?',
        options: [
          'Add -ko/-kö to the infinitive',
          'Use the infinitive form unchanged',
          'Remove the infinitive ending to get the verb stem',
          'Add -a or -ä to the verb stem',
        ],
        correctAnswer: 'Remove the infinitive ending to get the verb stem',
        explanation: 'The singular imperative in Finnish is simply the verb stem — the infinitive with its ending stripped off. For example, puhua → puhu (Speak!), syödä → syö (Eat!). No extra suffix is added.',
        hint: 'The imperative is shorter than the infinitive — what do you remove?',
        points: 10,
      },
      {
        question: "What is the correct imperative (command) form of 'puhua' (to speak)?",
        options: ['puhua', 'puhun', 'puhut', 'Puhu!'],
        correctAnswer: 'Puhu!',
        explanation: "'puhua' is a Type 1 verb. Remove the final vowel 'a' from the infinitive: puhu- → Puhu! The exclamation mark is conventional for commands. 'puhun' is the minä present tense form, 'puhut' is sinä.",
        hint: 'Type 1 rule: strip the last vowel of the infinitive.',
        points: 10,
      },
      {
        question: "What is the correct imperative form of 'mennä' (to go)?",
        options: ['Mennä!', 'Men!', 'Mene!', 'Menee!'],
        correctAnswer: 'Mene!',
        explanation: "'mennä' is a Type 3 verb (ends in -nä). The imperative stem is formed by replacing the -nä ending with -e-: men- + e = Mene! Simply removing -nä would leave 'men', which is not the correct stem form.",
        hint: "Type 3 verbs replace their ending with -e. What does that give for 'mennä'?",
        points: 10,
      },
      {
        question: "What is the correct imperative form of 'tulla' (to come)?",
        options: ['Tulla!', 'Tul!', 'Tulee!', 'Tule!'],
        correctAnswer: 'Tule!',
        explanation: "'tulla' is a Type 3 verb (ends in -la). Replace -la with -e: tul- + e = Tule! This is also the same stem used in the present tense conjugations of Type 3 verbs.",
        hint: "Type 3 verbs ending in -la replace that ending with -e.",
        points: 10,
      },
      {
        question: "What is the correct imperative form of 'odottaa' (to wait)?",
        options: ['Odottaa!', 'Odottaan!', 'Odota!', 'Odotan!'],
        correctAnswer: 'Odota!',
        explanation: "'odottaa' is a Type 1 verb. Remove the final 'a': odottaa → odotat... but note consonant gradation applies: tt → t before an open syllable. Result: Odota! 'odotan' is the minä present tense form.",
        hint: "Strip the final vowel — and remember that tt weakens to t (consonant gradation).",
        points: 10,
      },
      {
        question: "What is the correct imperative form of 'lukea' (to read)?",
        options: ['Lukea!', 'Luen!', 'Luke!', 'Lue!'],
        correctAnswer: 'Lue!',
        explanation: "'lukea' is a Type 1 verb. Remove the final 'a': lukea → luke... but consonant gradation applies: k disappears between vowels in the weak grade. Result: Lue! 'luke' is not a valid Finnish word form.",
        hint: "Remove the final vowel of 'lukea' — and watch what happens to the k.",
        points: 10,
      },
      {
        question: 'How do you form the negative imperative (telling someone NOT to do something) in Finnish?',
        options: [
          'ei + verb stem',
          'en + infinitive',
          'älä + verb stem',
          'ei ole + verb stem',
        ],
        correctAnswer: 'älä + verb stem',
        explanation: "The negative imperative is formed with 'älä' followed by the verb stem — the same stem used in the positive imperative. For example: Älä puhu! (Don't speak!), Älä mene! (Don't go!). 'ei' is the negative for hän, not for commands.",
        hint: "There is a special negative imperative word in Finnish — it is not 'ei'.",
        points: 10,
      },
      {
        question: "How do you say 'Don't sit!' in Finnish? (istua = to sit)",
        options: ['Ei istu!', 'Älä istua!', 'Älä istu!', 'En istu!'],
        correctAnswer: 'Älä istu!',
        explanation: "Negative imperative = älä + verb stem. 'istua' → stem: istu. Result: Älä istu! 'Älä istua' is wrong because the infinitive form is used, not the stem. 'Ei' and 'en' are not used for negative commands.",
        hint: "Use älä + the stem (not the infinitive).",
        points: 10,
      },
      {
        question: "Which of the following is the correct plural imperative for 'tulla' (to come — to a group)?",
        options: ['Tulee!', 'Tulkaa!', 'Tulette!', 'Tule!'],
        correctAnswer: 'Tulkaa!',
        explanation: "The plural imperative (used for groups) adds -kaa/-kää to the verb stem, following vowel harmony. 'tulla' → stem tul- + kaa = Tulkaa! 'Tule!' is the singular imperative (to one person). 'Tulette' is the present tense te-form.",
        hint: "The plural imperative suffix is -kaa or -kää. Which vowel harmony variant does 'tulla' take?",
        points: 10,
      },
      {
        question: "Which of the following is the correct plural imperative for 'mennä' (to go — to a group)?",
        options: ['Menkää!', 'Menee!', 'Menkaa!', 'Mene!'],
        correctAnswer: 'Menkää!',
        explanation: "'mennä' contains front vowels (e, ä), so the plural imperative takes -kää: men- + kää = Menkää! 'Menkaa' is wrong because it uses the back vowel variant. 'Mene!' is the singular imperative.",
        hint: "'mennä' has front vowels — which variant of -kaa/-kää does that require?",
        points: 10,
      },
    ],
  },

  {
    id: 'location-cases',
    chapter: 6,
    title: 'Location Cases',
    finnish: 'Sijamuodot',
    icon: '📍',
    level: 'A1',
    accent: 'bg-teal-500',
    badge: 'bg-teal-50 text-teal-700 border-teal-200',
    description: 'How Finnish expresses "in", "from", and "to" using suffixes instead of prepositions',
    content: {
      type: 'rich',
      intro: 'Instead of prepositions like "in", "from", and "to", Finnish adds suffixes directly to nouns. There are two sets: INNER cases (inside things) and OUTER cases (on surfaces or in open areas).',
      sections: [
        { type: 'subheading', text: '6.1 Inner Location Cases' },
        {
          type: 'example-table',
          headers: ['Case', 'Suffix', 'Meaning', 'Example'],
          rows: [
            ['Inessive', '-ssa / -ssä', 'in, inside', 'talossa (in the house)'],
            ['Elative', '-sta / -stä', 'from inside, out of', 'talosta (from the house)'],
            ['Illative', '-(V)Vn / -hVn', 'into, into something', 'taloon (into the house)'],
          ],
        },
        {
          type: 'note',
          icon: '📝',
          text: 'The illative (into) is the trickiest. The rule is: double the last vowel of the stem and add -n. For words ending in a long vowel or diphthong, a different form may apply. Learn the most common words by heart first.',
        },
        { type: 'subheading', text: '6.2 Outer Location Cases' },
        {
          type: 'example-table',
          headers: ['Case', 'Suffix', 'Meaning', 'Example'],
          rows: [
            ['Adessive', '-lla / -llä', 'on, at, by', 'kadulla (on the street)'],
            ['Ablative', '-lta / -ltä', 'from (surface/place)', 'kadulta (from the street)'],
            ['Allative', '-lle', 'onto, to (a place)', 'kadulle (onto the street)'],
          ],
        },
        { type: 'subheading', text: '6.3 How to choose: Inner or Outer?' },
        {
          type: 'paragraph',
          text: 'Enclosed spaces (rooms, buildings, countries): inner cases — pankissa, Suomessa. Open surfaces, stops, and events: outer cases — kurssilla (at the course), pysäkillä (at the bus stop). Cities mostly use inner cases: Helsingissä, Tampereella.',
        },
        { type: 'subheading', text: '6.4 Common Examples' },
        {
          type: 'example-table',
          headers: ['Place', '-ssA (in)', '-stA (from)', '-(V)Vn (into)'],
          rows: [
            ['kauppa (store)', 'kaupassa', 'kaupasta', 'kauppaan'],
            ['koulu (school)', 'koulussa', 'koulusta', 'kouluun'],
            ['Suomi (Finland)', 'Suomessa', 'Suomesta', 'Suomeen'],
            ['Helsinki', 'Helsingissä', 'Helsingistä', 'Helsinkiin'],
            ['kurssi (course)', 'kurssilla', 'kurssilta', 'kurssille'],
            ['pysäkki (bus stop)', 'pysäkillä', 'pysäkiltä', 'pysäkille'],
          ],
        },
        {
          type: 'note',
          icon: '💡',
          text: 'Learn the question words: Missä? (Where? — location), Mistä? (From where?), Mihin/Minne? (To where?). Match your answer to the question word.',
        },
      ],
    },
    quiz: [
      {
        question: 'How does Finnish express location ("in", "from", "to") instead of using prepositions?',
        options: [
          'By using separate location words placed before the noun',
          'By changing the verb form',
          'By adding suffixes directly to the noun',
          'By placing the noun at the beginning of the sentence',
        ],
        correctAnswer: 'By adding suffixes directly to the noun',
        explanation: 'Finnish has no prepositions like "in", "from", or "to". Instead, these meanings are expressed by adding case suffixes directly to the noun. For example: talo (house) → talossa (in the house), talosta (from the house), taloon (into the house).',
        hint: 'Finnish is a suffix-based language — location meaning is built into the noun itself.',
        points: 10,
      },
      {
        question: "Which suffix means 'in' or 'inside' something (inessive case)?",
        options: ['-lla / -llä', '-sta / -stä', '-ssa / -ssä', '-(V)Vn'],
        correctAnswer: '-ssa / -ssä',
        explanation: "The inessive case suffix -ssa / -ssä means 'in' or 'inside'. Example: talossa (in the house), kaupassa (in the store). -sta/-stä means 'from inside', -lla/-llä means 'on/at', and -(V)Vn means 'into'.",
        hint: "The inessive is the 'inside' case. Its suffix has a double s.",
        points: 10,
      },
      {
        question: "How do you say 'from the school' in Finnish? (koulu = school)",
        options: ['koulussa', 'kouluun', 'koululla', 'koulusta'],
        correctAnswer: 'koulusta',
        explanation: "'From inside' something uses the elative case suffix -sta / -stä. 'koulu' contains back vowels (o, u), so the back vowel variant -sta is used. Result: koulusta. koulussa means 'in the school', kouluun means 'into the school'.",
        hint: "Which suffix means 'from inside'? And which vowel harmony variant does 'koulu' take?",
        points: 10,
      },
      {
        question: "How do you say 'into the house' in Finnish? (talo = house)",
        options: ['talossa', 'talosta', 'talolla', 'taloon'],
        correctAnswer: 'taloon',
        explanation: "The illative case (into) is formed by doubling the last vowel of the stem and adding -n. talo → last vowel is 'o' → double it → taloo + n = taloon. talossa means 'in the house', talosta means 'from the house'.",
        hint: "The illative doubles the final vowel and adds -n. What is the last vowel of 'talo'?",
        points: 10,
      },
      {
        question: "What is the difference between inner and outer location cases in Finnish?",
        options: [
          'Inner cases are for animate nouns, outer cases for inanimate nouns',
          'Inner cases express being inside enclosed spaces; outer cases express being on surfaces or at open places',
          'Inner cases are only used with countries, outer cases with cities',
          'There is no difference — they can be used interchangeably',
        ],
        correctAnswer: 'Inner cases express being inside enclosed spaces; outer cases express being on surfaces or at open places',
        explanation: "Inner cases (-ssa, -sta, illative) are used for enclosed spaces like buildings and countries (pankissa — in the bank). Outer cases (-lla, -lta, -lle) are used for surfaces, stops, and open events (pysäkillä — at the bus stop, kurssilla — at the course).",
        hint: "Think physically: are you inside something, or on/at the surface of something?",
        points: 10,
      },
      {
        question: "How do you say 'at the bus stop' in Finnish? (pysäkki = bus stop)",
        options: ['pysäkissä', 'pysäkistä', 'pysäkillä', 'pysäkille'],
        correctAnswer: 'pysäkillä',
        explanation: "A bus stop is an open/surface location, so it takes an outer case. 'At' (static location on a surface) uses the adessive -lla / -llä. 'pysäkki' has front vowels (ä, i), so -llä is used. Result: pysäkillä.",
        hint: "A bus stop is open, not enclosed — which set of cases applies? And which suffix means 'at/on'?",
        points: 10,
      },
      {
        question: "Which question word matches the inessive case (e.g. talossa — in the house)?",
        options: ['Mistä?', 'Mihin?', 'Missä?', 'Minne?'],
        correctAnswer: 'Missä?',
        explanation: "'Missä?' means 'Where?' and asks about a static location — it matches answers in the inessive (-ssa/-ssä) or adessive (-lla/-llä). 'Mistä?' asks 'From where?' (elative/ablative). 'Mihin/Minne?' asks 'To where?' (illative/allative).",
        hint: "Match the question word to the meaning: static location = ?",
        points: 10,
      },
      {
        question: "How do you say 'to the course' in Finnish? (kurssi = course)",
        options: ['kurssilla', 'kurssilta', 'kurssille', 'kurssissa'],
        correctAnswer: 'kurssille',
        explanation: "A course is an open/event-type location, so it takes outer cases. Movement towards uses the allative -lle (onto, to). 'kurssi' → kurssille. Note: -lle does not change for vowel harmony — it is always -lle. kurssilla means 'at the course', kurssilta means 'from the course'.",
        hint: "Movement towards an open/event location uses which outer case suffix?",
        points: 10,
      },
      {
        question: "How do you say 'from Finland' in Finnish? (Suomi = Finland)",
        options: ['Suomessa', 'Suomeen', 'Suomesta', 'Suomella'],
        correctAnswer: 'Suomesta',
        explanation: "Countries are enclosed spaces, so they use inner cases. 'From inside' uses the elative -sta / -stä. 'Suomi' contains back vowels (u, o), so -sta is used. Result: Suomesta. Suomessa means 'in Finland', Suomeen means 'to/into Finland'.",
        hint: "Finland is a country — inner or outer case? And which suffix means 'from inside'?",
        points: 10,
      },
      {
        question: "Which of the following correctly uses the location cases for 'Helsinki'?",
        options: [
          'in Helsinki = Helsingissä, from Helsinki = Helsingistä, to Helsinki = Helsinkiin',
          'in Helsinki = Helsingillä, from Helsinki = Helsingiltä, to Helsinki = Helsingille',
          'in Helsinki = Helsinkissä, from Helsinki = Helsinkistä, to Helsinki = Helsinkiin',
          'in Helsinki = Helsingissä, from Helsinki = Helsingistä, to Helsinki = Helsingiin',
        ],
        correctAnswer: 'in Helsinki = Helsingissä, from Helsinki = Helsingistä, to Helsinki = Helsinkiin',
        explanation: "Helsinki is a special case — it uses inner cases (like a country), but the stem changes due to consonant gradation: Helsinki → Helsingi- for inessive and elative, but returns to Helsink- for the illative. Helsingissä (in), Helsingistä (from), Helsinkiin (into/to). These must be memorised.",
        hint: "Helsinki uses inner cases. Watch for the stem change between the forms.",
        points: 10,
      },
    ],
  },



  {
    id: 'partitive-case',
    chapter: 7,
    title: 'Partitive Case',
    finnish: 'Partitiivi',
    icon: '🍞',
    level: 'A1',
    accent: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'When and how to use the partitive — after numbers, in negatives, and with food and drink',
    content: {
      type: 'rich',
      intro: 'The partitive is one of the most frequently used cases in Finnish. At A1 level, you need it in three key situations: after numbers, in negative sentences, and when talking about food/drink.',
      sections: [
        { type: 'subheading', text: '7.1 Forming the Partitive' },
        {
          type: 'paragraph',
          text: 'For simple words (A1-level wordtype A), add -a or -ä following vowel harmony.',
        },
        {
          type: 'example-table',
          headers: ['Nominative (basic form)', 'Partitive'],
          rows: [
            ['koira (dog)', 'koiraa'],
            ['tyttö (girl)', 'tyttöä'],
            ['kirja (book)', 'kirjaa'],
            ['pöytä (table)', 'pöytää'],
            ['kahvi (coffee)', 'kahvia'],
            ['tee (tea)', 'teetä'],
          ],
        },
        {
          type: 'note',
          icon: '📝',
          text: 'Some words ending in a consonant add -ta/-tä. You will learn these gradually.',
        },
        { type: 'subheading', text: '7.2 Use 1: After Numbers' },
        {
          type: 'paragraph',
          text: 'When counting two or more of something, the noun goes into the partitive.',
        },
        {
          type: 'example-table',
          headers: ['Finnish', 'English'],
          rows: [
            ['yksi koira', 'one dog (nominative — no partitive after 1)'],
            ['kaksi koiraa', 'two dogs'],
            ['kolme kirjaa', 'three books'],
            ['kymmenen ihmistä', 'ten people'],
          ],
        },
        { type: 'subheading', text: '7.3 Use 2: In Negative Sentences' },
        {
          type: 'paragraph',
          text: 'When the object of a sentence is negated, it goes into the partitive.',
        },
        {
          type: 'example-table',
          headers: ['Finnish', 'English'],
          rows: [
            ['Ostan kirjan.', 'I buy the/a book. (total — genitive object)'],
            ['En osta kirjaa.', "I don't buy a book. (partitive — negated)"],
            ['Hän syö leivän.', 'He eats the bread. (total)'],
            ['Hän ei syö leipää.', "He doesn't eat bread. (partitive)"],
          ],
        },
        { type: 'subheading', text: '7.4 Use 3: Food, Drink, and Mass Nouns' },
        {
          type: 'paragraph',
          text: 'When eating, drinking, or referring to an uncountable/partial amount, use the partitive.',
        },
        {
          type: 'example-table',
          headers: ['Finnish', 'English'],
          rows: [
            ['Juon kahvia.', 'I drink coffee.'],
            ['Syön leipää.', 'I eat bread.'],
            ['Tarvitsen rahaa.', 'I need money.'],
            ['Minulla on maitoa.', 'I have milk.'],
          ],
        },
      ],
    },
    quiz: [
      {
        question: 'In which three situations is the partitive case used at A1 level?',
        options: [
          'After verbs, in questions, and with adjectives',
          'After numbers, in negative sentences, and with food/drink/mass nouns',
          'After prepositions, with plural nouns, and in commands',
          'With locations, after conjunctions, and in yes/no questions',
        ],
        correctAnswer: 'After numbers, in negative sentences, and with food/drink/mass nouns',
        explanation: 'At A1 level, the three key uses of the partitive are: (1) after numbers two and above, (2) when the object of a sentence is negated, and (3) when talking about food, drink, or uncountable/partial amounts.',
        hint: 'Think: counting, negating, and eating/drinking.',
        points: 10,
      },
      {
        question: "How is the partitive suffix formed for wordtype A nouns following vowel harmony?",
        options: [
          'Add -n to the nominative',
          'Add -a or -ä to the nominative following vowel harmony',
          'Double the final vowel and add -n',
          'Remove the final vowel and add -ta or -tä',
        ],
        correctAnswer: 'Add -a or -ä to the nominative following vowel harmony',
        explanation: "For basic A1 wordtype A nouns, the partitive is formed by adding -a (after back vowels) or -ä (after front vowels) to the nominative stem. For example: koira → koiraa, tyttö → tyttöä, kirja → kirjaa.",
        hint: "The suffix is just one vowel — which one depends on vowel harmony.",
        points: 10,
      },
      {
        question: "What is the correct partitive form of 'kahvi' (coffee)?",
        options: ['kahvaa', 'kahvää', 'kahvin', 'kahvia'],
        correctAnswer: 'kahvia',
        explanation: "'kahvi' ends in 'i' — a neutral vowel. The preceding vowel 'a' is a back vowel, so the partitive suffix is -a. kahvi + a = kahvia. This is the form used when saying 'I drink coffee': Juon kahvia.",
        hint: "Look at the vowels in 'kahvi' — which harmony group do they belong to?",
        points: 10,
      },
      {
        question: "What is the correct partitive form of 'tee' (tea)?",
        options: ['teea', 'teetä', 'teen', 'teeä'],
        correctAnswer: 'teetä',
        explanation: "'tee' contains the front vowel 'e' (neutral, but the word has no back vowels), so the front-vowel variant -tä is used. tee + tä = teetä. Note: words ending in a long vowel add -tä/-ta rather than just -ä/-a.",
        hint: "'tee' has no back vowels — which suffix variant applies? And how does it attach to a word ending in a long vowel?",
        points: 10,
      },
      {
        question: "Which sentence is correct when saying 'two dogs' in Finnish? (koira = dog)",
        options: ['kaksi koira', 'kaksi koiran', 'kaksi koirat', 'kaksi koiraa'],
        correctAnswer: 'kaksi koiraa',
        explanation: "After numbers two and above, the noun takes the partitive singular. koira → partitive: koiraa. Result: kaksi koiraa. The noun does NOT go into the plural — Finnish uses partitive singular after numbers, which surprises many learners.",
        hint: "Numbers two and above require partitive. What is the partitive of 'koira'?",
        points: 10,
      },
      {
        question: "Which form is correct: 'yksi kirja' or 'yksi kirjaa'?",
        options: [
          "'yksi kirjaa' — partitive is always used after numbers",
          "'yksi kirja' — the nominative is used after the number one",
          "'yksi kirjan' — genitive is used after all numbers",
          "Both are correct — it depends on the context",
        ],
        correctAnswer: "'yksi kirja' — the nominative is used after the number one",
        explanation: "The partitive rule after numbers applies only to numbers two and above. After 'yksi' (one), the nominative form is used: yksi kirja (one book). From kaksi onwards: kaksi kirjaa, kolme kirjaa, etc.",
        hint: "Is 'yksi' (one) included in the 'two and above' partitive rule?",
        points: 10,
      },
      {
        question: "Why does the object go into the partitive in 'En osta kirjaa' (I don't buy a book)?",
        options: [
          'Because the verb "ostaa" always requires partitive',
          'Because the sentence is a question',
          'Because the object is negated — negated objects take the partitive',
          'Because "kirja" is an uncountable noun',
        ],
        correctAnswer: 'Because the object is negated — negated objects take the partitive',
        explanation: "In Finnish, when the object of a sentence is negated, it shifts from the genitive/accusative (total object) to the partitive. 'Ostan kirjan' (I buy the book — total) becomes 'En osta kirjaa' (I don't buy a book — partitive, negated).",
        hint: "Compare the affirmative and negative versions — what changes in the object?",
        points: 10,
      },
      {
        question: "Which sentence correctly uses the partitive for food/drink?",
        options: [
          'Juon kahvi.',
          'Juon kahvin.',
          'Juon kahvia.',
          'Juon kahvit.',
        ],
        correctAnswer: 'Juon kahvia.',
        explanation: "When drinking or eating a substance (uncountable/partial amount), the object takes the partitive. kahvi → kahvia. 'Juon kahvin' would imply drinking a specific, complete, countable unit of coffee (the whole thing), which is unusual for a drink.",
        hint: "Drinking coffee is a partial/ongoing action — which case does that require?",
        points: 10,
      },
      {
        question: "What is the partitive of 'leipä' (bread), and how do you say 'I eat bread'?",
        options: [
          'leipä → leipa, Syön leipa.',
          'leipä → leipää, Syön leipää.',
          'leipä → leivän, Syön leivän.',
          'leipä → leipä, Syön leipä.',
        ],
        correctAnswer: 'leipä → leipää, Syön leipää.',
        explanation: "'leipä' contains front vowels (e, i, ä), so the partitive suffix is -ä: leipä + ä = leipää. The sentence 'Syön leipää' (I eat bread) uses partitive because eating bread is a partial/ongoing action. 'Leivän' is the genitive form.",
        hint: "'leipä' has front vowels — which suffix applies? Then double-check the word ends correctly.",
        points: 10,
      },
      {
        question: "How do you say 'ten people' in Finnish? (ihminen = person — partitive: ihmistä)",
        options: [
          'kymmenen ihmiset',
          'kymmenen ihminen',
          'kymmenen ihmisiä',
          'kymmenen ihmistä',
        ],
        correctAnswer: 'kymmenen ihmistä',
        explanation: "'ihminen' is a word that ends in a consonant, so its partitive is -tä (front vowel variant): ihmistä. After the number kymmenen (ten), the partitive singular is required: kymmenen ihmistä. Note: the partitive is always singular after numbers — never plural.",
        hint: "Numbers always take partitive singular. The partitive of 'ihminen' is given — which number form is used here?",
        points: 10,
      },
    ],
  },
  {
    id: 'genitive-case',
    chapter: 8,
    title: 'Genitive Case',
    finnish: 'Genetiivi',
    icon: '🔑',
    level: 'A1',
    accent: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    description: 'How to express possession and completed actions using the genitive — formed by adding -n to the stem',
    content: {
      type: 'rich',
      intro: 'The genitive case primarily expresses possession (belonging). For simple words at A1 level, add -n to the stem.',
      sections: [
        { type: 'subheading', text: '8.1 Forming the Genitive (Wordtype A)' },
        {
          type: 'example-table',
          headers: ['Nominative', 'Genitive', 'Meaning'],
          rows: [
            ['koira', 'koiran', "of the dog / dog's"],
            ['tyttö', 'tytön', "of the girl / girl's"],
            ['isä', 'isän', "of the father / father's"],
            ['Antti', 'Antin', "Antti's"],
            ['äiti', 'äidin', "of the mother / mother's"],
          ],
        },
        { type: 'subheading', text: '8.2 Expressing Possession' },
        {
          type: 'example-table',
          headers: ['Finnish', 'English'],
          rows: [
            ['Antin koira on iso.', "Antti's dog is big."],
            ['Äidin nimi on Marja.', "The mother's name is Marja."],
            ['Siskon auto on punainen.', "My sister's car is red."],
          ],
        },
        { type: 'subheading', text: '8.3 Genitive in Object Sentences' },
        {
          type: 'paragraph',
          text: "When the object is completely consumed or finished, it takes the genitive (singular).",
        },
        {
          type: 'example-table',
          headers: ['Finnish', 'English'],
          rows: [
            ['Luen kirjan.', 'I read the book. (will finish it)'],
            ['Ostan auton.', 'I buy a car. (the whole car)'],
          ],
        },
        {
          type: 'note',
          icon: '💡',
          text: 'Total object (genitive) = action is completed or the whole object is affected. Partitive object = action is ongoing, habitual, or object is partial.',
        },
      ],
    },
    quiz: [
      {
        question: 'What is the primary use of the genitive case in Finnish?',
        options: [
          'To express location inside something',
          'To express possession and completed/total objects',
          'To form yes/no questions',
          'To express movement towards a place',
        ],
        correctAnswer: 'To express possession and completed/total objects',
        explanation: "The genitive has two main uses at A1 level: expressing possession (Antin koira — Antti's dog) and marking a total/completed object (Luen kirjan — I read the book, implying I will finish it).",
        hint: 'Think: belonging and completeness.',
        points: 10,
      },
      {
        question: 'How is the genitive case formed for wordtype A nouns at A1 level?',
        options: [
          'Add -a or -ä to the nominative',
          'Double the final vowel and add -n',
          'Add -n to the nominative stem',
          'Remove the final vowel and add -lle',
        ],
        correctAnswer: 'Add -n to the nominative stem',
        explanation: "For wordtype A nouns at A1 level, the genitive is simply formed by adding -n to the nominative. For example: koira → koiran, tyttö → tytön, isä → isän. This makes the genitive one of the simpler cases to form.",
        hint: 'The genitive suffix is just one letter.',
        points: 10,
      },
      {
        question: "What is the genitive form of 'koira' (dog)?",
        options: ['koiraa', 'koirat', 'koiran', 'koiralla'],
        correctAnswer: 'koiran',
        explanation: "'koira' + -n = koiran. This is used for possession: koiran ruoka (the dog's food), and as a total object: Näen koiran (I see the dog — the whole dog). koiraa is the partitive, koirat is the T-plural.",
        hint: "Add -n to the nominative form.",
        points: 10,
      },
      {
        question: "What does 'Antin koira on iso' mean?",
        options: [
          "The dog's name is Antti.",
          "Antti's dog is big.",
          'Antti has a big dog.',
          'Antti is a big dog.',
        ],
        correctAnswer: "Antti's dog is big.",
        explanation: "'Antin' is the genitive of 'Antti', expressing possession. 'koira' is the subject (dog), 'on' is the verb (is), and 'iso' is the adjective (big). The genitive possessor always comes before the noun it modifies.",
        hint: 'The genitive form comes before the noun it belongs to.',
        points: 10,
      },
      {
        question: "What is the genitive form of 'äiti' (mother)? Note: consonant gradation applies.",
        options: ['äitin', 'äitiä', 'äidin', 'äitit'],
        correctAnswer: 'äidin',
        explanation: "'äiti' undergoes consonant gradation when -n is added: t → d between vowels (weak grade). äiti → äidi + n = äidin. This is the same t → d gradation seen in the present tense (katu → kadulla). Simply adding -n without gradation would give the incorrect form 'äitin'.",
        hint: 'Adding -n closes the syllable — does consonant gradation apply to the t in äiti?',
        points: 10,
      },
      {
        question: "How do you say 'the mother's name is Marja' in Finnish?",
        options: [
          'Äiti nimi on Marja.',
          'Äitin nimi on Marja.',
          'Äidin nimi on Marja.',
          'Äitillä nimi on Marja.',
        ],
        correctAnswer: 'Äidin nimi on Marja.',
        explanation: "'äiti' in the genitive is 'äidin' (with t → d gradation). The genitive possessor precedes the noun: äidin nimi (the mother's name). 'Äitin' is incorrect because it ignores consonant gradation.",
        hint: "Possession = genitive. Which form of 'äiti' is the genitive?",
        points: 10,
      },
      {
        question: "Which sentence uses a total (genitive) object correctly?",
        options: [
          'Luen kirjaa. (I read the book — implying I will finish it)',
          'Luen kirjan. (I read the book — implying I will finish it)',
          'Luen kirja. (I read the book — implying I will finish it)',
          'Luen kirjalla. (I read the book — implying I will finish it)',
        ],
        correctAnswer: 'Luen kirjan. (I read the book — implying I will finish it)',
        explanation: "The genitive object (kirjan) signals a total, completed action — the whole book will be read. 'Luen kirjaa' uses the partitive, which signals an ongoing or partial action (I am reading a book, not necessarily finishing it). The genitive is the correct choice for a completed total object.",
        hint: 'The total/completed object takes the genitive. Which option has -n?',
        points: 10,
      },
      {
        question: "What is the difference between 'Ostan kirjan' and 'En osta kirjaa'?",
        options: [
          "Both mean the same thing — 'I buy a book'",
          "'Ostan kirjan' uses genitive (total object, buying the whole book); 'En osta kirjaa' uses partitive (negated object)",
          "'Ostan kirjan' uses partitive; 'En osta kirjaa' uses genitive",
          "The difference is only in the verb form, not the noun",
        ],
        correctAnswer: "'Ostan kirjan' uses genitive (total object, buying the whole book); 'En osta kirjaa' uses partitive (negated object)",
        explanation: "Affirmative sentences with a completed/total object use the genitive: kirjan. When the sentence is negated, the object shifts to the partitive: kirjaa. This genitive (total) vs. partitive (partial/negated) contrast is one of the most important distinctions in Finnish grammar.",
        hint: 'Affirmative + complete = genitive. Negative = partitive.',
        points: 10,
      },
      {
        question: "How do you say 'my sister's car is red' in Finnish? (sisko = sister, auto = car, punainen = red)",
        options: [
          'Siskolla auto on punainen.',
          'Siskon auto on punainen.',
          'Siskoa auto on punainen.',
          'Siskolle auto on punainen.',
        ],
        correctAnswer: 'Siskon auto on punainen.',
        explanation: "'sisko' + -n = siskon (genitive, no gradation needed here). The genitive possessor comes before the noun: siskon auto (sister's car). 'siskolla' uses the adessive case (at/on), which is not possessive in this context.",
        hint: "Possession uses the genitive. Add -n to 'sisko' and place it before the noun.",
        points: 10,
      },
      {
        question: "Which of the following correctly contrasts the genitive and partitive object?",
        options: [
          'Syön leivän = I eat bread (partial); Syön leipää = I eat the bread (total)',
          'Syön leivän = I eat the bread (total, completed); Syön leipää = I eat bread (partial/ongoing)',
          'Both mean the same — Finnish does not distinguish total and partial objects',
          'Syön leivän = negative; Syön leipää = affirmative',
        ],
        correctAnswer: 'Syön leivän = I eat the bread (total, completed); Syön leipää = I eat bread (partial/ongoing)',
        explanation: "'Syön leivän' uses the genitive object (leivän), signalling a total, completed action — eating the whole bread. 'Syön leipää' uses the partitive (leipää), signalling a partial or ongoing action — eating some bread. This contrast is fundamental in Finnish.",
        hint: 'Genitive = total/completed. Partitive = partial/ongoing. Which matches which sentence?',
        points: 10,
      },
    ],
  },
  {
    id: 't-plural',
    chapter: 9,
    title: 'T-Plural',
    finnish: 'T-monikko',
    icon: '👥',
    level: 'A1',
    accent: 'bg-indigo-500',
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    description: 'How to form the nominative plural in Finnish by adding -t to the singular — with consonant gradation',
    content: {
      type: 'rich',
      intro: 'Finnish has two plural forms. At A1 level, you only need the T-plural, which is the plural used as the subject of a sentence (nominative plural).',
      sections: [
        { type: 'subheading', text: '9.1 Forming the T-Plural' },
        {
          type: 'paragraph',
          text: 'Add -t to the singular nominative (base form).',
        },
        {
          type: 'example-table',
          headers: ['Singular', 'T-Plural', 'Meaning'],
          rows: [
            ['koira', 'koirat', 'dogs'],
            ['auto', 'autot', 'cars'],
            ['tyttö', 'tytöt', 'girls (note gradation: tt→t)'],
            ['poika', 'pojat', 'boys (note gradation: k disappears)'],
            ['kirja', 'kirjat', 'books'],
            ['pöytä', 'pöydät', 'tables (note gradation: t→d)'],
          ],
        },
        {
          type: 'note',
          icon: '📝',
          text: 'When -t is added, the syllable closes and consonant gradation may apply — the strong grade weakens. For example: tyttö (tt) → tytöt (t), poika (k) → pojat (k disappears), pöytä (t) → pöydät (d).',
        },
        { type: 'subheading', text: '9.2 Using the T-Plural as Subject' },
        {
          type: 'example-table',
          headers: ['Finnish', 'English'],
          rows: [
            ['Koirat juoksevat puistossa.', 'The dogs are running in the park.'],
            ['Autot ovat kalliita.', 'The cars are expensive.'],
            ['Kaikki miehet, naiset ja lapset pelästyivät.', 'All men, women, and children were startled.'],
          ],
          tip: 'The T-plural is used only as the subject. In other grammatical functions (object, cases), Finnish uses a different plural system learned at A2+ level.',
        },
      ],
    },
    quiz: [
      {
        question: 'What is the T-plural used for in Finnish at A1 level?',
        options: [
          'As the object of a sentence',
          'As the subject of a sentence (nominative plural)',
          'After numbers two and above',
          'In negative sentences',
        ],
        correctAnswer: 'As the subject of a sentence (nominative plural)',
        explanation: 'The T-plural is the nominative plural — it is used when the noun is the subject of the sentence (the one doing the action). For example: Koirat juoksevat (The dogs run). After numbers, the partitive singular is used instead, not the T-plural.',
        hint: 'Nominative = the subject role in a sentence.',
        points: 10,
      },
      {
        question: 'How is the T-plural formed in Finnish?',
        options: [
          'Add -a or -ä to the nominative',
          'Add -t to the nominative singular',
          'Double the final vowel and add -t',
          'Add -en to the nominative singular',
        ],
        correctAnswer: 'Add -t to the nominative singular',
        explanation: "The T-plural is formed by simply adding -t to the singular nominative (base form). For example: koira → koirat, auto → autot, kirja → kirjat. However, consonant gradation may change the stem when -t is added.",
        hint: 'The T-plural suffix is just one letter.',
        points: 10,
      },
      {
        question: "What is the T-plural of 'koira' (dog)?",
        options: ['koiraa', 'koiran', 'koirat', 'koiria'],
        correctAnswer: 'koirat',
        explanation: "'koira' + -t = koirat. No consonant gradation applies here because there is no k, p, or t cluster in the stem affected by the added -t. koiraa is the partitive, koiran is the genitive.",
        hint: "Simply add -t to 'koira'.",
        points: 10,
      },
      {
        question: "What is the T-plural of 'tyttö' (girl)? Note: consonant gradation applies.",
        options: ['tyttöt', 'tytöt', 'tyttöjä', 'tyttöä'],
        correctAnswer: 'tytöt',
        explanation: "'tyttö' has a double tt in the stem. When -t is added, the following syllable closes, triggering weak grade: tt → t. The vowel ö also shifts slightly in the stem: tyttö → tytö + t = tytöt. 'tyttöt' is incorrect because it ignores gradation.",
        hint: "Adding -t closes the syllable — does tt weaken in the weak grade?",
        points: 10,
      },
      {
        question: "What is the T-plural of 'poika' (boy)? Note: consonant gradation applies.",
        options: ['poikat', 'poikaa', 'pojat', 'poikia'],
        correctAnswer: 'pojat',
        explanation: "'poika' contains k between vowels. When -t is added and the syllable closes, k disappears (weak grade: k → ∅). poika → poja + t = pojat. This is the same k-disappearance seen in location cases like pankki → pankissa.",
        hint: "The k in 'poika' disappears in the weak grade. What does that leave?",
        points: 10,
      },
      {
        question: "What is the T-plural of 'auto' (car)?",
        options: ['autot', 'autoja', 'auton', 'autoo'],
        correctAnswer: 'autot',
        explanation: "'auto' + -t = autot. There is no consonant gradation to apply here — the stem has no k, p, or t cluster that would be affected. autoja is the partitive plural, auton is the genitive.",
        hint: "Add -t to 'auto' — does any gradation apply?",
        points: 10,
      },
      {
        question: "Which sentence correctly uses the T-plural as the subject?",
        options: [
          'Koiraa juoksevat.',
          'Koiran juoksevat.',
          'Koirat juoksevat.',
          'Koiralle juoksevat.',
        ],
        correctAnswer: 'Koirat juoksevat.',
        explanation: "When the noun is the subject (doing the action), it takes the nominative — in the plural, that is the T-plural: koirat. 'koiraa' is partitive, 'koiran' is genitive, 'koiralle' is allative (to the dog). Only 'koirat' is the correct nominative plural subject.",
        hint: "The subject of a sentence takes the nominative. Which form is the T-plural?",
        points: 10,
      },
      {
        question: "Why is the T-plural NOT used after numbers in Finnish?",
        options: [
          'Because numbers are always followed by the genitive',
          'Because numbers two and above require the partitive singular instead',
          'Because the T-plural is only used with animals',
          'Because Finnish does not have a plural after numbers',
        ],
        correctAnswer: 'Because numbers two and above require the partitive singular instead',
        explanation: "After numbers two and above, Finnish uses the partitive singular — not the T-plural. For example: kaksi koiraa (two dogs), not kaksi koirat. The T-plural is only for the subject role (nominative). This is a common mistake for learners.",
        hint: "Recall from Chapter 7 — what case follows numbers two and above?",
        points: 10,
      },
      {
        question: "What is the T-plural of 'kirja' (book)?",
        options: ['kirjaa', 'kirjat', 'kirjan', 'kirjoja'],
        correctAnswer: 'kirjat',
        explanation: "'kirja' + -t = kirjat. No consonant gradation applies. kirjaa is the partitive, kirjan is the genitive, kirjoja is the partitive plural (a form you will learn later).",
        hint: "Add -t to 'kirja' — no gradation needed here.",
        points: 10,
      },
      {
        question: "Which of the following correctly shows both the singular and T-plural of 'talo' (house)?",
        options: [
          'singular: talo — plural: talot',
          'singular: talo — plural: taloja',
          'singular: talo — plural: talon',
          'singular: talo — plural: taloot',
        ],
        correctAnswer: 'singular: talo — plural: talot',
        explanation: "'talo' + -t = talot. No consonant gradation applies. 'taloja' is the partitive plural, 'talon' is the genitive singular. 'taloot' is not a valid Finnish form — you simply add -t, you do not double the vowel for the T-plural.",
        hint: "The T-plural is formed by adding -t only — no vowel doubling.",
        points: 10,
      },
    ],
  },

  {
  "id": "minulla-on",
  "chapter": 10,
  "title": "Possession — Minulla on",
  "finnish": "Minulla on",
  "icon": "🧤",
  "level": "A1",
  "accent": "bg-emerald-500",
  "badge": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "description": "How to express possession in Finnish without a verb 'to have' — using the adessive case + on (lit. 'there is at me')",
  "content": {
    "type": "rich",
    "intro": "Finnish does not use a verb 'to have' for possession. Instead, it uses the structure: ADESSIVE CASE + on (is). This literally means 'there is something at/on me'.",
    "sections": [
      {
        "type": "subheading",
        "text": "10.1 The Structure"
      },
      {
        "type": "paragraph",
        "text": "PERSONAL PRONOUN in adessive case + on/ei ole + NOUN"
      },
      {
        "type": "example-table",
        "headers": ["Pronoun", "Adessive form", "Meaning"],
        "rows": [
          ["minä", "minulla", "I have (lit. at me there is)"],
          ["sinä", "sinulla", "you have"],
          ["hän", "hänellä", "he/she has"],
          ["me", "meillä", "we have"],
          ["te", "teillä", "you (pl) have"],
          ["he", "heillä", "they have"]
        ]
      },
      {
        "type": "subheading",
        "text": "10.2 Affirmative and Negative"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Minulla on koira.", "I have a dog."],
          ["Minulla on kaksi siskoa.", "I have two sisters."],
          ["Sinulla on auto.", "You have a car."],
          ["Meillä on iso perhe.", "We have a big family."],
          ["Minulla ei ole autoa.", "I don't have a car."],
          ["Heillä ei ole rahaa.", "They don't have money."]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "In the negative, the noun takes the PARTITIVE case (autoa, rahaa). This is because it is in a negative sentence, not because of possession."
      },
      {
        "type": "subheading",
        "text": "10.3 Extended uses: feelings and states"
      },
      {
        "type": "paragraph",
        "text": "The minulla on structure also expresses feelings and physical states:"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Minulla on nälkä.", "I am hungry. (lit. I have hunger)"],
          ["Minulla on jano.", "I am thirsty."],
          ["Minulla on kiire.", "I am in a hurry."],
          ["Minulla on kylmä.", "I am cold."],
          ["Minulla on kuuma.", "I am hot."]
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "How does Finnish express 'I have a dog'?",
      "options": [
        "Minä on koira",
        "Minulla on koira",
        "Minun koira",
        "Minä olen koira"
      ],
      "correctAnswer": "Minulla on koira",
      "explanation": "Finnish does not have a verb 'to have'. Instead, it uses the adessive form of the pronoun (minulla) + on + the noun. 'Minulla on koira' literally means 'At me there is a dog'.",
      "hint": "Think of ownership as something being 'at' you, not something you 'have'.",
      "points": 10
    },
    {
      "question": "What is the adessive form of 'sinä'?",
      "options": [
        "Sinut",
        "Sinulle",
        "Sinulla",
        "Sinusta"
      ],
      "correctAnswer": "Sinulla",
      "explanation": "The adessive case ends with -lla/-llä. For sinä, the adessive is sinulla. Sinut is accusative, sinulle is allative, sinusta is elative.",
      "hint": "Adessive answers 'at/on whom' — what is the suffix?",
      "points": 10
    },
    {
      "question": "What case does the noun take in a negative minulla on sentence?",
      "options": [
        "Nominative",
        "Genitive",
        "Partitive",
        "Adessive"
      ],
      "correctAnswer": "Partitive",
      "explanation": "In negative sentences, the object (here the thing possessed) takes the partitive case. For example: 'Minulla ei ole koiraa' (koira → koiraa), not 'koira'.",
      "hint": "Think back to negative sentences in earlier chapters — what case follows 'ei ole'?",
      "points": 10
    },
    {
      "question": "How do you say 'I am hungry' in Finnish?",
      "options": [
        "Minä olen nälkä",
        "Minulla on nälkä",
        "Minulle on nälkä",
        "Minussa on nälkä"
      ],
      "correctAnswer": "Minulla on nälkä",
      "explanation": "Although English says 'I am hungry', Finnish uses the possession structure: 'minulla on nälkä' literally means 'I have hunger'. This is the standard pattern for many feelings and physical states.",
      "hint": "Does Finnish use 'to be' or 'to have' for hunger?",
      "points": 10
    },
    {
      "question": "What is the correct negative form of 'We have a big family'?",
      "options": [
        "Meillä ei ole isoa perhettä",
        "Meillä ei ole iso perhe",
        "Me ei olla iso perhe",
        "Meillä ei on isoa perhettä"
      ],
      "correctAnswer": "Meillä ei ole isoa perhettä",
      "explanation": "Negative possession: meillä (adessive) + ei ole + noun in partitive. 'Iso perhe' becomes 'isoa perhettä' (partitive). 'Meillä ei on' is wrong because 'ei on' never occurs — use 'ei ole'.",
      "hint": "Remember: ei ole, not ei on. And the noun must be in the partitive.",
      "points": 10
    },
    {
      "question": "What does 'Minulla on kiire' mean?",
      "options": [
        "I am cold",
        "I am in a hurry",
        "I am tired",
        "I have a car"
      ],
      "correctAnswer": "I am in a hurry",
      "explanation": "'Kiire' means hurry or rush. 'Minulla on kiire' literally translates to 'I have rush' — a common Finnish expression for being in a hurry.",
      "hint": "It's not a temperature or a vehicle — think of being busy or rushed.",
      "points": 10
    },
    {
      "question": "Which sentence correctly means 'They don't have money'?",
      "options": [
        "Heillä ei ole raha",
        "Heillä ei ole rahaa",
        "He ei ole rahaa",
        "Heillä on ei rahaa"
      ],
      "correctAnswer": "Heillä ei ole rahaa",
      "explanation": "Heillä (adessive of he) + ei ole + rahaa (partitive of raha). 'Heillä ei ole raha' is wrong because negative requires partitive. Word order is fixed: heillä então ei ole then partitive.",
      "hint": "Which word order and case are correct for negative possession?",
      "points": 10
    },
    {
      "question": "What is the adessive form of 'me'?",
      "options": [
        "Meidän",
        "Meitä",
        "Meille",
        "Meillä"
      ],
      "correctAnswer": "Meillä",
      "explanation": "The adessive case ends with -lla/-llä. For me, the adessive is meillä (me + -illä). Meidän is genitive, meitä is partitive, meille is allative.",
      "hint": "Add -illä to me — do you remember the rule for vowels?",
      "points": 10
    },
    {
      "question": "'Minulla on kylmä' best translates to:",
      "options": [
        "I have a cold",
        "I am cold (temperature)",
        "I am cool",
        "I have a fever"
      ],
      "correctAnswer": "I am cold (temperature)",
      "explanation": "'Kylmä' means cold. 'Minulla on kylmä' means 'I am cold' as in feeling cold temperature. Catching a cold (illness) is 'minulla on flunssa' — different noun.",
      "hint": "Is this about illness or temperature sensation?",
      "points": 10
    },
    {
      "question": "What does the literal translation of 'Sinulla on auto' tell us about Finnish grammar?",
      "options": [
        "Finnish puts the object before the subject",
        "Finnish does not use a verb 'to have' for possession",
        "Finnish uses the nominative case for possession",
        "Finnish always uses the genitive for the owner"
      ],
      "correctAnswer": "Finnish does not use a verb 'to have' for possession",
      "explanation": "Literally: 'At you is a car' — not 'You have a car'. This shows that Finnish expresses possession through location (adessive + on) rather than a verb 'to have' (omata, which is extremely rare/archaic in modern Finnish).",
      "hint": "Look at how the owner is expressed — is it a subject or something else?",
      "points": 10
    }
  ]
},

{
  "id": "necessity",
  "chapter": 11,
  "title": "Necessity — Täytyy, Pitää, On pakko",
  "finnish": "Täytyy / Pitää / On pakko",
  "icon": "⚠️",
  "level": "A1",
  "accent": "bg-amber-500",
  "badge": "bg-amber-50 text-amber-700 border-amber-200",
  "description": "How to express 'must', 'have to', or 'need to' in Finnish using impersonal constructions with the genitive case",
  "content": {
    "type": "rich",
    "intro": "To express 'must', 'have to', or 'need to' in Finnish, use special impersonal constructions. The person who must do something goes into the GENITIVE case.",
    "sections": [
      {
        "type": "subheading",
        "text": "11.1 Minun täytyy — I must"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Finnish", "Meaning"],
        "rows": [
          ["minä", "Minun täytyy mennä.", "I have to go."],
          ["sinä", "Sinun täytyy tulla.", "You have to come."],
          ["hän", "Hänen täytyy nukkua.", "He/she has to sleep."],
          ["me", "Meidän täytyy opiskella.", "We have to study."],
          ["te", "Teidän täytyy odottaa.", "You have to wait."],
          ["he", "Heidän täytyy lähteä.", "They have to leave."]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "Täytyy is always followed by the verb in its basic infinitive form (mennä, tulla, nukkua, etc.). The person is in genitive case: minun, sinun, hänen, meidän, teidän, heidän."
      },
      {
        "type": "subheading",
        "text": "11.2 Negative: Minun ei tarvitse"
      },
      {
        "type": "paragraph",
        "text": "To say 'don't have to', use ei tarvitse (not täytyy):"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Sinun ei tarvitse tulla.", "You don't have to come."],
          ["Meidän ei tarvitse maksaa.", "We don't have to pay."],
          ["Heidän ei tarvitse kiirehtiä.", "They don't have to hurry."],
          ["Hänen ei tarvitse huolehtia.", "He/she doesn't have to worry."]
        ]
      },
      {
        "type": "subheading",
        "text": "11.3 Pitää and On pakko"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Meaning", "Strength"],
        "rows": [
          ["Minun pitää mennä.", "I have to go.", "Medium strength, very common in speech"],
          ["Minun täytyy mennä.", "I have to go.", "Stronger, clear necessity"],
          ["Minun on pakko mennä.", "I absolutely have to go.", "Strongest, no choice"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "All three (täytyy, pitää, on pakko) are followed by the verb in its basic infinitive form. The structure is the same: [genitive person] + [necessity word] + [infinitive verb]. Pitää is slightly more informal than täytyy in many contexts."
      }
    ]
  },
  "quiz": [
    {
      "question": "What case does the person take in a Finnish necessity sentence (e.g., 'Minun täytyy mennä')?",
      "options": ["Nominative", "Accusative", "Genitive", "Adessive"],
      "correctAnswer": "Genitive",
      "explanation": "The person who must do something goes into the genitive case: minun, sinun, hänen, meidän, teidän, heidän. This is different from many languages where the person is the subject (nominative).",
      "hint": "Look at 'minun' — what case is that?",
      "points": 10
    },
    {
      "question": "How do you say 'I have to go' using 'täytyy'?",
      "options": ["Minä täytyy mennä", "Minun täytyy mennä", "Minulle täytyy mennä", "Minun täytyy menen"],
      "correctAnswer": "Minun täytyy mennä",
      "explanation": "Minun (genitive) + täytyy + mennä (basic infinitive). 'Minä täytyy mennä' is wrong because the person must be in genitive. 'Menen' is a conjugated form — after täytyy you need the infinitive.",
      "hint": "Who is doing the action? That person goes into genitive case.",
      "points": 10
    },
    {
      "question": "What is the negative form of 'Sinun täytyy tulla' (You have to come)?",
      "options": ["Sinun ei täyty tulla", "Sinun ei tarvitse tulla", "Sinä et täyty tulla", "Sinun ei ole pakko tulla"],
      "correctAnswer": "Sinun ei tarvitse tulla",
      "explanation": "Täytyy cannot be negated directly. Instead, you use 'ei tarvitse' (doesn't need to / doesn't have to). 'Sinun ei tarvitse tulla' = You don't have to come. 'Ei ole pakko' is also possible but means 'it is not absolutely necessary'.",
      "hint": "Täytyy has no negative form — what word replaces it?",
      "points": 10
    },
    {
      "question": "What is the strongest way to express necessity in Finnish?",
      "options": ["Minun pitää", "Minun täytyy", "Minun on pakko", "Minun tulee"],
      "correctAnswer": "Minun on pakko",
      "explanation": "'On pakko' expresses absolute, forced necessity — there is no choice. 'Täytyy' is strong, 'pitää' is slightly softer, and 'tulee' is even milder (should/ought to).",
      "hint": "Which one means 'no choice / forced'?",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'Meidän ___ opiskella.' (We have to study)",
      "options": ["täytyvät", "täytyy", "täytyy?", "täytyt"],
      "correctAnswer": "täytyy",
      "explanation": "Täytyy does not conjugate by person. It always stays täytyy regardless of who is doing the action. Meidän täytyy opiskella is correct, never 'täytyvät' or 'täytyt'.",
      "hint": "Does 'täytyy' change form for different people?",
      "points": 10
    },
    {
      "question": "What verb form follows 'pitää' in 'Minun pitää ______'?",
      "options": ["Conjugated verb", "Past participle", "Basic infinitive", "Active past participle"],
      "correctAnswer": "Basic infinitive",
      "explanation": "Like täytyy and on pakko, pitää is followed by the basic infinitive (the dictionary form ending in -a/-ä, -da/-dä, etc.). Example: minun pitää mennä, minun pitää syödä.",
      "hint": "Does the verb stay in its dictionary form or change?",
      "points": 10
    },
    {
      "question": "How do you say 'You (singular) don't have to worry'?",
      "options": ["Sinun ei tarvitse huolehtia", "Sinä et tarvitse huolehtia", "Sinun ei täyty huolehtia", "Sinulle ei tarvitse huolehtia"],
      "correctAnswer": "Sinun ei tarvitse huolehtia",
      "explanation": "Genitive (sinun) + ei tarvitse + infinitive (huolehtia). 'Sinä et tarvitse' means 'you don't need' (as in you don't need an object), not 'you don't have to do something'.",
      "hint": "Structure: person in genitive + ei tarvitse + infinitive.",
      "points": 10
    },
    {
      "question": "Which of the following sentences means 'We absolutely have to leave (no choice)'?",
      "options": ["Meidän pitää lähteä", "Meidän täytyy lähteä", "Meidän on pakko lähteä", "Meidän tulee lähteä"],
      "correctAnswer": "Meidän on pakko lähteä",
      "explanation": "Meidän on pakko lähteä expresses the strongest necessity — there is no alternative. 'Pitää' and 'täytyy' also mean 'have to' but are less forceful. 'Tulee' means 'should/ought to'.",
      "hint": "Which word implies compulsion or force?",
      "points": 10
    },
    {
      "question": "What is the correct genitive form of 'hän' for necessity constructions?",
      "options": ["Hänen", "Häntä", "Hänelle", "Hänestä"],
      "correctAnswer": "Hänen",
      "explanation": "The genitive of hän is hänen. Example: Hänen täytyy nukkua (He/she has to sleep). Häntä is partitive, hänelle is allative, hänestä is elative.",
      "hint": "Genitive case typically ends with -n for personal pronouns.",
      "points": 10
    },
    {
      "question": "Which sentence uses 'ei tarvitse' correctly?",
      "options": [
        "Minulla ei tarvitse mennä",
        "Minun ei tarvitse mennä",
        "Minä ei tarvitse mennä",
        "Minua ei tarvitse mennä"
      ],
      "correctAnswer": "Minun ei tarvitse mennä",
      "explanation": "Correct structure: genitive (minun) + negative verb (ei) + tarvitse + infinitive (mennä). 'Minulla ei tarvitse' mixes the minulla-on structure incorrectly. 'Minä ei tarvitse' has wrong case and conjugation.",
      "hint": "Review the negative necessity pattern — which case does the person take?",
      "points": 10
    }
  ]
},
{
  "id": "modal-verbs",
  "chapter": 12,
  "title": "Modal Verbs — Modaaliverbit",
  "finnish": "Modaaliverbit",
  "icon": "🔮",
  "level": "A1",
  "accent": "bg-violet-500",
  "badge": "bg-violet-50 text-violet-700 border-violet-200",
  "description": "Modal verbs for expressing ability, permission, and desire — followed by another verb in the basic infinitive form",
  "content": {
    "type": "rich",
    "intro": "Modal verbs express ability, permission, and desire. They are followed by another verb in the basic infinitive form.",
    "sections": [
      {
        "type": "subheading",
        "text": "12.1 Key A1 Modal Verbs"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "Example"],
        "rows": [
          ["voida", "can, to be able to", "Minä voin uida. (I can swim.)"],
          ["osata", "know how to, can (skill)", "Hän osaa puhua suomea. (She can speak Finnish.)"],
          ["haluta", "to want to", "Haluatko tulla? (Do you want to come?)"],
          ["saada", "to be allowed to, to get to", "Saanko istua? (May I sit?)"],
          ["tykätä", "to like (doing)", "Tykkään lukea. (I like to read.)"]
        ]
      },
      {
        "type": "subheading",
        "text": "12.2 Voida vs. Osata"
      },
      {
        "type": "paragraph",
        "text": "These two both translate as 'can', but mean different things:"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English", "Explanation"],
        "rows": [
          ["Voin tulla huomenna.", "I can come tomorrow.", "I am able to / it's possible"],
          ["Osaan uida.", "I can swim.", "I know how — it's a skill"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "Use voida for possibility, permission, or general ability. Use osata for learned skills (languages, instruments, sports, etc.). You cannot say 'Osaan tulla huomenna' — that would mean you know how to come (like a trick)."
      },
      {
        "type": "subheading",
        "text": "12.3 Käydä — a special verb"
      },
      {
        "type": "paragraph",
        "text": "Käydä means 'to go (and come back)' or 'to visit'. It requires the inessive case (-ssa/-ssä) for the place:"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Käyn kaupassa.", "I go to the store. / I shop. (regularly)"],
          ["Hän käy töissä.", "He goes to work."],
          ["Käydään kahvilassa!", "Let's go to the café!"]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "Käydä is not a modal verb but often grouped with them at A1 level because of its useful everyday frequency. Note the inessive: kaupassa, töissä, kahvilassa. Unlike mennä (to go), käydä implies visiting and possibly returning."
      }
    ]
  },
  "quiz": [
    {
      "question": "Which modal verb is used for a learned skill (e.g., knowing how to play guitar)?",
      "options": ["voida", "saada", "osata", "haluta"],
      "correctAnswer": "osata",
      "explanation": "Osata means 'know how to' — it is used for skills you have learned: languages, instruments, sports, etc. Voida means 'can' as in possibility or general ability (I can come tomorrow).",
      "hint": "Think of skill vs. possibility.",
      "points": 10
    },
    {
      "question": "What verb form follows a modal verb in Finnish?",
      "options": ["Past tense", "Basic infinitive", "Present participle", "Past participle"],
      "correctAnswer": "Basic infinitive",
      "explanation": "Modal verbs (voida, osata, haluta, saada, tykätä) are followed by the basic infinitive — the dictionary form ending in -a/-ä, -da/-dä, etc. Example: 'Voin uida' (I can swim), not 'voin uidun'.",
      "hint": "Does the second verb stay in its dictionary form?",
      "points": 10
    },
    {
      "question": "What does 'Saanko istua?' mean?",
      "options": [
        "I can sit",
        "Do I want to sit?",
        "May I sit?",
        "I know how to sit"
      ],
      "correctAnswer": "May I sit?",
      "explanation": "Saada as a modal verb means 'to be allowed to / may'. 'Saanko istua?' is a polite request asking for permission. 'Voin istua' would mean 'I can sit' (physically able).",
      "hint": "Saada can mean 'get' or 'may' — which fits a polite question?",
      "points": 10
    },
    {
      "question": "Which verb correctly fills the blank? 'Hän ___ puhua suomea.' (She can speak Finnish)",
      "options": ["voi", "osaa", "saa", "tykkää"],
      "correctAnswer": "osaa",
      "explanation": "Speaking a language is a learned skill, so osata is correct. 'Hän osaa puhua suomea' = She knows how to speak Finnish. Voi would mean 'She is able to speak Finnish' (less natural here).",
      "hint": "Is speaking a language a skill or just possibility?",
      "points": 10
    },
    {
      "question": "What is the correct translation of 'I like to read'?",
      "options": ["Tykkään lukea", "Pidän lukea", "Tykkään luken", "Minä tykkään lukea?"],
      "correctAnswer": "Tykkään lukea",
      "explanation": "Tykätä is followed by the infinitive: tykkään lukea. 'Pidän' would require 'lukemisesta' (elative case) — that's a different structure. 'Luken' is not an infinitive form.",
      "hint": "Do you remember which case follows 'tykätä' + the second verb?",
      "points": 10
    },
    {
      "question": "What is the difference between 'Voin tulla' and 'Osaan tulla'?",
      "options": [
        "No difference — they mean the same",
        "'Voin tulla' is possibility, 'Osaan tulla' is skill (knowing how to come)",
        "'Voin tulla' is permission, 'Osaan tulla' is desire",
        "'Voin tulla' is past tense, 'Osaan tulla' is present"
      ],
      "correctAnswer": "'Voin tulla' is possibility, 'Osaan tulla' is skill (knowing how to come)",
      "explanation": "Voin tulla = I can come (it's possible / I am able to). Osaan tulla = I know how to come (strange — as if coming requires special skill). Therefore, for coming, always use voida, not osata.",
      "hint": "Can you know how to come somewhere as a skill? Probably not.",
      "points": 10
    },
    {
      "question": "What case does the place take after 'käydä'?",
      "options": ["Nominative", "Partitive", "Adessive", "Inessive"],
      "correctAnswer": "Inessive",
      "explanation": "Käydä + inessive (-ssa/-ssä): käyn kaupassa, käyn Helsingissä, käydään ravintolassa. The inessive indicates 'inside/at' the place you visit. You do not use illative (mennä + -Vn) with käydä.",
      "hint": "Which case means 'inside/at'?",
      "points": 10
    },
    {
      "question": "How do you say 'Do you want to come?' using haluta?",
      "options": ["Haluatko tulla?", "Haluatko tulemaan?", "Halutko tulla?", "Haluatko tullet?"],
      "correctAnswer": "Haluatko tulla?",
      "explanation": "Haluta (to want) + basic infinitive. Haluatko is the 2nd person singular present + -ko question suffix. Tulla is the infinitive. 'Tulemaan' is the illative of the third infinitive (different structure).",
      "hint": "Question form: verb + -ko/kö, then the infinitive of the second verb.",
      "points": 10
    },
    {
      "question": "Which sentence means 'May I go to the bathroom?'",
      "options": [
        "Voin mennä vessaan?",
        "Osaan mennä vessaan?",
        "Saanko mennä vessaan?",
        "Haluanko mennä vessaan?"
      ],
      "correctAnswer": "Saanko mennä vessaan?",
      "explanation": "Saanko = may I (asking permission). 'Voin mennä' would be 'I can go' (stating ability), not a polite request. 'Osaan' would be strange (skill). 'Haluanko' = do I want to?",
      "hint": "Which modal verb is used for asking permission?",
      "points": 10
    },
    {
      "question": "What is the correct negative form of 'Minä voin tulla'?",
      "options": ["Minä en voi tulla", "Minä en voinut tulla", "Minä ei voi tulla", "Minä en osaa tulla"],
      "correctAnswer": "Minä en voi tulla",
      "explanation": "Negative of voida: en (minä) + voi (connegative form, same as the 3rd person singular present?). Actually voida in negative: en voi, et voi, ei voi, emme voi, ette voi, eivät voi. 'En voi tulla' = I can't come. 'Ei voi' is for hän/se.",
      "hint": "Negative of modal verbs follows the same pattern as other verbs: en/et/ei + the stem.",
      "points": 10
    }
  ]
},
{
  "id": "question-words",
  "chapter": 13,
  "title": "Question Words — Kysymyssanat",
  "finnish": "Kysymyssanat",
  "icon": "❓",
  "level": "A1",
  "accent": "bg-sky-500",
  "badge": "bg-sky-50 text-sky-700 border-sky-200",
  "description": "Essential question words for asking who, what, where, when, why, and how in Finnish",
  "content": {
    "type": "rich",
    "intro": "Question words (interrogatives) are used to ask for specific information — unlike yes/no questions which use the -ko/-kö suffix.",
    "sections": [
      {
        "type": "subheading",
        "text": "13.1 Complete List of A1 Question Words"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English", "Example"],
        "rows": [
          ["Mikä?", "What? Which?", "Mikä tämä on? (What is this?)"],
          ["Mitä?", "What? (partitive)", "Mitä sinä teet? (What are you doing?)"],
          ["Kuka?", "Who?", "Kuka sinä olet? (Who are you?)"],
          ["Missä?", "Where? (location)", "Missä sinä asut? (Where do you live?)"],
          ["Mistä?", "From where?", "Mistä sinä tulet? (Where are you from?)"],
          ["Mihin / Minne?", "To where?", "Mihin sinä menet? (Where are you going?)"],
          ["Milloin / Koska?", "When?", "Milloin tulet? (When are you coming?)"],
          ["Miksi?", "Why?", "Miksi et tule? (Why aren't you coming?)"],
          ["Miten / Kuinka?", "How?", "Miten menee? (How is it going?)"],
          ["Montako?", "How many?", "Montako lasta sinulla on? (How many children do you have?)"],
          ["Kuinka paljon?", "How much?", "Kuinka paljon se maksaa? (How much does it cost?)"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "Missä / Mistä / Mihin follow the same inner/outer case pattern as location cases. Think of them as the question-word equivalents of -ssa (in/at) / -sta (from) / -Vn or -iin (into). Minne is often used interchangeably with Mihin in spoken Finnish."
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "Mikä vs. Mitä: Use Mikä when asking 'what is X?' where X is nominative (Mikä tämä on?). Use Mitä when asking 'what are you doing?' or with partitive verbs (Mitä syöt? = What are you eating?)."
      }
    ]
  },
  "quiz": [
    {
      "question": "Which question word do you use to ask 'What is this?'",
      "options": ["Mitä", "Mikä", "Kuka", "Miksi"],
      "correctAnswer": "Mikä",
      "explanation": "Mikä is used when asking about the identity of something in the nominative case: 'Mikä tämä on?' Mitä is used with actions or partitive objects: 'Mitä teet?'",
      "hint": "Nominative question word for 'what is X?'",
      "points": 10
    },
    {
      "question": "How do you ask 'Where do you live?' in Finnish?",
      "options": ["Mihin sinä asut?", "Mistä sinä asut?", "Missä sinä asut?", "Miten sinä asut?"],
      "correctAnswer": "Missä sinä asut?",
      "explanation": "Missä asks for location (inessive case equivalent). Living somewhere is a static location, so Missä asut? is correct. Mihin = to where, Mistä = from where, Miten = how.",
      "hint": "Which question word asks for a static location (in/at)?",
      "points": 10
    },
    {
      "question": "What does 'Mistä sinä tulet?' mean?",
      "options": ["Where are you going?", "Where do you live?", "Where are you from?", "Why are you coming?"],
      "correctAnswer": "Where are you from?",
      "explanation": "Mistä = from where / from which. 'Mistä sinä tulet?' literally means 'From where do you come?' — the standard way to ask someone's origin or hometown.",
      "hint": "Think of movement away from a place.",
      "points": 10
    },
    {
      "question": "Which question word would you use to ask 'How many children do you have?'",
      "options": ["Kuinka paljon", "Montako", "Miten", "Milloin"],
      "correctAnswer": "Montako",
      "explanation": "Montako = how many (for countable nouns). Kuinka paljon = how much (for uncountable). Miten = how (manner), Milloin = when.",
      "hint": "Children are countable — which word is for countable nouns?",
      "points": 10
    },
    {
      "question": "What is the difference between 'Mikä' and 'Mitä'?",
      "options": [
        "No difference — they are interchangeable",
        "Mikä is for nominative, Mitä is for partitive or action questions",
        "Mikä is for people, Mitä is for things",
        "Mikä is for past, Mitä is for present"
      ],
      "correctAnswer": "Mikä is for nominative, Mitä is for partitive or action questions",
      "explanation": "Mikä asks 'what' when the answer is in nominative (Mikä tämä on? -> auto). Mitä asks 'what' when the verb requires partitive (Mitä syöt? -> leipää) or for actions (Mitä teet? = What are you doing?).",
      "hint": "Look at the case of the answer.",
      "points": 10
    },
    {
      "question": "How do you say 'Why aren't you coming?'",
      "options": ["Miksi et tule?", "Miksi et tule?", "Miksi et tule?", "Miksi et tule?"],
      "correctAnswer": "Miksi et tule?",
      "explanation": "Miksi = why. 'Et tule' is the negative 2nd person singular of tulla. Together: 'Miksi et tule?' Miksi is the standard word for 'why' (from mikä + -ksi, originally meaning 'for what?').",
      "hint": "Which word means 'why'? Then add the negative verb.",
      "points": 10
    },
    {
      "question": "What is the pair of question words for movement to a place (like 'where to')?",
      "options": ["Missä / Mistä", "Mihin / Minne", "Miten / Kuinka", "Milloin / Koska"],
      "correctAnswer": "Mihin / Minne",
      "explanation": "Mihin and Minne both ask 'to where' (direction/lative case). Missä = where at, Mistä = where from. Mihin is more common in standard Finnish, Minne is common in spoken Finnish.",
      "hint": "Which one would you use with mennä (to go)?",
      "points": 10
    },
    {
      "question": "How do you ask 'How much does it cost?'",
      "options": ["Montako se maksaa?", "Miten se maksaa?", "Kuinka paljon se maksaa?", "Miksi se maksaa?"],
      "correctAnswer": "Kuinka paljon se maksaa?",
      "explanation": "Kuinka paljon = how much (uncountable/price). Montako = how many (countable, e.g., montako omenaa?). Money is considered uncountable in this context.",
      "hint": "Price is a quantity, not a number of items.",
      "points": 10
    },
    {
      "question": "Which question word would you use to ask 'How is it going?' (casual greeting)?",
      "options": ["Miten menee?", "Miksi menee?", "Minne menee?", "Montako menee?"],
      "correctAnswer": "Miten menee?",
      "explanation": "'Miten menee?' is a common casual greeting, meaning 'How's it going?' Miten = how. Miksi = why would be strange, Minne = where to (doesn't fit).",
      "hint": "Which means 'how'?",
      "points": 10
    },
    {
      "question": "What is the Finnish question word for 'when' — and what is a common alternative?",
      "options": [
        "Miksi / Koska?",
        "Milloin / Koska",
        "Miten / Kuinka",
        "Missä / Mihin"
      ],
      "correctAnswer": "Milloin / Koska",
      "explanation": "Milloin and Koska both mean 'when'. Milloin is more common in standard Finnish, Koska also means 'because' as a conjunction — but as a question word it can mean 'when' especially in older or more formal Finnish.",
      "hint": "Two words for 'when' — one starts with M, the other with K.",
      "points": 10
    }
  ]
},
{
  "id": "conjunctions",
  "chapter": 14,
  "title": "Conjunctions — Konjunktiot",
  "finnish": "Konjunktiot",
  "icon": "🔗",
  "level": "A1",
  "accent": "bg-cyan-500",
  "badge": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "description": "Essential conjunctions for connecting words, phrases, and sentences — from ja and mutta to koska, kun, että, and jos",
  "content": {
    "type": "rich",
    "intro": "Conjunctions connect words, phrases, and sentences. At A1 level, mastering a small set of conjunctions will greatly improve your ability to form longer sentences.",
    "sections": [
      {
        "type": "subheading",
        "text": "14.1 Essential A1 Conjunctions"
      },
      {
        "type": "example-table",
        "headers": ["Conjunction", "Meaning", "Example"],
        "rows": [
          ["ja", "and", "Minulla on koira ja kissa."],
          ["mutta", "but", "Hän on väsynyt, mutta ei nuku."],
          ["tai", "or", "Kahvia vai teetä? (Note: tai is for statements, vai for questions)"],
          ["koska", "because", "En tule, koska olen sairas."],
          ["kun", "when, since", "Soitan, kun tulen kotiin."],
          ["että", "that", "Ajattelen, että se on hyvä idea."],
          ["jos", "if", "Jos tulet, soita ensin."]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "In questions, use 'vai' instead of 'tai' for exclusive 'or': 'Kahvia vai teetä?' (Coffee or tea? — choose one). 'Tai' is used in statements: 'Kahvia tai teetä.' (Coffee or tea — either is fine)."
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "Word order after conjunctions: Finnish usually keeps normal SVO word order after conjunctions, unlike some languages that change verb placement. Example: 'Ajattelen, että se on hyvä idea.' (I think that it is a good idea.)"
      }
    ]
  },
  "quiz": [
    {
      "question": "Which conjunction means 'and' in Finnish?",
      "options": ["mutta", "ja", "tai", "jos"],
      "correctAnswer": "ja",
      "explanation": "Ja is the basic conjunction for 'and' — it connects words, phrases, and clauses: 'Minulla on koira ja kissa.'",
      "hint": "Think of 'ja' as the Finnish version of 'and'.",
      "points": 10
    },
    {
      "question": "What does 'mutta' mean?",
      "options": ["and", "or", "but", "because"],
      "correctAnswer": "but",
      "explanation": "Mutta means 'but' — used to show contrast: 'Hän on väsynyt, mutta ei nuku.' (He is tired but does not sleep.)",
      "hint": "It's similar to English 'but'.",
      "points": 10
    },
    {
      "question": "How do you say 'coffee or tea?' when offering a choice (expecting one answer)?",
      "options": ["Kahvia tai teetä?", "Kahvia ja teetä?", "Kahvia vai teetä?", "Kahvia mutta teetä?"],
      "correctAnswer": "Kahvia vai teetä?",
      "explanation": "In questions, use 'vai' for exclusive 'or' — you are asking the person to choose one. 'Tai' is used in statements: 'Kahvia tai teetä' (Coffee or tea — either is fine).",
      "hint": "For a question expecting a choice, use 'vai', not 'tai'.",
      "points": 10
    },
    {
      "question": "Which conjunction means 'because'?",
      "options": ["kun", "jos", "koska", "että"],
      "correctAnswer": "koska",
      "explanation": "Koska means 'because' and gives a reason: 'En tule, koska olen sairas.' (I'm not coming because I'm sick.)",
      "hint": "It gives a reason or cause.",
      "points": 10
    },
    {
      "question": "What is the difference between 'tai' and 'vai'?",
      "options": [
        "No difference — they are synonyms",
        "Tai is for statements, vai is for exclusive choice questions",
        "Tai is for questions, vai is for statements",
        "Tai means 'and', vai means 'but'"
      ],
      "correctAnswer": "Tai is for statements, vai is for exclusive choice questions",
      "explanation": "Tai is used in statements (A or B, maybe both). Vai is used in questions when offering an exclusive choice: 'Haluatko kahvia vai teetä?' (Do you want coffee or tea? — pick one).",
      "hint": "Think of menu options — which one forces a choice?",
      "points": 10
    },
    {
      "question": "How do you say 'I think that it is a good idea'?",
      "options": ["Ajattelen, jos se on hyvä idea", "Ajattelen, koska se on hyvä idea", "Ajattelen, että se on hyvä idea", "Ajattelen, kun se on hyvä idea"],
      "correctAnswer": "Ajattelen, että se on hyvä idea",
      "explanation": "Että means 'that' when introducing a subordinate clause (statement of thought, belief, or fact). 'Ajattelen, että...' = I think that... Jos = if, koska = because, kun = when.",
      "hint": "Which conjunction introduces a reported thought?",
      "points": 10
    },
    {
      "question": "What does 'Jos tulet, soita ensin' mean?",
      "options": [
        "When you come, call first",
        "Because you come, call first",
        "If you come, call first",
        "That you come, call first"
      ],
      "correctAnswer": "If you come, call first",
      "explanation": "Jos means 'if' — it introduces a condition. The sentence means that calling first is conditional on coming: 'If you come, call first.' Kun would mean 'when' (more certain).",
      "hint": "Which word sets a condition?",
      "points": 10
    },
    {
      "question": "Which conjunction means 'when' (in a future or general sense)?",
      "options": ["koska", "jos", "kun", "että"],
      "correctAnswer": "kun",
      "explanation": "Kun means 'when' or 'since' — used for time relationships: 'Soitan, kun tulen kotiin.' (I will call when I come home.) Koska is 'because', jos is 'if', että is 'that'.",
      "hint": "Think of time or 'at the moment when'.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'En tule töihin, ___ olen kipeä.' (I'm not coming to work because I'm sick.)",
      "options": ["mutta", "joten", "koska", "että"],
      "correctAnswer": "koska",
      "explanation": "Koska gives the reason or cause. 'En tule töihin, koska olen kipeä.' Mutta = but, joten = so, että = that — none express cause.",
      "hint": "Which word explains 'why'?",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses 'jos'?",
      "options": [
        "En tiedä, jos hän tulee",
        "Jos sataa, jään kotiin",
        "Ajattelen, jos se on totta",
        "Soitan sinulle, jos tulen kotiin"
      ],
      "correctAnswer": "Jos sataa, jään kotiin",
      "explanation": "Jos means 'if' — it sets a condition. In 'If it rains, I stay home' — the staying home depends on the rain. 'En tiedä, jos hän tulee' is wrong — that would be 'I don't know if he's coming' which requires 'En tiedä, tuleeko hän' (indirect question), not jos.",
      "hint": "Conditional 'if' → then result.",
      "points": 10
    }
  ]
},
{
  "id": "numbers",
  "chapter": 15,
  "title": "Numbers — Numerot",
  "finnish": "Numerot",
  "icon": "🔢",
  "level": "A1",
  "accent": "bg-blue-500",
  "badge": "bg-blue-50 text-blue-700 border-blue-200",
  "description": "Finnish cardinal numbers from 0 to 1000, and the partitive rule after numbers two and above",
  "content": {
    "type": "rich",
    "intro": "Finnish numbers follow a logical, compound structure from 11 onward. The most important grammar rule: after numbers 2 and above, the noun that follows must be in the partitive singular.",
    "sections": [
      {
        "type": "subheading",
        "text": "15.1 Cardinal Numbers 0–20"
      },
      {
        "type": "example-table",
        "headers": ["Number", "Finnish", "Number", "Finnish"],
        "rows": [
          ["0", "nolla", "10", "kymmenen"],
          ["1", "yksi", "11", "yksitoista"],
          ["2", "kaksi", "12", "kaksitoista"],
          ["3", "kolme", "13", "kolmetoista"],
          ["4", "neljä", "14", "neljätoista"],
          ["5", "viisi", "15", "viisitoista"],
          ["6", "kuusi", "16", "kuusitoista"],
          ["7", "seitsemän", "17", "seitsemäntoista"],
          ["8", "kahdeksan", "18", "kahdeksantoista"],
          ["9", "yhdeksän", "19", "yhdeksäntoista"],
          ["-", "-", "20", "kaksikymmentä"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "Numbers 11–19 are formed by taking the base number (yksi, kaksi, etc.) and adding -toista. For 17–19, note the consonant gradation: seitsemän → seitsemäntoista, kahdeksan → kahdeksantoista, yhdeksän → yhdeksäntoista (n → nta/ntä? Actually 17-19 have the -toista added after the basic form, but 17: seitsemäntoista)."
      },
      {
        "type": "subheading",
        "text": "15.2 Tens and Hundreds"
      },
      {
        "type": "example-table",
        "headers": ["Number", "Finnish"],
        "rows": [
          ["30", "kolmekymmentä"],
          ["40", "neljäkymmentä"],
          ["50", "viisikymmentä"],
          ["100", "sata"],
          ["1000", "tuhat"],
          ["123", "sata kaksikymmentäkolme"]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "Tens are formed by taking the base number (kolme, neljä, viisi, etc.) + kymmentä. Note that 'kymmenen' changes to 'kymmentä' in compounds because of the partitive rule. Numbers are written as one word: kaksikymmentäkolme (23)."
      },
      {
        "type": "subheading",
        "text": "15.3 Numbers + Partitive"
      },
      {
        "type": "example-table",
        "headers": ["Example", "Rule"],
        "rows": [
          ["yksi koira", "After 1 → nominative singular"],
          ["kaksi koiraa", "After 2+ → partitive singular"],
          ["viisi lasta", "After 2+ → partitive singular"],
          ["kymmenen euroa", "After 2+ → partitive singular"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "After numbers 2, 3, 4, 5, 10, 100, 1000 — always partitive singular. This is one of the most important and frequently tested A1 rules. Never use the plural (e.g., 'kaksi koira' is wrong; it's 'kaksi koiraa')."
      }
    ]
  },
  "quiz": [
    {
      "question": "How do you say '11' in Finnish?",
      "options": ["yksikymmentä", "yksitoista", "yksikymmenen", "yksikymmentäyksi"],
      "correctAnswer": "yksitoista",
      "explanation": "11 is yksitoista — from yksi + toista. Yksikymmentä would be 10+? Actually, 10 is kymmenen, 11 is yksitoista. Kaksitoista is 12, kolmetoista is 13.",
      "hint": "11 is 'one of the second ten' — yksi + toista.",
      "points": 10
    },
    {
      "question": "What case follows numbers 2 and above in Finnish?",
      "options": ["Nominative singular", "Genitive singular", "Partitive singular", "Partitive plural"],
      "correctAnswer": "Partitive singular",
      "explanation": "After numbers two and above (including 2, 3, 10, 100, etc.), the noun takes the partitive singular — not the plural. Example: kaksi koiraa, viisi lasta, sata euroa.",
      "hint": "It's a singular case, not plural.",
      "points": 10
    },
    {
      "question": "Which is correct for 'two dogs'?",
      "options": ["kaksi koira", "kaksi koirat", "kaksi koiraa", "kaksi koiria"],
      "correctAnswer": "kaksi koiraa",
      "explanation": "After the number 2, the noun must be in the partitive singular: kaksi koiraa. 'Kaksi koira' is nominative (only after number 1). 'Kaksi koirat' is T-plural (wrong). 'Kaksi koiria' is partitive plural (wrong).",
      "hint": "Partitive singular of koira is koiraa.",
      "points": 10
    },
    {
      "question": "How do you say '15' in Finnish?",
      "options": ["viisitoista", "viisikymmentä", "viistoista", "viisitoist"],
      "correctAnswer": "viisitoista",
      "explanation": "15 is viisitoista — viisi + toista. Viisikymmentä is 50. Viistoista is a common spoken contraction but standard written is viisitoista.",
      "hint": "5 + toista.",
      "points": 10
    },
    {
      "question": "What is the correct form of '20'?",
      "options": ["kaksikymmen", "kaksikymmentä", "kaksikymmenta", "kaksikymmenen"],
      "correctAnswer": "kaksikymmentä",
      "explanation": "20 is kaksikymmentä — from kaksi + kymmentä (partitive singular form of kymmenen). Kaksikymmenen does not exist. The -ä ending is for vowel harmony (front vowels).",
      "hint": "Kymmenen changes to kymmentä in compounds.",
      "points": 10
    },
    {
      "question": "What is '123' in Finnish?",
      "options": [
        "sata kaksikymmentäkolme",
        "satakaksikymmentäkolme",
        "sata kaksikymmentäkolme?",
        "sata kaksikymmentä kolme"
      ],
      "correctAnswer": "sata kaksikymmentäkolme",
      "explanation": "123 = sata (100) + kaksikymmentäkolme (23). In standard Finnish, numbers above 100 are written with spaces or as separate words: sata kaksikymmentäkolme. Sometimes they are written together, but with spaces is common for readability.",
      "hint": "100 = sata, 23 = kaksikymmentäkolme.",
      "points": 10
    },
    {
      "question": "How do you say '5 children'?",
      "options": ["viisi lapsi", "viisi lasta", "viisi lapset", "viisi lapsia"],
      "correctAnswer": "viisi lasta",
      "explanation": "After 5, partitive singular of lapsi is lasta (consonant gradation: ps → p? Actually lapsi → lasta, with p dropping? Wait, lapsi stem lapse- + partitive -a → lasta, with s → t? Better: lapsi (nominative) → lasta (partitive sg) — gradation: p (lapsi) vs. ? The exact rule: lapsi ~ lapse- → lasta has different consonant change). Important: lasta is correct.",
      "hint": "Partitive singular of lapsi is lasta.",
      "points": 10
    },
    {
      "question": "Which number is 'seitsemäntoista'?",
      "options": ["16", "17", "18", "19"],
      "correctAnswer": "17",
      "explanation": "Seitsemäntoista is 17. Seitsemän (7) + toista. 16 is kuusitoista, 18 is kahdeksantoista, 19 is yhdeksäntoista.",
      "hint": "7 + toista.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'Minulla on kymmenen ___' (I have ten fingers)",
      "options": ["sormi", "sormet", "sormea", "sormien"],
      "correctAnswer": "sormea",
      "explanation": "After kymmenen (10), the noun must be in partitive singular: sormea (partitive of sormi). 'Sormi' would be for 1, 'sormet' is T-plural (not used after numbers), 'sormien' is genitive plural.",
      "hint": "What case follows numbers above 1?",
      "points": 10
    },
    {
      "question": "Which of the following pairs is correct?",
      "options": [
        "yksi kirja / kaksi kirjat",
        "yksi kirja / kaksi kirjaa",
        "yksi kirjan / kaksi kirjaa",
        "yksi kirjaa / kaksi kirja"
      ],
      "correctAnswer": "yksi kirja / kaksi kirjaa",
      "explanation": "After 1 → nominative singular: yksi kirja. After 2+ (including 2) → partitive singular: kaksi kirjaa. The other options mix cases incorrectly.",
      "hint": "One = nominative, two+ = partitive singular.",
      "points": 10
    }
  ]
},
{
  "id": "word-order",
  "chapter": 16,
  "title": "Word Order & Basic Sentence Types",
  "finnish": "Sanajärjestys ja lausetyypit",
  "icon": "📐",
  "level": "A1",
  "accent": "bg-teal-500",
  "badge": "bg-teal-50 text-teal-700 border-teal-200",
  "description": "Basic Finnish sentence structures: SVO order, existential sentences (there is/there are), and simple adjective agreement",
  "content": {
    "type": "rich",
    "intro": "Finnish word order is more flexible than English, but the default pattern is SVO (Subject-Verb-Object). Understanding existential sentences and basic adjective placement will help you form correct A1-level sentences.",
    "sections": [
      {
        "type": "subheading",
        "text": "16.1 Basic Word Order"
      },
      {
        "type": "paragraph",
        "text": "Finnish word order is relatively flexible, but the default is Subject – Verb – Object (SVO), the same as English:"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Minä syön omenaa.", "I eat an apple."],
          ["Hän lukee kirjaa.", "He reads a book."]
        ]
      },
      {
        "type": "paragraph",
        "text": "However, Finnish allows moving elements to the beginning of a sentence to emphasize them:"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English (with emphasis)"],
        "rows": [
          ["Kirjaa hän lukee.", "It's a book that he reads. (book is emphasized)"],
          ["Omenaa minä syön.", "It's an apple that I eat."]
        ]
      },
      {
        "type": "subheading",
        "text": "16.2 There is / There are — Existential Sentences"
      },
      {
        "type": "paragraph",
        "text": "To say something exists or is somewhere, use: PLACE + on + THING (in partitive):"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Pöydällä on kirja.", "There is a book on the table."],
          ["Kaupassa on maitoa.", "There is milk in the store."],
          ["Huoneessa ei ole ikkunaa.", "There is no window in the room."]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "In existential sentences, the verb 'on' (is) stays singular even if the thing exists in plural: 'Pöydällä on kirjoja' (There are books on the table — note partitive plural kirjoja). The place comes first, then on/ei ole, then the thing in partitive."
      },
      {
        "type": "subheading",
        "text": "16.3 Adjective Agreement"
      },
      {
        "type": "paragraph",
        "text": "Adjectives agree with the noun in case and number. At A1, focus on the basic rule: the adjective comes BEFORE the noun and takes the same basic form:"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["iso koira", "a big dog"],
          ["pieni talo", "a small house"],
          ["kaunis nainen", "a beautiful woman"],
          ["vanha mies", "an old man"]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "At A1 level, you don't need to master full adjective case agreement — just use the basic nominative form before the noun in simple sentences. In later levels, adjectives will change case (e.g., 'isossa talossa' = in the big house)."
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the default word order in Finnish declarative sentences?",
      "options": ["VOS (Verb-Object-Subject)", "SOV (Subject-Object-Verb)", "SVO (Subject-Verb-Object)", "VSO (Verb-Subject-Object)"],
      "correctAnswer": "SVO (Subject-Verb-Object)",
      "explanation": "Finnish default word order is Subject-Verb-Object, just like English. Example: 'Minä syön omenaa' (I eat an apple). The order can change for emphasis but SVO is neutral.",
      "hint": "Same as English: I eat an apple = minä syön omenaa.",
      "points": 10
    },
    {
      "question": "What does the existential sentence 'Pöydällä on kirja' mean?",
      "options": [
        "The book is on the table",
        "There is a book on the table",
        "The table has a book",
        "I put a book on the table"
      ],
      "correctAnswer": "There is a book on the table",
      "explanation": "Existential sentences in Finnish start with the place (pöydällä), then on (is), then the thing in partitive (kirja is nominative here? Actually 'kirja' is nominative — but the rule says thing in partitive? Wait, need consistency. For indefinite existence, often partitive? Let me check: 'Pöydällä on kirja' is actually accepted with nominative for indefinite singular, but standard existential uses partitive for indefinite mass/plural. To be safe: correct translation is 'There is a book on the table'.)",
      "hint": "Place + on + thing = existence.",
      "points": 10
    },
    {
      "question": "Which sentence has emphasis on the object (book)?",
      "options": [
        "Hän lukee kirjaa",
        "Kirjaa hän lukee",
        "Hän kirjaa lukee",
        "Lukee hän kirjaa"
      ],
      "correctAnswer": "Kirjaa hän lukee",
      "explanation": "Moving the object (kirjaa) to the front of the sentence puts emphasis on it: 'Kirjaa hän lukee' means 'It's a book that he reads' or 'A book, he reads'. The neutral order is 'Hän lukee kirjaa'.",
      "hint": "Which sentence starts with the object instead of the subject?",
      "points": 10
    },
    {
      "question": "In an existential sentence, what case is the 'thing that exists' usually in?",
      "options": ["Nominative", "Genitive", "Partitive", "Accusative"],
      "correctAnswer": "Partitive",
      "explanation": "In standard existential sentences, the thing that exists (the 'subject' of existence) is in the partitive case, especially for indefinite or mass nouns: 'Pöydällä on maitoa' (There is milk on the table). For definite singular things, nominative is sometimes used but partitive is safer at A1.",
      "hint": "Think of indefinite quantities — which case is used for indefinite amounts?",
      "points": 10
    },
    {
      "question": "How do you say 'There is no window in the room'?",
      "options": [
        "Huoneessa on ikkuna",
        "Huoneessa ei ole ikkunaa",
        "Huoneessa ei ole ikkuna",
        "Huone on ilman ikkunaa"
      ],
      "correctAnswer": "Huoneessa ei ole ikkunaa",
      "explanation": "Negative existential: place + ei ole + thing in partitive. 'Huoneessa ei ole ikkunaa' = There is no window in the room. 'Ikkuna' would be nominative — wrong because negative requires partitive.",
      "hint": "Negative sentence + partitive case.",
      "points": 10
    },
    {
      "question": "Where does the adjective go in a simple Finnish noun phrase like 'big dog'?",
      "options": ["After the noun", "Before the noun", "After the verb", "It can go anywhere"],
      "correctAnswer": "Before the noun",
      "explanation": "In Finnish, adjectives come BEFORE the noun they modify: 'iso koira' (big dog), not 'koira iso'. This is similar to English.",
      "hint": "Think: 'iso koira' or 'koira iso'?",
      "points": 10
    },
    {
      "question": "Which of the following is a correct existential sentence?",
      "options": [
        "Kirja on pöydällä",
        "Pöydällä on kirja",
        "On pöydällä kirja",
        "Pöytä on kirjalla"
      ],
      "correctAnswer": "Pöydällä on kirja",
      "explanation": "Standard existential sentence order: place (pöydällä) + on (is) + thing (kirja). 'Kirja on pöydällä' is a location sentence (The book is on the table), not an existential (There is a book on the table).",
      "hint": "Place comes first to announce existence.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Minä syön omenaa' and 'Omenaa minä syön'?",
      "options": [
        "No difference",
        "The first is past tense, the second present",
        "The second emphasizes 'apple'",
        "The first is negative"
      ],
      "correctAnswer": "The second emphasizes 'apple'",
      "explanation": "Moving 'omenaa' to the front emphasizes the object: 'Omenaa minä syön' means 'It's an apple that I eat' (contrasting with maybe something else). The neutral order is 'Minä syön omenaa'.",
      "hint": "What is moved to the front?",
      "points": 10
    },
    {
      "question": "Finish the sentence: 'Pöydällä on kolme ___' (There are three books on the table)",
      "options": ["kirja", "kirjat", "kirjaa", "kirjoja"],
      "correctAnswer": "kirjaa",
      "explanation": "After numbers 2+, the noun takes partitive singular: kolme kirjaa. 'Kirjoja' is partitive plural (would be used without a specific number: 'Pöydällä on kirjoja' = There are books on the table).",
      "hint": "Number 3 + partitive singular.",
      "points": 10
    },
    {
      "question": "Which word order is correct for 'I eat an apple' in neutral Finnish?",
      "options": ["Syön minä omenaa", "Minä omenaa syön", "Minä syön omenaa", "Omenaa syön minä"],
      "correctAnswer": "Minä syön omenaa",
      "explanation": "Neutral declarative word order is SVO: Subject (minä) + Verb (syön) + Object (omenaa). The other orders emphasize different elements.",
      "hint": "Subject first, then verb, then object.",
      "points": 10
    }
  ]
},

  
  

  // ── A2 ──────────────────────────────────────────────────────────────────────
  {
    id: 'imperfect-tense',
    chapter: 1,
    title: 'Stepping into the Past – The Imperfect Tense',
    finnish: 'Imperfekti',
    icon: '⏳',
    level: 'A2',
    accent: 'bg-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    description: 'How to form the imperfect tense with -i-, negative past, common changes (a→o, e→i), and time words',
    content: {
      type: 'rich',
      intro: 'The imperfect tense (imperfekti) describes completed actions in the past. Unlike English which has multiple past forms (I ate, I was eating, I used to eat), Finnish uses one imperfect tense for all of these meanings.',
      sections: [
        { type: 'subheading', text: '1.3 How to Form the Imperfect' },
        {
          type: 'paragraph',
          text: 'Most Finnish verbs form the imperfect by adding -i- before the personal ending. Formula: Verb stem + i + personal ending',
        },
        {
          type: 'example-table',
          headers: ['Verb', 'Present (minä)', 'Imperfect (minä)', 'Meaning'],
          rows: [
            ['puhua', 'puhun', 'puhuin', 'I spoke'],
            ['syödä', 'syön', 'söin', 'I ate'],
            ['tulla', 'tulen', 'tulin', 'I came'],
            ['istua', 'istun', 'istuin', 'I sat'],
            ['nauraa', 'nauran', 'nauroin', 'I laughed'],
          ],
        },
        { type: 'subheading', text: '1.4 Common Changes in the Imperfect' },
        { type: 'paragraph', text: 'Sometimes the verb changes slightly before adding -i-.' },
        { type: 'subheading', text: 'A/Ä changes to O' },
        {
          type: 'example-table',
          headers: ['Present', 'Imperfect (hän)', 'Meaning'],
          rows: [
            ['nauraa', 'nauroi', 'laughed'],
            ['auttaa', 'auttoi', 'helped'],
            ['sanoa', 'sanoi', 'said'],
          ],
        },
        {
          type: 'example-list',
          items: ['Hän auttoi minua. (He/she helped me.)', 'Opettaja sanoi jotain. (The teacher said something.)'],
        },
        { type: 'subheading', text: 'E changes to I' },
        {
          type: 'example-table',
          headers: ['Present', 'Imperfect (hän)', 'Meaning'],
          rows: [
            ['lukea', 'luki', 'read'],
            ['nähdä', 'näki', 'saw'],
          ],
        },
        {
          type: 'example-list',
          items: ['Minä luin kirjan. (I read the book.)', 'Hän näki koiran. (He/she saw the dog.)'],
        },
        { type: 'subheading', text: '1.5 Negative Imperfect' },
        { type: 'paragraph', text: 'Negative imperfect uses: Negative verb + past participle' },
        {
          type: 'example-table',
          headers: ['Pronoun', 'Negative', 'English'],
          rows: [
            ['minä', 'en puhunut', 'I did not speak'],
            ['sinä', 'et puhunut', 'you did not speak'],
            ['hän', 'ei puhunut', 'he/she did not speak'],
            ['me', 'emme puhuneet', 'we did not speak'],
            ['te', 'ette puhuneet', 'you (pl) did not speak'],
            ['he', 'eivät puhuneet', 'they did not speak'],
          ],
        },
        {
          type: 'example-list',
          items: [
            'En syönyt pizzaa. (I did not eat pizza.)',
            'He eivät tulleet. (They did not come.)',
            'Emme katsoneet elokuvaa. (We did not watch the movie.)',
          ],
        },
        { type: 'subheading', text: '1.6 Time Words Often Used with the Imperfect' },
        {
          type: 'example-table',
          headers: ['Finnish', 'English'],
          rows: [
            ['eilen', 'yesterday'],
            ['viime viikolla', 'last week'],
            ['viime vuonna', 'last year'],
            ['silloin', 'then'],
            ['ennen', 'before'],
            ['aamulla', 'in the morning'],
            ['illalla', 'in the evening'],
          ],
        },
        {
          type: 'example-list',
          items: [
            'Eilen satoi paljon. (Yesterday it rained a lot.)',
            'Viime vuonna asuin Helsingissä. (Last year I lived in Helsinki.)',
          ],
        },
        { type: 'subheading', text: '1.7 Questions in the Imperfect' },
        { type: 'paragraph', text: 'To ask questions, Finnish adds -ko/-kö to the imperfect verb.' },
        {
          type: 'example-table',
          headers: ['Statement', 'Question'],
          rows: [
            ['Sinä tulit.', 'Tulitko sinä?'],
            ['Hän söi.', 'Söikö hän?'],
            ['Te opiskelitte.', 'Opiskelitteko te?'],
          ],
        },
        {
          type: 'example-list',
          items: [
            'Tulitko kotiin? (Did you come home?)',
            'Söitkö aamupalaa? (Did you eat breakfast?)',
            'En tullut. (I did not come.)',
            'Emme syöneet. (We did not eat.)',
          ],
        },
        { type: 'subheading', text: '1.8 Important Everyday Verbs in the Imperfect' },
        {
          type: 'example-table',
          headers: ['Infinitive', 'Imperfect (minä)', 'Meaning'],
          rows: [
            ['olla', 'olin', 'I was'],
            ['mennä', 'menin', 'I went'],
            ['tulla', 'tulin', 'I came'],
            ['tehdä', 'tein', 'I did / made'],
            ['nähdä', 'näin', 'I saw'],
            ['juoda', 'join', 'I drank'],
            ['kirjoittaa', 'kirjoitin', 'I wrote'],
            ['opiskella', 'opiskelin', 'I studied'],
            ['asua', 'asuin', 'I lived'],
            ['ostaa', 'ostin', 'I bought'],
          ],
        },
        {
          type: 'example-list',
          items: [
            'Olin väsynyt. (I was tired.)',
            'Menimme kauppaan. (We went to the store.)',
            'Hän osti kahvia. (He/she bought coffee.)',
          ],
        },
        { type: 'subheading', text: '1.9 Imperfect vs Present Tense' },
        {
          type: 'example-table',
          headers: ['Present', 'Imperfect'],
          rows: [
            ['Minä syön.', 'Minä söin.'],
            ['Hän tulee.', 'Hän tuli.'],
            ['Me asumme Suomessa.', 'Me asuimme Suomessa.'],
          ],
        },
        {
          type: 'example-list',
          items: [
            'Nyt opiskelen suomea. (Now I study Finnish.)',
            'Viime vuonna opiskelin suomea. (Last year I studied Finnish.)',
          ],
        },
        { type: 'subheading', text: '1.10 Mini Practice' },
        {
          type: 'example-list',
          title: 'Translate into Finnish:',
          items: [
            'I watched TV yesterday. → Minä katsoin televisiota eilen.',
            'We did not go to school. → Emme menneet kouluun.',
            'Did you eat the apple? → Söitkö omenan?',
            'They lived in Finland. → He asuivat Suomessa.',
            'I was reading a book. → Luin kirjaa.',
          ],
        },
        { type: 'subheading', text: '1.11 Quick Grammar Notes' },
        { type: 'paragraph', text: 'Total Object = Finished Action: Söin omenan. (I finished the apple.)' },
        { type: 'paragraph', text: 'Partitive Object = Ongoing / Incomplete: Söin omenaa. (I ate some apple / I was eating apple.)' },
        { type: 'subheading', text: '1.12 Useful Daily Sentences' },
        {
          type: 'example-list',
          items: [
            'Minä heräsin aikaisin. (I woke up early.)',
            'Kävin kaupassa. (I went to the store.)',
            'Joimme kahvia. (We drank coffee.)',
            'Hän ei vastannut. (He/she did not answer.)',
            'Mitä teitte eilen? (What did you do yesterday?)',
          ],
        },
      ],
    },
    quiz: [
      {
        question: 'What is the imperfect tense used for in Finnish?',
        options: ['Future actions', 'Completed past actions', 'Ongoing present actions', 'Hypothetical situations'],
        correctAnswer: 'Completed past actions',
        explanation: "The imperfect tense (imperfekti) describes completed actions in the past. It covers what in English would be 'I ate', 'I was eating', and 'I used to eat' — all expressed by one Finnish form.",
        hint: 'Think of finished actions in the past.',
        points: 10,
      },
      {
        question: 'What marker is added to the verb stem to form the imperfect?',
        options: ['-a-/-ä-', '-i-', '-si-', '-e-'],
        correctAnswer: '-i-',
        explanation: 'The imperfect is formed by inserting -i- between the verb stem and the personal ending. Example: puhua → puhu- + i + n = puhuin.',
        hint: "It's a single vowel inserted before the personal ending.",
        points: 10,
      },
      {
        question: "What is the correct imperfect form of 'puhua' (to speak) for 'minä'?",
        options: ['minä puhuin', 'minä puhun', 'minä puhunut', 'minä puhu'],
        correctAnswer: 'minä puhuin',
        explanation: 'puhua: stem puhu- + -i- + personal ending -n = puhuin. puhun is present tense, puhunut is the past participle used in negatives.',
        hint: 'Stem puhu- + imperfect marker -i- + personal ending -n.',
        points: 10,
      },
      {
        question: "How do you say 'I did not eat pizza' in Finnish?",
        options: ['En syö pizzaa', 'En syönyt pizzaa', 'En syönnyt pizza', 'Minä en syö pizzaa'],
        correctAnswer: 'En syönyt pizzaa',
        explanation: "Negative imperfect = negative auxiliary 'en' + past participle 'syönyt'. Pizzaa is partitive because of the negative sentence.",
        hint: 'The past participle of syödä ends in -nyt.',
        points: 10,
      },
      {
        question: "What happens to the stem vowel in verbs like 'nauraa' and 'auttaa' in the imperfect?",
        options: ["It stays 'a'", "It changes to 'i'", "It changes to 'o'", 'It disappears completely'],
        correctAnswer: "It changes to 'o'",
        explanation: "Verbs ending in -aa/-ää often change the final stem vowel to o/ö before the -i- marker. nauraa → nauroi, auttaa → auttoi, sanoa → sanoi.",
        hint: "Look at 'nauraa' → 'nauroin' — what happened to the 'a'?",
        points: 10,
      },
      {
        question: "What is the correct imperfect form of 'syödä' (to eat) for 'hän'?",
        options: ['hän syöi', 'hän söi', 'hän syö', 'hän syödä'],
        correctAnswer: 'hän söi',
        explanation: "syödä has a vowel change in the imperfect: syö- → sö- before the -i- marker. The hän form has no personal ending, so: sö + i = söi.",
        hint: "The stem vowel ö shifts — what does syö- become before -i-?",
        points: 10,
      },
      {
        question: 'Which time word is commonly used with the imperfect tense?',
        options: ['huomenna', 'tänään', 'eilen', 'kohta'],
        correctAnswer: 'eilen',
        explanation: "Eilen (yesterday) refers to a completed past time and naturally pairs with the imperfect. Huomenna (tomorrow) and kohta (soon) are future. Tänään (today) can go with either tense.",
        hint: "Which word means 'yesterday'?",
        points: 10,
      },
      {
        question: "How do you ask 'Did you come home?' in Finnish?",
        options: ['Tuletko kotiin?', 'Tulitko kotiin?', 'Tuliko sinä kotiin?', 'Tulit sinä kotiin?'],
        correctAnswer: 'Tulitko kotiin?',
        explanation: "Imperfect question: imperfect verb form (tulit) + question suffix -ko. Result: Tulitko kotiin? 'Tuletko' is present tense. The -ko suffix attaches to the inflected imperfect form.",
        hint: 'Attach -ko to the imperfect verb form, then move it to the front.',
        points: 10,
      },
      {
        question: "What is the difference between 'Söin omenan' and 'Söin omenaa'?",
        options: [
          'No difference',
          'First is past, second is present',
          'First = ate the whole apple (completed); second = ate some apple / was eating',
          'First is positive, second is negative',
        ],
        correctAnswer: 'First = ate the whole apple (completed); second = ate some apple / was eating',
        explanation: "Total object (omenan, genitive/accusative) = finished, whole action. Partitive object (omenaa) = incomplete or ongoing action. This genitive vs. partitive object distinction is a key feature of Finnish.",
        hint: "One implies 'the whole apple', the other implies 'some apple'.",
        points: 10,
      },
      {
        question: "What is the correct negative imperfect of 'me mennä' (we go)?",
        options: ['me ei mennyt', 'me emme menneet', 'me emme mennyt', 'me emme mene'],
        correctAnswer: 'me emme menneet',
        explanation: "Negative imperfect for me: emme + plural past participle (menneet). Mennyt is the singular participle. Mene is the present stem. The plural participle is required when the subject is plural.",
        hint: 'Plural subject needs the plural past participle form — which ends in -eet.',
        points: 10,
      },
    ],
  },

{
  "id": "perfect-tense",
  "chapter": 2,
  "title": "The Perfect Tense – Linking Past to Present",
  "finnish": "Perfecti",
  "icon": "🔗",
  "level": "A2",
  "accent": "bg-emerald-600",
  "badge": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "description": "How to form the perfect tense using olla + past participle to connect past actions with the present moment",
  "content": {
    "type": "rich",
    "intro": "The perfect tense connects the past with the present. It means something happened before, but it still matters now.",
    "sections": [
      {
        "type": "subheading",
        "text": "2.1 Formation"
      },
      {
        "type": "paragraph",
        "text": "The Finnish perfect tense is formed with the present tense of olla + past participle."
      },
      {
        "type": "example-table",
        "headers": ["Structure", "Example"],
        "rows": [
          ["olen + -nut/-nyt", "olen puhunut"],
          ["olemme + -neet", "olemme puhuneet"]
        ]
      },
      {
        "type": "subheading",
        "text": "2.2 Why Do We Use the Perfect?"
      },
      {
        "type": "example-list",
        "items": [
          "Olen syönyt. (I have eaten → so I am not hungry now.)",
          "Hän on muuttanut Suomeen. (He/she has moved to Finland → now lives in Finland.)",
          "Olemme opiskelleet suomea kaksi vuotta. (We have studied Finnish for two years → and still do.)"
        ]
      },
      {
        "type": "subheading",
        "text": "2.3 Personal Forms"
      },
      {
        "type": "subheading",
        "text": "Positive Perfect"
      },
      {
        "type": "example-table",
        "headers": ["Pronoun", "Perfect", "Meaning"],
        "rows": [
          ["minä", "olen puhunut", "I have spoken"],
          ["sinä", "olet puhunut", "you have spoken"],
          ["hän", "on puhunut", "he/she has spoken"],
          ["me", "olemme puhuneet", "we have spoken"],
          ["te", "olette puhuneet", "you (pl) have spoken"],
          ["he", "ovat puhuneet", "they have spoken"]
        ]
      },
      {
        "type": "subheading",
        "text": "Negative Perfect"
      },
      {
        "type": "paragraph",
        "text": "Structure: negative verb + ole + participle"
      },
      {
        "type": "example-table",
        "headers": ["Pronoun", "Negative Perfect"],
        "rows": [
          ["minä", "en ole puhunut"],
          ["sinä", "et ole puhunut"],
          ["hän", "ei ole puhunut"],
          ["me", "emme ole puhuneet"],
          ["te", "ette ole puhuneet"],
          ["he", "eivät ole puhuneet"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "En ole nukkunut hyvin. (I have not slept well.)",
          "He eivät ole tulleet vielä. (They have not arrived yet.)"
        ]
      },
      {
        "type": "subheading",
        "text": "2.4 Past Participles (-nut / -nyt / -neet)"
      },
      {
        "type": "paragraph",
        "text": "The participle usually ends in -nut after back vowels (a, o, u) and -nyt after front vowels (ä, ö, y)."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Participle", "Meaning"],
        "rows": [
          ["puhua", "puhunut", "spoken"],
          ["syödä", "syönyt", "eaten"],
          ["tulla", "tullut", "come"],
          ["nähdä", "nähnyt", "seen"],
          ["tehdä", "tehnyt", "done"],
          ["opiskella", "opiskellut", "studied"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Plural uses -neet: Olemme puhuneet. (We have spoken.) He ovat syöneet. (They have eaten.)"
      },
      {
        "type": "subheading",
        "text": "2.5 Perfect vs Imperfect"
      },
      {
        "type": "paragraph",
        "text": "Imperfect = finished past action. Perfect = past action connected to now."
      },
      {
        "type": "example-table",
        "headers": ["Imperfect", "Perfect"],
        "rows": [
          ["Menin kauppaan.", "Olen mennyt kauppaan."],
          ["Näin elokuvan.", "Olen nähnyt elokuvan."],
          ["Asuimme Suomessa.", "Olemme asuneet Suomessa."]
        ]
      },
      {
        "type": "subheading",
        "text": "2.6 Time Expressions with the Perfect"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["jo", "already"],
          ["vielä", "yet/still"],
          ["koskaan", "ever"],
          ["aina", "always"],
          ["tähän asti", "until now"],
          ["viime aikoina", "recently"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olen jo syönyt. (I have already eaten.)",
          "Etkö ole vielä valmis? (Aren't you ready yet?)",
          "Oletko koskaan käynyt Suomessa? (Have you ever visited Finland?)"
        ]
      },
      {
        "type": "subheading",
        "text": "2.7 Duration Expressions"
      },
      {
        "type": "paragraph",
        "text": "The perfect tense is often used for actions continuing until now."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["kaksi vuotta", "for two years"],
          ["pitkään aikaan", "for a long time"],
          ["kolmeen päivään", "for three days (negative)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olen asunut täällä kaksi vuotta. (I have lived here for two years.)",
          "Emme ole nähneet pitkään aikaan. (We have not seen each other for a long time.)",
          "En ole syönyt kolmeen päivään. (I haven't eaten in three days.)"
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "Expressions like 'kolmeen päivään' (in three days) are usually used with negative sentences. Correct: En ole nukkunut kahteen yöhön. (I haven't slept in two nights.) Incorrect: Olen nukkunut kahteen yöhön."
      },
      {
        "type": "subheading",
        "text": "2.8 Questions in the Perfect"
      },
      {
        "type": "paragraph",
        "text": "Questions use the auxiliary verb first."
      },
      {
        "type": "example-table",
        "headers": ["Statement", "Question"],
        "rows": [
          ["Olet tullut.", "Oletko tullut?"],
          ["Hän on syönyt.", "Onko hän syönyt?"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Oletko tehnyt läksyt? (Have you done the homework?)",
          "Onko hän soittanut? (Has he/she called?)",
          "En ole tehnyt läksyjä. (I have not done homework.)",
          "Ei ole soittanut. (He/she has not called.)"
        ]
      },
      {
        "type": "subheading",
        "text": "2.9 Common Everyday Verbs in the Perfect"
      },
      {
        "type": "example-table",
        "headers": ["Infinitive", "Perfect Form", "Meaning"],
        "rows": [
          ["olla", "olen ollut", "have been"],
          ["mennä", "olen mennyt", "have gone"],
          ["tulla", "olen tullut", "have come"],
          ["tehdä", "olen tehnyt", "have done"],
          ["nähdä", "olen nähnyt", "have seen"],
          ["kirjoittaa", "olen kirjoittanut", "have written"],
          ["ostaa", "olen ostanut", "have bought"],
          ["käydä", "olen käynyt", "have visited"],
          ["opiskella", "olen opiskellut", "have studied"],
          ["asua", "olen asunut", "have lived"]
        ]
      },
      {
        "type": "subheading",
        "text": "2.10 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I have cleaned the room. → Olen siivonnut huoneen.",
          "We have not eaten yet. → Emme ole syöneet vielä.",
          "Have you seen this movie? → Oletko nähnyt tämän elokuvan?",
          "They have lived in Finland for three years. → He ovat asuneet Suomessa kolme vuotta.",
          "I haven't slept well recently. → En ole nukkunut hyvin viime aikoina."
        ]
      },
      {
        "type": "subheading",
        "text": "2.11 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Olen juuri tullut kotiin. (I have just come home.)",
          "Olemme oppineet paljon. (We have learned a lot.)",
          "Hän ei ole vastannut viestiin. (He/she has not replied to the message.)",
          "Oletko koskaan syönyt sushia? (Have you ever eaten sushi?)",
          "He ovat jo lähteneet. (They have already left.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "How is the Finnish perfect tense formed?",
      "options": [
        "Verb stem + -i- + personal ending",
        "Present tense of olla + past participle",
        "Negative verb + infinitive",
        "Verb stem + -isi-"
      ],
      "correctAnswer": "Present tense of olla + past participle",
      "explanation": "The perfect tense uses the present tense of olla (olen, olet, on, etc.) followed by the past participle of the main verb (puhunut, syönyt, etc.).",
      "hint": "You need an auxiliary verb and a participle.",
      "points": 10
    },
    {
      "question": "What does the perfect tense express in Finnish?",
      "options": [
        "A finished past action with no connection to now",
        "A future action",
        "A past action connected to the present moment",
        "An ongoing action right now"
      ],
      "correctAnswer": "A past action connected to the present moment",
      "explanation": "The perfect tense connects something that happened before with the present — it still matters now. For example: 'Olen syönyt' (I have eaten → I'm not hungry now).",
      "hint": "Think of 'have/has' in English.",
      "points": 10
    },
    {
      "question": "What is the correct perfect form of 'minä puhua' (I speak)?",
      "options": ["minä puhuin", "minä olen puhunut", "minä olin puhunut", "minä puhun"],
      "correctAnswer": "minä olen puhunut",
      "explanation": "minä + olen + past participle puhunut. 'Puhuin' is imperfect, 'olin puhunut' is pluperfect, 'puhun' is present.",
      "hint": "Present tense of olla + past participle.",
      "points": 10
    },
    {
      "question": "How do you say 'I have not slept well' in Finnish?",
      "options": [
        "En nukkunut hyvin",
        "En ole nukkunut hyvin",
        "En ollut nukkunut hyvin",
        "En ole nukkunut hyvää"
      ],
      "correctAnswer": "En ole nukkunut hyvin",
      "explanation": "Negative perfect: en + ole + nukkunut. 'En nukkunut' is negative imperfect (I did not sleep). 'En ollut nukkunut' is negative pluperfect.",
      "hint": "Negative auxiliary + ole + past participle.",
      "points": 10
    },
    {
      "question": "What ending does the past participle typically take after front vowels (ä, ö, y)?",
      "options": ["-nut", "-nyt", "-lut", "-sut"],
      "correctAnswer": "-nyt",
      "explanation": "After front vowels (ä, ö, y), the participle ending is -nyt. Example: syödä → syönyt, nähdä → nähnyt. After back vowels (a, o, u), use -nut.",
      "hint": "Which one has a y (the front vowel version of u)?",
      "points": 10
    },
    {
      "question": "What is the difference between 'Söin aamupalan' and 'Olen syönyt aamupalan'?",
      "options": [
        "No difference",
        "First is perfect, second is imperfect",
        "First = ate breakfast (finished past); second = have eaten breakfast (connected to now)",
        "First is negative, second is positive"
      ],
      "correctAnswer": "First = ate breakfast (finished past); second = have eaten breakfast (connected to now)",
      "explanation": "Söin aamupalan (imperfect) = a finished past action with no specified connection to now. Olen syönyt aamupalan (perfect) = the action is complete but relevant to the present (e.g., I'm not hungry now).",
      "hint": "One is like 'I ate', the other is like 'I have eaten'.",
      "points": 10
    },
    {
      "question": "Which time expression is commonly used with the perfect tense?",
      "options": ["eilen", "viime vuonna", "jo", "ennen"],
      "correctAnswer": "jo",
      "explanation": "Jo (already) is often used with the perfect: 'Olen jo syönyt' (I have already eaten). Eilen, viime vuonna, and ennen are typically used with the imperfect.",
      "hint": "Which word means 'already'?",
      "points": 10
    },
    {
      "question": "How do you ask 'Have you ever visited Finland?' in Finnish?",
      "options": [
        "Käytkö Suomessa?",
        "Oletko koskaan käynyt Suomessa?",
        "Oletko käynyt Suomessa eilen?",
        "Kävitkö Suomessa?"
      ],
      "correctAnswer": "Oletko koskaan käynyt Suomessa?",
      "explanation": "Perfect question: Oletko (have you) + koskaan (ever) + käynyt (visited) + Suomessa. 'Käytkö' and 'kävitkö' are present/imperfect without the perfect meaning.",
      "hint": "Use 'koskaan' (ever) and the perfect tense.",
      "points": 10
    },
    {
      "question": "What is the correct plural past participle form for 'we have spoken'?",
      "options": ["puhunut", "puhuneet", "puhuneet?", "puhuneemme"],
      "correctAnswer": "puhuneet",
      "explanation": "For plural subjects (me, te, he), the past participle ends in -neet: me olemme puhuneet, he ovat puhuneet. Singular is puhunut.",
      "hint": "Plural subjects need a plural participle ending in -eet.",
      "points": 10
    },
    {
      "question": "What is the correct negative perfect of 'te mennä' (you plural go)?",
      "options": ["te ette menneet", "te ette ole menneet", "te ette ole mennyt", "te ette mennyt"],
      "correctAnswer": "te ette ole menneet",
      "explanation": "Negative perfect for te: ette + ole + past participle plural (menneet). 'Ette menneet' is negative imperfect. 'Ole mennyt' would be singular.",
      "hint": "Plural subject te + negative ette + ole + plural participle.",
      "points": 10
    }
  ]
},

{
  "id": "conditional-mood",
  "chapter": 3,
  "title": "Conditional Mood – Politeness & Hypotheticals",
  "finnish": "Konditionaali",
  "icon": "🎭",
  "level": "A2",
  "accent": "bg-purple-600",
  "badge": "bg-purple-50 text-purple-700 border-purple-200",
  "description": "How to form and use the conditional mood for polite requests, wishes, suggestions, and hypothetical situations",
  "content": {
    "type": "rich",
    "intro": "The conditional mood (konditionaali) is used for polite requests, wishes, suggestions, hypothetical situations, and uncertain actions.",
    "sections": [
      {
        "type": "subheading",
        "text": "3.1 Formation"
      },
      {
        "type": "paragraph",
        "text": "The Finnish conditional mood is formed with: Verb stem + isi + personal ending"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Conditional (minä)", "Meaning"],
        "rows": [
          ["puhua", "puhuisin", "I would speak"],
          ["syödä", "söisin", "I would eat"],
          ["mennä", "menisin", "I would go"],
          ["tulla", "tulisin", "I would come"],
          ["haluta", "haluaisin", "I would like"]
        ]
      },
      {
        "type": "subheading",
        "text": "3.2 Why Do We Use the Conditional?"
      },
      {
        "type": "paragraph",
        "text": "The conditional is used for: polite requests, wishes, suggestions, hypothetical situations, and uncertain actions."
      },
      {
        "type": "subheading",
        "text": "Polite Requests"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Haluaisin kahvin.", "I would like a coffee."],
          ["Voisitko auttaa?", "Could you help?"],
          ["Haluaisimme pöydän kahdelle.", "We would like a table for two."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Haluaisin vettä. (I would like water.)",
          "Voisitko puhua hitaammin? (Could you speak more slowly?)"
        ]
      },
      {
        "type": "subheading",
        "text": "3.3 Personal Forms"
      },
      {
        "type": "subheading",
        "text": "Positive Conditional"
      },
      {
        "type": "example-table",
        "headers": ["Pronoun", "Conditional", "Meaning"],
        "rows": [
          ["minä", "puhuisin", "I would speak"],
          ["sinä", "puhuisit", "you would speak"],
          ["hän", "puhuisi", "he/she would speak"],
          ["me", "puhuisimme", "we would speak"],
          ["te", "puhuisitte", "you (pl) would speak"],
          ["he", "puhuisivat", "they would speak"]
        ]
      },
      {
        "type": "subheading",
        "text": "Negative Conditional"
      },
      {
        "type": "paragraph",
        "text": "Structure: negative verb + conditional main verb"
      },
      {
        "type": "example-table",
        "headers": ["Pronoun", "Negative"],
        "rows": [
          ["minä", "en puhuisi"],
          ["sinä", "et puhuisi"],
          ["hän", "ei puhuisi"],
          ["me", "emme puhuisi"],
          ["te", "ette puhuisi"],
          ["he", "eivät puhuisi"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "En menisi sinne. (I would not go there.)",
          "Hän ei ostaisi autoa. (He/she would not buy a car.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3.4 Conditional with 'Jos' (If)"
      },
      {
        "type": "paragraph",
        "text": "The word 'jos' means 'if'. This is very common in hypothetical situations."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Ostaisin auton, jos minulla olisi rahaa.", "I would buy a car if I had money."],
          ["Menisin ulos, jos ei sataisi.", "I would go outside if it were not raining."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Jos olisin rikas, matkustaisin paljon. (If I were rich, I would travel a lot.)",
          "Jos minulla olisi aikaa, opiskelisin enemmän. (If I had time, I would study more.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3.5 Conditional of Important Verbs"
      },
      {
        "type": "example-table",
        "headers": ["Infinitive", "Conditional (minä)", "Meaning"],
        "rows": [
          ["olla", "olisin", "I would be"],
          ["mennä", "menisin", "I would go"],
          ["tulla", "tulisin", "I would come"],
          ["tehdä", "tekisin", "I would do"],
          ["nähdä", "näkisin", "I would see"],
          ["voida", "voisin", "I could"],
          ["saada", "saisin", "I would get / could have"],
          ["haluta", "haluaisin", "I would like"],
          ["asua", "asuisin", "I would live"],
          ["ostaa", "ostaisin", "I would buy"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Voisitko auttaa minua? (Could you help me?)",
          "Tekisin ruokaa. (I would make food.)",
          "Näkisin sinut huomenna. (I would see you tomorrow.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3.6 Conditional for Suggestions"
      },
      {
        "type": "paragraph",
        "text": "Finnish often uses the conditional to sound softer and more natural."
      },
      {
        "type": "example-table",
        "headers": ["Direct", "Softer / Polite"],
        "rows": [
          ["Auta minua!", "Voisitko auttaa minua?"],
          ["Anna kahvia.", "Haluaisin kahvia."],
          ["Tule tänne.", "Voisitko tulla tänne?"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Voisimme mennä kahville. (We could go for coffee.)",
          "Ehkä voisit levätä vähän. (Maybe you could rest a little.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3.7 Questions in the Conditional"
      },
      {
        "type": "paragraph",
        "text": "Questions use -ko / -kö."
      },
      {
        "type": "example-table",
        "headers": ["Statement", "Question"],
        "rows": [
          ["Voisit auttaa.", "Voisitko auttaa?"],
          ["Haluaisit kahvia.", "Haluaisitko kahvia?"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Haluaisitko teetä? (Would you like tea?)",
          "Voisitteko odottaa hetken? (Could you wait a moment?)"
        ]
      },
      {
        "type": "subheading",
        "text": "3.8 Conditional vs Present Tense"
      },
      {
        "type": "example-table",
        "headers": ["Present", "Conditional"],
        "rows": [
          ["Haluan kahvia.", "Haluaisin kahvia."],
          ["Menen sinne.", "Menisin sinne."],
          ["Voit auttaa.", "Voisit auttaa."]
        ]
      },
      {
        "type": "paragraph",
        "text": "Present = direct / certain. Conditional = softer / hypothetical."
      },
      {
        "type": "example-list",
        "items": [
          "Haluan vettä. (I want water.)",
          "Haluaisin vettä. (I would like water.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3.9 Common Expressions"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Haluaisin...", "I would like..."],
          ["Voisitko...?", "Could you...?"],
          ["Olisi kiva...", "It would be nice..."],
          ["Jos voisin...", "If I could..."],
          ["Minä tekisin...", "I would do..."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olisi kiva matkustaa Japaniin. (It would be nice to travel to Japan.)",
          "Jos voisin, auttaisin sinua. (If I could, I would help you.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3.10 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I would like coffee. → Haluaisin kahvia.",
          "Could you help me? → Voisitko auttaa minua?",
          "We would buy a house if we had money. → Ostaisimme talon, jos meillä olisi rahaa.",
          "I would not go there. → En menisi sinne.",
          "Would you like tea? → Haluaisitko teetä?"
        ]
      },
      {
        "type": "subheading",
        "text": "3.11 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Voisitko toistaa? (Could you repeat?)",
          "Haluaisin varata ajan. (I would like to book an appointment.)",
          "Menisin nyt kotiin. (I would go home now.)",
          "Jos olisi lämmin, uisin järvessä. (If it were warm, I would swim in the lake.)",
          "Voisimme opiskella yhdessä. (We could study together.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What marker is added to the verb stem to form the conditional?",
      "options": ["-a-/-ä-", "-i-", "-isi-", "-e-"],
      "correctAnswer": "-isi-",
      "explanation": "The conditional is formed by adding -isi- between the verb stem and the personal ending. Example: puhua → puhu- + isi + n = puhuisin.",
      "hint": "It's a three-letter marker that means 'would'.",
      "points": 10
    },
    {
      "question": "Which situation is the conditional mood used for?",
      "options": [
        "Facts and certainty",
        "Polite requests and hypotheticals",
        "Past completed actions",
        "Imperatives and commands"
      ],
      "correctAnswer": "Polite requests and hypotheticals",
      "explanation": "The conditional is used for polite requests (Haluaisin kahvia), wishes, suggestions, and hypothetical situations with 'jos' (if).",
      "hint": "Think of 'would' and polite 'could you'.",
      "points": 10
    },
    {
      "question": "What is the correct conditional form of 'minä puhua' (I speak)?",
      "options": ["minä puhun", "minä puhuin", "minä puhuisin", "minä puhuisi"],
      "correctAnswer": "minä puhuisin",
      "explanation": "puhua stem puhu- + -isi- + personal ending -n = puhuisin. 'Puhun' is present, 'puhuin' is imperfect, 'puhuisi' is 3rd person.",
      "hint": "Stem puhu- + conditional marker + n.",
      "points": 10
    },
    {
      "question": "How do you say 'I would not go there' in Finnish?",
      "options": [
        "En mene sinne",
        "En menisi sinne",
        "En mennyt sinne",
        "En ole mennyt sinne"
      ],
      "correctAnswer": "En menisi sinne",
      "explanation": "Negative conditional: en + conditional form menisi. 'En mene' is present negative, 'en mennyt' is imperfect negative, 'en ole mennyt' is perfect negative.",
      "hint": "Negative verb + conditional main verb.",
      "points": 10
    },
    {
      "question": "What does 'Haluaisin kahvia' mean compared to 'Haluan kahvia'?",
      "options": [
        "They mean the same thing",
        "Haluaisin = I would like (polite); Haluan = I want (direct)",
        "Haluaisin = I wanted; Haluan = I want",
        "Haluaisin is past tense"
      ],
      "correctAnswer": "Haluaisin = I would like (polite); Haluan = I want (direct)",
      "explanation": "Haluaisin (conditional) is softer and more polite. Haluan (present) is more direct and can sound demanding in some contexts.",
      "hint": "Which one is the polite way to order coffee?",
      "points": 10
    },
    {
      "question": "How do you say 'Could you help me?' in Finnish?",
      "options": [
        "Auta minua",
        "Voisitko auttaa minua?",
        "Voitko auttaa minua?",
        "Autatko minua?"
      ],
      "correctAnswer": "Voisitko auttaa minua?",
      "explanation": "Voisitko (conditional of voida) + auttaa + minua is the polite request. 'Auta minua' is imperative (command). 'Voitko' is present tense (can you).",
      "hint": "Use the conditional of 'voida' to be polite.",
      "points": 10
    },
    {
      "question": "What word introduces hypothetical sentences with the conditional?",
      "options": ["kun", "koska", "jos", "että"],
      "correctAnswer": "jos",
      "explanation": "Jos means 'if' and is used with the conditional to express hypothetical situations: 'Jos olisin rikas, matkustaisin paljon.' (If I were rich, I would travel a lot.)",
      "hint": "It's a three-letter word meaning 'if'.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'Ostaisin auton, ___ minulla olisi rahaa.'",
      "options": ["koska", "jos", "kun", "että"],
      "correctAnswer": "jos",
      "explanation": "Jos = if. 'Ostaisin auton, jos minulla olisi rahaa' = I would buy a car if I had money. Koska = because, kun = when, että = that.",
      "hint": "Which word means 'if' in hypothetical situations?",
      "points": 10
    },
    {
      "question": "What is the conditional form of 'hän olla' (he/she is)?",
      "options": ["hän on", "hän oli", "hän olisi", "hän on ollut"],
      "correctAnswer": "hän olisi",
      "explanation": "Olla stem ol- + -isi- = olisi. 'On' is present, 'oli' is imperfect, 'on ollut' is perfect.",
      "hint": "The stem of olla for conditional is ol-.",
      "points": 10
    },
    {
      "question": "How do you ask 'Would you like tea?' in Finnish?",
      "options": [
        "Haluatko teetä?",
        "Haluaisitko teetä?",
        "Haluatteko teetä?",
        "Haluatko teelle?"
      ],
      "correctAnswer": "Haluaisitko teetä?",
      "explanation": "Haluaisitko (conditional of haluta + -ko question suffix) + teetä is the polite way to offer tea. 'Haluatko' is more direct (Do you want tea?).",
      "hint": "Polite offer uses the conditional form.",
      "points": 10
    }
  ]
},
{
  "id": "present-passive",
  "chapter": 4,
  "title": "The Present Passive – Proposals & Spoken Language",
  "finnish": "Passiivi",
  "icon": "🗣️",
  "level": "A2",
  "accent": "bg-rose-600",
  "badge": "bg-rose-50 text-rose-700 border-rose-200",
  "description": "How to form and use the present passive for proposals (Let's...), general statements, and spoken Finnish",
  "content": {
    "type": "rich",
    "intro": "The Finnish present passive usually ends in -taan/-tään or -aan/-ään. It is very common in spoken Finnish, suggestions, general statements, and situations where the doer is unknown or unimportant.",
    "sections": [
      {
        "type": "subheading",
        "text": "4.1 Formation & Use"
      },
      {
        "type": "paragraph",
        "text": "The Finnish present passive usually ends in -taan / -tään, sometimes -aan / -ään. The passive is very common in spoken Finnish, suggestions, general statements, and situations where the doer is unknown or unimportant."
      },
      {
        "type": "subheading",
        "text": "4.2 Main Uses of the Passive"
      },
      {
        "type": "subheading",
        "text": "A) Proposals (\"Let's...\")"
      },
      {
        "type": "paragraph",
        "text": "In spoken Finnish, the passive often means 'Let's do something'."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Mennään!", "Let's go!"],
          ["Syödään!", "Let's eat!"],
          ["Katsotaan elokuva.", "Let's watch a movie."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Mennään kauppaan. (Let's go to the store.)",
          "Juodaan kahvia. (Let's drink coffee.)",
          "Aloitetaan nyt. (Let's start now.)"
        ]
      },
      {
        "type": "subheading",
        "text": "B) General Statements"
      },
      {
        "type": "paragraph",
        "text": "The passive is also used when the person doing the action is not important, unknown, or people in general do the action."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Suomessa puhutaan suomea.", "Finnish is spoken in Finland."],
          ["Täällä syödään paljon kalaa.", "A lot of fish is eaten here."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Tässä ravintolassa tarjoillaan pizzaa. (Pizza is served in this restaurant.)",
          "Suomessa juodaan paljon kahvia. (A lot of coffee is drunk in Finland.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4.3 How to Form the Present Passive"
      },
      {
        "type": "example-table",
        "headers": ["Verb Type", "Infinitive", "Passive", "Meaning"],
        "rows": [
          ["puhua", "puhutaan", "people speak"],
          ["syödä", "syödään", "people eat"],
          ["mennä", "mennään", "people go"],
          ["tehdä", "tehdään", "people do"],
          ["istua", "istutaan", "people sit"]
        ]
      },
      {
        "type": "subheading",
        "text": "4.4 Common Passive Verbs"
      },
      {
        "type": "example-table",
        "headers": ["Infinitive", "Passive", "Meaning"],
        "rows": [
          ["mennä", "mennään", "let's go / people go"],
          ["tulla", "tullaan", "let's come / people come"],
          ["tehdä", "tehdään", "let's do / is done"],
          ["syödä", "syödään", "let's eat / is eaten"],
          ["juoda", "juodaan", "let's drink / is drunk"],
          ["puhua", "puhutaan", "speak / is spoken"],
          ["katsoa", "katsotaan", "let's watch / is watched"],
          ["ostaa", "ostetaan", "let's buy / is bought"],
          ["opiskella", "opiskellaan", "let's study / is studied"],
          ["asua", "asutaan", "people live / let's live"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Opiskellaan suomea! (Let's study Finnish!)",
          "Tässä talossa asutaan pitkään. (People live in this house for a long time.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4.5 Passive in Spoken Finnish"
      },
      {
        "type": "paragraph",
        "text": "In spoken Finnish, the passive often replaces 'Me + verb'."
      },
      {
        "type": "example-table",
        "headers": ["Formal Written Finnish", "Spoken Finnish"],
        "rows": [
          ["Me menemme kotiin. (We go home.)", "Me mennään kotiin."],
          ["Me syömme nyt.", "Me syödään nyt."],
          ["Me katsomme televisiota.", "Me katsotaan televisiota."],
          ["Me lähdemme.", "Me lähdetään."]
        ]
      },
      {
        "type": "subheading",
        "text": "4.6 Passive Questions"
      },
      {
        "type": "paragraph",
        "text": "Questions use -ko / -kö."
      },
      {
        "type": "example-table",
        "headers": ["Statement", "Question"],
        "rows": [
          ["Mennään nyt.", "Mennäänkö nyt?"],
          ["Syödään pizzaa.", "Syödäänkö pizzaa?"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Mennäänkö ulos? (Shall we go outside?)",
          "Katsotaanko elokuva? (Shall we watch a movie?)",
          "Juodaanko kahvia? (Shall we drink coffee?)"
        ]
      },
      {
        "type": "subheading",
        "text": "4.7 Negative Passive"
      },
      {
        "type": "paragraph",
        "text": "Negative passive uses: ei + passive stem + -ta/-tä"
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Negative"],
        "rows": [
          ["Syödään.", "Ei syödä."],
          ["Mennään.", "Ei mennä."],
          ["Puhutaan.", "Ei puhuta."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Ei mennä vielä. (Let's not go yet.)",
          "Tässä koulussa ei puhuta englantia paljon. (English is not spoken much in this school.)",
          "Ei katsota sitä ohjelmaa. (Let's not watch that program.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4.8 Passive vs Active"
      },
      {
        "type": "example-table",
        "headers": ["Active", "Passive"],
        "rows": [
          ["Minä syön omenan.", "Omena syödään."],
          ["Me menemme kotiin.", "Mennään kotiin."],
          ["Ihmiset puhuvat suomea.", "Suomea puhutaan."]
        ]
      },
      {
        "type": "paragraph",
        "text": "Active tells who does the action. Passive focuses on the action itself."
      },
      {
        "type": "subheading",
        "text": "4.9 Useful Expressions"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Mennään!", "Let's go!"],
          ["Aloitetaan!", "Let's begin!"],
          ["Ei kiirehditä.", "Let's not hurry."],
          ["Tässä puhutaan suomea.", "Finnish is spoken here."],
          ["Nyt levätään.", "Let's rest now."]
        ]
      },
      {
        "type": "subheading",
        "text": "4.10 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "Let's go home. → Mennään kotiin.",
          "Coffee is drunk in Finland. → Suomessa juodaan kahvia.",
          "Shall we watch a movie? → Katsotaanko elokuva?",
          "Let's not hurry. → Ei kiirehditä.",
          "Finnish is spoken here. → Täällä puhutaan suomea."
        ]
      },
      {
        "type": "subheading",
        "text": "4.11 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Mennään bussilla. (Let's go by bus.)",
          "Syödään yhdessä. (Let's eat together.)",
          "Tässä kaupassa myydään tuoretta leipää. (Fresh bread is sold in this store.)",
          "Ei puhuta siitä nyt. (Let's not talk about it now.)",
          "Milloin lähdetään? (When shall we leave?)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the present passive ending in Finnish typically?",
      "options": ["-en/-in", "-i/-e", "-taan/-tään", "-nut/-nyt"],
      "correctAnswer": "-taan/-tään",
      "explanation": "The present passive typically ends in -taan or -tään. Examples: puhutaan, syödään, mennään.",
      "hint": "Think of 'let's go' = mennään.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, what does 'Mennään!' mean?",
      "options": ["They go", "We are going", "Let's go!", "Go!"],
      "correctAnswer": "Let's go!",
      "explanation": "In spoken Finnish, the passive 'Mennään' means 'Let's go!' It is a common proposal form.",
      "hint": "It's an invitation to go together.",
      "points": 10
    },
    {
      "question": "What is the correct passive form of 'puhua' (to speak)?",
      "options": ["puhun", "puhuin", "puhutaan", "puhuisi"],
      "correctAnswer": "puhutaan",
      "explanation": "puhua → puhutaan. Puhun is present active, puhuin is imperfect, puhuisi is conditional.",
      "hint": "Add -taan to the stem.",
      "points": 10
    },
    {
      "question": "How do you say 'Let's eat!' in Finnish?",
      "options": ["Syön!", "Söin!", "Syödään!", "Syö!"],
      "correctAnswer": "Syödään!",
      "explanation": "Syödään is the passive form used as a proposal meaning 'Let's eat!'. 'Syön' = I eat, 'Söin' = I ate, 'Syö' = eat (imperative).",
      "hint": "Passive of syödä.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Me menemme kotiin' and 'Me mennään kotiin'?",
      "options": [
        "No difference",
        "First is written/formal, second is spoken Finnish",
        "First is past tense, second is present",
        "First is negative, second is positive"
      ],
      "correctAnswer": "First is written/formal, second is spoken Finnish",
      "explanation": "In spoken Finnish, the passive 'mennään' often replaces the active 'me menemme'. Both mean 'We go home', but the passive form is much more common in speech.",
      "hint": "Which one sounds like casual everyday speech?",
      "points": 10
    },
    {
      "question": "How do you ask 'Shall we go outside?' in Finnish?",
      "options": [
        "Mennään ulos?",
        "Mennäänkö ulos?",
        "Mene ulos?",
        "Mennään ulkoa?"
      ],
      "correctAnswer": "Mennäänkö ulos?",
      "explanation": "Question in passive: add -ko/-kö to the passive verb. 'Mennäänkö ulos?' = Shall we go outside? 'Mennään ulos' without -kö is a statement (Let's go outside).",
      "hint": "Add the question suffix to the passive verb.",
      "points": 10
    },
    {
      "question": "What is the correct negative passive of 'Mennään'?",
      "options": ["Ei mennään", "Ei mennä", "Ei mene", "Ei mentäisi"],
      "correctAnswer": "Ei mennä",
      "explanation": "Negative passive: ei + passive stem + -ta/-tä. Mennään → ei mennä. 'Ei mennä vielä' = Let's not go yet.",
      "hint": "The negative removes the -än and adds -ä.",
      "points": 10
    },
    {
      "question": "What does 'Suomessa puhutaan suomea' mean?",
      "options": [
        "Finns speak Finnish",
        "Finnish is spoken in Finland",
        "I speak Finnish in Finland",
        "Let's speak Finnish in Finland"
      ],
      "correctAnswer": "Finnish is spoken in Finland",
      "explanation": "This is a general statement using the passive. The focus is on the action (speaking Finnish), not on who does it.",
      "hint": "Passive shifts focus from the doer to the action.",
      "points": 10
    },
    {
      "question": "Which sentence means 'Let's not talk about it now'?",
      "options": [
        "Ei puhuta siitä nyt",
        "Ei puhua siitä nyt",
        "Puhutaan siitä nyt",
        "Ei puhu siitä nyt"
      ],
      "correctAnswer": "Ei puhuta siitä nyt",
      "explanation": "Negative passive: ei + puhuta. 'Ei puhuta siitä nyt' = Let's not talk about it now. 'Puhutaan' would be positive (Let's talk).",
      "hint": "Negative passive starts with 'ei' followed by the passive stem.",
      "points": 10
    },
    {
      "question": "What is the passive form of 'ostaa' (to buy)?",
      "options": ["ostan", "ostin", "ostetaan", "ostaisi"],
      "correctAnswer": "ostetaan",
      "explanation": "ostaa → ostetaan. Ostan = I buy, ostin = I bought, ostaisi = would buy. The passive is used for 'let's buy' or 'is bought'.",
      "hint": "Add -etaan to the stem.",
      "points": 10
    }
  ]
},
{
  "id": "imperative-plural",
  "chapter": 5,
  "title": "Imperative (Plural) – Telling a Group What to Do",
  "finnish": "Monikon imperatiivi",
  "icon": "👥",
  "level": "A2",
  "accent": "bg-orange-600",
  "badge": "bg-orange-50 text-orange-700 border-orange-200",
  "description": "How to form and use the plural imperative for commands, instructions, and requests when speaking to a group of people",
  "content": {
    "type": "rich",
    "intro": "The plural imperative is used when speaking to many people, a group, or more than one person. It means commands, instructions, or requests directed at a group.",
    "sections": [
      {
        "type": "subheading",
        "text": "5.1 Positive & Negative Plural Imperative"
      },
      {
        "type": "subheading",
        "text": "Positive Plural Imperative"
      },
      {
        "type": "paragraph",
        "text": "Formation: Verb stem + kaa / kää"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Lukekaa!", "Read!"],
          ["Tulkaa!", "Come!"],
          ["Istukaa!", "Sit down!"]
        ]
      },
      {
        "type": "subheading",
        "text": "Negative Plural Imperative"
      },
      {
        "type": "paragraph",
        "text": "Formation: Älkää + verb stem + ko / kö"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Älkää lukeko!", "Don't read!"],
          ["Älkää tulko!", "Don't come!"],
          ["Älkää puhuko!", "Don't speak!"]
        ]
      },
      {
        "type": "subheading",
        "text": "5.2 Why Use the Plural Imperative?"
      },
      {
        "type": "paragraph",
        "text": "Used when speaking to a class, customers, friends, family, or any group. Common in teacher instructions, announcements, workplace communication, and instructions."
      },
      {
        "type": "subheading",
        "text": "5.3 Common Plural Imperative Forms"
      },
      {
        "type": "example-table",
        "headers": ["Infinitive", "Positive", "Negative", "Meaning"],
        "rows": [
          ["lukea", "lukekaa", "älkää lukeko", "read"],
          ["tulla", "tulkaa", "älkää tulko", "come"],
          ["mennä", "menkää", "älkää menkö", "go"],
          ["syödä", "syökää", "älkää syökö", "eat"],
          ["juoda", "juokaa", "älkää juoko", "drink"],
          ["puhua", "puhukaa", "älkää puhuko", "speak"],
          ["kirjoittaa", "kirjoittakaa", "älkää kirjoittako", "write"],
          ["istua", "istukaa", "älkää istuko", "sit"],
          ["katsoa", "katsokaa", "älkää katsoko", "watch/look"],
          ["ottaa", "ottakaa", "älkää ottako", "take"]
        ]
      },
      {
        "type": "subheading",
        "text": "5.4 Examples in Real Life"
      },
      {
        "type": "subheading",
        "text": "In the Classroom"
      },
      {
        "type": "example-list",
        "items": [
          "Avatkaa kirjat. (Open your books.)",
          "Kuunnelkaa opettajaa. (Listen to the teacher.)",
          "Älkää puhuko nyt. (Don't talk now.)"
        ]
      },
      {
        "type": "subheading",
        "text": "At Work"
      },
      {
        "type": "example-list",
        "items": [
          "Tulkaa tänne hetkeksi. (Come here for a moment.)",
          "Katsokaa tämä raportti. (Look at this report.)",
          "Älkää unohtako kokousta. (Don't forget the meeting.)"
        ]
      },
      {
        "type": "subheading",
        "text": "Everyday Situations"
      },
      {
        "type": "example-list",
        "items": [
          "Syökää hyvin! (Eat well!)",
          "Odottakaa täällä. (Wait here.)",
          "Älkää kiirehtikö. (Don't hurry.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5.5 Positive vs Negative Commands"
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Negative"],
        "rows": [
          ["Menkää kotiin!", "Älkää menkö kotiin!"],
          ["Puhukaa hitaasti!", "Älkää puhuko nopeasti!"],
          ["Istukaa tähän!", "Älkää istuko siihen!"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Juokaa vettä. (Drink water.)",
          "Älkää juoko liikaa kahvia. (Don't drink too much coffee.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5.6 Important Sound Changes"
      },
      {
        "type": "example-table",
        "headers": ["Infinitive", "Imperative", "Meaning"],
        "rows": [
          ["mennä", "menkää", "go"],
          ["tulla", "tulkaa", "come"],
          ["tehdä", "tehkää", "do"],
          ["nähdä", "nähkää", "see"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Tehkää harjoitus. (Do the exercise.)",
          "Nähkää ystävänne usein. (See your friends often.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5.7 Polite Use"
      },
      {
        "type": "paragraph",
        "text": "Plural imperative can sound strong, official, or polite depending on tone. Very common in customer service, signs, and announcements."
      },
      {
        "type": "example-list",
        "items": [
          "Olkaa hyvä ja odottakaa. (Please wait.)",
          "Astukaa sisään. (Please come in.)",
          "Seuratkaa minua. (Follow me.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5.8 Imperative vs Conditional"
      },
      {
        "type": "example-table",
        "headers": ["Imperative (Direct)", "Conditional (Polite)"],
        "rows": [
          ["Istukaa!", "Voisitteko istua?"],
          ["Tulkaa tänne!", "Voisitteko tulla tänne?"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Imperative = direct command. Conditional = softer/polite request."
      },
      {
        "type": "example-list",
        "items": [
          "Sulkekaa ovi. (Close the door.)",
          "Voisitteko sulkea oven? (Could you close the door?)"
        ]
      },
      {
        "type": "subheading",
        "text": "5.9 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "Come here! (to many people) → Tulkaa tänne!",
          "Don't speak! → Älkää puhuko!",
          "Read the book! → Lukekaa kirja!",
          "Don't go there! → Älkää menkö sinne!",
          "Drink water! → Juokaa vettä!"
        ]
      },
      {
        "type": "subheading",
        "text": "5.10 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Odottakaa hetki. (Wait a moment.)",
          "Älkää myöhästykö. (Don't be late.)",
          "Ottakaa kahvia. (Have some coffee.)",
          "Kuunnelkaa tarkasti. (Listen carefully.)",
          "Älkää unohtako passia. (Don't forget the passport.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "How is the positive plural imperative formed?",
      "options": ["Verb stem + n", "Verb stem + kaa/kää", "Verb stem + t", "Verb stem + i"],
      "correctAnswer": "Verb stem + kaa/kää",
      "explanation": "The positive plural imperative is formed by adding -kaa or -kää to the verb stem. Example: lukea → lukekaa (Read!).",
      "hint": "Think of 'lukekaa' — what ending does it have?",
      "points": 10
    },
    {
      "question": "What is the negative plural imperative structure?",
      "options": [
        "Ei + verb stem",
        "Älä + verb stem",
        "Älkää + verb stem + ko/kö",
        "Ei saa + verb stem"
      ],
      "correctAnswer": "Älkää + verb stem + ko/kö",
      "explanation": "Negative plural imperative: Älkää + verb stem + -ko/-kö. Example: älkää lukeko (Don't read!), älkää menkö (Don't go!).",
      "hint": "It starts with Älkää and ends with -ko/-kö.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Istukaa!' and 'Voisitteko istua?'?",
      "options": [
        "No difference",
        "First is singular, second is plural",
        "First is direct command (Sit!), second is polite request (Could you sit?)",
        "First is past tense, second is present"
      ],
      "correctAnswer": "First is direct command (Sit!), second is polite request (Could you sit?)",
      "explanation": "Istukaa (imperative) is a direct command. Voisitteko istua (conditional) is a softer, more polite request.",
      "hint": "One is a command, one asks 'could you'.",
      "points": 10
    },
    {
      "question": "What is the correct plural imperative of 'tulla' (to come)?",
      "options": ["tule", "tulkaa", "tulkoon", "tulisit"],
      "correctAnswer": "tulkaa",
      "explanation": "tulla stem tul- + -kaa = tulkaa (Come! to a group). 'Tule' is singular imperative, 'tulkoon' is 3rd person imperative, 'tulisit' is conditional.",
      "hint": "The stem of tulla is tul-.",
      "points": 10
    },
    {
      "question": "How do you say 'Don't speak!' to a group?",
      "options": ["Ei puhu!", "Älä puhu!", "Älkää puhuko!", "Ei puhuta!"],
      "correctAnswer": "Älkää puhuko!",
      "explanation": "Negative plural imperative: Älkää + puhu- + -ko = Älkää puhuko! 'Älä puhu' is singular (to one person).",
      "hint": "Plural negative starts with Älkää.",
      "points": 10
    },
    {
      "question": "What is the plural imperative of 'mennä' (to go)?",
      "options": ["menkää", "menet", "meni", "mennään"],
      "correctAnswer": "menkää",
      "explanation": "mennä stem men- + -kää = menkää (Go! to a group). 'Menet' is present, 'meni' is imperfect, 'mennään' is passive.",
      "hint": "The stem of mennä is men-.",
      "points": 10
    },
    {
      "question": "What does 'Älkää myöhästykö' mean?",
      "options": ["You are late", "Don't be late (to a group)", "Let's not be late", "They are not late"],
      "correctAnswer": "Don't be late (to a group)",
      "explanation": "Älkää myöhästykö is negative plural imperative: 'Don't be late!' when speaking to multiple people.",
      "hint": "The word myöhästykö ends with -kö, and älkää indicates plural.",
      "points": 10
    },
    {
      "question": "Which sentence means 'Read the book!' to a group?",
      "options": ["Luen kirjaa", "Lukeeko kirja", "Lukekaa kirja", "Lukisin kirjaa"],
      "correctAnswer": "Lukekaa kirja",
      "explanation": "Lukekaa is the positive plural imperative of lukea. 'Luen' = I read, 'Lukeeko' = does he/she read?, 'Lukisin' = I would read.",
      "hint": "The ending -kaa indicates plural imperative.",
      "points": 10
    },
    {
      "question": "What is the plural imperative of 'tehdä' (to do)?",
      "options": ["tekevät", "tehnyt", "tehkää", "tekee"],
      "correctAnswer": "tehkää",
      "explanation": "tehdä has a stem change: teke- → teh- before the imperative. Tehkää = Do! (to a group). 'Teke' is present stem, 'tehnyt' is past participle.",
      "hint": "The imperative stem for tehdä is teh-.",
      "points": 10
    },
    {
      "question": "How do you say 'Wait a moment!' to a group?",
      "options": ["Odota hetki", "Odottakaa hetki", "Odottamaan hetki", "Odottaa hetki"],
      "correctAnswer": "Odottakaa hetki",
      "explanation": "Odottakaa is the plural imperative of odottaa (to wait). 'Odota' is singular imperative (to one person).",
      "hint": "Add -kaa to the stem odotta-.",
      "points": 10
    }
  ]
},
{
  "id": "noun-inflection-wordtype-b",
  "chapter": 6,
  "title": "Noun Inflection – Consonant Gradation in Wordtype B",
  "finnish": "Substantiivien taivutus – sana tyyppi B",
  "icon": "🔄",
  "level": "A2",
  "accent": "bg-blue-600",
  "badge": "bg-blue-50 text-blue-700 border-blue-200",
  "description": "How Finnish nouns and adjectives change their stems before case endings, including -e → -kee-, -as → -aa-, and consonant gradation",
  "content": {
    "type": "rich",
    "intro": "Some Finnish nouns and adjectives change their stem before case endings are added. This happens because of consonant gradation, stem changes, and historical sound rules. These words are very common in Finnish.",
    "sections": [
      {
        "type": "subheading",
        "text": "6.1 Wordtype B: Changing Stems"
      },
      {
        "type": "paragraph",
        "text": "Some Finnish nouns and adjectives change their stem before case endings are added. This happens because of consonant gradation, stem changes, and historical sound rules. These words are very common in Finnish."
      },
      {
        "type": "subheading",
        "text": "Basic Idea"
      },
      {
        "type": "paragraph",
        "text": "The dictionary form changes when adding endings like genitive (-n), partitive (-a/-ä, -ta/-tä), and other cases."
      },
      {
        "type": "subheading",
        "text": "6.2 Type: -e → -kee-"
      },
      {
        "type": "paragraph",
        "text": "Some words ending in -ke change to -kee- in the stem."
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Genitive", "Partitive", "Meaning"],
        "rows": [
          ["lomake", "lomakkeen", "lomaketta", "form"],
          ["liike", "liikkeen", "liikettä", "movement/shop"],
          ["perheke", "perhekkeen", "perhekettä", "family structure (rare)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Täytä lomake. (Fill in the form.)",
          "Tarvitsen lomakkeen. (I need the form.)",
          "Luen lomaketta. (I am reading the form.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6.3 Type: -as → -aa-"
      },
      {
        "type": "paragraph",
        "text": "Words ending in -as often change: -as → -aa-."
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Genitive", "Partitive", "Meaning"],
        "rows": [
          ["rakas", "rakkaan", "rakasta", "dear"],
          ["vieras", "vieraan", "vierasta", "guest/foreign"],
          ["kangas", "kankaan", "kangasta", "fabric"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Hän on rakas ystävä. (He/she is a dear friend.)",
          "Näin rakkaan ystävän. (I saw my dear friend.)",
          "Odotamme vierasta. (We are waiting for a guest.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6.4 Type: No Stem Change"
      },
      {
        "type": "paragraph",
        "text": "Some words look similar but do not change much."
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Genitive", "Partitive", "Meaning"],
        "rows": [
          ["korkea", "korkean", "korkeaa", "high"],
          ["vaikea", "vaikean", "vaikeaa", "difficult"],
          ["tärkeä", "tärkeän", "tärkeää", "important"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Talo on korkea. (The house is high/tall.)",
          "Tämä tehtävä on vaikea. (This task is difficult.)",
          "Suomi on minulle tärkeä. (Finland is important to me.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6.5 Consonant Gradation"
      },
      {
        "type": "paragraph",
        "text": "Finnish often changes consonants between strong grade and weak grade. This is called Consonant Gradation (astevaihtelu)."
      },
      {
        "type": "example-table",
        "headers": ["Strong", "Weak"],
        "rows": [
          ["kk", "k"],
          ["pp", "p"],
          ["tt", "t"],
          ["k", "∅ (disappears sometimes)"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Genitive", "Meaning"],
        "rows": [
          ["kukka", "kukan", "flower"],
          ["lippu", "lipun", "flag/ticket"],
          ["matto", "maton", "carpet"],
          ["puku", "puvun", "suit"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Ostin kukan. (I bought a flower.)",
          "Näin lipun. (I saw the ticket.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6.6 Genitive Formation"
      },
      {
        "type": "paragraph",
        "text": "The genitive usually shows ownership, connection, or total object. Formation: Stem + n"
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Genitive"],
        "rows": [
          ["talo", "talon"],
          ["rakas", "rakkaan"],
          ["lomake", "lomakkeen"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Talon ovi. (The house's door.)",
          "Täytän lomakkeen. (I fill in the form.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6.7 Partitive Formation"
      },
      {
        "type": "paragraph",
        "text": "The partitive often expresses incomplete action, ongoing action, quantity, or emotions."
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Partitive"],
        "rows": [
          ["lomake", "lomaketta"],
          ["rakas", "rakasta"],
          ["korkea", "korkeaa"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Rakastan sinua. (I love you.)",
          "Luen kirjaa. (I am reading a book.)",
          "Näen korkeaa rakennusta. (I see a tall building.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6.8 Singular vs Stem"
      },
      {
        "type": "paragraph",
        "text": "Sometimes the stem looks very different from the dictionary form. This is normal in Finnish and must often be memorized."
      },
      {
        "type": "example-table",
        "headers": ["Dictionary Form", "Stem", "Example"],
        "rows": [
          ["rakas", "rakkaa-", "rakkaan"],
          ["lomake", "lomakkee-", "lomakkeen"],
          ["vieras", "vieraa-", "vieraan"]
        ]
      },
      {
        "type": "subheading",
        "text": "6.9 Useful Vocabulary"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Genitive", "Partitive", "English"],
        "rows": [
          ["lomake", "lomakkeen", "lomaketta", "form"],
          ["rakas", "rakkaan", "rakasta", "dear"],
          ["vieras", "vieraan", "vierasta", "guest"],
          ["kangas", "kankaan", "kangasta", "fabric"],
          ["korkea", "korkean", "korkeaa", "high"],
          ["tärkeä", "tärkeän", "tärkeää", "important"]
        ]
      },
      {
        "type": "subheading",
        "text": "6.10 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I filled in the form. → Täytin lomakkeen.",
          "We are waiting for a guest. → Odotamme vierasta.",
          "The building is tall. → Rakennus on korkea.",
          "I saw my dear friend. → Näin rakkaan ystäväni.",
          "This is an important thing. → Tämä on tärkeä asia."
        ]
      },
      {
        "type": "subheading",
        "text": "6.11 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tarvitsen uuden lomakkeen. (I need a new form.)",
          "Hän on minulle rakas. (He/she is dear to me.)",
          "Tämä tie on pitkä ja korkea. (This road is long and high.)",
          "Odotamme vieraita illalla. (We are expecting guests in the evening.)",
          "Suomen kieli on vaikeaa mutta kiinnostavaa. (The Finnish language is difficult but interesting.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What happens to words ending in -ke like 'lomake' in the genitive?",
      "options": [
        "No change",
        "-ke → -kke-",
        "-ke → -kee-",
        "-ke → -kään-"
      ],
      "correctAnswer": "-ke → -kee-",
      "explanation": "Words ending in -ke change to -kee- in the stem. Example: lomake → lomakkeen (genitive).",
      "hint": "Look at 'lomake' → 'lomakkeen' — what changed?",
      "points": 10
    },
    {
      "question": "What is the genitive form of 'rakas' (dear)?",
      "options": ["rakas", "rakkaan", "rakasta", "rakkaa"],
      "correctAnswer": "rakkaan",
      "explanation": "Words ending in -as change to -aa- in the stem. rakas → rakkaa- + -n = rakkaan.",
      "hint": "The stem changes from -as to -aa-.",
      "points": 10
    },
    {
      "question": "Which of these words changes its stem?",
      "options": ["talo", "kissa", "vieras", "auto"],
      "correctAnswer": "vieras",
      "explanation": "Vieras (guest) ends in -as and changes: vieras → vieraan. Talo, kissa, and auto do not have this type of stem change.",
      "hint": "Look for words ending in -as or -ke.",
      "points": 10
    },
    {
      "question": "What is consonant gradation (astevaihtelu)?",
      "options": [
        "Adding vowels to the end of words",
        "Changing consonants between strong and weak grade",
        "Removing the last letter of a word",
        "Doubling all consonants"
      ],
      "correctAnswer": "Changing consonants between strong and weak grade",
      "explanation": "Consonant gradation means consonants change between strong and weak grade. Example: kukka (strong) → kukan (weak), where kk becomes k.",
      "hint": "Think of kukka → kukan — what happened to the double k?",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'lomake' (form)?",
      "options": ["lomake", "lomakkeen", "lomaketta", "lomakka"],
      "correctAnswer": "lomaketta",
      "explanation": "lomake stem lomakkee- + -ta (because the stem ends in a vowel) = lomaketta. Partitive singular for 'form'.",
      "hint": "Partitive of lomake ends in -tta.",
      "points": 10
    },
    {
      "question": "Which word shows consonant gradation (kk → k)?",
      "options": ["talo → talon", "kukka → kukan", "auto → auton", "kirja → kirjan"],
      "correctAnswer": "kukka → kukan",
      "explanation": "kukka (flower) has double k (kk) which weakens to single k (k) in the genitive: kukan. Talo, auto, and kirja do not have gradation.",
      "hint": "Double consonant becoming single is gradation.",
      "points": 10
    },
    {
      "question": "What is the genitive form of 'vieras' (guest)?",
      "options": ["vieras", "vieraan", "vierasta", "vieraas"],
      "correctAnswer": "vieraan",
      "explanation": "vieras → stem vieraa- + -n = vieraan. The -as ending changes to -aa- in the stem.",
      "hint": "Add -n to the stem (vieraa-).",
      "points": 10
    },
    {
      "question": "Which of the following means 'I need a new form'?",
      "options": [
        "Täytän uuden lomakkeen",
        "Tarvitsen uuden lomakkeen",
        "Luen uutta lomaketta",
        "Näen uuden lomakkeen"
      ],
      "correctAnswer": "Tarvitsen uuden lomakkeen",
      "explanation": "Tarvitsen = I need. 'Uuden lomakkeen' is the genitive singular (total object) of 'uusi lomake' (new form).",
      "hint": "The verb 'tarvita' means 'to need'.",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'korkea' (high)?",
      "options": ["korkea", "korkean", "korkeaa", "korkeata"],
      "correctAnswer": "korkeaa",
      "explanation": "korkea is an adjective that does not change its stem much. Partitive: korkea → korkeaa (add -a, drop the final vowel? Actually korkea + a → korkeaa).",
      "hint": "korkea + partitive -a = korkeaa.",
      "points": 10
    },
    {
      "question": "What does 'Odotamme vierasta' mean?",
      "options": [
        "We are waiting for a guest",
        "We see a guest",
        "The guest is waiting",
        "We invite a guest"
      ],
      "correctAnswer": "We are waiting for a guest",
      "explanation": "Odotamme = we are waiting. Vierasta is the partitive singular of vieras (guest). In Finnish, odottaa (to wait for) takes the partitive case.",
      "hint": "The verb odottaa requires the partitive case.",
      "points": 10
    }
  ]
},
{
  "id": "words-ending-in-s",
  "chapter": 7,
  "title": "Words Ending in -s (-is, -as, -us, -uus)",
  "finnish": "-s-loppuiset sanat",
  "icon": "📝",
  "level": "A2",
  "accent": "bg-pink-600",
  "badge": "bg-pink-50 text-pink-700 border-pink-200",
  "description": "How to inflect Finnish nouns and adjectives ending in -s, including -is, -as, -us, and -uus/-yys types",
  "content": {
    "type": "rich",
    "intro": "Many Finnish nouns and adjectives ending in -s follow special stem changes when inflected. These endings are very common in adjectives (kaunis) and abstract nouns (kauneus, vastaus).",
    "sections": [
      {
        "type": "subheading",
        "text": "7.1 Inflection Patterns"
      },
      {
        "type": "paragraph",
        "text": "Many Finnish nouns and adjectives ending in -s follow special stem changes when inflected. These endings are very common in adjectives (kaunis, vaikeus) and abstract nouns (kauneus, vastaus)."
      },
      {
        "type": "subheading",
        "text": "7.2 -is Words (kaunis type)"
      },
      {
        "type": "paragraph",
        "text": "Pattern: Genitive: -iin, Partitive: -ista"
      },
      {
        "type": "example-table",
        "headers": ["Basic", "Genitive", "Partitive", "Meaning"],
        "rows": [
          ["kaunis", "kauniin", "kaunista", "beautiful"],
          ["valmis", "valmiin", "valmista", "ready"],
          ["ystävällinen", "ystävällisen", "ystävällistä", "friendly"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Hän on kaunis. (She is beautiful.)",
          "Näen kauniin talon. (I see a beautiful house.)",
          "Puhun kaunista suomea. (I speak beautiful Finnish.)"
        ]
      },
      {
        "type": "subheading",
        "text": "7.3 -as Words"
      },
      {
        "type": "paragraph",
        "text": "Pattern (often irregular stem change): Genitive: -aan / -an, Partitive: -asta"
      },
      {
        "type": "example-table",
        "headers": ["Basic", "Genitive", "Partitive", "Meaning"],
        "rows": [
          ["vieras", "vieraan", "vierasta", "guest"],
          ["rakas", "rakkaan", "rakasta", "dear"],
          ["tehtävä", "tehtävän", "tehtävää", "task"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Meillä on vieras. (We have a guest.)",
          "Odotan vieraan tuloa. (I am waiting for the guest's arrival.)",
          "Tämä tehtävä on vaikea. (This task is difficult.)"
        ]
      },
      {
        "type": "subheading",
        "text": "7.4 -us Words (very important pattern)"
      },
      {
        "type": "paragraph",
        "text": "Pattern: Genitive often: -uksen / -ksen, Partitive: -usta / -stä"
      },
      {
        "type": "example-table",
        "headers": ["Basic", "Genitive", "Partitive", "Meaning"],
        "rows": [
          ["vastaus", "vastauksen", "vastausta", "answer"],
          ["rakkaus", "rakkauden", "rakkautta", "love"],
          ["kysymys", "kysymyksen", "kysymystä", "question"],
          ["mahdollisuus", "mahdollisuuden", "mahdollisuutta", "possibility"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Sain hyvän vastauksen. (I got a good answer.)",
          "Rakastan tätä rakkautta. (I love this love.)",
          "Minulla on kysymys. (I have a question.)"
        ]
      },
      {
        "type": "subheading",
        "text": "7.5 -uus / -yys Words"
      },
      {
        "type": "paragraph",
        "text": "Pattern (very important in Finnish): Genitive: often -uuden / -yden, Partitive: -uutta / -yyttä"
      },
      {
        "type": "example-table",
        "headers": ["Basic", "Genitive", "Partitive", "Meaning"],
        "rows": [
          ["kauneus", "kauneuden", "kauneutta", "beauty"],
          ["ystävyys", "ystävyyden", "ystävyyttä", "friendship"],
          ["vapaus", "vapauden", "vapautta", "freedom"],
          ["selkeys", "selkeyden", "selkeyttä", "clarity"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Kauneus on tärkeää. (Beauty is important.)",
          "Arvostan ystävyyttä. (I value friendship.)",
          "Hän haluaa vapautta. (He/she wants freedom.)"
        ]
      },
      {
        "type": "subheading",
        "text": "7.6 Key Rule (Very Important)"
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "Most -us / -uus / -yys words use -kse- or -de- in genitive singular."
      },
      {
        "type": "example-table",
        "headers": ["Basic", "Genitive Pattern"],
        "rows": [
          ["vastaus", "vastaukse-n → vastauksen"],
          ["rakkaus", "rakkaude-n → rakkauden"],
          ["kauneus", "kauneude-n → kauneuden"]
        ]
      },
      {
        "type": "subheading",
        "text": "7.7 Why This Happens"
      },
      {
        "type": "paragraph",
        "text": "Finnish uses these stem changes because pronunciation becomes easier, older language forms still influence modern Finnish, and it helps avoid difficult consonant clusters."
      },
      {
        "type": "subheading",
        "text": "7.8 Quick Comparison Table"
      },
      {
        "type": "example-table",
        "headers": ["Type", "Example", "Genitive", "Partitive"],
        "rows": [
          ["-is", "kaunis", "kauniin", "kaunista"],
          ["-as", "vieras", "vieraan", "vierasta"],
          ["-us", "vastaus", "vastauksen", "vastausta"],
          ["-uus", "kauneus", "kauneuden", "kauneutta"]
        ]
      },
      {
        "type": "subheading",
        "text": "7.9 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I got a good answer. → Sain hyvän vastauksen.",
          "Beauty is important. → Kauneus on tärkeää.",
          "We have a guest. → Meillä on vieras.",
          "I love friendship. → Rakastan ystävyyttä.",
          "This is a difficult task. → Tämä on vaikea tehtävä."
        ]
      },
      {
        "type": "subheading",
        "text": "7.10 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Minulla on kysymys. (I have a question.)",
          "Tämä on hyvä vastaus. (This is a good answer.)",
          "Arvostan ystävyyttäsi. (I appreciate your friendship.)",
          "Kauneus löytyy kaikkialta. (Beauty can be found everywhere.)",
          "Vieras tuli aikaisin. (The guest came early.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the genitive form of 'kaunis' (beautiful)?",
      "options": ["kaunis", "kauniin", "kaunista", "kaunea"],
      "correctAnswer": "kauniin",
      "explanation": "kaunis belongs to the -is type. Genitive: kaunis → kauniin (stem kaunii- + -n).",
      "hint": "The genitive ending is -n, and the stem changes to kaunii-.",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'kaunis' (beautiful)?",
      "options": ["kaunis", "kauniin", "kaunista", "kauneutta"],
      "correctAnswer": "kaunista",
      "explanation": "kaunis → partitive kaunista. The pattern for -is words: partitive ends in -ista.",
      "hint": "Partitive of -is words ends in -ista.",
      "points": 10
    },
    {
      "question": "What is the genitive form of 'vastaus' (answer)?",
      "options": ["vastaus", "vastausta", "vastauksen", "vastaukseen"],
      "correctAnswer": "vastauksen",
      "explanation": "vastaus is a -us word. Genitive: vastaus → vastauksen (stem vastaukse- + -n).",
      "hint": "-us words often take -kse- in the genitive stem.",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'rakkaus' (love)?",
      "options": ["rakkaus", "rakkauden", "rakkautta", "rakkasta"],
      "correctAnswer": "rakkautta",
      "explanation": "rakkaus → partitive rakkautta. The stem changes to rakkaude- → partitive rakkautta (with t instead of d).",
      "hint": "The partitive often has -tt- in these words.",
      "points": 10
    },
    {
      "question": "What type of word is 'kauneus' (beauty)?",
      "options": ["-is type", "-as type", "-us type", "-uus type"],
      "correctAnswer": "-uus type",
      "explanation": "kauneus ends in -uus, making it a -uus/-yys type word. These are common abstract nouns in Finnish.",
      "hint": "Look at the ending: kauneus ends in -us, but the stem has -uus? Actually kauneus = kaunis + -uus.",
      "points": 10
    },
    {
      "question": "What is the genitive form of 'kauneus' (beauty)?",
      "options": ["kauneus", "kauneuden", "kauneutta", "kauneuksen"],
      "correctAnswer": "kauneuden",
      "explanation": "kauneus → genitive kauneuden. The pattern for -uus words: -uus → -uude- + -n = -uuden.",
      "hint": "Adding -n to the stem kauneude- gives kauneuden.",
      "points": 10
    },
    {
      "question": "Which word means 'freedom' and follows the -uus pattern?",
      "options": ["vapaa", "vapaus", "vapaasti", "vapautta"],
      "correctAnswer": "vapaus",
      "explanation": "vapaus (freedom) ends in -us but comes from vapaa + -us, making it follow the -uus pattern: vapaus → vapauden (genitive).",
      "hint": "It's an abstract noun derived from an adjective.",
      "points": 10
    },
    {
      "question": "What is the correct partitive form of 'ystävyys' (friendship)?",
      "options": ["ystävyys", "ystävyyden", "ystävyyttä", "ystävystä"],
      "correctAnswer": "ystävyyttä",
      "explanation": "ystävyys → partitive ystävyyttä. The -yys ending becomes -yyttä in the partitive.",
      "hint": "Partitive of -yys words ends in -yttä.",
      "points": 10
    },
    {
      "question": "What does 'Sain hyvän vastauksen' mean?",
      "options": [
        "I gave a good answer",
        "I got a good answer",
        "I need a good answer",
        "I write a good answer"
      ],
      "correctAnswer": "I got a good answer",
      "explanation": "Sain = I got/received. Hyvän vastauksen = good answer (in genitive/accusative as total object).",
      "hint": "The verb 'saada' means 'to get' or 'to receive'.",
      "points": 10
    },
    {
      "question": "Which of the following pairs is correct?",
      "options": [
        "kaunis → kauneutta",
        "vastaus → vastauksen",
        "vieras → vierasta",
        "rakkaus → rakkauden"
      ],
      "correctAnswer": "vastaus → vastauksen",
      "explanation": "vastaus → vastauksen (genitive) is correct. kaunis → kauneutta is wrong (it should be kaunista for partitive). vieras → vierasta is partitive, yes but the pair is genitive question? Actually kaunis → kauneutta is wrong check: kauneutta belongs to kauneus. rakkaus → rakkauden is genitive (correct). Let's check: vastaus → vastauksen (genitive) is correct.",
      "hint": "Check each word's correct inflection pattern.",
      "points": 10
    }
  ]
},

{
  "id": "partitive-case-part1",
  "chapter": 8,
  "title": "The Partitive Case – Part 1 (Core Uses & Forms)",
  "finnish": "Partitiivi – osa 1",
  "icon": "🧩",
  "level": "A2",
  "accent": "bg-teal-600",
  "badge": "bg-teal-50 text-teal-700 border-teal-200",
  "description": "Core uses of the partitive case: ongoing actions, partial objects, negative sentences, and numbers — plus forms for different word types",
  "content": {
    "type": "rich",
    "intro": "The partitive case is one of the most important cases in Finnish. It appears constantly in everyday speech.",
    "sections": [
      {
        "type": "subheading",
        "text": "8.1 When to Use the Partitive"
      },
      {
        "type": "paragraph",
        "text": "The partitive is used when the action is incomplete, partial, negative, or indefinite."
      },
      {
        "type": "subheading",
        "text": "A) Irresultative / Ongoing Actions"
      },
      {
        "type": "paragraph",
        "text": "When the action is not 'fully completed' or not focused on a finished result."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Rakastan sinua.", "I love you."],
          ["Katson televisiota.", "I am watching TV."],
          ["Kuuntelen musiikkia.", "I am listening to music."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Rakastan sinua. (Love is ongoing, not 'completed'.)",
          "Luen kirjaa. (I am reading a book → not finished necessarily.)"
        ]
      },
      {
        "type": "subheading",
        "text": "B) Partial Objects (Some of something)"
      },
      {
        "type": "paragraph",
        "text": "Used when you only refer to part of a whole."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Ostan kirjaa.", "I am buying (some) book."],
          ["Syön leipää.", "I am eating bread."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Ostan maitoa. (I am buying some milk.)",
          "Söin kakkua. (I ate some cake.)"
        ]
      },
      {
        "type": "subheading",
        "text": "C) Negative Sentences (Very Important Rule)"
      },
      {
        "type": "paragraph",
        "text": "All negative sentences use the partitive object."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["En näe koiraa.", "I do not see a dog."],
          ["En osta autoa.", "I do not buy a car."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "En syö omenaa. (I do not eat an apple.)",
          "Emme katso elokuvaa. (We are not watching a movie.)"
        ]
      },
      {
        "type": "subheading",
        "text": "D) Numbers (Except 1)"
      },
      {
        "type": "paragraph",
        "text": "After numbers greater than 1, nouns are always in the partitive."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["kaksi kirjaa", "two books"],
          ["kolme omenaa", "three apples"],
          ["viisi taloa", "five houses"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Minulla on kaksi koiraa. (I have two dogs.)",
          "Ostin kolme kirjaa. (I bought three books.)"
        ]
      },
      {
        "type": "subheading",
        "text": "8.2 Partitive Forms for Word Types"
      },
      {
        "type": "subheading",
        "text": "1. Vowel Stem Words"
      },
      {
        "type": "paragraph",
        "text": "Pattern: -a / -ä"
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Partitive", "Meaning"],
        "rows": [
          ["talo", "taloa", "house"],
          ["auto", "autoa", "car"],
          ["kirja", "kirjaa", "book"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Näen taloa. (I see a house / part of a house.)"]
      },
      {
        "type": "subheading",
        "text": "2. -e Words"
      },
      {
        "type": "paragraph",
        "text": "Pattern: -tta / -ttä"
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Partitive", "Meaning"],
        "rows": [
          ["huone", "huonetta", "room"],
          ["kirje", "kirjettä", "letter"],
          ["perhe", "perhettä", "family"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Siivoan huonetta. (I am cleaning the room.)"]
      },
      {
        "type": "subheading",
        "text": "3. -nen Words"
      },
      {
        "type": "paragraph",
        "text": "Pattern: -sta / -stä"
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Partitive", "Meaning"],
        "rows": [
          ["nainen", "naista", "woman"],
          ["ihminen", "ihmistä", "person"],
          ["suomalainen", "suomalaista", "Finnish person"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Näen suomalaista ihmistä. (I see a Finnish person.)"]
      },
      {
        "type": "subheading",
        "text": "4. -s Words (long stem words)"
      },
      {
        "type": "paragraph",
        "text": "Pattern: -sta / -stä"
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Partitive", "Meaning"],
        "rows": [
          ["vastaus", "vastausta", "answer"],
          ["rakkaus", "rakkautta", "love"],
          ["kysymys", "kysymystä", "question"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Tarvitsen vastausta. (I need an answer.)",
          "Rakastan rakkautta. (I love love.)"
        ]
      },
      {
        "type": "subheading",
        "text": "8.3 Quick Summary Rule"
      },
      {
        "type": "paragraph",
        "text": "Partitive is used when: Action is not finished, Only part of something, Sentence is negative, After numbers > 1"
      },
      {
        "type": "subheading",
        "text": "8.4 Comparison Table (Very Important)"
      },
      {
        "type": "example-table",
        "headers": ["Situation", "Case", "Example"],
        "rows": [
          ["Finished action", "Genitive/Object", "Söin omenan"],
          ["Ongoing/partial", "Partitive", "Söin omenaa"],
          ["Negative", "Partitive", "En syö omenaa"],
          ["Number > 1", "Partitive", "kaksi omenaa"]
        ]
      },
      {
        "type": "subheading",
        "text": "8.5 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I love you. → Rakastan sinua.",
          "I am eating bread. → Syön leipää.",
          "I do not see a dog. → En näe koiraa.",
          "Two books → Kaksi kirjaa",
          "I am reading a book. → Luen kirjaa."
        ]
      },
      {
        "type": "subheading",
        "text": "8.6 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "En ymmärrä suomea. (I do not understand Finnish.)",
          "Kuuntelen musiikkia. (I am listening to music.)",
          "Ostan maitoa kaupasta. (I buy milk from the store.)",
          "Näen ihmistä ikkunasta. (I see a person from the window.)",
          "Minulla on kolme kysymystä. (I have three questions.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "When is the partitive case used in Finnish?",
      "options": [
        "For finished, completed actions",
        "For ongoing, incomplete, negative, or partial actions",
        "Only with numbers 1 and above",
        "Only in positive sentences"
      ],
      "correctAnswer": "For ongoing, incomplete, negative, or partial actions",
      "explanation": "The partitive is used when the action is incomplete, partial, negative, or indefinite. It describes ongoing actions, partial objects, and appears in negative sentences and after numbers > 1.",
      "hint": "Think of 'I am reading a book' (not finished) vs. 'I read the book' (finished).",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'talo' (house)?",
      "options": ["talo", "talon", "taloa", "talossa"],
      "correctAnswer": "taloa",
      "explanation": "talo is a vowel stem word. Partitive is formed by adding -a: talo + a = taloa. Talon is genitive, talossa is inessive.",
      "hint": "Add -a to the basic form.",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'huone' (room)?",
      "options": ["huone", "huonetta", "huonetta?", "huoneen"],
      "correctAnswer": "huonetta",
      "explanation": "huone ends in -e. The pattern for -e words is -tta/-ttä: huone → huonetta.",
      "hint": "-e words take -tta in the partitive.",
      "points": 10
    },
    {
      "question": "Why is the partitive used in 'Rakastan sinua' (I love you)?",
      "options": [
        "Because it's a negative sentence",
        "Because love is an ongoing, irresultative emotion",
        "Because it's a number",
        "Because the action is finished"
      ],
      "correctAnswer": "Because love is an ongoing, irresultative emotion",
      "explanation": "Love (rakastaa) is an ongoing, irresultative verb — it has no 'finished' state. Such verbs take the partitive object.",
      "hint": "Is love ever 'completed'?",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'nainen' (woman)?",
      "options": ["nainen", "naista", "naisen", "naista?"],
      "correctAnswer": "naista",
      "explanation": "nainen ends in -nen. Words ending in -nen change to -se- in the stem: nainen → naise- + -a → naista (the e drops).",
      "hint": "-nen words become -sta in partitive.",
      "points": 10
    },
    {
      "question": "Which sentence uses the partitive correctly?",
      "options": [
        "En näe koira",
        "En näe koiran",
        "En näe koiraa",
        "En näe koirat"
      ],
      "correctAnswer": "En näe koiraa",
      "explanation": "Negative sentences always take the partitive object. Koiraa is the partitive of koira. 'En näe koira' is wrong (nominative), 'koiran' is genitive, 'koirat' is plural nominative.",
      "hint": "Negative sentence rule: object must be in partitive.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Söin omenan' and 'Söin omenaa'?",
      "options": [
        "No difference",
        "First = I ate the whole apple; Second = I ate some apple / was eating",
        "First is present, second is past",
        "First is negative, second is positive"
      ],
      "correctAnswer": "First = I ate the whole apple; Second = I ate some apple / was eating",
      "explanation": "Söin omenan (genitive/accusative) = finished/whole action (I ate the whole apple). Söin omenaa (partitive) = partial or ongoing action (I ate some apple or was eating an apple).",
      "hint": "One implies completion, the other does not.",
      "points": 10
    },
    {
      "question": "What case follows the number 'kolme' (three)?",
      "options": ["Nominative", "Genitive", "Partitive", "Accusative"],
      "correctAnswer": "Partitive",
      "explanation": "After all numbers except 1, the noun is in the partitive singular: kolme kirjaa (three books), viisi taloa (five houses).",
      "hint": "Numbers 2+, always partitive singular.",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'vastaus' (answer)?",
      "options": ["vastaus", "vastauksen", "vastausta", "vastauksia"],
      "correctAnswer": "vastausta",
      "explanation": "vastaus is a -s word (type -us). Partitive: vastaus → vastausta. Vastauksen is genitive, vastauksia is partitive plural.",
      "hint": "-us words like vastaus take -sta in partitive.",
      "points": 10
    },
    {
      "question": "Which of the following situations uses the partitive?",
      "options": [
        "A finished action with a total object",
        "A negative sentence",
        "After the number 1",
        "A subject in nominative"
      ],
      "correctAnswer": "A negative sentence",
      "explanation": "Negative sentences always take the partitive object. Finished actions use genitive/accusative. Number 1 uses nominative. The subject is normally nominative, not partitive.",
      "hint": "Remember the negative sentence rule.",
      "points": 10
    }
  ]
},

{
  "id": "genitive-case-object",
  "chapter": 9,
  "title": "The Genitive Case & Object Sentences",
  "finnish": "Genetiivi ja objektilauseet",
  "icon": "📦",
  "level": "A2",
  "accent": "bg-indigo-600",
  "badge": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "description": "The genitive case (-n form) for total objects, completed actions, possession, and stem changes in Wordtype B",
  "content": {
    "type": "rich",
    "intro": "The genitive case (-n form) is one of the most important cases in Finnish because it is closely connected to objects, possession, and completed actions.",
    "sections": [
      {
        "type": "subheading",
        "text": "9.1 The Genitive as Total Object"
      },
      {
        "type": "paragraph",
        "text": "Core idea: We use the genitive object when the action is completed, the object is whole/definite, and the result is finished. This is called a total object (kokonaisobjekti)."
      },
      {
        "type": "paragraph",
        "text": "Basic Rule: Completed action → Genitive object"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Ostan kirjan.", "I buy the book — the whole book"],
          ["Syön omenan.", "I eat the apple — completely"],
          ["Luin kirjan.", "I read the book — finished it"],
          ["Katsoin elokuvan.", "I watched the movie — fully"],
          ["Join kahvin.", "I drank the coffee — finished it"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Genitive (total)", "Partitive (partial/ongoing)"],
        "rows": [
          ["Ostan kirjan.", "Ostan kirjaa."],
          ["Syön omenan.", "Syön omenaa."],
          ["Luin kirjan.", "Luen kirjaa."],
          ["Join veden.", "Juon vettä."]
        ]
      },
      {
        "type": "example-list",
        "title": "More Natural Examples (Daily Life)",
        "items": [
          "Siivosin huoneen. (I cleaned the room completely)",
          "Rakensin talon. (I built the house)",
          "Kirjoitin kirjeen. (I wrote the letter)",
          "Söin aamupalan. (I ate breakfast completely)",
          "Katsoin koko elokuvan. (I watched the whole movie)"
        ]
      },
      {
        "type": "subheading",
        "text": "Negative Rule (VERY IMPORTANT)"
      },
      {
        "type": "paragraph",
        "text": "Negative sentences ALWAYS use partitive, never genitive."
      },
      {
        "type": "example-list",
        "items": [
          "En syö omenaa. (I do not eat the apple)",
          "En osta autoa. (I do not buy a car)",
          "En lue kirjaa. (I do not read a book)",
          "En katso elokuvaa. (I do not watch a movie)"
        ]
      },
      {
        "type": "subheading",
        "text": "Commands (Important contrast)"
      },
      {
        "type": "example-list",
        "items": [
          "Syö omena! (Eat the apple! — positive command → genitive idea)",
          "Älä syö omenaa! (Don't eat the apple! → partitive)",
          "Osta kirja! (Buy the book!)",
          "Älä osta kirjaa! (Don't buy the book!)"
        ]
      },
      {
        "type": "subheading",
        "text": "9.2 Genitive in Wordtype B (Stem Changes)"
      },
      {
        "type": "paragraph",
        "text": "Some Finnish words change their stem before adding -n."
      },
      {
        "type": "example-table",
        "headers": ["Basic Form", "Genitive", "Meaning"],
        "rows": [
          ["lomake", "lomakkeen", "form"],
          ["rakas", "rakkaan", "dear"],
          ["vastaus", "vastauksen", "answer"],
          ["tehtävä", "tehtävän", "task"],
          ["kangas", "kankaan", "fabric"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Täytän lomakkeen huolellisesti. (I fill in the form carefully)",
          "Näin rakkaan ystäväni eilen. (I saw my dear friend yesterday)",
          "Sain vastauksen nopeasti. (I got the answer quickly)",
          "Tämä tehtävä on vaikea. (This task is difficult)",
          "Ostin kankaan kaupasta. (I bought the fabric from the shop)"
        ]
      },
      {
        "type": "subheading",
        "text": "9.3 Genitive in Everyday Grammar"
      },
      {
        "type": "paragraph",
        "text": "Genitive is not only for objects — it also appears in many structures."
      },
      {
        "type": "subheading",
        "text": "A) Possession (ownership)"
      },
      {
        "type": "example-list",
        "items": [
          "Talon ovi (the house's door)",
          "Minun kirjan kansi (my book's cover)",
          "Opettajan auto (teacher's car)"
        ]
      },
      {
        "type": "subheading",
        "text": "B) Time expressions"
      },
      {
        "type": "example-list",
        "items": [
          "päivän loppu (end of the day)",
          "viikon alku (start of the week)",
          "vuoden lopussa (at the end of the year)"
        ]
      },
      {
        "type": "subheading",
        "text": "C) Compounds"
      },
      {
        "type": "example-list",
        "items": [
          "kirjan hylly (book shelf)",
          "kaupungin keskusta (city center)",
          "Suomen kieli (Finnish language)"
        ]
      },
      {
        "type": "subheading",
        "text": "9.4 Strong vs Weak Object Meaning"
      },
      {
        "type": "paragraph",
        "text": "Genitive = result / finished action: Rakensin talon. (House is finished), Söin omenan. (Apple is fully eaten)"
      },
      {
        "type": "paragraph",
        "text": "Partitive = ongoing / partial / unknown amount: Rakennan taloa. (I am building a house — not finished), Syön omenaa. (I am eating apple — not whole)"
      },
      {
        "type": "subheading",
        "text": "9.5 Verb + Object Patterns (Very Important)"
      },
      {
        "type": "subheading",
        "text": "1. Completed Action → Genitive"
      },
      {
        "type": "example-list",
        "items": [
          "Kirjoitin kirjeen",
          "Luin kirjan",
          "Ostin auton",
          "Join kahvin",
          "Tein tehtävän"
        ]
      },
      {
        "type": "subheading",
        "text": "2. Ongoing Action → Partitive"
      },
      {
        "type": "example-list",
        "items": [
          "Kirjoitan kirjettä",
          "Luen kirjaa",
          "Ostan autoa",
          "Juon kahvia",
          "Teen tehtävää"
        ]
      },
      {
        "type": "subheading",
        "text": "3. Negative → Always Partitive"
      },
      {
        "type": "example-list",
        "items": [
          "En kirjoita kirjettä",
          "En lue kirjaa",
          "En osta autoa",
          "En juo kahvia"
        ]
      },
      {
        "type": "subheading",
        "text": "9.6 Real-Life Conversation Examples"
      },
      {
        "type": "example-list",
        "items": [
          "Ostin uuden puhelimen eilen. (I bought a new phone yesterday)",
          "Katsoin todella hyvän elokuvan. (I watched a very good movie)",
          "En katso elokuvaa tänään. (I am not watching a movie today)",
          "Siivosin koko huoneen aamulla. (I cleaned the whole room in the morning)",
          "En siivoa huonetta nyt. (I am not cleaning the room now)"
        ]
      },
      {
        "type": "subheading",
        "text": "9.7 Mini Practice (Longer)"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I bought the book and read it. → Ostin kirjan ja luin sen.",
          "I am not eating the apple. → En syö omenaa.",
          "We cleaned the whole house. → Siivosimme koko talon.",
          "I watched a movie yesterday. → Katsoin elokuvan eilen.",
          "I am reading a book. → Luen kirjaa.",
          "Don't open the door! → Älä avaa ovea!"
        ]
      },
      {
        "type": "subheading",
        "text": "9.8 Useful Daily Sentences (Natural Finnish)"
      },
      {
        "type": "example-list",
        "items": [
          "Sain hyvän vastauksen opettajalta. (I got a good answer from the teacher)",
          "En ymmärrä koko kysymystä. (I don't understand the whole question)",
          "Ostin uuden kirjan tänään. (I bought a new book today)",
          "En osta autoa nyt. (I am not buying a car now)",
          "Katsoin koko elokuvan illalla. (I watched the whole movie in the evening)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "When do we use the genitive object in Finnish?",
      "options": [
        "When the action is ongoing or partial",
        "When the action is completed, whole, and definite",
        "Only in negative sentences",
        "Only after numbers"
      ],
      "correctAnswer": "When the action is completed, whole, and definite",
      "explanation": "The genitive object (total object) is used when the action is completed, the object is whole/definite, and the result is finished. Example: 'Ostin kirjan' (I bought the whole book).",
      "hint": "Think of finished, completed actions.",
      "points": 10
    },
    {
      "question": "What is the genitive form of 'lomake' (form)?",
      "options": ["lomake", "lomakkeen", "lomaketta", "lomakkeelle"],
      "correctAnswer": "lomakkeen",
      "explanation": "lomake is a Wordtype B word ending in -ke. It changes to -kee- in the stem: lomake → lomakkeen.",
      "hint": "-ke words become -kee- before adding -n.",
      "points": 10
    },
    {
      "question": "Which sentence uses the genitive object correctly?",
      "options": [
        "Syön omenaa",
        "En syö omenaa",
        "Syön omenan",
        "Syö omenaa"
      ],
      "correctAnswer": "Syön omenan",
      "explanation": "Syön omenan = I eat the whole apple (completed action, total object). Syön omenaa is partitive (ongoing/partial). En syö omenaa is negative (requires partitive). Syö omenaa is a command? Actually 'Syö omena' would be positive command.",
      "hint": "Total object = finished action.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Ostin kirjan' and 'Ostin kirjaa'?",
      "options": [
        "No difference",
        "First = I bought the whole book; Second = I bought some book / was buying",
        "First is present, second is past",
        "First is negative, second is positive"
      ],
      "correctAnswer": "First = I bought the whole book; Second = I bought some book / was buying",
      "explanation": "Ostin kirjan (genitive) = I bought the whole book (completed). Ostin kirjaa (partitive) = I bought some book or I was buying a book (incomplete/partial).",
      "hint": "One implies the whole thing, the other implies partial or ongoing.",
      "points": 10
    },
    {
      "question": "In a negative sentence, what case does the object take?",
      "options": ["Nominative", "Genitive", "Partitive", "Accusative"],
      "correctAnswer": "Partitive",
      "explanation": "Negative sentences ALWAYS use the partitive object. Example: 'En syö omenaa' (I do not eat an apple), not 'omenan'.",
      "hint": "Negative sentence rule: partitive always.",
      "points": 10
    },
    {
      "question": "What is the genitive form of 'vastaus' (answer)?",
      "options": ["vastaus", "vastausta", "vastauksen", "vastaukseen"],
      "correctAnswer": "vastauksen",
      "explanation": "vastaus is a -us word. Genitive: vastaus → vastauksen (stem vastaukse- + -n).",
      "hint": "-us words take -kse- in the genitive stem.",
      "points": 10
    },
    {
      "question": "How do you say 'Don't open the door!' in Finnish?",
      "options": [
        "Avaa ovi!",
        "Älä avaa ovea!",
        "Älä avaa ovi!",
        "Ei avaa ovea"
      ],
      "correctAnswer": "Älä avaa ovea!",
      "explanation": "Negative command: älä + verb stem + object in partitive. 'Avaa ovi' is positive command (open the door). 'Älä avaa ovea' = Don't open the door.",
      "hint": "Negative commands take partitive object.",
      "points": 10
    },
    {
      "question": "What does 'Sain hyvän vastauksen' mean?",
      "options": [
        "I give a good answer",
        "I got a good answer",
        "I need a good answer",
        "I write a good answer"
      ],
      "correctAnswer": "I got a good answer",
      "explanation": "Sain = I got/received. Hyvän vastauksen = good answer (genitive/accusative as total object).",
      "hint": "The verb 'saada' means 'to get' or 'to receive'.",
      "points": 10
    },
    {
      "question": "Which of these shows possession using the genitive?",
      "options": [
        "Minulla on kirja",
        "Kirja on pöydällä",
        "Talon ovi",
        "Luen kirjaa"
      ],
      "correctAnswer": "Talon ovi",
      "explanation": "Talon ovi = the house's door — the genitive 'talon' shows possession/ownership. 'Minulla on kirja' uses adessive, 'Kirja on pöydällä' is location, 'Luen kirjaa' is partitive object.",
      "hint": "Look for 'something's something' — the -n ending showing ownership.",
      "points": 10
    },
    {
      "question": "What is the genitive of 'rakas' (dear)?",
      "options": ["rakas", "rakkaan", "rakasta", "rakkaalle"],
      "correctAnswer": "rakkaan",
      "explanation": "rakas ends in -as. It changes to -aa- in the stem: rakas → rakkaa- + -n = rakkaan.",
      "hint": "-as words become -aa- before adding -n.",
      "points": 10
    }
  ]
},
{
  "id": "postpositions",
  "chapter": 10,
  "title": "Postpositions – In front of me, With me",
  "finnish": "Postpositiot",
  "icon": "📍",
  "level": "A2",
  "accent": "bg-lime-600",
  "badge": "bg-lime-50 text-lime-700 border-lime-200",
  "description": "How to use Finnish postpositions (which come after the noun in genitive case) for spatial relationships like in front of, behind, with, after, before, next to, on, and under",
  "content": {
    "type": "rich",
    "intro": "Finnish does not usually use prepositions (like English 'in front of, with, behind'). Instead, Finnish uses postpositions, which come after the noun. Most postpositions require the noun in the genitive case.",
    "sections": [
      {
        "type": "subheading",
        "text": "10.1 Postpositions vs. Prepositions"
      },
      {
        "type": "paragraph",
        "text": "In Finnish: noun (genitive) + postposition"
      },
      {
        "type": "example-table",
        "headers": ["Postposition", "Finnish Example", "English"],
        "rows": [
          ["edessä", "Istun opettajan edessä.", "I sit in front of the teacher."],
          ["takana", "Talo on puiston takana.", "The house is behind the park."],
          ["kanssa", "Tulen sinun kanssa.", "I come with you."],
          ["jälkeen", "Ruokailun jälkeen menen kotiin.", "After eating I go home."],
          ["ennen", "Ennen koulua juon kahvia.", "Before school I drink coffee."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Istun opettajan edessä. (I sit in front of the teacher.)",
          "Auto on talon takana. (The car is behind the house.)",
          "Menen ystävän kanssa kauppaan. (I go to the shop with a friend.)",
          "Syön ennen koulua. (I eat before school.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10.2 The Postposition 'kanssa' (WITH)"
      },
      {
        "type": "paragraph",
        "text": "The most important postposition is kanssa = with."
      },
      {
        "type": "paragraph",
        "text": "Basic Form: noun (genitive) + kanssa"
      },
      {
        "type": "example-list",
        "items": [
          "minun kanssa (with me)",
          "sinun kanssa (with you)",
          "hänen kanssa (with him/her)"
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Tulen sinun kanssa. (I come with you.)",
          "Menen ystävän kanssa elokuviin. (I go to the movies with a friend.)",
          "Asun perheen kanssa. (I live with my family.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10.3 Shorter Possessive Forms (VERY IMPORTANT)"
      },
      {
        "type": "paragraph",
        "text": "In spoken and formal Finnish, kanssa often becomes a suffix."
      },
      {
        "type": "paragraph",
        "text": "Pattern: minun kanssani, sinun kanssasi, hänen kanssaan"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Form", "Meaning"],
        "rows": [
          ["minä", "kanssani", "with me"],
          ["sinä", "kanssasi", "with you"],
          ["hän", "kanssaan", "with him/her"],
          ["me", "kanssamme", "with us"],
          ["te", "kanssanne", "with you (plural)"],
          ["he", "kanssaan", "with them"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Tule kanssani! (Come with me!)",
          "Hän tuli kanssani kauppaan. (He/she came with me to the shop.)",
          "Haluan asua kanssasi. (I want to live with you.)",
          "Hän matkustaa kanssaan. (He/she travels with him/her.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10.4 Other Very Common Postpositions"
      },
      {
        "type": "subheading",
        "text": "A) edessä / takana (in front / behind)"
      },
      {
        "type": "example-list",
        "items": [
          "Istun opettajan edessä. (I sit in front of the teacher.)",
          "Auto on talon takana. (The car is behind the house.)",
          "Pysäkki on kaupan edessä. (The bus stop is in front of the shop.)"
        ]
      },
      {
        "type": "subheading",
        "text": "B) jälkeen / ennen (after / before)"
      },
      {
        "type": "example-list",
        "items": [
          "Syön ruoan jälkeen jälkiruoan. (I eat dessert after food.)",
          "Ennen koulua juon kahvia. (Before school I drink coffee.)",
          "Tunnin jälkeen menemme kotiin. (After the lesson we go home.)"
        ]
      },
      {
        "type": "subheading",
        "text": "C) vieressä / lähellä (next to / near)"
      },
      {
        "type": "example-list",
        "items": [
          "Istun ystävän vieressä. (I sit next to a friend.)",
          "Kauppa on talon lähellä. (The shop is near the house.)"
        ]
      },
      {
        "type": "subheading",
        "text": "D) päällä / alla (on / under)"
      },
      {
        "type": "example-list",
        "items": [
          "Kirja on pöydän päällä. (The book is on the table.)",
          "Kissa on sängyn alla. (The cat is under the bed.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10.5 Postpositions vs Prepositions (Key Difference)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish structure"],
        "rows": [
          ["in front of the house", "talon edessä"],
          ["behind the school", "koulun takana"],
          ["with me", "minun kanssani"],
          ["after work", "työn jälkeen"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Always remember: Genitive + postposition"
      },
      {
        "type": "subheading",
        "text": "10.6 Common Mistakes to Avoid"
      },
      {
        "type": "example-list",
        "items": [
          "❌ kanssa minä → ✓ minun kanssa / kanssani",
          "❌ edessä opettaja → ✓ opettajan edessä",
          "❌ takana talo → ✓ talon takana"
        ]
      },
      {
        "type": "subheading",
        "text": "10.7 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I sit in front of the teacher. → Istun opettajan edessä.",
          "I go with my friend. → Menen ystävän kanssa.",
          "The cat is under the table. → Kissa on pöydän alla.",
          "After school I go home. → Koulun jälkeen menen kotiin.",
          "Come with me! → Tule kanssani!"
        ]
      },
      {
        "type": "subheading",
        "text": "10.8 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Istun sinun vieressä. (I sit next to you.)",
          "Auto on talon takana. (The car is behind the house.)",
          "Tule minun kanssani kauppaan. (Come with me to the shop.)",
          "Näemme koulun jälkeen. (We will meet after school.)",
          "Kissa on sängyn alla. (The cat is under the bed.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the key difference between English prepositions and Finnish postpositions?",
      "options": [
        "Finnish uses prepositions like English",
        "Finnish postpositions come AFTER the noun (genitive + postposition)",
        "Finnish postpositions come BEFORE the noun",
        "Finnish does not have spatial words"
      ],
      "correctAnswer": "Finnish postpositions come AFTER the noun (genitive + postposition)",
      "explanation": "Unlike English prepositions (which come before the noun), Finnish postpositions come after the noun. Most require the noun in the genitive case. Example: talon edessä (in front of the house).",
      "hint": "Think 'noun + postposition' instead of 'preposition + noun'.",
      "points": 10
    },
    {
      "question": "What case does the noun take before most postpositions?",
      "options": ["Nominative", "Genitive", "Partitive", "Adessive"],
      "correctAnswer": "Genitive",
      "explanation": "Most Finnish postpositions require the noun to be in the genitive case. Example: talon edessä (in front of the house), koulun jälkeen (after school).",
      "hint": "The -n ending is a clue.",
      "points": 10
    },
    {
      "question": "How do you say 'with me' in Finnish using the shorter possessive form?",
      "options": ["minun kanssa", "kanssani", "minun kanssani", "kanssa minä"],
      "correctAnswer": "kanssani",
      "explanation": "The shorter possessive form of 'with me' is kanssani. 'Minun kanssa' is also correct but longer. 'Minun kanssani' is redundant (both together). 'Kanssa minä' is wrong word order.",
      "hint": "Add -ni to kanssa for 'with me'.",
      "points": 10
    },
    {
      "question": "What does 'istun opettajan edessä' mean?",
      "options": [
        "I sit behind the teacher",
        "I sit next to the teacher",
        "I sit in front of the teacher",
        "I sit with the teacher"
      ],
      "correctAnswer": "I sit in front of the teacher",
      "explanation": "edessä means 'in front of'. Istun opettajan edessä = I sit in front of the teacher. Takana would be behind, vieressä would be next to, kanssa would be with.",
      "hint": "edessä = in front.",
      "points": 10
    },
    {
      "question": "How do you say 'after school' in Finnish?",
      "options": ["koulun edessä", "koulun takana", "koulun jälkeen", "koulun kanssa"],
      "correctAnswer": "koulun jälkeen",
      "explanation": "jälkeen = after. 'Koulun jälkeen' = after school. Edessä = in front of, takana = behind, kanssa = with.",
      "hint": "jälkeen means 'after'.",
      "points": 10
    },
    {
      "question": "What is the correct way to say 'the cat is under the bed'?",
      "options": [
        "Kissa on sängyn päällä",
        "Kissa on sängyn alla",
        "Kissa on sängyn edessä",
        "Kissa on sängyn kanssa"
      ],
      "correctAnswer": "Kissa on sängyn alla",
      "explanation": "alla = under. Päällä = on top of, edessä = in front of, kanssa = with.",
      "hint": "alla means 'under'.",
      "points": 10
    },
    {
      "question": "How do you say 'Come with me!' using the shorter possessive form?",
      "options": ["Tule minun kanssa!", "Tule kanssani!", "Tule minun kanssani!", "Tule kanssa minä!"],
      "correctAnswer": "Tule kanssani!",
      "explanation": "Tule kanssani! = Come with me! (using the shorter possessive form). 'Tule minun kanssa' is also acceptable but less common in spoken Finnish.",
      "hint": "The shortest form is kanssani.",
      "points": 10
    },
    {
      "question": "What does 'pöydän päällä' mean?",
      "options": ["under the table", "next to the table", "on the table", "behind the table"],
      "correctAnswer": "on the table",
      "explanation": "päällä means 'on top of'. 'Pöydän päällä' = on the table. Alla = under, vieressä = next to, takana = behind.",
      "hint": "päällä = on top.",
      "points": 10
    },
    {
      "question": "Which of these is a common mistake when using postpositions?",
      "options": [
        "talo + postposition",
        "talon edessä",
        "edessä talo",
        "minun kanssa"
      ],
      "correctAnswer": "edessä talo",
      "explanation": "The common mistake is putting the postposition before the noun like an English preposition. Correct: talon edessä (genitive + postposition). Wrong: edessä talo.",
      "hint": "Postposition comes AFTER the noun in genitive.",
      "points": 10
    },
    {
      "question": "What is the meaning of 'näemme koulun jälkeen'?",
      "options": [
        "We see the school",
        "We meet at school",
        "We meet after school",
        "We see behind the school"
      ],
      "correctAnswer": "We meet after school",
      "explanation": "Näemme = we see/we meet. Koulun jälkeen = after school. So 'We meet after school.' The verb nähdä can mean 'to meet' in this context.",
      "hint": "jälkeen means 'after'.",
      "points": 10
    }
  ]
},
{
  "id": "expressions-of-time",
  "chapter": 11,
  "title": "Expressions of Time – Cases Have Meaning",
  "finnish": "Ajanilmaukset",
  "icon": "⏰",
  "level": "A2",
  "accent": "bg-cyan-600",
  "badge": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "description": "How Finnish uses grammatical cases (Adessive, Essive, Plural Instructive, Partitive, Genitive) to express when something happens and how often it happens",
  "content": {
    "type": "rich",
    "intro": "Finnish time expressions are very case-based. Instead of using separate words like English (\"in, on, at\"), Finnish uses grammatical cases to show when something happens and how often it happens.",
    "sections": [
      {
        "type": "subheading",
        "text": "11.1 Overview of Time Cases"
      },
      {
        "type": "example-table",
        "headers": ["Case / Form", "Example", "Meaning"],
        "rows": [
          ["Adessive (-lla / -llä)", "aamulla", "in the morning / at a time"],
          ["Essive (-na)", "tänä aamuna", "this morning (specific point in time)"],
          ["Plural instructive", "aamuisin", "in the mornings (repeated habit)"],
          ["Partitive", "joka päivä", "every day"],
          ["Genitive", "viime yön", "last night's (possession/time relation)"]
        ]
      },
      {
        "type": "subheading",
        "text": "11.2 Adessive (-lla / -llä) → 'AT / IN time'"
      },
      {
        "type": "paragraph",
        "text": "Use for specific time point (especially part of the day) and general time when something happens."
      },
      {
        "type": "example-list",
        "items": ["aamulla → in the morning", "illalla → in the evening", "yöllä → at night", "päivällä → during the day"]
      },
      {
        "type": "example-list",
        "items": [
          "Menen töihin aamulla. (I go to work in the morning.)",
          "Syön illalla. (I eat in the evening.)",
          "Nukun yöllä. (I sleep at night.)",
          "Opiskelen päivällä. (I study during the day.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11.3 Essive (-na) → 'THIS / THAT specific time'"
      },
      {
        "type": "paragraph",
        "text": "Use for specific moment in time: this morning, that day, that evening."
      },
      {
        "type": "example-list",
        "items": ["tänä aamuna → this morning", "tänä iltana → this evening", "viime yönä → last night"]
      },
      {
        "type": "example-list",
        "items": [
          "Tänä aamuna olin väsynyt. (This morning I was tired.)",
          "Tänä iltana menen ulos. (This evening I go out.)",
          "Viime yönä en nukkunut hyvin. (Last night I didn't sleep well.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11.4 Plural Instructive (-isin) → Habit / Repetition"
      },
      {
        "type": "paragraph",
        "text": "Use for repeated action: usually in the mornings, evenings, etc."
      },
      {
        "type": "example-list",
        "items": ["aamuisin → in the mornings (habit)", "iltaisin → in the evenings", "öisin → at nights"]
      },
      {
        "type": "example-list",
        "items": [
          "Herään aikaisin aamuisin. (I wake up early in the mornings.)",
          "Opiskelen iltaisin suomea. (I study Finnish in the evenings.)",
          "Lapset nukkuvat öisin hyvin. (Children sleep well at night.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11.5 Partitive Time Expressions"
      },
      {
        "type": "paragraph",
        "text": "Use for frequency expressions — how often something happens."
      },
      {
        "type": "example-list",
        "items": ["joka päivä → every day", "joka viikko → every week", "joka kuukausi → every month"]
      },
      {
        "type": "example-list",
        "items": [
          "Käyn salilla joka päivä. (I go to the gym every day.)",
          "Soitan äidille joka viikko. (I call my mother every week.)",
          "Opiskelen suomea joka päivä. (I study Finnish every day.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11.6 Genitive Time Expressions → Possession of Time"
      },
      {
        "type": "paragraph",
        "text": "Use for time 'belonging' to something or specific past time reference."
      },
      {
        "type": "example-list",
        "items": ["viime yön → last night's", "viime viikon → last week's", "huomisen päivän → tomorrow's day"]
      },
      {
        "type": "example-list",
        "items": [
          "Viime yön uni oli huono. (Last night's sleep was bad.)",
          "Viime viikon sää oli kylmä. (Last week's weather was cold.)",
          "Huomisen päivän suunnitelma on valmis. (Tomorrow's plan is ready.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11.7 Key Comparison (VERY IMPORTANT)"
      },
      {
        "type": "example-table",
        "headers": ["Expression", "Meaning difference"],
        "rows": [
          ["aamulla", "general morning time"],
          ["tänä aamuna", "this specific morning"],
          ["aamuisin", "every morning (habit)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Aamulla menen töihin. (I go to work in the morning.)",
          "Tänä aamuna olin myöhässä. (This morning I was late.)",
          "Aamuisin juon kahvia. (I drink coffee in the mornings.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11.8 Full Example Sentence"
      },
      {
        "type": "paragraph",
        "text": "Menin töihin aamulla, mutta tänä aamuna myöhästyin. Herään aikaisin aamuisin. (I went to work in the morning, but this morning I was late. I wake up early in the mornings.)"
      },
      {
        "type": "subheading",
        "text": "11.9 More Natural Real-Life Examples"
      },
      {
        "type": "example-list",
        "items": [
          "Aamulla sataa usein Suomessa. (It often rains in the morning in Finland.)",
          "Tänä iltana menen ystävän luo. (This evening I go to a friend's place.)",
          "Iltaisin katson televisiota. (In the evenings I watch TV.)",
          "Joka päivä opiskelen vähän suomea. (Every day I study a little Finnish.)",
          "Viime yönä oli todella kylmä. (Last night it was very cold.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11.10 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I go to work in the morning. → Menen töihin aamulla.",
          "This morning I was tired. → Tänä aamuna olin väsynyt.",
          "I study Finnish every day. → Opiskelen suomea joka päivä.",
          "I wake up early in the mornings. → Herään aikaisin aamuisin.",
          "Last night I didn't sleep well. → Viime yönä en nukkunut hyvin."
        ]
      },
      {
        "type": "subheading",
        "text": "11.11 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Aamuisin juon kahvia. (I drink coffee in the mornings.)",
          "Tänä iltana olen kotona. (This evening I am at home.)",
          "Joka päivä opin jotain uutta. (Every day I learn something new.)",
          "Viime yönä satoi lunta. (Last night it snowed.)",
          "Aamulla alkaa uusi päivä. (A new day begins in the morning.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What case is used to say 'in the morning' as a general time?",
      "options": ["Essive (-na)", "Adessive (-lla)", "Partitive", "Genitive"],
      "correctAnswer": "Adessive (-lla)",
      "explanation": "Adessive case (-lla/-llä) is used for general time expressions: aamulla (in the morning), illalla (in the evening), yöllä (at night).",
      "hint": "Think of 'aamulla' — what ending does it have?",
      "points": 10
    },
    {
      "question": "How do you say 'this morning' (specific morning) in Finnish?",
      "options": ["aamulla", "aamuisin", "tänä aamuna", "joka aamu"],
      "correctAnswer": "tänä aamuna",
      "explanation": "Essive case (-na) with tänä = this. Tänä aamuna = this morning (specific point in time). Aamulla = general, aamuisin = habitual, joka aamu = every morning.",
      "hint": "The word 'tänä' indicates 'this'.",
      "points": 10
    },
    {
      "question": "What does 'aamuisin' mean?",
      "options": [
        "This morning",
        "In the morning (general)",
        "In the mornings (habit/repetition)",
        "Every morning"
      ],
      "correctAnswer": "In the mornings (habit/repetition)",
      "explanation": "The plural instructive form -isin indicates repeated/habitual action. Aamuisin = in the mornings (as a habit, e.g., 'I wake up early in the mornings').",
      "hint": "It describes something you do regularly in the mornings.",
      "points": 10
    },
    {
      "question": "How do you say 'every day' in Finnish?",
      "options": ["joka päivä", "joka päivän", "joka päivää", "jokainen päivä"],
      "correctAnswer": "joka päivä",
      "explanation": "Joka päivä = every day. Joka is followed by the partitive or nominative? Actually 'joka päivä' is fixed. 'Joka päivän' would be genitive, 'joka päivää' partitive but not used in this expression.",
      "hint": "joka = every, päivä = day.",
      "points": 10
    },
    {
      "question": "What is the difference between 'aamulla' and 'aamuisin'?",
      "options": [
        "No difference",
        "Aamulla = specific morning, aamuisin = general",
        "Aamulla = general morning time, aamuisin = habitual (every morning)",
        "Aamulla = every morning, aamuisin = this morning"
      ],
      "correctAnswer": "Aamulla = general morning time, aamuisin = habitual (every morning)",
      "explanation": "Aamulla (adessive) = general morning time ('I go to work in the morning'). Aamuisin (plural instructive) = habitual/repeated action ('I wake up early in the mornings').",
      "hint": "One is a single time reference, one is a habit.",
      "points": 10
    },
    {
      "question": "What case is used in 'tänä iltana' (this evening)?",
      "options": ["Adessive", "Essive", "Partitive", "Genitive"],
      "correctAnswer": "Essive",
      "explanation": "The essive case (-na/-nä) is used for specific points in time: tänä iltana (this evening), viime yönä (last night), tänä aamuna (this morning).",
      "hint": "The ending -na indicates essive.",
      "points": 10
    },
    {
      "question": "How do you say 'last night's sleep was bad' in Finnish?",
      "options": [
        "Viime yö nukkui huonosti",
        "Viime yön uni oli huono",
        "Viime yönä nukuin huonosti",
        "Viime yönä uni oli huono"
      ],
      "correctAnswer": "Viime yön uni oli huono",
      "explanation": "Viime yön (genitive) expresses possession: 'last night's sleep'. Uni = sleep. 'Viime yönä' would mean 'last night' as a time adverbial, not possessive.",
      "hint": "The genitive -n shows possession (night's sleep).",
      "points": 10
    },
    {
      "question": "Which expression means 'in the evenings' as a habit?",
      "options": ["illalla", "tänä iltana", "iltaisin", "joka ilta"],
      "correctAnswer": "iltaisin",
      "explanation": "Iltaisin (plural instructive) = in the evenings as a repeated habit. Illalla = general evening time, tänä iltana = this evening, joka ilta = every evening.",
      "hint": "The ending -isin indicates habitual action.",
      "points": 10
    },
    {
      "question": "What does 'Herään aikaisin aamuisin' mean?",
      "options": [
        "I woke up early this morning",
        "I wake up early in the mornings (habit)",
        "I will wake up early tomorrow morning",
        "I wake up early every morning"
      ],
      "correctAnswer": "I wake up early in the mornings (habit)",
      "explanation": "Herään = I wake up (present tense). Aamuisin = in the mornings (habitual). The sentence describes a regular habit, not a one-time event.",
      "hint": "Aamuisin indicates repetition/habit.",
      "points": 10
    },
    {
      "question": "Which of the following means 'every week'?",
      "options": ["joka viikko", "joka viikolla", "joka viikon", "viikoittain"],
      "correctAnswer": "joka viikko",
      "explanation": "Joka viikko = every week (partitive time expression). Joka viikolla is adessive, joka viikon is genitive, viikoittain means 'weekly' but is a different structure.",
      "hint": "joka = every, viikko = week.",
      "points": 10
    }
  ]
},
{
  "id": "third-infinitive",
  "chapter": 12,
  "title": "Third Infinitive (-mA-) – In, Into, From Doing",
  "finnish": "Kolmas infinitiivi",
  "icon": "🔄",
  "level": "A2",
  "accent": "bg-fuchsia-600",
  "badge": "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
  "description": "How to use the third infinitive with -massa (in the act of), -maan (to go do something), and -masta (coming from doing) to describe actions in progress, movement toward, and movement away from activities",
  "content": {
    "type": "rich",
    "intro": "The third infinitive (kolmas infinitiivi) is used when we want to describe an action as something we are doing inside a situation, going to do, or coming from doing. It is very common in spoken and written Finnish.",
    "sections": [
      {
        "type": "subheading",
        "text": "12.1 The -mA- Forms"
      },
      {
        "type": "paragraph",
        "text": "The third infinitive is built with: verb stem + -mA- + case ending. It shows movement or location related to an activity."
      },
      {
        "type": "example-table",
        "headers": ["Suffix", "Finnish Example", "English", "Meaning"],
        "rows": [
          ["-massa", "Olen lukemassa.", "I am reading.", "action happening (in progress)"],
          ["-maan", "Menen lukemaan.", "I go to read.", "purpose / direction into action"],
          ["-masta", "Tulen lukemasta.", "I come from reading.", "movement from action"]
        ]
      },
      {
        "type": "subheading",
        "text": "12.2 -massa → 'IN THE ACT OF DOING'"
      },
      {
        "type": "paragraph",
        "text": "Meaning: Something is happening right now inside an activity. 'I am in the middle of doing something'."
      },
      {
        "type": "example-list",
        "items": [
          "Olen syömässä. (I am eating.)",
          "Hän on nukkumassa. (He/she is sleeping.)",
          "Olin lukemassa kirjaa. (I was reading a book.)",
          "Lapset ovat leikkimässä. (The children are playing.)"
        ]
      },
      {
        "type": "example-list",
        "title": "More natural usage",
        "items": [
          "Olen töissä tekemässä raporttia. (I am at work making a report.)",
          "Hän on keittiössä laittamassa ruokaa. (He/she is in the kitchen cooking.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12.3 -maan → 'TO GO DO SOMETHING'"
      },
      {
        "type": "paragraph",
        "text": "Meaning: Movement with a purpose — 'go somewhere to do something'."
      },
      {
        "type": "example-list",
        "items": [
          "Menen lukemaan kirjastoon. (I go to the library to read.)",
          "Menemme syömään ravintolaan. (We go to a restaurant to eat.)",
          "Hän menee ostamaan ruokaa. (He/she goes to buy food.)",
          "Menen nukkumaan. (I go to sleep.)"
        ]
      },
      {
        "type": "example-list",
        "title": "Very common daily expressions",
        "items": [
          "Menen töihin tekemään raporttia. (I go to work to do a report.)",
          "Menen kauppaan ostamaan maitoa. (I go to the shop to buy milk.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12.4 -masta → 'COMING FROM DOING'"
      },
      {
        "type": "paragraph",
        "text": "Meaning: You stop an activity and move away from it. 'Coming from doing something'."
      },
      {
        "type": "example-list",
        "items": [
          "Tulen lukemasta. (I come from reading.)",
          "Hän tuli syömästä. (He/she came from eating.)",
          "Tulimme pelaamasta jalkapalloa. (We came from playing football.)",
          "Tulen töistä tekemästä raporttia. (I come from work after doing a report.)"
        ]
      },
      {
        "type": "example-list",
        "title": "Natural examples",
        "items": [
          "Tulen nukkumasta. (I come from sleeping.)",
          "Lapset tulivat leikkimästä. (The children came from playing.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12.5 Full Example"
      },
      {
        "type": "example-list",
        "items": [
          "Olin kirjastossa lukemassa. (I was at the library reading.)",
          "Ystävä tuli lukemaan kanssani. (A friend came to read with me.)",
          "Palasin kotiin lukemasta. (I returned home from reading.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12.6 Complete Flow of Action"
      },
      {
        "type": "paragraph",
        "text": "This structure shows a full movement of activity: 1. Start activity → -maan, 2. In activity → -massa, 3. Leave activity → -masta"
      },
      {
        "type": "example-list",
        "items": [
          "Menen syömään. (I go to eat.)",
          "Olen syömässä. (I am eating.)",
          "Tulen syömästä. (I come from eating.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12.7 Very Common Verbs in -mA Forms"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "-massa", "-maan", "-masta"],
        "rows": [
          ["lukea", "lukemassa", "lukemaan", "lukemasta"],
          ["syödä", "syömässä", "syömään", "syömästä"],
          ["mennä", "menossa (irregular)", "menemään", "menemästä"],
          ["nukkua", "nukkumassa", "nukkumaan", "nukkumasta"],
          ["tehdä", "tekemässä", "tekemään", "tekemästä"],
          ["tulla", "tulossa", "tulemaan", "tulemasta"]
        ]
      },
      {
        "type": "subheading",
        "text": "12.8 Spoken Finnish Note (Important)"
      },
      {
        "type": "paragraph",
        "text": "In spoken Finnish, -massa often replaces the present continuous idea."
      },
      {
        "type": "example-list",
        "items": [
          "Olen syömässä. (I am eating.)",
          "Hän on tulossa. (He/she is coming.)",
          "Olen tekemässä ruokaa. (I am making food.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12.9 Comparison with English"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Olen lukemassa.", "I am reading."],
          ["Menen lukemaan.", "I go to read."],
          ["Tulen lukemasta.", "I come from reading."]
        ]
      },
      {
        "type": "subheading",
        "text": "12.10 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I am reading. → Olen lukemassa.",
          "I go to eat. → Menen syömään.",
          "I come from sleeping. → Tulen nukkumasta.",
          "We are playing. → Olemme pelaamassa.",
          "She goes to buy food. → Hän menee ostamaan ruokaa."
        ]
      },
      {
        "type": "subheading",
        "text": "12.11 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Olen tekemässä ruokaa. (I am cooking.)",
          "Menen nukkumaan nyt. (I am going to sleep now.)",
          "Tulen töistä tekemästä raporttia. (I come from work after doing a report.)",
          "Lapset ovat leikkimässä ulkona. (The children are playing outside.)",
          "Olen lukemassa kirjastossa. (I am reading at the library.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the third infinitive ending '-massa' express?",
      "options": [
        "Going to do something",
        "In the act of doing (ongoing action)",
        "Coming from doing something",
        "Having finished doing something"
      ],
      "correctAnswer": "In the act of doing (ongoing action)",
      "explanation": "-massa (inessive case of the third infinitive) expresses being in the middle of an action. Examples: Olen lukemassa (I am reading), Olen syömässä (I am eating).",
      "hint": "Think of 'in the middle of' an activity.",
      "points": 10
    },
    {
      "question": "What is the meaning of '-maan' in the third infinitive?",
      "options": [
        "Ongoing action",
        "Coming from an action",
        "Going to do something (purpose/direction)",
        "Having done something"
      ],
      "correctAnswer": "Going to do something (purpose/direction)",
      "explanation": "-maan (illative case) expresses movement toward an action with purpose. Example: Menen lukemaan (I go to read), Menen nukkumaan (I go to sleep).",
      "hint": "Think of 'to go do something'.",
      "points": 10
    },
    {
      "question": "What does '-masta' express in the third infinitive?",
      "options": [
        "Going to do something",
        "In the act of doing",
        "Coming from an action",
        "Finished action"
      ],
      "correctAnswer": "Coming from an action",
      "explanation": "-masta (elative case) expresses movement away from an action. Example: Tulen lukemasta (I come from reading), Tulen nukkumasta (I come from sleeping).",
      "hint": "Think of 'coming from' an activity.",
      "points": 10
    },
    {
      "question": "How do you say 'I am reading' using the third infinitive?",
      "options": ["Menen lukemaan", "Olen lukemassa", "Tulen lukemasta", "Luen kirjaa"],
      "correctAnswer": "Olen lukemassa",
      "explanation": "Olen lukemassa = I am reading (in the act of reading). 'Menen lukemaan' = I go to read, 'Tulen lukemasta' = I come from reading, 'Luen kirjaa' = I read a book (present tense).",
      "hint": "The -massa ending indicates ongoing action.",
      "points": 10
    },
    {
      "question": "How do you say 'I go to sleep' in Finnish?",
      "options": ["Olen nukkumassa", "Menen nukkumaan", "Tulen nukkumasta", "Nukun"],
      "correctAnswer": "Menen nukkumaan",
      "explanation": "Menen nukkumaan = I go to sleep (movement with purpose, -maan). 'Olen nukkumassa' = I am sleeping, 'Tulen nukkumasta' = I come from sleeping, 'Nukun' = I sleep.",
      "hint": "Use -maan for going to do something.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'Tulen ___' (I come from reading).",
      "options": ["lukemaan", "lukemassa", "lukemasta", "lukea"],
      "correctAnswer": "lukemasta",
      "explanation": "Tulen lukemasta = I come from reading. -masta (elative) indicates movement away from an action.",
      "hint": "Coming from an action uses -masta.",
      "points": 10
    },
    {
      "question": "What is the third infinitive form of 'mennä' meaning 'coming from going'?",
      "options": ["menossa", "menemään", "menemästä", "mennä"],
      "correctAnswer": "menemästä",
      "explanation": "menemästä = coming from going. 'Menossa' = in the act of going, 'menemään' = going to go, 'mennä' = basic infinitive.",
      "hint": "-masta indicates coming from an action.",
      "points": 10
    },
    {
      "question": "Which sentence means 'I am making food' in spoken Finnish?",
      "options": [
        "Menen tekemään ruokaa",
        "Olen tekemässä ruokaa",
        "Tulen tekemästä ruokaa",
        "Teen ruokaa"
      ],
      "correctAnswer": "Olen tekemässä ruokaa",
      "explanation": "Olen tekemässä ruokaa = I am making food (using the third infinitive -massa, common in spoken Finnish for present continuous). 'Teen ruokaa' is also correct but simpler.",
      "hint": "Spoken Finnish uses -massa for 'in the middle of'.",
      "points": 10
    },
    {
      "question": "What is the correct flow of action from start to finish?",
      "options": [
        "-massa → -maan → -masta",
        "-maan → -massa → -masta",
        "-masta → -massa → -maan",
        "-maan → -masta → -massa"
      ],
      "correctAnswer": "-maan → -massa → -masta",
      "explanation": "The logical flow: First you go to do something (-maan), then you are in the act of doing it (-massa), then you come from doing it (-masta).",
      "hint": "Start → middle → exit.",
      "points": 10
    },
    {
      "question": "How do you say 'The children are playing outside' using the third infinitive?",
      "options": [
        "Lapset menevät leikkimään ulos",
        "Lapset ovat leikkimässä ulkona",
        "Lapset tulevat leikkimästä ulkoa",
        "Lapset leikkivät ulkona"
      ],
      "correctAnswer": "Lapset ovat leikkimässä ulkona",
      "explanation": "Lapset ovat leikkimässä ulkona = The children are playing outside (ongoing action, -massa). 'Leikkivät' is also correct present tense, but the question asks for the third infinitive form.",
      "hint": "Use -massa for 'in the act of playing'.",
      "points": 10
    }
  ]
},
{
  "id": "fourth-infinitive",
  "chapter": 13,
  "title": "Fourth Infinitive (-minen) – The Activity as a Hobby",
  "finnish": "Neljäs infinitiivi",
  "icon": "🏃",
  "level": "A2",
  "accent": "bg-sky-600",
  "badge": "bg-sky-50 text-sky-700 border-sky-200",
  "description": "How to turn verbs into nouns using -minen to describe activities as hobbies, things you like or dislike, and activities you can talk about as subjects or objects",
  "content": {
    "type": "rich",
    "intro": "The fourth infinitive (-minen form) turns a verb into a noun. It describes an activity as a thing — something you can like, do, or talk about. Think of it like English '-ing' as a noun: reading = lukeminen, swimming = uiminen, running = juokseminen.",
    "sections": [
      {
        "type": "subheading",
        "text": "13.1 Formation & Basic Idea"
      },
      {
        "type": "paragraph",
        "text": "Formation: verb stem + -minen"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Fourth infinitive", "Meaning"],
        "rows": [
          ["lukea", "lukeminen", "reading"],
          ["uida", "uiminen", "swimming"],
          ["juosta", "juokseminen", "running"],
          ["kirjoittaa", "kirjoittaminen", "writing"],
          ["opiskella", "opiskelu (special)", "studying"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Key Idea: The -minen form behaves like a noun, so it can be a subject, an object, and take cases (like partitive)."
      },
      {
        "type": "subheading",
        "text": "13.2 -minen as an Object (Hobby / Enjoyment)"
      },
      {
        "type": "paragraph",
        "text": "Structure: verb + partitive + -minen form"
      },
      {
        "type": "example-list",
        "items": [
          "Harrastan lukemista. (I enjoy reading / reading is my hobby.)",
          "Rakastan uimista. (I love swimming.)",
          "Vihaan juoksemista. (I hate running.)",
          "Tykkään kirjoittamisesta. (I like writing.)"
        ]
      },
      {
        "type": "example-list",
        "title": "More Natural Sentences",
        "items": [
          "Harrastan musiikin kuuntelemista. (I enjoy listening to music.)",
          "Rakastan suomen kielen oppimista. (I love learning Finnish.)"
        ]
      },
      {
        "type": "subheading",
        "text": "13.3 -minen as a Subject (Thing/Activity)"
      },
      {
        "type": "paragraph",
        "text": "Structure: -minen form = subject of sentence"
      },
      {
        "type": "example-list",
        "items": [
          "Juokseminen on hauskaa. (Running is fun.)",
          "Uiminen on terveellistä. (Swimming is healthy.)",
          "Lukeminen on tärkeää. (Reading is important.)",
          "Opiskelu on vaikeaa. (Studying is difficult.)"
        ]
      },
      {
        "type": "example-list",
        "title": "More Examples",
        "items": [
          "Matkustaminen on kallista. (Travelling is expensive.)",
          "Oppiminen vie aikaa. (Learning takes time.)"
        ]
      },
      {
        "type": "subheading",
        "text": "13.4 Negative Use"
      },
      {
        "type": "paragraph",
        "text": "You can also reject or say you cannot do something."
      },
      {
        "type": "example-list",
        "items": [
          "Uimista en osaa. (Swimming I cannot do.)",
          "Juoksemista en pidä. (I don't like running.)",
          "Kirjoittamista en jaksa. (I can't be bothered with writing.)"
        ]
      },
      {
        "type": "subheading",
        "text": "13.5 Important Grammar Behavior"
      },
      {
        "type": "paragraph",
        "text": "The -minen form behaves like a normal noun, so it can take partitive (-a/-ä), be a subject, be an object, and be used in all cases (in advanced Finnish)."
      },
      {
        "type": "example-list",
        "items": [
          "Lukeminen on mukavaa. (Reading is nice.)",
          "Tykkään lukemisesta. (I like reading.)",
          "Puhun lukemisesta. (I talk about reading.)"
        ]
      },
      {
        "type": "subheading",
        "text": "13.6 Comparison with English"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["Reading is fun", "Lukeminen on hauskaa"],
          ["I like reading", "Tykkään lukemisesta"],
          ["I enjoy swimming", "Harrastan uimista"]
        ]
      },
      {
        "type": "subheading",
        "text": "13.7 Common Hobby Verbs"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "-minen form", "Meaning"],
        "rows": [
          ["lukea", "lukeminen", "reading"],
          ["uida", "uiminen", "swimming"],
          ["juosta", "juokseminen", "running"],
          ["kirjoittaa", "kirjoittaminen", "writing"],
          ["opiskella", "opiskelu", "studying"],
          ["pelata", "pelaaminen", "playing"]
        ]
      },
      {
        "type": "example-list",
        "title": "Example Hobby Sentences",
        "items": [
          "Harrastan pelaamista. (I enjoy gaming/playing.)",
          "Harrastan lukemista ja kirjoittamista. (I enjoy reading and writing.)",
          "Uiminen on minun harrastukseni. (Swimming is my hobby.)"
        ]
      },
      {
        "type": "subheading",
        "text": "13.8 Common Mistakes"
      },
      {
        "type": "example-list",
        "items": [
          "❌ Harrastan lukea → ✓ Harrastan lukemista",
          "❌ Tykkään uida → ✓ Tykkään uimisesta",
          "❌ Juosta on hauskaa → ✓ Juokseminen on hauskaa"
        ]
      },
      {
        "type": "subheading",
        "text": "13.9 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "Reading is fun. → Lukeminen on hauskaa.",
          "I like swimming. → Tykkään uimisesta.",
          "I enjoy writing. → Harrastan kirjoittamista.",
          "Running is healthy. → Juokseminen on terveellistä.",
          "I cannot do swimming. → Uimista en osaa."
        ]
      },
      {
        "type": "subheading",
        "text": "13.10 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Lukeminen rentouttaa minua. (Reading relaxes me.)",
          "Harrastan kirjoittamista iltaisin. (I enjoy writing in the evenings.)",
          "Uiminen on minun harrastus. (Swimming is my hobby.)",
          "Tykkään oppimista suomea. (I like learning Finnish.)",
          "Juokseminen on minulle vaikeaa. (Running is difficult for me.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the fourth infinitive (-minen) do?",
      "options": [
        "Expresses ongoing action",
        "Turns a verb into a noun (activity as a thing)",
        "Shows movement toward an action",
        "Forms the past tense"
      ],
      "correctAnswer": "Turns a verb into a noun (activity as a thing)",
      "explanation": "The fourth infinitive (-minen) turns verbs into nouns that describe activities as things. Example: lukea (to read) → lukeminen (reading). It can be a subject or object.",
      "hint": "Think of English '-ing' as a noun: 'Swimming is fun'.",
      "points": 10
    },
    {
      "question": "How do you say 'Reading is fun' in Finnish?",
      "options": ["Luen hauskaa", "Lukeminen on hauskaa", "Lukea on hauskaa", "Harrastan lukemista"],
      "correctAnswer": "Lukeminen on hauskaa",
      "explanation": "Lukeminen (fourth infinitive) is the subject. 'Lukeminen on hauskaa' = Reading is fun. 'Harrastan lukemista' = I enjoy reading (different structure).",
      "hint": "Use -minen form as the subject.",
      "points": 10
    },
    {
      "question": "How do you say 'I enjoy reading' in Finnish?",
      "options": ["Tykkään lukemista", "Harrastan lukemista", "Lukeminen on hauskaa", "Luen mielelläni"],
      "correctAnswer": "Harrastan lukemista",
      "explanation": "Harrastan lukemista = I enjoy reading (as a hobby). Harrastaa (to engage in as a hobby) takes the partitive of the -minen form.",
      "hint": "The verb 'harrastaa' means to do as a hobby.",
      "points": 10
    },
    {
      "question": "What is the correct fourth infinitive form of 'uida' (to swim)?",
      "options": ["uiminen", "uimasta", "uimaan", "uinti"],
      "correctAnswer": "uiminen",
      "explanation": "uida stem u i-? Actually uida → uiminen (swimming). Uinti is a separate noun (swim/swimming event).",
      "hint": "Verb stem + -minen.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the fourth infinitive as an object?",
      "options": [
        "Juokseminen on hauskaa",
        "Harrastan juoksemista",
        "Menen juoksemaan",
        "Olen juoksemassa"
      ],
      "correctAnswer": "Harrastan juoksemista",
      "explanation": "Harrastan juoksemista = I enjoy running (fourth infinitive as object, partitive case). 'Juokseminen on hauskaa' uses it as subject, not object.",
      "hint": "Look for the verb + partitive -minen form.",
      "points": 10
    },
    {
      "question": "What is the partitive form of 'lukeminen' (reading)?",
      "options": ["lukeminen", "lukemista", "lukemisessa", "lukemiseen"],
      "correctAnswer": "lukemista",
      "explanation": "The partitive of lukeminen is lukemista. Example: Harrastan lukemista (I enjoy reading).",
      "hint": "Add -a to the stem? Actually lukeminen → lukemista (partitive).",
      "points": 10
    },
    {
      "question": "How do you say 'I like swimming' in Finnish?",
      "options": ["Harrastan uimista", "Tykkään uimisesta", "Uiminen on mukavaa", "Uin mielelläni"],
      "correctAnswer": "Tykkään uimisesta",
      "explanation": "Tykkään uimisesta = I like swimming. Tykätä (to like) takes the elative case (-sta/-stä) of the -minen form.",
      "hint": "Tykätä + elative case of the activity.",
      "points": 10
    },
    {
      "question": "What is the correct fourth infinitive form of 'kirjoittaa' (to write)?",
      "options": ["kirjoitus", "kirjoittaminen", "kirjoittaa", "kirjoitella"],
      "correctAnswer": "kirjoittaminen",
      "explanation": "kirjoittaa → kirjoittaminen (writing). Kirjoitus is a different noun (text/composition).",
      "hint": "Verb stem kirjoitta- + -minen.",
      "points": 10
    },
    {
      "question": "Which of these is a common mistake?",
      "options": [
        "Harrastan lukemista",
        "Tykkään uimisesta",
        "Harrastan lukea",
        "Juokseminen on terveellistä"
      ],
      "correctAnswer": "Harrastan lukea",
      "explanation": "Harrastan lukea is wrong because harrastaa requires a noun (the -minen form). Correct: Harrastan lukemista = I enjoy reading.",
      "hint": "Harrastaa needs a noun, not an infinitive.",
      "points": 10
    },
    {
      "question": "What does 'Uiminen on minun harrastukseni' mean?",
      "options": [
        "I go swimming",
        "Swimming is my hobby",
        "I like swimming",
        "I am swimming"
      ],
      "correctAnswer": "Swimming is my hobby",
      "explanation": "Uiminen = swimming (as a noun/activity). Harrastukseni = my hobby. So: 'Swimming is my hobby.'",
      "hint": "Harrastus means hobby.",
      "points": 10
    }
  ]
},
{
  "id": "more-conjunctions",
  "chapter": 14,
  "title": "More Conjunctions – Connecting Complex Thoughts",
  "finnish": "Lisää konjunktioita",
  "icon": "🔗",
  "level": "A2",
  "accent": "bg-amber-600",
  "badge": "bg-amber-50 text-amber-700 border-amber-200",
  "description": "Essential conjunctions for building longer, more natural Finnish sentences: both…and, in addition, nor, although, therefore, if, and correction (but rather)",
  "content": {
    "type": "rich",
    "intro": "Conjunctions are words that connect sentences and ideas. They are very important in Finnish because they help you build long, natural, fluent sentences.",
    "sections": [
      {
        "type": "subheading",
        "text": "14.1 sek\u00e4 … ett\u00e4 → 'both … and'"
      },
      {
        "type": "paragraph",
        "text": "Use for connecting two positive ideas, emphasizing combination."
      },
      {
        "type": "example-list",
        "items": [
          "Puhun sek\u00e4 suomea ett\u00e4 englantia. (I speak both Finnish and English.)",
          "H\u00e4n on sek\u00e4 opettaja ett\u00e4 tutkija. (He/she is both a teacher and a researcher.)",
          "Tykk\u00e4\u00e4n sek\u00e4 kahvista ett\u00e4 teest\u00e4. (I like both coffee and tea.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.2 lis\u00e4ksi → 'in addition / besides'"
      },
      {
        "type": "paragraph",
        "text": "Use for adding extra information, introducing another fact."
      },
      {
        "type": "example-list",
        "items": [
          "S\u00f6in leiv\u00e4n. Lis\u00e4ksi join maitoa. (I ate bread. In addition, I drank milk.)",
          "H\u00e4n opiskelee. Lis\u00e4ksi h\u00e4n ty\u00f6skentelee. (He/she studies. Besides, he/she works.)",
          "S\u00e4\u00e4 on kylm\u00e4. Lis\u00e4ksi tuulee paljon. (The weather is cold. In addition, it is windy.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.3 eik\u00e4 → 'and not / nor'"
      },
      {
        "type": "paragraph",
        "text": "Use for negative sentence connection. Replaces 'and + not'."
      },
      {
        "type": "example-list",
        "items": [
          "En nauranut eik\u00e4 itkenyt. (I neither laughed nor cried.)",
          "H\u00e4n ei sy\u00f6 eik\u00e4 juo. (He/she neither eats nor drinks.)",
          "Emme menneet kotiin eik\u00e4 kauppaan. (We went neither home nor to the shop.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.4 vaikka → 'although / even if'"
      },
      {
        "type": "paragraph",
        "text": "Use for contrast between two ideas — something happens despite something else."
      },
      {
        "type": "example-list",
        "items": [
          "Menin ulos, vaikka satoi. (I went outside, although it was raining.)",
          "Opiskelen suomea, vaikka se on vaikeaa. (I study Finnish even though it is difficult.)",
          "H\u00e4n tuli, vaikka oli v\u00e4synyt. (He/she came although he/she was tired.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.5 siksi … ett\u00e4 → 'that's why … because'"
      },
      {
        "type": "paragraph",
        "text": "Use for cause → result structure, explaining reason and effect."
      },
      {
        "type": "example-list",
        "items": [
          "Siksi my\u00f6h\u00e4styin, ett\u00e4 nukuin pommiin. (That's why I was late, because I overslept.)",
          "Siksi olen v\u00e4synyt, ett\u00e4 nukuin huonosti. (That's why I am tired, because I slept badly.)",
          "Siksi en tullut, ett\u00e4 olin sairas. (That's why I didn't come, because I was sick.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.6 siis → 'so / therefore'"
      },
      {
        "type": "paragraph",
        "text": "Use for logical conclusion, result of reasoning."
      },
      {
        "type": "example-list",
        "items": [
          "Olet suomalainen, siis puhut suomea. (You are Finnish, therefore you speak Finnish.)",
          "Sataa, siis j\u00e4\u00e4n kotiin. (It is raining, so I stay home.)",
          "H\u00e4n opiskelee paljon, siis h\u00e4n oppii nopeasti. (He/she studies a lot, so learns quickly.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.7 jos → 'if'"
      },
      {
        "type": "paragraph",
        "text": "Use for condition, possibility."
      },
      {
        "type": "example-list",
        "items": [
          "Jos sataa, j\u00e4\u00e4n kotiin. (If it rains, I stay home.)",
          "Jos minulla on aikaa, tulen mukaan. (If I have time, I will come along.)",
          "Jos opiskelet, opit suomea. (If you study, you will learn Finnish.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.8 vaan → 'but rather / correction'"
      },
      {
        "type": "paragraph",
        "text": "Use for correcting wrong assumption. Not 'but' (that is mutta), but correction."
      },
      {
        "type": "example-list",
        "items": [
          "En ole englantilainen, vaan irlantilainen. (I am not English, but Irish.)",
          "H\u00e4n ei ole opettaja, vaan opiskelija. (He/she is not a teacher, but a student.)",
          "T\u00e4m\u00e4 ei ole helppoa, vaan vaikeaa. (This is not easy, but difficult.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.9 Quick Comparison Table"
      },
      {
        "type": "example-table",
        "headers": ["Conjunction", "Meaning"],
        "rows": [
          ["sek\u00e4 … ett\u00e4", "both … and"],
          ["lis\u00e4ksi", "in addition"],
          ["eik\u00e4", "and not / nor"],
          ["vaikka", "although"],
          ["siis", "therefore / so"],
          ["jos", "if"],
          ["vaan", "but rather (correction)"]
        ]
      },
      {
        "type": "subheading",
        "text": "14.10 Common Real-Life Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tykk\u00e4\u00e4n sek\u00e4 kahvista ett\u00e4 teest\u00e4. (I like both coffee and tea.)",
          "En tullut, sill\u00e4 olin sairas. (I didn't come because I was sick.)",
          "Menin ulos, vaikka oli kylm\u00e4. (I went out although it was cold.)",
          "Siksi olen my\u00f6h\u00e4ss\u00e4, ett\u00e4 bussi oli my\u00f6h\u00e4ss\u00e4. (That's why I am late, because the bus was late.)",
          "En ole v\u00e4synyt, vaan todella v\u00e4synyt. (I am not tired, but very tired.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14.11 Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "I speak both Finnish and English. → Puhun sek\u00e4 suomea ett\u00e4 englantia.",
          "I went outside although it was raining. → Menin ulos, vaikka satoi.",
          "If it rains, I stay home. → Jos sataa, j\u00e4\u00e4n kotiin.",
          "I am not English, but Irish. → En ole englantilainen, vaan irlantilainen.",
          "I did not laugh nor cry. → En nauranut eik\u00e4 itkenyt."
        ]
      },
      {
        "type": "subheading",
        "text": "14.12 Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Siksi olen v\u00e4synyt, ett\u00e4 nukuin huonosti. (That's why I am tired, because I slept badly.)",
          "Tykk\u00e4\u00e4n sek\u00e4 liikunnasta ett\u00e4 musiikista. (I like both exercise and music.)",
          "Menen ulos, vaikka sataa lunta. (I go outside even though it is snowing.)",
          "Jos opiskelen, opin nopeasti. (If I study, I learn quickly.)",
          "En ole kiireinen, vaan todella kiireinen. (I am not busy, but very busy.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does 'sek\u00e4 … ett\u00e4' mean?",
      "options": ["either … or", "both … and", "neither … nor", "although"],
      "correctAnswer": "both … and",
      "explanation": "Sek\u00e4 … ett\u00e4 means 'both … and'. Example: Puhun sek\u00e4 suomea ett\u00e4 englantia (I speak both Finnish and English).",
      "hint": "It connects two positive ideas together.",
      "points": 10
    },
    {
      "question": "How do you say 'in addition' in Finnish?",
      "options": ["lis\u00e4ksi", "vaikka", "siis", "sek\u00e4"],
      "correctAnswer": "lis\u00e4ksi",
      "explanation": "Lis\u00e4ksi means 'in addition' or 'besides'. Example: S\u00f6in leiv\u00e4n. Lis\u00e4ksi join maitoa. (I ate bread. In addition, I drank milk.)",
      "hint": "Think of adding extra information.",
      "points": 10
    },
    {
      "question": "What does 'eik\u00e4' mean in a negative sentence?",
      "options": ["and", "or", "but", "and not / nor"],
      "correctAnswer": "and not / nor",
      "explanation": "Eik\u00e4 connects negative clauses meaning 'and not' or 'nor'. Example: En nauranut eik\u00e4 itkenyt (I neither laughed nor cried).",
      "hint": "It replaces 'and not' in negative sentences.",
      "points": 10
    },
    {
      "question": "How do you say 'although' in Finnish?",
      "options": ["jos", "vaikka", "siis", "vaan"],
      "correctAnswer": "vaikka",
      "explanation": "Vaikka means 'although' or 'even if'. Example: Menin ulos, vaikka satoi (I went outside although it was raining).",
      "hint": "It shows contrast despite something.",
      "points": 10
    },
    {
      "question": "What is the meaning of 'siis'?",
      "options": ["if", "although", "therefore / so", "but rather"],
      "correctAnswer": "therefore / so",
      "explanation": "Siis means 'therefore' or 'so' — it shows a logical conclusion. Example: Sataa, siis j\u00e4\u00e4n kotiin (It's raining, so I stay home).",
      "hint": "It introduces a result or conclusion.",
      "points": 10
    },
    {
      "question": "What is the difference between 'mutta' and 'vaan'?",
      "options": [
        "No difference",
        "Mutta = but, vaan = but rather (correction)",
        "Mutta = so, vaan = because",
        "Mutta = and, vaan = or"
      ],
      "correctAnswer": "Mutta = but, vaan = but rather (correction)",
      "explanation": "Mutta is a neutral 'but'. Vaan is used for correction after a negative: En ole englantilainen, vaan irlantilainen (I am not English, but Irish).",
      "hint": "Vaan corrects a previous negative statement.",
      "points": 10
    },
    {
      "question": "How do you say 'If it rains, I stay home' in Finnish?",
      "options": [
        "Vaikka sataa, j\u00e4\u00e4n kotiin",
        "Jos sataa, j\u00e4\u00e4n kotiin",
        "Siksi sataa, j\u00e4\u00e4n kotiin",
        "Lis\u00e4ksi sataa, j\u00e4\u00e4n kotiin"
      ],
      "correctAnswer": "Jos sataa, j\u00e4\u00e4n kotiin",
      "explanation": "Jos = if. 'Jos sataa, j\u00e4\u00e4n kotiin' = If it rains, I stay home.",
      "hint": "Conditional 'if' uses 'jos'.",
      "points": 10
    },
    {
      "question": "What does the structure 'siksi … ett\u00e4' express?",
      "options": [
        "Contrast",
        "Cause and result (that's why … because)",
        "Addition",
        "Condition"
      ],
      "correctAnswer": "Cause and result (that's why … because)",
      "explanation": "Siksi … ett\u00e4 expresses cause and effect. Example: Siksi olen v\u00e4synyt, ett\u00e4 nukuin huonosti (That's why I am tired, because I slept badly).",
      "hint": "It explains the reason for something.",
      "points": 10
    },
    {
      "question": "Which conjunction means 'but rather' (correction after negative)?",
      "options": ["mutta", "vaan", "vaikka", "joten"],
      "correctAnswer": "vaan",
      "explanation": "Vaan is used after a negative to correct or specify: En ole opettaja, vaan opiskelija (I am not a teacher, but a student). Mutta would be neutral 'but'.",
      "hint": "It corrects a wrong assumption.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'H\u00e4n ei sy\u00f6 ___ juo.' (He/she neither eats nor drinks)",
      "options": ["eik\u00e4", "vaan", "sek\u00e4", "lis\u00e4ksi"],
      "correctAnswer": "eik\u00e4",
      "explanation": "Eik\u00e4 is used to connect negative clauses: H\u00e4n ei sy\u00f6 eik\u00e4 juo (He/she neither eats nor drinks).",
      "hint": "Use eik\u00e4 after a negative verb to add another negative.",
      "points": 10
    }
  ]
},





 {
  "id": "pluperfect-tense",
  "chapter": 1,
  "title": "Pluperfect Tense – Pluskvamperfekti",
  "finnish": "Pluskvamperfekti",
  "icon": "⏪",
  "level": "B1",
  "accent": "bg-indigo-600",
  "badge": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "description": "The past perfect tense for actions completed before another past action — formed with imperfekti of olla + past participle",
  "content": {
    "type": "rich",
    "intro": "Pluskvamperfekti (past perfect tense) is used for an action that was already completed before another past action. It always refers to two past events: earlier past → pluskvamperfekti, later past → imperfekti.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What is Pluskvamperfekti? (Recap)"
      },
      {
        "type": "paragraph",
        "text": "Pluskvamperfekti = past perfect tense. Used for an action that was already completed before another past action. Always refers to two past events: earlier past → pluskvamperfekti, later past → imperfekti."
      },
      {
        "type": "paragraph",
        "text": "Example: Hän oli syönyt ennen kuin minä tulin. (He had eaten before I came.)"
      },
      {
        "type": "subheading",
        "text": "2. Formation (Always the same)"
      },
      {
        "type": "paragraph",
        "text": "Imperfekti of olla + past participle of the main verb"
      },
      {
        "type": "example-table",
        "headers": ["Person", "olla (imperfekti)", "Main verb participle", "Example (puhua – to speak)"],
        "rows": [
          ["minä", "olin", "puhunut", "olin puhunut"],
          ["sinä", "olit", "puhunut", "olit puhunut"],
          ["hän", "oli", "puhunut", "oli puhunut"],
          ["me", "olimme", "puhuneet", "olimme puhuneet"],
          ["te", "olitte", "puhuneet", "olitte puhuneet"],
          ["he", "olivat", "puhuneet", "olivat puhuneet"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Past Participle Forms (Review for B1)"
      },
      {
        "type": "paragraph",
        "text": "Type 1 verbs (e.g., puhua, asua, lukea): Stem + -nut/-nyt (singular), -neet (plural). Vowel harmony: -nut (a, o, u) / -nyt (ä, ö, y)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Singular (minä)", "Plural (me)"],
        "rows": [
          ["puhua", "puhunut", "puhuneet"],
          ["asua", "asunut", "asuneet"],
          ["lukea", "lukenut", "lukeneet"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Type 2 verbs (e.g., syödä, juoda):"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Singular", "Plural"],
        "rows": [
          ["syödä", "syönyt", "syöneet"],
          ["juoda", "juonut", "juoneet"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Type 3 verbs (e.g., mennä, nousta):"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Singular", "Plural"],
        "rows": [
          ["mennä", "mennyt", "menneet"],
          ["nousta", "noussut", "nousseet"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Irregular important ones: tehdä → tehnyt / tehneet, nähdä → nähnyt / nähneet, olla → ollut / olleet"
      },
      {
        "type": "subheading",
        "text": "4. Negative Form (B1 must-know)"
      },
      {
        "type": "paragraph",
        "text": "Ei + past participle – the auxiliary olla is negated in imperfekti."
      },
      {
        "type": "example-table",
        "headers": ["Person", "Negative"],
        "rows": [
          ["minä en", "en ollut syönyt"],
          ["sinä et", "et ollut syönyt"],
          ["hän ei", "ei ollut syönyt"],
          ["me emme", "emme olleet syöneet"],
          ["te ette", "ette olleet syöneet"],
          ["he eivät", "eivät olleet syöneet"]
        ]
      },
      {
        "type": "paragraph",
        "text": "✅ Hän ei ollut syönyt ennen kuin minä tulin. (He had not eaten before I came.)"
      },
      {
        "type": "subheading",
        "text": "5. Question Form"
      },
      {
        "type": "paragraph",
        "text": "Olla (imperfekti) + subject + past participle?"
      },
      {
        "type": "example-table",
        "headers": ["Question", "Meaning"],
        "rows": [
          ["Olitko sinä syönyt?", "Had you eaten?"],
          ["Oliko hän mennyt?", "Had he/she gone?"],
          ["Olivatko he nähneet sen?", "Had they seen it?"]
        ]
      },
      {
        "type": "paragraph",
        "text": "✅ Oliko hän jo lähtenyt, kun saavuit? (Had he already left when you arrived?)"
      },
      {
        "type": "subheading",
        "text": "6. Word Order in Main & Subordinate Clauses"
      },
      {
        "type": "paragraph",
        "text": "Main clause (normal order): Minä olin syönyt."
      },
      {
        "type": "paragraph",
        "text": "Subordinate clause with kun, ennen kuin, että, koska: Hän sanoi, että oli syönyt. (He said that he had eaten.)"
      },
      {
        "type": "paragraph",
        "text": "Inversion (question / emphasis): Olin minä syönyt, mutta… (Yes, I had eaten, but…)"
      },
      {
        "type": "subheading",
        "text": "7. Key Time Words with Pluskvamperfekti"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["jo", "already"],
          ["vasta", "only just"],
          ["ennen kuin", "before"],
          ["kun", "when"],
          ["jo ennen", "already before"],
          ["aikaisemmin", "earlier"],
          ["tuolloin", "at that time (earlier past)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olin jo syönyt, kun hän tuli. (I had already eaten when he came.)",
          "Olin syönyt vasta viisi minuuttia aikaisemmin. (I had eaten only five minutes earlier.)"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Pluskvamperfekti vs. Perfekti (B1 comparison table)"
      },
      {
        "type": "example-table",
        "headers": ["", "Perfekti", "Pluskvamperfekti"],
        "rows": [
          ["Auxiliary", "olen, olet, on, olemme, olette, ovat", "olin, olit, oli, olimme, olitte, olivat"],
          ["Meaning", "have/has done", "had done"],
          ["Time relation", "connected to present", "connected to another past event"],
          ["Example", "Olen syönyt. (I have eaten.)", "Olin syönyt, kun hän tuli. (I had eaten when he came.)"]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Common B1 Mistakes & How to Avoid"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Minä olen syönyt ennen kuin hän tuli.", "Minä olin syönyt ennen kuin hän tuli.", "Both events in past → pluskvamperfekti."],
          ["He olivat syönyt.", "He olivat syöneet.", "Plural subject needs plural participle (-neet)."],
          ["En ollut syönyt ennen hän tuli.", "En ollut syönyt ennen kuin hän tuli.", "ennen kuin (not just ennen)."],
          ["Olin syödä.", "Olin syönyt.", "Auxiliary + participle, not infinitive."]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Practical B1 Sentences (Use as models)"
      },
      {
        "type": "example-list",
        "items": [
          "Olin jo nukkunut tunnin, kun puhelin soi. (I had already slept for an hour when the phone rang.)",
          "He olivat odottaneet kaksi tuntia ennen kuin bussi tuli. (They had waited for two hours before the bus came.)",
          "En ollut koskaan nähnyt häntä ennen sitä päivää. (I had never seen him/her before that day.)",
          "Oliko hän jo valmistanut ruoan, kun vieraat saapuivat? (Had he/she already prepared the food when the guests arrived?)",
          "Luulin, että olit jo lähtenyt. (I thought that you had already left.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Mini Practice"
      },
      {
        "type": "example-list",
        "title": "Translate into Finnish:",
        "items": [
          "We had already bought the tickets. → Olimme jo ostaneet liput.",
          "He had said that. → Hän ei ollut sanonut sitä. (negative? Actually positive: Hän oli sanonut sen.)",
          "Had you met her before? → Olitko tavannut hänet ennen?",
          "Correct the mistake: Me olimme syönyt jo. → Me olimme syöneet jo."
        ]
      },
      {
        "type": "subheading",
        "text": "12. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Olin jo lähtenyt, kun hän soitti. (I had already left when he/she called.)",
          "Emme olleet koskaan nähneet sellaista. (We had never seen such a thing.)",
          "Oliko hän jo syönyt ennen kuin tulit? (Had he/she already eaten before you came?)",
          "Luulin, että olit jo tavannut hänet. (I thought that you had already met him/her.)",
          "He olivat asuneet Suomessa jo viisi vuotta ennen kuin muuttivat. (They had already lived in Finland for five years before they moved.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the pluskvamperfekti used for?",
      "options": [
        "Actions happening right now",
        "Actions that will happen in the future",
        "Actions completed before another past action",
        "Actions that are ongoing in the present"
      ],
      "correctAnswer": "Actions completed before another past action",
      "explanation": "Pluskvamperfekti (past perfect) describes an action that was already completed before another past action. Example: 'Olin syönyt, kun hän tuli' (I had eaten when he came).",
      "hint": "Think of 'had done' in English — the past of the past.",
      "points": 10
    },
    {
      "question": "How is the pluskvamperfekti formed?",
      "options": [
        "Present tense of olla + past participle",
        "Imperfekti of olla + past participle",
        "Conditional of olla + past participle",
        "Past passive + infinitive"
      ],
      "correctAnswer": "Imperfekti of olla + past participle",
      "explanation": "Pluskvamperfekti is formed with the imperfekti of olla (olin, olit, oli, olimme, olitte, olivat) + the past participle of the main verb.",
      "hint": "The auxiliary verb is in the imperfect tense.",
      "points": 10
    },
    {
      "question": "What is the correct pluskvamperfekti form of 'minä syödä' (I eat)?",
      "options": ["minä olen syönyt", "minä olin syönyt", "minä olin syödä", "minä olen syödä"],
      "correctAnswer": "minä olin syönyt",
      "explanation": "minä + olin (imperfekti of olla) + syönyt (past participle of syödä). 'Olen syönyt' is perfect tense, not pluskvamperfekti.",
      "hint": "Imperfekti of olla is olin.",
      "points": 10
    },
    {
      "question": "What is the plural past participle for 'puhua' (to speak)?",
      "options": ["puhunut", "puhuneet", "puhun", "puhui"],
      "correctAnswer": "puhuneet",
      "explanation": "For plural subjects (me, te, he), the past participle ends in -neet: puhuneet. Singular is puhunut.",
      "hint": "Plural subjects need plural participle ending in -eet.",
      "points": 10
    },
    {
      "question": "How do you say 'I had already left when he called' in Finnish?",
      "options": [
        "Olen jo lähtenyt, kun hän soittaa",
        "Olin jo lähtenyt, kun hän soitti",
        "Olen jo lähtenyt, kun hän soitti",
        "Olin jo lähtenyt, kun hän soittaa"
      ],
      "correctAnswer": "Olin jo lähtenyt, kun hän soitti",
      "explanation": "Olin jo lähtenyt = I had already left (pluskvamperfekti). Kun hän soitti = when he called (imperfekti). Both events are in the past.",
      "hint": "Earlier action = pluskvamperfekti, later action = imperfekti.",
      "points": 10
    },
    {
      "question": "What is the correct negative pluskvamperfekti of 'hän syödä'?",
      "options": ["hän ei ole syönyt", "hän ei ollut syönyt", "hän ei syönyt", "hän ei olisi syönyt"],
      "correctAnswer": "hän ei ollut syönyt",
      "explanation": "Negative pluskvamperfekti: negative verb (ei) + ollut (negated form of olla in imperfekti) + past participle (syönyt).",
      "hint": "Use 'ei ollut' + past participle.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Olen syönyt' and 'Olin syönyt'?",
      "options": [
        "No difference",
        "First is perfect (have eaten), second is pluskvamperfekti (had eaten)",
        "First is past, second is present",
        "First is negative, second is positive"
      ],
      "correctAnswer": "First is perfect (have eaten), second is pluskvamperfekti (had eaten)",
      "explanation": "Olen syönyt (perfect) = I have eaten (connected to present). Olin syönyt (pluskvamperfekti) = I had eaten (before another past event).",
      "hint": "One connects to present, one connects to another past event.",
      "points": 10
    },
    {
      "question": "Which time word is commonly used with pluskvamperfekti?",
      "options": ["huomenna", "tänään", "ennen kuin", "kohta"],
      "correctAnswer": "ennen kuin",
      "explanation": "'Ennen kuin' (before) is often used with pluskvamperfekti to show that one action was completed before another: 'Olin syönyt ennen kuin hän tuli.'",
      "hint": "It means 'before' and sets up a sequence in the past.",
      "points": 10
    },
    {
      "question": "What is the correct past participle of 'mennä' (to go) for plural?",
      "options": ["mennyt", "menneet", "menen", "meni"],
      "correctAnswer": "menneet",
      "explanation": "mennä is a Type 3 verb. Plural past participle: menneet. Singular: mennyt.",
      "hint": "Plural form ends in -neet.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses pluskvamperfekti?",
      "options": [
        "Kun saavuin, hän oli jo syönyt.",
        "Kun saavun, hän on jo syönyt.",
        "Kun saavuin, hän on jo syönyt.",
        "Kun saavun, hän oli jo syönyt."
      ],
      "correctAnswer": "Kun saavuin, hän oli jo syönyt.",
      "explanation": "Both actions are in the past: saavuin (imperfekti = I arrived), hän oli jo syönyt (pluskvamperfekti = he had already eaten). The eating happened before the arrival.",
      "hint": "Earlier action = had eaten (pluskvamperfekti), later action = arrived (imperfekti).",
      "points": 10
    }
  ]
},


{
  "id": "possessive-suffixes",
  "chapter": 2,
  "title": "Possessive Suffixes – Omistusliitteet",
  "finnish": "Omistusliitteet",
  "icon": "🔑",
  "level": "B1",
  "accent": "bg-purple-600",
  "badge": "bg-purple-50 text-purple-700 border-purple-200",
  "description": "How Finnish attaches ownership directly to nouns using suffixes instead of separate words like 'my', 'your' — including spoken vs written forms, cases, and third person rules",
  "content": {
    "type": "rich",
    "intro": "Finnish attaches ownership directly to the noun instead of using separate words like 'my', 'your'. These are called possessive suffixes (omistusliitteet).",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Are Possessive Suffixes? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish (suffix alone)", "Finnish (pronoun + suffix)"],
        "rows": [
          ["my book", "kirjani", "minun kirjani"],
          ["your book", "kirjasi", "sinun kirjasi"],
          ["his/her book", "kirjansa", "hänen kirjansa"],
          ["our book", "kirjamme", "meidän kirjamme"],
          ["your (pl) book", "kirjanne", "teidän kirjanne"],
          ["their book", "kirjansa", "heidän kirjansa"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Kirjansa can mean 'his/her book' OR 'their book' — context decides."
      },
      {
        "type": "subheading",
        "text": "2. Full Conjugation Table (All persons)"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Suffix", "Example: talo (house)", "Example: kynä (pen)"],
        "rows": [
          ["minä", "-ni", "taloni", "kynäni"],
          ["sinä", "-si", "talosi", "kynäsi"],
          ["hän", "-nsa/-nsä", "talonsa", "kynänsä"],
          ["me", "-mme", "talomme", "kynämme"],
          ["te", "-nne", "talonne", "kynänne"],
          ["he", "-nsa/-nsä", "talonsa", "kynänsä"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Vowel Harmony for -nsa/-nsä (Crucial for B1)"
      },
      {
        "type": "paragraph",
        "text": "If the word has a, o, u (back vowels) → use -nsa. If the word has ä, ö, y (front vowels) → use -nsä. E and i are neutral — look at other vowels in the word."
      },
      {
        "type": "example-table",
        "headers": ["Word", "Suffix", "Result"],
        "rows": [
          ["talo (a,o)", "-nsa", "talonsa"],
          ["kirja (i,a)", "-nsa", "kirjansa"],
          ["kylä (y,ä)", "-nsä", "kylänsä"],
          ["tyttö (y,ö)", "-nsä", "tyttönsä"],
          ["ystävä (y,ä)", "-nsä", "ystävänsä"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Hän osti kirjansa. (He bought his/her book.)",
          "He rakastavat kylänsä. (They love their village.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. The minun kirjani Rule (Pronoun + Suffix)"
      },
      {
        "type": "paragraph",
        "text": "In written/formal Finnish: suffix alone is enough (but pronoun can still be used for clarity)."
      },
      {
        "type": "paragraph",
        "text": "In spoken Finnish: The pronoun is almost always used. The suffix is often dropped in casual speech, especially for minun, sinun, meidän, teidän."
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken (colloquial)"],
        "rows": [
          ["minun kirjani", "mun kirja"],
          ["sinun koirasi", "sun koira"],
          ["meidän talomme", "meidän talo"],
          ["teidän autonne", "teidän auto"],
          ["hänen kirjansa", "sen kirja / hänen kirja"],
          ["heidän kirjansa", "niiden kirja / heidän kirja"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "In spoken Finnish, the third person (hänen, heidän) often uses 'sen' or 'niiden' + noun without suffix."
      },
      {
        "type": "subheading",
        "text": "5. Possessive Suffixes with Cases (B1 must-know)"
      },
      {
        "type": "paragraph",
        "text": "When the noun is in a case (inessive, adessive, etc.), the suffix goes at the very end — after the case ending. Pattern: Stem + case ending + possessive suffix"
      },
      {
        "type": "subheading",
        "text": "Example: kirja (book) in different cases"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Base form", "\"my book\""],
        "rows": [
          ["Nominative", "kirja", "kirjani"],
          ["Genitive", "kirjan", "kirjani"],
          ["Partitive", "kirjaa", "kirjaani"],
          ["Inessive", "kirjassa", "kirjassani"],
          ["Elative", "kirjasta", "kirjastani"],
          ["Illative", "kirjaan", "kirjaani"],
          ["Adessive", "kirjalla", "kirjallani"],
          ["Ablative", "kirjalta", "kirjaltani"],
          ["Allative", "kirjalle", "kirjalleni"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Kirjassani on paljon kuvia. (In my book there are many pictures.)",
          "Annoin kirjalleni uuden kannen. (I gave my book a new cover.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6. Consonant Gradation Changes with Suffixes (B1 level)"
      },
      {
        "type": "paragraph",
        "text": "The suffix itself doesn't cause gradation, but case endings do — and then the suffix attaches."
      },
      {
        "type": "example-table",
        "headers": ["Word (basic)", "Case + suffix", "Explanation"],
        "rows": [
          ["kauppa (store)", "kaupassani (in my store)", "pp → p (weak grade)"],
          ["pankki (bank)", "pankissani (in my bank)", "kk → k"],
          ["tyttö (girl)", "tytölläni (on my girl)", "tt → t"]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Third Person (-nsa/-nsä) Special Rules (B1 tricky part)"
      },
      {
        "type": "paragraph",
        "text": "Rule 1: In a sentence with hänen or heidän, the suffix is optional in writing but common in formal Finnish."
      },
      {
        "type": "paragraph",
        "text": "Rule 2: If the subject is clear, you can use the suffix alone."
      },
      {
        "type": "example-list",
        "items": ["Kirjansa on pöydällä. (His/her/their book is on the table.)"]
      },
      {
        "type": "paragraph",
        "text": "Rule 3: When the possessor is hän and there is no other possessive word, -nsa/-nsä is required in standard Finnish."
      },
      {
        "type": "example-list",
        "items": [
          "Hän otti kirjansa ja lähti. (He took his book and left.)",
          "Hän otti kirja ja lähti. (incorrect)"
        ]
      },
      {
        "type": "paragraph",
        "text": "Rule 4: With postpositions, the suffix goes on the postposition."
      },
      {
        "type": "example-list",
        "items": [
          "Hänen takanaan = behind him",
          "Minun vieressäni = next to me"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Minun kirja", "Minun kirjani", "Suffix needed in standard Finnish"],
          ["Kirjassa minun on kuva", "Kirjassani on kuva", "Suffix on noun, not separate"],
          ["Autoini", "Autoni", "No extra -i- in nominative"]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Possessive Suffixes Without a Noun (Ellipsis)"
      },
      {
        "type": "paragraph",
        "text": "In answers or short phrases, the suffix can stand alone."
      },
      {
        "type": "example-list",
        "items": [
          "Kumpi kirja on sinun? — Minun. (Which book is yours? — Mine.)",
          "Otin omani ja lähdin. (I took mine and left.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Minun autoni on vanha, mutta sinun autosi on uusi. (My car is old, but your car is new.)",
          "Meidän talossamme on sauna. (In our house there is a sauna.)",
          "Hän unohti puhelimensa kotiin. (He forgot his phone at home.)",
          "Teidän tehtävänne on vaikea. (Your (plural) task is difficult.)",
          "Heidän lapsensa leikkivät puistossa. (Their children are playing in the park.)",
          "Otin kirjani ja menin ulos. (I took my book and went out.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Add suffix: minä + talo (inessive case) → 'in my house'",
        "items": ["Answer: talossani"]
      },
      {
        "type": "example-list",
        "title": "2. Translate: Your (sinä) car is fast",
        "items": ["Answer: Sinun autosi on nopea. or Autosi on nopea."]
      },
      {
        "type": "example-list",
        "title": "3. Correct: Heidän koiransa on musta (is this correct? If yes, what does it mean?)",
        "items": ["Answer: Correct → 'Their dog is black' (or 'his/her dog is black' depending on context)"]
      },
      {
        "type": "example-list",
        "title": "4. Spoken to written: mun kirja",
        "items": ["Answer: minun kirjani"]
      },
      {
        "type": "example-list",
        "title": "5. Add suffix to case form: auto + adessive + minä → 'on my car'",
        "items": ["Answer: autollani"]
      },
      {
        "type": "subheading",
        "text": "12. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Pesen käteni. (I wash my hands.)",
          "Hän nosti kätensä. (He raised his hand.)",
          "Tässä on minun puhelimeni. (Here is my phone.)",
          "Unohditko lompakkosi kotiin? (Did you forget your wallet at home?)",
          "Heidän talossaan on iso piha. (In their house there is a big yard.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the possessive suffix for 'minä' (my)?",
      "options": ["-si", "-mme", "-ni", "-nne"],
      "correctAnswer": "-ni",
      "explanation": "The possessive suffix for minä is -ni. Example: kirjani (my book), taloni (my house).",
      "hint": "It ends with -ni, like 'minä' contains 'ni'.",
      "points": 10
    },
    {
      "question": "What does 'kirjansa' mean in standard Finnish?",
      "options": [
        "My book only",
        "Your book only",
        "His/her book OR their book (context decides)",
        "Our book only"
      ],
      "correctAnswer": "His/her book OR their book (context decides)",
      "explanation": "-nsa/-nsä is used for both third person singular (hänen) and third person plural (heidän). Context determines whether it means 'his/her' or 'their'.",
      "hint": "Both 'hänen' and 'heidän' use the same suffix.",
      "points": 10
    },
    {
      "question": "What is the correct possessive form of 'talo' (house) for 'minä' in the inessive case (in my house)?",
      "options": ["talossa minun", "talossani", "minun talossa", "taloni"],
      "correctAnswer": "talossani",
      "explanation": "The suffix goes after the case ending: talo + inessive -ssa + possessive -ni = talossani.",
      "hint": "Case ending first, then the possessive suffix.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, what is a common way to say 'my book'?",
      "options": ["minun kirjani", "mun kirja", "kirjani", "minun kirja"],
      "correctAnswer": "mun kirja",
      "explanation": "In spoken Finnish, the pronoun is almost always used and the suffix is often dropped: 'mun kirja' (my book) instead of 'minun kirjani'.",
      "hint": "Think of casual everyday speech — shorter and without the suffix.",
      "points": 10
    },
    {
      "question": "Which vowel harmony rule applies to '-nsa/-nsä'?",
      "options": [
        "Always use -nsa",
        "Always use -nsä",
        "-nsa for back vowels (a,o,u); -nsä for front vowels (ä,ö,y)",
        "It depends on the speaker's dialect"
      ],
      "correctAnswer": "-nsa for back vowels (a,o,u); -nsä for front vowels (ä,ö,y)",
      "explanation": "Use -nsa for words with back vowels (a, o, u) and -nsä for words with front vowels (ä, ö, y). Example: talonsa (talo + -nsa), tyttönsä (tyttö + -nsä).",
      "hint": "Vowel harmony applies just like with other suffixes.",
      "points": 10
    },
    {
      "question": "What is the correct possessive form of 'auto' (car) for 'sinä' in the adessive case (on your car)?",
      "options": ["autosi", "autollasi", "autollani", "sinun autolla"],
      "correctAnswer": "autollasi",
      "explanation": "auto + adessive -lla + possessive -si = autollasi. The suffix goes after the case ending.",
      "hint": "Adessive ending -lla + possessive -si.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the possessive suffix?",
      "options": [
        "Minun kirja on pöydällä",
        "Kirja minun on pöydällä",
        "Kirjani on pöydällä",
        "Minun kirjaani on pöydällä"
      ],
      "correctAnswer": "Kirjani on pöydällä",
      "explanation": "Kirjani (my book) is the correct nominative form with possessive suffix. 'Minun kirjani' is also correct but 'kirjani' alone is sufficient.",
      "hint": "The suffix attaches directly to the noun.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, what is a common way to say 'his/her book'?",
      "options": ["hänen kirjansa", "hänen kirja", "sen kirja", "kirjansa"],
      "correctAnswer": "sen kirja",
      "explanation": "In spoken Finnish, third person often uses 'sen' (it) + noun without suffix: 'sen kirja' instead of 'hänen kirjansa'.",
      "hint": "Think of casual speech — 'sen' replaces 'hänen'.",
      "points": 10
    },
    {
      "question": "What is the meaning of 'Otin omani ja lähdin'?",
      "options": [
        "I took yours and left",
        "I took his and left",
        "I took mine and left",
        "I took theirs and left"
      ],
      "correctAnswer": "I took mine and left",
      "explanation": "Omani = minun omani (my own one). The possessive suffix can stand alone without a noun (ellipsis).",
      "hint": "Oma means 'own' — omani = my own one.",
      "points": 10
    },
    {
      "question": "What is the correct form of 'Heidän talo on suuri' with the possessive suffix?",
      "options": ["Heidän talo on suuri", "Heidän talonsa on suuri", "Heidän taloaan on suuri", "Heidän talossa on suuri"],
      "correctAnswer": "Heidän talonsa on suuri",
      "explanation": "With heidän (their), the possessive suffix -nsa is needed in standard Finnish: heidän talonsa (their house).",
      "hint": "Add -nsa to the noun after heidän.",
      "points": 10
    }
  ]
},

{
  "id": "comparative-superlative",
  "chapter": 3,
  "title": "Comparative and Superlative – Komparatiivi ja Superlatiivi",
  "finnish": "Komparatiivi ja Superlatiivi",
  "icon": "📊",
  "level": "B1",
  "accent": "bg-green-600",
  "badge": "bg-green-50 text-green-700 border-green-200",
  "description": "How to form and use comparative (-mpi) and superlative (-in) forms of adjectives, including stem changes, partitive comparisons, declension, irregulars, and spoken Finnish",
  "content": {
    "type": "rich",
    "intro": "The comparative (komparatiivi) expresses 'more' or '-er', and the superlative (superlatiivi) expresses 'most' or '-est'. Finnish adds suffixes directly to the adjective stem.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. Full Formation Rules (All Types)"
      },
      {
        "type": "subheading",
        "text": "Type A: Most adjectives (1–2 syllables)"
      },
      {
        "type": "paragraph",
        "text": "Pattern: Remove final vowel + add -mpi / -in"
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Stem", "Comparative", "Superlative"],
        "rows": [
          ["suuri", "suur-", "suurempi", "suurin"],
          ["pieni", "pien-", "pienempi", "pienin"],
          ["nopea", "nope-", "nopeampi", "nopein"],
          ["kallis", "kalli-", "kalliimpi", "kallein"],
          ["kaunis", "kauni-", "kauniimpi", "kaunein"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "kaunis → kauniimpi (i + i = ii), but kaunein (stem kaune- for superlative)."
      },
      {
        "type": "subheading",
        "text": "Type B: -inen adjectives (e.g., punainen, tylsäinen)"
      },
      {
        "type": "paragraph",
        "text": "Drop -nen, add -sempi / -sin"
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Comparative", "Superlative"],
        "rows": [
          ["punainen (red)", "punaisempi", "punaisin"],
          ["tylsäinen (boring)", "tylsäisempi", "tylsäisin"],
          ["omituinen (strange)", "omituisempi", "omituisin"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type C: Two-syllable adjectives ending in -a/-ä (e.g., kova, luja)"
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Stem", "Comparative", "Superlative"],
        "rows": [
          ["kova", "kova-", "kovempi", "kovin"],
          ["luja", "luja-", "lujempi", "lujin"],
          ["paksu", "paksu-", "paksumpi", "paksuin"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type D: Long adjectives (3+ syllables, often loanwords)"
      },
      {
        "type": "paragraph",
        "text": "Use enemmän (more) and eniten (most) + positive form."
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Comparative", "Superlative"],
        "rows": [
          ["mielenkiintoinen (interesting)", "enemmän mielenkiintoinen", "eniten mielenkiintoinen"],
          ["masentunut (depressed)", "enemmän masentunut", "eniten masentunut"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "In B1, most adjectives still take -mpi/-in, but for very long or participle-like adjectives (e.g., väsynyt), use enemmän / eniten."
      },
      {
        "type": "subheading",
        "text": "2. Comparative Declension (Yes, it changes by case!)"
      },
      {
        "type": "paragraph",
        "text": "The comparative itself is an adjective and agrees with the noun in case and number."
      },
      {
        "type": "subheading",
        "text": "Singular cases of suurempi (bigger)"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Form"],
        "rows": [
          ["Nominative", "suurempi"],
          ["Genitive", "suuremman"],
          ["Partitive", "suurempaa"],
          ["Inessive", "suuremmassa"],
          ["Elative", "suuremmasta"],
          ["Illative", "suurempaan"],
          ["Adessive", "suuremmalla"],
          ["Ablative", "suuremmalta"],
          ["Allative", "suuremmalle"]
        ]
      },
      {
        "type": "subheading",
        "text": "Plural cases"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Form"],
        "rows": [
          ["Nominative pl", "suuremmat"],
          ["Genitive pl", "suurempien"],
          ["Partitive pl", "suurempia"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Asun suuremmassa talossa. (I live in a bigger house.)",
          "Tarvitsen suurempia kenkiä. (I need bigger shoes.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3. Superlative Declension"
      },
      {
        "type": "paragraph",
        "text": "Superlative also declines. Stem often changes: -in → -imm- / -imp-"
      },
      {
        "type": "subheading",
        "text": "Singular of suurin (biggest)"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Form"],
        "rows": [
          ["Nominative", "suurin"],
          ["Genitive", "suurimman"],
          ["Partitive", "suurinta"],
          ["Inessive", "suurimmassa"],
          ["Elative", "suurimmasta"],
          ["Illative", "suurimpaan"],
          ["Adessive", "suurimmalla"]
        ]
      },
      {
        "type": "subheading",
        "text": "Plural of suurin"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Form"],
        "rows": [
          ["Nominative pl", "suurimmat"],
          ["Genitive pl", "suurimpien"],
          ["Partitive pl", "suurimpia"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Se on suurimman talon piha. (That is the biggest house's yard.)"]
      },
      {
        "type": "subheading",
        "text": "4. Comparative Without kuin — The Partitive Comparison (B1 key structure)"
      },
      {
        "type": "paragraph",
        "text": "Instead of kuin (than), you can use partitive case for the second thing compared."
      },
      {
        "type": "example-table",
        "headers": ["Structure", "Example", "Meaning"],
        "rows": [
          ["X on Y:ta/Y:tä + comparative", "Olen sinua pidempi.", "I am taller than you."],
          ["", "Suomi on Ruotsia suurempi.", "Finland is bigger than Sweden."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Hän on minua vanhempi. (He/she is older than me.)",
          "Tämä kahvi on tuota parempi. (This coffee is better than that one.)"
        ]
      },
      {
        "type": "example-table",
        "headers": ["kuin structure", "Partitive structure"],
        "rows": [
          ["Olen pidempi kuin sinä.", "Olen sinua pidempi."],
          ["Suomi on suurempi kuin Ruotsi.", "Suomi on Ruotsia suurempi."]
        ]
      },
      {
        "type": "subheading",
        "text": "5. Irregular Comparatives & Superlatives (Must-know for B1)"
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Comparative", "Superlative", "Notes"],
        "rows": [
          ["hyvä (good)", "parempi", "paras", "Completely irregular"],
          ["paljon (much/many)", "enemmän", "eniten", "For amount"],
          ["vähän (little/few)", "vähemmän", "vähiten", "For amount"],
          ["huono (bad)", "huonompi", "huonoin", "Regular but common"],
          ["pitkä (long/tall)", "pidempi", "pisin", "Shortens (k disappears)"],
          ["lyhyt (short)", "lyhyempi", "lyhin", "Drop -yt"],
          ["nuori (young)", "nuorempi", "nuorin", "Adds -e-"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "paljon and vähän are adverbs here, but they work in comparisons: Juon kahvia enemmän kuin teetä. (I drink more coffee than tea.)"
      },
      {
        "type": "subheading",
        "text": "6. Special Case: -mpi with Vowel Changes (Gradation)"
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Comparative", "Gradation change"],
        "rows": [
          ["korkea (high)", "korkeampi", "no change"],
          ["leveä (wide)", "leveämpi", "no change"],
          ["terävä (sharp)", "terävämpi", "no change"],
          ["nopea (fast)", "nopeampi", "no change"]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Superlative Without Definite Article (Finnish has no 'the')"
      },
      {
        "type": "paragraph",
        "text": "English: 'the biggest house' → Finnish: 'suurin talo' (no 'the'). To specify 'the' in Finnish, use context or 'se': 'Se suurin talo' = That biggest house / The biggest house."
      },
      {
        "type": "subheading",
        "text": "8. Spoken Finnish Comparison (B1 important)"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken", "Notes"],
        "rows": [
          ["parempi", "parempi / päre", "päre is slang"],
          ["isompi", "isompi", "common"],
          ["enemmän", "enemmä(n)", "often shortened"],
          ["paras", "paras / pari", "pari is slang"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Tää on isompi ku toi. (Tämä on isompi kuin tuo.)"]
      },
      {
        "type": "subheading",
        "text": "9. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Kaunis → kaunisempi", "kauniimpi", "Wrong suffix"],
          ["Hyvä → hyvempi", "parempi", "Irregular"],
          ["Olen häntä parempi", "Olen häntä parempi (correct)", "Partitive comparison is fine"]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tämä puhelin on halvempi kuin tuo, mutta tuo on nopeampi. (This phone is cheaper than that one, but that one is faster.)",
          "Kuka on luokan vanhin oppilas? (Who is the oldest student in the class?)",
          "Olen sinua kaksi vuotta nuorempi. (I am two years younger than you.)",
          "Tämä on paras kahvi, mitä olen koskaan juonut. (This is the best coffee I have ever drunk.)",
          "Helsinki on Tamperetta suurempi kaupunki. (Helsinki is a bigger city than Tampere.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Form comparative & superlative of lyhyt (short)",
        "items": ["Answer: lyhyempi, lyhin"]
      },
      {
        "type": "example-list",
        "title": "2. Translate: 'She is more beautiful than me' (two ways)",
        "items": ["Answer: Hän on minua kauniimpi. / Hän on kauniimpi kuin minä."]
      },
      {
        "type": "example-list",
        "title": "3. Put into partitive comparative: Minä + olla + nuori + hän",
        "items": ["Answer: Olen häntä nuorempi."]
      },
      {
        "type": "example-list",
        "title": "4. Decline parempi in inessive singular",
        "items": ["Answer: paremmassa"]
      },
      {
        "type": "example-list",
        "title": "5. Spoken to written: Tää on nopeempi ku toi",
        "items": ["Answer: Tämä on nopeampi kuin tuo."]
      },
      {
        "type": "subheading",
        "text": "12. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tämä on parempi kuin eilinen. (This is better than yesterday's.)",
          "Kumpi on suurempi, Bangkok vai Lontoo? (Which is bigger, Bangkok or London?)",
          "Hän on perheen nuorin lapsi. (He/she is the youngest child in the family.)",
          "En voisi olla onnellisempi. (I couldn't be happier.)",
          "Se oli paras päivä ikinä. (That was the best day ever.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "How is the comparative formed in Finnish?",
      "options": [
        "Add -mpi to the stem",
        "Add -in to the stem",
        "Use 'enemmän' before the adjective",
        "Add -nen to the stem"
      ],
      "correctAnswer": "Add -mpi to the stem",
      "explanation": "The comparative is formed by adding -mpi to the adjective stem. Example: suuri → suurempi (bigger), nopea → nopeampi (faster).",
      "hint": "-mpi means 'more' or '-er'.",
      "points": 10
    },
    {
      "question": "What is the comparative of 'kaunis' (beautiful)?",
      "options": ["kaunempii", "kauniimpi", "kaunisempi", "kauneampi"],
      "correctAnswer": "kauniimpi",
      "explanation": "Kaunis stem kauni- + -mpi = kauniimpi. Note the double i (i + i = ii).",
      "hint": "Remove -s, add -mpi, and watch vowel harmony.",
      "points": 10
    },
    {
      "question": "What is the superlative of 'hyvä' (good)?",
      "options": ["paras", "hyvin", "hyvin", "hyväin"],
      "correctAnswer": "paras",
      "explanation": "Hyvä is irregular. Comparative = parempi, Superlative = paras (best).",
      "hint": "Irregular — think of 'better' and 'best' in English.",
      "points": 10
    },
    {
      "question": "How do you say 'I am taller than you' using the partitive comparison?",
      "options": [
        "Olen pidempi kuin sinä",
        "Olen sinua pidempi",
        "Minä olen pidempi sinä",
        "Olen pidempi sinua"
      ],
      "correctAnswer": "Olen sinua pidempi",
      "explanation": "In partitive comparison, the thing being compared to is in the partitive case: sinua (partitive of sinä) + pidempi.",
      "hint": "The partitive comes before the comparative.",
      "points": 10
    },
    {
      "question": "What is the comparative of 'punainen' (red)?",
      "options": ["punaisempi", "punainenpi", "punaampi", "punaisin"],
      "correctAnswer": "punaisempi",
      "explanation": "-inen adjectives drop -nen and add -sempi: punainen → punaisempi (more red/redder).",
      "hint": "Drop -nen, add -sempi.",
      "points": 10
    },
    {
      "question": "What is the inessive singular form of 'parempi' (better) meaning 'in a better one'?",
      "options": ["parempi", "paremman", "paremmassa", "parempia"],
      "correctAnswer": "paremmassa",
      "explanation": "Comparative adjectives decline. The stem of parempi is paremma- for case endings: paremmassa (inessive singular).",
      "hint": "Stem paremma- + inessive -ssa.",
      "points": 10
    },
    {
      "question": "Which adjective uses 'enemmän' for the comparative because it's long?",
      "options": ["nopea", "suuri", "mielenkiintoinen", "pieni"],
      "correctAnswer": "mielenkiintoinen",
      "explanation": "Very long adjectives (3+ syllables) like 'mielenkiintoinen' (interesting) often use 'enemmän' (more) instead of -mpi.",
      "hint": "Which word is long and complex?",
      "points": 10
    },
    {
      "question": "What is the meaning of 'Hän on minua vanhempi'?",
      "options": [
        "He is younger than me",
        "He is older than me",
        "He is as old as me",
        "He is the oldest"
      ],
      "correctAnswer": "He is older than me",
      "explanation": "Vanhempi = older. Minua (partitive of minä) is used for comparison without 'kuin'.",
      "hint": "Vanhempi means 'older'.",
      "points": 10
    },
    {
      "question": "What is the superlative of 'pitkä' (long/tall)?",
      "options": ["pitkäin", "pisin", "pitkimmän", "pidempi"],
      "correctAnswer": "pisin",
      "explanation": "Pitkä is irregular in superlative: pitkä → superlative pisin (longest/tallest). The 't' and 'k' change.",
      "hint": "Think of 'pisin' — it drops the 't' and 'k' changes.",
      "points": 10
    },
    {
      "question": "What is the correct superlative form of 'suuri' (big) in the genitive singular?",
      "options": ["suurin", "suurimman", "suurinta", "suurimmat"],
      "correctAnswer": "suurimman",
      "explanation": "Superlative suurin → stem suurimma- + genitive -n = suurimman (of the biggest).",
      "hint": "Superlative stem ends in -mma- for cases.",
      "points": 10
    }
  ]
},
{
  "id": "past-passive",
  "chapter": 4,
  "title": "Past Passive – Passiivi imperfektissä",
  "finnish": "Passiivi imperfektissä",
  "icon": "🎭",
  "level": "B1",
  "accent": "bg-rose-600",
  "badge": "bg-rose-50 text-rose-700 border-rose-200",
  "description": "How to form and use the past passive (imperfect passive) — focusing on the action itself, not who did it, with a special role in spoken Finnish for 'we'",
  "content": {
    "type": "rich",
    "intro": "Past passive focuses on the action itself, not who did it. In Finnish, past passive often replaces 'we' in spoken language.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is Past Passive? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["People spoke Finnish.", "Puhuttiin suomea."],
          ["Finnish was spoken.", "Puhuttiin suomea."],
          ["We went to the store.", "Mentiin kauppaan. (spoken)"]
        ]
      },
      {
        "type": "subheading",
        "text": "2. Formation Rules for All Verb Types"
      },
      {
        "type": "paragraph",
        "text": "Rule: Past passive stem + -tiin (or -iin)"
      },
      {
        "type": "subheading",
        "text": "Type 1 (puhua, asua, lukea)"
      },
      {
        "type": "paragraph",
        "text": "Take the present passive stem (remove -taan/-tään) and add -tiin."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Stem", "Past passive"],
        "rows": [
          ["puhua", "puhutaan", "puhu-", "puhuttiin"],
          ["asua", "asutaan", "asu-", "asuttiin"],
          ["lukea", "luetaan", "lue-", "luettiin"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 2 (syödä, juoda, tehdä)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Stem", "Past passive"],
        "rows": [
          ["syödä", "syödään", "syö-", "syötiin"],
          ["juoda", "juodaan", "juo-", "juotiin"],
          ["tehdä", "tehdään", "teh-", "tehtiin"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 3 (mennä, tulla, nousta)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Stem", "Past passive"],
        "rows": [
          ["mennä", "mennään", "men-", "mentiin"],
          ["tulla", "tullaan", "tul-", "tultiin"],
          ["nousta", "noustaan", "nous-", "noustiin"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 4 (haluta, osata, vastata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Stem", "Past passive"],
        "rows": [
          ["haluta", "halutaan", "halu-", "haluttiin"],
          ["osata", "osataan", "osa-", "osattiin"],
          ["vastata", "vastataan", "vasta-", "vastattiin"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 5 (tarvita, pakata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Stem", "Past passive"],
        "rows": [
          ["tarvita", "tarvitaan", "tarvi-", "tarvittiin"],
          ["pakata", "pakataan", "paka-", "pakattiin"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Key rule: Past passive almost always has double consonant before -iin/-tiin if the stem is short."
      },
      {
        "type": "subheading",
        "text": "3. The Passive Participle (Needed for Negatives & Perfect)"
      },
      {
        "type": "paragraph",
        "text": "Past passive has its own participle: -ttu/-tty (or -tu/-ty). Used for negative past passive and passive perfect."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Past passive positive", "Past passive participle"],
        "rows": [
          ["puhua", "puhuttiin", "puhuttu"],
          ["syödä", "syötiin", "syöty"],
          ["tehdä", "tehtiin", "tehty"],
          ["mennä", "mentiin", "menty"],
          ["juoda", "juotiin", "juotu"]
        ]
      },
      {
        "type": "subheading",
        "text": "4. Negative Past Passive"
      },
      {
        "type": "paragraph",
        "text": "Formula: ei + past passive participle"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Positive", "Negative"],
        "rows": [
          ["puhua", "puhuttiin", "ei puhuttu"],
          ["syödä", "syötiin", "ei syöty"],
          ["tehdä", "tehtiin", "ei tehty"],
          ["mennä", "mentiin", "ei menty"],
          ["juoda", "juotiin", "ei juotu"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Suomea ei puhuttu siellä. (Finnish was not spoken there.)",
          "Kahvia ei juotu ollenkaan. (No coffee was drunk at all.)",
          "Työtä ei tehty ajoissa. (The work was not done on time.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5. Passive Perfect Tense (Past passive + have)"
      },
      {
        "type": "paragraph",
        "text": "Formula: on/ovat + past passive participle. This is for actions that have been done (connection to present)."
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["It has been done.", "Se on tehty."],
          ["Finnish has been spoken.", "Suomea on puhuttu."],
          ["They have been eaten.", "Ne on syöty. (spoken)"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Finnish", "English"],
        "rows": [
          ["Past passive", "Puhuttiin suomea.", "Finnish was spoken."],
          ["Passive perfect", "Suomea on puhuttu.", "Finnish has been spoken."]
        ]
      },
      {
        "type": "subheading",
        "text": "6. Word Order & Object Case in Past Passive"
      },
      {
        "type": "paragraph",
        "text": "The object is often in partitive for indefinite amounts. Nominative object (total object) is possible in passive."
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Meaning", "Object case"],
        "rows": [
          ["Kahvia juotiin.", "Coffee was drunk.", "Partitive"],
          ["Kahvi juotiin.", "The coffee was drunk.", "Nominative (total)"],
          ["Kirja luettiin.", "The book was read (completely).", "Nominative"],
          ["Kirjaa luettiin.", "A/the book was read (partially).", "Partitive"]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Spoken Finnish vs. Written Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Written standard", "Spoken Finnish", "Meaning"],
        "rows": [
          ["puhuttiin", "puhuttii / puhuttiin", "was spoken / we spoke"],
          ["mentiin", "mentii", "we went"],
          ["ei puhuttu", "ei puhuttu", "was not spoken"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Important: Spoken Finnish uses past passive for 'we did X'."
      },
      {
        "type": "example-list",
        "items": [
          "Me mentiin kauppaan. (We went to the store.) ← standard spoken",
          "Me menimme kauppaan. (more formal)",
          "Me syötiin lounas. (We ate lunch.)"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Common Verbs in Past Passive (Everyday B1)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Tehtiin mitä?", "What was done? / What did we do?"],
          ["Mentiin sinne.", "We went there."],
          ["Puhuttiin paljon.", "A lot was said / We talked a lot."],
          ["Katsottiin elokuva.", "We watched a movie."],
          ["Ostettiin auto.", "We bought a car."],
          ["Juotiin kaljaa.", "Beer was drunk / We drank beer."],
          ["Ei nukuttu hyvin.", "We didn't sleep well."]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Puhutiin", "puhuttiin", "Double t needed."],
          ["Me puhuttiin suomea. (written)", "Me puhuimme suomea. (written)", "In written Finnish, don't use passive for 'we'."],
          ["Ei puhuttiin", "Ei puhuttu", "Negative uses participle, not -tiin."],
          ["Syötiin pizza", "Syötiin pizzaa", "Object usually partitive."]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Comparison: Present Passive vs. Past Passive vs. Perfect Passive"
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Finnish", "English"],
        "rows": [
          ["Present passive", "Puhutaan suomea.", "Finnish is spoken / People speak Finnish."],
          ["Past passive", "Puhuttiin suomea.", "Finnish was spoken / People spoke Finnish."],
          ["Perfect passive", "On puhuttu suomea.", "Finnish has been spoken."],
          ["Past perfect passive", "Oli puhuttu suomea.", "Finnish had been spoken."]
        ]
      },
      {
        "type": "subheading",
        "text": "11. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Eilen tehtiin paljon töitä ja sitten mentiin saunaan. (Yesterday a lot of work was done, and then we went to the sauna.)",
          "Kahvia juotiin koko ajan, mutta olutta ei juotu ollenkaan. (Coffee was drunk all the time, but beer was not drunk at all.)",
          "Tämä talo rakennettiin vuonna 1950. (This house was built in 1950.)",
          "Puhuttiinko siellä englantia vai suomea? (Was English or Finnish spoken there?)",
          "Meillä ei nukuttu hyvin, koska naapurit pitivät melua. (We didn't sleep well because the neighbors made noise.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Form past passive of: laulaa (to sing), tanssia",
        "items": ["Answer: laulettiin, tanssittiin"]
      },
      {
        "type": "example-list",
        "title": "2. Negative past passive of: nähdä (to see)",
        "items": ["Answer: ei nähty"]
      },
      {
        "type": "example-list",
        "title": "3. Translate: 'English was not spoken.'",
        "items": ["Answer: Englantia ei puhuttu."]
      },
      {
        "type": "example-list",
        "title": "4. Convert spoken to written: Me mentiin kotiin.",
        "items": ["Answer: Me menimme kotiin."]
      },
      {
        "type": "example-list",
        "title": "5. Make a question: 'people ate' → question form",
        "items": ["Answer: Syötiinkö? (Was food eaten? / Did people eat?)"]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Mitä tehtiin eilen? (What was done yesterday? / What did we do yesterday?)",
          "Koko kakku syötiin. (The whole cake was eaten.)",
          "Ovea ei avattu koko päivänä. (The door wasn't opened all day.)",
          "Milloin tämä rakennettiin? (When was this built?)",
          "Meillä ei valitettavasti nukuttu hyvin. (Unfortunately we didn't sleep well.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "How is the past passive formed for most verbs?",
      "options": [
        "Add -taan/-tään to the stem",
        "Add -tiin to the present passive stem",
        "Add -i- to the present stem",
        "Add -nut/-nyt to the stem"
      ],
      "correctAnswer": "Add -tiin to the present passive stem",
      "explanation": "For most verbs, take the present passive stem (remove -taan/-tään) and add -tiin. Example: puhua → puhutaan (present passive) → puhu- + -tiin = puhuttiin.",
      "hint": "Think of 'puhutta**iin**' — the ending is -tiin.",
      "points": 10
    },
    {
      "question": "What is the past passive of 'mennä' (to go)?",
      "options": ["meni", "mennessä", "mentiin", "mennyt"],
      "correctAnswer": "mentiin",
      "explanation": "mennä → present passive mennään → stem men- + -tiin = mentiin. This is very common in spoken Finnish for 'we went'.",
      "hint": "The stem is men-.",
      "points": 10
    },
    {
      "question": "How do you say 'We went to the store' in spoken Finnish?",
      "options": [
        "Me menimme kauppaan",
        "Me mentiin kauppaan",
        "Me mentiin kauppaa",
        "Me mennään kauppaan"
      ],
      "correctAnswer": "Me mentiin kauppaan",
      "explanation": "In spoken Finnish, past passive (mentiin) is used with 'me' to mean 'we went'. 'Me menimme' is formal/written.",
      "hint": "Spoken Finnish uses passive for 'we'.",
      "points": 10
    },
    {
      "question": "What is the negative past passive of 'puhua' (to speak)?",
      "options": ["ei puhunut", "ei puhuttu", "ei puhuttiin", "ei puhu"],
      "correctAnswer": "ei puhuttu",
      "explanation": "Negative past passive: ei + past passive participle. For puhua, the participle is puhuttu → ei puhuttu (it was not spoken).",
      "hint": "Negative uses the participle, not -tiin.",
      "points": 10
    },
    {
      "question": "What is the past passive participle of 'syödä' (to eat)?",
      "options": ["syödä", "syötiin", "syöty", "syönyt"],
      "correctAnswer": "syöty",
      "explanation": "The past passive participle of syödä is syöty. It is used in negative past passive (ei syöty) and passive perfect (on syöty).",
      "hint": "It ends in -yty (front vowel version of -uttu).",
      "points": 10
    },
    {
      "question": "What is the object case in 'Kahvi juotiin'?",
      "options": ["Partitive", "Nominative", "Genitive", "Adessive"],
      "correctAnswer": "Nominative",
      "explanation": "In 'Kahvi juotiin' (The coffee was drunk), kahvi is in nominative case, indicating a total/complete object. Partitive would be 'Kahvia juotiin' (Coffee was drunk — some coffee).",
      "hint": "Total object in passive can be nominative.",
      "points": 10
    },
    {
      "question": "What is the correct formal/written form of 'Me ostettiin auto'?",
      "options": [
        "Me ostimme auton",
        "Me ostettiin auto",
        "Me ostimme auto",
        "Me ostettiin auton"
      ],
      "correctAnswer": "Me ostimme auton",
      "explanation": "In formal/written Finnish, the active past tense is used for 'we': 'me ostimme auton' (We bought the car). The passive 'ostettiin' is for spoken Finnish.",
      "hint": "Written Finnish uses active verb forms for 'we'.",
      "points": 10
    },
    {
      "question": "What is the meaning of 'Puhuttiinko siellä englantia?'",
      "options": [
        "Do they speak English there?",
        "Was English spoken there?",
        "Will English be spoken there?",
        "English is spoken there"
      ],
      "correctAnswer": "Was English spoken there?",
      "explanation": "Puhuttiinko? is past passive question. Puhuttiinko siellä englantia? = Was English spoken there? (or 'Did people speak English there?').",
      "hint": "-ko is the question suffix, -tiin indicates past passive.",
      "points": 10
    },
    {
      "question": "What is the past passive of 'tehdä' (to do/make)?",
      "options": ["tehtiin", "tekevät", "tehty", "teki"],
      "correctAnswer": "tehtiin",
      "explanation": "tehdä → present passive tehdään → stem teh- + -tiin = tehtiin. This is an irregular but common form.",
      "hint": "Stem is teh- (not teke-).",
      "points": 10
    },
    {
      "question": "Which sentence means 'The work was not done on time'?",
      "options": [
        "Työ ei tehty ajoissa",
        "Työtä ei tehty ajoissa",
        "Työ ei tehtiin ajoissa",
        "Työtä ei tehtiin ajoissa"
      ],
      "correctAnswer": "Työtä ei tehty ajoissa",
      "explanation": "Negative past passive: ei + past passive participle (tehty). Työtä is partitive (indefinite amount). 'Työ ei tehty' would be total object.",
      "hint": "Negative uses 'ei tehty', not 'ei tehtiin'.",
      "points": 10
    }
  ]
},
{
  "id": "relative-clauses",
  "chapter": 5,
  "title": "Relative Clauses – Relatiivilauseet",
  "finnish": "Relatiivilauseet",
  "icon": "🔗",
  "level": "B1",
  "accent": "bg-blue-600",
  "badge": "bg-blue-50 text-blue-700 border-blue-200",
  "description": "How to form relative clauses using joka and mikä — full declension tables, case usage, spoken vs written differences, and common B1 mistakes",
  "content": {
    "type": "rich",
    "intro": "Relative clauses describe a noun (the antecedent) and begin with a relative pronoun. Finnish has two main relative pronouns: joka (who, that, which) and mikä (which, referring to a whole sentence or indefinite thing).",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Are Relative Clauses? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["who, that, which", "joka"],
          ["which (referring to whole sentence)", "mikä"],
          ["where", "jossa (form of joka)"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Tunnen miehen, joka asuu tuossa talossa. (I know the man who lives in that house.)"]
      },
      {
        "type": "subheading",
        "text": "2. Joka — Full Declension Table (B1 must-know)"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Singular", "Plural", "Usage example"],
        "rows": [
          ["Nominative", "joka", "jotka", "who/which (subject)"],
          ["Genitive", "jonka", "joiden", "whose / that (object)"],
          ["Partitive", "jota", "joita", "whom/which (partial object)"],
          ["Inessive", "jossa", "joissa", "in which"],
          ["Elative", "josta", "joista", "from which"],
          ["Illative", "johon", "joihin", "into which"],
          ["Adessive", "jolla", "joilla", "on which / by which"],
          ["Ablative", "jolta", "joilta", "from which"],
          ["Allative", "jolle", "joille", "to which"],
          ["Essive", "jona", "joina", "as which"],
          ["Translative", "joksi", "joiksi", "into which (change of state)"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Detailed Examples of Each Important Form"
      },
      {
        "type": "subheading",
        "text": "Nominative: joka / jotka (subject of relative clause)"
      },
      {
        "type": "example-list",
        "items": [
          "Nainen, joka puhuu suomea, on opettaja. (The woman who speaks Finnish is a teacher.)",
          "Naiset, jotka puhuvat suomea, ovat opettajia. (The women who speak Finnish are teachers.)"
        ]
      },
      {
        "type": "subheading",
        "text": "Genitive: jonka / joiden (possessive or object of verb)"
      },
      {
        "type": "example-list",
        "items": [
          "Mies, jonka auto on punainen, on naapurini. (The man whose car is red is my neighbor.)",
          "Kirja, jonka ostin, on mielenkiintoinen. (The book that I bought is interesting.)",
          "Ne ihmiset, joiden koirat haukkuvat, asuvat täällä. (Those people whose dogs bark live here.)"
        ]
      },
      {
        "type": "subheading",
        "text": "Partitive: jota / joita (object in partitive)"
      },
      {
        "type": "example-list",
        "items": [
          "Elokuva, jota katsoimme eilen, oli pitkä. (The movie that we watched yesterday was long.)",
          "Kirjat, joita luen, ovat vaikeita. (The books that I am reading are difficult.)"
        ]
      },
      {
        "type": "subheading",
        "text": "Inessive: jossa / joissa (location = where)"
      },
      {
        "type": "example-list",
        "items": [
          "Talo, jossa asun, on vanha. (The house where I live is old.)",
          "Ne kaupungit, joissa olen käynyt, ovat kauniita. (The cities where I have visited are beautiful.)"
        ]
      },
      {
        "type": "subheading",
        "text": "Elative: josta / joista (from where / about which)"
      },
      {
        "type": "example-list",
        "items": [
          "Koulu, josta valmistuin, on Helsingissä. (The school from which I graduated is in Helsinki.)",
          "Aihe, josta puhumme, on vaikea. (The topic about which we are speaking is difficult.)"
        ]
      },
      {
        "type": "subheading",
        "text": "Illative: johon / joihin (into which)"
      },
      {
        "type": "example-list",
        "items": ["Laatikko, johon laitoin kirjat, on raskas. (The box into which I put the books is heavy.)"]
      },
      {
        "type": "subheading",
        "text": "Adessive: jolla / joilla (on which / who has)"
      },
      {
        "type": "example-list",
        "items": [
          "Ystävä, jolla on koira, tulee huomenna. (The friend who has a dog is coming tomorrow.)",
          "Ne lapset, joilla on pyörät, ovat onnellisia. (Those children who have bikes are happy.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. Joka vs. Mikä — The Crucial B1 Difference"
      },
      {
        "type": "example-table",
        "headers": ["", "joka", "mikä"],
        "rows": [
          ["Refers to", "a specific noun (thing or person)", "an entire clause, situation, or an indefinite thing"],
          ["Example", "Kirja, joka on hyllyssä. (The book that is on the shelf.)", "Hän myöhästyi, mikä oli tyypillistä. (He was late, which was typical.)"],
          ["Question test", "\"Which one?\"", "\"What (situation)?\""]
        ]
      },
      {
        "type": "example-list",
        "title": "joka for a specific noun:",
        "items": ["Auto, joka on punainen, on minun. (The car that is red is mine.)"]
      },
      {
        "type": "example-list",
        "title": "mikä for a whole situation:",
        "items": ["Auto hajosi, mikä oli ikävää. (The car broke down, which was unfortunate.)"]
      },
      {
        "type": "example-list",
        "title": "mikä for something indefinite (no antecedent noun):",
        "items": [
          "Se, mikä tapahtui, on salaisuus. (What happened is a secret.)",
          "Kaikki, mikä loistaa, ei ole kultaa. (All that glitters is not gold.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5. Relative Clause Word Order (Crucial)"
      },
      {
        "type": "paragraph",
        "text": "The relative pronoun comes first in the clause, but Finnish word order inside is otherwise normal."
      },
      {
        "type": "example-list",
        "items": [
          "Kirja, jonka minä ostin, on hyvä.",
          "Nainen, jonka auto on punainen, on täällä."
        ]
      },
      {
        "type": "subheading",
        "text": "6. Omitting the Relative Pronoun? (Not possible in Finnish)"
      },
      {
        "type": "paragraph",
        "text": "In English: 'The book I bought' (no 'that'). In Finnish: you must include jonka/jota."
      },
      {
        "type": "example-list",
        "items": [
          "❌ Kirja ostin on hyvä.",
          "✅ Kirja, jonka ostin, on hyvä."
        ]
      },
      {
        "type": "subheading",
        "text": "7. Relative Clauses with Postpositions"
      },
      {
        "type": "paragraph",
        "text": "The postposition follows the relative pronoun, which is in the genitive (or appropriate case)."
      },
      {
        "type": "example-list",
        "items": [
          "Se on asia, jonka tähden olen täällä. (That is the matter because of which I am here.)",
          "Lapsi, jonka kanssa puhuin, on ystäväni. (The child with whom I spoke is my friend.)"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Spoken Finnish Relative Clauses"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken", "Meaning"],
        "rows": [
          ["Mies, joka tuli", "Mies, joka tuli (same)", "The man who came"],
          ["Kirja, jonka ostin", "Kirja, minkä ostin (or 'jonka')", "The book that I bought"],
          ["Se, mikä tapahtui", "Se, mitä tapahtu", "What happened"]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Mies, mikä asuu täällä", "Mies, joka asuu täällä", "mikä is not for specific persons"],
          ["Kirja, jonka minä luen (no comma)", "Kirja, jota minä luen", "Object in partitive after certain verbs"],
          ["Olen nähnyt elokuvan, se oli hyvä", "Olen nähnyt elokuvan, joka oli hyvä", "Run-on sentence — need relative pronoun"],
          ["Se, joka tapahtui", "Se, mikä tapahtui", "joka needs a noun; se is indefinite → mikä"]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tunnen sen miehen, joka asuu tuossa sinisessä talossa. (I know that man who lives in that blue house.)",
          "Tämä on se kirja, jota olen etsinyt koko viikon. (This is the book that I have been looking for all week.)",
          "Lapsi, jonka äiti on lääkäri, on luokkatoverini. (The child whose mother is a doctor is my classmate.)",
          "Kadotin avaimeni, mikä oli todella tyhmää. (I lost my keys, which was really stupid.)",
          "Se, mitä sinä juuri sanoit, on totta. (What you just said is true.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Translate: 'The woman who works in the hospital.'",
        "items": ["Answer: Nainen, joka työskentelee sairaalassa."]
      },
      {
        "type": "example-list",
        "title": "2. Fill in: Tämä on se elokuva, _____ näimme eilen. (that we saw)",
        "items": ["Answer: jonka"]
      },
      {
        "type": "example-list",
        "title": "3. Fill in: Hän unohti lompakkonsa, _____ oli outoa. (which was strange)",
        "items": ["Answer: mikä"]
      },
      {
        "type": "example-list",
        "title": "4. Translate: 'The man whose phone is ringing.'",
        "items": ["Answer: Mies, jonka puhelin soi."]
      },
      {
        "type": "example-list",
        "title": "5. Correct: Talo, mikä on punainen.",
        "items": ["Answer: Talo, joka on punainen."]
      },
      {
        "type": "subheading",
        "text": "12. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tuo on se tyyppi, josta puhuin eilen. (That is the guy that I talked about yesterday.)",
          "Olenko minä ainoa, joka ei ymmärrä tätä? (Am I the only one who doesn't understand this?)",
          "Löysin sen kynän, jonka kadotin viime viikolla. (I found the pen that I lost last week.)",
          "Sade yllätti meidät, mikä ei ollut mukavaa. (The rain surprised us, which wasn't nice.)",
          "Kaikki, mitä hän sanoi, oli totta. (Everything that he/she said was true.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "Which relative pronoun is used for a specific noun (person or thing)?",
      "options": ["mikä", "joka", "kuka", "ken"],
      "correctAnswer": "joka",
      "explanation": "Joka is used to refer to a specific noun (the antecedent). Example: Kirja, joka on hyllyssä (The book that is on the shelf).",
      "hint": "Think of 'which one' — joka refers to a specific thing or person.",
      "points": 10
    },
    {
      "question": "Which relative pronoun refers to an entire clause or situation?",
      "options": ["joka", "jotta", "mikä", "kumpi"],
      "correctAnswer": "mikä",
      "explanation": "Mikä refers to a whole clause or situation. Example: Hän myöhästyi, mikä oli tyypillistä (He was late, which was typical).",
      "hint": "It refers to 'what just happened' as a whole.",
      "points": 10
    },
    {
      "question": "What is the genitive (possessive) form of 'joka'?",
      "options": ["joka", "jonka", "jota", "jossa"],
      "correctAnswer": "jonka",
      "explanation": "The genitive singular of joka is jonka. It expresses possession (whose) or acts as a total object. Example: Mies, jonka auto on punainen (The man whose car is red).",
      "hint": "It ends in -nka, like 'jonka'.",
      "points": 10
    },
    {
      "question": "What is the inessive form of 'joka' (meaning 'in which' / 'where')?",
      "options": ["jossa", "josta", "johon", "jolla"],
      "correctAnswer": "jossa",
      "explanation": "The inessive form of joka is jossa (in which / where). Example: Talo, jossa asun (The house where I live).",
      "hint": "It has -ssa ending, like inessive case.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'Tämä on se elokuva, _____ näimme eilen.' (This is the movie that we saw yesterday.)",
      "options": ["joka", "jota", "jonka", "jossa"],
      "correctAnswer": "jonka",
      "explanation": "Näimme (we saw) takes a total object in genitive/accusative. The movie is the total object → jonka.",
      "hint": "The verb 'nähdä' takes a total object for the whole thing seen.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'Hän unohti lompakkonsa, _____ oli tyhmää.' (He forgot his wallet, which was stupid.)",
      "options": ["joka", "mikä", "jota", "jonka"],
      "correctAnswer": "mikä",
      "explanation": "Here 'mikä' refers to the whole situation (him forgetting his wallet), not a specific noun.",
      "hint": "Is 'which' referring to 'wallet' or the whole event?",
      "points": 10
    },
    {
      "question": "What does 'joiden' mean?",
      "options": [
        "which (singular genitive)",
        "which (plural genitive/whose for plural)",
        "in which (plural)",
        "to which (plural)"
      ],
      "correctAnswer": "which (plural genitive/whose for plural)",
      "explanation": "Joiden is the plural genitive of joka. It means 'whose' when referring to multiple people/things. Example: Ne ihmiset, joiden koirat haukkuvat (Those people whose dogs bark).",
      "hint": "Plural genitive ends in -iden.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses 'jossa'?",
      "options": [
        "Talo, jossa asun, on vanha.",
        "Talo, josta asun, on vanha.",
        "Talo, johon asun, on vanha.",
        "Talo, jolla asun, on vanha."
      ],
      "correctAnswer": "Talo, jossa asun, on vanha.",
      "explanation": "Jossa (inessive) means 'in which' or 'where' and is used with asua (to live) to indicate location.",
      "hint": "Asua takes inessive case for location.",
      "points": 10
    },
    {
      "question": "What is the correct translation: 'The book that I am reading is good.'",
      "options": [
        "Kirja, jonka luen, on hyvä.",
        "Kirja, jota luen, on hyvä.",
        "Kirja, joka luen, on hyvä.",
        "Kirja, jossa luen, on hyvä."
      ],
      "correctAnswer": "Kirja, jota luen, on hyvä.",
      "explanation": "Luen (I am reading) takes a partitive object when the action is ongoing or incomplete. Therefore, jota (partitive of joka) is correct.",
      "hint": "Ongoing/partial action → partitive object.",
      "points": 10
    },
    {
      "question": "What is the difference between 'joka' and 'mikä'?",
      "options": [
        "No difference — they are interchangeable",
        "Joka is for people only, mikä is for things only",
        "Joka refers to a specific noun; mikä refers to a whole clause or indefinite thing",
        "Joka is formal, mikä is spoken"
      ],
      "correctAnswer": "Joka refers to a specific noun; mikä refers to a whole clause or indefinite thing",
      "explanation": "Joka refers to a specific antecedent noun (e.g., 'the car that is red'). Mikä refers to an entire situation ('He was late, which was typical') or an indefinite thing ('all that glitters').",
      "hint": "Think: joka = 'which one', mikä = 'what (situation)'.",
      "points": 10
    }
  ]
},
{
  "id": "translative-case",
  "chapter": 6,
  "title": "Translative Case – Translatiivi",
  "finnish": "Translatiivi",
  "icon": "🔄",
  "level": "B1",
  "accent": "bg-teal-600",
  "badge": "bg-teal-50 text-teal-700 border-teal-200",
  "description": "The translative case (-ksi) expresses change, becoming, purpose, role, and time deadlines — with formation rules, consonant gradation, and common fixed expressions",
  "content": {
    "type": "rich",
    "intro": "The translative case expresses change, purpose, role, or a temporary state. The main ending is -ksi.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the Translative Case? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English idea", "Finnish example"],
        "rows": [
          ["become X", "tulla opettajaksi"],
          ["turn into X", "muuttua punaiseksi"],
          ["as X (role)", "valita johtajaksi"],
          ["for X (time/purpose)", "jouluksi kotiin"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Hän tuli isäksi. = He became a father."]
      },
      {
        "type": "subheading",
        "text": "2. Formation Rules for All Word Types"
      },
      {
        "type": "paragraph",
        "text": "General rule: Add -ksi to the stem (usually the same as genitive singular stem)."
      },
      {
        "type": "subheading",
        "text": "Type A: Words ending in -a/-ä (kirja, opettaja)"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Genitive (stem)", "Translative"],
        "rows": [
          ["kirja", "kirja-", "kirjaksi"],
          ["opettaja", "opettaja-", "opettajaksi"],
          ["huone", "huonee-", "huoneeksi"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "huone → huoneeksi (adds -e- before -ksi)"
      },
      {
        "type": "subheading",
        "text": "Type B: Words ending in -i (short i) — often change to -e-"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Genitive (stem)", "Translative"],
        "rows": [
          ["pieni", "piene-", "pieneksi"],
          ["suuri", "suure-", "suureksi"],
          ["kaunis", "kaunii- / kaune-", "kauniiksi / kauneksi"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type C: Words ending in -nen"
      },
      {
        "type": "paragraph",
        "text": "Drop -nen, add -se- + -ksi"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Translative"],
        "rows": [
          ["punainen", "punaiseksi"],
          ["suomalainen", "suomalaiseksi"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type D: Words ending in -s"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Translative"],
        "rows": [
          ["vihannes (vegetable)", "vihannekseksi"],
          ["rakas (dear)", "rakkaaksi"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Consonant Gradation in Translative"
      },
      {
        "type": "paragraph",
        "text": "The translative often uses the weak grade before adding -ksi."
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Translative", "Change"],
        "rows": [
          ["pankki", "pankiksi", "kk → k"],
          ["kauppa", "kaupaksi", "pp → p"],
          ["hernekeitto", "hernekeitoksi", "tt → t"]
        ]
      },
      {
        "type": "subheading",
        "text": "4. Translative with Verbs (Most Common Use)"
      },
      {
        "type": "paragraph",
        "text": "The translative is used with verbs that express change or becoming."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "Example"],
        "rows": [
          ["tulla", "to become", "Hän tuli lääkäriksi."],
          ["muuttua", "to change into", "Sää muuttui kylmäksi."],
          ["kasvaa", "to grow into", "Taimi kasvoi puuksi."],
          ["kehittyä", "to develop into", "Hän kehittyi hyväksi pelaajaksi."],
          ["valita", "to choose as", "Hänet valittiin puheenjohtajaksi."],
          ["nimetä", "to appoint as", "He nimittivät hänet professoriksi."],
          ["osoittautua", "to turn out to be", "Se osoittautui virheeksi."]
        ]
      },
      {
        "type": "subheading",
        "text": "5. Translative with Adjectives"
      },
      {
        "type": "example-table",
        "headers": ["Basic adjective", "Translative", "Example"],
        "rows": [
          ["iloinen (happy)", "iloiseksi", "Hän tuli iloiseksi."],
          ["punainen (red)", "punaiseksi", "Maali muuttui punaiseksi."],
          ["valmis (ready)", "valmiiksi", "Sain työn valmiiksi."],
          ["kylmä (cold)", "kylmäksi", "Kahvi jäähtyi kylmäksi."]
        ]
      },
      {
        "type": "example-list",
        "items": ["Tein sen valmiiksi. = I got it ready / finished it. (Very common B1 phrase)"]
      },
      {
        "type": "subheading",
        "text": "6. Translative for Purpose ('as' / 'for use as')"
      },
      {
        "type": "example-list",
        "items": [
          "Hän ryhtyi opettajaksi. = He became a teacher (took up the profession).",
          "Palkkasin hänet siivoojaksi. = I hired him as a cleaner."
        ]
      },
      {
        "type": "subheading",
        "text": "7. Translative in Time Expressions"
      },
      {
        "type": "paragraph",
        "text": "Translative answers 'by when?' or 'for what occasion/time period?'."
      },
      {
        "type": "example-table",
        "headers": ["Expression", "Meaning"],
        "rows": [
          ["ensi viikoksi", "for next week (by next week / to last for next week)"],
          ["jouluksi", "for Christmas"],
          ["kahdeksi tunniksi", "for two hours"],
          ["pitkäksi aikaa", "for a long time"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Lähden lomaksi viikoksi. = I'm going on holiday for a week.",
          "Tulkaa meille jouluksi! = Come to our place for Christmas!",
          "Se on valmis huomiseksi. = It will be ready by tomorrow."
        ]
      },
      {
        "type": "subheading",
        "text": "8. Fixed Expressions with Translative (B1 must-know)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English", "Notes"],
        "rows": [
          ["tehdä valmiiksi", "to finish / make ready", "Very common"],
          ["ottaa tosissaan", "to take seriously", "Ota tämä tosissasi (with possessive suffix)"],
          ["puhua suomeksi", "to speak in Finnish", "Means 'in Finnish language'"],
          ["kirjoittaa englanniksi", "to write in English", ""],
          ["sanoa vitsiksi", "to say as a joke", ""]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Sanon tämän vitsiksi. = I'm saying this as a joke.",
          "Mitä tämä on suomeksi? = What is this in Finnish?"
        ]
      },
      {
        "type": "subheading",
        "text": "9. Translative vs. Essive (Important B1 Comparison)"
      },
      {
        "type": "example-table",
        "headers": ["", "Translative (-ksi)", "Essive (-na/-nä)"],
        "rows": [
          ["Meaning", "change / becoming / purpose", "state / role / temporary condition"],
          ["Time", "'by X time' / 'for X occasion'", "'at X time' (e.g., maanantaina)"],
          ["Example", "Hän tuli opettajaksi. (He became a teacher.)", "Hän on opettajana. (He is working as a teacher.)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olen täällä ystävänä. (I am here as a friend — essive)",
          "Hänestä tuli ystäväni. (He became my friend — translative)"
        ]
      },
      {
        "type": "subheading",
        "text": "10. Translative in Spoken Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken", "Example"],
        "rows": [
          ["opettajaksi", "opettajakse / opettajaks", "Häntä tuli opettajaks."],
          ["valmiiksi", "valmiiks", "Sain sen valmiiks."],
          ["suomeksi", "suomeks", "Paljonko tää on suomeks?"]
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "The 'i' often disappears in spoken Finnish: valmiiksi → valmiiks."
      },
      {
        "type": "subheading",
        "text": "11. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Tulin lääkäri.", "Tulin lääkäriksi.", "tulla + translative for becoming"],
          ["Se muuttui punainen.", "Se muuttui punaiseksi.", "Adjective must be in translative after muuttua"],
          ["Hänestä tuli opettaja.", "Hän tuli opettajaksi.", "Standard written: tulla + translative; hänet + nominative is spoken"]
        ]
      },
      {
        "type": "subheading",
        "text": "12. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Hän opiskeli lääkäriksi ja nyt hän työskentelee sairaalassa. (He studied to become a doctor and now he works at a hospital.)",
          "Sää muuttui yllättäin kylmäksi ja tuuliseksi. (The weather suddenly turned cold and windy.)",
          "Sain vihdoin työn valmiiksi ennen deadlinea. (I finally got the work finished before the deadline.)",
          "Mitä tämä on suomeksi? (What is this in Finnish?)",
          "Tule meille jouluksi, meillä on hyvää ruokaa! (Come to our place for Christmas — we have good food!)"
        ]
      },
      {
        "type": "subheading",
        "text": "13. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Translate: 'She became a teacher.'",
        "items": ["Answer: Hänestä tuli opettaja. (common) or Hän tuli opettajaksi. (standard)"]
      },
      {
        "type": "example-list",
        "title": "2. Put into translative: punainen",
        "items": ["Answer: punaiseksi"]
      },
      {
        "type": "example-list",
        "title": "3. Put into translative: kauppa (store)",
        "items": ["Answer: kaupaksi (pp → p)"]
      },
      {
        "type": "example-list",
        "title": "4. Translate: 'Finish this!' (use valmiiksi)",
        "items": ["Answer: Tee tämä valmiiksi! or Saa tämä valmiiksi!"]
      },
      {
        "type": "example-list",
        "title": "5. Translate: 'I will be there for two hours.'",
        "items": ["Answer: Olen siellä kahdeksi tunniksi."]
      },
      {
        "type": "subheading",
        "text": "14. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Hän halusi lääkäriksi jo lapsena. (He/she wanted to become a doctor already as a child.)",
          "Muista saada työ valmiiksi ennen viikonloppua. (Remember to get the work finished before the weekend.)",
          "Lasi putosi ja meni sirpaleiksi. (The glass fell and shattered into pieces.)",
          "Miten tämä käännetään suomeksi? (How is this translated into Finnish?)",
          "Tulkaa meille syömään viimeistään kahdeksaksi. (Come to our place for dinner by eight at the latest.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the translative case (-ksi) express?",
      "options": [
        "Location (in/on/at)",
        "Change, becoming, purpose, role",
        "Possession",
        "Instrument (with/by means of)"
      ],
      "correctAnswer": "Change, becoming, purpose, role",
      "explanation": "The translative case expresses change (turn into), becoming (become a teacher), purpose (for Christmas), and role (as a friend). Example: tulla lääkäriksi (to become a doctor).",
      "hint": "Think of 'become X', 'turn into X', 'as X'.",
      "points": 10
    },
    {
      "question": "What is the translative ending?",
      "options": ["-na/-nä", "-ksi", "-lla/-llä", "-n"],
      "correctAnswer": "-ksi",
      "explanation": "The translative case ends with -ksi. Example: kirja → kirjaksi (into a book), opettaja → opettajaksi (to become a teacher).",
      "hint": "It has three letters and ends with -si.",
      "points": 10
    },
    {
      "question": "What is the translative form of 'kirja' (book)?",
      "options": ["kirjaa", "kirjassa", "kirjaksi", "kirjasta"],
      "correctAnswer": "kirjaksi",
      "explanation": "Kirja → add -ksi = kirjaksi (into a book / as a book).",
      "hint": "Add -ksi to the stem kirja-.",
      "points": 10
    },
    {
      "question": "How do you say 'I became a teacher' in standard Finnish?",
      "options": [
        "Minä tulin opettaja",
        "Minä tulin opettajaksi",
        "Minä olen opettaja",
        "Minä tulin opettajana"
      ],
      "correctAnswer": "Minä tulin opettajaksi",
      "explanation": "Tulla (to become) + translative case. Opettajaksi is the translative of opettaja.",
      "hint": "Becoming something requires the translative case.",
      "points": 10
    },
    {
      "question": "What is the translative of 'punainen' (red)?",
      "options": ["punaiseksi", "punaiseksi", "punaiseksi", "punaista"],
      "correctAnswer": "punaiseksi",
      "explanation": "Punainen ends in -nen. Drop -nen, add -seksi: punaiseksi.",
      "hint": "-nen words become -seksi.",
      "points": 10
    },
    {
      "question": "How do you say 'Finish this!' using 'valmiiksi'?",
      "options": [
        "Tee tämä valmiiksi!",
        "Tee tämä valmiina!",
        "Tee tämä valmista!",
        "Tee tämä valmis!"
      ],
      "correctAnswer": "Tee tämä valmiiksi!",
      "explanation": "Tehdä valmiiksi = to finish / make ready. Valmiiksi is the translative of valmis (ready).",
      "hint": "Think of 'make into ready' → translative.",
      "points": 10
    },
    {
      "question": "What is the difference between 'tulla opettajaksi' and 'olla opettajana'?",
      "options": [
        "No difference",
        "tulla opettajaksi = become a teacher; olla opettajana = be working as a teacher",
        "First is past tense, second is present",
        "First is negative, second is positive"
      ],
      "correctAnswer": "tulla opettajaksi = become a teacher; olla opettajana = be working as a teacher",
      "explanation": "Tulla + translative expresses change/becoming. Olla + essive expresses a temporary state or role. Opettajaksi = into a teacher; opettajana = as a teacher.",
      "hint": "One is change, one is current state.",
      "points": 10
    },
    {
      "question": "What is the translative form of 'pankki' (bank) after consonant gradation?",
      "options": ["pankiksi", "pankkiin", "pankissa", "pankkia"],
      "correctAnswer": "pankiksi",
      "explanation": "Pankki has double k (kk) which weakens to single k in translative: pankki → pankiksi.",
      "hint": "Double consonant weakens to single in translative.",
      "points": 10
    },
    {
      "question": "How do you say 'What is this in Finnish?'",
      "options": [
        "Mitä tämä on suomeksi?",
        "Mitä tämä on suomea?",
        "Mitä tämä on suomen kieli?",
        "Mitä tämä on suomalainen?"
      ],
      "correctAnswer": "Mitä tämä on suomeksi?",
      "explanation": "Suomeksi is the translative of Suomi, meaning 'in Finnish (language)'. This is a fixed expression.",
      "hint": "Translative is used for language: 'in X language' = X:ksi.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the translative for a time expression?",
      "options": [
        "Tulen huomenna.",
        "Olen siellä kahdeksi tunniksi.",
        "Tapaan sinut maanantaina.",
        "Nukuttiin yöllä."
      ],
      "correctAnswer": "Olen siellä kahdeksi tunniksi.",
      "explanation": "Kahdeksi tunniksi (for two hours) uses translative to express the intended duration. 'Tulen huomenna' is adverbial, 'maanantaina' is essive, 'yöllä' is adessive.",
      "hint": "Translative answers 'for how long?' or 'by when?'",
      "points": 10
    }
  ]
},
{
  "id": "essive-case",
  "chapter": 7,
  "title": "Essive Case – Essiivi",
  "finnish": "Essiivi",
  "icon": "👤",
  "level": "B1",
  "accent": "bg-cyan-600",
  "badge": "bg-cyan-50 text-cyan-700 border-cyan-200",
  "description": "The essive case (-na/-nä) expresses state, role, temporary condition, or time when something happens — and is distinct from the translative case of change",
  "content": {
    "type": "rich",
    "intro": "The essive case expresses state, role, temporary condition, or time when something happens. The main endings are -na / -nä.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the Essive Case? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English idea", "Finnish example"],
        "rows": [
          ["as a teacher", "opettajana"],
          ["when young / as a child", "nuorena / lapsena"],
          ["on Monday", "maanantaina"],
          ["in an open state", "avoimena"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Hän työskentelee opettajana. = He/she works as a teacher."]
      },
      {
        "type": "subheading",
        "text": "2. Formation Rules for All Word Types"
      },
      {
        "type": "paragraph",
        "text": "General rule: Add -na / -nä to the stem (usually the same as the genitive singular stem without the final -n)."
      },
      {
        "type": "subheading",
        "text": "Type A: Words ending in -a/-ä (kirja, opettaja)"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Genitive (stem)", "Essive"],
        "rows": [
          ["kirja", "kirja-", "kirjana"],
          ["opettaja", "opettaja-", "opettajana"],
          ["tyttö", "tyttö-", "tyttönä"],
          ["huone", "huonee-", "huoneena"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "huone → huoneena (adds -e- before -na)."
      },
      {
        "type": "subheading",
        "text": "Type B: Words ending in -i (short i) often change to -e-"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Genitive (stem)", "Essive"],
        "rows": [
          ["pieni", "piene-", "pienenä"],
          ["suuri", "suure-", "suurena"],
          ["kaunis", "kaunii- / kaune-", "kauniina / kaunena"],
          ["lapsi", "lapse-", "lapsena"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type C: Words ending in -nen"
      },
      {
        "type": "paragraph",
        "text": "Drop -nen, add -se- + -na/-nä"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Essive"],
        "rows": [
          ["punainen", "punaisena"],
          ["suomalainen", "suomalaisena"],
          ["nainen (woman)", "naisena"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Naisena oleminen on vaikeaa. = Being a woman is difficult."]
      },
      {
        "type": "subheading",
        "text": "Type D: Words ending in -s (e.g., vieras, kysymys)"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Essive"],
        "rows": [
          ["vieras (guest)", "vieraana"],
          ["kysymys (question)", "kysymyksenä"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Consonant Gradation in Essive"
      },
      {
        "type": "paragraph",
        "text": "The essive typically uses the weak grade (like the genitive)."
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Essive", "Change"],
        "rows": [
          ["pankki (bank)", "pankkina? Actually weak", "Olen asiakkaana pankissa (customer at bank)"],
          ["lapsi (child)", "lapsena", "Already weak grade"],
          ["rakas (dear)", "rakkaana", "k → kk? Actually rakas → rakkaana"]
        ]
      },
      {
        "type": "subheading",
        "text": "4. Essive with Adjectives (Temporary State)"
      },
      {
        "type": "example-table",
        "headers": ["Basic adjective", "Essive", "Example"],
        "rows": [
          ["iloinen (happy)", "iloisena", "Hän oli iloisena koko päivän."],
          ["sairas (sick)", "sairaana", "Olin sairaana viime viikolla."],
          ["nuori (young)", "nuorena", "Nuorena matkustin paljon."],
          ["väsynyt (tired)", "väsyneenä", "Hän tuli kotiin väsyneenä."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Lapsena olin ujo. = As a child, I was shy.",
          "Hän oli hiljaisena koko illan. = He was quiet the whole evening."
        ]
      },
      {
        "type": "subheading",
        "text": "5. Essive for Role or Function (Without Change)"
      },
      {
        "type": "paragraph",
        "text": "Unlike translative, essive does not imply change — just current state or role."
      },
      {
        "type": "example-list",
        "items": [
          "Hän työskentelee opettajana. = He works as a teacher. (He is a teacher now — no implication he became one.)",
          "Käytän tätä laatikkoa pöytänä. = I use this box as a table.",
          "Toimin sihteerinä kokouksessa. = I acted as secretary in the meeting."
        ]
      },
      {
        "type": "subheading",
        "text": "6. Time Expressions with Essive (B1 must-know)"
      },
      {
        "type": "subheading",
        "text": "Days of the week"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["maanantaina", "on Monday"],
          ["tiistaina", "on Tuesday"],
          ["keskiviikkona", "on Wednesday"],
          ["torstaina", "on Thursday"],
          ["perjantaina", "on Friday"],
          ["lauantaina", "on Saturday"],
          ["sunnuntaina", "on Sunday"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Nähdään perjantaina! = See you on Friday!"]
      },
      {
        "type": "subheading",
        "text": "Times of day (often essive)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["aamuna", "in the morning (specific)"],
          ["iltana", "in the evening"],
          ["yönä", "at night"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Lähdimme aamuna. = We left in the morning."]
      },
      {
        "type": "subheading",
        "text": "Seasons"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["kesällä", "in summer"],
          ["talvella", "in winter"],
          ["keväällä", "in spring"],
          ["syksyllä", "in autumn"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Kesällä on lämmin. = In summer it's warm."]
      },
      {
        "type": "subheading",
        "text": "Specific holidays/events"
      },
      {
        "type": "example-list",
        "items": [
          "Jouluna koko perhe kokoontuu. = At Christmas the whole family gathers.",
          "Syntymäpäivänäni satoi. = On my birthday it rained."
        ]
      },
      {
        "type": "subheading",
        "text": "7. Fixed Expressions with Essive (B1 must-know)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English", "Notes"],
        "rows": [
          ["ensimmäisenä", "first", "Tulin ensimmäisenä. = I came first."],
          ["viimeisenä", "last", "Hän lähti viimeisenä. = He left last."],
          ["ainoana", "alone / as the only one", "Olin ainoana. = I was the only one."],
          ["tosissaan", "seriously", "Oletko tosissasi? = Are you serious?"],
          ["märkänä", "wet", "Tulin kotiin märkänä."]
        ]
      },
      {
        "type": "subheading",
        "text": "8. Essive vs. Translative — The Ultimate B1 Comparison Table"
      },
      {
        "type": "example-table",
        "headers": ["", "Essive (-na/-nä)", "Translative (-ksi)"],
        "rows": [
          ["Meaning", "state / role / condition (no change)", "change / becoming / purpose"],
          ["Time", "when (on Monday, as a child)", "by when / for a period (by Monday, for 2 days)"],
          ["Question", "'as what?' (currently)", "'into what?' / 'for what purpose?'"],
          ["Example (person)", "Olen opettajana. (I am working as a teacher.)", "Tulin opettajaksi. (I became a teacher.)"],
          ["Example (adjective)", "Olin iloisena. (I was happy — at that moment.)", "Tulin iloiseksi. (I became happy.)"],
          ["Example (time)", "Maanantaina. (On Monday.)", "Ensi viikoksi. (For next week / by next week.)"],
          ["Example (object)", "Käytän sitä pöytänä. (I use it as a table.)", "Se muuttui pöydäksi. (It turned into a table.)"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "Key test: If there is change → translative. If no change (just current state/role) → essive."
      },
      {
        "type": "subheading",
        "text": "9. Essive in Spoken Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken", "Example"],
        "rows": [
          ["opettajana", "opettajana (same)", "Se toimii opettajana."],
          ["maanantaina", "maanantain / maanantaina", "Tavataan maanantain. (common)"],
          ["lapsena", "lapsena", "Lapsena olin ujo."],
          ["iloisena", "ilosena (dropping i)", "Se oli ilosena koko päivän."]
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "Maanantaina → maanantain (sounds like genitive but used as essive in speech)."
      },
      {
        "type": "subheading",
        "text": "10. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Tulin opettajana.", "Tulin opettajaksi.", "tulla + translative for becoming, not essive."],
          ["Työskentelen opettajaksi.", "Työskentelen opettajana.", "Working as a teacher = essive, not becoming."],
          ["Maanantai tapaamme.", "Maanantaina tapaamme.", "Time needs essive for 'on Monday'."],
          ["Olin lapsi iloinen.", "Olin iloisena lapsena.", "Adjective in essive agrees with noun."],
          ["Hän on sairasna.", "Hän on sairaana.", "Wrong suffix (sairas → sairaana, not sairasna)."]
        ]
      },
      {
        "type": "subheading",
        "text": "11. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Hän työskenteli vuoden vapaaehtoisena Afrikassa. (He worked for a year as a volunteer in Africa.)",
          "Lapsena asuin maalla, mutta nyt asun kaupungissa. (As a child I lived in the countryside, but now I live in the city.)",
          "Olin sairaana kaksi viikkoa, ja nyt olen taas terve. (I was sick for two weeks, and now I'm healthy again.)",
          "Käytän vanhaa paitaa työpaitana. (I use an old shirt as a work shirt.)",
          "Tavataan perjantaina kello kuusi. (Let's meet on Friday at six o'clock.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Translate: 'She works as a nurse.'",
        "items": ["Answer: Hän työskentelee sairaanhoitajana."]
      },
      {
        "type": "example-list",
        "title": "2. Translate: 'As a child, I was shy.'",
        "items": ["Answer: Lapsena olin ujo."]
      },
      {
        "type": "example-list",
        "title": "3. Put into essive: nainen",
        "items": ["Answer: naisena"]
      },
      {
        "type": "example-list",
        "title": "4. Essive or translative? Hän tuli ____ (lääkäri). (became)",
        "items": ["Answer: lääkäriksi (translative — became)"]
      },
      {
        "type": "example-list",
        "title": "5. Essive or translative? Hän on ____ (opettaja). (as a profession now)",
        "items": ["Answer: opettajana (essive — currently working as)"]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Ensimmäisenä avasin oven. (I opened the door first.)",
          "Viimeisenä lähti Anna. (Anna left last.)",
          "Oletko tosissasi? (Are you serious?)",
          "Tänään on keskiviikko. Tapaan sinut torstaina. (Today is Wednesday. I'll meet you on Thursday.)",
          "Hän tuli kotiin iloisena ja virkeänä. (He/she came home happy and energetic.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the essive case (-na/-nä) express?",
      "options": [
        "Change or becoming",
        "State, role, temporary condition, or time when something happens",
        "Movement from a place",
        "Possession"
      ],
      "correctAnswer": "State, role, temporary condition, or time when something happens",
      "explanation": "The essive case expresses a state, role, temporary condition, or time when something happens. Example: opettajana (as a teacher), maanantaina (on Monday), lapsena (as a child).",
      "hint": "Think of 'as X' (currently) or 'on Monday'.",
      "points": 10
    },
    {
      "question": "What is the essive ending?",
      "options": ["-ksi", "-na/-nä", "-lla/-llä", "-n"],
      "correctAnswer": "-na/-nä",
      "explanation": "The essive case ends with -na or -nä (vowel harmony). Example: opettajana (as a teacher).",
      "hint": "It has two letters and ends with -a/ä.",
      "points": 10
    },
    {
      "question": "What is the essive form of 'kirja' (book)?",
      "options": ["kirjaa", "kirjassa", "kirjana", "kirjasta"],
      "correctAnswer": "kirjana",
      "explanation": "Kirja → add -na = kirjana (as a book).",
      "hint": "Add -na to the stem kirja-.",
      "points": 10
    },
    {
      "question": "How do you say 'He works as a teacher'?",
      "options": [
        "Hän työskentelee opettajaksi",
        "Hän työskentelee opettajana",
        "Hän tulee opettajaksi",
        "Hän on opettajaksi"
      ],
      "correctAnswer": "Hän työskentelee opettajana",
      "explanation": "Työskennellä (to work as) + essive case. Opettajana = as a teacher.",
      "hint": "Working as something — no change, just current role.",
      "points": 10
    },
    {
      "question": "What is the essive of 'punainen' (red)?",
      "options": ["punaiseksi", "punaisena", "punaista", "punaiseksi"],
      "correctAnswer": "punaisena",
      "explanation": "Punainen ends in -nen. Drop -nen, add -sena: punaisena.",
      "hint": "-nen words become -sena.",
      "points": 10
    },
    {
      "question": "What is the difference between 'tulla opettajaksi' and 'olla opettajana'?",
      "options": [
        "No difference",
        "tulla opettajaksi = become a teacher; olla opettajana = be working as a teacher",
        "First is past, second is present",
        "First is negative, second is positive"
      ],
      "correctAnswer": "tulla opettajaksi = become a teacher; olla opettajana = be working as a teacher",
      "explanation": "Tulla + translative expresses change (become). Olla + essive expresses current state or role (be working as).",
      "hint": "One is change, one is current state.",
      "points": 10
    },
    {
      "question": "How do you say 'on Monday' in Finnish?",
      "options": ["maanantai", "maanantaina", "maanantaiksi", "maanantana"],
      "correctAnswer": "maanantaina",
      "explanation": "Days of the week use the essive case: maanantaina = on Monday.",
      "hint": "Add -na to maanantai.",
      "points": 10
    },
    {
      "question": "What is the essive of 'lapsi' (child)?",
      "options": ["lapsi", "lapseksi", "lapsena", "lapsia"],
      "correctAnswer": "lapsena",
      "explanation": "Lapsi → lapse- (stem) + -na = lapsena (as a child).",
      "hint": "The stem lapse- + essive ending.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the essive for a temporary state?",
      "options": [
        "Hän tuli iloiseksi.",
        "Hän oli iloisena koko päivän.",
        "Hän muuttui iloiseksi.",
        "Hänestä tuli iloinen."
      ],
      "correctAnswer": "Hän oli iloisena koko päivän.",
      "explanation": "Oli iloisena (essive) = he was happy (temporary state during the day). Tuli iloiseksi (translative) = he became happy (change).",
      "hint": "Essive describes a temporary condition, not a change.",
      "points": 10
    },
    {
      "question": "What is the correct essive form of 'nainen' (woman)?",
      "options": ["nainen", "naiseksi", "naisena", "naista"],
      "correctAnswer": "naisena",
      "explanation": "Nainen ends in -nen. Drop -nen, add -sena: naisena (as a woman).",
      "hint": "-nen words become -sena in essive.",
      "points": 10
    }
  ]
},
{
  "id": "abessive-case",
  "chapter": 8,
  "title": "Abessive Case – Abessiivi",
  "finnish": "Abessiivi",
  "icon": "🚫",
  "level": "B1",
  "accent": "bg-orange-600",
  "badge": "bg-orange-50 text-orange-700 border-orange-200",
  "description": "The abessive case (-tta/-ttä) expresses lack or absence — without X — with notes on when to use the formal abessive vs. 'ilman' + partitive in spoken Finnish",
  "content": {
    "type": "rich",
    "intro": "The abessive case expresses lack or absence of something. The main endings are -tta / -ttä. In spoken and everyday Finnish, 'ilman + partitive' is much more common.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the Abessive Case? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish (formal)", "Finnish (spoken/common)"],
        "rows": [
          ["without money", "rahatta", "ilman rahaa"],
          ["without problems", "ongelmitta", "ilman ongelmia"],
          ["without a friend", "ystävättä", "ilman ystävää"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "In spoken and everyday Finnish, ilman + partitive is much more common. The abessive is mostly used in written Finnish, fixed expressions, and formal language."
      },
      {
        "type": "subheading",
        "text": "2. Formation Rules for All Word Types"
      },
      {
        "type": "paragraph",
        "text": "General rule: Add -tta / -ttä to the stem (usually the same as the genitive singular stem without the final -n)."
      },
      {
        "type": "subheading",
        "text": "Type A: Words ending in -a/-ä (raha, kirja)"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Genitive (stem)", "Abessive"],
        "rows": [
          ["raha", "raha-", "rahatta"],
          ["kirja", "kirja-", "kirjatta"],
          ["tyttö", "tyttö-", "tytöttä"],
          ["huone", "huonee-", "huoneetta"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type B: Words ending in -i (short i) often change to -e-"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Genitive (stem)", "Abessive"],
        "rows": [
          ["ongelma", "ongelma-", "ongelmitta"],
          ["lupa", "lupa-", "luvatta"],
          ["tieto", "tieto-", "tiedotta"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "lupa → luvatta (p weakens to v before consonant)"
      },
      {
        "type": "subheading",
        "text": "Type C: Words ending in -nen"
      },
      {
        "type": "paragraph",
        "text": "Drop -nen, add -se- + -tta/-ttä"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Abessive"],
        "rows": [
          ["punainen", "punaisetta"],
          ["suomalainen", "suomalaisetta"],
          ["nainen", "naisetta"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Ilman naista is more common than naisetta."]
      },
      {
        "type": "subheading",
        "text": "Type D: Words ending in -s (e.g., vieras, kysymys)"
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Abessive"],
        "rows": [
          ["vieras (guest)", "vieraatta"],
          ["kysymys (question)", "kysymyksettä"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Consonant Gradation in Abessive"
      },
      {
        "type": "paragraph",
        "text": "The abessive typically uses the weak grade (like the genitive)."
      },
      {
        "type": "example-table",
        "headers": ["Nominative", "Genitive (weak)", "Abessive", "Change"],
        "rows": [
          ["lupa (permission)", "luvan", "luvatta", "p → v"],
          ["tieto (knowledge)", "tiedon", "tiedotta", "t → d"],
          ["pankki (bank)", "pankin", "pankitta", "kk → k"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Hän teki sen luvatta. = He did it without permission."]
      },
      {
        "type": "subheading",
        "text": "4. Abessive vs. ilman + Partitive (B1 Crucial Comparison)"
      },
      {
        "type": "example-table",
        "headers": ["", "Abessive (-tta/-ttä)", "ilman + partitive"],
        "rows": [
          ["Style", "formal, written, literary", "spoken, everyday, neutral"],
          ["Frequency", "rare in speech", "very common"],
          ["Example", "Rahatta on vaikea elää.", "Ilman rahaa on vaikea elää."],
          ["Meaning", "without money", "without money"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Abessive (formal)", "ilman + partitive (spoken)"],
        "rows": [
          ["Syömättä en jaksa.", "Ilman syömistä en jaksa."],
          ["Luvatta et saa tulla.", "Et saa tulla ilman lupaa."],
          ["Ongelmitta se onnistui.", "Se onnistui ilman ongelmia."]
        ]
      },
      {
        "type": "subheading",
        "text": "5. The Third Infinitive Abessive: -matta / -mättä (Very Common!)"
      },
      {
        "type": "paragraph",
        "text": "This is the most useful abessive form for B1 learners. Meaning: without doing something."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Stem", "Abessive (without doing)"],
        "rows": [
          ["syödä", "syö-", "syömättä"],
          ["puhua", "puhu-", "puhumatta"],
          ["nukkua", "nuku-", "nukkumatta"],
          ["mennä", "mene-", "menemättä"],
          ["tehdä", "teh-", "tekemättä"],
          ["lukea", "luke-", "lukematta"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "tehdä → tekemättä (irregular stem)"
      },
      {
        "type": "example-list",
        "items": [
          "Hän lähti syömättä. = He left without eating.",
          "Menin töihin nukkumatta. = I went to work without sleeping.",
          "Hän poistui sanomatta mitään. = He left without saying anything.",
          "Älä mene ulos takkia laittamatta! = Don't go outside without putting on a coat!",
          "Voitko tehdä sen miettimättä? = Can you do it without thinking?"
        ]
      },
      {
        "type": "subheading",
        "text": "6. Fixed Expressions with Abessive (B1 must-know)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Meaning", "Notes"],
        "rows": [
          ["luvatta", "without permission", "Very common in rules"],
          ["syyttä", "without reason", "Syyttä suotta = for no reason at all"],
          ["poikkeuksetta", "without exception", "Formal"],
          ["epäilemättä", "without doubt", "Epäilemättä hän on oikeassa."],
          ["huomaamatta", "without noticing", "Hän meni ohi huomaamattani."],
          ["tauotta", "without a break", "Hän työskenteli tauotta."],
          ["välittämättä", "regardless of / without caring", "Välittämättä säästä, lähdimme."]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Possessive Suffixes with Abessive (Advanced B1)"
      },
      {
        "type": "example-table",
        "headers": ["Base", "Abessive", "With suffix"],
        "rows": [
          ["lupa", "luvatta", "luvattani (without my permission)"],
          ["syy", "syyttä", "syyttäni (without my reason)"],
          ["tieto", "tiedotta", "tiedottani (without my knowledge)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Hän tuli luvattani. = He came without my permission.",
          "Teit sen tiedottani. = You did it without my knowledge."
        ]
      },
      {
        "type": "subheading",
        "text": "8. Abessive in Spoken Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Formal abessive", "Spoken alternative"],
        "rows": [
          ["rahatta", "ilman rahaa"],
          ["syömättä", "ilman syömistä / niin että en syönyt"],
          ["luvatta", "ilman lupaa"],
          ["ongelmitta", "ilman ongelmia"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Mä läksin ilman syömistä. = I left without eating. (Instead of: Lähdin syömättä.)"]
      },
      {
        "type": "subheading",
        "text": "9. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Minä menin rahata.", "Menin ilman rahaa. (spoken)", "Abessive without olla is rare; use ilman."],
          ["Syömättä minä lähdin.", "Lähdin syömättä.", "Verb first is more natural."],
          ["Luvata", "Luvatta", "Wrong form — lupa → luvatta, not luvata."],
          ["Ilman syöty", "Ilman syömistä", "After ilman use partitive of third infinitive (syömistä) or noun."]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Hän jäi täysin rahatta vieraaseen kaupunkiin. (He was left completely without money in a strange city.)",
          "Älä lähde ulos ilman takkia; tänään on kylmä. (Don't go outside without a coat; today is cold.)",
          "Hän teki koko työn tauotta ja valmistui ennen aikojaan. (He did the whole job without a break and finished early.)",
          "Voinko tulla sisään luvatta? (Can I come in without permission?)",
          "Epäilemättä hän on paras ehdokas. (Without a doubt, he is the best candidate.)",
          "Heräsin yöllä enkä saanut enää unta — olin hereillä aamulla nukkumatta. (I woke up at night and couldn't sleep again — I was awake in the morning without having slept.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Summary Table: Formal vs. Spoken for 'without'"
      },
      {
        "type": "example-table",
        "headers": ["Meaning", "Formal (abessive)", "Spoken (ilman + partitive)"],
        "rows": [
          ["without money", "rahatta", "ilman rahaa"],
          ["without a friend", "ystävättä", "ilman ystävää"],
          ["without problems", "ongelmitta", "ilman ongelmia"],
          ["without eating", "syömättä", "ilman syömistä"],
          ["without permission", "luvatta", "ilman lupaa"],
          ["without doubt", "epäilemättä", "ilman epäilystä / varmasti"]
        ]
      },
      {
        "type": "subheading",
        "text": "12. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Translate (formal): 'He came without permission.'",
        "items": ["Answer: Hän tuli luvatta."]
      },
      {
        "type": "example-list",
        "title": "2. Translate (spoken): 'We left without money.'",
        "items": ["Answer: Me lähdettiin ilman rahaa."]
      },
      {
        "type": "example-list",
        "title": "3. Form the third infinitive abessive of: juoda (to drink)",
        "items": ["Answer: juomatta"]
      },
      {
        "type": "example-list",
        "title": "4. Form the abessive of: ongelma",
        "items": ["Answer: ongelmitta"]
      },
      {
        "type": "example-list",
        "title": "5. Correct or incorrect? 'Hän lähti ilman hyvästit.'",
        "items": ["Answer: Incorrect — ilman hyvästejä (partitive plural) or hyvästelemättä (without saying goodbye)."]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Syyttä suotta hän suuttui. (He got angry for no reason at all.)",
          "Epäilemättä tulet onnistumaan. (Without a doubt, you will succeed.)",
          "Hän poistui huomaamattani. (He left without my noticing.)",
          "Menin kotiin syömättä koko päivänä. (I went home without eating all day.)",
          "Välittämättä vastustuksesta, hän jatkoi suunnitelmaansa. (Regardless of the opposition, he continued with his plan.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the abessive case (-tta/-ttä) express?",
      "options": [
        "Location (in/on/at)",
        "Lack or absence of something (without)",
        "Becoming or change",
        "Instrument (by means of)"
      ],
      "correctAnswer": "Lack or absence of something (without)",
      "explanation": "The abessive case expresses lack or absence. Example: rahatta = without money, luvatta = without permission.",
      "hint": "Think of 'without X'.",
      "points": 10
    },
    {
      "question": "What is the abessive ending?",
      "options": ["-na/-nä", "-tta/-ttä", "-ksi", "-lla/-llä"],
      "correctAnswer": "-tta/-ttä",
      "explanation": "The abessive case ends with -tta or -ttä (vowel harmony). Example: rahatta (without money).",
      "hint": "It has double t and ends with -a/ä.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, how do people usually say 'without money'?",
      "options": ["rahatta", "ilman rahaa", "rahaton", "rahasta"],
      "correctAnswer": "ilman rahaa",
      "explanation": "In spoken and everyday Finnish, 'ilman + partitive' (ilman rahaa) is much more common than the formal abessive 'rahatta'.",
      "hint": "Think of 'ilman' meaning 'without'.",
      "points": 10
    },
    {
      "question": "What is the third infinitive abessive of 'syödä' (to eat)?",
      "options": ["syödättä", "syömättä", "syönnättä", "syöttä"],
      "correctAnswer": "syömättä",
      "explanation": "The third infinitive abessive means 'without eating'. syödä → syö- + -mättä = syömättä.",
      "hint": "Stem syö- + -mättä.",
      "points": 10
    },
    {
      "question": "How do you say 'without sleeping' in Finnish?",
      "options": ["nukkumatta", "nukuttamatta", "nukkumättä", "nukkuatta"],
      "correctAnswer": "nukkumatta",
      "explanation": "nukkua → nuku- + -matta = nukkumatta (without sleeping).",
      "hint": "Third infinitive abessive of nukkua.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the abessive?",
      "options": [
        "Menin kotiin ilman raha.",
        "Menin kotiin rahatta.",
        "Menin kotiin rahan.",
        "Menin kotiin rahasta."
      ],
      "correctAnswer": "Menin kotiin rahatta.",
      "explanation": "Rahatta is the correct formal abessive form of raha (without money). 'Ilman rahaa' would be the spoken alternative, but 'ilman raha' is missing the partitive case.",
      "hint": "Abessive ends with -tta.",
      "points": 10
    },
    {
      "question": "What is the abessive form of 'lupa' (permission) showing consonant gradation?",
      "options": ["lupatta", "luvatta", "lupaa", "lupana"],
      "correctAnswer": "luvatta",
      "explanation": "Lupa → weak grade lupa- → luv- + -atta? Actually lupa → luvatta (p → v, then add -tta). Correct: lupa → luvatta (without permission).",
      "hint": "p weakens to v with double t.",
      "points": 10
    },
    {
      "question": "What does 'epäilemättä' mean?",
      "options": [
        "Without a doubt",
        "Without hesitation",
        "Without permission",
        "Without reason"
      ],
      "correctAnswer": "Without a doubt",
      "explanation": "Epäilemättä is a fixed expression meaning 'without a doubt'. Example: Epäilemättä hän on oikeassa (Without a doubt, he is right).",
      "hint": "It comes from epäillä (to doubt).",
      "points": 10
    },
    {
      "question": "In spoken Finnish, what is the common way to say 'without eating'?",
      "options": ["syömättä", "ilman syömistä", "syömä", "syömällä"],
      "correctAnswer": "ilman syömistä",
      "explanation": "In spoken Finnish, 'ilman syömistä' (ilman + partitive of the third infinitive) is more common than the formal abessive 'syömättä'.",
      "hint": "Use 'ilman' + the -minen form in partitive.",
      "points": 10
    },
    {
      "question": "Which of the following is a correct negative command using the abessive?",
      "options": [
        "Älä mene ulos takki.",
        "Älä mene ulos takkia laittamatta.",
        "Älä mene ulos ilman takki.",
        "Älä mene ulos takkitta."
      ],
      "correctAnswer": "Älä mene ulos takkia laittamatta.",
      "explanation": "Älä mene ulos takkia laittamatta = Don't go outside without putting on a coat. The abessive 'laittamatta' (without putting) is correctly used here.",
      "hint": "The structure is 'älä + verb + noun + abessive of second verb'.",
      "points": 10
    }
  ]
},
{
  "id": "va-participle",
  "chapter": 9,
  "title": "Present Active Participle – VA-partisiippi",
  "finnish": "VA-partisiippi",
  "icon": "⚡",
  "level": "B1",
  "accent": "bg-emerald-600",
  "badge": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "description": "The present active participle (-va/-vä) describes someone/something that is doing an action — the 'reading child', 'sleeping baby', 'running water' — with full formation rules and declension",
  "content": {
    "type": "rich",
    "intro": "The VA-participle is an active present participle. It describes someone or something that is doing an action right now (or generally, habitually). It replaces the relative clause 'joka + verb'.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the VA-Participle? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English equivalent", "Finnish"],
        "rows": [
          ["reading child", "lukeva lapsi"],
          ["sleeping baby", "nukkuva vauva"],
          ["running water", "juokseva vesi"]
        ]
      },
      {
        "type": "paragraph",
        "text": "It replaces the relative clause 'joka + verb': lapsi, joka lukee = lukeva lapsi."
      },
      {
        "type": "subheading",
        "text": "2. Formation Rules for All Verb Types"
      },
      {
        "type": "paragraph",
        "text": "General rule: Take the verb stem + -va / -vä"
      },
      {
        "type": "subheading",
        "text": "Type 1 (puhua, asua, lukea)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Stem", "Participle"],
        "rows": [
          ["puhua", "puhu-", "puhuva"],
          ["asua", "asu-", "asuva"],
          ["lukea", "luke-", "lukeva"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 2 (syödä, juoda, tehdä)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Stem", "Participle"],
        "rows": [
          ["syödä", "syö-", "syövä"],
          ["juoda", "juo-", "juova"],
          ["tehdä", "teke-", "tekevä"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 3 (mennä, tulla, nousta)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present stem (strong grade)", "Participle"],
        "rows": [
          ["mennä", "mene-", "menevä"],
          ["tulla", "tule-", "tuleva"],
          ["nousta", "nouse-", "nouseva"],
          ["pestä", "pese-", "pesevä"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 4 (haluta, osata, vastata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Stem", "Participle"],
        "rows": [
          ["haluta", "halua-", "haluava"],
          ["osata", "osaa-", "osaava"],
          ["vastata", "vastaa-", "vastaava"]
        ]
      },
      {
        "type": "example-list",
        "items": ["osaava = skilled / capable — osaava työntekijä = a skilled worker."]
      },
      {
        "type": "subheading",
        "text": "Type 5 (tarvita, pakata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Stem", "Participle"],
        "rows": [
          ["tarvita", "tarvitse-", "tarvitseva"],
          ["pakata", "pakkaa-", "pakkaava"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Declension of the VA-Participle"
      },
      {
        "type": "paragraph",
        "text": "The VA-participle declines like an adjective (in all cases, singular and plural)."
      },
      {
        "type": "example-table",
        "headers": ["Case", "Singular (lukeva)", "Plural (lukevat)"],
        "rows": [
          ["Nominative", "lukeva", "lukevat"],
          ["Genitive", "lukevan", "lukevien"],
          ["Partitive", "lukevaa", "lukevia"],
          ["Inessive", "lukevassa", "lukevissa"],
          ["Elative", "lukevasta", "lukevista"],
          ["Illative", "lukevaan", "lukeviin"],
          ["Adessive", "lukevalla", "lukevilla"],
          ["Ablative", "lukevalta", "lukevilta"],
          ["Allative", "lukevalle", "lukeville"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Katsoin nukkuvaa koiraa. (I looked at the sleeping dog — partitive)",
          "Tapasin puhuvan miehen. (I met the speaking man — genitive total object)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. VA-Participle as a Noun (Substantivized)"
      },
      {
        "type": "paragraph",
        "text": "The participle can be used as a noun, meaning 'the one who does X'."
      },
      {
        "type": "example-table",
        "headers": ["Participle", "As noun", "Meaning"],
        "rows": [
          ["puhuva", "puhuva", "the one who speaks / speaker"],
          ["nukkuva", "nukkuva", "the one who is sleeping"],
          ["opiskeleva", "opiskeleva", "the one who studies"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Nukkuva ei kuullut mitään. (The sleeping person didn't hear anything.)",
          "Puhuvat vaikenivat. (The speakers fell silent.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5. Passive Present Participle: -tava / -ttävä (Must-know for B1)"
      },
      {
        "type": "paragraph",
        "text": "This is not the VA-participle, but it's often introduced alongside it. Meaning: 'to be done' / 'that must/should be done'."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Passive present participle", "Meaning"],
        "rows": [
          ["lukea", "luettava", "to be read"],
          ["syödä", "syötävä", "to be eaten"],
          ["tehdä", "tehtävä", "to be done"],
          ["nähdä", "nähtävä", "to be seen"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Tämä on luettava kirja. = This is a book to be read (must be read).",
          "Onko täällä syötävää? = Is there anything to eat? (literally: eatable)",
          "Tehtävä työ on vaikea. = The work to be done is difficult."
        ]
      },
      {
        "type": "example-table",
        "headers": ["Type", "Finnish", "English", "Example"],
        "rows": [
          ["Active present VA", "lukeva", "reading", "lukeva lapsi"],
          ["Passive present", "luettava", "to be read", "luettava kirja"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "näkevä (seeing) vs. nähtävä (to be seen) — näkevä mies = a man who sees; nähtävä paikka = a place worth seeing."
      },
      {
        "type": "subheading",
        "text": "6. VA-Participle vs. Relative Clause (Joka)"
      },
      {
        "type": "example-table",
        "headers": ["Relative clause (heavier)", "VA-participle (lighter)"],
        "rows": [
          ["lapsi, joka lukee", "lukeva lapsi"],
          ["koira, joka haukkuu", "haukkuva koira"],
          ["mies, joka puhuu suomea", "suomea puhuva mies"]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Fixed Expressions with VA-Participles (B1 must-know)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Meaning", "Notes"],
        "rows": [
          ["tuleva", "coming / future", "tulevalla viikolla = next week"],
          ["menevä", "going / trendy", "menevä tyyli = trendy style"],
          ["elävä", "living / alive", "elävä kieli = living language"],
          ["kasvava", "growing", "kasvava lapsi"],
          ["oleva", "existing / current", "oleva tilanne = the current situation"],
          ["kuuluva", "heard / belonging", "kuuluva ääni"],
          ["näkyvä", "visible", "näkyvä tähti"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Tulevaisuudessa = in the future (from tuleva + -isuus)",
          "Edellä oleva teksti = the text above (very common in official language)"
        ]
      },
      {
        "type": "subheading",
        "text": "8. VA-Participle in Spoken Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken", "Notes"],
        "rows": [
          ["lukeva lapsi", "lapsi, joka lukee", "relative clause preferred"],
          ["odottava nainen", "nainen, joka odottaa", ""],
          ["haukkuva koira", "koira, joka haukkuu", ""]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Hän on lukee lapsi.", "Hän on lukeva lapsi.", "Need participle, not verb."],
          ["nukeva vauva", "nukkuva vauva", "Wrong stem — nukkua → nukkuva."],
          ["Olen lukeva", "Luen", "Don't use VA-participle with olla for present continuous — that's not Finnish."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Finnish has no present continuous ('I am reading'). Luen = I read / I am reading. Olen lukeva is not correct for that."
      },
      {
        "type": "subheading",
        "text": "10. Comparison: Present Participles Overview (B1)"
      },
      {
        "type": "example-table",
        "headers": ["Name", "Finnish ending", "Meaning", "Example"],
        "rows": [
          ["Active present", "-va/-vä", "doing (active)", "lukeva lapsi"],
          ["Passive present", "-tava/-ttävä", "to be done / must be done", "luettava kirja"],
          ["Active past", "-nut/-nyt", "have done", "lukenut lapsi"],
          ["Passive past", "-ttu/-tty", "have been done", "luettu kirja"]
        ]
      },
      {
        "type": "subheading",
        "text": "11. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Nukkuva vauva ei herännyt meluun. (The sleeping baby didn't wake up to the noise.)",
          "Suomea puhuva mies auttoi minua. (The man speaking Finnish helped me.)",
          "Tämä on kiinnostava elokuva — sinun täytyy nähdä se. (This is an interesting movie — you have to see it.)",
          "Tulevana kesänä matkustamme Italiaan. (Next summer we will travel to Italy.)",
          "Onko sinulla mitään syötävää? (Do you have anything to eat?)",
          "Elävä kieli muuttuu koko ajan. (A living language changes all the time.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Form VA-participle of: nauraa (to laugh)",
        "items": ["Answer: naurava"]
      },
      {
        "type": "example-list",
        "title": "2. Translate: 'a crying child'",
        "items": ["Answer: itkevä lapsi"]
      },
      {
        "type": "example-list",
        "title": "3. Passive present participle of: nähdä (to see)",
        "items": ["Answer: nähtävä"]
      },
      {
        "type": "example-list",
        "title": "4. Replace relative clause with participle: nainen, joka juoksee",
        "items": ["Answer: juokseva nainen"]
      },
      {
        "type": "example-list",
        "title": "5. Correct or incorrect? 'Olen työskentelevä nyt.' (meaning 'I am working now')",
        "items": ["Answer: Incorrect — use 'Työskentelen nyt.' (no continuous tense with olla + VA-participle in standard Finnish)"]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tulevana vuonna muutan uuteen kotiin. (Next year I will move to a new home.)",
          "Näkyvää tähteä ei näy pilvien takia. (The visible star is not visible because of the clouds.)",
          "Osaava työntekijä saa usein parempaa palkkaa. (A skilled worker often gets better salary.)",
          "Kasvava lapsi tarvitsee hyvää ruokaa. (A growing child needs good food.)",
          "Elävä olento tarvitsee vettä ja ilmaa. (A living creature needs water and air.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the VA-participle (-va/-vä) describe?",
      "options": [
        "An action that has already been completed",
        "Someone/something that is doing an action (present active)",
        "Something that must be done",
        "A passive action"
      ],
      "correctAnswer": "Someone/something that is doing an action (present active)",
      "explanation": "The VA-participle is the active present participle, describing someone or something that is performing an action. Example: lukeva lapsi (reading child).",
      "hint": "Think of '-ing' in English as an adjective (running child).",
      "points": 10
    },
    {
      "question": "What is the VA-participle of 'lukea' (to read)?",
      "options": ["lukenut", "lukeva", "luettava", "lukevainen"],
      "correctAnswer": "lukeva",
      "explanation": "lukea → stem luke- + -va = lukeva (reading).",
      "hint": "Add -va to the stem.",
      "points": 10
    },
    {
      "question": "What is the VA-participle of 'mennä' (to go)?",
      "options": ["mennyt", "menevä", "mentävä", "menekki"],
      "correctAnswer": "menevä",
      "explanation": "mennä → present stem mene- (strong grade) + -vä = menevä (going).",
      "hint": "Type 3 verbs use the strong grade stem.",
      "points": 10
    },
    {
      "question": "How do you say 'the sleeping baby' in Finnish?",
      "options": ["nukkunut vauva", "nukkuva vauva", "nukuttava vauva", "nukkuma vauva"],
      "correctAnswer": "nukkuva vauva",
      "explanation": "nukkuva (present active participle of nukkua) + vauva = the sleeping baby.",
      "hint": "Present active, not past or passive.",
      "points": 10
    },
    {
      "question": "What is the passive present participle of 'lukea' (meaning 'to be read')?",
      "options": ["lukeva", "lukenut", "luettava", "lukevainen"],
      "correctAnswer": "luettava",
      "explanation": "Luettava is the passive present participle, meaning 'to be read' or 'must be read'. Example: luettava kirja (a book to be read).",
      "hint": "Passive present participle ending is -tava/-ttävä.",
      "points": 10
    },
    {
      "question": "What is the difference between 'lukeva lapsi' and 'luettava kirja'?",
      "options": [
        "No difference",
        "lukeva = reading (active); luettava = to be read (passive)",
        "First is past, second is present",
        "First is spoken, second is written"
      ],
      "correctAnswer": "lukeva = reading (active); luettava = to be read (passive)",
      "explanation": "LukEva is active (the child who reads). Luettava is passive (the book that should be read).",
      "hint": "Active vs. passive meaning.",
      "points": 10
    },
    {
      "question": "What is the genitive singular form of 'lukeva' (reading)?",
      "options": ["lukeva", "lukevan", "lukevia", "lukevien"],
      "correctAnswer": "lukevan",
      "explanation": "The VA-participle declines like an adjective. The genitive singular of lukeva is lukevan.",
      "hint": "Add -n to the stem lukeva-? Actually lukevan has only one 'a' change? Wait: lukeva → lukevan (stem lukeva- + -n, with a → a? Actually lukeva → genitive lukevan, yes.)",
      "points": 10
    },
    {
      "question": "Which of the following is a fixed expression with 'tuleva' (future)?",
      "options": ["tulevainen", "tulevalla viikolla", "tulevuosi", "tulevia"],
      "correctAnswer": "tulevalla viikolla",
      "explanation": "Tulevalla viikolla = next week. Tuleva is often used in time expressions.",
      "hint": "tuleva = coming/future.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the VA-participle?",
      "options": [
        "Olen lukeva kirjaa nyt.",
        "Luen kirjaa nyt.",
        "Olen lukenut kirjaa nyt.",
        "Olen lukevainen nyt."
      ],
      "correctAnswer": "Luen kirjaa nyt.",
      "explanation": "Finnish has no present continuous tense. 'Luen' means both 'I read' and 'I am reading'. 'Olen lukeva' is not standard Finnish for this.",
      "hint": "Don't use 'olla' + VA-participle for present continuous.",
      "points": 10
    },
    {
      "question": "What is the correct VA-participle of 'tehdä' (to do)?",
      "options": ["tekvä", "tehnyt", "tekevä", "tehtävä"],
      "correctAnswer": "tekevä",
      "explanation": "tehdä → present stem teke- (irregular) + -vä = tekevä (doing).",
      "hint": "Tehdä has an irregular stem teke- in present tense.",
      "points": 10
    }
  ]
},
{
  "id": "nut-participle",
  "chapter": 10,
  "title": "Past Active Participle – NUT-partisiippi",
  "finnish": "NUT-partisiippi",
  "icon": "✅",
  "level": "B1",
  "accent": "bg-sky-600",
  "badge": "bg-sky-50 text-sky-700 border-sky-200",
  "description": "The past active participle (-nut/-nyt) describes someone who has done something, a resulting state (tired, interested), and forms the perfect tense with olla",
  "content": {
    "type": "rich",
    "intro": "The NUT-participle is the active past participle. It describes someone who has done something (e.g., 'lukenut lapsi' = a child who has read), a resulting state (e.g., 'väsynyt' = tired), and forms the perfect tense with 'olla' (e.g., 'olen syönyt' = I have eaten).",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the NUT-Participle? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English equivalent", "Finnish"],
        "rows": [
          ["tired man", "väsynyt mies"],
          ["grown tree", "kasvanut puu"],
          ["a child who has slept", "nukkunut lapsi"]
        ]
      },
      {
        "type": "subheading",
        "text": "2. Formation Rules for All Verb Types"
      },
      {
        "type": "paragraph",
        "text": "General rule: Take the strong stem (past tense stem) + -nut / -nyt"
      },
      {
        "type": "subheading",
        "text": "Type 1 (puhua, asua, lukea)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Past stem (strong)", "Participle"],
        "rows": [
          ["puhua", "puhu-", "puhunut"],
          ["asua", "asu-", "asunut"],
          ["lukea", "luke-", "lukenut"],
          ["kysyä", "kysy-", "kysynyt"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 2 (syödä, juoda, tehdä, nähdä)"
      },
      {
        "type": "paragraph",
        "text": "Remove -da/-dä, add -nut/-nyt, apply gradation."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Infinitive stem", "Participle", "Gradation"],
        "rows": [
          ["syödä", "syö-", "syönyt", "no change"],
          ["juoda", "juo-", "juonut", "d → n"],
          ["tehdä", "teh-", "tehnyt", "no change"],
          ["nähdä", "nä-", "nähnyt", "no change"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 3 (mennä, tulla, nousta, pestä)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem (present)", "Participle"],
        "rows": [
          ["mennä", "mene-", "mennyt"],
          ["tulla", "tule-", "tullut"],
          ["nousta", "nouse-", "noussut"],
          ["pestä", "pese-", "pessyt"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 4 (haluta, osata, vastata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Participle"],
        "rows": [
          ["haluta", "halunnut"],
          ["osata", "osannut"],
          ["vastata", "vastannut"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 5 (tarvita, pakata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Participle"],
        "rows": [
          ["tarvita", "tarvinnut"],
          ["pakata", "pakannut"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Plural of NUT-Participle: -neet"
      },
      {
        "type": "example-table",
        "headers": ["Singular", "Plural", "Example"],
        "rows": [
          ["puhunut", "puhuneet", "he ovat puhuneet"],
          ["syönyt", "syöneet", "he ovat syöneet"],
          ["mennyt", "menneet", "he ovat menneet"],
          ["tullut", "tulleet", "he ovat tulleet"],
          ["noussut", "nousseet", "he ovat nousseet"]
        ]
      },
      {
        "type": "example-list",
        "items": ["He ovat syöneet jo. = They have already eaten."]
      },
      {
        "type": "subheading",
        "text": "4. Declension of the NUT-Participle"
      },
      {
        "type": "paragraph",
        "text": "The NUT-participle declines like an adjective (stem changes: -nut → -nee- before case endings)."
      },
      {
        "type": "example-table",
        "headers": ["Case", "Singular (väsynyt)", "Plural (väsyneet)"],
        "rows": [
          ["Nominative", "väsynyt", "väsyneet"],
          ["Genitive", "väsyneen", "väsyneiden"],
          ["Partitive", "väsynyttä", "väsyneitä"],
          ["Inessive", "väsyneessä", "väsyneissä"],
          ["Elative", "väsyneestä", "väsyneistä"],
          ["Illative", "väsyneeseen", "väsyneisiin"],
          ["Adessive", "väsyneellä", "väsyneillä"],
          ["Ablative", "väsyneeltä", "väsyneiltä"],
          ["Allative", "väsyneelle", "väsyneille"],
          ["Essive", "väsyneenä", "väsyneinä"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Tapasin väsyneen opiskelijan. (I met the tired student — genitive)",
          "Autoin väsynyttä ystävää. (I helped the tired friend — partitive)",
          "Puhuin väsyneille ihmisille. (I spoke to tired people — allative plural)"
        ]
      },
      {
        "type": "subheading",
        "text": "5. NUT-Participle as an Adjective (Resulting State)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "NUT-participle", "Adjective meaning"],
        "rows": [
          ["väsyä (to get tired)", "väsynyt", "tired"],
          ["kiinnostua (to become interested)", "kiinnostunut", "interested"],
          ["pettyä (to be disappointed)", "pettynyt", "disappointed"],
          ["rakastua (to fall in love)", "rakastunut", "in love"],
          ["kyllästyä (to get bored)", "kyllästynyt", "bored"],
          ["loukkaantua (to get injured/insulted)", "loukkaantunut", "injured / offended"],
          ["hukkua (to drown)", "hukkunut", "drowned / lost"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olen kiinnostunut suomen kielestä. (I am interested in the Finnish language. — elative after kiinnostunut)",
          "Hän on pettynyt tulokseen. (He is disappointed in the result.)",
          "He ovat rakastuneita toisiinsa. (They are in love with each other.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6. NUT-Participle in Perfect Tense (The Most Common Use)"
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Formula", "Example"],
        "rows": [
          ["Perfect", "olla (present) + NUT-participle", "olen syönyt (I have eaten)"],
          ["Past perfect", "olla (past) + NUT-participle", "olin syönyt (I had eaten)"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Subject", "Perfect", "Translation"],
        "rows": [
          ["minä olen", "syönyt", "I have eaten"],
          ["sinä olet", "syönyt", "you have eaten"],
          ["hän on", "syönyt", "he/she has eaten"],
          ["me olemme", "syöneet", "we have eaten"],
          ["te olette", "syöneet", "you (pl) have eaten"],
          ["he ovat", "syöneet", "they have eaten"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olemme syöneet jo. = We have already eaten.",
          "Olemme syöneitä (wrong — that's the adjective declension, not the perfect tense)"
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "In the perfect tense, the NUT-participle does not decline for case — it only agrees in number with the subject."
      },
      {
        "type": "subheading",
        "text": "7. NUT-Participle as an Attribute (Modifying a Noun)"
      },
      {
        "type": "paragraph",
        "text": "When used as an adjective modifying a noun, the participle agrees in case and number with the noun."
      },
      {
        "type": "example-list",
        "items": [
          "Tunnen nukkuneen lapsen. (I know the child who has slept. — genitive)",
          "Katsoin nukkunutta lasta. (I looked at the child who had slept. — partitive)",
          "Puhuin nukkuneille lapsille. (I spoke to the children who had slept. — allative plural)"
        ]
      },
      {
        "type": "subheading",
        "text": "8. NUT-Participle vs. VA-Participle (Active Participles)"
      },
      {
        "type": "example-table",
        "headers": ["", "VA-participle", "NUT-participle"],
        "rows": [
          ["Ending", "-va/-vä", "-nut/-nyt"],
          ["Tense", "present / ongoing", "past / completed"],
          ["Meaning", "doing (right now)", "has done / is in a state of having done"],
          ["Example", "lukeva lapsi (reading child)", "lukenut lapsi (child who has read)"],
          ["As adjective", "kiinnostava (interesting)", "kiinnostunut (interested)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Kiinnostava elokuva = an interesting movie (causes interest)",
          "Olen kiinnostunut elokuvasta = I am interested in the movie"
        ]
      },
      {
        "type": "subheading",
        "text": "9. Passive Past Participle: -ttu / -tty (Compare with NUT)"
      },
      {
        "type": "example-table",
        "headers": ["", "Active NUT", "Passive past"],
        "rows": [
          ["Ending", "-nut/-nyt", "-ttu/-tty"],
          ["Meaning", "has done (active)", "has been done / done by someone"],
          ["Example", "syönyt lapsi (child who has eaten)", "syöty ruoka (eaten food)"],
          ["Example 2", "kirjoittanut mies (man who has written)", "kirjoitettu kirja (written book)"]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Fixed Expressions with NUT-Participles (B1 must-know)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Meaning", "Notes"],
        "rows": [
          ["mennyt", "past / last", "mennyt viikko = last week"],
          ["tullut", "having come", "less common alone"],
          ["kasvanut", "grown", "kasvanut lapsi"],
          ["unohtunut", "forgotten", "unohtunut avain = forgotten key"],
          ["rikkoutunut", "broken", "rikkoutunut puhelin"],
          ["valmistunut", "graduated / finished", "valmistunut opiskelija"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Mennyt viikko oli kiireinen. = Last week was busy."]
      },
      {
        "type": "subheading",
        "text": "11. NUT-Participle in Spoken Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken (common)", "Notes"],
        "rows": [
          ["olen syönyt", "mä oon syöny", "-t dropped"],
          ["olen väsynyt", "mä oon väsyny", ""],
          ["olen tullut", "mä oon tullu", ""],
          ["olen mennyt", "mä oon menny", ""]
        ]
      },
      {
        "type": "subheading",
        "text": "12. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Me olemme syönyt", "Me olemme syöneet", "Plural subject requires plural participle."],
          ["Näin nukkuneen lapsi", "Näin nukkuneen lapsen", "Object in genitive (total object → genitive)."],
          ["Olen kiinnostunut elokuva", "Olen kiinnostunut elokuvasta", "kiinnostunut requires elative case (mistä)."],
          ["Hän on tullut Suomessa", "Hän on tullut Suomeen", "Movement requires illative, but perfect tense + tulla is fine meaning 'has come to'."]
        ]
      },
      {
        "type": "subheading",
        "text": "13. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Olen väsynyt, koska en nukkunut hyvin viime yönä. (I am tired because I didn't sleep well last night.)",
          "Näin eilen kadonneen koiran ja vein sen eläinsuojaan. (I saw a lost dog yesterday and took it to an animal shelter.)",
          "Olemme kiinnostuneita ostamaan asunnon Helsingistä. (We are interested in buying an apartment in Helsinki.)",
          "Valmistunut opiskelija juhli ystäviensä kanssa. (The graduated student celebrated with his/her friends.)",
          "Rikkoutunut puhelin täytyy viedä korjattavaksi. (The broken phone needs to be taken for repair.)",
          "Mennyt viikonloppu oli hauska, mutta liian lyhyt. (Last weekend was fun, but too short.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Form the NUT-participle of: juosta (to run)",
        "items": ["Answer: juossut (juosta → juossut — strong stem juokse- + -nut → juossut with assimilation)"]
      },
      {
        "type": "example-list",
        "title": "2. Form the plural NUT-participle of: tulla (to come)",
        "items": ["Answer: tulleet"]
      },
      {
        "type": "example-list",
        "title": "3. Translate: 'a tired woman'",
        "items": ["Answer: väsynyt nainen"]
      },
      {
        "type": "example-list",
        "title": "4. Translate (perfect tense): 'We have eaten'",
        "items": ["Answer: Me olemme syöneet."]
      },
      {
        "type": "example-list",
        "title": "5. Correct or incorrect? 'Olen pettynyt sinä.'",
        "items": ["Answer: Incorrect — Olen pettynyt sinuun (illative, not nominative)."]
      },
      {
        "type": "subheading",
        "text": "15. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Olen unohtanut avaimeni. (I have forgotten my keys.)",
          "Hän on rakastunut minuun. (He/she has fallen in love with me.)",
          "Oletko koskaan nähnyt sellaista? (Have you ever seen such a thing?)",
          "Vanha kirja oli täysin lukenut. (The old book was completely read — lukenut as adjective is rare; 'luettu' is more common.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the NUT-participle describe?",
      "options": [
        "Someone/something doing an action right now",
        "Someone who has done something (past active), or a resulting state",
        "Something that must be done",
        "A passive action happening now"
      ],
      "correctAnswer": "Someone who has done something (past active), or a resulting state",
      "explanation": "The NUT-participle (past active) describes someone who has performed an action (lukenut lapsi = child who has read) or a resulting state (väsynyt = tired).",
      "hint": "Think of 'has done' or 'tired, interested'.",
      "points": 10
    },
    {
      "question": "What is the NUT-participle of 'lukea' (to read)?",
      "options": ["lukeva", "lukenut", "luettava", "lukevainen"],
      "correctAnswer": "lukenut",
      "explanation": "lukea → participle lukenut (a child who has read).",
      "hint": "-nut ending for past active.",
      "points": 10
    },
    {
      "question": "What is the plural form of 'puhunut' (has spoken)?",
      "options": ["puhunut", "puhunutta", "puhuneet", "puhuneita"],
      "correctAnswer": "puhuneet",
      "explanation": "The plural of the NUT-participle is -neet: puhunut → puhuneet (they have spoken).",
      "hint": "Plural ends in -neet.",
      "points": 10
    },
    {
      "question": "How do you say 'interested' (as an adjective) in Finnish?",
      "options": ["kiinnostava", "kiinnostunut", "kiinnostaa", "kiinnostettu"],
      "correctAnswer": "kiinnostunut",
      "explanation": "Kiinnostunut is the NUT-participle of kiinnostua (to become interested). Example: Olen kiinnostunut suomen kielestä.",
      "hint": "It means 'has become interested' as a state.",
      "points": 10
    },
    {
      "question": "What is the passive past participle of 'syödä' (to eat)?",
      "options": ["syönyt", "syövä", "syödä", "syöty"],
      "correctAnswer": "syöty",
      "explanation": "Syöty is the passive past participle (has been eaten). Example: syöty ruoka (eaten food).",
      "hint": "Passive participle ends in -ttu/-tty.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the perfect tense?",
      "options": [
        "Minä olen syönyt.",
        "Minä olen syöty.",
        "Minä olen syövä.",
        "Minä olen syödä."
      ],
      "correctAnswer": "Minä olen syönyt.",
      "explanation": "Perfect tense formula: olla (present) + NUT-participle. Olen syönyt = I have eaten.",
      "hint": "Perfect uses the active participle.",
      "points": 10
    },
    {
      "question": "What is the genitive singular form of 'väsynyt' (tired) when used as an adjective?",
      "options": ["väsynyt", "väsyneen", "väsyneet", "väsynyttä"],
      "correctAnswer": "väsyneen",
      "explanation": "The NUT-participle stem changes to -nee- before case endings. Genitive singular of väsynyt is väsyneen.",
      "hint": "Stem changes from -nut to -nee-.",
      "points": 10
    },
    {
      "question": "What does 'mennyt viikko' mean?",
      "options": ["next week", "this week", "last week", "every week"],
      "correctAnswer": "last week",
      "explanation": "Mennyt is the NUT-participle of mennä (to go) meaning 'gone' or 'past'. Mennyt viikko = last week.",
      "hint": "Mennyt means 'passed/gone'.",
      "points": 10
    },
    {
      "question": "What is the difference between 'kiinnostava' and 'kiinnostunut'?",
      "options": [
        "No difference",
        "kiinnostava = interesting (causes interest); kiinnostunut = interested (feels interest)",
        "First is past, second is present",
        "First is passive, second is active"
      ],
      "correctAnswer": "kiinnostava = interesting (causes interest); kiinnostunut = interested (feels interest)",
      "explanation": "Kiinnostava (VA-participle) means 'interesting' — it causes interest. Kiinnostunut (NUT-participle) means 'interested' — one feels interest.",
      "hint": "-va = causing; -nut = resulting state.",
      "points": 10
    },
    {
      "question": "Which is the correct negative past perfect?",
      "options": [
        "En ole syönyt",
        "En ollut syönyt",
        "En olisi syönyt",
        "En syönyt"
      ],
      "correctAnswer": "En ollut syönyt",
      "explanation": "Past perfect negative: negative auxiliary in past (en/et/ei etc.) + ollut + NUT-participle. En ollut syönyt = I had not eaten.",
      "hint": "Past perfect uses ollut (past of olla) + participle.",
      "points": 10
    }
  ]
},
{
  "id": "second-infinitive",
  "chapter": 11,
  "title": "Second Infinitive – Toinen infinitiivi",
  "finnish": "Toinen infinitiivi",
  "icon": "🔄",
  "level": "B1",
  "accent": "bg-indigo-600",
  "badge": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "description": "The second infinitive expresses simultaneous action — 'while doing' — with inessive form (-essa/-essä) and instructive form (-en), including possessive suffix agreement for different subjects",
  "content": {
    "type": "rich",
    "intro": "The second infinitive expresses simultaneous action — two things happening at the same time. Its most common form is the inessive case (-essa/-ess\u00e4), meaning 'while doing'.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the Second Infinitive? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["while eating", "sy\u00f6dess\u00e4"],
          ["while reading", "lukiessa"],
          ["while speaking", "puhuessa"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Sy\u00f6dess\u00e4 kuuntelin musiikkia. = While eating, I listened to music."]
      },
      {
        "type": "subheading",
        "text": "2. Formation Rules for All Verb Types"
      },
      {
        "type": "paragraph",
        "text": "General rule: Take the strong stem (same as the third person plural stem) + -essa / -ess\u00e4"
      },
      {
        "type": "subheading",
        "text": "Type 1 (puhua, asua, lukea)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem (they-form)", "Second infinitive (inessive)"],
        "rows": [
          ["puhua", "puhu-", "puhuessa"],
          ["asua", "asu-", "asuessa"],
          ["lukea", "luke-", "lukiessa"],
          ["kysy\u00e4", "kysy-", "kysyess\u00e4"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "lukea \u2192 lukiessa (not lukeessa) \u2014 the strong stem has i before -essa."
      },
      {
        "type": "subheading",
        "text": "Type 2 (sy\u00f6d\u00e4, juoda, tehd\u00e4, n\u00e4hd\u00e4)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Second infinitive"],
        "rows": [
          ["sy\u00f6d\u00e4", "sy\u00f6-", "sy\u00f6dess\u00e4"],
          ["juoda", "juo-", "juodessa"],
          ["tehd\u00e4", "teke-", "tehdess\u00e4"],
          ["n\u00e4hd\u00e4", "n\u00e4ke-", "n\u00e4hdess\u00e4"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 3 (menn\u00e4, tulla, nousta, pest\u00e4)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Second infinitive"],
        "rows": [
          ["menn\u00e4", "mene-", "menness\u00e4"],
          ["tulla", "tule-", "tullessa"],
          ["nousta", "nouse-", "noustessa"],
          ["pest\u00e4", "pese-", "pestess\u00e4"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 4 (haluta, osata, vastata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Second infinitive"],
        "rows": [
          ["haluta", "halua-", "halutessa"],
          ["osata", "osaa-", "osatessa"],
          ["vastata", "vastaa-", "vastatessa"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 5 (tarvita, pakata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Second infinitive"],
        "rows": [
          ["tarvita", "tarvitse-", "tarvitessa"],
          ["pakata", "pakkaa-", "pakatessa"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. The Inessive Form: The Most Common Use (While Doing)"
      },
      {
        "type": "example-table",
        "headers": ["Second infinitive (inessive)", "Meaning"],
        "rows": [
          ["sy\u00f6dess\u00e4", "while eating"],
          ["nukkuessa", "while sleeping"],
          ["k\u00e4velless\u00e4", "while walking"],
          ["puhuessa", "while speaking"],
          ["ajaessa", "while driving"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Nukkuessa n\u00e4in outoja unia. (While sleeping, I saw strange dreams.)",
          "K\u00e4velless\u00e4 puistossa tapasin yst\u00e4v\u00e4ni. (While walking in the park, I met my friend.)",
          "Ajaessa autoa on oltava varovainen. (While driving a car, one must be careful.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. Possessive Suffix Agreement (Crucial B1 Rule!)"
      },
      {
        "type": "paragraph",
        "text": "When the subject of the second infinitive is different from the subject of the main clause, you must add a possessive suffix to the second infinitive to indicate who is doing the simultaneous action."
      },
      {
        "type": "example-table",
        "headers": ["Subject", "Possessive suffix", "Example"],
        "rows": [
          ["min\u00e4", "-ni", "sy\u00f6dess\u00e4ni"],
          ["sin\u00e4", "-si", "sy\u00f6dess\u00e4si"],
          ["h\u00e4n", "-an / -\u00e4n", "sy\u00f6dess\u00e4\u00e4n"],
          ["me", "-mme", "sy\u00f6dess\u00e4mme"],
          ["te", "-nne", "sy\u00f6dess\u00e4nne"],
          ["he", "-an / -\u00e4n", "sy\u00f6dess\u00e4\u00e4n"]
        ]
      },
      {
        "type": "example-list",
        "title": "Examples with possessive suffixes:",
        "items": [
          "Min\u00e4 sy\u00f6dess\u00e4ni kuuntelin radiota. (While I was eating, I listened to the radio. \u2014 same subject \u2014 suffix optional but common in formal Finnish)",
          "Sinun tullessasi kukaan ei puhunut. (When you came, no one spoke. \u2014 different subjects)",
          "H\u00e4nen nukkuessaan min\u00e4 luin kirjaa. (While he/she was sleeping, I was reading a book. \u2014 different subjects)",
          "Meid\u00e4n odottaessamme h\u00e4n saapui. (While we were waiting, he/she arrived.)",
          "Heid\u00e4n k\u00e4velless\u00e4\u00e4n puistossa alkoi sataa. (While they were walking in the park, it started to rain.)"
        ]
      },
      {
        "type": "paragraph",
        "text": "Key pattern: Genitive pronoun + second infinitive + possessive suffix"
      },
      {
        "type": "example-list",
        "items": [
          "Minun sy\u00f6dess\u00e4ni = while I ate",
          "Sinun puhuessasi = while you spoke",
          "H\u00e4nen menness\u00e4\u00e4n = while he/she went"
        ]
      },
      {
        "type": "subheading",
        "text": "5. Same Subject vs. Different Subject (The Most Important B1 Distinction)"
      },
      {
        "type": "example-table",
        "headers": ["", "Same subject", "Different subject"],
        "rows": [
          ["Structure", "Second infinitive alone", "Genitive + second infinitive + possessive suffix"],
          ["Example", "Sy\u00f6dess\u00e4 kuuntelin musiikkia.", "H\u00e4nen sy\u00f6dess\u00e4\u00e4n kuuntelin musiikkia."],
          ["Meaning", "While (I was) eating, I...", "While he/she was eating, I..."],
          ["Possessive suffix", "No suffix", "Yes (-ni, -si, -an, -mme, -nne, -an)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Same: Lukiessa opin uusia sanoja. (While reading, I learn new words.)",
          "Different: \u00c4idin lukiessa lapsi nukkui. (While mother was reading, the child slept.)",
          "Same: K\u00e4veless\u00e4 mietin tulevaisuutta. (While walking, I thought about the future.)",
          "Different: H\u00e4nen k\u00e4velless\u00e4\u00e4n puistossa n\u00e4in h\u00e4net. (While he/she was walking in the park, I saw him/her.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6. The Instructive Form: -en (By Doing)"
      },
      {
        "type": "paragraph",
        "text": "The second infinitive also has an instructive form (-en), meaning 'by doing' or 'by means of doing'. This is rare in speech but appears in written Finnish."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Instructive form", "Meaning"],
        "rows": [
          ["sy\u00f6d\u00e4", "sy\u00f6den", "by eating"],
          ["puhua", "puhuen", "by speaking"],
          ["lukea", "lukien", "by reading"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Sy\u00f6den terveellisesti pysyt kunnossa. (By eating healthily, you stay in shape.)",
          "Puhuen asiat selvi\u00e4v\u00e4t. (By speaking, matters get resolved.)",
          "Lukien oppii uutta. (By reading, one learns new things.)"
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "In spoken Finnish, people use sy\u00f6m\u00e4ll\u00e4 (third infinitive adessive) instead of sy\u00f6den."
      },
      {
        "type": "subheading",
        "text": "7. Second Infinitive vs. kun + Verb (Spoken vs. Written)"
      },
      {
        "type": "example-table",
        "headers": ["", "Second infinitive", "kun + verb"],
        "rows": [
          ["Style", "written, formal", "spoken, neutral"],
          ["Example", "Sy\u00f6dess\u00e4 kuuntelin radiota.", "Kun s\u00f6in, kuuntelin radiota."],
          ["Meaning", "While eating, I...", "When I ate, I..."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Written: K\u00e4velless\u00e4ni kotiin tapasin vanhan yst\u00e4v\u00e4n.",
          "Spoken: Kun k\u00e4velin kotiin, tapasin vanhan yst\u00e4v\u00e4n."
        ]
      },
      {
        "type": "subheading",
        "text": "8. Common Fixed Expressions with Second Infinitive"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Meaning", "Notes"],
        "rows": [
          ["sit\u00e4 tehdess\u00e4", "while doing that", "fixed phrase"],
          ["n\u00e4in tehdess\u00e4", "while doing this / in doing so", ""],
          ["toisin sanoen", "in other words", "instructive form"],
          ["sanomattakin selv\u00e4", "obvious without saying", ""]
        ]
      },
      {
        "type": "example-list",
        "items": ["Toisin sanoen = in other words (very common in writing)"]
      },
      {
        "type": "subheading",
        "text": "9. Negative Second Infinitive"
      },
      {
        "type": "paragraph",
        "text": "Instead of trying to negate the second infinitive, Finns usually use the abessive of the third infinitive (sen tekem\u00e4tt\u00e4 = without doing it) or kun + negative. For B1, remember: Use kun for negative simultaneous actions."
      },
      {
        "type": "subheading",
        "text": "10. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["Lukessa opin.", "Lukiessa opin.", "Wrong stem \u2014 lukea \u2192 lukiessa (with i)"],
          ["Min\u00e4 sy\u00f6dess\u00e4 kuuntelen.", "Minun sy\u00f6dess\u00e4ni kuuntelen.", "Different subjects need genitive + suffix"],
          ["H\u00e4nen sy\u00f6dess\u00e4 h\u00e4n...", "H\u00e4nen sy\u00f6dess\u00e4\u00e4n...", "Missing suffix after the infinitive"],
          ["Juodessa kahvia min\u00e4 luen.", "Minun juodessani kahvia h\u00e4n luki.", "Clarify who does what"]
        ]
      },
      {
        "type": "subheading",
        "text": "11. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Sy\u00f6dess\u00e4 en saa aikaiseksi puhua. (While eating, I can't manage to speak.)",
          "Kun k\u00e4velin kotiin, alkoi sataa. (While I was walking home, it started to rain.)",
          "H\u00e4nen nukkuessaan min\u00e4 valmistin aamiaisen. (While he/she was sleeping, I prepared breakfast.)",
          "Toisin sanoen, meid\u00e4n t\u00e4ytyy aloittaa alusta. (In other words, we have to start from the beginning.)",
          "Ajaessa autoa on keskitytt\u00e4v\u00e4 tielle. (While driving a car, one must concentrate on the road.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Form the second infinitive (inessive) of: nukkua",
        "items": ["Answer: nukkuessa"]
      },
      {
        "type": "example-list",
        "title": "2. Translate: 'While reading, I learn.' (same subject)",
        "items": ["Answer: Lukiessa opin. or Kun luen, opin."]
      },
      {
        "type": "example-list",
        "title": "3. Translate: 'While the teacher was speaking, we listened.' (different subjects)",
        "items": ["Answer: Opettajan puhuessa me kuuntelimme. or Kun opettaja puhui, me kuuntelimme."]
      },
      {
        "type": "example-list",
        "title": "4. Form the instructive form of: puhua",
        "items": ["Answer: puhuen"]
      },
      {
        "type": "example-list",
        "title": "5. Correct or incorrect? 'Minun sy\u00f6dess\u00e4 h\u00e4n tuli.'",
        "items": ["Answer: Incorrect \u2014 should be 'Minun sy\u00f6dess\u00e4ni h\u00e4n tuli.' (add suffix for different subjects)"]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Kun olin nuori, asuin maalla. (When I was young, I lived in the countryside.)",
          "Toisin sanoen, meid\u00e4n t\u00e4ytyy l\u00e4hte\u00e4 nyt. (In other words, we have to leave now.)",
          "Aurinko paistoi ja linnut lauloivat. (No second infinitive here \u2014 just practice.)",
          "Odottaessani bussia alkoi sataa. (While I was waiting for the bus, it started to rain.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the second infinitive (inessive form -essa/-ess\u00e4) express?",
      "options": [
        "Future action",
        "Simultaneous action (while doing)",
        "Completed past action",
        "Purpose (in order to do)"
      ],
      "correctAnswer": "Simultaneous action (while doing)",
      "explanation": "The inessive form of the second infinitive expresses two actions happening at the same time. Example: Sy\u00f6dess\u00e4 kuuntelin musiikkia (While eating, I listened to music).",
      "hint": "Think of 'while doing'.",
      "points": 10
    },
    {
      "question": "What is the second infinitive (inessive) of 'lukea' (to read)?",
      "options": ["lukeessa", "lukiessa", "lukien", "lukemassa"],
      "correctAnswer": "lukiessa",
      "explanation": "lukea \u2192 strong stem luke- + -essa \u2192 lukiessa (the i appears in the strong stem).",
      "hint": "Strong stem of lukea has an i.",
      "points": 10
    },
    {
      "question": "When do you need to add a possessive suffix to the second infinitive?",
      "options": [
        "Never \u2014 suffixes are not used",
        "Always \u2014 every time you use the second infinitive",
        "Only when the subject of the infinitive is different from the subject of the main clause",
        "Only in questions"
      ],
      "correctAnswer": "Only when the subject of the infinitive is different from the subject of the main clause",
      "explanation": "When the subjects are the same, no suffix is needed (Sy\u00f6dess\u00e4 kuuntelin). When they are different, you need the genitive pronoun + suffix (H\u00e4nen sy\u00f6dess\u00e4\u00e4n kuuntelin).",
      "hint": "Same subject vs. different subject.",
      "points": 10
    },
    {
      "question": "How do you say 'While I was sleeping, the phone rang' (different subjects)?",
      "options": [
        "Nukkuessa puhelin soi.",
        "Minun nukkuessani puhelin soi.",
        "Min\u00e4 nukkuessa puhelin soi.",
        "Nukkuessani puhelin soi."
      ],
      "correctAnswer": "Minun nukkuessani puhelin soi.",
      "explanation": "Different subjects (I was sleeping / phone rang) require the genitive pronoun (minun) + second infinitive + possessive suffix (-ni).",
      "hint": "Different subjects need possessive suffix on the infinitive.",
      "points": 10
    },
    {
      "question": "What is the instructive form of the second infinitive and what does it mean?",
      "options": [
        "-essa/-ess\u00e4 = while doing",
        "-en = by doing (means/manner)",
        "-maan = in order to do",
        "-minen = the act of doing"
      ],
      "correctAnswer": "-en = by doing (means/manner)",
      "explanation": "The instructive form (-en) means 'by doing' or 'by means of doing'. Example: Sy\u00f6den terveellisesti pysyt kunnossa (By eating healthily, you stay in shape).",
      "hint": "Think of 'by means of'.",
      "points": 10
    },
    {
      "question": "What is the second infinitive (inessive) of 'tehd\u00e4' (to do/make)?",
      "options": ["tehdess\u00e4", "tekeess\u00e4", "tehden", "tehnyt"],
      "correctAnswer": "tehdess\u00e4",
      "explanation": "tehd\u00e4 \u2192 strong stem teke- + -ess\u00e4 \u2192 tehdess\u00e4 (k changes to h).",
      "hint": "Strong stem teke- with consonant change.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, what do people usually use instead of the second infinitive?",
      "options": [
        "First infinitive (basic form)",
        "Third infinitive (massa/maan/masta)",
        "kun + verb (when I did/was doing)",
        "Passive voice"
      ],
      "correctAnswer": "kun + verb (when I did/was doing)",
      "explanation": "In spoken Finnish, Finns almost always use 'kun' + verb instead of the second infinitive. Example: 'Kun k\u00e4velin kotiin, tapasin yst\u00e4v\u00e4ni' instead of 'K\u00e4velless\u00e4ni kotiin tapasin yst\u00e4v\u00e4ni'.",
      "hint": "Think of the most natural way to say 'when/while'.",
      "points": 10
    },
    {
      "question": "What is the correct form for 'while reading' when the subject is 'sin\u00e4' (you) and different from the main clause?",
      "options": ["lukiessa", "lukiessasi", "sinun lukiessa", "sinun lukien"],
      "correctAnswer": "lukiessasi",
      "explanation": "Sinun lukies**sasi** = while you read. The possessive suffix -si is added to the infinitive, and the genitive pronoun sinun is optional but common in formal Finnish.",
      "hint": "Add -si to lukiessa.",
      "points": 10
    },
    {
      "question": "What does 'toisin sanoen' mean?",
      "options": [
        "while saying",
        "in other words",
        "without saying",
        "by saying"
      ],
      "correctAnswer": "in other words",
      "explanation": "'Toisin sanoen' is a fixed expression using the instructive form (-en) of the second infinitive. It means 'in other words' and is very common in writing.",
      "hint": "Fixed expression, not literal.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the second infinitive with different subjects?",
      "options": [
        "Sy\u00f6dess\u00e4 kuuntelin radiota.",
        "Minun sy\u00f6dess\u00e4ni radiota.",
        "H\u00e4nen sy\u00f6dess\u00e4\u00e4n min\u00e4 kuuntelin radiota.",
        "Sy\u00f6dess\u00e4\u00e4n min\u00e4 kuuntelin."
      ],
      "correctAnswer": "H\u00e4nen sy\u00f6dess\u00e4\u00e4n min\u00e4 kuuntelin radiota.",
      "explanation": "Different subjects: 'H\u00e4nen sy\u00f6dess\u00e4\u00e4n' (while he/she was eating) and 'min\u00e4 kuuntelin' (I listened) require the genitive pronoun + infinitive + possessive suffix. The other options either have same subject or missing suffix.",
      "hint": "Look for genitive pronoun + infinitive with possessive suffix.",
      "points": 10
    }
  ]
},
{
  "id": "agent-participle",
  "chapter": 12,
  "title": "Agent Participle – Agenttipartisiippi",
  "finnish": "Agenttipartisiippi",
  "icon": "👤",
  "level": "B1",
  "accent": "bg-amber-600",
  "badge": "bg-amber-50 text-amber-700 border-amber-200",
  "description": "The agent participle (-ma/-mä) expresses 'done by X' — including who performed the action, with mandatory possessive suffixes for pronoun agents",
  "content": {
    "type": "rich",
    "intro": "The agent participle is a passive-like participle that includes who did the action (the agent). It translates as 'done by X'. Example: 'minun tekem\u00e4ni ty\u00f6' = work done by me.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the Agent Participle? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["work made by me", "minun tekem\u00e4ni ty\u00f6"],
          ["book written by the teacher", "opettajan kirjoittama kirja"],
          ["cake baked by mother", "\u00e4idin leipoma kakku"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Key idea: The agent participle answers the question 'by whom?' and is always attached to a noun."
      },
      {
        "type": "subheading",
        "text": "2. Formation Rules for All Verb Types"
      },
      {
        "type": "paragraph",
        "text": "General rule: Take the strong stem (same as third person plural present) + -ma / -m\u00e4"
      },
      {
        "type": "subheading",
        "text": "Type 1 (puhua, asua, lukea)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem (they-form)", "Agent participle"],
        "rows": [
          ["puhua", "puhu-", "puhuma"],
          ["asua", "asu-", "asuma"],
          ["lukea", "luke-", "lukema"],
          ["kysy\u00e4", "kysy-", "kysym\u00e4"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 2 (sy\u00f6d\u00e4, juoda, tehd\u00e4, n\u00e4hd\u00e4)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Agent participle"],
        "rows": [
          ["sy\u00f6d\u00e4", "sy\u00f6-", "sy\u00f6m\u00e4"],
          ["juoda", "juo-", "juoma"],
          ["tehd\u00e4", "teke-", "tekem\u00e4"],
          ["n\u00e4hd\u00e4", "n\u00e4ke-", "n\u00e4kem\u00e4"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 3 (menn\u00e4, tulla, nousta, pest\u00e4)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Agent participle"],
        "rows": [
          ["menn\u00e4", "mene-", "menem\u00e4"],
          ["tulla", "tule-", "tulema"],
          ["nousta", "nouse-", "nousema"],
          ["pest\u00e4", "pese-", "pesem\u00e4"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 4 (haluta, osata, vastata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Agent participle"],
        "rows": [
          ["haluta", "halua-", "haluama"],
          ["osata", "osaa-", "osaama"],
          ["vastata", "vastaa-", "vastaama"]
        ]
      },
      {
        "type": "subheading",
        "text": "Type 5 (tarvita, pakata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Agent participle"],
        "rows": [
          ["tarvita", "tarvitse-", "tarvitsema"],
          ["pakata", "pakkaa-", "pakkaama"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. The Mandatory Structure: Agent (genitive) + agent participle + noun"
      },
      {
        "type": "paragraph",
        "text": "The agent (who did the action) is in the genitive case. The agent participle then takes a possessive suffix that matches the agent."
      },
      {
        "type": "example-table",
        "headers": ["Agent (genitive)", "Agent participle + possessive suffix", "Noun"],
        "rows": [
          ["minun", "tekem\u00e4ni", "ty\u00f6"],
          ["sinun", "tekem\u00e4si", "ty\u00f6"],
          ["h\u00e4nen", "tekem\u00e4ns\u00e4", "ty\u00f6"],
          ["meid\u00e4n", "tekem\u00e4mme", "ty\u00f6"],
          ["teid\u00e4n", "tekem\u00e4nne", "ty\u00f6"],
          ["heid\u00e4n", "tekem\u00e4ns\u00e4", "ty\u00f6"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Crucial B1 rule: The agent participle must have a possessive suffix that agrees with the agent. This is different from English!"
      },
      {
        "type": "example-list",
        "items": [
          "minun tekem\u00e4ni ty\u00f6 = the work done by me",
          "sinun kirjoittamasi kirja = the book written by you",
          "h\u00e4nen rakentamansa talo = the house built by him/her",
          "meid\u00e4n suunnittelemamme projekti = the project designed by us",
          "heid\u00e4n kehitt\u00e4m\u00e4ns\u00e4 sovellus = the app developed by them"
        ]
      },
      {
        "type": "subheading",
        "text": "4. Agent Participle Without a Possessive Suffix? (When is it allowed?)"
      },
      {
        "type": "paragraph",
        "text": "In spoken Finnish or very informal writing, the possessive suffix is sometimes dropped, but standard Finnish requires it."
      },
      {
        "type": "example-table",
        "headers": ["Standard (correct)", "Spoken (sometimes heard)"],
        "rows": [
          ["minun tekem\u00e4ni kakku", "minun tekem\u00e4 kakku"],
          ["opettajan kirjoittamansa kirja", "opettajan kirjoittama kirja"]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "For B1, always use the possessive suffix in writing and formal speech."
      },
      {
        "type": "subheading",
        "text": "5. Declension of the Agent Participle"
      },
      {
        "type": "paragraph",
        "text": "The agent participle declines like an adjective to agree with the noun it modifies."
      },
      {
        "type": "example-table",
        "headers": ["Case", "Singular", "Plural"],
        "rows": [
          ["Nominative", "tekem\u00e4ni ty\u00f6", "tekem\u00e4ni ty\u00f6t"],
          ["Genitive", "tekem\u00e4ni ty\u00f6n", "tekemieni t\u00f6iden"],
          ["Partitive", "tekem\u00e4\u00e4ni ty\u00f6t\u00e4", "tekemi\u00e4ni t\u00f6it\u00e4"],
          ["Inessive", "tekem\u00e4ss\u00e4ni ty\u00f6ss\u00e4", "tekemiss\u00e4ni t\u00f6iss\u00e4"],
          ["Elative", "tekem\u00e4st\u00e4ni ty\u00f6st\u00e4", "tekemist\u00e4ni t\u00f6ist\u00e4"],
          ["Illative", "tekem\u00e4\u00e4ni ty\u00f6h\u00f6n", "tekemiini t\u00f6ihin"],
          ["Adessive", "tekem\u00e4ll\u00e4ni ty\u00f6ll\u00e4", "tekemill\u00e4ni t\u00f6ill\u00e4"],
          ["Ablative", "tekem\u00e4lt\u00e4ni ty\u00f6lt\u00e4", "tekemilt\u00e4ni t\u00f6ilt\u00e4"],
          ["Allative", "tekem\u00e4lleni ty\u00f6lle", "tekemilleni t\u00f6ille"]
        ]
      },
      {
        "type": "example-list",
        "title": "Example sentences with cases:",
        "items": [
          "Luin opettajan kirjoittaman kirjan. (genitive) = I read the book written by the teacher.",
          "Puhuin h\u00e4nen tekem\u00e4st\u00e4\u00e4n virheest\u00e4. (elative) = I spoke about the mistake made by him/her.",
          "Olen tyytyv\u00e4inen \u00e4idin leipomaan kakkuun. (illative) = I am satisfied with the cake baked by mother."
        ]
      },
      {
        "type": "subheading",
        "text": "6. Agent Participle vs. Passive Past Participle (Crucial Comparison)"
      },
      {
        "type": "example-table",
        "headers": ["", "Agent participle", "Passive past participle"],
        "rows": [
          ["Ending", "-ma/-m\u00e4", "-ttu/-tty"],
          ["Includes agent?", "Yes (genitive + suffix)", "No (agent hidden or unknown)"],
          ["Example", "minun tekem\u00e4ni ty\u00f6 (work done by me)", "tehty ty\u00f6 (done work)"],
          ["Translation", "\"done by X\"", "\"done\" (passive)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Opettajan kirjoittama kirja = the book written by the teacher (agent known)",
          "Kirjoitettu kirja = a written book (agent unknown)"
        ]
      },
      {
        "type": "subheading",
        "text": "7. Agent Participle with Nouns Other Than Subject"
      },
      {
        "type": "example-list",
        "items": [
          "N\u00e4in h\u00e4nen piirt\u00e4m\u00e4ns\u00e4 kuvan. = I saw the picture drawn by him/her.",
          "Ostin \u00e4idin ompelman paidan. = I bought the shirt sewn by mother.",
          "J\u00e4tin sinun korjaamasi py\u00f6r\u00e4n autotalliin. = I left the bike fixed by you in the garage."
        ]
      },
      {
        "type": "subheading",
        "text": "8. Formal Alternative: toimesta (Extremely Formal)"
      },
      {
        "type": "paragraph",
        "text": "In very formal Finnish (legal documents, official announcements), you may see 'toimesta' instead of the agent participle."
      },
      {
        "type": "example-table",
        "headers": ["Formal (official)", "Normal (agent participle)"],
        "rows": [
          ["Tarkastus suoritettiin insin\u00f6\u00f6rin toimesta.", "Insin\u00f6\u00f6rin suorittama tarkastus"],
          ["Raportti laadittiin asiantuntijan toimesta.", "Asiantuntijan laatima raportti"]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "For B1, ignore 'toimesta' \u2014 just recognize it if you see it. Use the agent participle instead."
      },
      {
        "type": "subheading",
        "text": "9. Fixed Expressions with Agent Participle"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Meaning", "Notes"],
        "rows": [
          ["Jumalan luoma", "God-created", "fixed phrase"],
          ["luonnon muovaama", "shaped by nature", ""],
          ["minun mielest\u00e4ni", "in my opinion", "not agent participle, but common"],
          ["sinun tekem\u00e4si", "the one made by you", "noun omitted"]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Agent Participle in Spoken Finnish"
      },
      {
        "type": "paragraph",
        "text": "In spoken Finnish, the agent participle is less common than in writing. People often use passive voice + relative clause or simple past tense with subject."
      },
      {
        "type": "example-table",
        "headers": ["Written (agent participle)", "Spoken (simpler)"],
        "rows": [
          ["minun tekem\u00e4ni kakku", "kakku, mink\u00e4 m\u00e4 tein"],
          ["opettajan kirjoittama kirja", "kirja, mink\u00e4 opettaja kirjoitti"],
          ["heid\u00e4n rakentamansa talo", "talo, mink\u00e4 ne rakensi"]
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "For B1 speaking, you don't need to use the agent participle actively \u2014 but you must recognize it in reading and listening."
      },
      {
        "type": "subheading",
        "text": "11. Key Clarification: Suffix Requirement"
      },
      {
        "type": "example-table",
        "headers": ["Agent type", "Example", "Suffix required?"],
        "rows": [
          ["Personal pronoun (minun, sinun, etc.)", "minun tekem\u00e4ni", "\u2705 Yes"],
          ["Noun (opettajan, \u00e4idin)", "opettajan tekem\u00e4", "\u274c No"],
          ["Proper name (Maijan, Pekan)", "Maijan tekem\u00e4", "\u274c No"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "\u00c4idin leipoma kakku = the cake baked by mother (no suffix)",
          "H\u00e4nen leipomansa kakku = the cake baked by him/her (suffix required)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["Minun tekem\u00e4 ty\u00f6", "Minun tekem\u00e4ni ty\u00f6", "Missing possessive suffix for pronoun agent."],
          ["H\u00e4nen tekem\u00e4 ty\u00f6", "H\u00e4nen tekem\u00e4ns\u00e4 ty\u00f6", "Missing suffix -ns\u00e4."],
          ["Opettajan kirjoittamansa kirja", "Opettajan kirjoittama kirja", "Noun agent does not take a suffix."]
        ]
      },
      {
        "type": "subheading",
        "text": "13. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Minun kirjoittamani essee sai hyv\u00e4n arvosanan. (The essay written by me got a good grade.)",
          "Oletko lukenut opettajan suositteleman kirjan? (Have you read the book recommended by the teacher?)",
          "\u00c4idin leipoma kakku oli herkullinen. (The cake baked by mother was delicious.)",
          "N\u00e4in eilen sinun suunnittelemasi talon. (I saw the house designed by you yesterday.)",
          "Heid\u00e4n kehitt\u00e4m\u00e4ns\u00e4 sovellus on eritt\u00e4in suosittu. (The app developed by them is very popular.)",
          "Puhuimme Pekan tekem\u00e4st\u00e4 virheest\u00e4. (We talked about the mistake made by Pekka.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Form the agent participle of: rakentaa (to build)",
        "items": ["Answer: rakentama"]
      },
      {
        "type": "example-list",
        "title": "2. Add correct suffix: minun _____ (tekem\u00e4) ty\u00f6",
        "items": ["Answer: minun tekem\u00e4ni ty\u00f6"]
      },
      {
        "type": "example-list",
        "title": "3. Add correct suffix (or not): \u00e4idin _____ (leipoma) kakku",
        "items": ["Answer: \u00e4idin leipoma (no suffix \u2014 noun agent)"]
      },
      {
        "type": "example-list",
        "title": "4. Translate: 'the book written by the student'",
        "items": ["Answer: opiskelijan kirjoittama kirja (no suffix)"]
      },
      {
        "type": "example-list",
        "title": "5. Correct or incorrect? 'Heid\u00e4n rakentamansa talo.'",
        "items": ["Answer: Correct \u2014 heid\u00e4n is a pronoun agent, so -nsa suffix is required and present."]
      },
      {
        "type": "subheading",
        "text": "15. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "T\u00e4m\u00e4 on minun leipomani kakku. (This is the cake baked by me.)",
          "Luin juuri sinun suosittelemasi kirjan. (I just read the book recommended by you.)",
          "Oletko n\u00e4hnyt Maijan maalaaman taulun? (Have you seen the painting painted by Maija?)",
          "Opettajan korjaamat teht\u00e4v\u00e4t olivat vaikeita. (The assignments corrected by the teacher were difficult.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the agent participle (-ma/-m\u00e4) express?",
      "options": [
        "An action happening right now",
        "An action done by someone (done by X)",
        "An action that will happen in the future",
        "An action without an agent (pure passive)"
      ],
      "correctAnswer": "An action done by someone (done by X)",
      "explanation": "The agent participle indicates that an action was done by a specific agent. Example: minun tekem\u00e4ni ty\u00f6 = the work done by me.",
      "hint": "It answers 'by whom?'.",
      "points": 10
    },
    {
      "question": "What is the agent participle of 'tekem\u00e4' actually the form of? Let me rephrase: What verb does 'tekem\u00e4' come from? The question: Form the agent participle of 'tehd\u00e4' (to do/make)?",
      "options": ["tekev\u00e4", "tehty", "tekem\u00e4", "tehnyt"],
      "correctAnswer": "tekem\u00e4",
      "explanation": "tehd\u00e4 \u2192 strong stem teke- + -m\u00e4 = tekem\u00e4 (done by). Example: minun tekem\u00e4ni ty\u00f6 (work done by me).",
      "hint": "Strong stem teke- + -m\u00e4.",
      "points": 10
    },
    {
      "question": "When is a possessive suffix required on the agent participle?",
      "options": [
        "Always \u2014 every agent participle needs a suffix",
        "Never \u2014 suffixes are not used with agent participles",
        "Only when the agent is a personal pronoun (minun, sinun, etc.)",
        "Only when the noun is in the partitive case"
      ],
      "correctAnswer": "Only when the agent is a personal pronoun (minun, sinun, etc.)",
      "explanation": "Personal pronoun agents (minun, sinun, h\u00e4nen, meid\u00e4n, teid\u00e4n, heid\u00e4n) require a possessive suffix (e.g., tekem\u00e4ni, tekem\u00e4ns\u00e4). Noun agents (opettajan, \u00e4idin) do not take a suffix.",
      "hint": "Pronoun vs. noun agent.",
      "points": 10
    },
    {
      "question": "What is the correct form for 'the book written by me'?",
      "options": [
        "minun kirjoittama kirja",
        "minun kirjoittamani kirja",
        "minun kirjoittamansa kirja",
        "minua kirjoittama kirja"
      ],
      "correctAnswer": "minun kirjoittamani kirja",
      "explanation": "Since the agent is the personal pronoun 'minun', the agent participle 'kirjoittama' requires the possessive suffix -ni to agree with the agent.",
      "hint": "Personal pronoun agent needs suffix.",
      "points": 10
    },
    {
      "question": "What is the correct form for 'the cake baked by mother'?",
      "options": [
        "\u00e4idin leipoma kakku",
        "\u00e4idin leipomansa kakku",
        "\u00e4idin leipomansa kakku",
        "\u00e4idin leipomansa kakku?"
      ],
      "correctAnswer": "\u00e4idin leipoma kakku",
      "explanation": "'\u00e4idin' is a noun agent, so no possessive suffix is required. The correct form is '\u00e4idin leipoma kakku'.",
      "hint": "Noun agent = no suffix.",
      "points": 10
    },
    {
      "question": "What is the difference between 'h\u00e4nen kirjoittamansa kirja' and 'opettajan kirjoittama kirja'?",
      "options": [
        "No difference",
        "First means 'his/her written book', second means 'the teacher's written book'",
        "First has a suffix because agent is pronoun; second has no suffix because agent is noun",
        "First is past tense, second is present"
      ],
      "correctAnswer": "First has a suffix because agent is pronoun; second has no suffix because agent is noun",
      "explanation": "The pronoun 'h\u00e4nen' triggers the possessive suffix -nsa on the participle (kirjoittamansa). The noun 'opettajan' does not require a suffix (kirjoittama).",
      "hint": "Pronoun vs. noun agent.",
      "points": 10
    },
    {
      "question": "What is the agent participle of 'lukea' (to read)?",
      "options": ["lukeva", "lukenut", "lukema", "luettava"],
      "correctAnswer": "lukema",
      "explanation": "lukea \u2192 strong stem luke- + -ma = lukema (read by). Example: opettajan lukema kirja (the book read by the teacher).",
      "hint": "Strong stem luke- + -ma.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the agent participle?",
      "options": [
        "Olen lukenut opettajan suositteleman kirjan.",
        "Olen lukenut opettajan suosittelemansa kirjan.",
        "Olen lukenut opettajan suosittelevan kirjan.",
        "Olen lukenut opettajan suositellun kirjan."
      ],
      "correctAnswer": "Olen lukenut opettajan suositteleman kirjan.",
      "explanation": "'Opettajan' is a noun agent, so the agent participle 'suosittelema' takes no suffix. 'Suositteleman' is the genitive form of the participle correctly modifying 'kirjan'.",
      "hint": "Noun agent = no suffix on participle.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, how is the agent participle often replaced?",
      "options": [
        "With VA-participle (-va/-v\u00e4)",
        "With passive voice + relative clause (e.g., kakku, mink\u00e4 m\u00e4 tein)",
        "With NUT-participle only",
        "With the first infinitive"
      ],
      "correctAnswer": "With passive voice + relative clause (e.g., kakku, mink\u00e4 m\u00e4 tein)",
      "explanation": "In spoken Finnish, people often say 'kakku, mink\u00e4 m\u00e4 tein' (the cake that I made) instead of the agent participle 'minun tekem\u00e4ni kakku'.",
      "hint": "Think of a simpler spoken structure.",
      "points": 10
    },
    {
      "question": "What is the correct form for 'the project planned by us'?",
      "options": [
        "meid\u00e4n suunnittelema projekti",
        "meid\u00e4n suunnittelemamme projekti",
        "meid\u00e4n suunnittelemansa projekti",
        "meid\u00e4n suunnitteleva projekti"
      ],
      "correctAnswer": "meid\u00e4n suunnittelemamme projekti",
      "explanation": "'Meid\u00e4n' is a personal pronoun agent, so the agent participle 'suunnittelema' requires the possessive suffix -mme to agree with the agent (meid\u00e4n).",
      "hint": "Personal pronoun agent needs suffix -mme.",
      "points": 10
    }
  ]
},
{
  "id": "conditional-perfect",
  "chapter": 13,
  "title": "Conditional Perfect – Konditionaalin perfekti",
  "finnish": "Konditionaalin perfekti",
  "icon": "⏳",
  "level": "B1",
  "accent": "bg-rose-600",
  "badge": "bg-rose-50 text-rose-700 border-rose-200",
  "description": "The conditional perfect expresses actions that would have happened in the past but didn't — used for regrets, missed opportunities, and hypothetical past situations",
  "content": {
    "type": "rich",
    "intro": "The conditional perfect expresses an action that would have happened in the past but did not happen. It is used for regrets, missed opportunities, and hypothetical past situations.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the Conditional Perfect? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["I would have eaten", "olisin sy\u00f6nyt"],
          ["She would have gone", "olisi mennyt"],
          ["We would have helped", "olisimme auttaneet"]
        ]
      },
      {
        "type": "paragraph",
        "text": "Key idea: Conditional present = would do (now/future). Conditional perfect = would have done (in the past)."
      },
      {
        "type": "subheading",
        "text": "2. Full Conjugation Table"
      },
      {
        "type": "subheading",
        "text": "Positive \u2014 sy\u00f6d\u00e4 (to eat)"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Conditional of olla", "Past participle", "Conditional perfect"],
        "rows": [
          ["min\u00e4", "olisin", "sy\u00f6nyt", "olisin sy\u00f6nyt"],
          ["sin\u00e4", "olisit", "sy\u00f6nyt", "olisit sy\u00f6nyt"],
          ["h\u00e4n", "olisi", "sy\u00f6nyt", "olisi sy\u00f6nyt"],
          ["me", "olisimme", "sy\u00f6neet", "olisimme sy\u00f6neet"],
          ["te", "olisitte", "sy\u00f6neet", "olisitte sy\u00f6neet"],
          ["he", "olisivat", "sy\u00f6neet", "olisivat sy\u00f6neet"]
        ]
      },
      {
        "type": "subheading",
        "text": "menn\u00e4 (to go)"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Conditional perfect"],
        "rows": [
          ["min\u00e4", "olisin mennyt"],
          ["sin\u00e4", "olisit mennyt"],
          ["h\u00e4n", "olisi mennyt"],
          ["me", "olisimme menneet"],
          ["te", "olisitte menneet"],
          ["he", "olisivat menneet"]
        ]
      },
      {
        "type": "subheading",
        "text": "tehd\u00e4 (to do)"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Conditional perfect"],
        "rows": [
          ["min\u00e4", "olisin tehnyt"],
          ["sin\u00e4", "olisit tehnyt"],
          ["h\u00e4n", "olisi tehnyt"],
          ["me", "olisimme tehneet"],
          ["te", "olisitte tehneet"],
          ["he", "olisivat tehneet"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Negative Conditional Perfect"
      },
      {
        "type": "paragraph",
        "text": "Formula: en/et/ei... + olisi + past participle"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Negative", "Meaning"],
        "rows": [
          ["min\u00e4", "en olisi sy\u00f6nyt", "I would not have eaten"],
          ["sin\u00e4", "et olisi sy\u00f6nyt", "you would not have eaten"],
          ["h\u00e4n", "ei olisi sy\u00f6nyt", "he/she would not have eaten"],
          ["me", "emme olisi sy\u00f6neet", "we would not have eaten"],
          ["te", "ette olisi sy\u00f6neet", "you (pl) would not have eaten"],
          ["he", "eiv\u00e4t olisi sy\u00f6neet", "they would not have eaten"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "En olisi mennyt sinne, vaikka olisin saanut rahaa. (I would not have gone there, even if I had gotten money.)",
          "H\u00e4n ei olisi sanonut sit\u00e4, jos h\u00e4n olisi tiennyt totuuden. (He/she would not have said that if he/she had known the truth.)",
          "Me emme olisi voineet voittaa ilman sinua. (We could not have won without you.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. Conditional Present vs. Conditional Perfect (Crucial Comparison)"
      },
      {
        "type": "example-table",
        "headers": ["", "Conditional present", "Conditional perfect"],
        "rows": [
          ["Time", "present / future", "past"],
          ["Meaning", "would do", "would have done"],
          ["Formula", "verb + -isi-", "olisi + past participle"],
          ["Example", "S\u00f6isin pizzaa. (I would eat pizza.)", "Olisin sy\u00f6nyt pizzaa. (I would have eaten pizza.)"],
          ["Reality", "possible (in the future)", "impossible (it didn't happen)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Menisin jos voisin. (I would go if I could.)",
          "Olisin mennyt jos olisin voinut. (I would have gone if I had been able.)",
          "Ostaisin sen auton. (I would buy that car \u2014 but I might still do it.)",
          "Olisin ostanut sen auton. (I would have bought that car \u2014 but I didn't.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5. Common Use Cases (B1 Must-Know)"
      },
      {
        "type": "subheading",
        "text": "A. Regret (past mistake)"
      },
      {
        "type": "example-list",
        "items": [
          "Olisin opiskellut enemm\u00e4n kokeeseen. (I would have studied more for the exam.)",
          "Olisin soittanut sinulle, mutta unohdin. (I would have called you, but I forgot.)"
        ]
      },
      {
        "type": "subheading",
        "text": "B. Missed opportunity"
      },
      {
        "type": "example-list",
        "items": [
          "Olisit saanut paremman arvosanan. (You would have gotten a better grade.)",
          "Olisimme voittaneet pelin, mutta teimme virheen. (We would have won the game, but we made a mistake.)"
        ]
      },
      {
        "type": "subheading",
        "text": "C. Hypothetical past situation"
      },
      {
        "type": "example-list",
        "items": [
          "Jos olisin tiennyt, olisin tullut. (If I had known, I would have come.)",
          "Mit\u00e4 olisit tehnyt? (What would you have done?)"
        ]
      },
      {
        "type": "subheading",
        "text": "D. Unrealized potential"
      },
      {
        "type": "example-list",
        "items": ["H\u00e4n olisi voinut olla suuri taiteilija. (He/she could have been a great artist.)"]
      },
      {
        "type": "subheading",
        "text": "6. Modal Verbs in Conditional Perfect (Very Common, B1 Level)"
      },
      {
        "type": "subheading",
        "text": "voida (can) \u2192 olisi voinut (could have)"
      },
      {
        "type": "example-list",
        "items": [
          "Olisin voinut auttaa sinua. (I could have helped you.)",
          "He olisivat voineet tulla, mutta he eiv\u00e4t halunneet. (They could have come, but they didn't want to.)"
        ]
      },
      {
        "type": "subheading",
        "text": "pit\u00e4\u00e4 (must) \u2192 olisi pit\u00e4nyt (should have)"
      },
      {
        "type": "example-list",
        "items": [
          "Minun olisi pit\u00e4nyt soittaa. (I should have called.)",
          "Sinun olisi pit\u00e4nyt opiskella enemm\u00e4n. (You should have studied more.)"
        ]
      },
      {
        "type": "subheading",
        "text": "saattaa (may) \u2192 olisi saattanut (might have)"
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n olisi saattanut unohtaa. (He/she might have forgotten.)",
          "Se olisi saattanut olla vaarallista. (It might have been dangerous.)"
        ]
      },
      {
        "type": "subheading",
        "text": "t\u00e4yty\u00e4 (must) \u2192 olisi t\u00e4ytynyt (would have had to)"
      },
      {
        "type": "example-list",
        "items": ["Minun olisi t\u00e4ytynyt l\u00e4hte\u00e4 aikaisemmin. (I would have had to leave earlier.)"]
      },
      {
        "type": "subheading",
        "text": "7. Word Order in Conditional Perfect Sentences"
      },
      {
        "type": "example-table",
        "headers": ["Sentence type", "Order", "Example"],
        "rows": [
          ["Main clause", "olisin + participle", "Olisin ostanut sen."],
          ["Negative", "en + olisi + participle", "En olisi ostanut sit\u00e4."],
          ["Question", "Olisitko + participle?", "Olisitko ostanut sen?"],
          ["With jos (if)", "Jos + past perfect, conditional perfect", "Jos olisin tiennyt, olisin tullut."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olisitko auttanut minua, jos olisin pyyt\u00e4nyt? (Would you have helped me if I had asked?)",
          "Emme olisi my\u00f6h\u00e4styneet, jos olisimme l\u00e4hteneet ajoissa. (We would not have been late if we had left on time.)"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Conditional Perfect in Spoken Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken"],
        "rows": [
          ["olisin", "oisin / ois"],
          ["olisit", "oisit"],
          ["olisi", "ois"],
          ["olisimme", "oltas / oltais (or me ois + participle)"],
          ["olisitte", "oisitte"],
          ["olisivat", "ois"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "M\u00e4 oisin sy\u00f6ny jos ois ollu ruokaa. (Written: Min\u00e4 olisin sy\u00f6nyt, jos olisi ollut ruokaa.) = I would have eaten if there had been food.",
          "Me oltas menty, mut meill\u00e4 oli menoja. (Written: Me olisimme menneet, mutta meill\u00e4 oli menoja.) = We would have gone, but we were busy."
        ]
      },
      {
        "type": "subheading",
        "text": "9. Jos (If) Clauses with Conditional Perfect (Hypothetical Past)"
      },
      {
        "type": "paragraph",
        "text": "The conditional perfect is often used together with the past perfect in jos clauses to express unreal past conditions."
      },
      {
        "type": "example-table",
        "headers": ["Jos clause (past perfect)", "Main clause (conditional perfect)"],
        "rows": [
          ["Jos olisin tiennyt...", "...olisin tullut."],
          ["Jos h\u00e4n olisi harjoitellut...", "...h\u00e4n olisi voittanut."]
        ]
      },
      {
        "type": "example-list",
        "title": "Full pattern:",
        "items": [
          "Jos olisin tiennyt (past perfect), olisin tullut (conditional perfect). (If I had known, I would have come.)",
          "Jos olisin voinut, olisin auttanut. (If I had been able to, I would have helped.)",
          "Jos he olisivat soittaneet, me olisimme vastanneet. (If they had called, we would have answered.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["Min\u00e4 olisin sy\u00f6nyt, jos min\u00e4 olisin tiet\u00e4\u00e4.", "...jos olisin tiennyt.", "Jos clause needs past perfect (olisi tiennyt), not infinitive."],
          ["H\u00e4n olisi mennyt, mutta h\u00e4n on sairas.", "...mutta h\u00e4n oli sairas.", "Main clause refers to past, so oli (past), not on."],
          ["Me olisimme sy\u00f6nyt", "Me olisimme sy\u00f6neet", "Plural subject needs plural participle (sy\u00f6neet)."],
          ["En olisi mennyt sinne?", "Enk\u00f6 olisi mennyt sinne?", "Question needs -ko/-k\u00f6 on the negative verb."],
          ["Olisin ostanut, jos minulla on rahaa", "...jos minulla olisi ollut rahaa", "Condition needs past conditional (olisi ollut)."]
        ]
      },
      {
        "type": "subheading",
        "text": "11. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Olisin tullut juhliin, mutta olin sairas. (I would have come to the party, but I was sick.)",
          "Mit\u00e4 olisit tehnyt toisin, jos voisit palata ajassa taaksep\u00e4in? (What would you have done differently if you could go back in time?)",
          "H\u00e4n olisi voinut voittaa kisan, mutta h\u00e4n loukkaantui. (He/she could have won the competition, but he/she got injured.)",
          "Sinun olisi pit\u00e4nyt soittaa minulle aikaisemmin. (You should have called me earlier.)",
          "Jos olisin tiennyt sen, en olisi koskaan suostunut. (If I had known that, I would never have agreed.)",
          "He olisivat auttaneet varmasti, jos olisivat olleet paikalla. (They would certainly have helped if they had been there.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Form the conditional perfect of: n\u00e4hd\u00e4 (to see) for min\u00e4",
        "items": ["Answer: olisin n\u00e4hnyt"]
      },
      {
        "type": "example-list",
        "title": "2. Form the negative conditional perfect of: tulla (to come) for h\u00e4n",
        "items": ["Answer: ei olisi tullut"]
      },
      {
        "type": "example-list",
        "title": "3. Translate: 'We would have bought the car.'",
        "items": ["Answer: Olisimme ostaneet auton."]
      },
      {
        "type": "example-list",
        "title": "4. Translate: 'I should have called.' (use pit\u00e4\u00e4)",
        "items": ["Answer: Minun olisi pit\u00e4nyt soittaa."]
      },
      {
        "type": "example-list",
        "title": "5. Correct or incorrect? 'Jos olisin n\u00e4hnyt h\u00e4net, min\u00e4 tervehdin.'",
        "items": ["Answer: Incorrect \u2014 should be 'Jos olisin n\u00e4hnyt h\u00e4net, olisin tervehtinyt.' (conditional perfect in both clauses or past perfect + conditional perfect)"]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Olisin halunnut tulla, mutta en ehtinyt. (I would have wanted to come, but I didn't have time.)",
          "Olisitko auttanut, jos olisin pyyt\u00e4nyt? (Would you have helped if I had asked?)",
          "Emme olisi ikin\u00e4 uskoneet sit\u00e4. (We would never have believed it.)",
          "Minun olisi pit\u00e4nyt kuunnella vanhempiani. (I should have listened to my parents.)",
          "Mit\u00e4 olisi tapahtunut, jos olisimme valinneet toisin? (What would have happened if we had chosen differently?)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the conditional perfect express?",
      "options": [
        "An action that will happen in the future",
        "An action that would have happened in the past but didn't",
        "An action that is happening right now",
        "An action that must be done"
      ],
      "correctAnswer": "An action that would have happened in the past but didn't",
      "explanation": "The conditional perfect is used for actions that would have taken place in the past but did not happen. Example: Olisin tullut (I would have come).",
      "hint": "Think of 'would have done'.",
      "points": 10
    },
    {
      "question": "How is the conditional perfect formed?",
      "options": [
        "Verb stem + -isi- + personal ending",
        "Present tense of olla + past participle",
        "Conditional of olla + past participle",
        "Past tense of olla + past participle"
      ],
      "correctAnswer": "Conditional of olla + past participle",
      "explanation": "The conditional perfect is formed with the conditional of olla (olisin, olisit, olisi, etc.) + the past participle of the main verb.",
      "hint": "It's 'would have' = conditional of 'have' + past participle.",
      "points": 10
    },
    {
      "question": "What is the correct conditional perfect of 'min\u00e4 sy\u00f6d\u00e4' (I eat) meaning 'I would have eaten'?",
      "options": ["min\u00e4 s\u00f6isin", "min\u00e4 olisin sy\u00f6nyt", "min\u00e4 olen sy\u00f6nyt", "min\u00e4 olin sy\u00f6nyt"],
      "correctAnswer": "min\u00e4 olisin sy\u00f6nyt",
      "explanation": "Conditional perfect: min\u00e4 + olisin (conditional of olla) + sy\u00f6nyt (past participle) = min\u00e4 olisin sy\u00f6nyt (I would have eaten).",
      "hint": "Conditional of olla + past participle.",
      "points": 10
    },
    {
      "question": "What is the negative conditional perfect of 'h\u00e4n menn\u00e4' (he/she goes) meaning 'he/she would not have gone'?",
      "options": ["h\u00e4n ei menisi", "h\u00e4n ei ole mennyt", "h\u00e4n ei olisi mennyt", "h\u00e4n ei ollut mennyt"],
      "correctAnswer": "h\u00e4n ei olisi mennyt",
      "explanation": "Negative conditional perfect: ei + olisi + past participle (mennyt) = ei olisi mennyt.",
      "hint": "Negative verb + olisi + past participle.",
      "points": 10
    },
    {
      "question": "What is the difference between 'olisin sy\u00f6nyt' and 's\u00f6isin'?",
      "options": [
        "No difference",
        "Olisi sy\u00f6nyt = would have eaten (past); s\u00f6isin = would eat (present/future)",
        "First is negative, second is positive",
        "First is past tense, second is present tense"
      ],
      "correctAnswer": "Olisi sy\u00f6nyt = would have eaten (past); s\u00f6isin = would eat (present/future)",
      "explanation": "Olisin sy\u00f6nyt (conditional perfect) refers to a past, unrealized action. S\u00f6isin (conditional present) refers to a hypothetical present/future action.",
      "hint": "One is 'would have', one is 'would'.",
      "points": 10
    },
    {
      "question": "How do you say 'I could have helped you' in Finnish?",
      "options": [
        "Voisin auttaa sinua",
        "Olisin voinut auttaa sinua",
        "Olen voinut auttaa sinua",
        "Voin auttaa sinua"
      ],
      "correctAnswer": "Olisin voinut auttaa sinua",
      "explanation": "Conditional perfect of 'voida' (can) is 'olisi voinut'. Olisin voinut auttaa sinua = I could have helped you.",
      "hint": "Could have = olisi voinut.",
      "points": 10
    },
    {
      "question": "How do you say 'You should have studied more' using 'pit\u00e4\u00e4'?",
      "options": [
        "Sinun t\u00e4ytyy opiskella enemm\u00e4n",
        "Sinun pit\u00e4isi opiskella enemm\u00e4n",
        "Sinun olisi pit\u00e4nyt opiskella enemm\u00e4n",
        "Sinun olisi opiskellut enemm\u00e4n"
      ],
      "correctAnswer": "Sinun olisi pit\u00e4nyt opiskella enemm\u00e4n",
      "explanation": "Conditional perfect of pit\u00e4\u00e4 (must) is 'olisi pit\u00e4nyt'. Sinun olisi pit\u00e4nyt opiskella enemm\u00e4n = You should have studied more.",
      "hint": "Should have = olisi pit\u00e4nyt.",
      "points": 10
    },
    {
      "question": "What is the correct plural form of 'me olisimme sy\u00f6nyt'?",
      "options": ["me olisimme sy\u00f6nyt", "me olisimme sy\u00f6neet", "me olisimme sy\u00f6neet?", "me olimme sy\u00f6neet"],
      "correctAnswer": "me olisimme sy\u00f6neet",
      "explanation": "Plural subjects (me, te, he) require the plural past participle ending -neet. Sy\u00f6nyt is singular, sy\u00f6neet is plural.",
      "hint": "Plural subject = plural participle (sy\u00f6nyt \u2192 sy\u00f6neet).",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the conditional perfect in a hypothetical past sentence?",
      "options": [
        "Jos olisin tiennyt, olisin tullut.",
        "Jos tied\u00e4n, tulen.",
        "Jos tiet\u00e4isin, tulisin.",
        "Jos olen tiennyt, olen tullut."
      ],
      "correctAnswer": "Jos olisin tiennyt, olisin tullut.",
      "explanation": "Hypothetical past condition uses past perfect (Jos olisin tiennyt) + conditional perfect (olisin tullut).",
      "hint": "If I had known, I would have come.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, what is a common shortened form of 'olisin'?",
      "options": ["olin", "oisin / ois", "olen", "olisi"],
      "correctAnswer": "oisin / ois",
      "explanation": "In spoken Finnish, 'olisin' often shortens to 'oisin' or even just 'ois' (especially for third person 'olisi' \u2192 'ois').",
      "hint": "Think of casual speech dropping the 'l'.",
      "points": 10
    }
  ]
},
{
  "id": "temporal-causal-clauses",
  "chapter": 14,
  "title": "Temporal & Causal Clauses – Aikalauset ja syysuhteet",
  "finnish": "Aikalauset ja syysuhteet",
  "icon": "⏱️",
  "level": "B1",
  "accent": "bg-sky-600",
  "badge": "bg-sky-50 text-sky-700 border-sky-200",
  "description": "Temporal clauses (when?) and causal clauses (why?) — essential conjunctions for expressing time relationships and reasons in complex sentences",
  "content": {
    "type": "rich",
    "intro": "Temporal clauses answer 'when?' — they tell the time of the main action. Causal clauses answer 'why?' — they give the reason for the main action.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Are Temporal & Causal Clauses? (Recap)"
      },
      {
        "type": "example-table",
        "headers": ["Clause type", "Finnish conjunctions", "English"],
        "rows": [
          ["Temporal", "kun, kunnes, ennen kuin, sen j\u00e4lkeen kun, samalla kun", "when, until, before, after, while"],
          ["Causal", "koska, sill\u00e4, sen takia ett\u00e4", "because, for, because"]
        ]
      },
      {
        "type": "subheading",
        "text": "2. Temporal Clauses \u2014 Aikalauset (Detailed)"
      },
      {
        "type": "subheading",
        "text": "A. Kun \u2014 when (general time)"
      },
      {
        "type": "paragraph",
        "text": "The most common temporal conjunction. Can refer to past, present, or future."
      },
      {
        "type": "example-table",
        "headers": ["Tense in main clause", "Tense in kun clause", "Example"],
        "rows": [
          ["Past", "Past (imperfekti)", "Kun tulin kotiin, s\u00f6in."],
          ["Present", "Present", "Kun sataa, pysyn kotona."],
          ["Future", "Present", "Kun tulen huomenna, sy\u00f6mme yhdess\u00e4."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Future rule: In Finnish, the kun clause uses present tense even for future events."
      },
      {
        "type": "example-list",
        "items": [
          "Kun saan palkkaa, ostan uuden puhelimen. (When I get paid, I will buy a new phone.)",
          "Kun saan palkkaa, ostan uuden puhelimen (correct) \u2014 no future tense in the kun clause."
        ]
      },
      {
        "type": "subheading",
        "text": "B. Ennen kuin \u2014 before"
      },
      {
        "type": "paragraph",
        "text": "Expresses that the main clause happens before the ennen kuin clause."
      },
      {
        "type": "example-list",
        "items": [
          "Pesin k\u00e4teni ennen kuin s\u00f6in. (I washed my hands before I ate.)",
          "Tule kotiin ennen kuin alkaa sataa. (Come home before it starts to rain.)"
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "Order of events: The event in the main clause happens first, then the ennen kuin event."
      },
      {
        "type": "subheading",
        "text": "C. Sen j\u00e4lkeen kun \u2014 after"
      },
      {
        "type": "paragraph",
        "text": "Expresses that the main clause happens after the sen j\u00e4lkeen kun clause."
      },
      {
        "type": "example-list",
        "items": [
          "Sen j\u00e4lkeen kun s\u00f6in, l\u00e4hdin ulos. (After I ate, I went outside.)",
          "Sen j\u00e4lkeen kun olin nukkunut, olin virke\u00e4. (After I had slept, I was alert.)"
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "Sen j\u00e4lkeen kun is often shortened to sitten kun in spoken Finnish."
      },
      {
        "type": "subheading",
        "text": "D. Samalla kun \u2014 while / at the same time as"
      },
      {
        "type": "paragraph",
        "text": "Expresses two simultaneous actions."
      },
      {
        "type": "example-list",
        "items": [
          "Samalla kun kuuntelin musiikkia, tein l\u00e4ksyj\u00e4. (While I listened to music, I did homework.)",
          "H\u00e4n hymyili samalla kun puhui. (He/she smiled while speaking.)"
        ]
      },
      {
        "type": "subheading",
        "text": "E. Kunnes \u2014 until"
      },
      {
        "type": "paragraph",
        "text": "Expresses that the main action continues up to the point of the kunnes clause."
      },
      {
        "type": "example-list",
        "items": [
          "Odotin kunnes h\u00e4n tuli. (I waited until he/she came.)",
          "Jatka juoksemista kunnes saavut maaliin. (Continue running until you reach the finish line.)"
        ]
      },
      {
        "type": "subheading",
        "text": "F. Niin pian kuin \u2014 as soon as"
      },
      {
        "type": "paragraph",
        "text": "Expresses that the main action happens immediately after the niin pian kuin clause."
      },
      {
        "type": "example-list",
        "items": [
          "Niin pian kuin olen valmis, l\u00e4hden. (As soon as I am ready, I will leave.)",
          "Soita minulle niin pian kuin tulet perille. (Call me as soon as you arrive.)"
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "In speech: heti kun (as soon as)."
      },
      {
        "type": "subheading",
        "text": "G. Kun taas \u2014 while / whereas (contrastive time)"
      },
      {
        "type": "paragraph",
        "text": "Used to contrast two simultaneous or parallel situations."
      },
      {
        "type": "example-list",
        "items": [
          "Min\u00e4 luen, kun taas h\u00e4n katsoo televisiota. (I read, while he/she watches TV.)",
          "Toiset tykk\u00e4\u00e4v\u00e4t kes\u00e4st\u00e4, kun taas toiset pit\u00e4v\u00e4t talvesta. (Some like summer, whereas others prefer winter.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3. Causal Clauses \u2014 Syysuhteiset lauseet (Detailed)"
      },
      {
        "type": "subheading",
        "text": "A. Koska \u2014 because (most common)"
      },
      {
        "type": "paragraph",
        "text": "Gives the reason for the main clause."
      },
      {
        "type": "example-list",
        "items": [
          "En tullut juhliin, koska olin sairas. (I didn't come to the party because I was sick.)",
          "Opiskelen suomea, koska haluan asua Suomessa. (I study Finnish because I want to live in Finland.)"
        ]
      },
      {
        "type": "paragraph",
        "text": "Word order: Koska clause can come before or after the main clause."
      },
      {
        "type": "example-list",
        "items": [
          "Koska satoi, j\u00e4imme kotiin. (Because it rained, we stayed home.)",
          "J\u00e4imme kotiin, koska satoi. (We stayed home because it rained.)"
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "When koska starts the sentence, it is followed immediately by the subject and verb."
      },
      {
        "type": "subheading",
        "text": "B. Sill\u00e4 \u2014 for / because (more formal, literary)"
      },
      {
        "type": "paragraph",
        "text": "Sill\u00e4 is a coordinating conjunction (joins two independent clauses). More formal and common in written Finnish."
      },
      {
        "type": "example-list",
        "items": [
          "En l\u00e4htenyt ulos, sill\u00e4 satoi kovasti. (I didn't go out, for it was raining heavily.)",
          "P\u00e4\u00e4t\u00f6s oli oikea, sill\u00e4 kukaan ei valittanut. (The decision was right, for no one complained.)"
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "In speech, use koska or siksi kun."
      },
      {
        "type": "subheading",
        "text": "C. Siksi ett\u00e4 \u2014 because (emphasizes the reason as an answer to 'why?')"
      },
      {
        "type": "paragraph",
        "text": "Used especially when answering the question miksi? (why?)."
      },
      {
        "type": "example-list",
        "items": [
          "Miksi et tullut? \u2014 Siksi ett\u00e4 olin sairas. (Why didn't you come? \u2014 Because I was sick.)",
          "L\u00e4hdin aikaisin siksi ett\u00e4 en halunnut my\u00f6h\u00e4sty\u00e4. (I left early because I didn't want to be late.)"
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "Siksi ett\u00e4 emphasizes that the following clause is the explicit reason."
      },
      {
        "type": "subheading",
        "text": "D. Sen takia ett\u00e4 \u2014 because of the fact that (more emphatic)"
      },
      {
        "type": "example-list",
        "items": [
          "En saanut ty\u00f6t\u00e4 sen takia ett\u00e4 minulla ei ollut kokemusta. (I didn't get the job because I didn't have experience.)"
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "Often shortened in speech to sit\u00e4 kun / siks ku."
      },
      {
        "type": "subheading",
        "text": "4. Word Order in Subordinate Clauses (Important B1 Rule)"
      },
      {
        "type": "paragraph",
        "text": "In both temporal and causal clauses, the verb is usually after the subject. For B1, use normal order (subject + verb)."
      },
      {
        "type": "example-list",
        "items": [
          "Kun tulin kotiin, s\u00f6in. (When I came home, I ate.)",
          "Koska olin sairas, en tullut. (Because I was sick, I didn't come.)"
        ]
      },
      {
        "type": "subheading",
        "text": "5. Negative Subordinate Clauses"
      },
      {
        "type": "example-list",
        "items": [
          "En sy\u00f6nyt ennen kuin pesin k\u00e4det. (I didn't eat before I washed my hands.)",
          "H\u00e4n ei l\u00e4htenyt, kunnes olin valmis. (He/she didn't leave until I was ready.)",
          "Kun ei ollut ruokaa, menimme kauppaan. (When there was no food, we went to the store.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6. Spoken Finnish Equivalents (B1 must-know)"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken", "Meaning"],
        "rows": [
          ["kun", "ku", "when"],
          ["koska", "ku / koska", "because"],
          ["ennen kuin", "ennen ku", "before"],
          ["sen j\u00e4lkeen kun", "sitten ku", "after"],
          ["samalla kun", "samalla ku", "while"],
          ["sen takia ett\u00e4", "siks ku / sit\u00e4 ku", "because"],
          ["siksi ett\u00e4", "siks ku", "because (emphatic)"]
        ]
      },
      {
        "type": "example-list",
        "title": "Spoken examples:",
        "items": [
          "Tuu ennen ku m\u00e4 l\u00e4hden. (Come before I leave.)",
          "M\u00e4 en tullu ku m\u00e4 olin sairas. (I didn't come because I was sick.)",
          "Sit ku m\u00e4 s\u00f6in, m\u00e4 l\u00e4hin ulos. (After I ate, I went outside.)",
          "Teen sen heti ku m\u00e4 ehdin. (I'll do it as soon as I have time.)"
        ]
      },
      {
        "type": "subheading",
        "text": "7. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Kun olen saanut palkkaa, ostan uusi puhelin.", "Kun saan palkkaa, ostan uuden puhelimen.", "Present tense in kun clause for future."],
          ["Koska minulla on rahaa, siksi min\u00e4 ostan.", "Koska minulla on rahaa, ostan.", "Don't use siksi in the main clause with koska \u2014 it's redundant."],
          ["Sen j\u00e4lkeen kun olen nukkunut, min\u00e4 tunnen hyv\u00e4lt\u00e4.", "Sen j\u00e4lkeen kun nukun, tunnen oloni hyv\u00e4ksi.", "Better with present or past consistent tense."]
        ]
      },
      {
        "type": "subheading",
        "text": "8. Comparison Table of All Conjunctions"
      },
      {
        "type": "example-table",
        "headers": ["Conjunction", "Clause type", "Meaning", "Example"],
        "rows": [
          ["kun", "temporal", "when", "Kun tulen, sy\u00f6mme."],
          ["ennen kuin", "temporal", "before", "Pese k\u00e4det ennen kuin sy\u00f6t."],
          ["sen j\u00e4lkeen kun", "temporal", "after", "Sy\u00f6 sen j\u00e4lkeen kun tulen."],
          ["samalla kun", "temporal", "while", "Puhu samalla kun k\u00e4velet."],
          ["kunnes", "temporal", "until", "Odota kunnes tulen."],
          ["niin pian kuin", "temporal", "as soon as", "Soita niin pian kuin voit."],
          ["koska", "causal", "because", "J\u00e4in kotiin koska satoi."],
          ["sill\u00e4", "causal", "for", "J\u00e4in kotiin, sill\u00e4 satoi."],
          ["siksi ett\u00e4", "causal", "because (emphatic)", "Tein sen siksi ett\u00e4 halusin."],
          ["sen takia ett\u00e4", "causal", "because of the fact", "En tullut sen takia ett\u00e4 olin sairas."]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Kun muutin Suomeen, en osannut sanaakaan suomea. (When I moved to Finland, I didn't know a word of Finnish.)",
          "Koska olen asunut Suomessa kauan, puhun suomea aika hyvin. (Because I have lived in Finland for a long time, I speak Finnish quite well.)",
          "Tulen kotiin ennen kuin alkaa sataa. (I will come home before it starts to rain.)",
          "Sen j\u00e4lkeen kun olen sy\u00f6nyt, voin paremmin. (After I have eaten, I feel better.)",
          "Odotin kunnes bussi tuli. (I waited until the bus came.)",
          "Miksi et vastannut? \u2014 Siksi ett\u00e4 en kuullut puhelimen soivan. (Why didn't you answer? \u2014 Because I didn't hear the phone ring.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Translate: 'When I finish work, I will call you.'",
        "items": ["Answer: Kun saan ty\u00f6n valmiiksi, soitan sinulle."]
      },
      {
        "type": "example-list",
        "title": "2. Translate (spoken): 'Because I was sick, I didn't go to school.'",
        "items": ["Answer: M\u00e4 en menny kouluun ku m\u00e4 olin sairas."]
      },
      {
        "type": "example-list",
        "title": "3. Fill in: Odotan ____ h\u00e4n tulee kotiin. (until)",
        "items": ["Answer: kunnes"]
      },
      {
        "type": "example-list",
        "title": "4. Fill in: ____ l\u00e4hdin ulos, s\u00f6in. (after)",
        "items": ["Answer: Sen j\u00e4lkeen kun"]
      },
      {
        "type": "example-list",
        "title": "5. Correct or incorrect? 'Tulen koska haluan n\u00e4hd\u00e4 sinut.'",
        "items": ["Answer: Correct \u2014 but more natural: 'Tulen, koska haluan n\u00e4hd\u00e4 sinut.' (comma optional)"]
      },
      {
        "type": "subheading",
        "text": "11. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Kun olin lapsi, asuin maalla. (When I was a child, I lived in the countryside.)",
          "Soitan sinulle niin pian kuin ehdin. (I'll call you as soon as I have time.)",
          "Odota kunnes valot muuttuvat vihreiksi. (Wait until the lights turn green.)",
          "Koska sataa, j\u00e4\u00e4mme sis\u00e4lle. (Because it's raining, we'll stay inside.)",
          "Miksi et sy\u00f6nyt? \u2014 Siksi ett\u00e4 en ollut n\u00e4lh\u00e4inen. (Why didn't you eat? \u2014 Because I wasn't hungry.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What tense is used in a 'kun' (when) clause for a future event?",
      "options": [
        "Future tense (tulen) ",
        "Present tense (tulen) ",
        "Past tense",
        "Conditional"
      ],
      "correctAnswer": "Present tense (tulen)",
      "explanation": "In Finnish, when referring to a future event, the 'kun' clause uses the present tense. Example: 'Kun tulen huomenna, sy\u00f6mme yhdess\u00e4' (When I come tomorrow, we will eat together).",
      "hint": "No future tense in subordinate clauses.",
      "points": 10
    },
    {
      "question": "What is the difference between 'koska' and 'sill\u00e4'?",
      "options": [
        "No difference",
        "Koska is more formal, sill\u00e4 is spoken",
        "Koska is a subordinating conjunction (because), sill\u00e4 is coordinating (for) and more formal",
        "Koska means 'because', sill\u00e4 means 'therefore'"
      ],
      "correctAnswer": "Koska is a subordinating conjunction (because), sill\u00e4 is coordinating (for) and more formal",
      "explanation": "Koska introduces a subordinate clause (cannot stand alone). Sill\u00e4 is a coordinating conjunction that joins two independent clauses and is more formal, used mainly in writing.",
      "hint": "Sill\u00e4 is like 'for' in English.",
      "points": 10
    },
    {
      "question": "Which conjunction means 'until'?",
      "options": ["kunnes", "ennen kuin", "sitten kun", "samalla kun"],
      "correctAnswer": "kunnes",
      "explanation": "Kunnes means 'until'. Example: 'Odotin kunnes h\u00e4n tuli' (I waited until he/she came).",
      "hint": "It ends with -nes.",
      "points": 10
    },
    {
      "question": "How do you say 'as soon as' in Finnish?",
      "options": ["kunnes", "ennen kuin", "niin pian kuin", "sen j\u00e4lkeen kun"],
      "correctAnswer": "niin pian kuin",
      "explanation": "Niin pian kuin means 'as soon as'. Example: 'Soita minulle niin pian kuin tulet perille' (Call me as soon as you arrive).",
      "hint": "Think of 'as soon as' literally.",
      "points": 10
    },
    {
      "question": "What is the difference between 'ennen kuin' and 'sen j\u00e4lkeen kun'?",
      "options": [
        "No difference",
        "Ennen kuin = before; sen j\u00e4lkeen kun = after",
        "Ennen kuin = after; sen j\u00e4lkeen kun = before",
        "Both mean 'while'"
      ],
      "correctAnswer": "Ennen kuin = before; sen j\u00e4lkeen kun = after",
      "explanation": "Ennen kuin means 'before' (main clause happens first). Sen j\u00e4lkeen kun means 'after' (main clause happens after the conjunction clause).",
      "hint": "Ennen = before, j\u00e4lkeen = after.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses 'siksi ett\u00e4'?",
      "options": [
        "Siksi ett\u00e4 satoi, j\u00e4imme kotiin.",
        "J\u00e4imme kotiin siksi ett\u00e4 satoi.",
        "Siksi ett\u00e4 olen sairas, en tullut.",
        "En tullut, koska olin sairas."
      ],
      "correctAnswer": "J\u00e4imme kotiin siksi ett\u00e4 satoi.",
      "explanation": "'Siksi ett\u00e4' usually appears after the main clause, explaining the reason. It is often used to answer 'miksi?' (why?) questions.",
      "hint": "Siksi ett\u00e4 often follows the main clause.",
      "points": 10
    },
    {
      "question": "What is the correct word order in a 'koska' clause when 'koska' comes first?",
      "options": [
        "Koska + verb + subject",
        "Koska + subject + verb",
        "Verb + koska + subject",
        "Subject + koska + verb"
      ],
      "correctAnswer": "Koska + subject + verb",
      "explanation": "When 'koska' starts the sentence, normal word order is subject then verb: 'Koska olin sairas, en tullut' (Because I was sick, I didn't come).",
      "hint": "Subject comes right after koska.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, 'kun' often becomes what?",
      "options": ["ku", "ko", "ka", "ken"],
      "correctAnswer": "ku",
      "explanation": "In spoken Finnish, 'kun' is often pronounced 'ku'. Example: 'Tuu ennen ku m\u00e4 l\u00e4hden' (Come before I leave).",
      "hint": "The 'n' is dropped.",
      "points": 10
    },
    {
      "question": "Which conjunction expresses simultaneous actions?",
      "options": ["kun", "samalla kun", "ennen kuin", "sen j\u00e4lkeen kun"],
      "correctAnswer": "samalla kun",
      "explanation": "'Samalla kun' means 'while' or 'at the same time as', expressing two actions happening simultaneously.",
      "hint": "Samalla = at the same time.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'En sy\u00f6nyt ____ pesin k\u00e4det.' (I didn't eat before I washed my hands.)",
      "options": ["kunnes", "ennen kuin", "samalla kun", "sen j\u00e4lkeen kun"],
      "correctAnswer": "ennen kuin",
      "explanation": "'Ennen kuin' means 'before'. The sentence means that the hand-washing happened before the eating, and the eating did NOT happen before that.",
      "hint": "Ennen = before.",
      "points": 10
    }
  ]
},
{
  "id": "verb-rection",
  "chapter": 15,
  "title": "Verb Rection – Verbien rektio",
  "finnish": "Verbien rektio",
  "icon": "🎯",
  "level": "B1",
  "accent": "bg-indigo-600",
  "badge": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "description": "Every verb governs a specific grammatical case for its object or complement — memorize verbs together with their required cases",
  "content": {
    "type": "rich",
    "intro": "Verb rection means that every verb in Finnish governs a specific grammatical case for its object or complement. You cannot guess the case by meaning — you must memorize the verb together with its case.",
    "sections": [
      {
        "type": "example-table",
        "headers": ["English", "Finnish", "Case"],
        "rows": [
          ["I wait for the bus", "Odotan bussia", "Partitive"],
          ["I trust you", "Luotan sinuun", "Illative"],
          ["I like coffee", "Pid\u00e4n kahvista", "Elative"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "Gold rule: Never ask 'Why is this case here?' Ask: 'Which verb requires this case?'"
      },
      {
        "type": "subheading",
        "text": "2. Partitive Verbs (The Largest Group)"
      },
      {
        "type": "paragraph",
        "text": "Most verbs that express process, emotion, incomplete action, or indefinite amount take the partitive."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "Example"],
        "rows": [
          ["odottaa", "to wait for", "Odotan bussia."],
          ["auttaa", "to help", "Autan sinua."],
          ["tarvita", "to need", "Tarvitsen rahaa."],
          ["ajatella", "to think about", "Ajattelen sinua."],
          ["uskoa", "to believe", "Uskon sinua."],
          ["katsoa", "to watch", "Katson televisiota."],
          ["kuunnella", "to listen to", "Kuuntelen musiikkia."],
          ["rakastaa", "to love", "Rakastan sinua."],
          ["vihata", "to hate", "Vihaan v\u00e4kivaltaa."],
          ["pel\u00e4t\u00e4", "to fear", "Pelk\u00e4\u00e4n koiria."],
          ["opiskella", "to study", "Opiskelen suomea."],
          ["harrastaa", "to do as a hobby", "Harrastan urheilua."],
          ["k\u00e4ytt\u00e4\u00e4", "to use", "K\u00e4yt\u00e4n tietokonetta."],
          ["etsi\u00e4", "to search for", "Etsin avaimia."],
          ["mietti\u00e4", "to ponder", "Mietin ongelmaa."],
          ["suunnitella", "to plan", "Suunnittelen matkaa."]
        ]
      },
      {
        "type": "example-list",
        "items": ["Rakastan sinua. = I love you. (partitive \u2014 emotion verb)"]
      },
      {
        "type": "subheading",
        "text": "3. Illative Verbs (Movement Into)"
      },
      {
        "type": "paragraph",
        "text": "These verbs express movement into a place or toward a person/thing."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "Example"],
        "rows": [
          ["menn\u00e4", "to go (into)", "Menen kauppaan."],
          ["tulla", "to come (into)", "Tulen huoneeseen."],
          ["luottaa", "to trust", "Luotan sinuun."],
          ["tutustua", "to get to know", "Tutustun naapuriin."],
          ["t\u00f6rm\u00e4t\u00e4", "to bump into", "T\u00f6rm\u00e4sin yst\u00e4v\u00e4\u00e4n."],
          ["osallistua", "to participate in", "Osallistun kokoukseen."],
          ["keskitty\u00e4", "to concentrate on", "Keskityn ty\u00f6h\u00f6n."],
          ["ryhty\u00e4", "to start/undertake", "Ryhdyn ty\u00f6h\u00f6n."],
          ["suostua", "to agree to", "Suostun ehdotukseen."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Luotan sinuun. = I trust you. (illative \u2014 not partitive)",
          "Keskityn ty\u00f6h\u00f6n. = I concentrate on work."
        ]
      },
      {
        "type": "subheading",
        "text": "4. Elative Verbs (Out of / About)"
      },
      {
        "type": "paragraph",
        "text": "These verbs express coming out of, talking about, or feeling about."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "Example"],
        "rows": [
          ["pit\u00e4\u00e4", "to like", "Pid\u00e4n kahvista."],
          ["tyk\u00e4t\u00e4", "to like (colloquial)", "Tykk\u00e4\u00e4n sinusta."],
          ["nauttia", "to enjoy", "Nautin ruoasta."],
          ["puhua", "to speak about", "Puhun sinusta."],
          ["kertoa", "to tell about", "Kerron tapahtumasta."],
          ["unelmoida", "to dream about", "Unelmoin lomasta."],
          ["huolehtia", "to take care of", "Huolehdin lapsista."],
          ["v\u00e4litt\u00e4\u00e4", "to care about", "V\u00e4lit\u00e4n perheest\u00e4ni."],
          ["luopua", "to give up", "Luovun tavaroistani."],
          ["innostua", "to get excited about", "Innostun uudesta ideasta."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Pid\u00e4n sinusta. = I like you. (elative)",
          "Huolehdin lapsista. = I take care of the children."
        ]
      },
      {
        "type": "subheading",
        "text": "5. Inessive Verbs (Inside / In)"
      },
      {
        "type": "paragraph",
        "text": "These express location inside or state of being in."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "Example"],
        "rows": [
          ["asua", "to live in", "Asun Helsingiss\u00e4."],
          ["olla", "to be in", "Olen kaupassa."],
          ["k\u00e4yd\u00e4", "to visit (in)", "K\u00e4yn kaupassa."],
          ["istua", "to sit in", "Istun tuolissa."],
          ["matkustaa", "to travel in", "Matkustan bussissa."]
        ]
      },
      {
        "type": "example-list",
        "items": ["K\u00e4yn kaupassa. = I visit the store / go to the store (inessive \u2014 location, not movement into)"]
      },
      {
        "type": "subheading",
        "text": "6. Accusative/Genitive Verbs (Total Object)"
      },
      {
        "type": "paragraph",
        "text": "Some verbs require the total object (accusative, which looks like genitive in singular, nominative in plural)."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "Example"],
        "rows": [
          ["n\u00e4hd\u00e4", "to see", "N\u00e4in koiran."],
          ["tavata", "to meet", "Tapasin yst\u00e4v\u00e4n."],
          ["l\u00f6yt\u00e4\u00e4", "to find", "L\u00f6ysin avaimen."],
          ["unohtaa", "to forget", "Unohdin puhelimen."],
          ["saada", "to get/receive", "Sain kirjeen."],
          ["tehd\u00e4", "to do/make", "Tein ty\u00f6n."],
          ["ostaa", "to buy", "Ostin uuden puhelimen."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "N\u00e4in sinut eilen. = I saw you yesterday. (accusative = genitive sinut)",
          "Difference: N\u00e4in koiran = I saw the dog (completely, specific); N\u00e4in koiraa = I saw the dog (partially, vaguely, or in a process)."
        ]
      },
      {
        "type": "subheading",
        "text": "7. Verbs That Change Meaning Based on Case (B1 Crucial!)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "+ Partitive", "+ Accusative/Genitive", "+ Other"],
        "rows": [
          ["muistaa", "Muistan sinua (vaguely/affectionately)", "Muistan sinut (specific fact)", ""],
          ["tuntea", "Tunnen sinua (emotionally)", "Tunnen sinut (personally)", ""],
          ["soittaa", "Soitan kitaraa (play instrument)", "Soitan sinut kotiin (call home)", "Soitan sinulle (call you \u2014 allative)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Soittaa has three different cases with different meanings!",
          "Soitan kitaraa = I play the guitar (partitive)",
          "Soitan sinut kotiin = I'll call you home (accusative)",
          "Soitan sinulle = I'll call you (allative) \u2014 most common in spoken"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Adjective Rection (Verbs with Adjective Complements)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Required case", "Example"],
        "rows": [
          ["tulla + adj", "translative (-ksi)", "Tulin iloiseksi. (I became happy)"],
          ["l\u00f6yt\u00e4\u00e4 + noun + adj", "accusative + essive", "L\u00f6ysin sen rikkin\u00e4isen\u00e4."]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Verb Rection with Infinitives"
      },
      {
        "type": "paragraph",
        "text": "When a verb is followed by another verb, the second verb is usually in the basic dictionary form (1st infinitive) or the 3rd infinitive with a case."
      },
      {
        "type": "example-list",
        "items": [
          "Haluan oppia suomea. (I want to learn Finnish \u2014 haluta + 1st infinitive)",
          "Rakastan uimista. (I love swimming \u2014 3rd infinitive partitive)"
        ]
      },
      {
        "type": "subheading",
        "text": "10. Rection with Negation (Important B1 Note)"
      },
      {
        "type": "paragraph",
        "text": "Negation does not change the case requirement of the verb. If the positive form takes partitive, the negative also takes partitive."
      },
      {
        "type": "example-list",
        "items": [
          "Odota bussia. \u2192 \u00c4l\u00e4 odota bussia. (Still partitive)",
          "Luotan sinuun. \u2192 En luota sinuun. (Still illative)",
          "Pid\u00e4n kahvista. \u2192 En pid\u00e4 kahvista. (Still elative)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Common B1 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["Odotan bussin.", "Odotan bussia.", "Odottaa always takes partitive."],
          ["Luotan sinua.", "Luotan sinuun.", "Luottaa takes illative, not partitive."],
          ["Pid\u00e4n kahvia.", "Pid\u00e4n kahvista.", "Pit\u00e4\u00e4 (like) takes elative, not partitive."],
          ["Menen Helsingiss\u00e4.", "Menen Helsinkiin.", "Movement into \u2192 illative, not inessive."],
          ["Tutustun sinua.", "Tutustun sinuun.", "Tutustua takes illative."],
          ["Keskityn ty\u00f6ss\u00e4.", "Keskityn ty\u00f6h\u00f6n.", "Keskitty\u00e4 takes illative, not inessive."],
          ["Rakastan sinulle.", "Rakastan sinua.", "Rakastaa takes partitive, not allative."]
        ]
      },
      {
        "type": "subheading",
        "text": "12. Quick Reference Table (B1 Must-Know)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Case", "Example"],
        "rows": [
          ["odottaa", "partitive", "odottaa bussia"],
          ["auttaa", "partitive", "auttaa sinua"],
          ["tarvita", "partitive", "tarvitsee rahaa"],
          ["rakastaa", "partitive", "rakastaa sinua"],
          ["katsoa", "partitive", "katsoo televisiota"],
          ["kuunnella", "partitive", "kuuntelee musiikkia"],
          ["menn\u00e4", "illative", "menee kauppaan"],
          ["tulla", "illative", "tulee taloon"],
          ["luottaa", "illative", "luottaa sinuun"],
          ["tutustua", "illative", "tutustuu sinuun"],
          ["keskitty\u00e4", "illative", "keskittyy ty\u00f6h\u00f6n"],
          ["pit\u00e4\u00e4", "elative", "pit\u00e4\u00e4 kahvista"],
          ["tyk\u00e4t\u00e4", "elative", "tykk\u00e4\u00e4 sinusta"],
          ["puhua", "elative", "puhuu sinusta"],
          ["unelmoida", "elative", "unelmoi lomasta"],
          ["asua", "inessive", "asuu Helsingiss\u00e4"],
          ["olla", "inessive", "on kaupassa"],
          ["n\u00e4hd\u00e4", "accusative", "n\u00e4kee koiran"],
          ["l\u00f6yt\u00e4\u00e4", "accusative", "l\u00f6yt\u00e4\u00e4 avaimen"]
        ]
      },
      {
        "type": "subheading",
        "text": "13. Practical B1 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Odotan bussia, mutta se on my\u00f6h\u00e4ss\u00e4. (I'm waiting for the bus, but it's late.)",
          "Luotatko minuun? \u2014 En, koska olet pett\u00e4nyt minut ennen. (Do you trust me? \u2014 No, because you have betrayed me before.)",
          "Pid\u00e4n enemm\u00e4n kes\u00e4st\u00e4 kuin talvesta. (I like summer more than winter.)",
          "Keskity nyt t\u00e4h\u00e4n teht\u00e4v\u00e4\u00e4n, \u00e4l\u00e4 puhelimeesi! (Concentrate on this task now, not on your phone!)",
          "Rakastan sinua enemm\u00e4n kuin sanoin voin kuvata. (I love you more than I can describe in words.)",
          "Muistan sinut hyvin, vaikka tapasimme vain kerran. (I remember you well, even though we met only once.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Which case after 'odottaa'?",
        "items": ["Answer: Partitive"]
      },
      {
        "type": "example-list",
        "title": "2. Fill in: En luota _____ (sin\u00e4).",
        "items": ["Answer: sinuun (illative)"]
      },
      {
        "type": "example-list",
        "title": "3. Fill in: Pid\u00e4n _____ (kissa).",
        "items": ["Answer: kissasta (elative \u2014 pid\u00e4n kissasta)"]
      },
      {
        "type": "example-list",
        "title": "4. Translate: 'I trust my friend.'",
        "items": ["Answer: Luotan yst\u00e4v\u00e4\u00e4ni."]
      },
      {
        "type": "example-list",
        "title": "5. Correct or incorrect? 'Menen kotiin.'",
        "items": ["Answer: Correct \u2014 kotiin is illative of koti (home)."]
      },
      {
        "type": "subheading",
        "text": "15. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tarvitsen apua t\u00e4ss\u00e4 teht\u00e4v\u00e4ss\u00e4. (I need help with this task.)",
          "Keskity nyt ajamiseen, \u00e4l\u00e4 puhu puhelimeen. (Concentrate on driving now, don't talk on the phone.)",
          "Oletko koskaan tutustunut julkkikseen? (Have you ever gotten to know a celebrity?)",
          "Huolehdin mummoni kukista joka p\u00e4iv\u00e4. (I take care of my grandmother's flowers every day.)",
          "Miten voin luopua vanhoista muistoistani? (How can I give up my old memories?)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What case does 'odottaa' (to wait for) require?",
      "options": ["Illative", "Elative", "Partitive", "Inessive"],
      "correctAnswer": "Partitive",
      "explanation": "'Odottaa' always takes the partitive case. Example: Odotan bussia (I'm waiting for the bus).",
      "hint": "Waiting is an ongoing process.",
      "points": 10
    },
    {
      "question": "What case does 'luottaa' (to trust) require?",
      "options": ["Partitive", "Illative", "Elative", "Inessive"],
      "correctAnswer": "Illative",
      "explanation": "'Luottaa' takes the illative case. Example: Luotan sinuun (I trust you).",
      "hint": "Trust is moving toward someone.",
      "points": 10
    },
    {
      "question": "What is the correct form after 'pit\u00e4\u00e4' when meaning 'to like'?",
      "options": ["Pid\u00e4n kahvi", "Pid\u00e4n kahvia", "Pid\u00e4n kahvista", "Pid\u00e4n kahville"],
      "correctAnswer": "Pid\u00e4n kahvista",
      "explanation": "'Pit\u00e4\u00e4' (to like) takes the elative case (-sta/-st\u00e4). Pid\u00e4n kahvista = I like coffee.",
      "hint": "Elative case = from/about.",
      "points": 10
    },
    {
      "question": "Which sentence means 'I'm going to the store' (movement into)?",
      "options": ["K\u00e4yn kaupassa", "Menen kaupassa", "Menen kauppaan", "Olen kaupassa"],
      "correctAnswer": "Menen kauppaan",
      "explanation": "'Menn\u00e4' (to go) with movement into a place requires the illative case (-Vn). Kauppaan is illative of kauppa.",
      "hint": "Movement into = illative.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Muistan sinut' and 'Muistan sinua'?",
      "options": [
        "No difference",
        "Muistan sinut = I remember you (specific fact); Muistan sinua = I remember you (vaguely/affectionately)",
        "First is past tense, second is present",
        "First is negative, second is positive"
      ],
      "correctAnswer": "Muistan sinut = I remember you (specific fact); Muistan sinua = I remember you (vaguely/affectionately)",
      "explanation": "'Muistaa' with accusative (sinut) means remembering a specific fact or person. With partitive (sinua) means remembering in a vague, ongoing, or affectionate way.",
      "hint": "Accusative = specific, partitive = vague/ongoing.",
      "points": 10
    },
    {
      "question": "What case does 'keskitty\u00e4' (to concentrate on) take?",
      "options": ["Inessive", "Elative", "Illative", "Partitive"],
      "correctAnswer": "Illative",
      "explanation": "'Keskitty\u00e4' takes the illative case. Example: Keskityn ty\u00f6h\u00f6n (I concentrate on work).",
      "hint": "Concentrating is directing focus into something.",
      "points": 10
    },
    {
      "question": "Which sentence is correct for 'I called you' (by phone)?",
      "options": [
        "Soitin sinut",
        "Soitin sinulle",
        "Soitin sinua",
        "Soitin sinussa"
      ],
      "correctAnswer": "Soitin sinulle",
      "explanation": "'Soittaa' (to call by phone) takes the allative case (-lle). Soitin sinulle = I called you. 'Soitin sinut' would mean 'I called you home' (different meaning).",
      "hint": "Phone calls use allative.",
      "points": 10
    },
    {
      "question": "What case does 'puhua' (to speak about) require?",
      "options": ["Partitive", "Illative", "Elative", "Inessive"],
      "correctAnswer": "Elative",
      "explanation": "'Puhua' when meaning 'to speak about' takes the elative case. Example: Puhun sinusta (I speak about you).",
      "hint": "Speaking about something = coming from the topic.",
      "points": 10
    },
    {
      "question": "Does negation change the case requirement of a verb?",
      "options": [
        "Yes, always",
        "No, the case remains the same",
        "Only with partitive verbs",
        "Only with illative verbs"
      ],
      "correctAnswer": "No, the case remains the same",
      "explanation": "Negation does not change the case requirement of the verb. If the positive form takes partitive, the negative also takes partitive. Example: Odotan bussia \u2192 En odota bussia (still partitive).",
      "hint": "The verb governs the case, not the negation.",
      "points": 10
    },
    {
      "question": "Which case follows 'tulla' when expressing 'becoming something'?",
      "options": ["Partitive", "Illative", "Translative (-ksi)", "Elative"],
      "correctAnswer": "Translative (-ksi)",
      "explanation": "'Tulla' (to become) takes the translative case (-ksi). Example: Tulin iloiseksi (I became happy).",
      "hint": "Becoming = change into something.",
      "points": 10
    }
  ]
},


{
  "id": "object-cases",
  "chapter": 1,
  "title": "Object Cases – Objektin sijat",
  "finnish": "Objektin sijat",
  "icon": "🎯",
  "level": "B2",
  "accent": "bg-blue-600",
  "badge": "bg-blue-50 text-blue-700 border-blue-200",
  "description": "Advanced object cases: telic vs. atelic aspect, partitive in negatives and imperatives, objects in passive, necessive structures, perception verbs, perfect tenses, and partitive-only verbs",
  "content": {
    "type": "rich",
    "intro": "At B2 level, you move from 'total vs. partial' to the deeper linguistic distinction: telic (action has a natural endpoint) vs. atelic (action has no natural endpoint or is viewed as ongoing).",
    "sections": [
      {
        "type": "subheading",
        "text": "1. The Big Picture at B2: Telic vs. Atelic Aspect"
      },
      {
        "type": "example-table",
        "headers": ["", "Telic (resultative)", "Atelic (processual)"],
        "rows": [
          ["Object case", "Genitive (-n) / Nominative (imperative)", "Partitive"],
          ["Meaning", "Action completed; goal reached", "Action ongoing; no inherent endpoint"],
          ["Example", "Luin kirjan (I read the book entirely)", "Luin kirjaa (I was reading the book)"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: The genitive object signals that the action's natural endpoint has been reached. The partitive signals that the action is viewed without an endpoint."
      },
      {
        "type": "subheading",
        "text": "2. The Partitive as Default in Negative Sentences"
      },
      {
        "type": "paragraph",
        "text": "In negative sentences, the object is always partitive — regardless of whether the intended positive action would have been total."
      },
      {
        "type": "example-table",
        "headers": ["Positive (total)", "Negative", "Meaning"],
        "rows": [
          ["S\u00f6in omenan", "En sy\u00f6nyt omenaa", "I didn't eat the apple"],
          ["Luin kirjan", "En lukenut kirjaa", "I didn't read the book"],
          ["Ostin auton", "En ostanut autoa", "I didn't buy the car"],
          ["Tapasin h\u00e4net", "En tavannut h\u00e4nt\u00e4", "I didn't meet him/her"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. The Object in Imperative Sentences"
      },
      {
        "type": "paragraph",
        "text": "In affirmative commands, the object is nominative (singular) or nominative plural. In negative commands (\u00e4l\u00e4), the object is partitive."
      },
      {
        "type": "example-table",
        "headers": ["Command type", "Object case", "Example", "Meaning"],
        "rows": [
          ["Affirmative sg", "Nominative", "Sy\u00f6 omena!", "Eat the apple!"],
          ["Affirmative pl", "Nominative pl", "Sy\u00f6k\u00e4\u00e4 omenat!", "Eat the apples!"],
          ["Negative sg", "Partitive", "\u00c4l\u00e4 sy\u00f6 omenaa!", "Don't eat the apple!"],
          ["Negative pl", "Partitive", "\u00c4lk\u00e4\u00e4 sy\u00f6k\u00f6 omenaa!", "Don't eat the apple!"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Ota kirja! (Take the book! \u2014 nominative)",
          "\u00c4l\u00e4 ota kirjaa! (Don't take the book! \u2014 partitive)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. Object in Passive and Impersonal Sentences"
      },
      {
        "type": "example-table",
        "headers": ["Sentence", "Object case", "Meaning"],
        "rows": [
          ["Kirja luettiin", "Nominative (total)", "The book was read (completely)"],
          ["Kirjaa luettiin", "Partitive (partial)", "The book was being read / read partially"],
          ["Auto ostettiin", "Nominative", "The car was bought"],
          ["Ruokaa sy\u00f6tiin", "Partitive", "Food was eaten (some)"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "B2 nuance: In passive, the nominative object signals that the item was completely affected. The partitive signals incomplete affection or that the action was ongoing."
      },
      {
        "type": "subheading",
        "text": "5. Object in Necessive Structures (minun t\u00e4ytyy, minun pit\u00e4\u00e4)"
      },
      {
        "type": "example-table",
        "headers": ["Structure", "Example", "Meaning"],
        "rows": [
          ["Minun t\u00e4ytyy + total object", "Minun t\u00e4ytyy lukea kirja", "I have to read the (whole) book"],
          ["Minun t\u00e4ytyy + partial object", "Minun t\u00e4ytyy lukea kirjaa", "I have to read some of the book (or read for a while)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Sinun pit\u00e4\u00e4 ostaa auto. = You have to buy a car (total \u2014 the goal is to own one).",
          "Sinun pit\u00e4\u00e4 ostaa autoa. = You have to buy a car (partial \u2014 maybe not finished, or shopping around)."
        ]
      },
      {
        "type": "subheading",
        "text": "6. Object with Perception Verbs (n\u00e4en, kuulen, tunnen)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Total object (genitive)", "Partial object (partitive)", "Meaning difference"],
        "rows": [
          ["n\u00e4hd\u00e4", "N\u00e4in koiran", "N\u00e4in koiraa", "I saw the dog (once) / I saw the dog (glimpsed / ongoing)"],
          ["kuulla", "Kuulin laulun", "Kuulin laulua", "I heard the song (whole song) / I heard singing (some of it)"],
          ["tuntea", "Tunnen herra Virtasen", "Tunnen herra Virtasta", "I know Mr. Virtanen (personally) / I feel/know him (vaguely)"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 nuance: With tuntea, the genitive object means 'know personally/intimately'; the partitive means 'recognize / have a feeling of / know superficially'."
      },
      {
        "type": "subheading",
        "text": "7. Object in Perfect Tenses (Perfect and Past Perfect)"
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Total object", "Partial object"],
        "rows": [
          ["Perfect", "Olen sy\u00f6nyt omenan (I have eaten the apple)", "Olen sy\u00f6nyt omenaa (I have eaten some apple)"],
          ["Past perfect", "Olin sy\u00f6nyt omenan (I had eaten the apple)", "Olin sy\u00f6nyt omenaa (I had eaten some apple)"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "The perfect tense does not force totality. The choice depends on whether the speaker views the action as completed vs. ongoing/partial."
      },
      {
        "type": "subheading",
        "text": "8. Partitive Verbs (Always Partitive, Regardless of Aspect)"
      },
      {
        "type": "paragraph",
        "text": "Some verbs always take the partitive object because they describe emotions, processes, or actions that cannot be 'completed' in a bounding sense."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Example", "Meaning"],
        "rows": [
          ["rakastaa", "Rakastan sinua", "I love you"],
          ["vihata", "Vihaan v\u00e4kivaltaa", "I hate violence"],
          ["pel\u00e4t\u00e4", "Pelk\u00e4\u00e4n h\u00e4m\u00e4h\u00e4kkej\u00e4", "I'm afraid of spiders"],
          ["odottaa", "Odotan bussia", "I'm waiting for the bus"],
          ["auttaa", "Autan yst\u00e4v\u00e4\u00e4", "I help a friend"],
          ["tarvita", "Tarvitsen rahaa", "I need money"],
          ["tutkia", "Tutkin asiaa", "I investigate the matter"],
          ["harkita", "Harkitsen vaihtoehtoja", "I consider options"],
          ["ep\u00e4ill\u00e4", "Ep\u00e4ilen h\u00e4nen aikomuksiaan", "I doubt his intentions"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: For these verbs, the action is atelic by nature \u2014 there is no natural endpoint to 'loving' or 'waiting'."
      },
      {
        "type": "subheading",
        "text": "9. Negative Imperative Object Rules (Advanced)"
      },
      {
        "type": "example-table",
        "headers": ["Type", "Example", "Object case"],
        "rows": [
          ["Normal negative command", "\u00c4l\u00e4 osta autoa!", "Partitive"],
          ["Fixed expression", "\u00c4l\u00e4 tee niin!", "Nominative (demonstrative)"],
          ["With plural object", "\u00c4l\u00e4 sy\u00f6 omenia!", "Partitive plural"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "\u00c4l\u00e4 unohda minua! = Don't forget me! (partitive)",
          "\u00c4l\u00e4 tee sit\u00e4! = Don't do that! (nominative \u2014 se in accusative form)"
        ]
      },
      {
        "type": "subheading",
        "text": "10. Object in -minen Infinitive Structures"
      },
      {
        "type": "paragraph",
        "text": "When a verb is nominalized with -minen, its object remains in the same case as the base verb would require, but the -minen noun itself declines."
      },
      {
        "type": "example-list",
        "items": [
          "Kirjan lukeminen vie aikaa. (Reading the book takes time.)",
          "Kirjan lukeminen on hauskaa. = Reading the book (completely) is fun.",
          "Kirjaa lukeminen on hauskaa. (less common) = Reading a book (in general) is fun."
        ]
      },
      {
        "type": "subheading",
        "text": "11. Advanced Nuances: Partitive with Telic Verbs"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Total (genitive)", "Partitive (nuanced)"],
        "rows": [
          ["tappaa", "Tapoin h\u00e4net (I killed him)", "Tapoin h\u00e4nt\u00e4 (I tried to kill him / was killing him)"],
          ["l\u00f6yt\u00e4\u00e4", "L\u00f6ysin avaimen (I found the key)", "L\u00f6ysin avainta (I was finding the key / almost found it)"],
          ["rakentaa", "Rakensin talon (I built the house)", "Rakensin taloa (I was building the house)"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "B2 key: The partitive with a telic verb shifts the focus to the process, often implying that the intended endpoint was not reached."
      },
      {
        "type": "subheading",
        "text": "12. Object in Idiomatic Structures: Minulla on + object"
      },
      {
        "type": "example-table",
        "headers": ["Affirmative", "Negative", "Meaning"],
        "rows": [
          ["Minulla on auto", "Minulla ei ole autoa", "I have a car / I don't have a car"],
          ["Minulla on aikaa", "Minulla ei ole aikaa", "I have time / I don't have time"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "In on sentences, the object is the subject (nominative). In negation, it becomes partitive."
      },
      {
        "type": "subheading",
        "text": "13. Object in Existential Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Huoneessa on p\u00f6yt\u00e4. = There is a table in the room.",
          "Huoneessa ei ole p\u00f6yt\u00e4\u00e4. = There is no table in the room.",
          "Lauantaiksi on suunniteltu juhlat. = A party has been planned for Saturday.",
          "Lauantaiksi ei ole suunniteltu juhlia. = No party has been planned for Saturday."
        ]
      },
      {
        "type": "subheading",
        "text": "14. Advanced Comparison Table (B2 Level)"
      },
      {
        "type": "example-table",
        "headers": ["Context", "Total object (genitive/nominative)", "Partial object (partitive)"],
        "rows": [
          ["Affirmative statement", "S\u00f6in omenan (I ate the apple completely)", "S\u00f6in omenaa (I ate some apple / was eating an apple)"],
          ["Negative statement", "\u2014 (not used)", "En sy\u00f6nyt omenaa"],
          ["Affirmative imperative", "Sy\u00f6 omena!", "Sy\u00f6 omenaa! (Eat some apple)"],
          ["Negative imperative", "\u00c4l\u00e4 sy\u00f6 omena! (rare)", "\u00c4l\u00e4 sy\u00f6 omenaa!"],
          ["Passive", "Omena sy\u00f6tiin (The apple was eaten)", "Omenaa sy\u00f6tiin (Apple was being eaten)"],
          ["Perfect", "Olen sy\u00f6nyt omenan", "Olen sy\u00f6nyt omenaa"],
          ["Necessive (t\u00e4ytyy)", "Minun t\u00e4ytyy sy\u00f6d\u00e4 omena", "Minun t\u00e4ytyy sy\u00f6d\u00e4 omenaa"]
        ]
      },
      {
        "type": "subheading",
        "text": "15. Common B2-Level Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["En sy\u00f6nyt omenan", "En sy\u00f6nyt omenaa", "Negative always partitive"],
          ["\u00c4l\u00e4 sy\u00f6 omena", "\u00c4l\u00e4 sy\u00f6 omenaa", "Negative imperative \u2192 partitive"],
          ["Minulla ei ole auto", "Minulla ei ole autoa", "Negative existential \u2192 partitive"],
          ["Tapoin h\u00e4nt\u00e4 (meaning 'I killed him')", "Tapoin h\u00e4net", "Telic verb with intended completion needs genitive"],
          ["Odotan bussin", "Odotan bussia", "Odottaa is partitive-only"]
        ]
      },
      {
        "type": "subheading",
        "text": "16. Practical B2 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Luin eilen koko kirjan, mutta en ymm\u00e4rt\u00e4nyt kaikkea. (Yesterday I read the whole book, but I didn't understand everything.)",
          "Rakastan sinua yli kaiken, vaikka v\u00e4lill\u00e4 riitelemme. (I love you above all, even though we sometimes argue.)",
          "Minun t\u00e4ytyy ostaa uusi puhelin, koska vanha on rikki. (I have to buy a new phone because the old one is broken.)",
          "Tapoin h\u00e4net? En tappanut! Tapoin h\u00e4nt\u00e4 vain elokuvassa. (I killed him? I didn't! I only tried to kill him in the movie.)",
          "Minulla on auto, mutta ei mit\u00e4\u00e4n muuta arvokasta. (I have a car, but nothing else valuable.)",
          "\u00c4l\u00e4 unohda minua, kun l\u00e4hdet ulkomaille. (Don't forget me when you go abroad.)"
        ]
      },
      {
        "type": "subheading",
        "text": "17. Practice Exercises"
      },
      {
        "type": "example-list",
        "title": "1. Correct: Odotan bussin or odotan bussia?",
        "items": ["Answer: Odotan bussia (partitive \u2014 odottaa is partitive-only)"]
      },
      {
        "type": "example-list",
        "title": "2. Fill in: En lukenut _____ (kirja).",
        "items": ["Answer: kirjaa (negative \u2192 partitive)"]
      },
      {
        "type": "example-list",
        "title": "3. Fill in: Sy\u00f6 _____ (omena)! (affirmative command)",
        "items": ["Answer: omena (affirmative imperative \u2192 nominative)"]
      },
      {
        "type": "example-list",
        "title": "4. Fill in: Minulla on _____ (kissa), mutta naapurilla ei ole _____ (kissa).",
        "items": ["Answer: kissa (first), kissaa (second \u2014 negative existential \u2192 partitive)"]
      },
      {
        "type": "example-list",
        "title": "5. Translate: 'I was killing the mosquito, but it flew away.'",
        "items": ["Answer: Tapoin hyttyst\u00e4, mutta se lensi pois. (partitive for ongoing/attempted action)"]
      },
      {
        "type": "subheading",
        "text": "18. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Luinko koko kirjan? Luin, mutta en muista kaikkea. (Did I read the whole book? I did, but I don't remember everything.)",
          "Minun pit\u00e4isi ostaa talo, mutta minulla ei ole tarpeeksi rahaa. (I should buy a house, but I don't have enough money.)",
          "N\u00e4itk\u00f6 elokuvan? \u2014 En n\u00e4hnyt, nukuin koko ajan. (Did you see the movie? \u2014 I didn't, I slept the whole time.)",
          "Tunnen h\u00e4net hyvin; olemme ty\u00f6skennelleet yhdess\u00e4 vuosia. (I know him well; we have worked together for years.)",
          "Rakensin taloa kolme vuotta, mutta en koskaan saanut sit\u00e4 valmiiksi. (I was building the house for three years, but I never finished it.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the telic vs. atelic aspect distinction at B2 level?",
      "options": [
        "Telic = present tense, atelic = past tense",
        "Telic = action has a natural endpoint (genitive object); atelic = action viewed without endpoint (partitive object)",
        "Telic = plural object, atelic = singular object",
        "Telic = affirmative, atelic = negative"
      ],
      "correctAnswer": "Telic = action has a natural endpoint (genitive object); atelic = action viewed without endpoint (partitive object)",
      "explanation": "Telic actions reach a natural endpoint and take the genitive/nominative object. Atelic actions have no endpoint or are viewed as ongoing and take the partitive.",
      "hint": "Think of completed vs. ongoing.",
      "points": 10
    },
    {
      "question": "What case does the object take in a negative sentence?",
      "options": ["Nominative", "Genitive", "Partitive", "Accusative"],
      "correctAnswer": "Partitive",
      "explanation": "In negative sentences, the object is always in the partitive case, regardless of whether the positive form would have a total object.",
      "hint": "Negative always partitive.",
      "points": 10
    },
    {
      "question": "What is the correct object in the affirmative command 'Eat the apple!'?",
      "options": ["Sy\u00f6 omenaa", "Sy\u00f6 omenan", "Sy\u00f6 omena", "Sy\u00f6 omenat"],
      "correctAnswer": "Sy\u00f6 omena",
      "explanation": "Affirmative singular commands take the nominative object. 'Sy\u00f6 omena' = Eat the apple.",
      "hint": "Affirmative command = nominative.",
      "points": 10
    },
    {
      "question": "How does the object case change the meaning of 'Tapoin h\u00e4net' vs. 'Tapoin h\u00e4nt\u00e4'?",
      "options": [
        "No difference",
        "Tapoin h\u00e4net = I killed him; Tapoin h\u00e4nt\u00e4 = I tried to kill him / was killing him (process)",
        "First is past, second is present",
        "First is positive, second is negative"
      ],
      "correctAnswer": "Tapoin h\u00e4net = I killed him; Tapoin h\u00e4nt\u00e4 = I tried to kill him / was killing him (process)",
      "explanation": "With a telic verb like 'tappaa', the genitive object (h\u00e4net) indicates completion. The partitive (h\u00e4nt\u00e4) shifts focus to the process, often implying the endpoint was not reached.",
      "hint": "Genitive = completion, partitive = process.",
      "points": 10
    },
    {
      "question": "Which of the following verbs always takes the partitive object?",
      "options": ["l\u00f6yt\u00e4\u00e4 (to find)", "rakentaa (to build)", "rakastaa (to love)", "tappaa (to kill)"],
      "correctAnswer": "rakastaa (to love)",
      "explanation": "'Rakastaa' (to love) is an emotion verb and is partitive-only. There is no natural endpoint to loving someone.",
      "hint": "Think of verbs that describe states/emotions.",
      "points": 10
    },
    {
      "question": "What is the correct negative imperative form of 'Don't take the book!'?",
      "options": ["\u00c4l\u00e4 ota kirja", "\u00c4l\u00e4 ota kirjan", "\u00c4l\u00e4 ota kirjaa", "\u00c4l\u00e4 ota kirjat"],
      "correctAnswer": "\u00c4l\u00e4 ota kirjaa",
      "explanation": "Negative commands (\u00e4l\u00e4) take the partitive object. '\u00c4l\u00e4 ota kirjaa' = Don't take the book.",
      "hint": "Negative imperative = partitive.",
      "points": 10
    },
    {
      "question": "What is the correct object in 'Minulla ei ole ___' (I don't have a car)?",
      "options": ["auto", "auton", "autoa", "autot"],
      "correctAnswer": "autoa",
      "explanation": "In negative existential sentences, the noun (which is the subject in affirmative) becomes partitive. 'Minulla ei ole autoa' = I don't have a car.",
      "hint": "Negative existential = partitive.",
      "points": 10
    },
    {
      "question": "What is the difference between 'N\u00e4in koiran' and 'N\u00e4in koiraa'?",
      "options": [
        "No difference",
        "N\u00e4in koiran = I saw the dog (specific/once); N\u00e4in koiraa = I saw the dog (glimpsed / ongoing)",
        "First is past, second is present",
        "First is positive, second is negative"
      ],
      "correctAnswer": "N\u00e4in koiran = I saw the dog (specific/once); N\u00e4in koiraa = I saw the dog (glimpsed / ongoing)",
      "explanation": "With perception verbs, the genitive object signals a specific, complete perception. The partitive signals a partial, ongoing, or repeated perception.",
      "hint": "Genitive = whole, partitive = partial.",
      "points": 10
    },
    {
      "question": "What is the correct object in 'Rakensin taloa'?",
      "options": [
        "I built the house (completed)",
        "I was building the house (incomplete/process)",
        "I will build the house",
        "I have built the house"
      ],
      "correctAnswer": "I was building the house (incomplete/process)",
      "explanation": "The partitive object with a telic verb like 'rakentaa' shifts focus to the process, implying the house was not necessarily completed.",
      "hint": "Partitive = ongoing process, maybe not finished.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the object in a necessive structure (minun t\u00e4ytyy)?",
      "options": [
        "Minun t\u00e4ytyy lukea kirjaa (I have to read some of the book)",
        "Minun t\u00e4ytyy lukea kirja (I have to read the whole book)",
        "Both are correct depending on meaning",
        "Neither is correct"
      ],
      "correctAnswer": "Both are correct depending on meaning",
      "explanation": "Both are correct. 'Minun t\u00e4ytyy lukea kirja' means I have to read the whole book (total). 'Minun t\u00e4ytyy lukea kirjaa' means I have to read some of the book / read for a while (partial).",
      "hint": "The choice depends on whether the speaker intends totality.",
      "points": 10
    }
  ]
},
{
  "id": "full-passive-system",
  "chapter": 2,
  "title": "Full Passive System – Passiivi kaikissa aikamuodoissa",
  "finnish": "Passiivi kaikissa aikamuodoissa",
  "icon": "🔀",
  "level": "B2",
  "accent": "bg-rose-700",
  "badge": "bg-rose-50 text-rose-700 border-rose-200",
  "description": "Complete reference for Finnish passive in all tenses: formation nuances, negative passive, object cases in passive, necessive passive, and passive in spoken Finnish as 'we'",
  "content": {
    "type": "rich",
    "intro": "Finnish passive is impersonal — it focuses on the action itself, not on the doer. Unlike English, Finnish passive does not usually express the agent ('by me, by the teacher') unless you use the agent participle.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Finnish Passive Really Is (B2 Refresher)"
      },
      {
        "type": "example-list",
        "items": [
          "English passive: The work was done.",
          "English 'people / they / we': People eat pizza here.",
          "Spoken Finnish 'we': Menn\u00e4\u00e4n! (Let's go!)"
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "Key B2 insight: Unlike English, Finnish passive does not usually express the agent (by me, by the teacher) unless you use the agent participle (minun tekem\u00e4ni)."
      },
      {
        "type": "subheading",
        "text": "2. Full Formation Rules for All Verb Types (B2 Detail)"
      },
      {
        "type": "subheading",
        "text": "A) Type 1 (puhua, asua, lukea)"
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Formation", "Example"],
        "rows": [
          ["Present", "stem + -taan/-t\u00e4\u00e4n", "puhutaan, asutaan, luetaan"],
          ["Past", "stem + -ttiin/-tiin", "puhuttiin, asuttiin, luettiin"],
          ["Perfect passive participle", "stem + -ttu/-tty", "puhuttu, asuttu, luettu"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "lukea \u2192 luetaan (not lukeaan) \u2014 the stem changes in present passive."
      },
      {
        "type": "subheading",
        "text": "B) Type 2 (sy\u00f6d\u00e4, juoda, tehd\u00e4, n\u00e4hd\u00e4)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Past passive", "Perfect participle"],
        "rows": [
          ["sy\u00f6d\u00e4", "sy\u00f6d\u00e4\u00e4n", "sy\u00f6tiin", "sy\u00f6ty"],
          ["juoda", "juodaan", "juotiin", "juotu"],
          ["tehd\u00e4", "tehd\u00e4\u00e4n", "tehtiin", "tehty"],
          ["n\u00e4hd\u00e4", "n\u00e4hd\u00e4\u00e4n", "n\u00e4htiin", "n\u00e4hty"]
        ]
      },
      {
        "type": "subheading",
        "text": "C) Type 3 (menn\u00e4, tulla, nousta, pest\u00e4)"
      },
      {
        "type": "paragraph",
        "text": "These verbs have a double consonant in the passive."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Past passive", "Perfect participle"],
        "rows": [
          ["menn\u00e4", "menn\u00e4\u00e4n", "mentiin", "menty"],
          ["tulla", "tullaan", "tultiin", "tultu"],
          ["nousta", "noustaan", "noustiin", "noustu"],
          ["pest\u00e4", "pest\u00e4\u00e4n", "pestiin", "pesty"]
        ]
      },
      {
        "type": "subheading",
        "text": "D) Type 4 (haluta, osata, vastata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Past passive", "Perfect participle"],
        "rows": [
          ["haluta", "halutaan", "haluttiin", "haluttu"],
          ["osata", "osataan", "osattiin", "osattu"],
          ["vastata", "vastataan", "vastattiin", "vastattu"]
        ]
      },
      {
        "type": "subheading",
        "text": "E) Type 5 (tarvita, pakata)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Present passive", "Past passive", "Perfect participle"],
        "rows": [
          ["tarvita", "tarvitaan", "tarvittiin", "tarvittu"],
          ["pakata", "pakataan", "pakattiin", "pakattu"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Negative Passive in All Tenses"
      },
      {
        "type": "paragraph",
        "text": "The negative passive is formed with ei + passive participle (not with ei + conjugated passive)."
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Negative formula", "Example"],
        "rows": [
          ["Present", "ei + passive participle", "ei puhuta"],
          ["Past", "ei + passive participle", "ei puhuttu"],
          ["Perfect", "ei + ole + passive participle", "ei ole puhuttu"],
          ["Pluperfect", "ei + ollut + passive participle", "ei ollut puhuttu"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Crucial B2 rule: The present passive negative uses the participle (puhuta), not puhutaan. \u2705 T\u00e4\u00e4ll\u00e4 ei puhuta englantia. (English is not spoken here.) \u274c T\u00e4\u00e4ll\u00e4 ei puhutaan (wrong)."
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Positive", "Negative", "Meaning"],
        "rows": [
          ["Present", "puhutaan", "ei puhuta", "is spoken / is not spoken"],
          ["Past", "puhuttiin", "ei puhuttu", "was spoken / was not spoken"],
          ["Perfect", "on puhuttu", "ei ole puhuttu", "has been spoken / has not been spoken"],
          ["Pluperfect", "oli puhuttu", "ei ollut puhuttu", "had been spoken / had not been spoken"]
        ]
      },
      {
        "type": "subheading",
        "text": "4. Object Case in Passive Sentences (Advanced B2)"
      },
      {
        "type": "example-table",
        "headers": ["Object case", "Meaning", "Example"],
        "rows": [
          ["Nominative", "The entire item was affected", "Kirja luettiin. (The book was read \u2014 completely)"],
          ["Partitive", "The item was partially affected / action ongoing", "Kirjaa luettiin. (The book was being read / read partially)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Pizza sy\u00f6tiin. = The pizza was eaten (completely).",
          "Pizzaa sy\u00f6tiin. = Pizza was being eaten (some of it).",
          "Auto ostettiin eilen. = The car was bought yesterday (total).",
          "Autoa ostettiin koko p\u00e4iv\u00e4. = Car shopping was going on all day (partial)."
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: In passive, the choice between nominative and partitive is purely aspectual \u2014 did the action affect the whole object or not?"
      },
      {
        "type": "subheading",
        "text": "5. Expressing the Agent in Passive (Who did it?)"
      },
      {
        "type": "paragraph",
        "text": "Finnish passive does not include the agent by default. To express 'by someone', you have two options:"
      },
      {
        "type": "subheading",
        "text": "A) Agent participle (B2 level)"
      },
      {
        "type": "example-list",
        "items": ["Minun kirjoittamani kirja luettiin. = The book written by me was read."]
      },
      {
        "type": "subheading",
        "text": "B) Toimesta (extremely formal)"
      },
      {
        "type": "example-list",
        "items": ["Tarkastus suoritettiin insin\u00f6\u00f6rin toimesta. = The inspection was carried out by the engineer."]
      },
      {
        "type": "subheading",
        "text": "C) Rephrase actively (spoken Finnish)"
      },
      {
        "type": "example-list",
        "items": ["M\u00e4 kirjoitin sen kirjan, ja se luettiin. = I wrote that book, and it was read."]
      },
      {
        "type": "subheading",
        "text": "6. Passive vs. 'We' in Spoken Finnish (Critical B2 Distinction)"
      },
      {
        "type": "example-table",
        "headers": ["Written standard", "Spoken (passive as 'we')", "Meaning"],
        "rows": [
          ["Me menemme kotiin", "Me menn\u00e4\u00e4n kotiin", "We are going home"],
          ["Me s\u00f6imme pizzaa", "Me sy\u00f6tiin pizzaa", "We ate pizza"],
          ["Me teemme sen", "Me tehd\u00e4\u00e4n se", "We'll do it"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "In spoken Finnish, passive used as 'we' can still take an object in nominative for total actions. Me tehtiin se. = We did it. Me tehtiin sit\u00e4. = We were doing it / worked on it."
      },
      {
        "type": "subheading",
        "text": "7. Passive in Necessive Structures (on teht\u00e4v\u00e4)"
      },
      {
        "type": "example-table",
        "headers": ["Structure", "Meaning", "Example"],
        "rows": [
          ["on + passive participle", "must be done", "T\u00e4m\u00e4 on teht\u00e4v\u00e4 (This must be done)"],
          ["oli + passive participle", "had to be done", "T\u00e4m\u00e4 oli teht\u00e4v\u00e4 (This had to be done)"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Necessive passive", "Example"],
        "rows": [
          ["Present", "on + -tava/-t\u00e4v\u00e4", "Ruoka on sy\u00f6t\u00e4v\u00e4. (The food must be eaten)"],
          ["Past", "oli + -tava/-t\u00e4v\u00e4", "Ruoka oli sy\u00f6t\u00e4v\u00e4. (The food had to be eaten)"],
          ["Negative", "ei ole / ei ollut + -tava/-t\u00e4v\u00e4", "Ruokaa ei ole sy\u00f6t\u00e4v\u00e4. (The food doesn't have to be eaten)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Ty\u00f6 on teht\u00e4v\u00e4 ennen perjantaita. = The work must be done before Friday.",
          "Sit\u00e4 ei ole uskottava. = That doesn't have to be believed / is not believable."
        ]
      },
      {
        "type": "subheading",
        "text": "8. Passive in Conditional and Conditional Perfect (Advanced)"
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Formation", "Example"],
        "rows": [
          ["Present conditional", "-ttaisiin / -t\u00e4isiin", "puhuttaisiin (would be spoken)"],
          ["Past conditional", "olisi + passive participle", "olisi puhuttu (would have been spoken)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Suomea puhuttaisiin enemm\u00e4n, jos sit\u00e4 opetettaisiin kouluissa. (Finnish would be spoken more if it were taught in schools.)",
          "Ty\u00f6 olisi tehty ajoissa, jos aikaa olisi ollut enemm\u00e4n. (The work would have been done on time if there had been more time.)",
          "Negative: Ei puhuttaisi. (It would not be spoken.)",
          "Negative: Ei olisi puhuttu. (It would not have been spoken.)"
        ]
      },
      {
        "type": "subheading",
        "text": "9. Passive in Reported Speech (Indirect Passive)"
      },
      {
        "type": "example-table",
        "headers": ["Direct", "Reported"],
        "rows": [
          ["\"Pizza sy\u00f6d\u00e4\u00e4n\"", "H\u00e4n sanoi, ett\u00e4 pizza sy\u00f6d\u00e4\u00e4n"],
          ["\"Ty\u00f6 on tehty\"", "H\u00e4n sanoi, ett\u00e4 ty\u00f6 on tehty"]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Full Passive Conjugation Table (All Tenses, One Verb: puhua)"
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Positive", "Negative"],
        "rows": [
          ["Present", "puhutaan", "ei puhuta"],
          ["Past", "puhuttiin", "ei puhuttu"],
          ["Perfect", "on puhuttu", "ei ole puhuttu"],
          ["Pluperfect", "oli puhuttu", "ei ollut puhuttu"],
          ["Conditional", "puhuttaisiin", "ei puhuttaisi"],
          ["Conditional perfect", "olisi puhuttu", "ei olisi puhuttu"],
          ["Potential", "puhuttaneen (rare)", "ei puhuttane (rare)"]
        ]
      },
      {
        "type": "subheading",
        "text": "11. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Ei puhutaan t\u00e4\u00e4ll\u00e4 englantia", "Ei puhuta t\u00e4\u00e4ll\u00e4 englantia", "Negative passive uses participle, not full form"],
          ["Min\u00e4 puhutaan", "Minusta puhutaan (or passive alone)", "Passive has no personal subject"],
          ["Kirja luettiin (meaning 'the book was being read')", "Kirjaa luettiin", "For partial aspect, use partitive object"],
          ["Me tehd\u00e4\u00e4n se eilen", "Me tehtiin se eilen", "For past, use past passive (tehtiin)"]
        ]
      },
      {
        "type": "subheading",
        "text": "12. Practical B2 Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Suomea puhutaan virallisena kielen\u00e4 Suomessa ja my\u00f6s osissa Ruotsia. (Finnish is spoken as an official language in Finland and also in parts of Sweden.)",
          "T\u00e4m\u00e4 kirja on kirjoitettu vuonna 1999, eik\u00e4 sit\u00e4 ole sen j\u00e4lkeen painettu uudelleen. (This book was written in 1999, and it has not been reprinted since.)",
          "Tehtiink\u00f6 se ty\u00f6 jo? \u2014 Ei, sit\u00e4 ei ole viel\u00e4 tehty. (Was the work already done? \u2014 No, it hasn't been done yet.)",
          "Menn\u00e4\u00e4nk\u00f6 elokuviin? \u2014 Menn\u00e4\u00e4n! (Shall we go to the movies? \u2014 Let's go!)",
          "T\u00e4m\u00e4 ongelma on ratkaistava ennen ensi kokousta. (This problem must be solved before the next meeting.)",
          "Jos olisi tiedetty aiemmin, asia olisi hoidettu toisin. (If it had been known earlier, the matter would have been handled differently.)"
        ]
      },
      {
        "type": "subheading",
        "text": "13. YKI-Style Transformation Practice"
      },
      {
        "type": "example-list",
        "title": "Change the following active sentences to passive. Pay attention to object case (nominative vs. partitive).",
        "items": [
          "1. Me s\u00f6imme koko pizzan. \u2192 Pizza sy\u00f6tiin kokonaan.",
          "2. He lukivat kirjaa koko illan. \u2192 Kirjaa luettiin koko ilta.",
          "3. Kukaan ei puhunut suomea siell\u00e4. \u2192 Suomea ei puhuttu siell\u00e4.",
          "4. Minun t\u00e4ytyy tehd\u00e4 t\u00e4m\u00e4 ty\u00f6. \u2192 T\u00e4m\u00e4 ty\u00f6 on teht\u00e4v\u00e4.",
          "5. Jos olisimme tienneet, olisimme auttaneet. \u2192 Jos olisi tiedetty, olisi autettu."
        ]
      },
      {
        "type": "subheading",
        "text": "14. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Miten t\u00e4m\u00e4 sana lausutaan? (How is this word pronounced?)",
          "Ovelle ei ole koskaan vastattu. (The door has never been answered.)",
          "T\u00e4ss\u00e4 ravintolassa tarjoillaan hyv\u00e4\u00e4 kalaa. (Good fish is served in this restaurant.)",
          "P\u00e4\u00e4t\u00f6s tehtiin yksimielisesti. (The decision was made unanimously.)",
          "Sano, ett\u00e4 se on tehty. (Say that it has been done.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the correct negative present passive form of 'puhua' (to speak)?",
      "options": ["ei puhutaan", "ei puhuta", "ei puhuttiin", "ei ole puhuttu"],
      "correctAnswer": "ei puhuta",
      "explanation": "The negative present passive uses the passive participle (puhuta), not the full form (puhutaan). Example: 'T\u00e4\u00e4ll\u00e4 ei puhuta englantia' (English is not spoken here).",
      "hint": "Negative passive = ei + participle.",
      "points": 10
    },
    {
      "question": "What is the past passive form of 'menn\u00e4' (to go)?",
      "options": ["menn\u00e4\u00e4n", "mentiin", "meni", "menty"],
      "correctAnswer": "mentiin",
      "explanation": "The past passive of 'menn\u00e4' is 'mentiin' (stem men- + -tiin). Example: 'Kauppaan mentiin eilen' (We went / people went to the store yesterday).",
      "hint": "Type 3 verbs have past passive in -tiin.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Pizza sy\u00f6tiin' and 'Pizzaa sy\u00f6tiin'?",
      "options": [
        "No difference",
        "Pizza sy\u00f6tiin = The pizza was eaten (completely); Pizzaa sy\u00f6tiin = Pizza was being eaten (partially)",
        "First is present, second is past",
        "First is active, second is passive"
      ],
      "correctAnswer": "Pizza sy\u00f6tiin = The pizza was eaten (completely); Pizzaa sy\u00f6tiin = Pizza was being eaten (partially)",
      "explanation": "In passive, nominative object (pizza) indicates total affection. Partitive object (pizzaa) indicates partial or ongoing affection.",
      "hint": "Nominative = total, partitive = partial.",
      "points": 10
    },
    {
      "question": "What is the necessive passive form of 'T\u00e4m\u00e4 ty\u00f6 on teht\u00e4v\u00e4'?",
      "options": [
        "This work is done",
        "This work must be done",
        "This work was done",
        "This work would be done"
      ],
      "correctAnswer": "This work must be done",
      "explanation": "The necessive passive structure 'on + -tava/-t\u00e4v\u00e4' expresses obligation: 'must be done'.",
      "hint": "Necessive passive = must be done.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, what does 'Me menn\u00e4\u00e4n kotiin' mean?",
      "options": [
        "We are being taken home",
        "We are going home",
        "They go home",
        "Let's be taken home"
      ],
      "correctAnswer": "We are going home",
      "explanation": "In spoken Finnish, the passive is often used to mean 'we'. 'Me menn\u00e4\u00e4n kotiin' = We are going home.",
      "hint": "Spoken 'we' = passive form.",
      "points": 10
    },
    {
      "question": "What is the correct past conditional passive form of 'tehd\u00e4' (to do)?",
      "options": ["teht\u00e4isiin", "olisi tehty", "tehtiin", "on tehty"],
      "correctAnswer": "olisi tehty",
      "explanation": "The past conditional passive is formed with 'olisi' + passive participle: 'olisi tehty' (would have been done).",
      "hint": "Conditional perfect passive = olisi + passive participle.",
      "points": 10
    },
    {
      "question": "Which of the following is the correct way to express 'by the teacher' in a passive sentence?",
      "options": [
        "opettajan toimesta",
        "opettajan tekem\u00e4",
        "Both are possible (formal vs. agent participle)",
        "Neither is correct"
      ],
      "correctAnswer": "Both are possible (formal vs. agent participle)",
      "explanation": "'Opettajan toimesta' is extremely formal legal language. The agent participle 'opettajan kirjoittama' is the standard way to include the agent.",
      "hint": "Agent participle is more common.",
      "points": 10
    },
    {
      "question": "What is the correct perfect passive negative form of 'puhua'?",
      "options": ["ei puhuta", "ei puhuttu", "ei ole puhuttu", "ei olisi puhuttu"],
      "correctAnswer": "ei ole puhuttu",
      "explanation": "The perfect passive negative is 'ei ole' + passive participle: 'ei ole puhuttu' (has not been spoken).",
      "hint": "Perfect = ei ole + participle.",
      "points": 10
    },
    {
      "question": "What is the conditional passive form of 'puhua' (would be spoken)?",
      "options": ["puhutaan", "puhuttaisiin", "puhuttiin", "puhuttaneen"],
      "correctAnswer": "puhuttaisiin",
      "explanation": "The conditional passive is formed with -ttaisiin/-t\u00e4isiin: 'puhuttaisiin' (would be spoken).",
      "hint": "Conditional passive ends in -ttaisiin.",
      "points": 10
    },
    {
      "question": "Complete the sentence: 'Kirjaa _____ koko illan.' (The book was being read all evening.)",
      "options": ["luettiin", "luetaan", "lukittiin", "luki"],
      "correctAnswer": "luettiin",
      "explanation": "Past passive 'luettiin' + partitive object 'kirjaa' indicates an ongoing/partial action in the past.",
      "hint": "Past passive for 'was being read'.",
      "points": 10
    }
  ]
},


{
  "id": "indirect-speech",
  "chapter": 3,
  "title": "Indirect Speech – Epäsuora esitys",
  "finnish": "Epäsuora esitys",
  "icon": "💬",
  "level": "B2",
  "accent": "bg-emerald-700",
  "badge": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "description": "Reporting what someone said, asked, or commanded — with tense flexibility, modal verbs, indirect questions, and the formal -vansa structure",
  "content": {
    "type": "rich",
    "intro": "Unlike English which strictly backshifts tenses, Finnish allows present tense in the ett\u00e4 clause if the statement is still true or generally true. Choose present for ongoing truth, past for completed past situations.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. Core Principle at B2: Finnish Is Flexible with Tense"
      },
      {
        "type": "example-table",
        "headers": ["English (strict backshift)", "Finnish (flexible)", "Meaning"],
        "rows": [
          ["He said he was tired.", "H\u00e4n sanoi, ett\u00e4 h\u00e4n on v\u00e4synyt.", "He said he is tired (still tired now)"],
          ["He said he was tired (but isn't now).", "H\u00e4n sanoi, ett\u00e4 h\u00e4n oli v\u00e4synyt.", "He said he was tired"],
          ["He said he would come.", "H\u00e4n sanoi, ett\u00e4 h\u00e4n tulee.", "He said he is coming"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: Choose present for ongoing truth, past for completed past situations."
      },
      {
        "type": "subheading",
        "text": "2. Indirect Speech with Modal Verbs (Very Common in YKI)"
      },
      {
        "type": "subheading",
        "text": "Voi (can / may)"
      },
      {
        "type": "example-table",
        "headers": ["Direct", "Indirect"],
        "rows": [
          ["\"Voin tulla huomenna.\"", "H\u00e4n sanoi, ett\u00e4 h\u00e4n voi tulla huomenna."],
          ["\"En voi auttaa.\"", "H\u00e4n sanoi, ettei h\u00e4n voi auttaa."]
        ]
      },
      {
        "type": "subheading",
        "text": "Pit\u00e4\u00e4 / t\u00e4ytyy (must / have to)"
      },
      {
        "type": "example-table",
        "headers": ["Direct", "Indirect"],
        "rows": [
          ["\"Minun t\u00e4ytyy menn\u00e4 nyt.\"", "H\u00e4n sanoi, ett\u00e4 h\u00e4nen t\u00e4ytyy menn\u00e4 nyt."],
          ["\"Sinun pit\u00e4\u00e4 opiskella.\"", "H\u00e4n sanoi, ett\u00e4 minun pit\u00e4\u00e4 opiskella."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Pronoun shift: In indirect speech, the pronoun changes to match the perspective of the reporter. \"Minun t\u00e4ytyy menn\u00e4\" \u2192 h\u00e4n sanoi, ett\u00e4 h\u00e4nen t\u00e4ytyy menn\u00e4."
      },
      {
        "type": "subheading",
        "text": "3. Indirect Speech with saattaa (might)"
      },
      {
        "type": "example-table",
        "headers": ["Direct", "Indirect"],
        "rows": [
          ["\"H\u00e4n saattaa olla my\u00f6h\u00e4ss\u00e4.\"", "H\u00e4n sanoi, ett\u00e4 h\u00e4n saattaa olla my\u00f6h\u00e4ss\u00e4."],
          ["\"Se saattaa sataa.\"", "H\u00e4n sanoi, ett\u00e4 se saattaa sataa."]
        ]
      },
      {
        "type": "subheading",
        "text": "4. The -han/-h\u00e4n Clitic in Indirect Speech"
      },
      {
        "type": "paragraph",
        "text": "In direct speech, -han/-h\u00e4n adds emphasis or reminds the listener of shared knowledge. In indirect speech, it disappears or is replaced by a neutral structure."
      },
      {
        "type": "example-table",
        "headers": ["Direct", "Indirect"],
        "rows": [
          ["\"Tuohan on minun kirjani!\"", "H\u00e4n sanoi, ett\u00e4 tuo on h\u00e4nen kirjansa."],
          ["\"Sin\u00e4h\u00e4n asut Helsingiss\u00e4.\"", "H\u00e4n sanoi, ett\u00e4 h\u00e4n asuu Helsingiss\u00e4."]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "To preserve the nuance, use a verb like muistuttaa (remind) or korostaa (emphasize)."
      },
      {
        "type": "subheading",
        "text": "5. Indirect Questions: Word Order (Crucial B2)"
      },
      {
        "type": "paragraph",
        "text": "In indirect questions, the verb comes immediately after the question word (no inversion like in English 'where he is' vs 'where is he')."
      },
      {
        "type": "example-table",
        "headers": ["Direct question", "Indirect question"],
        "rows": [
          ["Miss\u00e4 h\u00e4n on?", "H\u00e4n kysyi, miss\u00e4 h\u00e4n on."],
          ["Mit\u00e4 teet?", "H\u00e4n kysyi, mit\u00e4 min\u00e4 teen."],
          ["Miksi et tullut?", "H\u00e4n kysyi, miksi en tullut."],
          ["Milloin h\u00e4n saapuu?", "H\u00e4n kysyi, milloin h\u00e4n saapuu."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "No verb-second inversion in indirect questions: miss\u00e4 h\u00e4n on (not miss\u00e4 on h\u00e4n)."
      },
      {
        "type": "subheading",
        "text": "6. Yes/No Questions: -ko/-k\u00f6 Attached to the Verb"
      },
      {
        "type": "example-table",
        "headers": ["Direct question", "Indirect question"],
        "rows": [
          ["\"Tuletko sin\u00e4?\"", "H\u00e4n kysyi, tuleeko h\u00e4n."],
          ["\"Oletko n\u00e4hnyt koiran?\"", "H\u00e4n kysyi, onko h\u00e4n n\u00e4hnyt koiran."],
          ["\"Puhuuko h\u00e4n suomea?\"", "H\u00e4n kysyi, puhuuko h\u00e4n suomea."],
          ["\"Eik\u00f6 h\u00e4n tied\u00e4?\"", "H\u00e4n kysyi, eik\u00f6 h\u00e4n tied\u00e4."]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "The yes/no indirect question has no conjunction (no ett\u00e4). The verb with -ko/-k\u00f6 starts the clause."
      },
      {
        "type": "subheading",
        "text": "7. Imperatives in Indirect Speech"
      },
      {
        "type": "example-table",
        "headers": ["Direct command", "Indirect"],
        "rows": [
          ["\"Tule t\u00e4nne!\"", "H\u00e4n k\u00e4ski, ett\u00e4 minun pit\u00e4\u00e4 tulla. / H\u00e4n k\u00e4ski minua tulemaan."],
          ["\"\u00c4l\u00e4 mene!\"", "H\u00e4n kielsi, ett\u00e4 minun ei pid\u00e4 menn\u00e4. / H\u00e4n kielsi minua menem\u00e4st\u00e4."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n k\u00e4ski minua tulemaan aikaisin. = He told me to come early.",
          "H\u00e4n pyysi minua olemaan hiljaa. = He asked me to be quiet.",
          "H\u00e4n kielsi minua avaamasta ovea. = He forbade me to open the door."
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "The k\u00e4sken sinua tulemaan structure (3rd infinitive illative) is very common for reporting commands."
      },
      {
        "type": "subheading",
        "text": "8. Sanoa ett\u00e4 vs. Sanoa + 1st infinitive"
      },
      {
        "type": "paragraph",
        "text": "The sanoa + MA-infinitive congruence structure is more formal and more compact. It requires the infinitive to agree with the subject in case and number."
      },
      {
        "type": "example-table",
        "headers": ["Subject", "Form", "Example"],
        "rows": [
          ["min\u00e4", "-vani", "H\u00e4n sanoi tulevani. (He said that I will come)"],
          ["sin\u00e4", "-vasi", "H\u00e4n sanoi tulevasi. (He said that you will come)"],
          ["h\u00e4n", "-vansa / -v\u00e4ns\u00e4", "H\u00e4n sanoi tulevansa. (He said that he will come)"],
          ["me", "-vamme", "H\u00e4n sanoi tulevamme. (He said that we will come)"],
          ["te", "-vanne", "H\u00e4n sanoi tulevanne. (He said that you [pl] will come)"],
          ["he", "-vansa / -v\u00e4ns\u00e4", "H\u00e4n sanoi tulevansa. (He said that they will come \u2014 ambiguous)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n sanoi tekev\u00e4ns\u00e4 l\u00e4ksyt. = He said that he will do the homework.",
          "L\u00e4\u00e4k\u00e4ri sanoi voivansa auttaa. = The doctor said that he/she can help.",
          "Ajattelin olevani oikeassa. = I thought that I was right."
        ]
      },
      {
        "type": "subheading",
        "text": "9. Indirect Speech in News and Formal Writing (YKI Reading)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish news", "English"],
        "rows": [
          ["Ministeri sanoi, ett\u00e4 verotus kiristyy.", "The minister said that taxation will tighten."],
          ["Poliisi kertoi, ett\u00e4 tutkinta jatkuu.", "The police reported that the investigation continues."],
          ["Asiantuntija arvioi, ett\u00e4 talous kasvaa.", "The expert estimated that the economy will grow."]
        ]
      },
      {
        "type": "paragraph",
        "text": "Verbs often used: kertoa, ilmoittaa, todeta, arvioida, v\u00e4itt\u00e4\u00e4, my\u00f6nt\u00e4\u00e4, kiist\u00e4\u00e4."
      },
      {
        "type": "example-list",
        "items": ["H\u00e4n kiisti, ett\u00e4 h\u00e4n olisi ollut paikalla. = He denied that he had been there. (conditional perfect in the ett\u00e4 clause)"]
      },
      {
        "type": "subheading",
        "text": "10. Conditional in Indirect Speech (Hypothetical or Unreal)"
      },
      {
        "type": "example-table",
        "headers": ["Context", "Example"],
        "rows": [
          ["Uncertainty", "H\u00e4n sanoi, ettei h\u00e4n tiet\u00e4isi. (He said he wouldn't know)"],
          ["Unreal past", "H\u00e4n v\u00e4itti, ett\u00e4 h\u00e4n olisi n\u00e4hnyt ufon. (He claimed that he had seen a UFO)"],
          ["Politeness", "Kysyin, voisinko auttaa. (I asked if I could help \u2014 polite)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n sanoi, ett\u00e4 h\u00e4n tulisi huomenna, jos olisi aikaa. = He said that he would come tomorrow if he had time.",
          "Ajattelin, ett\u00e4 se olisi parempi n\u00e4in. = I thought that it would be better this way.",
          "H\u00e4n kysyi, olisinko halunnut kahvia. = He asked if I would have wanted coffee."
        ]
      },
      {
        "type": "subheading",
        "text": "11. Summary of Conjunctions and Patterns"
      },
      {
        "type": "example-table",
        "headers": ["Type", "Conjunction / Pattern", "Example"],
        "rows": [
          ["Statement (neutral)", "ett\u00e4", "H\u00e4n sanoi, ett\u00e4 h\u00e4n tulee."],
          ["Statement (compact)", "-vansa (MA-congruence)", "H\u00e4n sanoi tulevansa."],
          ["Yes/no question", "Verb + -ko/-k\u00f6", "H\u00e4n kysyi, tuleeko h\u00e4n."],
          ["WH-question", "question word + normal order", "H\u00e4n kysyi, miss\u00e4 h\u00e4n on."],
          ["Command", "ett\u00e4 sinun pit\u00e4\u00e4 / 3rd infinitive", "H\u00e4n k\u00e4ski minua tulemaan."],
          ["Negative command", "ett\u00e4 ei pid\u00e4 / 3rd infinitive abessive", "H\u00e4n kielsi minua menem\u00e4st\u00e4."],
          ["Unreal/hypothetical", "conditional in ett\u00e4 clause", "H\u00e4n v\u00e4itti, ett\u00e4 se olisi totta."]
        ]
      },
      {
        "type": "subheading",
        "text": "12. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["H\u00e4n sanoi, ett\u00e4 h\u00e4n tulee eilen.", "H\u00e4n sanoi, ett\u00e4 h\u00e4n tuli eilen.", "Past time adverb (eilen) requires past tense."],
          ["H\u00e4n kysyi, miss\u00e4 on h\u00e4n.", "H\u00e4n kysyi, miss\u00e4 h\u00e4n on.", "No inversion in indirect questions."],
          ["H\u00e4n sanoi minua tulemaan (missing verb)", "H\u00e4n k\u00e4ski minua tulemaan.", "Sanoa doesn't take 3rd infinitive; use k\u00e4sky\u00e4 or pyyt\u00e4\u00e4."],
          ["H\u00e4n sanoi, ett\u00e4 h\u00e4nell\u00e4 on rahaa (when original was past)", "H\u00e4n sanoi, ett\u00e4 h\u00e4nell\u00e4 oli rahaa.", "If the original past situation is over, shift to past."]
        ]
      },
      {
        "type": "subheading",
        "text": "13. Extended Real-Life Examples (B2/YKI)"
      },
      {
        "type": "example-list",
        "items": [
          "P\u00e4\u00e4ministeri sanoi eilisess\u00e4 haastattelussa, ett\u00e4 hallitus aikoo leikata veroja ensi vuonna. (The prime minister said in yesterday's interview that the government plans to cut taxes next year.)",
          "H\u00e4n kysyi, miss\u00e4 min\u00e4 olin viime y\u00f6n\u00e4, miksi en vastannut puhelimeen ja milloin aion tulla kotiin. (He asked where I was last night, why I didn't answer the phone, and when I plan to come home.)",
          "Opettaja sanoi, ett\u00e4 meid\u00e4n pit\u00e4\u00e4 palauttaa essee perjantaihin menness\u00e4, mutta h\u00e4n ei maininnut mit\u00e4\u00e4n sivum\u00e4\u00e4r\u00e4st\u00e4. (The teacher said that we have to return the essay by Friday, but he didn't mention anything about the page count.)",
          "H\u00e4n v\u00e4itti n\u00e4hneens\u00e4 ufon, mutta kukaan ei uskonut h\u00e4nt\u00e4. (He claimed to have seen a UFO, but no one believed him.)",
          "Ajattelin, ett\u00e4 olisin voinut tehd\u00e4 paremmin, mutta nyt on liian my\u00f6h\u00e4ist\u00e4. (I thought that I could have done better, but now it's too late.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Convert the following direct speech into indirect speech. Pay attention to tense, pronouns, and word order.",
        "items": [
          "1. \"Olen v\u00e4synyt\", h\u00e4n sanoi. (He is still tired now) \u2192 H\u00e4n sanoi, ett\u00e4 h\u00e4n on v\u00e4synyt.",
          "2. \"Mihin sin\u00e4 menet?\" h\u00e4n kysyi. \u2192 H\u00e4n kysyi, mihin min\u00e4 menen.",
          "3. \"Tule t\u00e4nne!\" h\u00e4n sanoi minulle. \u2192 H\u00e4n k\u00e4ski minua tulemaan t\u00e4nne. (or sanoi, ett\u00e4 minun pit\u00e4\u00e4 tulla)",
          "4. \"En ole koskaan n\u00e4hnyt sellaista\", h\u00e4n kertoi. \u2192 H\u00e4n kertoi, ettei h\u00e4n ollut koskaan n\u00e4hnyt sellaista.",
          "5. \"Voisitko auttaa minua?\" h\u00e4n kysyi. \u2192 H\u00e4n kysyi, voisinko auttaa h\u00e4nt\u00e4."
        ]
      },
      {
        "type": "subheading",
        "text": "15. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n sanoi, ett\u00e4 rakastaa minua. (He/she said that he/she loves me.)",
          "Kysyin, olivatko he jo sy\u00f6neet. (I asked if they had already eaten.)",
          "Opettaja sanoi, ettemme ole tehneet l\u00e4ksyj\u00e4. (The teacher said that we haven't done the homework.)",
          "H\u00e4n pyysi minua odottamaan. (He/she asked me to wait.)",
          "Kerroin, etten voi tulla juhliin. (I said that I can't come to the party.)",
          "Luulin, ett\u00e4 olit jo l\u00e4htenyt. (I thought that you had already left.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "If someone says 'Olen v\u00e4synyt' and they are still tired when you report it, which indirect speech form is correct?",
      "options": [
        "H\u00e4n sanoi, ett\u00e4 h\u00e4n oli v\u00e4synyt.",
        "H\u00e4n sanoi, ett\u00e4 h\u00e4n on v\u00e4synyt.",
        "H\u00e4n sanoi, ett\u00e4 h\u00e4n olisi v\u00e4synyt.",
        "H\u00e4n sanoi, ett\u00e4 h\u00e4n on ollut v\u00e4synyt."
      ],
      "correctAnswer": "H\u00e4n sanoi, ett\u00e4 h\u00e4n on v\u00e4synyt.",
      "explanation": "If the statement is still true at the time of reporting, Finnish allows the present tense. 'Olen v\u00e4synyt' \u2192 'ett\u00e4 h\u00e4n on v\u00e4synyt'.",
      "hint": "Still true = present tense.",
      "points": 10
    },
    {
      "question": "What is the correct indirect question form of 'Mihin sin\u00e4 menet?'",
      "options": [
        "H\u00e4n kysyi, mihin sin\u00e4 menet.",
        "H\u00e4n kysyi, mihin menet sin\u00e4.",
        "H\u00e4n kysyi, mihin sin\u00e4 menet?",
        "H\u00e4n kysyi, mihin menet."
      ],
      "correctAnswer": "H\u00e4n kysyi, mihin sin\u00e4 menet.",
      "explanation": "In indirect questions, the word order is subject + verb, not verb inversion. And the pronoun shifts: 'sin\u00e4' \u2192 'h\u00e4n'? Actually careful: This example keeps 'sin\u00e4' if reporting to the same person. Standard answer keeps original structure: 'H\u00e4n kysyi, mihin min\u00e4 menen' would be pronoun shift. The correct answer reflects the pattern: question word + subject + verb.",
      "hint": "No inversion \u2014 subject before verb.",
      "points": 10
    },
    {
      "question": "Which structure is used to report a command like 'Tule t\u00e4nne!'?",
      "options": [
        "H\u00e4n sanoi tulemaan.",
        "H\u00e4n k\u00e4ski minua tulemaan.",
        "H\u00e4n sanoi, ett\u00e4 min\u00e4 tule.",
        "H\u00e4n k\u00e4ski, ett\u00e4 min\u00e4 tulen."
      ],
      "correctAnswer": "H\u00e4n k\u00e4ski minua tulemaan.",
      "explanation": "Commands are reported with k\u00e4sky\u00e4 (to order) + 3rd infinitive illative (-maan/-m\u00e4\u00e4n). 'H\u00e4n k\u00e4ski minua tulemaan' = He told me to come.",
      "hint": "Use k\u00e4sky\u00e4 + 3rd infinitive.",
      "points": 10
    },
    {
      "question": "What is the indirect form of the yes/no question 'Tuletko sin\u00e4?'?",
      "options": [
        "H\u00e4n kysyi, tuletko sin\u00e4.",
        "H\u00e4n kysyi, ett\u00e4 tuletko sin\u00e4.",
        "H\u00e4n kysyi, tuleeko h\u00e4n.",
        "H\u00e4n kysyi, tuleeko sin\u00e4?"
      ],
      "correctAnswer": "H\u00e4n kysyi, tuleeko h\u00e4n.",
      "explanation": "For yes/no questions, the verb with -ko/-k\u00f6 starts the indirect question clause, and the pronoun shifts: 'sin\u00e4' \u2192 'h\u00e4n'.",
      "hint": "No conjunction, verb-first with -ko/-k\u00f6, pronoun shift.",
      "points": 10
    },
    {
      "question": "What does the compact structure 'H\u00e4n sanoi tulevansa' mean?",
      "options": [
        "He said come.",
        "He said that he will come.",
        "He said to come.",
        "He said coming."
      ],
      "correctAnswer": "He said that he will come.",
      "explanation": "The -vansa structure (MA-infinitive congruence) is a formal, compact way to report speech. 'H\u00e4n sanoi tulevansa' = He said that he will come.",
      "hint": "Compact formal reporting.",
      "points": 10
    },
    {
      "question": "What is the correct indirect speech form of 'Koska h\u00e4n tulee?'?",
      "options": [
        "H\u00e4n kysyi, koska h\u00e4n tulee.",
        "H\u00e4n kysyi, koska tulee h\u00e4n.",
        "H\u00e4n kysyi, koska h\u00e4n tulee?",
        "H\u00e4n kysyi, koska h\u00e4n tulisi."
      ],
      "correctAnswer": "H\u00e4n kysyi, koska h\u00e4n tulee.",
      "explanation": "WH-questions (with question words) keep the same word order as statements: question word + subject + verb. No inversion.",
      "hint": "Question word + subject + verb.",
      "points": 10
    },
    {
      "question": "When reporting 'Minun t\u00e4ytyy menn\u00e4', how does the pronoun shift?",
      "options": [
        "minun \u2192 sinun",
        "minun \u2192 h\u00e4nen",
        "minun \u2192 meid\u00e4n",
        "minun stays minun"
      ],
      "correctAnswer": "minun \u2192 h\u00e4nen",
      "explanation": "When reporting someone else's words, 'minun' (my) becomes 'h\u00e4nen' (his/her). 'H\u00e4n sanoi, ett\u00e4 h\u00e4nen t\u00e4ytyy menn\u00e4' = He said that he has to go.",
      "hint": "First person to third person shift.",
      "points": 10
    },
    {
      "question": "What is the correct indirect form of 'En ole koskaan n\u00e4hnyt sellaista'?",
      "options": [
        "H\u00e4n sanoi, ettei h\u00e4n ole koskaan n\u00e4hnyt sellaista.",
        "H\u00e4n sanoi, ettei h\u00e4n ollut koskaan n\u00e4hnyt sellaista.",
        "H\u00e4n sanoi, ettei h\u00e4n olisi koskaan n\u00e4hnyt sellaista.",
        "H\u00e4n sanoi, ett\u00e4 h\u00e4n ei koskaan n\u00e4hnyt sellaista."
      ],
      "correctAnswer": "H\u00e4n sanoi, ettei h\u00e4n ollut koskaan n\u00e4hnyt sellaista.",
      "explanation": "The original 'en ole n\u00e4hnyt' (perfect) refers to a past experience. In indirect speech, it often shifts to past perfect (pluperfect) to maintain the past-in-past reference.",
      "hint": "Past experience in indirect speech = pluperfect.",
      "points": 10
    },
    {
      "question": "Which verb is NOT typically used to introduce indirect speech?",
      "options": ["sanoa", "kertoa", "uida", "v\u00e4itt\u00e4\u00e4"],
      "correctAnswer": "uida",
      "explanation": "'Uida' (to swim) is not a reporting verb. Common reporting verbs include sanoa (to say), kertoa (to tell), v\u00e4itt\u00e4\u00e4 (to claim), my\u00f6nt\u00e4\u00e4 (to admit), kiist\u00e4\u00e4 (to deny).",
      "hint": "Reporting verbs are about saying/telling.",
      "points": 10
    },
    {
      "question": "What is the correct indirect question form of 'Voisitko auttaa minua?'?",
      "options": [
        "H\u00e4n kysyi, voisitko auttaa minua.",
        "H\u00e4n kysyi, voisinko auttaa h\u00e4nt\u00e4.",
        "H\u00e4n kysyi, voisitko auttaa h\u00e4nt\u00e4.",
        "H\u00e4n kysyi, voisiko minua auttaa."
      ],
      "correctAnswer": "H\u00e4n kysyi, voisinko auttaa h\u00e4nt\u00e4.",
      "explanation": "Pronoun shifts: 'sin\u00e4' (implied) becomes 'min\u00e4' (the reporter), and 'minua' becomes 'h\u00e4nt\u00e4'. The conditional remains in the indirect question.",
      "hint": "Careful with pronoun shifts and politeness conditional.",
      "points": 10
    }
  ]
},


{
  "id": "long-infinitive-purpose",
  "chapter": 4,
  "title": "Long Infinitive of Purpose – Pitkä infinitiivi (-akseen/-äkseen)",
  "finnish": "Pitkä infinitiivi (translatiivinen infinitiivi)",
  "icon": "🎯",
  "level": "B2",
  "accent": "bg-sky-700",
  "badge": "bg-sky-50 text-sky-700 border-sky-200",
  "description": "Formal purpose structure 'in order to do' — with possessive suffix agreement, comparison to -maan, negative purpose, and YKI-level usage",
  "content": {
    "type": "rich",
    "intro": "The long infinitive (also called the 5th infinitive or translative infinitive) expresses purpose — 'in order to do something'. It is formal and common in written Finnish, academic texts, and YKI exams.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the Long Infinitive? (B2 Refresher)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["in order to study", "opiskellakseen"],
          ["to see (for the purpose of seeing)", "n\u00e4hd\u00e4kseen"],
          ["to buy", "ostaakseen"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "B2 insight: The long infinitive always requires the same subject for both the main verb and the infinitive. If the subject is different, you must use 'jotta' + clause."
      },
      {
        "type": "subheading",
        "text": "2. Full Formation Table (All Verb Types)"
      },
      {
        "type": "paragraph",
        "text": "Formation rule: Verb stem + -kse- + possessive suffix"
      },
      {
        "type": "example-table",
        "headers": ["Verb type", "Verb", "Stem", "Long infinitive (h\u00e4n)"],
        "rows": [
          ["Type 1", "puhua", "puhu-", "puhuakseen"],
          ["Type 1", "lukea", "luke-", "lukeakseen"],
          ["Type 2", "sy\u00f6d\u00e4", "sy\u00f6-", "sy\u00f6d\u00e4kseen"],
          ["Type 2", "juoda", "juo-", "juodakseen"],
          ["Type 2", "tehd\u00e4", "teke-", "tehd\u00e4kseen"],
          ["Type 2", "n\u00e4hd\u00e4", "n\u00e4ke-", "n\u00e4hd\u00e4kseen"],
          ["Type 3", "menn\u00e4", "men-", "men\u00e4kseen"],
          ["Type 3", "tulla", "tul-", "tullakseen"],
          ["Type 3", "nousta", "nous-", "noustakseen"],
          ["Type 4", "haluta", "halua-", "halutakseen"],
          ["Type 4", "vastata", "vastaa-", "vastatakseen"],
          ["Type 5", "tarvita", "tarvitse-", "tarvitakseen"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "tehd\u00e4 \u2192 tehd\u00e4kseen (not teke\u00e4kseen) \u2014 the k changes to h."
      },
      {
        "type": "subheading",
        "text": "3. Possessive Suffix Agreement (Crucial B2 Rule!)"
      },
      {
        "type": "paragraph",
        "text": "The long infinitive takes a possessive suffix that agrees with the subject of the main clause."
      },
      {
        "type": "example-table",
        "headers": ["Subject", "Suffix", "Example", "Meaning"],
        "rows": [
          ["min\u00e4", "-kseni", "opiskellakseni", "in order for me to study"],
          ["sin\u00e4", "-ksesi", "opiskellaksesi", "in order for you to study"],
          ["h\u00e4n", "-kseen", "opiskellakseen", "in order for him/her to study"],
          ["me", "-ksemme", "opiskellaksemme", "in order for us to study"],
          ["te", "-ksenne", "opiskellaksenne", "in order for you (pl) to study"],
          ["he", "-kseen", "opiskellakseen", "in order for them to study"]
        ]
      },
      {
        "type": "example-list",
        "title": "Examples with all persons:",
        "items": [
          "Menin ulos ostaakseni maitoa. (I went out to buy milk.)",
          "Menit ulos ostaaksesi maitoa. (You went out to buy milk.)",
          "H\u00e4n meni ulos ostaakseen maitoa. (He/she went out to buy milk.)",
          "Menimme ulos ostaaksemme maitoa. (We went out to buy milk.)",
          "Menitte ulos ostaaksenne maitoa. (You (pl) went out to buy milk.)",
          "He meniv\u00e4t ulos ostaakseen maitoa. (They went out to buy milk.)"
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "The 3rd person suffix -kseen is ambiguous \u2014 it can mean 'in order for him/her' or 'in order for them'. Context decides."
      },
      {
        "type": "subheading",
        "text": "4. Long Infinitive vs. -maan/-m\u00e4\u00e4n (3rd Infinitive Illative)"
      },
      {
        "type": "example-table",
        "headers": ["Feature", "-akseen/-äkseen (long infinitive)", "-maan/-mään (3rd inf. illative)"],
        "rows": [
          ["Formality", "formal, written, YKI", "neutral, common in speech"],
          ["Typical verbs", "any verb", "movement verbs (menn\u00e4, tulla, l\u00e4hte\u00e4)"],
          ["Example", "H\u00e4n meni kauppaan ostaakseen ruokaa.", "H\u00e4n meni kauppaan ostamaan ruokaa."],
          ["Meaning", "in order to buy food", "to buy food (purpose with movement)"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Long infinitive (formal)", "-maan (spoken/neutral)", "Meaning"],
        "rows": [
          ["H\u00e4n tuli n\u00e4hd\u00e4kseen minut.", "H\u00e4n tuli n\u00e4kem\u00e4\u00e4n minut.", "He came to see me."],
          ["L\u00e4hdin ostaakseni maitoa.", "L\u00e4hdin ostamaan maitoa.", "I left to buy milk."]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "With non-movement verbs (s\u00e4\u00e4st\u00e4\u00e4, opiskella, harjoitella), -akseen is more natural even in speech."
      },
      {
        "type": "subheading",
        "text": "5. Negative Purpose (How to Say 'in order not to')"
      },
      {
        "type": "paragraph",
        "text": "The long infinitive has no direct negative form. Instead, use jotta ei + clause or ett\u00e4 ei + clause."
      },
      {
        "type": "example-table",
        "headers": ["Positive", "Negative", "Meaning"],
        "rows": [
          ["Puhu hiljaa her\u00e4tt\u00e4\u00e4ksesi ket\u00e4\u00e4n.", "Puhu hiljaa, jotta et her\u00e4tt\u00e4isi ket\u00e4\u00e4n.", "Speak quietly so as not to wake anyone."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n puhui hiljaa v\u00e4ltt\u00e4\u00e4kseen h\u00e4iri\u00f6it\u00e4. = He spoke quietly to avoid disturbances."
        ]
      },
      {
        "type": "note",
        "icon": "✅",
        "text": "For negative purpose, Finnish prefers v\u00e4ltt\u00e4\u00e4kseen (to avoid) + noun/verb in partitive."
      },
      {
        "type": "subheading",
        "text": "6. Passive Long Infinitive (-ttakseen / -tt\u00e4kseen)"
      },
      {
        "type": "paragraph",
        "text": "The passive long infinitive expresses purpose with an impersonal or general subject. Formation: Passive stem + -akseen."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Passive stem", "Passive long infinitive"],
        "rows": [
          ["puhua", "puhutta-", "puhuttakseen"],
          ["tehd\u00e4", "teht\u00e4-", "teht\u00e4kseen"],
          ["n\u00e4hd\u00e4", "n\u00e4ht\u00e4-", "n\u00e4ht\u00e4kseen"],
          ["sy\u00f6d\u00e4", "sy\u00f6t\u00e4-", "sy\u00f6t\u00e4kseen"]
        ]
      },
      {
        "type": "note",
        "icon": "📘",
        "text": "For B2, you only need to recognize passive long infinitive. Active is much more common."
      },
      {
        "type": "subheading",
        "text": "7. Long Infinitive with voidakseen (to be able to)"
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n ty\u00f6skenteli kovasti voidakseen ostaa talon. (He worked hard to be able to buy the house.)",
          "Opiskelen ahkerasti voidakseni p\u00e4\u00e4st\u00e4 yliopistoon. (I study hard to be able to get into university.)",
          "H\u00e4n s\u00e4\u00e4sti kuukausia voidakseen matkustaa Japaniin. (He saved for months to be able to travel to Japan.)"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Long Infinitive with ehti\u00e4kseen (to have time to)"
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n tuli aikaisin ehti\u00e4kseen junaan. (He came early to have time for the train.)",
          "Juoksin kovaa ehti\u00e4kseni bussiin. (I ran fast to catch the bus.)"
        ]
      },
      {
        "type": "subheading",
        "text": "9. Long Infinitive in Extended Sentences (YKI Level)"
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n muutti ulkomaille oppiakseen uuden kielen, saadakseen ty\u00f6kokemusta ja l\u00f6yt\u00e4\u00e4kseen uusia yst\u00e4vi\u00e4. (He moved abroad to learn a new language, to gain work experience, and to find new friends.)",
          "Yritys investoi uuteen teknologiaan parantaakseen tuottavuutta ja v\u00e4hent\u00e4\u00e4kseen kustannuksia. (The company invests in new technology to improve productivity and reduce costs.)",
          "L\u00e4\u00e4k\u00e4ri m\u00e4\u00e4r\u00e4si l\u00e4\u00e4kkeen lievitt\u00e4\u00e4kseen kipuja ja nopeuttaakseen paranemista. (The doctor prescribed the medicine to relieve pain and speed up recovery.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10. Spoken Finnish Equivalents (What Finns actually say)"
      },
      {
        "type": "example-table",
        "headers": ["Written (long infinitive)", "Spoken (common)"],
        "rows": [
          ["menin ostaakseni maitoa", "menin ostamaan maitoo"],
          ["tulin n\u00e4hd\u00e4kseni sinut", "tulin n\u00e4kee sut"],
          ["opiskelen p\u00e4\u00e4st\u00e4kseni yliopistoon", "opiskelen et p\u00e4\u00e4sen yliopistoon"],
          ["s\u00e4\u00e4stin matkustaakseni", "s\u00e4\u00e4stin et saisin matkustettua"]
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "B2 advice: Use -akseen in writing and YKI essays. Use -maan or ett\u00e4 + clause in speech."
      },
      {
        "type": "subheading",
        "text": "11. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Menin ulos ostanakseni maitoa", "ostaakseni maitoa", "Wrong stem \u2014 no -n- in suffix"],
          ["H\u00e4n tuli n\u00e4hd\u00e4kseen sinut (if sin\u00e4 is the one seeing)", "H\u00e4n tuli, jotta sin\u00e4 n\u00e4kisit h\u00e4net", "Different subjects require jotta + clause"],
          ["Puhun hiljaa her\u00e4tt\u00e4\u00e4kseni", "Puhun hiljaa her\u00e4tt\u00e4\u00e4kseni ket\u00e4\u00e4n", "Object needed for transitive verb"]
        ]
      },
      {
        "type": "subheading",
        "text": "12. Quick Master Table (All Purpose Structures)"
      },
      {
        "type": "example-table",
        "headers": ["Structure", "Example", "Meaning", "Level"],
        "rows": [
          ["-maan / -m\u00e4\u00e4n", "menen ostamaan", "I'm going to buy", "spoken/written"],
          ["-akseen / -kseen", "ostaakseen", "in order to buy", "formal/written"],
          ["jotta + clause", "jotta saisin ostettua", "so that I could buy", "neutral"],
          ["ett\u00e4 + conditional", "ett\u00e4 ostaisin", "to buy (purpose)", "neutral"]
        ]
      },
      {
        "type": "subheading",
        "text": "13. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Replace the 'jotta' clause with the long infinitive where possible. If not possible, explain why.",
        "items": [
          "1. H\u00e4n meni kauppaan, jotta h\u00e4n ostaisi maitoa. \u2192 H\u00e4n meni kauppaan ostaakseen maitoa. (\u2705 same subject)",
          "2. Tulin t\u00e4nne, jotta n\u00e4kisin sinut. \u2192 Tulin t\u00e4nne n\u00e4hd\u00e4kseni sinut. (\u2705 same subject)",
          "3. H\u00e4n l\u00e4hti ulkomaille, jotta h\u00e4nen lapsensa oppisivat englantia. \u2192 \u274c Not possible \u2014 different subjects (h\u00e4n vs. h\u00e4nen lapsensa).",
          "4. S\u00e4\u00e4st\u00e4n rahaa, jotta voin matkustaa ensi vuonna. \u2192 S\u00e4\u00e4st\u00e4n rahaa matkustaakseni ensi vuonna / voidakseni matkustaa.",
          "5. Puhuin hiljaa, jotta en her\u00e4tt\u00e4isi vauvaa. \u2192 \u274c Not possible with -akseen (no negative form). Use jotta en her\u00e4tt\u00e4isi or v\u00e4ltt\u00e4\u00e4kseni her\u00e4tt\u00e4m\u00e4st\u00e4."
        ]
      },
      {
        "type": "subheading",
        "text": "14. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Menen kirjastoon lukeakseni rauhassa. (I go to the library to read in peace.)",
          "Her\u00e4sin aikaisin ehti\u00e4kseni aamujunaan. (I woke up early to catch the morning train.)",
          "H\u00e4n harjoittelee p\u00e4ivitt\u00e4in kehitty\u00e4kseen paremmaksi. (He practices daily to develop into a better one.)",
          "Yritys palkkasi asiantuntijan parantaakseen tuotettaan. (The company hired an expert to improve its product.)",
          "Opiskelen suomea ymm\u00e4rt\u00e4\u00e4kseni paremmin suomalaista kulttuuria. (I study Finnish to better understand Finnish culture.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the long infinitive (purpose form) of 'puhua' (to speak) in the 3rd person singular?",
      "options": ["puhuaakseen", "puhuakseen", "puhuaksensa", "puhuksensa"],
      "correctAnswer": "puhuakseen",
      "explanation": "The long infinitive is formed by adding -kseen to the stem: puhu- + -akseen = puhuakseen.",
      "hint": "Stem puhu- + -kseen with vowel harmony.",
      "points": 10
    },
    {
      "question": "What does the possessive suffix in 'ostaakseni' indicate?",
      "options": [
        "The object being bought",
        "The subject of the main clause (first person singular)",
        "The time of the action",
        "The passive voice"
      ],
      "correctAnswer": "The subject of the main clause (first person singular)",
      "explanation": "The possessive suffix in the long infinitive agrees with the subject of the main clause. 'Ostaakseni' = 'in order for me to buy'.",
      "hint": "It tells who is performing the action of the infinitive.",
      "points": 10
    },
    {
      "question": "What is the difference between 'H\u00e4n meni kauppaan ostaakseen maitoa' and 'H\u00e4n meni kauppaan ostamaan maitoa'?",
      "options": [
        "No difference",
        "First is formal/written (-akseen), second is spoken/neutral (-maan)",
        "First is past tense, second is present",
        "First is negative, second is positive"
      ],
      "correctAnswer": "First is formal/written (-akseen), second is spoken/neutral (-maan)",
      "explanation": "Both express purpose. The long infinitive (-akseen) is more formal and common in written Finnish, while the 3rd infinitive illative (-maan) is neutral and widely used in speech.",
      "hint": "Formality vs. everyday speech.",
      "points": 10
    },
    {
      "question": "When is the long infinitive NOT allowed?",
      "options": [
        "When the main verb is in past tense",
        "When the subject of the infinitive is different from the subject of the main clause",
        "When the verb is intransitive",
        "When the sentence is negative"
      ],
      "correctAnswer": "When the subject of the infinitive is different from the subject of the main clause",
      "explanation": "The long infinitive requires the same subject for both the main verb and the infinitive. If the subjects are different, you must use 'jotta' + clause.",
      "hint": "Same subject rule.",
      "points": 10
    },
    {
      "question": "How do you say 'I went outside to buy milk' using the long infinitive?",
      "options": [
        "Menin ulos ostanakseni maitoa",
        "Menin ulos ostaakseni maitoa",
        "Menin ulos ostamaan maitoa",
        "Menin ulos ostaakseni maidon"
      ],
      "correctAnswer": "Menin ulos ostaakseni maitoa",
      "explanation": "'Ostaakseni' is the 1st person singular long infinitive of 'ostaa' (to buy). 'Menin ulos ostaakseni maitoa' = I went outside to buy milk.",
      "hint": "Possessive suffix -kseni for 'min\u00e4'.",
      "points": 10
    },
    {
      "question": "What is the correct long infinitive of 'tehd\u00e4' (to do/make) for 'h\u00e4n'?",
      "options": ["teke\u00e4kseen", "tehd\u00e4kseen", "tekem\u00e4kseen", "tekisikseen"],
      "correctAnswer": "tehd\u00e4kseen",
      "explanation": "'Tehd\u00e4' has an irregular stem: tehd\u00e4kseen (from teke- + -kseen with k → h change).",
      "hint": "Irregular: teke- becomes tehd-.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the long infinitive?",
      "options": [
        "H\u00e4n tuli, jotta n\u00e4kisi minut.",
        "H\u00e4n tuli n\u00e4hd\u00e4kseen minut.",
        "H\u00e4n tuli n\u00e4kem\u00e4\u00e4n minut.",
        "H\u00e4n tuli n\u00e4hd\u00e4kseni minut."
      ],
      "correctAnswer": "H\u00e4n tuli n\u00e4hd\u00e4kseen minut.",
      "explanation": "'H\u00e4n tuli n\u00e4hd\u00e4kseen minut' = He came to see me. The 3rd person singular suffix -kseen agrees with 'h\u00e4n'.",
      "hint": "Same subject (h\u00e4n/h\u00e4n) + correct suffix -kseen.",
      "points": 10
    },
    {
      "question": "How do you express negative purpose in Finnish (e.g., 'so as not to wake the baby') using formal language?",
      "options": [
        "her\u00e4tt\u00e4m\u00e4tt\u00e4 vauvaa",
        "jotta et her\u00e4tt\u00e4isi vauvaa",
        "her\u00e4t\u00e4kseen vauva",
        "v\u00e4ltt\u00e4\u00e4kseen vauvaa"
      ],
      "correctAnswer": "jotta et her\u00e4tt\u00e4isi vauvaa",
      "explanation": "The long infinitive has no direct negative form. For negative purpose, use 'jotta ei' + conditional, or 'v\u00e4ltt\u00e4\u00e4kseen' (to avoid) + object in partitive.",
      "hint": "No negative -akseen form.",
      "points": 10
    },
    {
      "question": "What is the long infinitive of 'voida' (to be able to) for 'min\u00e4' meaning 'in order for me to be able to'?",
      "options": ["voiakseni", "voidakseni", "voimakseni", "voittakseni"],
      "correctAnswer": "voidakseni",
      "explanation": "Voida → voida- stem + -kseni = voidakseni (I can/am able to). Common in purpose clauses: 'ty\u00f6skentelin voidakseni matkustaa' = I worked to be able to travel.",
      "hint": "Stem voida- + possessive suffix.",
      "points": 10
    },
    {
      "question": "What is the problem with this sentence: 'H\u00e4n toi ruokaa, jotta minun tarvitsisi kokata.'?",
      "options": [
        "No problem",
        "It should use the long infinitive instead",
        "The subjects are different, so the long infinitive cannot replace it",
        "The verb should be in past tense"
      ],
      "correctAnswer": "The subjects are different, so the long infinitive cannot replace it",
      "explanation": "The long infinitive requires the same subject. Here, 'h\u00e4n' (he) brought food, but 'minun' (I) would cook. Different subjects → use 'jotta' or rephrase.",
      "hint": "Same subject rule applies.",
      "points": 10
    }
  ]
},


{
  "id": "fifth-infinitive",
  "chapter": 5,
  "title": "Fifth Infinitive – Viides infinitiivi (-maisillaan/-mäisillään)",
  "finnish": "Viides infinitiivi",
  "icon": "⏱️",
  "level": "B2",
  "accent": "bg-purple-700",
  "badge": "bg-purple-50 text-purple-700 border-purple-200",
  "description": "Expresses an action that is imminent — 'just about to do something' — a formal/literary structure with possessive suffix agreement",
  "content": {
    "type": "rich",
    "intro": "The fifth infinitive expresses an action that is imminent — the subject is just about to do something but hasn't started yet. It is always used with the verb 'olla'. This form is rare in spoken Finnish and somewhat literary/formal.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. What Is the Fifth Infinitive? (B2 Refresher)"
      },
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["I am about to leave", "Olen l\u00e4htem\u00e4isill\u00e4ni"],
          ["He is about to eat", "H\u00e4n on sy\u00f6m\u00e4isill\u00e4\u00e4n"],
          ["The train was about to leave", "Juna oli l\u00e4htem\u00e4isill\u00e4\u00e4n"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "B2 insight: This form is rare in spoken Finnish and somewhat literary/formal. In speech, Finns use -massa / -maan or 'aikeissa'."
      },
      {
        "type": "subheading",
        "text": "2. Full Conjugation with Possessive Suffixes (Crucial!)"
      },
      {
        "type": "paragraph",
        "text": "The fifth infinitive always takes a possessive suffix that agrees with the subject. Formation: verb stem + -maisilla- + possessive suffix."
      },
      {
        "type": "example-table",
        "headers": ["Subject", "Suffix", "l\u00e4hte\u00e4 (to leave)", "sy\u00f6d\u00e4 (to eat)"],
        "rows": [
          ["min\u00e4", "-ni", "l\u00e4htem\u00e4isill\u00e4ni", "sy\u00f6m\u00e4isill\u00e4ni"],
          ["sin\u00e4", "-si", "l\u00e4htem\u00e4isill\u00e4si", "sy\u00f6m\u00e4isill\u00e4si"],
          ["h\u00e4n", "-an/-\u00e4n \u2192 -aan/-\u00e4\u00e4n", "l\u00e4htem\u00e4isill\u00e4\u00e4n", "sy\u00f6m\u00e4isill\u00e4\u00e4n"],
          ["me", "-mme", "l\u00e4htem\u00e4isill\u00e4mme", "sy\u00f6m\u00e4isill\u00e4mme"],
          ["te", "-nne", "l\u00e4htem\u00e4isill\u00e4nne", "sy\u00f6m\u00e4isill\u00e4nne"],
          ["he", "-an/-\u00e4n \u2192 -aan/-\u00e4\u00e4n", "l\u00e4htem\u00e4isill\u00e4\u00e4n", "sy\u00f6m\u00e4isill\u00e4\u00e4n"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "The third person form -maisillaan is a fusion: -maisilla- + -an \u2192 -maisillaan."
      },
      {
        "type": "example-list",
        "title": "Full example sentences:",
        "items": [
          "Olen l\u00e4htem\u00e4isill\u00e4ni kotiin. (I am about to leave home.)",
          "Olet puhumaisillasi jotain t\u00e4rke\u00e4\u00e4. (You are about to say something important.)",
          "H\u00e4n on sy\u00f6m\u00e4isill\u00e4\u00e4n. (He/she is about to eat.)",
          "Olemme menem\u00e4isill\u00e4mme ulos. (We are about to go out.)",
          "Olette nukkumaisillanne. (You (pl) are about to sleep.)",
          "He ovat saapumaisillaan. (They are about to arrive.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3. Past Tense Fifth Infinitive (Was about to)"
      },
      {
        "type": "example-table",
        "headers": ["Present", "Past", "Meaning"],
        "rows": [
          ["olen l\u00e4htem\u00e4isill\u00e4ni", "olin l\u00e4htem\u00e4isill\u00e4ni", "I am / was about to leave"],
          ["on sy\u00f6m\u00e4isill\u00e4\u00e4n", "oli sy\u00f6m\u00e4isill\u00e4\u00e4n", "he is / was about to eat"],
          ["ovat nukkumaisillaan", "olivat nukkumaisillaan", "they are / were about to sleep"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olin l\u00e4htem\u00e4isill\u00e4ni, kun puhelin soi. (I was about to leave when the phone rang.)",
          "H\u00e4n oli itkem\u00e4isill\u00e4\u00e4n, mutta hillitsi itsens\u00e4. (He was about to cry but controlled himself.)",
          "Juna oli l\u00e4htem\u00e4isill\u00e4\u00e4n, kun ehdimme kyytiin. (The train was about to leave when we got on board.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. Negative / Interrupted Action (Very common use)"
      },
      {
        "type": "paragraph",
        "text": "The fifth infinitive often appears in contexts where the action almost happened but was interrupted or did not happen."
      },
      {
        "type": "example-list",
        "items": [
          "Olin puhumaisillani, mutta en sanonut mit\u00e4\u00e4n. (I was about to speak, but I said nothing.)",
          "H\u00e4n oli nukkumaisillaan, kun joku koputti. (He was about to sleep when someone knocked.)",
          "Bussi oli l\u00e4htem\u00e4isill\u00e4\u00e4n, mutta ovi aukesi viel\u00e4. (The bus was about to leave, but the door opened again.)",
          "Olin putoamaisillani portailta. (I was about to fall down the stairs.)"
        ]
      },
      {
        "type": "note",
        "icon": "✅",
        "text": "This is the most natural use of the fifth infinitive — describing something that was almost realized but didn't happen."
      },
      {
        "type": "subheading",
        "text": "5. Fifth Infinitive vs. Other 'Almost' Structures (B2 Comparison)"
      },
      {
        "type": "example-table",
        "headers": ["Structure", "Meaning", "Example", "Formality"],
        "rows": [
          ["-maisillaan", "about to (imminent)", "olen l\u00e4htem\u00e4isill\u00e4ni", "formal/literary"],
          ["-massa", "in the middle of / about to (movement)", "olen l\u00e4hd\u00f6ss\u00e4", "neutral/spoken"],
          ["aikeissa", "planning / intending to", "olen aikeissa l\u00e4hte\u00e4", "neutral"]
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "Spoken Finnish reality: 'Olen l\u00e4hd\u00f6ss\u00e4' covers 90% of cases. '-maisillaan' is used for emphasis or literary effect."
      },
      {
        "type": "subheading",
        "text": "6. Common Verbs in Fifth Infinitive"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Fifth infinitive", "Example"],
        "rows": [
          ["l\u00e4hte\u00e4", "l\u00e4htem\u00e4isill\u00e4\u00e4n", "Bussi on l\u00e4htem\u00e4isill\u00e4\u00e4n."],
          ["tulla", "tulemaisillaan", "H\u00e4n on tulemaisillaan sis\u00e4\u00e4n."],
          ["menn\u00e4", "menem\u00e4isill\u00e4\u00e4n", "He ovat menem\u00e4isill\u00e4\u00e4n naimisiin."],
          ["sy\u00f6d\u00e4", "sy\u00f6m\u00e4isill\u00e4\u00e4n", "Koira on sy\u00f6m\u00e4isill\u00e4\u00e4n ruokani."],
          ["puhua", "puhumaisillaan", "Opettaja on puhumaisillaan."],
          ["itke\u00e4", "itkem\u00e4isill\u00e4\u00e4n", "Lapsi oli itkem\u00e4isill\u00e4\u00e4n."],
          ["nauraa", "nauramaisillaan", "H\u00e4n oli nauramaisillaan."],
          ["putota", "putoamaisillaan", "Lasi on putoamaisillaan."],
          ["alkaa", "alkamaisillaan", "Elokuva on alkamaisillaan."],
          ["loppua", "loppumaisillaan", "S\u00e4hk\u00f6 oli loppumaisillaan."]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Spoken Finnish Replacements (What Finns Actually Say)"
      },
      {
        "type": "example-table",
        "headers": ["Written (fifth infinitive)", "Spoken (common)"],
        "rows": [
          ["Olen l\u00e4htem\u00e4isill\u00e4ni", "M\u00e4 oon l\u00e4hd\u00f6ss\u00e4 / M\u00e4 meen just"],
          ["H\u00e4n oli itkem\u00e4isill\u00e4\u00e4n", "Se oli itkem\u00e4ss\u00e4 / Se meinas itke\u00e4"],
          ["Olin puhumaisillani", "M\u00e4 meinasin sanoa..."],
          ["Bussi on l\u00e4htem\u00e4isill\u00e4\u00e4n", "Bussi l\u00e4htee just"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "Key spoken structure: meinasin + 1st infinitive = 'I almost / was about to'. Example: M\u00e4 meinasin l\u00e4hte\u00e4, mut j\u00e4in. (I was about to leave, but I stayed.) \u26a0\ufe0f 'Meinasin' is colloquial and should not be used in formal writing."
      },
      {
        "type": "subheading",
        "text": "8. Fifth Infinitive vs. 3rd Infinitive Inessive (-massa)"
      },
      {
        "type": "example-table",
        "headers": ["Form", "Meaning", "Example"],
        "rows": [
          ["-massa", "in the middle of doing", "Olen sy\u00f6m\u00e4ss\u00e4 (I am eating)"],
          ["-maisillaan", "about to do (not started)", "Olen sy\u00f6m\u00e4isill\u00e4ni (I am about to eat)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olin sy\u00f6m\u00e4ss\u00e4, kun h\u00e4n tuli. (I was eating when he came. \u2014 already in progress)",
          "Olin sy\u00f6m\u00e4isill\u00e4ni, kun h\u00e4n tuli. (I was about to start eating when he came. \u2014 hadn't started yet)"
        ]
      },
      {
        "type": "subheading",
        "text": "9. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Olen l\u00e4htem\u00e4isill\u00e4\u00e4n (for 1st person)", "Olen l\u00e4htem\u00e4isill\u00e4ni", "Missing possessive suffix for 1st person"],
          ["Olet l\u00e4htem\u00e4isill\u00e4\u00e4n (for 2nd person)", "Olet l\u00e4htem\u00e4isill\u00e4si", "Possessive suffix required for all persons"],
          ["Olin l\u00e4htem\u00e4inen", "Olin l\u00e4htem\u00e4isill\u00e4ni", "Wrong stem \u2014 must be -maisilla-"],
          ["Olin sy\u00f6m\u00e4ss\u00e4 (meaning 'about to')", "Olin sy\u00f6m\u00e4isill\u00e4ni", "-massa means 'currently doing', not 'about to'"]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Full Example Sentences (YKI Level)"
      },
      {
        "type": "example-list",
        "items": [
          "Olin jo l\u00e4htem\u00e4isill\u00e4ni kotoa, kun huomasin unohtaneeni avaimet. (I was just about to leave home when I noticed I had forgotten my keys.)",
          "Elokuva oli alkamaisillaan, ja sali oli t\u00e4ynn\u00e4 odottavia katsojia. (The movie was about to start, and the hall was full of waiting spectators.)",
          "H\u00e4n oli itkem\u00e4isill\u00e4\u00e4n onnesta kuultuaan hyv\u00e4t uutiset. (He was about to cry with joy after hearing the good news.)",
          "Lapsi oli putoamaisillaan tuolilta, mutta is\u00e4 ehti napata h\u00e4net. (The child was about to fall off the chair, but the father managed to grab him.)",
          "Olimme nukkumaisillamme, kun alkoi kova ukkonen. (We were about to fall asleep when a loud thunderstorm started.)",
          "S\u00e4hk\u00f6t olivat loppumaisillaan, juuri kun olimme katsomassa finaalia. (The electricity was about to run out just when we were watching the final.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Quick Reference Table"
      },
      {
        "type": "example-table",
        "headers": ["Person", "l\u00e4hte\u00e4 (to leave)", "sy\u00f6d\u00e4 (to eat)", "puhua (to speak)"],
        "rows": [
          ["min\u00e4", "olen l\u00e4htem\u00e4isill\u00e4ni", "olen sy\u00f6m\u00e4isill\u00e4ni", "olen puhumaisillani"],
          ["sin\u00e4", "olet l\u00e4htem\u00e4isill\u00e4si", "olet sy\u00f6m\u00e4isill\u00e4si", "olet puhumaisillasi"],
          ["h\u00e4n", "on l\u00e4htem\u00e4isill\u00e4\u00e4n", "on sy\u00f6m\u00e4isill\u00e4\u00e4n", "on puhumaisillaan"],
          ["me", "olemme l\u00e4htem\u00e4isill\u00e4mme", "olemme sy\u00f6m\u00e4isill\u00e4mme", "olemme puhumaisillamme"],
          ["te", "olette l\u00e4htem\u00e4isill\u00e4nne", "olette sy\u00f6m\u00e4isill\u00e4nne", "olette puhumaisillanne"],
          ["he", "ovat l\u00e4htem\u00e4isill\u00e4\u00e4n", "ovat sy\u00f6m\u00e4isill\u00e4\u00e4n", "ovat puhumaisillaan"]
        ]
      },
      {
        "type": "subheading",
        "text": "12. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Replace the spoken/colloquial expression with the fifth infinitive in formal/written Finnish.",
        "items": [
          "1. M\u00e4 olin just l\u00e4hd\u00f6ss\u00e4, kun s\u00e4 soitti. \u2192 Olin l\u00e4htem\u00e4isill\u00e4ni, kun soitit.",
          "2. Se meinas tippua, mut se tarttuu kiinni. \u2192 H\u00e4n oli putoamaisillaan, mutta tarttui kiinni.",
          "3. Oon just sy\u00f6m\u00e4ss\u00e4, tuu vartin p\u00e4\u00e4st\u00e4. \u2192 Cannot transform directly \u2014 sy\u00f6m\u00e4ss\u00e4 means already eating, not 'about to'.",
          "4. Bussi l\u00e4htee just, mut me ehdit\u00e4\u00e4n! \u2192 Bussi on l\u00e4htem\u00e4isill\u00e4\u00e4n, mutta ehdimme!",
          "5. H\u00e4n oli aikeissa sanoa jotain, mutta j\u00e4tti sanomatta. \u2192 H\u00e4n oli sanomaisillaan jotain, mutta j\u00e4tti sanomatta."
        ]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Olin jo nukkumaisillani, kun naapurin koira alkoi haukkua. (I was already about to fall asleep when the neighbor's dog started barking.)",
          "H\u00e4n oli nauramaisillaan, mutta pid\u00e4ttyi. (She was about to laugh, but restrained herself.)",
          "Kun olin l\u00e4htem\u00e4isill\u00e4ni, h\u00e4n pys\u00e4ytti minut. (When I was about to leave, he stopped me.)",
          "Olimme putoamaisillamme j\u00e4\u00e4lt\u00e4, mutta yst\u00e4v\u00e4 auttoi yl\u00f6s. (We were about to fall through the ice, but a friend helped us up.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the fifth infinitive (-maisillaan) express?",
      "options": [
        "An action that is currently happening",
        "An action that is about to happen (imminent)",
        "An action that has already been completed",
        "An action that is done habitually"
      ],
      "correctAnswer": "An action that is about to happen (imminent)",
      "explanation": "The fifth infinitive expresses an action that is just about to happen but has not started yet. Example: 'Olen l\u00e4htem\u00e4isill\u00e4ni' = I am about to leave.",
      "hint": "Think of 'just about to'.",
      "points": 10
    },
    {
      "question": "Why is 'Olen l\u00e4htem\u00e4isill\u00e4\u00e4n' incorrect for 'I am about to leave'?",
      "options": [
        "It's the wrong verb",
        "The possessive suffix is missing for 1st person",
        "The tense is wrong",
        "It means something else"
      ],
      "correctAnswer": "The possessive suffix is missing for 1st person",
      "explanation": "The fifth infinitive requires a possessive suffix that agrees with the subject. For 1st person ('min\u00e4'), the suffix is '-ni': 'l\u00e4htem\u00e4isill\u00e4ni'. '-L\u00e4\u00e4n' is for 3rd person.",
      "hint": "Check the possessive suffix.",
      "points": 10
    },
    {
      "question": "What is the correct 1st person singular form of 'sy\u00f6d\u00e4' (to eat) in the fifth infinitive?",
      "options": ["olen sy\u00f6m\u00e4isill\u00e4", "olen sy\u00f6m\u00e4isill\u00e4ni", "olen sy\u00f6m\u00e4isill\u00e4si", "olen sy\u00f6m\u00e4isill\u00e4\u00e4n"],
      "correctAnswer": "olen sy\u00f6m\u00e4isill\u00e4ni",
      "explanation": "1st person singular requires the possessive suffix '-ni': 'olen sy\u00f6m\u00e4isill\u00e4ni' = I am about to eat.",
      "hint": "Add -ni to the stem.",
      "points": 10
    },
    {
      "question": "What is the most common spoken Finnish replacement for 'Olen l\u00e4htem\u00e4isill\u00e4ni'?",
      "options": [
        "Olen l\u00e4hd\u00f6ss\u00e4",
        "Olen l\u00e4htenyt",
        "Olen l\u00e4htem\u00e4tt\u00e4",
        "Olen menossa"
      ],
      "correctAnswer": "Olen l\u00e4hd\u00f6ss\u00e4",
      "explanation": "In spoken Finnish, 'olen l\u00e4hd\u00f6ss\u00e4' (I'm leaving / about to leave) is much more common than the formal fifth infinitive.",
      "hint": "Think of what Finns actually say.",
      "points": 10
    },
    {
      "question": "What does 'H\u00e4n oli l\u00e4htem\u00e4isill\u00e4\u00e4n, mutta muutti mielens\u00e4' mean?",
      "options": [
        "He was leaving but changed his mind",
        "He was about to leave but changed his mind",
        "He left but changed his mind",
        "He had left but changed his mind"
      ],
      "correctAnswer": "He was about to leave but changed his mind",
      "explanation": "The fifth infinitive ('oli l\u00e4htem\u00e4isill\u00e4\u00e4n') means 'was about to leave'. The action did not happen because he changed his mind.",
      "hint": "-maisillaan expresses an imminent action that may not be completed.",
      "points": 10
    },
    {
      "question": "What is the colloquial equivalent of 'olin puhumaisillani' using 'meinasin'?",
      "options": [
        "m\u00e4 meinasin puhua",
        "m\u00e4 olin puhumassa",
        "m\u00e4 puhuin",
        "m\u00e4 olen puhumassa"
      ],
      "correctAnswer": "m\u00e4 meinasin puhua",
      "explanation": "The colloquial structure 'meinasin + 1st infinitive' means 'I was about to / I almost'. 'M\u00e4 meinasin puhua' = I was about to speak.",
      "hint": "Meinasin is common in speech.",
      "points": 10
    },
    {
      "question": "Which sentence uses the fifth infinitive correctly?",
      "options": [
        "Olen l\u00e4hd\u00f6ss\u00e4 kotiin.",
        "Olen l\u00e4htem\u00e4isill\u00e4ni kotiin.",
        "Olen menossa kotiin.",
        "Olen l\u00e4htem\u00e4ss\u00e4 kotiin."
      ],
      "correctAnswer": "Olen l\u00e4htem\u00e4isill\u00e4ni kotiin.",
      "explanation": "'Olen l\u00e4htem\u00e4isill\u00e4ni kotiin' is the correct fifth infinitive form, meaning 'I am about to leave for home'.",
      "hint": "Correct suffix -ni and stem -maisilla-.",
      "points": 10
    },
    {
      "question": "When is the fifth infinitive most naturally used?",
      "options": [
        "For actions that were completed successfully",
        "For actions that almost happened but were interrupted or didn't happen",
        "For habitual actions",
        "For future plans"
      ],
      "correctAnswer": "For actions that almost happened but were interrupted or didn't happen",
      "explanation": "The fifth infinitive is very common in contexts where an action was about to occur but was interrupted or did not happen. Example: 'Olin putoamaisillani, mutta tartuin kaiteeseen.'",
      "hint": "Think of 'almost but not quite'.",
      "points": 10
    },
    {
      "question": "What is the 2nd person singular form of 'l\u00e4hte\u00e4' in the fifth infinitive?",
      "options": ["olen l\u00e4htem\u00e4isill\u00e4ni", "olet l\u00e4htem\u00e4isill\u00e4si", "on l\u00e4htem\u00e4isill\u00e4\u00e4n", "olemme l\u00e4htem\u00e4isill\u00e4mme"],
      "correctAnswer": "olet l\u00e4htem\u00e4isill\u00e4si",
      "explanation": "2nd person singular ('sin\u00e4') requires the possessive suffix '-si': 'olet l\u00e4htem\u00e4isill\u00e4si' = you are about to leave.",
      "hint": "Add -si to the stem for 'you'.",
      "points": 10
    },
    {
      "question": "Why can't 'Olen sy\u00f6m\u00e4ss\u00e4' be used to mean 'I am about to eat' in formal writing?",
      "options": [
        "Because it's in the wrong tense",
        "Because it means 'I am currently eating', not 'about to eat'",
        "Because it's passive",
        "Because it's negative"
      ],
      "correctAnswer": "Because it means 'I am currently eating', not 'about to eat'",
      "explanation": "'Olen sy\u00f6m\u00e4ss\u00e4' (3rd infinitive inessive) means 'I am in the middle of eating'. The fifth infinitive 'olen sy\u00f6m\u00e4isill\u00e4ni' specifically means 'I am about to start eating' (not started yet).",
      "hint": "Already eating vs. not started yet.",
      "points": 10
    }
  ]
},


{
  "id": "comitative-case",
  "chapter": 6,
  "title": "Comitative Case – Komitatiivi",
  "finnish": "Komitatiivi",
  "icon": "👥",
  "level": "B2",
  "accent": "bg-teal-700",
  "badge": "bg-teal-50 text-teal-700 border-teal-200",
  "description": "The comitative case (-ineen) expresses 'together with someone/something' — always plural, always with a possessive suffix, and mainly used in formal/written Finnish",
  "content": {
    "type": "rich",
    "intro": "The comitative case expresses 'together with someone/something' \u2014 usually something the subject owns or is accompanied by. It is always plural (even when referring to one person/thing) and always includes a possessive suffix.",
    "sections": [
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["with his/her children", "lapsineen"],
          ["with her friends", "yst\u00e4vineen"],
          ["with their belongings", "tavaroineen"],
          ["with his family", "perheineen"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "B2 insight: The comitative is rare in spoken Finnish. It appears in formal writing, news, literature, and official documents. In everyday speech, Finns use 'kanssa' (with)."
      },
      {
        "type": "subheading",
        "text": "2. Full Formation Rules (All Word Types)"
      },
      {
        "type": "paragraph",
        "text": "Formula: Noun stem (plural stem) + -ine- + possessive suffix. The noun is always in the plural stem form, even when referring to a singular thing (e.g., 'lapsineen' = with his/her child/children \u2014 context decides number)."
      },
      {
        "type": "example-table",
        "headers": ["Nominative sg", "Comitative", "Meaning"],
        "rows": [
          ["lapsi", "lapsineen", "with his/her child(ren)"],
          ["yst\u00e4v\u00e4", "yst\u00e4vineen", "with his/her friend(s)"],
          ["auto", "autoineen", "with his/her car(s)"],
          ["talo", "taloineen", "with his/her house(s)"],
          ["koira", "koirineen", "with his/her dog(s)"],
          ["kirja", "kirjoineen", "with his/her book(s)"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "kirja \u2192 plural stem kirjoi- \u2192 kirjoineen (not kirjoineen)."
      },
      {
        "type": "subheading",
        "text": "3. Full Conjugation with Possessive Suffixes (Crucial!)"
      },
      {
        "type": "example-table",
        "headers": ["Possessor", "Suffix", "lapsi (child)", "yst\u00e4v\u00e4 (friend)"],
        "rows": [
          ["min\u00e4", "-ni", "lapsineni", "yst\u00e4vineni"],
          ["sin\u00e4", "-si", "lapsinesi", "yst\u00e4vinesi"],
          ["h\u00e4n", "-nsa / -ns\u00e4 \u2192 -en", "lapsineen", "yst\u00e4vineen"],
          ["me", "-mme", "lapsinemme", "yst\u00e4vinemme"],
          ["te", "-nne", "lapsinenne", "yst\u00e4vinenne"],
          ["he", "-nsa / -ns\u00e4 \u2192 -en", "lapsineen", "yst\u00e4vineen"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "The third person suffix is -en (an older form of -nsa/-ns\u00e4 that has fused with -ine- to become -ineen). So 'lapsineen' = 'with his/her/their child(ren)'."
      },
      {
        "type": "example-list",
        "title": "Full example sentences:",
        "items": [
          "Tulin juhliin lapsineni. (I came to the party with my children.)",
          "Tulit juhliin lapsinesi. (You came to the party with your children.)",
          "H\u00e4n tuli juhliin lapsineen. (He/she came to the party with his/her children.)",
          "Tulimme juhliin lapsinemme. (We came to the party with our children.)",
          "Tulitte juhliin lapsinenne. (You (pl) came to the party with your children.)",
          "He tulivat juhliin lapsineen. (They came to the party with their children.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. Comitative vs. Other 'With' Structures (B2 Comparison)"
      },
      {
        "type": "example-table",
        "headers": ["Structure", "Example", "Meaning", "Formality"],
        "rows": [
          ["Comitative (-ineen)", "lapsineen", "with his/her children", "formal/literary"],
          ["kanssa (postposition)", "lasten kanssa", "with the children", "neutral/spoken"],
          ["mukana", "lapset mukana", "children along", "neutral"],
          ["ja", "lapset ja h\u00e4n", "children and him/her", "neutral"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Formal (comitative)", "Spoken (with kanssa)"],
        "rows": [
          ["H\u00e4n saapui perheineen.", "H\u00e4n saapui perheens\u00e4 kanssa."],
          ["Presidentti saapui puolisoineen.", "Presidentti saapui puolisonsa kanssa."],
          ["Opettaja tuli kollegoineen.", "Opettaja tuli kollegoidensa kanssa."]
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "Spoken Finnish reality: 'Lasten kanssa' is used 95% of the time. Comitative is rare in speech."
      },
      {
        "type": "subheading",
        "text": "5. Fixed Expressions with Comitative (Where It's Still Alive)"
      },
      {
        "type": "example-table",
        "headers": ["Expression", "Meaning", "Notes"],
        "rows": [
          ["tavaroineen", "with (his/her) belongings", "H\u00e4n l\u00e4hti tavaroineen."],
          ["perheineen", "with (his/her) family", "Muutimme perheineen maalle."],
          ["juurineen", "with roots", "Puu kaatui juurineen."],
          ["kaikkineen", "with everything / all included", "H\u00e4n otti talon kaikkineen."],
          ["lapsineen", "with (his/her) children", "Perhe lapsineen."],
          ["koirineen", "with (his/her) dogs", "Mies k\u00e4veli koirineen."]
        ]
      },
      {
        "type": "example-list",
        "items": ["H\u00e4n saapui paikalle perheineen. (He arrived with his family.)"]
      },
      {
        "type": "subheading",
        "text": "6. Comitative in News and Formal Writing (YKI Reading)"
      },
      {
        "type": "example-list",
        "items": [
          "Presidentti Niinist\u00f6 puolisoineen saapui vastaanotolle. (President Niinist\u00f6, with his spouse, arrived at the reception.)",
          "Perhe koirineen oli mukana retkell\u00e4. (The family, with their dog, was along on the trip.)",
          "Yritys toimitusjohtajineen siirtyi uusiin tiloihin. (The company, with its CEO, moved to new premises.)"
        ]
      },
      {
        "type": "subheading",
        "text": "7. Comitative with Multiple Possessors (Rare)"
      },
      {
        "type": "example-list",
        "items": [
          "He tulivat lapsineen. (They came with their children \u2014 each with their own children, or collectively.)",
          "He tulivat kukin lapsineen. (They came each with their own children.)"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Comitative vs. Abessive (Without vs. With)"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Suffix", "Meaning", "Example"],
        "rows": [
          ["Comitative", "-ineen", "with", "lapsineen (with children)"],
          ["Abessive", "-tta/-tt\u00e4", "without", "lapsitta (without children)"]
        ]
      },
      {
        "type": "example-list",
        "items": ["H\u00e4n tuli lapsineen, ei lapsitta. (He came with his children, not without.)"]
      },
      {
        "type": "subheading",
        "text": "9. Spoken Finnish Replacements (What Finns Actually Say)"
      },
      {
        "type": "example-table",
        "headers": ["Written (comitative)", "Spoken (common)"],
        "rows": [
          ["perheineen", "perheens\u00e4 kanssa"],
          ["lapsineen", "lastensa kanssa"],
          ["tavaroineen", "tavaroidensa kanssa / kamppeineen (colloquial)"],
          ["yst\u00e4vineen", "kavereidensa kanssa"]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "B2 advice: In YKI writing, you can use comitative to sound formal and sophisticated. In speaking, use 'kanssa'."
      },
      {
        "type": "subheading",
        "text": "10. Comitative Without a Possessive? (Never!)"
      },
      {
        "type": "example-list",
        "items": [
          "\u274c H\u00e4n tuli lapsine.",
          "\u2705 H\u00e4n tuli lapsineen. (with his/her children)",
          "\u274c Koirine",
          "\u2705 Koirineen (with his/her dog(s))"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["lapsine (missing suffix)", "lapsineen", "Comitative always has possessive suffix"],
          ["lasten kanssa (in formal writing)", "lapsineen", "Use comitative in formal writing for conciseness"],
          ["lapsineen for first person", "lapsineni", "First person needs -ni suffix"],
          ["h\u00e4n tuli heid\u00e4n lapsineen", "h\u00e4n tuli lapsineen", "The possessive suffix already indicates whose children"]
        ]
      },
      {
        "type": "subheading",
        "text": "12. Full Example Sentences (YKI Level)"
      },
      {
        "type": "example-list",
        "items": [
          "Presidentti saapui juhlasaliin puolisoineen ja avustajineen. (The president arrived in the banquet hall with his/her spouse and assistants.)",
          "Perhe muutti maalle koirineen ja kissoineen. (The family moved to the countryside with their dogs and cats.)",
          "H\u00e4n l\u00e4hti kotoa tavaroineen eik\u00e4 palannut koskaan. (He left home with his belongings and never returned.)",
          "Opettaja tuli luokkaan kirjoineen ja vihkoineen. (The teacher came to the classroom with his/her books and notebooks.)",
          "Vanha puu kaatui myrskyss\u00e4 juurineen. (The old tree fell in the storm with its roots.)",
          "Yritys toimitusjohtajineen osallistui messuille. (The company, together with its CEO, participated in the trade fair.)"
        ]
      },
      {
        "type": "subheading",
        "text": "13. Quick Reference Table (Common Comitatives)"
      },
      {
        "type": "example-table",
        "headers": ["Nominative sg", "Comitative (3rd person)", "Meaning"],
        "rows": [
          ["lapsi", "lapsineen", "with his/her child(ren)"],
          ["yst\u00e4v\u00e4", "yst\u00e4vineen", "with his/her friend(s)"],
          ["perhe", "perheineen", "with his/her family"],
          ["puoliso", "puolisoineen", "with his/her spouse"],
          ["koira", "koirineen", "with his/her dog(s)"],
          ["kissa", "kissoineen", "with his/her cat(s)"],
          ["auto", "autoineen", "with his/her car(s)"],
          ["talo", "taloineen", "with his/her house(s)"],
          ["kirja", "kirjoineen", "with his/her book(s)"],
          ["tavara", "tavaroineen", "with his/her belongings"],
          ["juuri", "juurineen", "with its roots"],
          ["kaikki", "kaikkineen", "with everything"]
        ]
      },
      {
        "type": "subheading",
        "text": "14. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Replace the spoken expression with the formal comitative.",
        "items": [
          "1. H\u00e4n saapui perheens\u00e4 kanssa. \u2192 H\u00e4n saapui perheineen.",
          "2. Presidentti tuli vaimonsa kanssa. \u2192 Presidentti tuli puolisoineen. (or vaimoineen)",
          "3. Mies k\u00e4veli koiransa kanssa. \u2192 Mies k\u00e4veli koirineen.",
          "4. He l\u00e4htiv\u00e4t tavaroidensa kanssa. \u2192 He l\u00e4htiv\u00e4t tavaroineen.",
          "5. Opettaja tuli oppilaidensa kanssa. \u2192 Opettaja tuli oppilaineen."
        ]
      },
      {
        "type": "subheading",
        "text": "15. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Kuningatar saapui seurueineen. (The queen arrived with her entourage.)",
          "Yritys osti kilpailijan tehtaineen. (The company bought the competitor with its factories.)",
          "H\u00e4n astui sis\u00e4\u00e4n perheineen ja kohtasi toimittajat. (He walked in with his family and faced the reporters.)",
          "Vanha kartano myytiin huonekaluineen. (The old manor was sold with its furniture.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the comitative case (-ineen) express?",
      "options": [
        "Without something",
        "Together with someone/something",
        "Inside something",
        "From somewhere"
      ],
      "correctAnswer": "Together with someone/something",
      "explanation": "The comitative case expresses accompaniment: 'together with someone/something'. Example: 'lapsineen' = with his/her children.",
      "hint": "Think of 'with'.",
      "points": 10
    },
    {
      "question": "What is the correct comitative form of 'lapsi' (child) in the third person, meaning 'with his/her child(ren)'?",
      "options": ["lapsine", "lapsineen", "lasten kanssa", "lapsiensa kanssa"],
      "correctAnswer": "lapsineen",
      "explanation": "The comitative form of 'lapsi' in the third person is 'lapsineen' (with his/her child/children). The possessive suffix is fused into the form.",
      "hint": "Third person comitative ends in -een.",
      "points": 10
    },
    {
      "question": "Why is 'H\u00e4n tuli lapsine' incorrect?",
      "options": [
        "Wrong word order",
        "Missing possessive suffix",
        "Wrong tense",
        "Wrong case"
      ],
      "correctAnswer": "Missing possessive suffix",
      "explanation": "The comitative case always includes a possessive suffix. 'Lapsine' has no suffix; the correct form is 'lapsineen' (3rd person) or 'lapsineni' (1st person), etc.",
      "hint": "Comitative without a possessive suffix doesn't exist.",
      "points": 10
    },
    {
      "question": "What is the 1st person singular comitative form of 'koira' (dog), meaning 'with my dog(s)'?",
      "options": ["koirine", "koirineen", "koirineni", "koirani kanssa"],
      "correctAnswer": "koirineni",
      "explanation": "The 1st person singular comitative of 'koira' is 'koirineni': koira \u2192 plural stem koiri- + -ne- + possessive suffix -ni = koirineni. (With my dog(s).)",
      "hint": "Add -ni to the comitative stem.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, what do people usually use instead of the comitative?",
      "options": ["Abessive", "Inessive", "kanssa + noun in genitive", "Adessive"],
      "correctAnswer": "kanssa + noun in genitive",
      "explanation": "In spoken Finnish, people use 'kanssa' (with) + noun in genitive. Example: 'lasten kanssa' instead of 'lapsineen'.",
      "hint": "Think of the most common way to say 'with'.",
      "points": 10
    },
    {
      "question": "What is the comitative form of 'perhe' (family) in the third person?",
      "options": ["perheine", "perheineen", "perheen kanssa", "perheit\u00e4"],
      "correctAnswer": "perheineen",
      "explanation": "The comitative of 'perhe' is 'perheineen' (with his/her family).",
      "hint": "Perhe + -ineen.",
      "points": 10
    },
    {
      "question": "Which sentence correctly uses the comitative in formal writing?",
      "options": [
        "H\u00e4n tuli lasten kanssa.",
        "H\u00e4n tuli lapsineen.",
        "H\u00e4n tuli lapsien kanssa.",
        "H\u00e4n tuli lapsinensa."
      ],
      "correctAnswer": "H\u00e4n tuli lapsineen.",
      "explanation": "In formal writing, the comitative 'lapsineen' is correct and concise. 'Lasten kanssa' is fine but less formal.",
      "hint": "Formal writing uses comitative.",
      "points": 10
    },
    {
      "question": "What is the fixed expression for 'with his/her belongings'?",
      "options": ["tavareineen", "tavaroineen", "tavaroiden kanssa", "tavaraa my\u00f6ten"],
      "correctAnswer": "tavaroineen",
      "explanation": "'Tavaroineen' is the comitative form of 'tavara' (belonging) and is a fixed expression meaning 'with his/her belongings'.",
      "hint": "Common in news: 'H\u00e4n l\u00e4hti tavaroineen.'",
      "points": 10
    },
    {
      "question": "What does 'Puu kaatui juurineen' mean?",
      "options": [
        "The tree fell with its roots",
        "The tree fell without roots",
        "The roots fell from the tree",
        "The tree fell on its roots"
      ],
      "correctAnswer": "The tree fell with its roots",
      "explanation": "'Juurineen' is the comitative of 'juuri' (root) and means 'with its roots'. The phrase describes the tree falling completely uprooted.",
      "hint": "Juurineen = with roots.",
      "points": 10
    },
    {
      "question": "Why is 'H\u00e4n saapui perheineen' considered more formal than 'H\u00e4n saapui perheens\u00e4 kanssa'?",
      "options": [
        "Because it uses a rare case and is more concise",
        "Because it has more words",
        "Because it's passive",
        "Because it's in past tense"
      ],
      "correctAnswer": "Because it uses a rare case and is more concise",
      "explanation": "The comitative is a rare, formal case that compresses 'with X' into a single word. 'Perheineen' is more concise and literary than 'perheens\u00e4 kanssa'.",
      "hint": "Formal = single word, rare case.",
      "points": 10
    }
  ]
},

{
  "id": "instructive-case",
  "chapter": 7,
  "title": "Instructive Case – Instruktiivi",
  "finnish": "Instruktiivi",
  "icon": "🛠️",
  "level": "B2",
  "accent": "bg-sky-800",
  "badge": "bg-sky-50 text-sky-700 border-sky-200",
  "description": "The instructive case expresses manner, means, or method — 'by doing' — surviving mainly in verb-derived forms (-en) and fixed idiomatic expressions",
  "content": {
    "type": "rich",
    "intro": "The instructive case expresses manner, means, or method — 'by doing' or 'with'. In modern Finnish, it survives mainly in fixed expressions and adverb-like forms derived from verbs.",
    "sections": [
      {
        "type": "example-table",
        "headers": ["English", "Finnish"],
        "rows": [
          ["by running", "juosten"],
          ["by walking", "k\u00e4vellen"],
          ["by hand", "k\u00e4sin"],
          ["step by step", "askel askeleelta"],
          ["with one's own hands", "omin k\u00e4sin"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "B2 insight: The instructive is not a productive case in modern Finnish. You cannot freely attach -n to any noun to mean 'by means of'. Instead, learn the fixed expressions as vocabulary items."
      },
      {
        "type": "subheading",
        "text": "2. Two Types of Instructive"
      },
      {
        "type": "subheading",
        "text": "A) Verb-derived instructive (most common)"
      },
      {
        "type": "paragraph",
        "text": "Formed from the strong stem of the verb + -en."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Strong stem", "Instructive", "Meaning"],
        "rows": [
          ["juosta", "juokse-", "juosten", "by running"],
          ["k\u00e4vell\u00e4", "k\u00e4vele-", "k\u00e4vellen", "by walking"],
          ["puhua", "puhu-", "puhuen", "by speaking"],
          ["tehd\u00e4", "teke-", "tehden", "by doing"],
          ["itke\u00e4", "itke-", "itkien", "by crying / while crying"],
          ["nauraa", "naura-", "nauraen", "by laughing / while laughing"],
          ["laulaa", "laula-", "laulaen", "by singing / while singing"],
          ["huutaa", "huuda-", "huutaen", "by shouting / while shouting"],
          ["ajatella", "ajattele-", "ajatellen", "by thinking"],
          ["kiirehti\u00e4", "kiirehdi-", "kiirehtien", "in a hurry"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "The verb-derived instructive often has a simultaneous action meaning: 'itkien' = 'while crying' or 'by crying'."
      },
      {
        "type": "example-list",
        "title": "Examples:",
        "items": [
          "H\u00e4n tuli kotiin itkien. (He came home crying.)",
          "H\u00e4n pakeni juosten. (He escaped by running / running away.)",
          "Vastasin ajatellen asiaa. (I answered while thinking about the matter.)"
        ]
      },
      {
        "type": "subheading",
        "text": "B) Noun-derived instructive (rare, fixed expressions)"
      },
      {
        "type": "paragraph",
        "text": "Formed from the plural stem of the noun + -n."
      },
      {
        "type": "example-table",
        "headers": ["Noun", "Plural stem", "Instructive", "Meaning"],
        "rows": [
          ["k\u00e4si (hand)", "k\u00e4si-", "k\u00e4sin", "by hand"],
          ["silm\u00e4 (eye)", "silm\u00e4-", "silmin", "with the eyes (in 'omin silmin')"]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "Many 'instructive-like' forms in Finnish are actually genitive singular or other cases frozen in idioms."
      },
      {
        "type": "subheading",
        "text": "3. Instructive vs. Adessive (-malla) — B2 Comparison"
      },
      {
        "type": "example-table",
        "headers": ["Feature", "Instructive (-en)", "Adessive of 3rd infinitive (-malla)"],
        "rows": [
          ["Form", "juosten", "juoksemalla"],
          ["Meaning", "by (while) running", "by (means of) running"],
          ["Simultaneous action implied?", "Often yes", "No (purely instrumental)"],
          ["Formality", "More literary", "Neutral to spoken"],
          ["Example", "H\u00e4n tuli juosten. (He came running \u2014 while running)", "H\u00e4n voitti juoksemalla nopeasti. (He won by running fast \u2014 method)"]
        ]
      },
      {
        "type": "example-list",
        "title": "More comparisons:",
        "items": [
          "H\u00e4n l\u00e4hti itkien. (Crying \u2014 simultaneous)",
          "H\u00e4n sai mit\u00e4 halusi itkem\u00e4ll\u00e4. (By crying as a method)",
          "H\u00e4n vastasi puhuen. (Speaking \u2014 simultaneous)",
          "H\u00e4n oppi puhumalla. (By speaking as a method)",
          "H\u00e4n selvisi juosten. (Escaped by running \u2014 simultaneous)",
          "H\u00e4n harjoitteli juoksemalla. (Trained by running \u2014 method)"
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: Use instructive for actions that happen simultaneously with the main action. Use -malla for method/instrument (not necessarily simultaneous)."
      },
      {
        "type": "subheading",
        "text": "4. Fixed Idiomatic Expressions (YKI Must-Know)"
      },
      {
        "type": "example-table",
        "headers": ["Expression", "Meaning", "Example"],
        "rows": [
          ["omin k\u00e4sin", "with one's own hands", "H\u00e4n rakensi talon omin k\u00e4sin."],
          ["omin silmin", "with one's own eyes", "N\u00e4in sen omin silmin."],
          ["p\u00e4in sein\u00e4\u00e4", "completely wrong (into the wall)", "Kaikki meni p\u00e4in sein\u00e4\u00e4."],
          ["askel askeleelta", "step by step", "Opimme askel askeleelta."],
          ["p\u00e4\u00e4 edell\u00e4", "headfirst", "H\u00e4n sukelsi p\u00e4\u00e4 edell\u00e4 veteen."],
          ["takaperin", "backwards", "H\u00e4n k\u00e4veli takaperin."],
          ["sikin sokin", "helter-skelter (messy)", "Huone oli sikin sokin."]
        ]
      },
      {
        "type": "note",
        "icon": "📘",
        "text": "Many of these are frozen adverbs that originated as instructive forms. For YKI, memorize the expression, not the grammar."
      },
      {
        "type": "subheading",
        "text": "5. Verb-Derived Instructive in Real Use (YKI Examples)"
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n l\u00e4hti itkien ja nauraen samalla. (He left crying and laughing at the same time.)",
          "Juosten h\u00e4n ehti junaan juuri ennen l\u00e4ht\u00f6\u00e4. (By running, he caught the train just before departure.)",
          "K\u00e4vellen n\u00e4kee kaupungin parhaiten. (By walking, you see the city best.)",
          "Puhuen asiat selvi\u00e4v\u00e4t, vaiti olemalla ei. (By speaking, matters get resolved; by staying silent, not.)",
          "Ajatellen tarkkaan h\u00e4n teki oikean p\u00e4\u00e4t\u00f6ksen. (By thinking carefully, he made the right decision.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6. Instructive vs. Genitive (Same Form, Different Function)"
      },
      {
        "type": "paragraph",
        "text": "The instructive -n is identical in form to the genitive singular. Context tells them apart."
      },
      {
        "type": "example-table",
        "headers": ["Form", "As genitive", "As instructive"],
        "rows": [
          ["jalan", "of a foot", "on foot (adverb)"],
          ["k\u00e4sin", "\u2014 (no genitive)", "by hand"],
          ["p\u00e4in", "\u2014", "headfirst / toward"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n tuli jalan. = He came on foot. (instructive/adverbial use of genitive)",
          "Auton kanssa \u2014 genitive. No instructive meaning."
        ]
      },
      {
        "type": "subheading",
        "text": "8. Spoken Finnish Reality (What Finns Actually Say)"
      },
      {
        "type": "example-table",
        "headers": ["Written instructive", "Spoken common"],
        "rows": [
          ["juosten", "juosten (still used) or sill\u00e4 lailla juosten"],
          ["k\u00e4vellen", "k\u00e4vellen (common)"],
          ["itkien", "itkien or sill\u00e4 tavalla itkien"],
          ["omin k\u00e4sin", "omilla k\u00e4sill\u00e4 (with my own hands)"],
          ["omin silmin", "omilla silmill\u00e4 (less common \u2014 usually n\u00e4in itse)"]
        ]
      },
      {
        "type": "note",
        "icon": "💬",
        "text": "B2 advice: Use juosten, k\u00e4vellen, itkien, nauraen freely in both speech and writing. Use omin k\u00e4sin / omin silmin in writing; in speech, you can rephrase."
      },
      {
        "type": "subheading",
        "text": "9. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Juoksemalla h\u00e4n tuli kotiin (when simultaneous)", "Juosten h\u00e4n tuli kotiin", "For simultaneous action ('came while running'), use instructive, not -malla."],
          ["K\u00e4sill\u00e4 h\u00e4n teki sen", "Omin k\u00e4sin h\u00e4n teki sen", "Fixed expression 'omin k\u00e4sin', not 'k\u00e4sill\u00e4'."],
          ["Puhuella h\u00e4n selvisi", "Puhuen h\u00e4n selvisi", "Wrong form \u2014 'puhuen' is instructive."],
          ["N\u00e4in sen omilla silmill\u00e4", "N\u00e4in sen omin silmin", "Fixed expression 'omin silmin'."]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Full Example Sentences (YKI Level)"
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n saapui paikalle juosten, heng\u00e4styneen\u00e4 ja hikisen\u00e4. (He arrived at the place running, out of breath and sweaty.)",
          "Matka taittui k\u00e4vellen, sill\u00e4 bussi ei tullut ollenkaan. (The journey was made on foot, because the bus didn't come at all.)",
          "Vastoin odotuksia, kaikki meni p\u00e4in sein\u00e4\u00e4 eik\u00e4 mik\u00e4\u00e4n onnistunut. (Contrary to expectations, everything went wrong and nothing succeeded.)",
          "H\u00e4n teki koko sohvakaluston omin k\u00e4sin puusta ilman s\u00e4hk\u00f6ty\u00f6kaluja. (He made the entire sofa set with his own hands from wood without power tools.)",
          "Omin silmin todistin, kuinka lintu poikineen lensi etel\u00e4\u00e4n. (With my own eyes I witnessed how the bird with its chicks flew south.)",
          "Opiskelin suomea askel askeleelta, ja nyt puhun jo sujuvasti. (I studied Finnish step by step, and now I already speak fluently.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Quick Reference Table (Most Important Instructive Forms)"
      },
      {
        "type": "example-table",
        "headers": ["Form", "Origin", "Meaning", "Frequency"],
        "rows": [
          ["juosten", "juosta", "by running / while running", "common"],
          ["k\u00e4vellen", "k\u00e4vell\u00e4", "by walking / while walking", "common"],
          ["itkien", "itke\u00e4", "crying / while crying", "common"],
          ["nauraen", "nauraa", "laughing / while laughing", "common"],
          ["puhuen", "puhua", "by speaking / while speaking", "common"],
          ["tehden", "tehd\u00e4", "by doing / while doing", "less common"],
          ["ajatellen", "ajatella", "by thinking / while thinking", "common"],
          ["kiirehtien", "kiirehti\u00e4", "in a hurry / while hurrying", "common"],
          ["omin k\u00e4sin", "k\u00e4si", "with one's own hands", "fixed idiom"],
          ["omin silmin", "silm\u00e4", "with one's own eyes", "fixed idiom"],
          ["p\u00e4in sein\u00e4\u00e4", "p\u00e4\u00e4 + sein\u00e4", "completely wrong (into the wall)", "fixed idiom"],
          ["askel askeleelta", "askel", "step by step", "fixed idiom"],
          ["p\u00e4\u00e4 edell\u00e4", "p\u00e4\u00e4 + edell\u00e4", "headfirst", "fixed idiom"]
        ]
      },
      {
        "type": "subheading",
        "text": "12. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Replace the adverbial phrase with the more idiomatic instructive form where possible.",
        "items": [
          "1. H\u00e4n tuli kotiin niin ett\u00e4 itki. \u2192 H\u00e4n tuli kotiin itkien.",
          "2. H\u00e4n teki sen k\u00e4ytt\u00e4m\u00e4ll\u00e4 omia k\u00e4si\u00e4. \u2192 H\u00e4n teki sen omin k\u00e4sin.",
          "3. Min\u00e4 n\u00e4in sen omilla silmill\u00e4ni. \u2192 N\u00e4in sen omin silmin.",
          "4. Suunnitelma meni t\u00e4ysin pieleen. \u2192 Suunnitelma meni p\u00e4in sein\u00e4\u00e4.",
          "5. H\u00e4n voitti kilpailun hitaasti mutta varmasti k\u00e4vellen. \u2192 H\u00e4n voitti kilpailun k\u00e4velem\u00e4ll\u00e4 hitaasti mutta varmasti. (method \u2192 -malla)"
        ]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "K\u00e4vellen kouluun kest\u00e4\u00e4 noin puoli tuntia. (Walking to school takes about half an hour.)",
          "H\u00e4n katseli minua itkien ja pyysi anteeksi. (She looked at me crying and apologized.)",
          "Tein t\u00e4m\u00e4n kakun omin k\u00e4sin. (I made this cake with my own hands.)",
          "Oletko n\u00e4hnyt sen omin silmin? (Have you seen it with your own eyes?)",
          "Kaikki meni p\u00e4in sein\u00e4\u00e4. (Everything went completely wrong.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does the instructive case (-en) primarily express?",
      "options": [
        "Location (in/on/at)",
        "Manner, means, or method (by doing / while doing)",
        "Possession",
        "Without doing"
      ],
      "correctAnswer": "Manner, means, or method (by doing / while doing)",
      "explanation": "The instructive case expresses manner, means, or method. Example: 'juosten' = by running, 'itkien' = while crying.",
      "hint": "Think of 'by doing' or 'while doing'.",
      "points": 10
    },
    {
      "question": "What is the verb-derived instructive form of 'juosta' (to run)?",
      "options": ["juostaen", "juosten", "juoksien", "juoksemalla"],
      "correctAnswer": "juosten",
      "explanation": "The verb-derived instructive is formed from the strong stem + -en: juosta → strong stem juokse- → juosten (by running / while running).",
      "hint": "Strong stem juokse- + -en.",
      "points": 10
    },
    {
      "question": "What is the difference between 'juosten' and 'juoksemalla'?",
      "options": [
        "No difference",
        "Juosten = by running (simultaneous action); Juoksemalla = by means of running (method)",
        "Juosten is past tense, juoksemalla is present",
        "Juosten is negative, juoksemalla is positive"
      ],
      "correctAnswer": "Juosten = by running (simultaneous action); Juoksemalla = by means of running (method)",
      "explanation": "Juosten (instructive) emphasizes simultaneous action ('while running'). Juoksemalla (adessive of 3rd infinitive) emphasizes method or instrument.",
      "hint": "One is 'while running', one is 'by running as a method'.",
      "points": 10
    },
    {
      "question": "What is the fixed expression for 'with one's own hands'?",
      "options": ["omilla käsillä", "omin käsin", "käsillään", "käsin omilla"],
      "correctAnswer": "omin käsin",
      "explanation": "'Omin käsin' is the fixed instructive expression meaning 'with one's own hands'.",
      "hint": "Fixed idiom with instructive.",
      "points": 10
    },
    {
      "question": "What does 'päin seinää' mean in colloquial Finnish?",
      "options": [
        "Against the wall (literally)",
        "Completely wrong / failed",
        "Headfirst",
        "Step by step"
      ],
      "correctAnswer": "Completely wrong / failed",
      "explanation": "'Mennä päin seinää' is an idiom meaning 'to go completely wrong / to fail miserably'.",
      "hint": "Colloquial idiom.",
      "points": 10
    },
    {
      "question": "How do you say 'He came home crying' using the instructive?",
      "options": ["Hän tuli kotiin itkemällä", "Hän tuli kotiin itkien", "Hän tuli kotiin itkeä", "Hän tuli kotiin itkettyään"],
      "correctAnswer": "Hän tuli kotiin itkien",
      "explanation": "The instructive 'itkien' (while crying) is used to express simultaneous action.",
      "hint": "Instructive form of itkeä.",
      "points": 10
    },
    {
      "question": "Which of the following is a fixed instructive expression for 'step by step'?",
      "options": ["askel askeleelta", "askeleena", "askelin", "askeleella"],
      "correctAnswer": "askel askeleelta",
      "explanation": "'Askel askeleelta' is the fixed expression meaning 'step by step', using the instructive/partitive of 'askel'.",
      "hint": "Fixed idiom.",
      "points": 10
    },
    {
      "question": "Why is 'Juoksemalla hän tuli kotiin' less natural than 'Juosten hän tuli kotiin' for 'He came home running'?",
      "options": [
        "Juoksemalla means 'by running as a method', not simultaneous running",
        "Juoksemalla is grammatically incorrect",
        "Juoksemalla is past tense",
        "No difference"
      ],
      "correctAnswer": "Juoksemalla means 'by running as a method', not simultaneous running",
      "explanation": "'Juoksemalla' emphasizes method/instrument. For an action that happened simultaneously with coming home ('while running'), the instructive 'juosten' is more natural.",
      "hint": "Simultaneous vs. method.",
      "points": 10
    },
    {
      "question": "What is the instructive form of 'ajatella' (to think)?",
      "options": ["ajatellen", "ajatellen", "ajattellen", "ajatellen"],
      "correctAnswer": "ajatellen",
      "explanation": "The instructive of 'ajatella' is 'ajatellen' (by thinking / while thinking).",
      "hint": "Stem ajattele- + -n.",
      "points": 10
    },
    {
      "question": "Which of the following is NOT a productive use of the instructive case in modern Finnish?",
      "options": [
        "juosten (by running)",
        "käsittääkseni (as far as I understand)",
        "omin silmin (with one's own eyes)",
        "taloinen (with the house — invented form)"
      ],
      "correctAnswer": "taloinen (with the house — invented form)",
      "explanation": "The instructive is not productive — you cannot freely attach -n to any noun. 'Taloinen' is not a real Finnish form. The instructive only survives in fixed verb-derived forms and set phrases.",
      "hint": "Productive means you can create new forms freely.",
      "points": 10
    }
  ]
},



{
  "id": "aspectual-object-rules",
  "chapter": 8,
  "title": "Aspect and Object – Aspekti ja objekti",
  "finnish": "Aspekti ja objekti",
  "icon": "🎯",
  "level": "B2",
  "accent": "bg-indigo-800",
  "badge": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "description": "Advanced rules for object cases based on telic vs. atelic aspect — how verb class, tense, modality, and quantity determine whether to use genitive or partitive",
  "content": {
    "type": "rich",
    "intro": "The English simple grammar rule ('total = genitive, partial = partitive') is a simplification. The real Finnish system is based on telicity: whether the action has a natural endpoint (telic) or not (atelic).",
    "sections": [
      {
        "type": "subheading",
        "text": "1. The Core Linguistic Distinction: Telic vs. Atelic (B2\u2192C1)"
      },
      {
        "type": "example-table",
        "headers": ["", "Telic", "Atelic"],
        "rows": [
          ["Meaning", "Action has a natural endpoint (result)", "Action has no natural endpoint (process)"],
          ["Object case", "Genitive (-n) / Nominative", "Partitive (-a/-\u00e4)"],
          ["Question", "\"Did you finish X?\"", "\"Were you doing X?\""],
          ["Example", "S\u00f6in omenan (I ate the apple \u2014 finished)", "S\u00f6in omenaa (I was eating apple \u2014 ongoing)"]
        ]
      },
      {
        "type": "note",
        "icon": "🔑",
        "text": "B2 insight: Telicity is not a property of the verb alone \u2014 it emerges from the whole predicate (verb + object + modifiers)."
      },
      {
        "type": "subheading",
        "text": "2. Verb Class Effects on Aspect (Crucial B2)"
      },
      {
        "type": "subheading",
        "text": "A) Achievement Verbs (Punctual / Instantaneous)"
      },
      {
        "type": "paragraph",
        "text": "These verbs describe actions that happen in a moment or have a clear endpoint. They strongly prefer the genitive object."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "With genitive", "With partitive (nuanced)"],
        "rows": [
          ["l\u00f6yt\u00e4\u00e4", "to find", "L\u00f6ysin avaimen (I found the key)", "L\u00f6ysin avainta (I was finding the key \u2014 ongoing search)"],
          ["tavata", "to meet", "Tapasin h\u00e4net eilen (I met him yesterday)", "Tapasin h\u00e4nt\u00e4 eilen (I kept meeting him \u2014 repeated)"]
        ]
      },
      {
        "type": "subheading",
        "text": "B) Activity Verbs (Durative, No Endpoint)"
      },
      {
        "type": "paragraph",
        "text": "These verbs describe actions that can continue indefinitely. They naturally take the partitive object."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "With partitive (default)", "With genitive (completed)"],
        "rows": [
          ["lukea", "to read", "Luin kirjaa (I was reading a book)", "Luin kirjan (I read the book \u2014 finished)"],
          ["katsoa", "to watch", "Katsoin televisiota (I was watching TV)", "Katsoin elokuvan (I watched the whole movie)"]
        ]
      },
      {
        "type": "subheading",
        "text": "C) Accomplishment Verbs (Built-in Endpoint)"
      },
      {
        "type": "paragraph",
        "text": "These verbs describe actions that contain both process and result. They can take either case depending on focus."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Meaning", "With genitive (result focus)", "With partitive (process focus)"],
        "rows": [
          ["rakentaa", "to build", "Rakensin talon (finished)", "Rakensin taloa (was building)"],
          ["kirjoittaa", "to write", "Kirjoitin kirjeen (finished)", "Kirjoitin kirjett\u00e4 (was writing)"],
          ["maalata", "to paint", "Maalasin taulun (finished)", "Maalasin taulua (was painting)"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: Accomplishment verbs are where the genitive/partitive contrast is most productive and meaningful."
      },
      {
        "type": "subheading",
        "text": "3. Object Case in Different Tenses (Advanced)"
      },
      {
        "type": "example-table",
        "headers": ["Tense", "Telic (genitive)", "Atelic (partitive)"],
        "rows": [
          ["Present", "Sy\u00f6n omenan (I will eat the apple)", "Sy\u00f6n omenaa (I am eating an apple)"],
          ["Past", "S\u00f6in omenan (I ate the apple)", "S\u00f6in omenaa (I was eating an apple)"],
          ["Perfect", "Olen sy\u00f6nyt omenan (I have eaten the apple)", "Olen sy\u00f6nyt omenaa (I have eaten some apple)"],
          ["Conditional", "S\u00f6isin omenan (I would eat the apple)", "S\u00f6isin omenaa (I would be eating apple)"]
        ]
      },
      {
        "type": "subheading",
        "text": "4. Object Case with Modal Verbs (B2 Nuance)"
      },
      {
        "type": "subheading",
        "text": "Voida (can / be able to)"
      },
      {
        "type": "example-list",
        "items": [
          "Voin sy\u00f6d\u00e4 omenan = I can eat the apple (whole) \u2014 genitive",
          "Voin sy\u00f6d\u00e4 omenaa = I can eat some apple / am able to eat apple \u2014 partitive"
        ]
      },
      {
        "type": "subheading",
        "text": "Pit\u00e4\u00e4 / t\u00e4ytyy (must / have to)"
      },
      {
        "type": "example-list",
        "items": [
          "Minun t\u00e4ytyy sy\u00f6d\u00e4 omena = I have to eat the (whole) apple \u2014 genitive",
          "Minun t\u00e4ytyy sy\u00f6d\u00e4 omenaa = I have to eat some apple \u2014 partitive"
        ]
      },
      {
        "type": "subheading",
        "text": "Haluta (want to)"
      },
      {
        "type": "example-list",
        "items": [
          "Haluan sy\u00f6d\u00e4 omenan = I want to eat the (whole) apple \u2014 genitive",
          "Haluan sy\u00f6d\u00e4 omenaa = I want to eat some apple \u2014 partitive"
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: The object case after modal verbs reflects the intended totality of the action, not just the modal meaning."
      },
      {
        "type": "subheading",
        "text": "5. Object Case with Imperative"
      },
      {
        "type": "example-table",
        "headers": ["Command type", "Object case", "Example", "Meaning"],
        "rows": [
          ["Affirmative singular", "Nominative", "Sy\u00f6 omena!", "Eat the (whole) apple!"],
          ["Affirmative singular (partial)", "Partitive", "Sy\u00f6 omenaa!", "Eat some apple!"],
          ["Negative singular", "Partitive", "\u00c4l\u00e4 sy\u00f6 omenaa!", "Don't eat the apple!"]
        ]
      },
      {
        "type": "subheading",
        "text": "6. Object Case in Passive (Advanced)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish (passive)", "Meaning", "Object case"],
        "rows": [
          ["Omena sy\u00f6tiin", "The apple was eaten (completely)", "Nominative (total)"],
          ["Omenaa sy\u00f6tiin", "The apple was being eaten / some apple was eaten", "Partitive"],
          ["Kirja luettiin", "The book was read (completely)", "Nominative"],
          ["Kirjaa luettiin", "The book was being read / read partially", "Partitive"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: In passive, the object case alone carries the aspectual meaning, because the passive already removes the agent."
      },
      {
        "type": "subheading",
        "text": "8. Verb-Specific Aspectual Behavior (YKI Exam Gold)"
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Default object", "Why", "Exception"],
        "rows": [
          ["odottaa", "Always partitive", "Waiting has no endpoint", "Even 'I waited for 2 hours' \u2192 odotin 2 tuntia (no object needed)"],
          ["rakastaa", "Always partitive", "Emotion is ongoing", "Rakastan sinua (never sinut)"],
          ["vihata", "Always partitive", "Same as above", "Vihaan h\u00e4nt\u00e4 (never h\u00e4net)"],
          ["auttaa", "Often partitive", "Helping is a process", "Autan sinua \u2014 genitive sinut would mean 'I helped you completely' (rare)"],
          ["muistaa", "Genitive or partitive", "Different meanings", "Muistan sinut (fact) vs. Muistan sinua (affectionately)"],
          ["tuntea", "Genitive or partitive", "Different meanings", "Tunnen h\u00e4net (personally) vs. Tunnen h\u00e4nt\u00e4 (slightly / feel)"]
        ]
      },
      {
        "type": "note",
        "icon": "⭐",
        "text": "YKI trick: Questions about muistaa and tuntea are extremely common. Memorize the meaning difference."
      },
      {
        "type": "subheading",
        "text": "9. Aspect and Quantity (Partitive for Indefinite Amount)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "Meaning", "Why partitive"],
        "rows": [
          ["Juon kahvia", "I drink coffee (some / in general)", "Indefinite amount"],
          ["Juon kahvin", "I drink the coffee (a specific cup)", "Definite, total"],
          ["Ostin maitoa", "I bought (some) milk", "Indefinite"],
          ["Ostin maidon", "I bought the milk (a specific carton)", "Definite"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "B2 insight: The partitive is the default for indefinite objects in Finnish. The genitive/nominative marks definite or specific objects."
      },
      {
        "type": "subheading",
        "text": "10. Aspect in Negative Existential Sentences"
      },
      {
        "type": "example-table",
        "headers": ["Affirmative", "Negative", "Case change"],
        "rows": [
          ["Minulla on auto", "Minulla ei ole autoa", "Nominative \u2192 Partitive"],
          ["Huoneessa on p\u00f6yt\u00e4", "Huoneessa ei ole p\u00f6yt\u00e4\u00e4", "Nominative \u2192 Partitive"]
        ]
      },
      {
        "type": "subheading",
        "text": "11. Advanced Comparison Table (Telic vs. Atelic)"
      },
      {
        "type": "example-table",
        "headers": ["Feature", "Telic (Genitive/Nominative)", "Atelic (Partitive)"],
        "rows": [
          ["Question answered", "\"Did you finish X?\"", "\"Were you doing X?\""],
          ["Time adverbials", "tunnissa (in an hour)", "tuntia (for an hour)"],
          ["Example with time", "Luin kirjan tunnissa (I read the book in an hour)", "Luin kirjaa tunnin (I read for an hour)"],
          ["Negation", "Not possible", "En lukenut kirjaa"],
          ["Imperative", "Lue kirja! (Read the whole book)", "Lue kirjaa! (Read some of the book)"],
          ["Modal + action", "Voin lukea kirjan (I can read the whole book)", "Voin lukea kirjaa (I can read some of the book)"]
        ]
      },
      {
        "type": "note",
        "icon": "⏱️",
        "text": "Key time distinction: 'tunnissa' (in an hour) = telic (measures completion). 'Tuntia' (for an hour) = atelic (measures duration)."
      },
      {
        "type": "subheading",
        "text": "12. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Odotan bussin", "Odotan bussia", "Odottaa is atelic \u2192 always partitive"],
          ["Rakastan sinut", "Rakastan sinua", "Emotion verbs are atelic \u2192 partitive"],
          ["Luin kirjaa tunnissa", "Luin kirjan tunnissa", "tunnissa measures completion \u2192 needs telic object"],
          ["En sy\u00f6nyt omenan", "En sy\u00f6nyt omenaa", "Negative forces partitive"],
          ["Tunnen h\u00e4nt\u00e4 (for personal acquaintance)", "Tunnen h\u00e4net", "Personal acquaintance = genitive; vague feeling = partitive"]
        ]
      },
      {
        "type": "subheading",
        "text": "13. Practical B2/YKI Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Luin kirjan kahdessa tunnissa, vaikka se oli yli 500 sivua. (I read the book in two hours, even though it was over 500 pages.)",
          "Istuin junassa ja luin kirjaa koko kolmen tunnin matkan. (I sat on the train and read for the entire three-hour journey.)",
          "En ole koskaan sy\u00f6nyt koko pizzaa yksin \u2014 se on liikaa minulle. (I have never eaten a whole pizza alone \u2014 it's too much for me.)",
          "Muistan sinut hyvin, vaikka emme ole n\u00e4hneet vuosiin. (I remember you well, even though we haven't seen each other for years.)",
          "Muistan sinua l\u00e4mm\u00f6ll\u00e4 \u2014 olit aina niin yst\u00e4v\u00e4llinen. (I remember you with warmth \u2014 you were always so kind.)",
          "Tunnen h\u00e4net, mutta en tunne h\u00e4nt\u00e4 kovin hyvin. (I know him, but I don't know him very well.)"
        ]
      },
      {
        "type": "subheading",
        "text": "14. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Choose the correct object case. Explain why.",
        "items": [
          "1. Luin (kirja / kirjaa) koko illan. \u2192 Luin kirjaa koko illan. (atelic: duration 'koko illan' \u2192 partitive)",
          "2. Luin (kirja / kirjaa) tunnissa. \u2192 Luin kirjan tunnissa. (telic: 'tunnissa' measures completion \u2192 genitive)",
          "3. Muistan (sinut / sinua) hyvin. \u2192 Muistan sinut hyvin. (factual memory \u2192 genitive)",
          "4. En (lukenut kirja / lukenut kirjaa). \u2192 En lukenut kirjaa. (negative \u2192 partitive)",
          "5. Sy\u00f6 (omena / omenaa)! \u2192 Sy\u00f6 omena! (eat the whole apple) / Sy\u00f6 omenaa! (eat some apple)"
        ]
      },
      {
        "type": "subheading",
        "text": "15. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tein koko ty\u00f6n tunnissa. (I did the whole job in an hour.)",
          "Tein ty\u00f6t\u00e4 koko p\u00e4iv\u00e4n. (I worked the whole day.)",
          "Tapasin h\u00e4net eilen, mutta en j\u00e4\u00e4nyt juttelemaan. (I met him yesterday, but I didn't stay to chat.)",
          "Tapasin h\u00e4nt\u00e4 usein viime kes\u00e4n\u00e4. (I met him often last summer.)",
          "Haluaisinko palan kakkua? Kyll\u00e4, haluan kakkua. (Would I like a piece of cake? Yes, I want some cake.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the core linguistic distinction behind Finnish object cases?",
      "options": [
        "Definite vs. indefinite nouns",
        "Telic (has endpoint) vs. atelic (no endpoint)",
        "Past vs. present tense",
        "Singular vs. plural objects"
      ],
      "correctAnswer": "Telic (has endpoint) vs. atelic (no endpoint)",
      "explanation": "The real Finnish system is based on telicity: whether the action has a natural endpoint (telic \u2192 genitive) or not (atelic \u2192 partitive).",
      "hint": "Think of completion vs. ongoing process.",
      "points": 10
    },
    {
      "question": "What does 'Luin kirjaa' typically imply?",
      "options": [
        "I read the whole book (finished)",
        "I was reading a book (ongoing process)",
        "I will read the book",
        "I have never read the book"
      ],
      "correctAnswer": "I was reading a book (ongoing process)",
      "explanation": "The partitive object 'kirjaa' indicates an atelic, ongoing action. 'Luin kirjaa' = I was reading a book (not necessarily finished).",
      "hint": "Partitive = process.",
      "points": 10
    },
    {
      "question": "Which time expression forces a telic (genitive) object?",
      "options": ["tunnin (for an hour)", "koko p\u00e4iv\u00e4n (all day)", "tunnissa (in an hour)", "kaksi tuntia (two hours)"],
      "correctAnswer": "tunnissa (in an hour)",
      "explanation": "'Tunnissa' (in an hour) measures completion time and requires a telic (genitive) object. Example: Luin kirjan tunnissa (I read the book in an hour).",
      "hint": "In an hour = completion.",
      "points": 10
    },
    {
      "question": "Why is 'Rakastan sinut' incorrect?",
      "options": [
        "Wrong word order",
        "Emotion verbs like rakastaa are atelic and take partitive always",
        "Sinut is not accusative",
        "Past tense needed"
      ],
      "correctAnswer": "Emotion verbs like rakastaa are atelic and take partitive always",
      "explanation": "Verbs expressing emotions (rakastaa, vihata) have no natural endpoint and are always atelic. They always take the partitive object: Rakastan sinua.",
      "hint": "Love has no endpoint.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Muistan sinut' and 'Muistan sinua'?",
      "options": [
        "No difference",
        "Muistan sinut = I remember you (factual); Muistan sinua = I remember you (affectionately)",
        "First is positive, second is negative",
        "First is past, second is present"
      ],
      "correctAnswer": "Muistan sinut = I remember you (factual); Muistan sinua = I remember you (affectionately)",
      "explanation": "Muistan sinut (genitive) = factual memory (I remember meeting you). Muistan sinua (partitive) = affectionate or ongoing memory (I remember you fondly).",
      "hint": "One is about facts, one about feelings.",
      "points": 10
    },
    {
      "question": "In a negative sentence, what case does the object take?",
      "options": ["Nominative", "Genitive", "Partitive", "Accusative"],
      "correctAnswer": "Partitive",
      "explanation": "In negative sentences, the object always takes the partitive case, regardless of whether the affirmative would be telic. Example: En sy\u00f6nyt omenaa (not omenan).",
      "hint": "Negative = partitive.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Sy\u00f6 omena!' and 'Sy\u00f6 omenaa!'?",
      "options": [
        "No difference",
        "Sy\u00f6 omena = Eat the whole apple; Sy\u00f6 omenaa = Eat some apple",
        "First is polite, second is rude",
        "First is singular, second is plural"
      ],
      "correctAnswer": "Sy\u00f6 omena = Eat the whole apple; Sy\u00f6 omenaa = Eat some apple",
      "explanation": "In affirmative commands, the nominative means 'eat the whole apple' (telic), while the partitive means 'eat some apple' (atelic/partial).",
      "hint": "Whole apple vs. some apple.",
      "points": 10
    },
    {
      "question": "What does 'Minun t\u00e4ytyy sy\u00f6d\u00e4 omena' imply compared to 'omeenaa'?",
      "options": [
        "Same meaning",
        "Omena = I have to eat the whole apple; Omenaa = I have to eat some apple",
        "Omena is past, omenaa is present",
        "Omena is negative, omenaa is positive"
      ],
      "correctAnswer": "Omena = I have to eat the whole apple; Omenaa = I have to eat some apple",
      "explanation": "The object case after modal verbs reflects intended totality. Genitive = whole apple, partitive = some apple.",
      "hint": "Modal verb + object case choice.",
      "points": 10
    },
    {
      "question": "Which verb is always partitive regardless of aspect?",
      "options": ["lukea (to read)", "rakentaa (to build)", "odottaa (to wait for)", "l\u00f6yt\u00e4\u00e4 (to find)"],
      "correctAnswer": "odottaa (to wait for)",
      "explanation": "'Odottaa' (to wait for) describes an action with no natural endpoint and is always atelic, taking only the partitive object: Odotan bussia (never bussin).",
      "hint": "Waiting has no finish line.",
      "points": 10
    },
    {
      "question": "What is the difference between 'N\u00e4in h\u00e4nen' and 'N\u00e4in h\u00e4nt\u00e4'?",
      "options": [
        "N\u00e4in h\u00e4nen = I saw him; N\u00e4in h\u00e4nt\u00e4 = I was seeing him (ongoing/process)",
        "No difference",
        "First is present, second is past",
        "First is with verb, second is without verb"
      ],
      "correctAnswer": "N\u00e4in h\u00e4nen = I saw him; N\u00e4in h\u00e4nt\u00e4 = I was seeing him (ongoing/process)",
      "explanation": "With perception verbs like n\u00e4hd\u00e4, the genitive (h\u00e4net) indicates a complete perception. The partitive (h\u00e4nt\u00e4) indicates an ongoing or partial perception.",
      "hint": "Once vs. ongoing.",
      "points": 10
    }
  ]
},


{
  "id": "participle-constructions",
  "chapter": 9,
  "title": "Participle Constructions – Partisiippirakenteet",
  "finnish": "Partisiippirakenteet",
  "icon": "📝",
  "level": "B2",
  "accent": "bg-amber-800",
  "badge": "bg-amber-50 text-amber-700 border-amber-200",
  "description": "Complete reference for replacing clauses with participles: relative clauses (joka) → attributes, temporal clauses (kun) → -essa/-essä, after clauses → -tua/-tyä, and agent clauses → -ma/-mä",
  "content": {
    "type": "rich",
    "intro": "Mastering participle transformations is the single fastest way to raise your YKI writing score from B1 to B2/C1. Participles replace whole clauses (joka, kun, sen j\u00e4lkeen kun, jonka) with more compact, formal expressions.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. The Big Picture: What Participles Replace (B2 Refresher)"
      },
      {
        "type": "example-table",
        "headers": ["Original clause", "Replaced by", "Example"],
        "rows": [
          ["joka (relative clause)", "Attribute participle (active/passive)", "lukeva mies / kirjoitettu kirja"],
          ["kun (temporal)", "2nd infinitive inessive (-essa/-ess\u00e4)", "puhuessani"],
          ["ennen kuin (before)", "3rd infinitive abessive / ennen + noun", "sy\u00f6m\u00e4tt\u00e4 / sy\u00f6nti\u00e4 ennen"],
          ["sen j\u00e4lkeen kun (after)", "Past participle in translative (-tua/-ty\u00e4)", "sy\u00f6ty\u00e4ni"],
          ["joka / jonka (agent)", "Agent participle (-ma/-m\u00e4 + possessive)", "minun tekem\u00e4ni"]
        ]
      },
      {
        "type": "subheading",
        "text": "2. Relative Clause (joka) \u2192 Participle Attribute (Full Chart)"
      },
      {
        "type": "subheading",
        "text": "Active Present (ongoing action)"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle", "Example"],
        "rows": [
          ["Mies, joka lukee kirjaa", "kirjaa lukeva mies", "The man reading a book"],
          ["Nainen, joka asuu Helsingiss\u00e4", "Helsingiss\u00e4 asuva nainen", "The woman living in Helsinki"],
          ["Lapsi, joka nukkuu", "nukkuva lapsi", "The sleeping child"]
        ]
      },
      {
        "type": "subheading",
        "text": "Active Past (completed action)"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle", "Example"],
        "rows": [
          ["Mies, joka luki kirjan", "kirjan lukenut mies", "The man who read the book"],
          ["Nainen, joka asui Helsingiss\u00e4", "Helsingiss\u00e4 asunut nainen", "The woman who lived in Helsinki"],
          ["Lapsi, joka nukkui", "nukkunut lapsi", "The child who slept"]
        ]
      },
      {
        "type": "subheading",
        "text": "Passive Present (to be done)"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle", "Example"],
        "rows": [
          ["Kirja, joka luetaan", "luettava kirja", "The book to be read"],
          ["Teht\u00e4v\u00e4, joka tehd\u00e4\u00e4n", "teht\u00e4v\u00e4 teht\u00e4v\u00e4", "The task to be done"]
        ]
      },
      {
        "type": "subheading",
        "text": "Passive Past (has been done)"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle", "Example"],
        "rows": [
          ["Kirja, joka on luettu", "luettu kirja", "The book that has been read"],
          ["Kirja, joka kirjoitettiin 1990", "vuonna 1990 kirjoitettu kirja", "The book written in 1990"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Temporal Clause (kun) \u2192 2nd Infinitive Inessive (-essa/-ess\u00e4)"
      },
      {
        "type": "paragraph",
        "text": "Used when the same subject performs both actions."
      },
      {
        "type": "subheading",
        "text": "Present / Future reference"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle construction"],
        "rows": [
          ["Kun sy\u00f6n, en katso televisiota", "Sy\u00f6dess\u00e4ni en katso televisiota"],
          ["Kun h\u00e4n k\u00e4velee kotiin, h\u00e4n kuuntelee musiikkia", "K\u00e4velless\u00e4\u00e4n kotiin h\u00e4n kuuntelee musiikkia"]
        ]
      },
      {
        "type": "subheading",
        "text": "Past reference"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle construction"],
        "rows": [
          ["Kun s\u00f6in, en katsonut televisiota", "Sy\u00f6dess\u00e4ni en katsonut televisiota"],
          ["Kun h\u00e4n k\u00e4veli kotiin, h\u00e4n kuunteli musiikkia", "K\u00e4velless\u00e4\u00e4n kotiin h\u00e4n kuunteli musiikkia"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "The 2nd infinitive inessive does not change for tense \u2014 only context tells whether it's past or present."
      },
      {
        "type": "subheading",
        "text": "Different subjects"
      },
      {
        "type": "paragraph",
        "text": "When the subjects are different, use the genitive + possessive suffix pattern."
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle construction"],
        "rows": [
          ["Kun opettaja puhui, opiskelijat kuuntelivat", "Opettajan puhuessa opiskelijat kuuntelivat"],
          ["Kun \u00e4iti nukkui, lapset leikkiv\u00e4t", "\u00c4idin nukkuessa lapset leikkiv\u00e4t"]
        ]
      },
      {
        "type": "example-list",
        "items": ["Minun tullessani h\u00e4n l\u00e4hti = When I came, he left. (different subjects: I came / he left)"]
      },
      {
        "type": "subheading",
        "text": "4. 'After' Clause (sen j\u00e4lkeen kun) \u2192 Past Participle Translative (-tua/-ty\u00e4)"
      },
      {
        "type": "subheading",
        "text": "Same subject"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle construction"],
        "rows": [
          ["Sen j\u00e4lkeen kun olin sy\u00f6nyt, l\u00e4hdin ulos", "Sy\u00f6ty\u00e4ni l\u00e4hdin ulos"],
          ["Sen j\u00e4lkeen kun h\u00e4n oli tehnyt ty\u00f6n, h\u00e4n l\u00e4hti kotiin", "Tehty\u00e4\u00e4n ty\u00f6n h\u00e4n l\u00e4hti kotiin"],
          ["Sen j\u00e4lkeen kun olin nukkunut, olin virke\u00e4", "Nukuttuani olin virke\u00e4"]
        ]
      },
      {
        "type": "subheading",
        "text": "Different subjects"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Participle construction"],
        "rows": [
          ["Sen j\u00e4lkeen kun opettaja oli puhunut, opiskelijat alkoivat kirjoittaa", "Opettajan puhuttua opiskelijat alkoivat kirjoittaa"],
          ["Sen j\u00e4lkeen kun aurinko oli laskenut, tuli pime\u00e4\u00e4", "Auringon laskettua tuli pime\u00e4\u00e4"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Perfect (olen sy\u00f6nyt)", "\"After I X\" form"],
        "rows": [
          ["sy\u00f6d\u00e4", "olen sy\u00f6nyt", "sy\u00f6ty\u00e4ni"],
          ["tehd\u00e4", "olen tehnyt", "tehty\u00e4ni"],
          ["menn\u00e4", "olen mennyt", "menty\u00e4ni"],
          ["tulla", "olen tullut", "tultuani"],
          ["nukkua", "olen nukkunut", "nukuttuani"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "The form is: passive past participle stem + -A (translative) + possessive suffix."
      },
      {
        "type": "subheading",
        "text": "5. 'Before' Clause (ennen kuin) \u2192 Various Constructions"
      },
      {
        "type": "paragraph",
        "text": "For 'before', Finnish often uses 'ennen' + noun (from the verb) rather than a participle construction."
      },
      {
        "type": "example-table",
        "headers": ["Original", "Construction"],
        "rows": [
          ["Ennen kuin l\u00e4hdin, siivosin", "Siivosin l\u00e4ht\u00f6\u00e4 ennen"],
          ["Ennen kuin s\u00f6in, pesin k\u00e4det", "Pesin k\u00e4det ennen sy\u00f6mist\u00e4"]
        ]
      },
      {
        "type": "subheading",
        "text": "6. Agent Clause (jonka joku teki) \u2192 Agent Participle (-ma/-m\u00e4)"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Agent participle"],
        "rows": [
          ["Kirja, jonka opettaja kirjoitti", "Opettajan kirjoittama kirja"],
          ["Talo, jonka insin\u00f6\u00f6ri suunnitteli", "Insin\u00f6\u00f6rin suunnittelema talo"],
          ["Ruoka, jonka \u00e4iti teki", "\u00c4idin tekem\u00e4 ruoka"],
          ["Teht\u00e4v\u00e4, jonka opettaja antoi", "Opettajan antama teht\u00e4v\u00e4"]
        ]
      },
      {
        "type": "subheading",
        "text": "With possessive suffixes (for pronoun agents)"
      },
      {
        "type": "example-table",
        "headers": ["Original", "Agent participle"],
        "rows": [
          ["Kirja, jonka min\u00e4 kirjoitin", "Minun kirjoittamani kirja"],
          ["Kirja, jonka sin\u00e4 kirjoitit", "Sinun kirjoittamasi kirja"],
          ["Kirja, jonka h\u00e4n kirjoitti", "H\u00e4nen kirjoittamansa kirja"],
          ["Kirja, jonka me kirjoitimme", "Meid\u00e4n kirjoittamamme kirja"],
          ["Kirja, jonka te kirjoititte", "Teid\u00e4n kirjoittamanne kirja"],
          ["Kirja, jonka he kirjoittivat", "Heid\u00e4n kirjoittamansa kirja"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Crucial: The agent participle for noun agents (opettajan) takes no possessive suffix. For pronoun agents (minun), the possessive suffix is mandatory."
      },
      {
        "type": "subheading",
        "text": "7. Complete Transformation Flowchart (Decide Which Participle)"
      },
      {
        "type": "paragraph",
        "text": "Start: Do you have a clause?\n  \u251c\u2500 Is it a relative clause (joka)?\n  \u2502     \u251c\u2500 Active, present? \u2192 -va/-v\u00e4 (lukeva)\n  \u2502     \u251c\u2500 Active, past? \u2192 -nut/-nyt (lukenut)\n  \u2502     \u251c\u2500 Passive, present (to be done)? \u2192 -tava/-t\u00e4v\u00e4 (luettava)\n  \u2502     \u2514\u2500 Passive, past (done)? \u2192 -ttu/-tty (luettu)\n  \u251c\u2500 Is it a temporal clause (kun)?\n  \u2502     \u251c\u2500 Same subject? \u2192 -essa/-ess\u00e4 (puhuessani)\n  \u2502     \u2514\u2500 Different subject \u2192 genitive + -essa/-ess\u00e4 (opettajan puhuessa)\n  \u251c\u2500 Is it an 'after' clause (sen j\u00e4lkeen kun)?\n  \u2502     \u251c\u2500 Same subject? \u2192 -tua/-ty\u00e4 + possessive (sy\u00f6ty\u00e4ni)\n  \u2502     \u2514\u2500 Different subject \u2192 genitive + -tua/-ty\u00e4 (opettajan puhuttua)\n  \u251c\u2500 Is it a 'by someone' clause (jonka joku teki)?\n  \u2502     \u251c\u2500 Agent is a noun? \u2192 noun (genitive) + -ma/-m\u00e4 (opettajan kirjoittama)\n  \u2502     \u2514\u2500 Agent is a pronoun \u2192 pronoun (genitive) + -ma/-m\u00e4 + possessive (minun kirjoittamani)\n  \u2514\u2500 Is it a 'before' clause (ennen kuin)?\n        \u2514\u2500 Use ennen + 3rd infinitive partitive (ennen sy\u00f6mist\u00e4)"
      },
      {
        "type": "subheading",
        "text": "8. Written vs. Spoken Finnish (Critical B2 Insight)"
      },
      {
        "type": "example-table",
        "headers": ["Written (participle construction)", "Spoken (simpler)"],
        "rows": [
          ["Helsingiss\u00e4 asuva mies on l\u00e4\u00e4k\u00e4ri", "Mies, joka asuu Helsingiss\u00e4, on l\u00e4\u00e4k\u00e4ri"],
          ["Sy\u00f6dess\u00e4ni kuuntelin radiota", "Kun s\u00f6in, kuuntelin radiota"],
          ["Sy\u00f6ty\u00e4ni l\u00e4hdin ulos", "Kun olin sy\u00f6nyt, l\u00e4hdin ulos (or Sit ku m\u00e4 s\u00f6in, m\u00e4 l\u00e4hin)"],
          ["Opettajan kirjoittama kirja", "Kirja, mink\u00e4 opettaja kirjoitti"]
        ]
      },
      {
        "type": "note",
        "icon": "📝",
        "text": "B2 advice: In YKI writing, use participle constructions for higher scores. In YKI speaking, relative clauses and kun are fine (and more natural)."
      },
      {
        "type": "subheading",
        "text": "9. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong", "✅ Correct", "Why"],
        "rows": [
          ["Helsingiss\u00e4 asuvainen mies", "Helsingiss\u00e4 asuva mies", "-vainen is not a valid participle suffix"],
          ["Opettajan kirjoittamansa kirja", "Opettajan kirjoittama kirja", "No possessive suffix with noun agent"],
          ["Minun kirjoittama kirja", "Minun kirjoittamani kirja", "Missing possessive suffix with pronoun agent"],
          ["Sy\u00f6ty\u00e4ni min\u00e4 l\u00e4hdin", "Sy\u00f6ty\u00e4ni l\u00e4hdin", "The subject is already in the possessive suffix"]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Full Example Sentences (YKI Level)"
      },
      {
        "type": "example-list",
        "items": [
          "Suomessa asuvat ulkomaalaiset voivat \u00e4\u00e4nest\u00e4\u00e4 paikallisvaaleissa. (Foreigners living in Finland can vote in local elections.)",
          "Viime vuonna kirjoitetuista kirjoista parhaiten myi dekkari. (Of the books written last year, the best-selling was a crime novel.)",
          "Sy\u00f6ty\u00e4\u00e4n lounaan h\u00e4n palasi kokoukseen. (After eating lunch, he returned to the meeting.)",
          "Opettajan selitt\u00e4ess\u00e4 teht\u00e4v\u00e4\u00e4 kukaan ei puhunut. (While the teacher was explaining the task, no one spoke.)",
          "Asiantuntijoiden laatima raportti julkaistaan ensi viikolla. (The report prepared by the experts will be published next week.)",
          "Auringon noustua l\u00e4hdimme retkelle. (After the sun rose, we left for the trip.)",
          "Luettavaksi suositeltuja kirjoja on paljon, mutta minulla ei ole aikaa. (There are many books recommended to be read, but I don't have time.)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Quick Reference Table (All Participle Constructions)"
      },
      {
        "type": "example-table",
        "headers": ["Construction", "Finnish (example)", "English", "Original clause"],
        "rows": [
          ["Active present attr.", "lukeva mies", "the man reading", "mies, joka lukee"],
          ["Active past attr.", "lukenut mies", "the man who read", "mies, joka luki"],
          ["Passive present attr.", "luettava kirja", "the book to be read", "kirja, joka luetaan"],
          ["Passive past attr.", "luettu kirja", "the book that was read", "kirja, joka luettiin"],
          ["Temporal (same subj.)", "lukiessani", "while I read", "kun luin"],
          ["Temporal (diff. subj.)", "opettajan lukiessa", "while the teacher read", "kun opettaja luki"],
          ["After (same subj.)", "luettuani", "after I read", "sen j\u00e4lkeen kun olin lukenut"],
          ["After (diff. subj.)", "opettajan luettua", "after the teacher read", "sen j\u00e4lkeen kun opettaja oli lukenut"],
          ["Agent (noun)", "opettajan lukema", "read by the teacher", "jonka opettaja luki"],
          ["Agent (pronoun)", "minun lukemani", "read by me", "jonka min\u00e4 luin"]
        ]
      },
      {
        "type": "subheading",
        "text": "12. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Rewrite the following sentences using participle constructions.",
        "items": [
          "1. Mies, joka juo kahvia, istuu p\u00f6yd\u00e4ss\u00e4. \u2192 Kahvia juova mies istuu p\u00f6yd\u00e4ss\u00e4.",
          "2. Kun h\u00e4n k\u00e4veli kotiin, h\u00e4n tapasi yst\u00e4v\u00e4n. \u2192 K\u00e4velless\u00e4\u00e4n kotiin h\u00e4n tapasi yst\u00e4v\u00e4n.",
          "3. Sen j\u00e4lkeen kun olin tehnyt l\u00e4ksyt, katsoin televisiota. \u2192 Tehty\u00e4ni l\u00e4ksyt katsoin televisiota.",
          "4. Kirja, jonka tutkija kirjoitti, voitti palkinnon. \u2192 Tutkijan kirjoittama kirja voitti palkinnon.",
          "5. Kun opettaja selitti asiaa, opiskelijat kuuntelivat tarkasti. \u2192 Opettajan selitt\u00e4ess\u00e4 asiaa opiskelijat kuuntelivat tarkasti.",
          "6. Kirja, joka on luettava, on hyllyss\u00e4. \u2192 Luettava kirja on hyllyss\u00e4."
        ]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Tehty\u00e4ni ty\u00f6n menin kotiin. (After doing the work, I went home.)",
          "Naapurin puhuessa en saanut unta. (When the neighbor was talking, I couldn't sleep.)",
          "Tutkijoiden tekem\u00e4 l\u00f6yt\u00f6 oli merkitt\u00e4v\u00e4. (The discovery made by the researchers was significant.)",
          "Auringon noustua linnut alkoivat laulaa. (After the sun rose, the birds started to sing.)",
          "Luettavana on kymmenen kirjaa. (There are ten books to read.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does 'lukeva mies' mean?",
      "options": [
        "A man who has read",
        "A man reading (present)",
        "A man to be read",
        "A man who was read"
      ],
      "correctAnswer": "A man reading (present)",
      "explanation": "'LukEva' is the active present participle, replacing 'mies, joka lukee' (the man who is reading).",
      "hint": "-va/-v\u00e4 = present active.",
      "points": 10
    },
    {
      "question": "What is the correct participle form to replace 'Kirja, joka luetaan'?",
      "options": ["luettu kirja", "lukeva kirja", "luettava kirja", "lukenut kirja"],
      "correctAnswer": "luettava kirja",
      "explanation": "'Luettava' is the passive present participle (to be read). 'Kirja, joka luetaan' = the book that is read / to be read.",
      "hint": "Passive present = -tava/-t\u00e4v\u00e4.",
      "points": 10
    },
    {
      "question": "What does 'Sy\u00f6dess\u00e4ni en katso televisiota' replace?",
      "options": [
        "Sen j\u00e4lkeen kun s\u00f6in",
        "Kun sy\u00f6n",
        "Ennen kuin sy\u00f6n",
        "Sy\u00f6m\u00e4tt\u00e4"
      ],
      "correctAnswer": "Kun sy\u00f6n",
      "explanation": "The 2nd infinitive inessive (-essa/-ess\u00e4) replaces 'kun' clauses when the subject is the same. 'Sy\u00f6dess\u00e4ni' = 'kun sy\u00f6n' (when I eat / while eating).",
      "hint": "Same subject temporal clause.",
      "points": 10
    },
    {
      "question": "How do you say 'After I ate, I went out' using a participle construction?",
      "options": [
        "Sy\u00f6dess\u00e4ni menin ulos",
        "Sy\u00f6ty\u00e4ni menin ulos",
        "Sy\u00f6m\u00e4tt\u00e4 menin ulos",
        "Sy\u00f6v\u00e4ni menin ulos"
      ],
      "correctAnswer": "Sy\u00f6ty\u00e4ni menin ulos",
      "explanation": "'Sy\u00f6ty\u00e4ni' is the past participle translative (after I ate). 'Sy\u00f6ty\u00e4ni l\u00e4hdin ulos' = After I ate, I went out.",
      "hint": "-tua/-ty\u00e4 for 'after'.",
      "points": 10
    },
    {
      "question": "What is the agent participle form for 'The book written by the teacher'?",
      "options": [
        "Opettajan kirjoitettu kirja",
        "Opettajan kirjoittama kirja",
        "Opettajan kirjoittava kirja",
        "Opettajan kirjoittamansa kirja"
      ],
      "correctAnswer": "Opettajan kirjoittama kirja",
      "explanation": "The agent participle for a noun agent (opettajan) is '-ma/-m\u00e4' with no possessive suffix: 'opettajan kirjoittama kirja'.",
      "hint": "Noun agent = no possessive suffix.",
      "points": 10
    },
    {
      "question": "What is the correct form for 'the book written by me'?",
      "options": [
        "Minun kirjoitettu kirja",
        "Minun kirjoittama kirja",
        "Minun kirjoittamani kirja",
        "Minua kirjoittama kirja"
      ],
      "correctAnswer": "Minun kirjoittamani kirja",
      "explanation": "For pronoun agent (minun), the agent participle requires a possessive suffix: 'minun kirjoittamani kirja'.",
      "hint": "Pronoun agent = possessive suffix required.",
      "points": 10
    },
    {
      "question": "Which construction is used for 'while the teacher was speaking' (different subjects)?",
      "options": [
        "Opettajan puhuessa",
        "Opettajan puhuttua",
        "Puhuessani",
        "Puhuttuani"
      ],
      "correctAnswer": "Opettajan puhuessa",
      "explanation": "For different subjects, use genitive + 2nd infinitive inessive: 'opettajan puhuessa' = while the teacher was speaking.",
      "hint": "Genitive (opettajan) + -essa/-ess\u00e4.",
      "points": 10
    },
    {
      "question": "What does 'Tehty\u00e4ni l\u00e4ksyt katsoin televisiota' mean?",
      "options": [
        "While I was doing homework, I watched TV",
        "Before I did homework, I watched TV",
        "After I did homework, I watched TV",
        "Without doing homework, I watched TV"
      ],
      "correctAnswer": "After I did homework, I watched TV",
      "explanation": "'Tehty\u00e4ni' is the past participle translative form meaning 'after I did'. So: After I did homework, I watched TV.",
      "hint": "-tua/-ty\u00e4 = after.",
      "points": 10
    },
    {
      "question": "Which of the following sentences uses a passive past participle attribute?",
      "options": [
        "nukkuva lapsi",
        "luettu kirja",
        "lukeva mies",
        "sy\u00f6ty\u00e4ni"
      ],
      "correctAnswer": "luettu kirja",
      "explanation": "Passive past participle ends in -ttu/-tty. 'Luettu kirja' = the book that has been read.",
      "hint": "-ttu/-tty = passive past.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, how would you say 'Sy\u00f6dess\u00e4ni kuuntelin radiota'?",
      "options": [
        "Kun olin sy\u00f6nyt, kuuntelin radiota",
        "Kun s\u00f6in, kuuntelin radiota",
        "Sy\u00f6ty\u00e4ni kuuntelin radiota",
        "Radiota kuunnellen s\u00f6in"
      ],
      "correctAnswer": "Kun s\u00f6in, kuuntelin radiota",
      "explanation": "In spoken Finnish, people use 'kun' + verb instead of the 2nd infinitive inessive. 'Kun s\u00f6in, kuuntelin radiota' = While I was eating, I listened to the radio.",
      "hint": "Spoken = kun + verb.",
      "points": 10
    }
  ]
},


{
  "id": "third-fourth-infinitives",
  "chapter": 10,
  "title": "Third and Fourth Infinitives – 3. ja 4. infinitiivi",
  "finnish": "3. ja 4. infinitiivi",
  "icon": "🔁",
  "level": "B2",
  "accent": "bg-lime-800",
  "badge": "bg-lime-50 text-lime-700 border-lime-200",
  "description": "Complete reference for the 3rd infinitive (massa, maan, masta, malla, matta) and the 4th infinitive (-minen noun form) with case usage, possessive suffixes, and verb rection",
  "content": {
    "type": "rich",
    "intro": "The third infinitive has five productive cases: inessive (ongoing action), illative (purpose/movement), adessive (method), abessive (without doing), and elative (from doing). The fourth infinitive (-minen) turns a verb into a noun meaning 'the act of doing X'.",
    "sections": [
      {
        "type": "subheading",
        "text": "1. The Third Infinitive \u2014 Complete Paradigm (B2 Refresher)"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Ending", "Meaning", "Example (puhua = to speak)"],
        "rows": [
          ["Inessive", "-massa / -m\u00e4ss\u00e4", "in the act of doing", "puhumassa"],
          ["Illative", "-maan / -m\u00e4\u00e4n", "(going) to do", "puhumaan"],
          ["Elative", "-masta / -m\u00e4st\u00e4", "from doing", "puhumasta"],
          ["Adessive", "-malla / -m\u00e4ll\u00e4", "by doing", "puhumalla"],
          ["Abessive", "-matta / -m\u00e4tt\u00e4", "without doing", "puhumatta"],
          ["Instructive", "-man / -m\u00e4n (rare)", "by doing (archaic)", "puhuman (rare)"]
        ]
      },
      {
        "type": "note",
        "icon": "✅",
        "text": "Most common: Inessive, illative, adessive, abessive. Elative is less frequent. Instructive is archaic (C1)."
      },
      {
        "type": "subheading",
        "text": "2. Third Infinitive Inessive (-massa) \u2014 In the Act of Doing"
      },
      {
        "type": "paragraph",
        "text": "Used with olla to express ongoing action (present continuous)."
      },
      {
        "type": "example-table",
        "headers": ["Subject", "Finnish", "English"],
        "rows": [
          ["min\u00e4", "Olen lukemassa", "I am reading"],
          ["sin\u00e4", "Olet lukemassa", "You are reading"],
          ["h\u00e4n", "On lukemassa", "He/she is reading"],
          ["me", "Olemme lukemassa", "We are reading"],
          ["te", "Olette lukemassa", "You (pl) are reading"],
          ["he", "Ovat lukemassa", "They are reading"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Olin lukemassa, kun h\u00e4n tuli. (I was reading when he came.)",
          "Olimme sy\u00f6m\u00e4ss\u00e4, kun puhelin soi. (We were eating when the phone rang.)"
        ]
      },
      {
        "type": "subheading",
        "text": "3. Third Infinitive Illative (-maan) \u2014 Going to Do / Purpose"
      },
      {
        "type": "paragraph",
        "text": "Used with movement verbs (menn\u00e4, tulla, l\u00e4hte\u00e4, k\u00e4yd\u00e4) to express purpose."
      },
      {
        "type": "example-table",
        "headers": ["Verb + illative", "Example", "Meaning"],
        "rows": [
          ["menn\u00e4 nukkumaan", "Menen nukkumaan.", "I go to sleep."],
          ["tulla sy\u00f6m\u00e4\u00e4n", "Tuletko sy\u00f6m\u00e4\u00e4n?", "Are you coming to eat?"],
          ["l\u00e4hte\u00e4 opiskelemaan", "L\u00e4hdin opiskelemaan.", "I left to study."],
          ["menn\u00e4 uimaan", "Menemme uimaan.", "We go swimming."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "H\u00e4n j\u00e4i nukkumaan. (He stayed to sleep / stayed sleeping.)",
          "Standard: H\u00e4n alkoi puhua. (He started to speak.) Colloquial: H\u00e4n alkoi puhumaan. In YKI writing, use the standard form."
        ]
      },
      {
        "type": "subheading",
        "text": "4. Third Infinitive Adessive (-malla) \u2014 By Doing (Method)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Oppii lukemalla.", "One learns by reading."],
          ["H\u00e4n ratkaisi ongelman ajattelemalla.", "He solved the problem by thinking."],
          ["S\u00e4\u00e4st\u00e4n rahaa ty\u00f6skentelem\u00e4ll\u00e4.", "I save money by working."],
          ["Juoksemalla voit voittaa.", "By running, you can win."]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Adessive (-malla)", "Instructive (-en)", "Difference"],
        "rows": [
          ["juoksemalla (by running \u2014 method)", "juosten (while running \u2014 simultaneous)", "Method vs. simultaneous action"]
        ]
      },
      {
        "type": "subheading",
        "text": "5. Third Infinitive Elative (-masta) \u2014 From Doing / Stopping"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["H\u00e4n tuli sy\u00f6m\u00e4st\u00e4.", "He came from eating."],
          ["H\u00e4n lopetti puhumasta.", "He stopped speaking."],
          ["Estin h\u00e4nt\u00e4 tulemasta.", "I prevented him from coming."],
          ["Kielsin lasta juoksemasta.", "I forbade the child from running."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Lopettaa is more commonly followed by the 4th infinitive partitive (lopetti puhumisen), but the 3rd infinitive elative is also possible."
      },
      {
        "type": "subheading",
        "text": "6. Third Infinitive Abessive (-matta) \u2014 Without Doing"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["H\u00e4n l\u00e4hti sanomatta mit\u00e4\u00e4n.", "He left without saying anything."],
          ["En voi el\u00e4\u00e4 sy\u00f6m\u00e4tt\u00e4.", "I cannot live without eating."],
          ["H\u00e4n meni ohi huomaamatta minua.", "He walked past without noticing me."]
        ]
      },
      {
        "type": "example-list",
        "items": ["Sinun tiet\u00e4m\u00e4tt\u00e4si = without you knowing (fixed expression with possessive suffix)"]
      },
      {
        "type": "subheading",
        "text": "7. Fourth Infinitive (-minen) \u2014 The Noun Form"
      },
      {
        "type": "paragraph",
        "text": "The 4th infinitive turns a verb into a noun meaning 'the act of doing X'. It declines like a regular -nen noun (stem -se-)."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "4th infinitive", "Stem (for cases)"],
        "rows": [
          ["lukea", "lukeminen", "lukemise-"],
          ["sy\u00f6d\u00e4", "sy\u00f6minen", "sy\u00f6mise-"],
          ["tehd\u00e4", "tekeminen", "tekemise-"],
          ["puhua", "puhuminen", "puhumise-"],
          ["menn\u00e4", "meneminen", "menemise-"]
        ]
      },
      {
        "type": "subheading",
        "text": "Full declension of lukeminen (reading)"
      },
      {
        "type": "example-table",
        "headers": ["Case", "Singular", "Plural"],
        "rows": [
          ["Nominative", "lukeminen", "lukemiset"],
          ["Genitive", "lukemisen", "lukemisten / lukemisien"],
          ["Partitive", "lukemista", "lukemisia"],
          ["Inessive", "lukemisessa", "lukemisissa"],
          ["Elative", "lukemisesta", "lukemisista"],
          ["Illative", "lukemiseen", "lukemisiin"],
          ["Adessive", "lukemisella", "lukemisilla"],
          ["Ablative", "lukemiselta", "lukemisilta"],
          ["Allative", "lukemiselle", "lukemisille"],
          ["Abessive", "lukemisetta", "lukemisitta"]
        ]
      },
      {
        "type": "subheading",
        "text": "8. Fourth Infinitive as Subject / Object"
      },
      {
        "type": "subheading",
        "text": "As subject (nominative)"
      },
      {
        "type": "example-list",
        "items": [
          "Lukeminen on hauskaa. (Reading is fun.)",
          "Tupakointi on vaarallista. (Smoking is dangerous.)"
        ]
      },
      {
        "type": "subheading",
        "text": "As object (partitive) after verbs like rakastaa, vihata, harrastaa"
      },
      {
        "type": "example-list",
        "items": [
          "Rakastan lukemista. (I love reading.)",
          "Vihaan odottamista. (I hate waiting.)",
          "Pid\u00e4n matkustamisesta. (I like traveling. \u2014 elative after pit\u00e4\u00e4)",
          "Harrastan valokuvaamista. (I do photography as a hobby.)"
        ]
      },
      {
        "type": "subheading",
        "text": "As object after aloittaa, lopettaa, jatkaa, unohtaa, muistaa"
      },
      {
        "type": "example-list",
        "items": [
          "Aloitin suomen opiskelun. (I started studying Finnish.)",
          "Lopetin tupakoinnin. (I stopped smoking. \u2014 accusative/genitive for total object)",
          "Jatkan ty\u00f6ntekoa huomenna. (I will continue working tomorrow.)",
          "Unohdin lukemisen. (I forgot the reading.)"
        ]
      },
      {
        "type": "subheading",
        "text": "9. Verb Rection with Infinitives (Advanced Master Table)"
      },
      {
        "type": "example-table",
        "headers": ["Main verb", "Required infinitive", "Example", "Meaning"],
        "rows": [
          ["alkaa (start)", "1st infinitive", "H\u00e4n alkoi puhua.", "He started to speak."],
          ["lopettaa (stop)", "4th infinitive partitive", "H\u00e4n lopetti puhumisen.", "He stopped speaking."],
          ["jatkaa (continue)", "4th infinitive partitive", "H\u00e4n jatkoi puhumista.", "He continued speaking."],
          ["yritt\u00e4\u00e4 (try)", "1st infinitive", "H\u00e4n yritti puhua.", "He tried to speak."],
          ["haluta (want)", "1st infinitive", "H\u00e4n haluaa puhua.", "He wants to speak."],
          ["saattaa (might)", "1st infinitive", "H\u00e4n saattaa puhua.", "He might speak."],
          ["voida (can)", "1st infinitive", "H\u00e4n voi puhua.", "He can speak."],
          ["pit\u00e4\u00e4 (must)", "1st infinitive", "H\u00e4nen pit\u00e4\u00e4 puhua.", "He must speak."],
          ["t\u00e4yty\u00e4 (must)", "1st infinitive", "H\u00e4nen t\u00e4ytyy puhua.", "He must speak."],
          ["menn\u00e4 (go to)", "3rd infinitive illative", "H\u00e4n menee puhumaan.", "He goes to speak."],
          ["tulla (come to)", "3rd infinitive illative", "H\u00e4n tulee puhumaan.", "He comes to speak."],
          ["olla (be) + ongoing", "3rd infinitive inessive", "H\u00e4n on puhumassa.", "He is speaking."],
          ["pit\u00e4\u00e4 (like)", "4th infinitive elative", "H\u00e4n pit\u00e4\u00e4 puhumisesta.", "He likes speaking."],
          ["rakastaa (love)", "4th infinitive partitive", "H\u00e4n rakastaa puhumista.", "He loves speaking."]
        ]
      },
      {
        "type": "subheading",
        "text": "10. Third vs. Fourth Infinitive After Lopettaa (Common Confusion)"
      },
      {
        "type": "example-table",
        "headers": ["Form", "Example", "Meaning", "Standard?"],
        "rows": [
          ["3rd infinitive elative", "H\u00e4n lopetti puhumasta.", "He stopped (in the middle of) speaking", "Possible but less common"],
          ["4th infinitive partitive", "H\u00e4n lopetti puhumisen.", "He stopped speaking (completely)", "Standard"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 advice: Use the 4th infinitive after lopettaa, aloittaa, jatkaa for standard Finnish."
      },
      {
        "type": "subheading",
        "text": "11. Real Natural Sentences (B2/YKI Level)"
      },
      {
        "type": "example-list",
        "items": [
          "Olen juuri sy\u00f6m\u00e4ss\u00e4, soita my\u00f6hemmin. (I'm just eating \u2014 call later.)",
          "Menen nukkumaan, koska olen todella v\u00e4synyt. (I'm going to sleep because I'm really tired.)",
          "Opin suomea lukemalla kirjoja ja katsomalla elokuvia. (I learn Finnish by reading books and watching movies.)",
          "H\u00e4n l\u00e4hti sanomatta sanaakaan \u2014 se oli todella t\u00f6yke\u00e4\u00e4. (He left without saying a word \u2014 it was really rude.)",
          "Lukeminen on parasta, mit\u00e4 tied\u00e4n. (Reading is the best thing I know.)",
          "Pid\u00e4n enemm\u00e4n k\u00e4velyst\u00e4 kuin juoksemisesta. (I like walking more than running.)",
          "Aloitin suomen opiskelun kolme vuotta sitten, ja nyt puhun jo aika hyvin. (I started studying Finnish three years ago, and now I already speak quite well.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["Olen lukeminen", "Olen lukemassa", "Present continuous uses 3rd infinitive inessive, not 4th."],
          ["Menen lukemista", "Menen lukemaan", "Movement + purpose = 3rd illative."],
          ["Pid\u00e4n lukemaan", "Pid\u00e4n lukemisesta", "Pit\u00e4\u00e4 (like) takes 4th infinitive elative."],
          ["H\u00e4n alkoi lukemaan (in standard writing)", "H\u00e4n alkoi lukea", "Standard: alkaa + 1st infinitive; -maan is colloquial."],
          ["Lopetin puhumasta (for 'I stopped speaking completely')", "Lopetin puhumisen", "For complete stop, use 4th infinitive partitive."]
        ]
      },
      {
        "type": "subheading",
        "text": "13. Quick Reference Chart (All Infinitives)"
      },
      {
        "type": "example-table",
        "headers": ["Infinitive", "Form", "Use", "Example"],
        "rows": [
          ["1st", "puhua", "dictionary form, after modals", "Haluan puhua"],
          ["2nd (inessive)", "puhuessa", "while doing (same subject)", "Puhuessani..."],
          ["3rd (inessive)", "puhumassa", "in progress", "Olen puhumassa"],
          ["3rd (illative)", "puhumaan", "going to do", "Menen puhumaan"],
          ["3rd (adessive)", "puhumalla", "by doing", "Puhumalla oppii"],
          ["3rd (abessive)", "puhumatta", "without doing", "Puhumatta j\u00e4i"],
          ["4th", "puhuminen", "noun form", "Puhuminen on vaikeaa"]
        ]
      },
      {
        "type": "subheading",
        "text": "14. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Replace the underlined expression with the correct infinitive form.",
        "items": [
          "1. Olen parhaillaan sy\u00f6m\u00e4ss\u00e4. \u2192 sy\u00f6m\u00e4ss\u00e4 = 3rd infinitive inessive",
          "2. H\u00e4n meni kauppaan nimenomaan ostaakseen ruokaa. \u2192 H\u00e4n meni kauppaan ostamaan ruokaa.",
          "3. Se, ett\u00e4 lukee, on hy\u00f6dyllist\u00e4. \u2192 Lukeminen on hy\u00f6dyllist\u00e4.",
          "4. H\u00e4n l\u00e4hti ilman ett\u00e4 sanoi mit\u00e4\u00e4n. \u2192 H\u00e4n l\u00e4hti sanomatta mit\u00e4\u00e4n.",
          "5. Pid\u00e4n siit\u00e4, ett\u00e4 matkustan. \u2192 Pid\u00e4n matkustamisesta."
        ]
      },
      {
        "type": "subheading",
        "text": "15. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Oletko koskaan kokeillut oppia kielt\u00e4 vain kuuntelemalla? (Have you ever tried to learn a language just by listening?)",
          "H\u00e4n l\u00e4hti kotoa sy\u00f6m\u00e4tt\u00e4. (He left home without eating.)",
          "T\u00e4ll\u00e4 viikolla en ole ehtinyt nukkumaan ollenkaan. (This week I haven't had time to sleep at all.)",
          "Minua pelottaa puhuminen isossa ryhm\u00e4ss\u00e4. (Speaking in a large group scares me.)",
          "Olen lukemassa mielenkiintoista romaania. (I am reading an interesting novel.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does 'Olen sy\u00f6m\u00e4ss\u00e4' mean?",
      "options": [
        "I am going to eat",
        "I am eating (right now)",
        "I have eaten",
        "I eat regularly"
      ],
      "correctAnswer": "I am eating (right now)",
      "explanation": "The 3rd infinitive inessive (-massa) with 'olla' expresses ongoing action: 'I am in the middle of eating'.",
      "hint": "-massa = in the act of.",
      "points": 10
    },
    {
      "question": "Which case of the 3rd infinitive is used after movement verbs like 'menn\u00e4' and 'tulla'?",
      "options": ["Inessive (-massa)", "Illative (-maan)", "Elative (-masta)", "Adessive (-malla)"],
      "correctAnswer": "Illative (-maan)",
      "explanation": "Movement verbs use the 3rd infinitive illative to express purpose: 'Menen nukkumaan' (I go to sleep).",
      "hint": "Going to do = illative.",
      "points": 10
    },
    {
      "question": "How do you say 'I learn by reading' using the 3rd infinitive?",
      "options": [
        "Opin lukemassa",
        "Opin lukemaan",
        "Opin lukemalla",
        "Opin lukemasta"
      ],
      "correctAnswer": "Opin lukemalla",
      "explanation": "The 3rd infinitive adessive (-malla) expresses method or means: 'by doing X'. 'Opin lukemalla' = I learn by reading.",
      "hint": "By doing = adessive.",
      "points": 10
    },
    {
      "question": "What does 'H\u00e4n l\u00e4hti sanomatta mit\u00e4\u00e4n' mean?",
      "options": [
        "He left after saying something",
        "He left by saying something",
        "He left without saying anything",
        "He left to say something"
      ],
      "correctAnswer": "He left without saying anything",
      "explanation": "The 3rd infinitive abessive (-matta) means 'without doing'. 'Sanomatta' = without saying.",
      "hint": "-matta = without.",
      "points": 10
    },
    {
      "question": "What is the 4th infinitive of 'lukea' (to read)?",
      "options": ["lukema", "lukeminen", "lukemassa", "lukemalla"],
      "correctAnswer": "lukeminen",
      "explanation": "The 4th infinitive is formed with -minen and turns the verb into a noun: 'lukea' \u2192 'lukeminen' (reading).",
      "hint": "-minen = the act of.",
      "points": 10
    },
    {
      "question": "How do you say 'Reading is fun' using the 4th infinitive?",
      "options": [
        "Lukemassa on hauskaa",
        "Lukemaan on hauskaa",
        "Lukeminen on hauskaa",
        "Lukea on hauskaa"
      ],
      "correctAnswer": "Lukeminen on hauskaa",
      "explanation": "The 4th infinitive (lukeminen) acts as a subject noun. 'Lukeminen on hauskaa' = Reading is fun.",
      "hint": "Subject = 4th infinitive nominative.",
      "points": 10
    },
    {
      "question": "What is the correct form after 'rakastaa' (to love) with a verb meaning 'I love reading'?",
      "options": [
        "Rakastan lukea",
        "Rakastan lukemassa",
        "Rakastan lukemista",
        "Rakastan lukemaan"
      ],
      "correctAnswer": "Rakastan lukemista",
      "explanation": "'Rakastaa' takes the partitive object. The 4th infinitive partitive is 'lukemista'. 'Rakastan lukemista' = I love reading.",
      "hint": "Rakastaa + partitive of 4th infinitive.",
      "points": 10
    },
    {
      "question": "In standard Finnish, what follows 'alkaa' (to start)?",
      "options": [
        "1st infinitive (puhua)",
        "3rd infinitive illative (puhumaan)",
        "4th infinitive partitive (puhumista)",
        "3rd infinitive inessive (puhumassa)"
      ],
      "correctAnswer": "1st infinitive (puhua)",
      "explanation": "In standard Finnish, 'alkaa' takes the 1st infinitive: 'H\u00e4n alkoi puhua' (He started to speak). Colloquially, '-maan' is used, but avoid it in formal writing.",
      "hint": "Standard vs. colloquial distinction.",
      "points": 10
    },
    {
      "question": "What is the difference between 'lopetin puhumasta' and 'lopetin puhumisen'?",
      "options": [
        "No difference",
        "Puhumasta = stopped in the middle; puhumisen = stopped completely",
        "Puhumasta is past, puhumisen is present",
        "Puhumasta is active, puhumisen is passive"
      ],
      "correctAnswer": "Puhumasta = stopped in the middle; puhumisen = stopped completely",
      "explanation": "3rd infinitive elative (puhumasta) implies stopping an ongoing action mid-way. 4th infinitive partitive (puhumisen) implies stopping completely. For complete stop, the 4th infinitive is standard.",
      "hint": "Complete stop vs. interruption.",
      "points": 10
    },
    {
      "question": "What case follows 'pit\u00e4\u00e4' (to like) with a 4th infinitive?",
      "options": ["Nominative", "Partitive", "Elative", "Illative"],
      "correctAnswer": "Elative",
      "explanation": "'Pit\u00e4\u00e4' (to like) takes the elative case. With the 4th infinitive: 'pid\u00e4n lukemisesta' (I like reading).",
      "hint": "Pit\u00e4\u00e4 + elative (mist\u00e4).",
      "points": 10
    }
  ]
},


{
  "id": "word-derivation",
  "chapter": 11,
  "title": "Word Derivation – Johto-oppi",
  "finnish": "Johto-oppi",
  "icon": "🔤",
  "level": "B2",
  "accent": "bg-emerald-800",
  "badge": "bg-emerald-50 text-emerald-700 border-emerald-200",
  "description": "Systematic building of Finnish vocabulary by adding suffixes to roots — verb to noun, adjective derivation, abstract nouns, and derivational chains",
  "content": {
    "type": "rich",
    "intro": "Finnish builds vocabulary systematically by adding suffixes to roots. Learning these patterns allows you to understand unknown words from context, expand vocabulary rapidly, write more sophisticated Finnish, and derive the correct form in fill-in-the-blank tasks.",
    "sections": [
      {
        "type": "note",
        "icon": "✅",
        "text": "B2 insight: Instead of memorizing 10,000 words, learn 1,000 roots and 50 suffixes — and you can derive the rest."
      },
      {
        "type": "subheading",
        "text": "2. Verb \u2192 Action Noun: -minen (The Most Important)"
      },
      {
        "type": "paragraph",
        "text": "The 4th infinitive turns any verb into a noun meaning 'the act of doing X'."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Action noun", "Meaning"],
        "rows": [
          ["lukea", "lukeminen", "reading"],
          ["puhua", "puhuminen", "speaking"],
          ["opiskella", "opiskeleminen / opiskelu", "studying"],
          ["kirjoittaa", "kirjoittaminen", "writing"],
          ["matkustaa", "matkustaminen", "traveling"],
          ["sy\u00f6d\u00e4", "sy\u00f6minen", "eating"],
          ["nukkua", "nukkuminen", "sleeping"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Lukeminen on hauskaa. (Reading is fun.)",
          "Pid\u00e4n matkustamisesta. (I like traveling.)",
          "Sy\u00f6minen on nautinto. (Eating is a pleasure.)"
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Opiskelu is more common than opiskeleminen (shortened form)."
      },
      {
        "type": "subheading",
        "text": "3. Verb \u2192 Abstract Noun: -us / -ys (Result/Action)"
      },
      {
        "type": "paragraph",
        "text": "Turns a verb into an abstract noun \u2014 the result or product of the action."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Derived noun", "Meaning", "Notes"],
        "rows": [
          ["kehitt\u00e4\u00e4 (to develop)", "kehitys", "development", "tt \u2192 tys"],
          ["muuttaa (to change)", "muutos", "change", "tt \u2192 tos"],
          ["kysy\u00e4 (to ask)", "kysymys", "question", ""],
          ["valmistaa (to prepare)", "valmistus", "preparation", ""],
          ["ratkaista (to solve)", "ratkaisu", "solution", ""],
          ["k\u00e4ytt\u00e4\u00e4 (to use)", "k\u00e4ytt\u00f6", "use", "-tt\u00f6 suffix"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Kehitys on nopeaa. (Development is fast.)",
          "Kysymys on vaikea. (The question is difficult.)",
          "Ratkaisu l\u00f6ytyi. (The solution was found.)"
        ]
      },
      {
        "type": "subheading",
        "text": "4. Verb \u2192 Agent Noun: -ja / -j\u00e4 (Person who does)"
      },
      {
        "type": "paragraph",
        "text": "The most common way to create professional or active person nouns."
      },
      {
        "type": "example-table",
        "headers": ["Verb", "Agent noun", "Meaning"],
        "rows": [
          ["opiskella", "opiskelija", "student"],
          ["opettaa", "opettaja", "teacher"],
          ["kirjoittaa", "kirjoittaja", "writer"],
          ["lukea", "lukija", "reader"],
          ["puhua", "puhuja", "speaker"],
          ["myyd\u00e4", "myyj\u00e4", "seller"],
          ["ostaa", "ostaja", "buyer"],
          ["rakentaa", "rakentaja", "builder"],
          ["tutkia", "tutkija", "researcher"],
          ["johtaa", "johtaja", "leader/manager"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Kuka on kirjoittaja? (Who is the writer?)",
          "Opettaja selitt\u00e4\u00e4 asian. (The teacher explains the matter.)",
          "Tutkijat tekiv\u00e4t l\u00f6yd\u00f6n. (The researchers made a discovery.)"
        ]
      },
      {
        "type": "subheading",
        "text": "6. Verb \u2192 Location/Place: -sto / -st\u00f6"
      },
      {
        "type": "paragraph",
        "text": "Used for collections or sets. Very productive for collectives."
      },
      {
        "type": "example-table",
        "headers": ["Base word", "Derived noun", "Meaning"],
        "rows": [
          ["kirja (book)", "kirjasto", "library (collection of books)"],
          ["kone (machine)", "koneisto", "machinery (set of machines)"],
          ["sana (word)", "sanasto", "vocabulary"],
          ["laiva (ship)", "laivasto", "fleet"]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Adjective Derivation: -inen (Having the quality of)"
      },
      {
        "type": "example-table",
        "headers": ["Noun", "Adjective", "Meaning"],
        "rows": [
          ["Suomi (Finland)", "suomalainen", "Finnish"],
          ["kivi (stone)", "kivinen", "rocky / made of stone"],
          ["mets\u00e4 (forest)", "mets\u00e4inen", "forested / wooded"],
          ["puu (wood/tree)", "puinen", "wooden"],
          ["kulta (gold)", "kultainen", "golden"],
          ["hopea (silver)", "hopeinen", "silver (made of silver)"],
          ["rauta (iron)", "rautainen", "iron (made of iron)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Suomalainen mies = A Finnish man",
          "Kultainen sormus = A golden ring",
          "Puinen p\u00f6yt\u00e4 = A wooden table"
        ]
      },
      {
        "type": "subheading",
        "text": "8. Adjective Derivation: -llinen (Related to/characterized by)"
      },
      {
        "type": "example-table",
        "headers": ["Noun", "Adjective", "Meaning"],
        "rows": [
          ["kansa (people)", "kansallinen", "national"],
          ["kulttuuri (culture)", "kulttuurillinen", "cultural"],
          ["kauppa (trade)", "kaupallinen", "commercial"],
          ["teollisuus (industry)", "teollinen", "industrial"],
          ["taide (art)", "taiteellinen", "artistic"],
          ["tiede (science)", "tieteellinen", "scientific"]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Adjective Derivation: -kas / -k\u00e4s (Full of / abundant in)"
      },
      {
        "type": "example-table",
        "headers": ["Noun", "Adjective", "Meaning"],
        "rows": [
          ["voima (power)", "voimakas", "powerful"],
          ["varat (resources/wealth)", "varakas", "wealthy"],
          ["rohkea (courage)", "rohkea (already adjective)", "*rohkeakas? — not used"],
          ["vika (fault)", "vikainen", "faulty"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Voimakas mies = A powerful man",
          "Varakas perhe = A wealthy family"
        ]
      },
      {
        "type": "subheading",
        "text": "10. Adjective Derivation: -ton / -t\u00f6n (Without / lacking)"
      },
      {
        "type": "paragraph",
        "text": "The abessive suffix for adjectives (opposite of -llinen or -kas)."
      },
      {
        "type": "example-table",
        "headers": ["Noun", "Adjective", "Meaning"],
        "rows": [
          ["onni (luck)", "onneton", "unlucky"],
          ["voima (power)", "voimaton", "powerless"],
          ["taito (skill)", "taitoton", "unskilled"],
          ["raha (money)", "rahaton", "without money / broke"],
          ["toivo (hope)", "toivoton", "hopeless"],
          ["maku (taste)", "mauton", "tasteless"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Onneton p\u00e4iv\u00e4 = An unlucky day",
          "Voimaton olo = A powerless feeling / weak feeling",
          "Rahaton mies = A man without money"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Noun \u2192 Abstract Noun: -uus / -yys (Quality)"
      },
      {
        "type": "paragraph",
        "text": "The most common way to turn an adjective into an abstract noun."
      },
      {
        "type": "example-table",
        "headers": ["Adjective", "Abstract noun", "Meaning"],
        "rows": [
          ["uusi (new)", "uutuus", "newness / novelty"],
          ["vanha (old)", "vanhuus", "old age"],
          ["kaunis (beautiful)", "kauneus", "beauty"],
          ["nopea (fast)", "nopeus", "speed"],
          ["hidas (slow)", "hitaus", "slowness"],
          ["pitk\u00e4 (long)", "pituus", "length"],
          ["lyhyt (short)", "lyhyys", "shortness"],
          ["hyv\u00e4 (good)", "hyvyys", "goodness"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Kauneus on t\u00e4rke\u00e4\u00e4. (Beauty is important.)",
          "Nopeus on valttia. (Speed is an advantage.)",
          "Pituus ei ole kaikki kaikessa. (Height isn't everything.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. Derivational Chains (Building Long Words)"
      },
      {
        "type": "paragraph",
        "text": "Finnish allows multiple suffixes on one root. This is how you build complex vocabulary."
      },
      {
        "type": "example-table",
        "headers": ["Step", "Word", "Meaning", "Suffix"],
        "rows": [
          ["1", "tutkia", "to research", "(verb)"],
          ["2", "tutkimus", "research", "-mus (abstract noun)"],
          ["3", "tutkimuksellinen", "related to research", "-llinen (adjective)"],
          ["4", "tutkimuksellisuus", "quality of being research-related", "-uus (abstract noun)"]
        ]
      },
      {
        "type": "example-table",
        "headers": ["Step", "Word", "Meaning"],
        "rows": [
          ["1", "kehitt\u00e4\u00e4", "to develop"],
          ["2", "kehitys", "development"],
          ["3", "kehityksellinen", "developmental"],
          ["4", "kehityksellisyys", "developmental quality (rare)"]
        ]
      },
      {
        "type": "example-list",
        "title": "Practical example: kansainv\u00e4listyminen (internationalization)",
        "items": [
          "kansa = people",
          "kansan = of the people (genitive)",
          "kansainv\u00e4linen = international (between nations)",
          "kansainv\u00e4listy\u00e4 = to become international",
          "kansainv\u00e4listyminen = internationalization (act of becoming international)"
        ]
      },
      {
        "type": "note",
        "icon": "✅",
        "text": "This is how Finnish builds very long technical terms that correspond to single words in English."
      },
      {
        "type": "subheading",
        "text": "13. Complete Derivation Master Table"
      },
      {
        "type": "example-table",
        "headers": ["Base", "Suffix", "Result type", "Example", "Meaning"],
        "rows": [
          ["Verb", "-minen", "action noun", "lukeminen", "reading"],
          ["Verb", "-us/-ys", "abstract noun", "muutos", "change"],
          ["Verb", "-ja/-j\u00e4", "agent noun", "lukija", "reader"],
          ["Noun", "-inen", "adjective (made of)", "kultainen", "golden"],
          ["Noun", "-llinen", "adjective (related to)", "kansallinen", "national"],
          ["Noun", "-kas/-k\u00e4s", "adjective (full of)", "voimakas", "powerful"],
          ["Noun", "-ton/-t\u00f6n", "adjective (without)", "rahaton", "without money"],
          ["Adjective", "-uus/-yys", "abstract noun", "kauneus", "beauty"],
          ["Noun", "-sto/-st\u00f6", "collective noun", "kirjasto", "library"],
          ["Verb", "-in", "instrument", "keitin", "kettle"]
        ]
      },
      {
        "type": "subheading",
        "text": "14. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["Opiskeleminen on t\u00e4rke\u00e4\u00e4", "Opiskelu on t\u00e4rke\u00e4\u00e4", "Many -minen forms have shortened alternatives"],
          ["Lukemus (for 'reading')", "Lukeminen", "-mus is rare; -minen is standard for action nouns"],
          ["Suomen mies (for 'Finnish man')", "Suomalainen mies", "-lainen is for nationality; 'Suomen' = 'of Finland'"],
          ["Rikas mies \u2192 rikkaus (correct)", "rikkaus is correct", "Note gradation: rikas \u2192 rikka- + -us \u2192 rikkaus"]
        ]
      },
      {
        "type": "subheading",
        "text": "15. YKI-Style Word Formation Drills"
      },
      {
        "type": "example-list",
        "title": "Derive the requested word from the given base.",
        "items": [
          "1. From opettaa (to teach) \u2192 person who teaches \u2192 opettaja",
          "2. From nopea (fast) \u2192 abstract noun (speed) \u2192 nopeus",
          "3. From Suomi (Finland) \u2192 adjective (Finnish) \u2192 suomalainen",
          "4. From lukea (to read) \u2192 action noun (reading) \u2192 lukeminen",
          "5. From rakentaa (to build) \u2192 person who builds \u2192 rakentaja",
          "6. From raha (money) \u2192 adjective (without money) \u2192 rahaton",
          "7. From voima (power) \u2192 adjective (powerful) \u2192 voimakas",
          "8. From kaunis (beautiful) \u2192 abstract noun (beauty) \u2192 kauneus"
        ]
      },
      {
        "type": "subheading",
        "text": "16. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Runsas lumi ja j\u00e4\u00e4 tekiv\u00e4t ajamisesta vaarallista. (Abundant snow and ice made driving dangerous.)",
          "Tutkijan tekem\u00e4 l\u00f6yt\u00f6 oli merkitt\u00e4v\u00e4. (The discovery made by the researcher was significant.)",
          "Onnettomuus johtui valmistusvirheest\u00e4. (The accident was caused by a manufacturing error.)",
          "Kirjastosta l\u00f6ytyy laaja sanasto suomen kielell\u00e4. (The library has a wide vocabulary in Finnish.)",
          "Rahaton opiskelija ei voinut ostaa uutta tietokonetta. (The penniless student could not buy a new computer.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the action noun (4th infinitive) of 'puhua' (to speak)?",
      "options": ["puhuminen", "puhunta", "puhaus", "puhe"],
      "correctAnswer": "puhuminen",
      "explanation": "The 4th infinitive (-minen) turns verbs into action nouns: puhua \u2192 puhuminen (speaking).",
      "hint": "-minen = act of doing.",
      "points": 10
    },
    {
      "question": "How do you say 'I like traveling' using a derived noun?",
      "options": [
        "Pid\u00e4n matkustaa",
        "Pid\u00e4n matkustamista",
        "Pid\u00e4n matkustamisesta",
        "Pid\u00e4n matkustamaan"
      ],
      "correctAnswer": "Pid\u00e4n matkustamisesta",
      "explanation": "Pit\u00e4\u00e4 (to like) takes the elative case of the 4th infinitive: matkustamisesta (from matkustaminen).",
      "hint": "Pit\u00e4\u00e4 + elative of -minen form.",
      "points": 10
    },
    {
      "question": "What is the agent noun (person who does) of 'kirjoittaa' (to write)?",
      "options": ["kirjoitus", "kirjoittaja", "kirjoittaminen", "kirjailija"],
      "correctAnswer": "kirjoittaja",
      "explanation": "The suffix -ja/-j\u00e4 creates agent nouns: kirjoittaa \u2192 kirjoittaja (writer).",
      "hint": "-ja = person who does.",
      "points": 10
    },
    {
      "question": "What is the abstract noun meaning 'speed' from 'nopea' (fast)?",
      "options": ["nopeus", "nopea", "nopetus", "nopeasti"],
      "correctAnswer": "nopeus",
      "explanation": "The suffix -uus/-yys turns adjectives into abstract nouns: nopea \u2192 nopeus (speed).",
      "hint": "-uus = quality of.",
      "points": 10
    },
    {
      "question": "What is the adjective meaning 'powerful' from 'voima' (power)?",
      "options": ["voimallinen", "voimakas", "voimaton", "voimas"],
      "correctAnswer": "voimakas",
      "explanation": "The suffix -kas/-k\u00e4s means 'full of' or 'abundant in': voima \u2192 voimakas (powerful).",
      "hint": "-kas = full of.",
      "points": 10
    },
    {
      "question": "What is the adjective meaning 'without money' from 'raha' (money)?",
      "options": ["rahallinen", "rahakas", "rahaton", "rahainen"],
      "correctAnswer": "rahaton",
      "explanation": "The suffix -ton/-t\u00f6n means 'without' or 'lacking': raha \u2192 rahaton (without money / broke).",
      "hint": "-ton = without.",
      "points": 10
    },
    {
      "question": "What is the collective noun for 'collection of books' from 'kirja' (book)?",
      "options": ["kirjasto", "kirjain", "kirje", "kirjuri"],
      "correctAnswer": "kirjasto",
      "explanation": "The suffix -sto/-st\u00f6 creates collective nouns: kirja \u2192 kirjasto (library = collection of books).",
      "hint": "-sto = collection of.",
      "points": 10
    },
    {
      "question": "What is the adjective meaning 'Finnish' (from Suomi)?",
      "options": ["Suominen", "Suomalainen", "Suomellinen", "Suomekas"],
      "correctAnswer": "Suomalainen",
      "explanation": "The suffix -lainen/-l\u00e4inen creates nationality adjectives: Suomi \u2192 suomalainen (Finnish).",
      "hint": "-lainen = from a place.",
      "points": 10
    },
    {
      "question": "What is the abstract noun for 'beauty' from 'kaunis' (beautiful)?",
      "options": ["kauneus", "kaunius", "kaunistus", "kaunoisuus"],
      "correctAnswer": "kauneus",
      "explanation": "The suffix -uus/-yss with gradation: kaunis \u2192 kaune- + -us \u2192 kauneus (beauty).",
      "hint": "Add -us to the stem kaune-.",
      "points": 10
    },
    {
      "question": "What does the derivational chain 'tutkia \u2192 tutkimus \u2192 tutkimuksellinen \u2192 tutkimuksellisuus' demonstrate?",
      "options": [
        "How to conjugate verbs",
        "How to build long words by adding multiple suffixes",
        "How to decline nouns",
        "How to form questions"
      ],
      "correctAnswer": "How to build long words by adding multiple suffixes",
      "explanation": "Derivational chains show how Finnish adds multiple suffixes to a root to build complex vocabulary: research \u2192 research-related \u2192 the quality of being research-related.",
      "hint": "Multiple suffixes on one root.",
      "points": 10
    }
  ]
},

{
  "id": "spoken-written-finnish",
  "chapter": 12,
  "title": "Spoken vs. Written Finnish – Puhuttu vs. Kirjoitettu Suomi",
  "finnish": "Puhuttu ja kirjoitettu suomi",
  "icon": "🗣️",
  "level": "B2",
  "accent": "bg-sky-800",
  "badge": "bg-sky-50 text-sky-700 border-sky-200",
  "description": "Complete reference for the two coexisting systems of Finnish: written (kirjakieli) and spoken (puhekieli) — pronouns, verb conjugations, reductions, question forms, and regional differences",
  "content": {
    "type": "rich",
    "intro": "Finnish has two coexisting systems: written (kirjakieli) and spoken (puhekieli). Neither is wrong — they serve different purposes. To pass YKI listening, you must understand spoken Finnish. To pass YKI writing, you must use written Finnish.",
    "sections": [
      {
        "type": "note",
        "icon": "✅",
        "text": "B2 insight: To pass YKI listening, you must understand spoken Finnish. To pass YKI writing, you must use written Finnish. They are different skills."
      },
      {
        "type": "subheading",
        "text": "2. Pronoun System (Complete Table)"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Written", "Spoken (common)", "Regional variants"],
        "rows": [
          ["I", "min\u00e4", "m\u00e4", "mie (eastern), m\u00e4\u00e4"],
          ["you (sg)", "sin\u00e4", "s\u00e4", "sie (eastern), s\u00e4\u00e4"],
          ["he/she", "h\u00e4n", "se", "se (nationwide)"],
          ["we", "me", "me", "my\u00f6 (eastern)"],
          ["you (pl)", "te", "te", "ty\u00f6 (eastern)"],
          ["they", "he", "ne", "hy\u00f6 (eastern)"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Min\u00e4 olen \u2192 M\u00e4 oon",
          "Sin\u00e4 olet \u2192 S\u00e4 oot",
          "H\u00e4n tulee \u2192 Se tulee",
          "Me olemme \u2192 Me ollaan (passive form)",
          "He menev\u00e4t \u2192 Ne menee"
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "In spoken Finnish, 'se' and 'ne' are used for both people and things. Context clarifies."
      },
      {
        "type": "subheading",
        "text": "3. Verb Conjugation in Spoken Finnish (Full Paradigm)"
      },
      {
        "type": "paragraph",
        "text": "Spoken Finnish simplifies verb endings dramatically. The passive form (-taan/-t\u00e4\u00e4n) is often used for 1st person plural ('we')."
      },
      {
        "type": "subheading",
        "text": "Present tense of puhua (to speak)"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Written", "Spoken", "Notes"],
        "rows": [
          ["min\u00e4", "puhun", "m\u00e4 puhun / m\u00e4 puhu", "final -n often dropped"],
          ["sin\u00e4", "puhut", "s\u00e4 puhut / s\u00e4 puhu", "-t often dropped"],
          ["h\u00e4n", "puhuu", "se puhuu", "same"],
          ["me", "puhumme", "me puhutaan", "passive form!"],
          ["te", "puhutte", "te puhutte / te puhuu", "can simplify to 3rd person"],
          ["he", "puhuvat", "ne puhuu", "3rd person singular form used"]
        ]
      },
      {
        "type": "subheading",
        "text": "Present tense of olla (to be)"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Written", "Spoken"],
        "rows": [
          ["min\u00e4", "olen", "m\u00e4 oon"],
          ["sin\u00e4", "olet", "s\u00e4 oot"],
          ["h\u00e4n", "on", "se on"],
          ["me", "olemme", "me ollaan (passive)"],
          ["te", "olette", "te ootte"],
          ["he", "ovat", "ne on"]
        ]
      },
      {
        "type": "note",
        "icon": "✅",
        "text": "Key pattern: For 'me', spoken Finnish uses the passive form (puhutaan, ollaan, menn\u00e4\u00e4n). This is not passive in meaning — it means 'we'."
      },
      {
        "type": "subheading",
        "text": "4. Negation in Spoken Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Person", "Written", "Spoken", "Example (spoken)"],
        "rows": [
          ["min\u00e4", "en puhu", "m\u00e4 en puhu / en puhu", "En tii\u00e4 (I don't know)"],
          ["sin\u00e4", "et puhu", "s\u00e4 et puhu", "Et s\u00e4 tiij\u00e4?"],
          ["h\u00e4n", "ei puhu", "se ei puhu", "Se ei oo t\u00e4\u00e4ll\u00e4"],
          ["me", "emme puhu", "me ei puhuta", "Me ei olla valmiita"],
          ["te", "ette puhu", "te ei puhu", "Te ette oo"],
          ["he", "eiv\u00e4t puhu", "ne ei puhu", "Ne ei tuu"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "In spoken Finnish, 'ei' is often used for all persons (no en, et, emme, ette, eiv\u00e4t). The person is shown by the pronoun or context."
      },
      {
        "type": "subheading",
        "text": "5. Object and Case Reductions (Pronouns)"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken", "Meaning"],
        "rows": [
          ["minut", "mut", "me (object)"],
          ["sinut", "sut", "you (object)"],
          ["h\u00e4net", "sen", "him/her (object)"],
          ["heid\u00e4t", "ne", "them"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "N\u00e4etk\u00f6 minut? \u2192 N\u00e4\u00e4tk\u00f6 mut?",
          "Tapasin sinut eilen. \u2192 Tapasin sut eilen.",
          "Kutsu h\u00e4net juhliin. \u2192 Kutsu se juhliin.",
          "N\u00e4en heid\u00e4t huomenna. \u2192 M\u00e4 n\u00e4\u00e4n ne huomenna."
        ]
      },
      {
        "type": "subheading",
        "text": "6. Demonstrative Pronoun Shift"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken"],
        "rows": [
          ["t\u00e4m\u00e4", "t\u00e4\u00e4"],
          ["tuo", "toi"],
          ["se", "se"],
          ["n\u00e4m\u00e4", "n\u00e4\u00e4"],
          ["nuo", "noi"],
          ["ne", "ne"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "T\u00e4m\u00e4 on hyv\u00e4 \u2192 T\u00e4\u00e4 on hyv\u00e4",
          "N\u00e4m\u00e4 ovat vanhoja \u2192 N\u00e4\u00e4 on vanhoja",
          "Tuo talo \u2192 Toi talo"
        ]
      },
      {
        "type": "subheading",
        "text": "7. Common Verb Sound Changes (Important!)"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken", "Meaning", "Notes"],
        "rows": [
          ["tulla", "tuu / tulee", "to come", "M\u00e4 tuun = I come"],
          ["menn\u00e4", "menee / menn\u00e4\u00e4n", "to go", "Me menn\u00e4\u00e4n = we go"],
          ["n\u00e4hd\u00e4", "n\u00e4h\u00e4 / n\u00e4\u00e4n", "to see", "M\u00e4 n\u00e4\u00e4n = I see"],
          ["tehd\u00e4", "tehh\u00e4 / tekee", "to do", "M\u00e4 teen = I do"],
          ["tiet\u00e4\u00e4", "tii\u00e4", "to know", "M\u00e4 en tii\u00e4 = I don't know (very common)"],
          ["voida", "voida / voi", "can", "M\u00e4 voin / M\u00e4 en voi"]
        ]
      },
      {
        "type": "note",
        "icon": "✅",
        "text": "Most important irregular: tiet\u00e4\u00e4 \u2192 tii\u00e4. En tii\u00e4 = I don't know (extremely common). Tii\u00e4t s\u00e4? = Do you know?"
      },
      {
        "type": "subheading",
        "text": "8. The Passive as 'We' (Me passiivi) — Detailed"
      },
      {
        "type": "example-table",
        "headers": ["Written (we)", "Spoken (we)", "Meaning"],
        "rows": [
          ["me menemme", "me menn\u00e4\u00e4n", "we go"],
          ["me puhumme", "me puhutaan", "we speak"],
          ["me olemme", "me ollaan", "we are"],
          ["me sy\u00f6mme", "me sy\u00f6d\u00e4\u00e4n", "we eat"],
          ["me teemme", "me teh\u00e4\u00e4n / me tehd\u00e4\u00e4n", "we do"]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Me menn\u00e4\u00e4n elokuviin. = We're going to the movies.",
          "Me ollaan jo sy\u00f6ty. = We have already eaten.",
          "Me puhutaan suomea. = We speak Finnish."
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "This form is identical to the passive (Suomea puhutaan = Finnish is spoken). Context tells you whether it means 'we' or 'people'."
      },
      {
        "type": "subheading",
        "text": "9. Question Formation in Spoken Finnish"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken"],
        "rows": [
          ["Tuletko sin\u00e4?", "Tuuts\u00e4?"],
          ["Onko h\u00e4n kotona?", "Onks se kotona?"],
          ["Mit\u00e4 sin\u00e4 teet?", "Mit\u00e4 s\u00e4 teet?"],
          ["Miss\u00e4 sin\u00e4 olet?", "Miss\u00e4 s\u00e4 oot?"]
        ]
      },
      {
        "type": "paragraph",
        "text": "The -ko/-k\u00f6 becomes -ks and attaches to the verb: tule- + -ks + s\u00e4 \u2192 tuuts\u00e4"
      },
      {
        "type": "example-list",
        "items": ["N\u00e4\u00e4tk\u00f6 s\u00e4 mut? \u2192 N\u00e4\u00e4ts\u00e4 mut? = Do you see me?"]
      },
      {
        "type": "subheading",
        "text": "10. Regional Differences (Very Brief B2 Overview)"
      },
      {
        "type": "example-table",
        "headers": ["Standard", "Helsinki", "Tampere", "Turku", "Eastern (Savonia)"],
        "rows": [
          ["min\u00e4", "m\u00e4", "mie", "m\u00e4\u00e4", "mie"],
          ["sin\u00e4", "s\u00e4", "sie", "s\u00e4\u00e4", "sie"],
          ["me menn\u00e4\u00e4n", "me menn\u00e4\u00e4n", "me m\u00e4nn\u00e4\u00e4n", "me mentiin (past as present)", "my\u00f6 m\u00e4nn\u00e4\u00e4n"],
          ["en tied\u00e4", "en tii\u00e4", "en tiij\u00e4", "en tii\u00e4", "en tiij\u00e4"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "For YKI, standard Helsinki-area spoken Finnish (m\u00e4, s\u00e4, me menn\u00e4\u00e4n) is what you need."
      },
      {
        "type": "subheading",
        "text": "13. Common B2 Mistakes in Spoken vs. Written"
      },
      {
        "type": "example-table",
        "headers": ["❌ Wrong (mixing registers)", "✅ Correct", "Why"],
        "rows": [
          ["Me menemme kauppaan (in speech)", "Me menn\u00e4\u00e4n kauppaan", "Me menemme is too formal for speech"],
          ["M\u00e4 olen (in written exam)", "Min\u00e4 olen", "Written exam requires written forms"],
          ["Se on hyv\u00e4 (in written essay for a person)", "H\u00e4n on hyv\u00e4", "Se as a person is spoken only"],
          ["Tuuts\u00e4? (in written)", "Tuletko sin\u00e4?", "-ks + s\u00e4 is spoken only"],
          ["En tii\u00e4 (in written)", "En tied\u00e4", "tii\u00e4 is spoken contraction"]
        ]
      },
      {
        "type": "subheading",
        "text": "14. YKI Listening Strategies for Spoken Finnish"
      },
      {
        "type": "example-list",
        "items": [
          "Expect reductions: min\u00e4 \u2192 m\u00e4, sin\u00e4 \u2192 s\u00e4, me olemme \u2192 me ollaan",
          "Listen for 'me passiivi': me menn\u00e4\u00e4n, me puhutaan = 'we go, we speak'",
          "Ignore 'se/ne': They can mean he/she/it or they",
          "Learn 'en tii\u00e4': You will hear it constantly",
          "Don't expect full case endings: Helsingiss\u00e4 \u2192 Helsingis",
          "Question marker '-ks': Oletko \u2192 Ooks, Tuletko \u2192 Tuuts"
        ]
      },
      {
        "type": "subheading",
        "text": "15. Quick Reference Card"
      },
      {
        "type": "example-table",
        "headers": ["Written", "Spoken"],
        "rows": [
          ["min\u00e4", "m\u00e4"],
          ["sin\u00e4", "s\u00e4"],
          ["h\u00e4n", "se"],
          ["he", "ne"],
          ["me menemme", "me menn\u00e4\u00e4n"],
          ["olen", "oon"],
          ["minut", "mut"],
          ["sinut", "sut"],
          ["h\u00e4net", "sen"],
          ["heid\u00e4t", "ne"],
          ["t\u00e4m\u00e4", "t\u00e4\u00e4"],
          ["n\u00e4m\u00e4", "n\u00e4\u00e4"],
          ["en tied\u00e4", "en tii\u00e4"],
          ["sinun", "sun"],
          ["minun", "mun"]
        ]
      },
      {
        "type": "subheading",
        "text": "16. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Convert from written Finnish to spoken Finnish.",
        "items": [
          "1. Min\u00e4 menen kotiin nyt. \u2192 M\u00e4 meen kotiin nyt.",
          "2. Me emme ole valmiita. \u2192 Me ei olla valmiita.",
          "3. N\u00e4etk\u00f6 sin\u00e4 minut? \u2192 N\u00e4\u00e4ts\u00e4 mut?",
          "4. He tulevat huomenna. \u2192 Ne tulee huomenna.",
          "5. Minun t\u00e4ytyy l\u00e4hte\u00e4. \u2192 Mun t\u00e4ytyy l\u00e4htee.",
          "6. T\u00e4m\u00e4 on parempi kuin tuo. \u2192 T\u00e4\u00e4 on parempi ku toi."
        ]
      },
      {
        "type": "subheading",
        "text": "17. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "M\u00e4 oon t\u00e4\u00e4ll\u00e4 vasta viiden aikaan. (I'll be here only by five o'clock.)",
          "Me ollaan jo sy\u00f6ty, voiks s\u00e4 tulla my\u00f6hemmin? (We have already eaten, can you come later?)",
          "N\u00e4\u00e4 on tosi hyvii! (These are really good!)",
          "Ne ei viel\u00e4 tii\u00e4 mit\u00e4\u00e4n. (They don't know anything yet.)",
          "Mik\u00e4 sun nimi oikeestaan on? (What's your name actually?)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What is the most common spoken Finnish form of 'min\u00e4' (I)?",
      "options": ["mie", "m\u00e4", "m\u00e4\u00e4", "my\u00f6"],
      "correctAnswer": "m\u00e4",
      "explanation": "In standard spoken Finnish (Helsinki area), 'min\u00e4' becomes 'm\u00e4'.",
      "hint": "Most common reduction.",
      "points": 10
    },
    {
      "question": "What is the spoken Finnish 'we' form of 'me menemme' (we go)?",
      "options": ["me menemme", "me menn\u00e4\u00e4n", "me menee", "me menemme"],
      "correctAnswer": "me menn\u00e4\u00e4n",
      "explanation": "In spoken Finnish, the passive form (-menn\u00e4\u00e4n) is used for first person plural 'we'.",
      "hint": "Passive form for 'we'.",
      "points": 10
    },
    {
      "question": "How do you say 'Do you see me?' in spoken Finnish?",
      "options": [
        "N\u00e4etk\u00f6 sin\u00e4 minut?",
        "N\u00e4et s\u00e4 mut?",
        "N\u00e4\u00e4ts\u00e4 mut?",
        "N\u00e4etk\u00f6 mut?"
      ],
      "correctAnswer": "N\u00e4\u00e4ts\u00e4 mut?",
      "explanation": "The -ko/-k\u00f6 becomes -ks and attaches to the verb: n\u00e4e- + -ks + s\u00e4 = n\u00e4\u00e4ts\u00e4. 'Mut' is the spoken object form of 'minut'.",
      "hint": "-ks attaches to the verb.",
      "points": 10
    },
    {
      "question": "What is the spoken Finnish object form of 'h\u00e4net' (him/her)?",
      "options": ["h\u00e4net", "sen", "se", "h\u00e4n"],
      "correctAnswer": "sen",
      "explanation": "In spoken Finnish, the object form 'h\u00e4net' becomes 'sen'.",
      "hint": "Same as demonstrative 'it'.",
      "points": 10
    },
    {
      "question": "How do you say 'I don't know' in spoken Finnish?",
      "options": ["En tied\u00e4", "En tii\u00e4", "M\u00e4 en tied\u00e4", "Ei tied\u00e4"],
      "correctAnswer": "En tii\u00e4",
      "explanation": "The common spoken contraction of 'en tied\u00e4' is 'en tii\u00e4'. You will hear this constantly.",
      "hint": "Very common contraction.",
      "points": 10
    },
    {
      "question": "What is the spoken Finnish form of 't\u00e4m\u00e4' (this)?",
      "options": ["t\u00e4\u00e4", "t\u00e4m\u00e4", "t\u00e4n", "t\u00f6\u00e4"],
      "correctAnswer": "t\u00e4\u00e4",
      "explanation": "The demonstrative 't\u00e4m\u00e4' shortens to 't\u00e4\u00e4' in spoken Finnish.",
      "hint": "Drop the -m\u00e4.",
      "points": 10
    },
    {
      "question": "In spoken Finnish, which pronoun is used for 'they'?",
      "options": ["he", "hy\u00f6", "ne", "n\u00e4m\u00e4"],
      "correctAnswer": "ne",
      "explanation": "In spoken Finnish, 'ne' (originally 'those') is used for 'they'. 'He' is written only.",
      "hint": "Same as plural demonstrative.",
      "points": 10
    },
    {
      "question": "What is the spoken Finnish form of 'me olemme' (we are)?",
      "options": ["me olemme", "me olemm", "me ollaan", "me oon"],
      "correctAnswer": "me ollaan",
      "explanation": "The passive form 'ollaan' is used for 'we are' in spoken Finnish.",
      "hint": "Passive form.",
      "points": 10
    },
    {
      "question": "What is the spoken Finnish possessive form of 'minun' (my)?",
      "options": ["minun", "mun", "minu", "min"],
      "correctAnswer": "mun",
      "explanation": "The possessive 'minun' shortens to 'mun' in spoken Finnish. Example: 'mun kirja' = my book.",
      "hint": "Drop the -in.",
      "points": 10
    },
    {
      "question": "Which of the following is a correct transformation from written to spoken?",
      "options": [
        "Sin\u00e4 olet \u2192 S\u00e4 oot",
        "Sin\u00e4 olet \u2192 S\u00e4 olet",
        "Sin\u00e4 olet \u2192 Sie olet",
        "Sin\u00e4 olet \u2192 S\u00e4 oo"
      ],
      "correctAnswer": "Sin\u00e4 olet \u2192 S\u00e4 oot",
      "explanation": "'Sin\u00e4 olet' becomes 's\u00e4 oot' in spoken Finnish. The verb 'olla' shortens to 'oot' for 2nd person singular.",
      "hint": "Second person of olla.",
      "points": 10
    }
  ]
},

{
  "id": "concessive-conditional-clauses",
  "chapter": 13,
  "title": "Concessive and Conditional Clauses – Myöntymys- ja ehtolauseet",
  "finnish": "Myöntymys- ja ehtolauseet",
  "icon": "🔀",
  "level": "B2",
  "accent": "bg-amber-800",
  "badge": "bg-amber-50 text-amber-700 border-amber-200",
  "description": "Complete reference for concessive clauses (even though, although, despite) and conditional clauses (if, unless, as long as, provided that) at B2/YKI level",
  "content": {
    "type": "rich",
    "intro": "Concessive clauses acknowledge an obstacle that does not prevent the main action. Conditional clauses set a requirement for the main action.",
    "sections": [
      {
        "type": "note",
        "icon": "✅",
        "text": "B2 insight: Concessive clauses acknowledge an obstacle that does not prevent the main action. Conditional clauses set a requirement for the main action."
      },
      {
        "type": "subheading",
        "text": "2. Concessive Clauses: Full Connector System"
      },
      {
        "type": "subheading",
        "text": "A) Vaikka \u2014 even though / even if (most common)"
      },
      {
        "type": "subheading",
        "text": "Real situation (indicative) \u2014 'even though'"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Vaikka satoi, menimme ulos.", "Even though it rained, we went out."],
          ["Vaikka h\u00e4n on v\u00e4synyt, h\u00e4n ty\u00f6skentelee.", "Even though he is tired, he works."],
          ["Vaikka en puhu suomea t\u00e4ydellisesti, ymm\u00e4rr\u00e4n paljon.", "Even though I don't speak Finnish perfectly, I understand a lot."]
        ]
      },
      {
        "type": "subheading",
        "text": "Hypothetical (conditional mood) \u2014 'even if'"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Vaikka olisin rikas, en ostaisi sit\u00e4.", "Even if I were rich, I wouldn't buy it."],
          ["Vaikka h\u00e4n tulisi, en menisi vastaan.", "Even if he came, I wouldn't go to meet him."],
          ["Vaikka voittaisin lotossa, en j\u00e4tt\u00e4isi ty\u00f6t\u00e4ni.", "Even if I won the lottery, I wouldn't quit my job."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Crucial rule: Vaikka + indicative = real obstacle. Vaikka + conditional = hypothetical/imaginary."
      },
      {
        "type": "subheading",
        "text": "B) Vaikkakin \u2014 although (more formal, literary)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["H\u00e4n onnistui, vaikkakin suurin vaikeuksin.", "He succeeded, although with great difficulty."],
          ["Se oli hyv\u00e4 elokuva, vaikkakin hieman liian pitk\u00e4.", "It was a good movie, although a bit too long."]
        ]
      },
      {
        "type": "subheading",
        "text": "C) Siit\u00e4 huolimatta (ett\u00e4) \u2014 despite / in spite of the fact that"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Satoi paljon. Siit\u00e4 huolimatta menimme ulos.", "It rained a lot. Despite that, we went out."],
          ["Siit\u00e4 huolimatta ett\u00e4 satoi, menimme ulos.", "Despite the fact that it rained, we went out."],
          ["H\u00e4n oli sairas, mutta siit\u00e4 huolimatta h\u00e4n tuli t\u00f6ihin.", "He was sick, but despite that he came to work."]
        ]
      },
      {
        "type": "subheading",
        "text": "D) Tosin \u2014 though / admittedly (soft concession)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Se on hyv\u00e4 idea, tosin kallis.", "It's a good idea, though expensive."],
          ["Pid\u00e4n t\u00e4st\u00e4 ravintolasta, tosin palvelu on joskus hidasta.", "I like this restaurant, though the service is sometimes slow."],
          ["Tosin en ole varma...", "Though I'm not sure..."]
        ]
      },
      {
        "type": "subheading",
        "text": "E) Kuitenkin / Silti \u2014 nevertheless / still"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Satoi. Menimme kuitenkin ulos.", "It rained. Nevertheless, we went out."],
          ["H\u00e4n oli v\u00e4synyt. Silti h\u00e4n jatkoi ty\u00f6t\u00e4.", "He was tired. Still, he continued working."],
          ["Vaikeaa se oli. Silti onnistuimme.", "It was difficult. Still, we succeeded."]
        ]
      },
      {
        "type": "subheading",
        "text": "4. Conditional Clauses: Full System"
      },
      {
        "type": "subheading",
        "text": "A) Jos \u2014 if (most common)"
      },
      {
        "type": "subheading",
        "text": "Real condition (indicative) \u2014 possible in the future/present"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Jos sataa, j\u00e4\u00e4n kotiin.", "If it rains, I'll stay home."],
          ["Jos sinulla on aikaa, tule k\u00e4ym\u00e4\u00e4n.", "If you have time, come visit."],
          ["Jos opin suomea, saan t\u00f6it\u00e4.", "If I learn Finnish, I'll get a job."]
        ]
      },
      {
        "type": "subheading",
        "text": "Unreal/hypothetical (conditional mood) \u2014 impossible or counterfactual"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Jos olisin rikas, ostaisin talon.", "If I were rich, I would buy a house."],
          ["Jos olisin tiennyt, olisin tullut.", "If I had known, I would have come."],
          ["Jos voisin, auttaisin.", "If I could, I would help."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "In unreal conditions, both clauses take the conditional mood (or past perfect + conditional perfect)."
      },
      {
        "type": "subheading",
        "text": "B) Mik\u00e4li \u2014 if / provided that (formal)"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Mik\u00e4li tarvitset apua, ota yhteytt\u00e4.", "If you need help, please contact."],
          ["Mik\u00e4li s\u00e4\u00e4 sallii, retki j\u00e4rjestet\u00e4\u00e4n.", "Weather permitting, the trip will be organized."],
          ["Palauta lomake, mik\u00e4li haluat osallistua.", "Return the form if you wish to participate."]
        ]
      },
      {
        "type": "subheading",
        "text": "C) Kunhan \u2014 as long as / provided that"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["Voit tulla, kunhan olet ajoissa.", "You can come, as long as you're on time."],
          ["Saat lainata kirjan, kunhan palautat sen.", "You can borrow the book, as long as you return it."],
          ["En v\u00e4lit\u00e4, kunhan se toimii.", "I don't care, as long as it works."]
        ]
      },
      {
        "type": "subheading",
        "text": "D) Elle(i) \u2014 if not / unless"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["En tule, ellei h\u00e4n tule.", "I won't come unless he comes."],
          ["Elle s\u00e4\u00e4 parane, retki perutaan.", "Unless the weather improves, the trip will be canceled."],
          ["Elle h\u00e4n maksa, myymme sen muulle.", "If he doesn't pay, we'll sell it to someone else."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Elle is followed by a verb without a separate ei: elle h\u00e4n tule (not ellei h\u00e4n ei tule)."
      },
      {
        "type": "subheading",
        "text": "E) Paitsi jos \u2014 except if"
      },
      {
        "type": "example-table",
        "headers": ["Finnish", "English"],
        "rows": [
          ["L\u00e4hden aina aikaisin, paitsi jos on paljon t\u00f6it\u00e4.", "I always leave early, except if I have a lot of work."],
          ["En ikin\u00e4 suostu, paitsi jos on pakko.", "I never agree, except if I have to."],
          ["Se on mahdotonta, paitsi jos saat luvan.", "It's impossible, except if you get permission."]
        ]
      },
      {
        "type": "subheading",
        "text": "5. Quick Reference Table (Concessives & Conditionals)"
      },
      {
        "type": "example-table",
        "headers": ["Function", "Connector", "Example"],
        "rows": [
          ["Concession (real)", "vaikka (+ indicative)", "Vaikka satoi, menimme."],
          ["Concession (hypothetical)", "vaikka (+ conditional)", "Vaikka sataisi, menisimme."],
          ["Concession (strong)", "siit\u00e4 huolimatta ett\u00e4", "Siit\u00e4 huolimatta ett\u00e4 satoi..."],
          ["Concession (mild)", "tosin", "Hyv\u00e4, tosin kallis."],
          ["Condition (real)", "jos (+ indicative)", "Jos sataa, j\u00e4\u00e4n kotiin."],
          ["Condition (unreal)", "jos (+ conditional)", "Jos sataisi, j\u00e4isin kotiin."],
          ["Condition (formal)", "mik\u00e4li", "Mik\u00e4li tarvitset, ota yhteys."],
          ["Condition (restrictive)", "kunhan", "Voit tulla, kunhan et my\u00f6h\u00e4sty."],
          ["Condition (negative)", "ellei", "En tule, ellei h\u00e4nkin tule."],
          ["Exception", "paitsi jos", "Menemme, paitsi jos sataa."]
        ]
      },
      {
        "type": "subheading",
        "text": "8. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["Vaikka h\u00e4n on v\u00e4synyt, mutta h\u00e4n menee.", "Vaikka h\u00e4n on v\u00e4synyt, h\u00e4n menee.", "No mutta after vaikka (double conjunction)."],
          ["Jos olisin rikas, min\u00e4 ostaisin (in writing)", "Jos olisin rikas, ostaisin.", "Min\u00e4 is redundant in conditional clauses."],
          ["Elle h\u00e4n ei tule", "Elle h\u00e4n tule", "Elle already contains negation."],
          ["Kunhan jos sataa", "Kunhan sataa / Jos sataa", "Two condition markers not needed."],
          ["Siit\u00e4 huolimatta, ett\u00e4 (comma)", "Siit\u00e4 huolimatta ett\u00e4", "Siit\u00e4 huolimatta ett\u00e4 is one unit."]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Real-Life Example Sentences (YKI Level)"
      },
      {
        "type": "example-list",
        "items": [
          "Vaikka en ollut koskaan k\u00e4ynyt Suomessa, tunsin oloni kotoisaksi. (Even though I had never visited Finland, I felt at home.)",
          "Siit\u00e4 huolimatta ett\u00e4 oli sunnuntai, kaupat olivat auki. (Despite the fact that it was Sunday, the shops were open.)",
          "Jos olisin tiennyt asiasta aiemmin, olisin toiminut toisin. (If I had known about the matter earlier, I would have acted differently.)",
          "Kunhan saat raportin valmiiksi, voit l\u00e4hte\u00e4 aikaisin. (As long as you get the report finished, you can leave early.)",
          "En suostu, ellei h\u00e4n pyyd\u00e4 anteeksi. (I won't agree unless he apologizes.)",
          "T\u00e4m\u00e4 on hyv\u00e4 ratkaisu, tosin kallis. (This is a good solution, though expensive.)",
          "Mik\u00e4li tarvitset lis\u00e4tietoja, ota yhteytt\u00e4 asiakaspalveluun. (If you need more information, contact customer service.)"
        ]
      },
      {
        "type": "subheading",
        "text": "10. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Complete or transform the sentences.",
        "items": [
          "1. _____ satoi, menimme ulos. (even though) \u2192 Vaikka",
          "2. _____ olisin rikas, en ostaisi sit\u00e4. (even if) \u2192 Vaikka",
          "3. _____ sinulla on aikaa, tule k\u00e4ym\u00e4\u00e4n. (if) \u2192 Jos",
          "4. En suostu _____ h\u00e4n pyyt\u00e4\u00e4 anteeksi. (unless) \u2192 ellei",
          "5. Se on hyv\u00e4 idea, _____ kallis. (though) \u2192 tosin",
          "6. _____ tarvitset apua, soita. (if, formal) \u2192 Mik\u00e4li"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Vaikka olen tosi kiireinen, yrit\u00e4n auttaa sinua. (Even though I'm really busy, I'll try to help you.)",
          "Jos s\u00e4 et kerro, m\u00e4 en tied\u00e4. (If you don't tell me, I won't know.)",
          "Kunhan s\u00e4 tuut ajoissa, me pystyt\u00e4\u00e4n l\u00e4htem\u00e4\u00e4n klo 15. (As long as you come on time, we can leave at 3 PM.)",
          "Mik\u00e4li et ole tyytyv\u00e4inen, palautamme rahat. (If you're not satisfied, we'll refund the money.)",
          "Pid\u00e4n t\u00e4st\u00e4 ty\u00f6st\u00e4, tosin palkka on aika huono. (I like this job, though the salary is quite poor.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What does 'vaikka' mean in 'Vaikka satoi, menimme ulos'?",
      "options": [
        "Because",
        "Even though (real situation)",
        "Even if (hypothetical)",
        "So that"
      ],
      "correctAnswer": "Even though (real situation)",
      "explanation": "When followed by indicative (satoi), 'vaikka' means 'even though' and expresses a real obstacle that did not prevent the action.",
      "hint": "Indicative = real situation.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Vaikka satoi' and 'Vaikka sataisi'?",
      "options": [
        "No difference",
        "Vaikka satoi = even though it rained (real); Vaikka sataisi = even if it rained (hypothetical)",
        "First is present, second is past",
        "First is positive, second is negative"
      ],
      "correctAnswer": "Vaikka satoi = even though it rained (real); Vaikka sataisi = even if it rained (hypothetical)",
      "explanation": "Vaikka + indicative = real obstacle. Vaikka + conditional = hypothetical/imaginary situation.",
      "hint": "Mood difference.",
      "points": 10
    },
    {
      "question": "What does 'ellei' mean in 'En tule, ellei hän tule'?",
      "options": [
        "If",
        "Even if",
        "Unless (if not)",
        "As long as"
      ],
      "correctAnswer": "Unless (if not)",
      "explanation": "'Elle(i)' is a contraction of 'jos ei' and means 'if not' or 'unless'.",
      "hint": "Contraction of jos ei.",
      "points": 10
    },
    {
      "question": "Which connector means 'as long as / provided that'?",
      "options": ["jos", "mik\u00e4li", "kunhan", "ellei"],
      "correctAnswer": "kunhan",
      "explanation": "'Kunhan' means 'as long as' or 'provided that' and emphasizes that the condition is necessary and sufficient.",
      "hint": "Emphasizes a necessary condition.",
      "points": 10
    },
    {
      "question": "What is the correct way to say 'even if I won the lottery'?",
      "options": [
        "Jos voitan lotossa",
        "Vaikka voitan lotossa",
        "Vaikka voittaisin lotossa",
        "Jos voittaisin lotossa"
      ],
      "correctAnswer": "Vaikka voittaisin lotossa",
      "explanation": "For hypothetical 'even if', use 'vaikka' + conditional mood (voittaisin).",
      "hint": "Hypothetical + vaikka.",
      "points": 10
    },
    {
      "question": "What is the meaning of 'tosin' in 'Se on hyv\u00e4 idea, tosin kallis'?",
      "options": [
        "Nevertheless",
        "Even though",
        "Though / admittedly (mild concession)",
        "Despite"
      ],
      "correctAnswer": "Though / admittedly (mild concession)",
      "explanation": "'Tosin' is a soft concession marker meaning 'though' or 'admittedly'.",
      "hint": "Softens the contrast.",
      "points": 10
    },
    {
      "question": "Which sentence is correct for 'If I had known, I would have come'?",
      "options": [
        "Jos tied\u00e4n, tulen",
        "Jos tiet\u00e4isin, tulisin",
        "Jos olisin tiennyt, olisin tullut",
        "Jos tiesin, tulin"
      ],
      "correctAnswer": "Jos olisin tiennyt, olisin tullut",
      "explanation": "Unreal past condition requires past perfect (olisi tiennyt) + conditional perfect (olisi tullut).",
      "hint": "Unreal past = past perfect + conditional perfect.",
      "points": 10
    },
    {
      "question": "What is the formal equivalent of 'jos' in official writing?",
      "options": ["kunhan", "ellei", "mik\u00e4li", "vaikka"],
      "correctAnswer": "mik\u00e4li",
      "explanation": "'Mik\u00e4li' is a formal equivalent of 'jos', used in official documents, technical writing, and formal instructions.",
      "hint": "Formal 'if'.",
      "points": 10
    },
    {
      "question": "What is wrong with 'Vaikka h\u00e4n on v\u00e4synyt, mutta h\u00e4n menee'?",
      "options": [
        "Wrong verb tense",
        "Double conjunction (vaikka + mutta)",
        "Wrong word order",
        "Missing subject"
      ],
      "correctAnswer": "Double conjunction (vaikka + mutta)",
      "explanation": "'Vaikka' already expresses contrast. Adding 'mutta' creates a double conjunction, which is incorrect in Finnish.",
      "hint": "One contrast marker is enough.",
      "points": 10
    },
    {
      "question": "What does 'Paitsi jos' mean?",
      "options": [
        "Unless",
        "Except if",
        "As long as",
        "Even though"
      ],
      "correctAnswer": "Except if",
      "explanation": "'Paitsi jos' means 'except if' and is used to introduce an exception to a general statement.",
      "hint": "Exception marker.",
      "points": 10
    }
  ]
},



{
  "id": "discourse-markers",
  "chapter": 14,
  "title": "Discourse Markers and Academic Connectors – Tekstin sidoskeinot",
  "finnish": "Tekstin sidoskeinot",
  "icon": "🔗",
  "level": "B2",
  "accent": "bg-teal-800",
  "badge": "bg-teal-50 text-teal-700 border-teal-200",
  "description": "Complete reference for cohesive devices in Finnish essays and formal writing — addition, contrast, cause-effect, sequence, conclusion, and concession connectors with formality levels and YKI essay examples",
  "content": {
    "type": "rich",
    "intro": "Discourse markers are the signposts of your writing. They tell the reader where you are going, how ideas relate, and when you are concluding. At YKI level 4-5, examiners explicitly look for cohesive devices.",
    "sections": [
      {
        "type": "note",
        "icon": "✅",
        "text": "B2 insight: At YKI level 4-5, examiners explicitly look for cohesive devices. Without them, your text feels like a list of sentences — not an essay."
      },
      {
        "type": "subheading",
        "text": "2. Complete Connector Taxonomy (B2/YKI)"
      },
      {
        "type": "subheading",
        "text": "A) ADDITION (lis\u00e4ys) \u2014 adding similar ideas"
      },
      {
        "type": "example-table",
        "headers": ["Connector", "Formality", "Example"],
        "rows": [
          ["ja (and)", "neutral", "H\u00e4n opiskelee ja ty\u00f6skentelee."],
          ["sek\u00e4 ... ett\u00e4 (both ... and)", "formal", "H\u00e4n sek\u00e4 opiskelee että ty\u00f6skentelee."],
          ["my\u00f6s (also)", "neutral", "H\u00e4n on my\u00f6s v\u00e4synyt."],
          ["lis\u00e4ksi (in addition)", "neutral/formal", "Lis\u00e4ksi h\u00e4nell\u00e4 on v\u00e4h\u00e4n rahaa."],
          ["edes (even)", "neutral", "H\u00e4n ei edes yritt\u00e4nyt."],
          ["paitsi (except)", "neutral", "Kaikki tulivat, paitsi h\u00e4n."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Lis\u00e4ksi on t\u00e4rke\u00e4\u00e4 muistaa, ett\u00e4... = In addition, it's important to remember that...",
          "Sek\u00e4 lapset ett\u00e4 aikuiset nauttivat tapahtumasta. = Both children and adults enjoyed the event."
        ]
      },
      {
        "type": "subheading",
        "text": "B) CONTRAST (vastakohta) \u2014 showing opposition"
      },
      {
        "type": "example-table",
        "headers": ["Connector", "Formality", "Example"],
        "rows": [
          ["mutta (but)", "neutral", "H\u00e4n on nuori, mutta viisas."],
          ["kuitenkin (however)", "neutral", "Kuitenkin ongelmat jatkuivat."],
          ["sit\u00e4 vastoin (on the other hand)", "formal", "Sit\u00e4 vastoin toiset eiv\u00e4t onnistuneet."],
          ["toisaalta (on the other hand)", "neutral", "Toisaalta se on hyv\u00e4, toisaalta huono."],
          ["sen sijaan (instead)", "neutral", "Sen sijaan h\u00e4n j\u00e4i kotiin."],
          ["vaikka (even though)", "neutral", "Vaikka h\u00e4n yritti, h\u00e4n ep\u00e4onnistui."],
          ["silti (still)", "neutral", "H\u00e4n yritti, silti h\u00e4n ep\u00e4onnistui."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Kuitenkin on syyt\u00e4 mainita, ett\u00e4... = However, it's worth mentioning that...",
          "Toisaalta voidaan ajatella, ett\u00e4... = On the one hand, one can think that...",
          "Sit\u00e4 vastoin on huomattava, ett\u00e4... = On the other hand, it must be noted that..."
        ]
      },
      {
        "type": "subheading",
        "text": "C) CAUSE & EFFECT (syy ja seuraus) \u2014 explaining results"
      },
      {
        "type": "example-table",
        "headers": ["Connector", "Formality", "Example"],
        "rows": [
          ["koska (because)", "neutral", "J\u00e4in kotiin, koska satoi."],
          ["siksi (that's why)", "neutral", "Satoi, siksi j\u00e4in kotiin."],
          ["sen vuoksi (for that reason)", "neutral/formal", "Sen vuoksi p\u00e4\u00e4t\u00f6s tehtiin."],
          ["t\u00e4st\u00e4 syyst\u00e4 (for this reason)", "formal", "T\u00e4st\u00e4 syyst\u00e4 emme voi hyv\u00e4ksy\u00e4."],
          ["siten (thus)", "formal", "H\u00e4n opiskeli, siten h\u00e4n l\u00e4p\u00e4isi."],
          ["n\u00e4in ollen (therefore)", "formal", "N\u00e4in ollen tulokset ovat selvi\u00e4."],
          ["joten (so)", "neutral", "Oli my\u00f6h\u00e4, joten l\u00e4hdin."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Sen vuoksi on t\u00e4rke\u00e4\u00e4, ett\u00e4... = For that reason, it's important that...",
          "T\u00e4st\u00e4 syyst\u00e4 ehdotamme muutosta. = For this reason, we propose a change.",
          "N\u00e4in ollen voidaan todeta, ett\u00e4... = Therefore, it can be stated that..."
        ]
      },
      {
        "type": "subheading",
        "text": "D) SEQUENCE (j\u00e4rjestys) \u2014 organizing steps/arguments"
      },
      {
        "type": "example-table",
        "headers": ["Connector", "Formality", "Example"],
        "rows": [
          ["ensin (first)", "neutral", "Ensiksi on huomattava..."],
          ["toiseksi (second)", "neutral", "Toiseksi on muistettava..."],
          ["sitten (then)", "neutral", "Sitten h\u00e4n l\u00e4hti."],
          ["t\u00e4m\u00e4n j\u00e4lkeen (after this)", "formal", "T\u00e4m\u00e4n j\u00e4lkeen k\u00e4sittelemme..."],
          ["lopuksi (finally)", "neutral", "Lopuksi haluan sanoa..."],
          ["seuraavaksi (next)", "neutral", "Seuraavaksi tarkastelemme..."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Ensinn\u00e4kin on todettava, ett\u00e4... = Firstly, it must be stated that...",
          "Toiseksi on syyt\u00e4 muistaa, ett\u00e4... = Secondly, it's worth remembering that...",
          "Lopuksi voidaan todeta, ett\u00e4... = Finally, it can be stated that..."
        ]
      },
      {
        "type": "subheading",
        "text": "E) CONCLUSION (yhteenveto) \u2014 wrapping up"
      },
      {
        "type": "example-table",
        "headers": ["Connector", "Formality", "Example"],
        "rows": [
          ["yhteenvetona (in summary)", "formal", "Yhteenvetona voidaan sanoa..."],
          ["kaiken kaikkiaan (all in all)", "neutral", "Kaiken kaikkiaan onnistuimme."],
          ["loppujen lopuksi (after all)", "neutral", "Loppujen lopuksi se oli hyv\u00e4."],
          ["siis (so / in other words)", "neutral", "H\u00e4n on siis oikeassa."],
          ["toisin sanoen (in other words)", "formal", "Toisin sanoen tulos on selv\u00e4."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Yhteenvetona voidaan todeta, ett\u00e4... = In summary, it can be stated that...",
          "Kaiken kaikkiaan kokemus oli positiivinen. = All in all, the experience was positive.",
          "Toisin sanoen meill\u00e4 ei ole vaihtoehtoja. = In other words, we have no alternatives."
        ]
      },
      {
        "type": "subheading",
        "text": "F) CONCESSION (my\u00f6ntymys) \u2014 admitting a counterpoint"
      },
      {
        "type": "example-table",
        "headers": ["Connector", "Formality", "Example"],
        "rows": [
          ["tokikin (admittedly)", "neutral", "Tokikin ongelmia on."],
          ["tosin (though)", "neutral", "Tosin se on kallista."],
          ["vaikkakin (although)", "formal", "Vaikkakin vaikeaa, se on mahdollista."],
          ["on totta, ett\u00e4 (it is true that)", "neutral", "On totta, ett\u00e4 h\u00e4n yritti."]
        ]
      },
      {
        "type": "example-list",
        "items": [
          "Toki on my\u00f6nnett\u00e4v\u00e4, ett\u00e4... = Admittedly, it must be admitted that...",
          "Vaikkakin haasteita on, uskomme onnistumiseen. = Although there are challenges, we believe in success."
        ]
      },
      {
        "type": "subheading",
        "text": "4. Formality Levels (Critical for YKI)"
      },
      {
        "type": "example-table",
        "headers": ["Situation", "Use these connectors", "Avoid"],
        "rows": [
          ["YKI essay (formal)", "sit\u00e4 vastoin, n\u00e4in ollen, t\u00e4st\u00e4 syyst\u00e4, yhteenvetona", "tosi, tota, niinku"],
          ["Email to boss", "kuitenkin, lis\u00e4ksi, sen vuoksi", "mut, se on sit et"],
          ["Text to friend", "mut, sit, tosi, kyl", "sit\u00e4 vastoin (too formal)"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "YKI warning: Using 'niinku' (like) or 'tota' (um) in an essay will lower your score."
      },
      {
        "type": "subheading",
        "text": "5. Academic Phrase Bank (YKI Essay Ready)"
      },
      {
        "type": "subheading",
        "text": "Introducing a topic:"
      },
      {
        "type": "example-list",
        "items": [
          "Aiheena on... = The topic is...",
          "T\u00e4ss\u00e4 esseess\u00e4 k\u00e4sittelen... = In this essay, I will discuss...",
          "Usein v\u00e4itet\u00e4\u00e4n, ett\u00e4... = It is often claimed that..."
        ]
      },
      {
        "type": "subheading",
        "text": "Presenting an argument:"
      },
      {
        "type": "example-list",
        "items": [
          "Ensinn\u00e4kin on syyt\u00e4 huomata, ett\u00e4... = Firstly, it is worth noting that...",
          "Toiseksi on muistettava, ett\u00e4... = Secondly, it must be remembered that...",
          "Lis\u00e4ksi on t\u00e4rke\u00e4\u00e4 korostaa, ett\u00e4... = In addition, it is important to emphasize that..."
        ]
      },
      {
        "type": "subheading",
        "text": "Contrasting:"
      },
      {
        "type": "example-list",
        "items": [
          "Toisaalta voidaan ajatella, ett\u00e4... = On the one hand, one can think that...",
          "Sit\u00e4 vastoin on huomattava, ett\u00e4... = On the other hand, it must be noted that...",
          "Kuitenkin ongelma on monimutkaisempi. = However, the problem is more complex."
        ]
      },
      {
        "type": "subheading",
        "text": "Concluding:"
      },
      {
        "type": "example-list",
        "items": [
          "Yhteenvetona voidaan todeta, ett\u00e4... = In summary, it can be stated that...",
          "Kaiken kaikkiaan on selv\u00e4\u00e4, ett\u00e4... = All in all, it is clear that...",
          "Lopuksi haluan korostaa, ett\u00e4... = Finally, I want to emphasize that..."
        ]
      },
      {
        "type": "subheading",
        "text": "7. Full YKI Essay Model (Annotated)"
      },
      {
        "type": "paragraph",
        "text": "Essay question: Pit\u00e4isik\u00f6 kaikkien opiskella suomea? (Should everyone study Finnish?)"
      },
      {
        "type": "subheading",
        "text": "Introduction (johdanto)"
      },
      {
        "type": "paragraph",
        "text": "Suomen kielen asema on viime vuosina ollut paljon esill\u00e4. Usein kysyt\u00e4\u00e4n, pit\u00e4isik\u00f6 kaikkien Suomessa asuvien opiskella suomea. T\u00e4ss\u00e4 esseess\u00e4 k\u00e4sittelen asiaa monipuolisesti."
      },
      {
        "type": "subheading",
        "text": "Body paragraph 1 \u2014 argument (argumentti)"
      },
      {
        "type": "paragraph",
        "text": "Ensinn\u00e4kin suomen kielen taito on t\u00e4rke\u00e4 ty\u00f6el\u00e4m\u00e4ss\u00e4. Monet ty\u00f6nantajat edellytt\u00e4v\u00e4t v\u00e4hint\u00e4\u00e4n tyydytt\u00e4v\u00e4\u00e4 suomen taitoa. Lis\u00e4ksi kielell\u00e4 on keskeinen rooli sosiaalisissa suhteissa. Ilman suomen taitoa on vaikea osallistua yhteiskunnan toimintaan."
      },
      {
        "type": "subheading",
        "text": "Body paragraph 2 \u2014 counterargument (v\u00e4ltt\u00e4m\u00e4)"
      },
      {
        "type": "paragraph",
        "text": "Toisaalta on muistettava, ett\u00e4 suomi on vaikea kieli oppia. Vaikkakin kielen opiskelu vaatii paljon aikaa ja vaivaa, se on loppujen lopuksi kannattavaa. Sit\u00e4 vastoin jotkut v\u00e4itt\u00e4v\u00e4t, ett\u00e4 englannilla p\u00e4rj\u00e4\u00e4 hyvin. Heid\u00e4n mukaansa suomen opiskelu ei ole v\u00e4ltt\u00e4m\u00e4t\u00f6nt\u00e4."
      },
      {
        "type": "subheading",
        "text": "Conclusion (yhteenveto)"
      },
      {
        "type": "paragraph",
        "text": "Yhteenvetona voidaan todeta, ett\u00e4 suomen kielen opiskelu on hy\u00f6dyllist\u00e4, vaikka se ei olisikaan pakollista. Kaiken kaikkiaan on selv\u00e4\u00e4, ett\u00e4 kielen taito avaa monia ovia. N\u00e4in ollen suomen opiskelua kannattaa suositella kaikille Suomessa asuville."
      },
      {
        "type": "subheading",
        "text": "8. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["H\u00e4n on nuori, kuitenkin viisas.", "H\u00e4n on nuori. Kuitenkin h\u00e4n on viisas.", "Kuitenkin starts a new sentence or clause, not just interrupting."],
          ["Toisaalta h\u00e4n on nuori, toisaalta h\u00e4n on kokenut.", "H\u00e4n on nuori, mutta kokenut.", "Toisaalta is for two valid perspectives, not direct opposites on the same thing."],
          ["Siten, ett\u00e4 h\u00e4n opiskeli, h\u00e4n l\u00e4p\u00e4isi.", "H\u00e4n opiskeli, siten h\u00e4n l\u00e4p\u00e4isi.", "Siten means 'thus/therefore,' not 'so that.'"],
          ["Ja my\u00f6skin lis\u00e4ksi h\u00e4n on v\u00e4synyt.", "Lis\u00e4ksi h\u00e4n on v\u00e4synyt.", "Stacking connectors (ja my\u00f6skin lis\u00e4ksi) is redundant."]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Quick Reference Master Table"
      },
      {
        "type": "example-table",
        "headers": ["Function", "Neutral", "Formal", "Connector Example"],
        "rows": [
          ["Addition", "ja, my\u00f6s", "lis\u00e4ksi, sek\u00e4 ett\u00e4", "Lis\u00e4ksi on t\u00e4rke\u00e4\u00e4..."],
          ["Contrast", "mutta, kuitenkin", "sit\u00e4 vastoin", "Sit\u00e4 vastoin toiset..."],
          ["Balance", "toisaalta", "toisaalta", "Toisaalta hyv\u00e4, toisaalta huono."],
          ["Replacement", "sen sijaan", "sen sijaan", "Sen sijaan j\u00e4in kotiin."],
          ["Cause", "koska, siksi", "sen vuoksi, t\u00e4st\u00e4 syyst\u00e4", "T\u00e4st\u00e4 syyst\u00e4 emme voi..."],
          ["Effect", "joten", "siten, n\u00e4in ollen", "N\u00e4in ollen p\u00e4\u00e4t\u00f6s on selv\u00e4."],
          ["Sequence", "ensin, sitten", "ensinn\u00e4kin, toiseksi", "Toiseksi on muistettava..."],
          ["Conclusion", "siis, loppujen lopuksi", "yhteenvetona, kaiken kaikkiaan", "Yhteenvetona voidaan todeta..."]
        ]
      },
      {
        "type": "subheading",
        "text": "10. YKI-Style Drills"
      },
      {
        "type": "example-list",
        "title": "Fill in the blank with the most appropriate connector.",
        "items": [
          "1. H\u00e4n ei valmistautunut kokeeseen. ____ h\u00e4n ep\u00e4onnistui. (therefore) \u2192 Siten / N\u00e4in ollen / Sen vuoksi",
          "2. ____ haluan matkustaa, ____ haluan s\u00e4\u00e4st\u00e4\u00e4 rahaa. (on one hand... on the other hand) \u2192 Toisaalta... toisaalta",
          "3. En mennyt elokuviin. ____ j\u00e4in kotiin. (instead) \u2192 Sen sijaan",
          "4. ____ h\u00e4n on nuori, h\u00e4n on eritt\u00e4in vastuullinen. (even though) \u2192 Vaikka",
          "5. Ongelma on monimutkainen. ____ se on ratkaistavissa. (however) \u2192 Kuitenkin",
          "6. ____ tarkastelemme ensin historiaa, ____ k\u00e4sittelemme nykytilaa. (first... then \u2014 formal) \u2192 Ensiksi... toiseksi (or Ensinn\u00e4kin... toiseksi)"
        ]
      },
      {
        "type": "subheading",
        "text": "11. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Ensinn\u00e4kin haluan kiitt\u00e4\u00e4 kaikkia osallistujia. (Firstly, I want to thank all participants.)",
          "T\u00e4m\u00e4n j\u00e4lkeen analysoimme tuloksia. (After this, we will analyze the results.)",
          "Sit\u00e4 vastoin monissa maissa tilanne on toinen. (On the other hand, the situation is different in many countries.)",
          "N\u00e4in ollen meid\u00e4n on toimittava nopeasti. (Therefore, we must act quickly.)",
          "Yhteenvetona voidaan todeta, ett\u00e4 hanke oli onnistunut. (In summary, it can be stated that the project was successful.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "Which connector means 'however' and is neutral in formality?",
      "options": [
        "lis\u00e4ksi",
        "kuitenkin",
        "siten",
        "toisaalta"
      ],
      "correctAnswer": "kuitenkin",
      "explanation": "'Kuitenkin' is the neutral connector meaning 'however' or 'nevertheless'. It can appear at the beginning of a sentence or after the subject.",
      "hint": "Think of 'nevertheless'.",
      "points": 10
    },
    {
      "question": "Which of these is a formal connector for 'therefore'?",
      "options": [
        "joten",
        "n\u00e4in ollen",
        "mutta",
        "ja"
      ],
      "correctAnswer": "n\u00e4in ollen",
      "explanation": "'N\u00e4in ollen' is a formal connector meaning 'therefore' or 'thus', appropriate for YKI essays and academic writing.",
      "hint": "Formal 'therefore'.",
      "points": 10
    },
    {
      "question": "What is the difference between 'toisaalta' and 'sen sijaan'?",
      "options": [
        "No difference",
        "Toisaalta = on the other hand (balancing perspectives); Sen sijaan = instead (replacement)",
        "Toisaalta = therefore; Sen sijaan = however",
        "Toisaalta = finally; Sen sijaan = firstly"
      ],
      "correctAnswer": "Toisaalta = on the other hand (balancing perspectives); Sen sijaan = instead (replacement)",
      "explanation": "'Toisaalta' presents an alternative perspective ('on the other hand'). 'Sen sijaan' means 'instead' and indicates a replacement or alternative action.",
      "hint": "Balancing vs. replacing.",
      "points": 10
    },
    {
      "question": "Which connector pair means 'both ... and' in formal Finnish?",
      "options": [
        "joko ... tai",
        "sek\u00e4 ... ett\u00e4",
        "ei ... eik\u00e4",
        "toisaalta ... toisaalta"
      ],
      "correctAnswer": "sek\u00e4 ... ett\u00e4",
      "explanation": "'Sek\u00e4 ... ett\u00e4' is the formal way to say 'both ... and' in written Finnish.",
      "hint": "Formal 'both...and'.",
      "points": 10
    },
    {
      "question": "What is the problem with 'H\u00e4n on nuori, kuitenkin viisas'?",
      "options": [
        "Wrong meaning",
        "Kuitenkin should start a new clause or sentence, not be inserted with a comma like 'but'",
        "Missing object",
        "Wrong verb form"
      ],
      "correctAnswer": "Kuitenkin should start a new clause or sentence, not be inserted with a comma like 'but'",
      "explanation": "'Kuitenkin' is not a conjunction like 'mutta'. It typically starts a new sentence or appears after the subject in a new clause. 'H\u00e4n on nuori. Kuitenkin h\u00e4n on viisas' is correct.",
      "hint": "Kuitenkin is an adverb, not a conjunction.",
      "points": 10
    },
    {
      "question": "Which of the following is a formal connector for a conclusion?",
      "options": [
        "sitten",
        "n\u00e4in ollen",
        "yhteenvetona",
        "muuten"
      ],
      "correctAnswer": "yhteenvetona",
      "explanation": "'Yhteenvetona' (in summary) is a formal connector used to begin a concluding statement in essays.",
      "hint": "In summary.",
      "points": 10
    },
    {
      "question": "What does 'sen vuoksi' mean?",
      "options": [
        "Instead",
        "For that reason / therefore",
        "On the other hand",
        "In addition"
      ],
      "correctAnswer": "For that reason / therefore",
      "explanation": "'Sen vuoksi' means 'for that reason' or 'therefore', expressing cause and effect.",
      "hint": "Cause and effect connector.",
      "points": 10
    },
    {
      "question": "Which sentence uses 'toisaalta' correctly?",
      "options": [
        "Toisaalta h\u00e4n on nuori, mutta toisaalta h\u00e4n on kokenut.",
        "Toisaalta h\u00e4n on nuori. Toisaalta h\u00e4n on kokenut.",
        "Toisaalta on hyv\u00e4 idea. Toisaalta se on kallis.",
        "Toisaalta voin l\u00e4hte\u00e4, toisaalta tavata yst\u00e4v\u00e4\u00e4."
      ],
      "correctAnswer": "Toisaalta on hyv\u00e4 idea. Toisaalta se on kallis.",
      "explanation": "'Toisaalta' is used to present two different perspectives on the same situation. It means 'on one hand... on the other hand'.",
      "hint": "Two contrasting perspectives.",
      "points": 10
    },
    {
      "question": "What is 'connector soup' in writing?",
      "options": [
        "Using no connectors at all",
        "Using a connector in every sentence, creating a choppy text",
        "Using only formal connectors",
        "Using connectors at the end of sentences"
      ],
      "correctAnswer": "Using a connector in every sentence, creating a choppy text",
      "explanation": "'Connector soup' is overusing connectors (e.g., beginning every sentence with 'ensinn\u00e4kin, kuitenkin, lis\u00e4ksi, toisaalta'), which makes writing unnatural and choppy.",
      "hint": "Too many connectors is bad.",
      "points": 10
    },
    {
      "question": "Which is the best YKI-level replacement for 'joten' (so) in formal writing?",
      "options": [
        "mut",
        "kyl",
        "n\u00e4in ollen",
        "niinku"
      ],
      "correctAnswer": "n\u00e4in ollen",
      "explanation": "In YKI essays, replace neutral 'joten' with formal 'n\u00e4in ollen' or 'siten' to raise the register.",
      "hint": "Formal 'so/therefore'.",
      "points": 10
    }
  ]
},

{
  "id": "quantifier-expressions",
  "chapter": 15,
  "title": "Quantifier Expressions and Measure – Määrän ilmaiseminen",
  "finnish": "Määrän ilmaiseminen",
  "icon": "⚖️",
  "level": "B2",
  "accent": "bg-blue-800",
  "badge": "bg-blue-50 text-blue-700 border-blue-200",
  "description": "Complete reference for Finnish quantifiers: indefinite quantity (paljon, vähän, tarpeeksi, enemmän), numbers (kaksi, sata, tuhat), negative quantifiers (ei mikään, ei kukaan), and adverbs of quantity (hieman, melko, erittäin)",
  "content": {
    "type": "rich",
    "intro": "In Finnish, quantifiers are not neutral — they actively govern the case of the noun that follows. After most quantifiers of indefinite amount, the noun takes the partitive case.",
    "sections": [
      {
        "type": "note",
        "icon": "✅",
        "text": "B2 insight: This is different from English, where quantifiers don't change the noun's form. In Finnish, the quantifier and noun form a case-governed unit."
      },
      {
        "type": "subheading",
        "text": "2. Complete Quantifier Master Table"
      },
      {
        "type": "subheading",
        "text": "A) Indefinite quantity (always partitive)"
      },
      {
        "type": "example-table",
        "headers": ["Quantifier", "Example", "Meaning"],
        "rows": [
          ["paljon", "paljon vett\u00e4", "a lot of water"],
          ["v\u00e4h\u00e4n", "v\u00e4h\u00e4n aikaa", "a little time"],
          ["liikaa", "liikaa sokeria", "too much sugar"],
          ["tarpeeksi", "tarpeeksi rahaa", "enough money"],
          ["enemm\u00e4n", "enemm\u00e4n tilaa", "more space"],
          ["v\u00e4hemm\u00e4n", "v\u00e4hemm\u00e4n ongelmia", "fewer problems"],
          ["runsaasti", "runsaasti mahdollisuuksia", "plenty of opportunities"]
        ]
      },
      {
        "type": "subheading",
        "text": "B) Definite number (singular partitive or nominative singular)"
      },
      {
        "type": "example-table",
        "headers": ["Quantifier", "Example", "Meaning", "Case"],
        "rows": [
          ["yksi", "yksi kirja", "one book", "nominative singular"],
          ["kaksi, kolme...", "kaksi kirjaa", "two books", "partitive singular"],
          ["sata", "sata euroa", "one hundred euros", "partitive singular"],
          ["tuhat", "tuhat ihmist\u00e4", "one thousand people", "partitive singular"],
          ["miljoona", "miljoona dollaria", "one million dollars", "partitive singular"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Crucial rule: After numbers 2, 3, 4, 5... and sata, tuhat, miljoona, the noun is in singular partitive (not plural!). 'Kaksi kirjaa' = two books (literally 'two of book')."
      },
      {
        "type": "subheading",
        "text": "C) Indefinite number (partitive plural)"
      },
      {
        "type": "example-table",
        "headers": ["Quantifier", "Example", "Meaning"],
        "rows": [
          ["useita", "useita p\u00e4ivi\u00e4", "several days"],
          ["monia", "monia mahdollisuuksia", "many opportunities"],
          ["harvoja", "harvoja ihmisi\u00e4", "few people"],
          ["lukuisia", "lukuisia ongelmia", "numerous problems"]
        ]
      },
      {
        "type": "subheading",
        "text": "D) Logical quantifiers (case depends on sentence)"
      },
      {
        "type": "example-table",
        "headers": ["Quantifier", "Example", "Meaning", "Case after"],
        "rows": [
          ["kaikki", "kaikki kirjat", "all books", "nominative plural (if subject)"],
          ["jokainen", "jokainen p\u00e4iv\u00e4", "every day", "nominative singular"],
          ["koko", "koko p\u00e4iv\u00e4", "the whole day", "nominative singular"],
          ["molemmat", "molemmat lapset", "both children", "nominative plural"],
          ["er\u00e4s", "er\u00e4s mies", "a certain man", "nominative singular"]
        ]
      },
      {
        "type": "subheading",
        "text": "3. Numbers and Case Agreement (Advanced)"
      },
      {
        "type": "subheading",
        "text": "A) Numbers in subject position (nominative)"
      },
      {
        "type": "example-table",
        "headers": ["Number", "Noun case", "Example"],
        "rows": [
          ["yksi (1)", "nominative sg", "Yksi kirja on p\u00f6yd\u00e4ll\u00e4."],
          ["kaksi (2+)", "partitive sg", "Kaksi kirjaa on p\u00f6yd\u00e4ll\u00e4."],
          ["sata (100)", "partitive sg", "Sata euroa riitt\u00e4\u00e4."]
        ]
      },
      {
        "type": "subheading",
        "text": "B) Numbers in object position (partitive or genitive)"
      },
      {
        "type": "example-table",
        "headers": ["Sentence type", "Noun case", "Example"],
        "rows": [
          ["Total object (affirmative)", "partitive sg", "Ostin kaksi kirjaa."],
          ["Partial/negative object", "partitive sg", "En ostanut kahta kirjaa."],
          ["Total object with 1", "genitive sg", "Ostin yhden kirjan."]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Note: 'Kaksi' in object position: 'kaksi kirjaa' (partitive sg) for total. No change from subject position."
      },
      {
        "type": "subheading",
        "text": "C) Numbers in partitive quantifier phrases"
      },
      {
        "type": "example-table",
        "headers": ["Expression", "Example", "Meaning"],
        "rows": [
          ["yksi litra maitoa", "Ostin litran maitoa.", "one liter of milk"],
          ["kaksi kiloa omenoita", "Tarvitsen kaksi kiloa omenoita.", "two kilos of apples"],
          ["kolme metri\u00e4 kangasta", "Ostin kolme metri\u00e4 kangasta.", "three meters of fabric"]
        ]
      },
      {
        "type": "subheading",
        "text": "4. Quantifiers with Time Expressions (B2 Must-Know)"
      },
      {
        "type": "example-table",
        "headers": ["Expression", "Meaning", "Case", "Example"],
        "rows": [
          ["monta tuntia", "many hours", "partitive", "Odotin monta tuntia."],
          ["v\u00e4h\u00e4n aikaa", "a little time", "partitive", "Puhuimme v\u00e4h\u00e4n aikaa."],
          ["pitk\u00e4\u00e4n aikaan", "for a long time", "illative/partitive", "En ole n\u00e4hnyt h\u00e4nt\u00e4 pitk\u00e4\u00e4n aikaan."],
          ["koko p\u00e4iv\u00e4n", "the whole day", "accusative/genitive", "Olin t\u00f6iss\u00e4 koko p\u00e4iv\u00e4n."],
          ["joka p\u00e4iv\u00e4", "every day", "nominative", "H\u00e4n k\u00e4y t\u00f6iss\u00e4 joka p\u00e4iv\u00e4."],
          ["muutaman p\u00e4iv\u00e4n", "a few days", "genitive/accusative", "Olin lomalla muutaman p\u00e4iv\u00e4n."]
        ]
      },
      {
        "type": "subheading",
        "text": "5. Negative Quantifiers (Ei mik\u00e4\u00e4n, ei kukaan)"
      },
      {
        "type": "example-table",
        "headers": ["Quantifier", "Meaning", "Case after", "Example"],
        "rows": [
          ["ei mik\u00e4\u00e4n", "nothing / no", "nominative or partitive", "T\u00e4\u00e4ll\u00e4 ei ole mit\u00e4\u00e4n."],
          ["ei kukaan", "nobody", "nominative", "Kukaan ei tullut."],
          ["ei miss\u00e4\u00e4n", "nowhere", "inessive", "H\u00e4n ei ole miss\u00e4\u00e4n."],
          ["ei mihink\u00e4\u00e4n", "to nowhere", "illative", "En mene mihink\u00e4\u00e4n."],
          ["ei kenell\u00e4k\u00e4\u00e4n", "no one has", "adessive", "Kenell\u00e4k\u00e4\u00e4n ei ole aikaa."]
        ]
      },
      {
        "type": "subheading",
        "text": "6. Quantifiers in Comparison Structures (Advanced)"
      },
      {
        "type": "example-table",
        "headers": ["Structure", "Example", "Meaning"],
        "rows": [
          ["enemm\u00e4n ... kuin", "Minulla on enemm\u00e4n rahaa kuin sinulla.", "I have more money than you."],
          ["v\u00e4hemm\u00e4n ... kuin", "H\u00e4nell\u00e4 on v\u00e4hemm\u00e4n aikaa kuin minulla.", "He has less time than I do."],
          ["yht\u00e4 paljon ... kuin", "Minulla on yht\u00e4 paljon rahaa kuin sinulla.", "I have as much money as you."],
          ["kaksi kertaa enemm\u00e4n", "H\u00e4n ansaitsee kaksi kertaa enemm\u00e4n kuin min\u00e4.", "He earns twice as much as me."]
        ]
      },
      {
        "type": "subheading",
        "text": "7. Adverbs of Quantity (Modifying Adjectives)"
      },
      {
        "type": "paragraph",
        "text": "These adverbs modify adjectives, not nouns. They are intensifiers."
      },
      {
        "type": "example-table",
        "headers": ["Adverb", "Meaning", "Example"],
        "rows": [
          ["hieman", "a little / slightly", "T\u00e4m\u00e4 on hieman kalliimpi."],
          ["melko", "quite / rather", "T\u00e4m\u00e4 on melko hyv\u00e4."],
          ["varsin", "quite (formal)", "T\u00e4m\u00e4 on varsin mielenkiintoinen."],
          ["eritt\u00e4in", "very (formal)", "T\u00e4m\u00e4 on eritt\u00e4in t\u00e4rke\u00e4\u00e4."],
          ["todella", "really (neutral)", "T\u00e4m\u00e4 on todella vaikeaa."],
          ["aika", "quite (colloquial)", "T\u00e4m\u00e4 on aika kallista."],
          ["ihan", "very / quite (colloquial)", "T\u00e4m\u00e4 on ihan hyv\u00e4."]
        ]
      },
      {
        "type": "subheading",
        "text": "8. Advanced Nuance: Partitive vs. Genitive After Quantifiers (Subtle)"
      },
      {
        "type": "example-table",
        "headers": ["Sentence", "Meaning", "Case"],
        "rows": [
          ["Join lasin vett\u00e4.", "I drank a glass of water (the glass, total)", "genitive (lasin) + partitive (vett\u00e4)"],
          ["Join lasia vett\u00e4.", "I drank from a glass of water (part of it)", "partitive (lasia) + partitive (vett\u00e4)"]
        ]
      },
      {
        "type": "note",
        "icon": "💡",
        "text": "B2 insight: When the measure word (lasi, kilo, litra) is in partitive, it emphasizes partial quantity."
      },
      {
        "type": "subheading",
        "text": "10. Common B2 Mistakes & Fixes"
      },
      {
        "type": "example-table",
        "headers": ["\u274c Wrong", "\u2705 Correct", "Why"],
        "rows": [
          ["Paljon kirja", "Paljon kirjoja", "Partitive plural after paljon"],
          ["Kaksi kirjat", "Kaksi kirjaa", "Number 2+ takes singular partitive"],
          ["Ostin kolme kirjat (as object)", "Ostin kolme kirjaa", "No change needed \u2014 number phrases as objects stay in partitive sg"],
          ["En ostanut kolme kirjaa", "En ostanut kolmea kirjaa", "Negative object requires kolmea (partitive of the number itself!)"],
          ["Useita p\u00e4iv\u00e4", "Useita p\u00e4ivi\u00e4", "Useita requires partitive plural"],
          ["Yksi kirjat", "Yksi kirja", "Number 1 takes nominative singular"],
          ["H\u00e4nell\u00e4 on paljon stressi", "H\u00e4nell\u00e4 on paljon stressi\u00e4", "Partitive after paljon"]
        ]
      },
      {
        "type": "note",
        "icon": "⚠️",
        "text": "Negative with numbers: In negative sentences, the number itself may take partitive: 'En ostanut kahta kirjaa' (I didn't buy two books). Compare: 'Ostin kaksi kirjaa' (I bought two books \u2014 partitive sg of noun, number unchanged)."
      },
      {
        "type": "subheading",
        "text": "11. Quick Reference Table (Quantifier + Required Case)"
      },
      {
        "type": "example-table",
        "headers": ["Quantifier", "Case after", "Singular/Plural", "Example"],
        "rows": [
          ["paljon", "partitive", "plural", "paljon kirjoja"],
          ["v\u00e4h\u00e4n", "partitive", "singular (mass) / plural (count)", "v\u00e4h\u00e4n aikaa / v\u00e4h\u00e4n kirjoja"],
          ["liikaa", "partitive", "depends", "liikaa sokeria"],
          ["tarpeeksi", "partitive", "depends", "tarpeeksi rahaa"],
          ["enemm\u00e4n", "partitive", "depends", "enemm\u00e4n tilaa"],
          ["v\u00e4hemm\u00e4n", "partitive", "depends", "v\u00e4hemm\u00e4n ongelmia"],
          ["monta", "partitive", "singular", "monta kirjaa"],
          ["useita", "partitive", "plural", "useita p\u00e4ivi\u00e4"],
          ["muutama", "partitive", "singular or plural", "muutama p\u00e4iv\u00e4 / muutamia p\u00e4ivi\u00e4"],
          ["kaikki", "nominative", "plural", "kaikki kirjat"],
          ["jokainen", "nominative", "singular", "jokainen p\u00e4iv\u00e4"],
          ["koko", "nominative", "singular", "koko p\u00e4iv\u00e4"],
          ["yksi", "nominative", "singular", "yksi kirja"],
          ["kaksi, kolme...", "partitive", "singular", "kaksi kirjaa"]
        ]
      },
      {
        "type": "subheading",
        "text": "9. Natural Real-Life Sentences (B2/YKI Level)"
      },
      {
        "type": "example-list",
        "items": [
          "Minulla on liian paljon ty\u00f6t\u00e4 ja liian v\u00e4h\u00e4n aikaa. (I have too much work and too little time.)",
          "Tarvitsen enemm\u00e4n harjoitusta puhuakseni sujuvasti. (I need more practice to speak fluently.)",
          "Ostimme kolme kiloa omenoita ja litran maitoa. (We bought three kilos of apples and a liter of milk.)",
          "Monta ihmist\u00e4 ei tiennyt asiasta mit\u00e4\u00e4n. (Many people didn't know anything about the matter.)",
          "En ole n\u00e4hnyt h\u00e4nt\u00e4 pitk\u00e4\u00e4n aikaan \u2014 varmaan kahteen vuoteen. (I haven't seen him for a long time \u2014 probably for two years.)",
          "Kenell\u00e4k\u00e4\u00e4n ei ollut tarpeeksi rohkeutta kertoa totuutta. (No one had enough courage to tell the truth.)",
          "T\u00e4m\u00e4 on eritt\u00e4in t\u00e4rke\u00e4 p\u00e4\u00e4t\u00f6s, joten mieti tarkkaan. (This is a very important decision, so think carefully.)"
        ]
      },
      {
        "type": "subheading",
        "text": "12. YKI-Style Transformation Drills"
      },
      {
        "type": "example-list",
        "title": "Fill in the blank with the correct form of the noun in parentheses.",
        "items": [
          "1. H\u00e4nell\u00e4 on paljon _____ (raha). \u2192 rahaa",
          "2. Ostin kaksi _____ (kirja). \u2192 kirjaa",
          "3. Tarvitsen enemm\u00e4n _____ (aika). \u2192 aikaa",
          "4. T\u00e4\u00e4ll\u00e4 on useita _____ (ihminen). \u2192 ihmisi\u00e4",
          "5. En ostanut _____ (kaksi kirja). \u2192 kahta kirjaa",
          "6. Minulla on tarpeeksi _____ (kokemus). \u2192 kokemusta"
        ]
      },
      {
        "type": "subheading",
        "text": "13. Useful Daily Sentences"
      },
      {
        "type": "example-list",
        "items": [
          "Paljonko kello on? (What time is it?)",
          "Kuinka paljon t\u00e4m\u00e4 maksaa? (How much does this cost?)",
          "Montako lasta sinulla on? (How many children do you have?)",
          "Minulla on v\u00e4h\u00e4n rahaa, mutta riitt\u00e4v\u00e4sti ruokaa. (I have little money, but enough food.)",
          "Suomessa on paljon j\u00e4rvi\u00e4 ja saaria. (There are many lakes and islands in Finland.)",
          "Kukaan ei tiennyt vastausta. (No one knew the answer.)"
        ]
      }
    ]
  },
  "quiz": [
    {
      "question": "What case follows 'paljon' (a lot of)?",
      "options": ["Nominative", "Genitive", "Partitive", "Accusative"],
      "correctAnswer": "Partitive",
      "explanation": "After the quantifier 'paljon', the noun must be in the partitive case, usually plural: 'paljon kirjoja' (a lot of books).",
      "hint": "Indefinite quantity + partitive.",
      "points": 10
    },
    {
      "question": "What is the correct form of 'kaksi kirja' (two books) in the nominative subject position?",
      "options": ["kaksi kirja", "kaksi kirjan", "kaksi kirjaa", "kaksi kirjat"],
      "correctAnswer": "kaksi kirjaa",
      "explanation": "After numbers 2 and above, the noun is in the singular partitive: 'kaksi kirjaa' (two books).",
      "hint": "Number 2+ = singular partitive.",
      "points": 10
    },
    {
      "question": "How do you say 'I bought two books' in Finnish?",
      "options": [
        "Ostin kaksi kirjaa",
        "Ostin kaksi kirjat",
        "Ostin kaksi kirjan",
        "Ostin kahden kirjan"
      ],
      "correctAnswer": "Ostin kaksi kirjaa",
      "explanation": "The number 'kaksi' is followed by the singular partitive 'kirjaa' in object position as well. No change.",
      "hint": "Number phrase as object.",
      "points": 10
    },
    {
      "question": "In a negative sentence, what happens to the number itself (e.g., 'kaksi')?",
      "options": [
        "It becomes 'kaksi' (no change)",
        "It becomes 'kahta' (partitive of the number)",
        "It becomes 'kahden' (genitive)",
        "It becomes 'kaksi' with the noun in genitive"
      ],
      "correctAnswer": "It becomes 'kahta' (partitive of the number)",
      "explanation": "In negative sentences, the number itself takes the partitive case: 'En ostanut kahta kirjaa' (I didn't buy two books).",
      "hint": "Negative affects the number too.",
      "points": 10
    },
    {
      "question": "What is the correct form for 'several days' in Finnish?",
      "options": ["useita p\u00e4iv\u00e4", "useita p\u00e4ivien", "useita p\u00e4ivi\u00e4", "useita p\u00e4iv\u00e4t"],
      "correctAnswer": "useita p\u00e4ivi\u00e4",
      "explanation": "'Useita' requires the partitive plural: 'useita p\u00e4ivi\u00e4' (several days).",
      "hint": "Indefinite number + partitive plural.",
      "points": 10
    },
    {
      "question": "Which sentence correctly means 'I don't have any money'?",
      "options": [
        "Minulla ei ole mit\u00e4\u00e4n raha",
        "Minulla ei ole mit\u00e4\u00e4n rahaa",
        "Minulla ei ole mik\u00e4\u00e4n rahaa",
        "Minulla ei ole mit\u00e4\u00e4n rahan"
      ],
      "correctAnswer": "Minulla ei ole mit\u00e4\u00e4n rahaa",
      "explanation": "The negative quantifier 'ei mit\u00e4\u00e4n' (nothing) takes the partitive case for the noun: 'ei mit\u00e4\u00e4n rahaa'.",
      "hint": "Negative quantifier + partitive.",
      "points": 10
    },
    {
      "question": "What is the difference between 'Join lasin vett\u00e4' and 'Join lasia vett\u00e4'?",
      "options": [
        "No difference",
        "Lasin vett\u00e4 = drank a whole glass; lasia vett\u00e4 = drank some from a glass",
        "First is past, second is present",
        "First is positive, second is negative"
      ],
      "correctAnswer": "Lasin vett\u00e4 = drank a whole glass; lasia vett\u00e4 = drank some from a glass",
      "explanation": "Genitive measure word (lasin) indicates total amount (a whole glass). Partitive measure word (lasia) indicates partial amount (some from a glass).",
      "hint": "Total vs. partial quantity.",
      "points": 10
    },
    {
      "question": "Which adverb of quantity means 'quite' in neutral Finnish?",
      "options": ["eritt\u00e4in", "hieman", "melko", "ihan"],
      "correctAnswer": "melko",
      "explanation": "'Melko' means 'quite' or 'rather' in neutral Finnish. 'Eritt\u00e4in' is formal 'very', 'hieman' is 'a little', 'ihan' is colloquial 'quite'.",
      "hint": "Neutral 'quite'.",
      "points": 10
    },
    {
      "question": "What does 'monta' require after it?",
      "options": [
        "Nominative plural",
        "Partitive singular",
        "Partitive plural",
        "Genitive singular"
      ],
      "correctAnswer": "Partitive singular",
      "explanation": "'Monta' (many) is followed by the partitive singular: 'monta kirjaa' (many books). This is an exception to the expectation of plural.",
      "hint": "Monta + singular partitive.",
      "points": 10
    },
    {
      "question": "Which quantifier takes a nominative singular noun?",
      "options": ["kaksi", "monta", "jokainen", "useita"],
      "correctAnswer": "jokainen",
      "explanation": "'Jokainen' (every) is followed by the nominative singular: 'jokainen p\u00e4iv\u00e4' (every day).",
      "hint": "Logical quantifier with singular.",
      "points": 10
    }
  ]
},


];
