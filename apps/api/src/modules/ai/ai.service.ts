import * as https from 'node:https';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AiService {
  private groq: OpenAI;

  private readonly FINNMATE_SYSTEM_PROMPT = `You are FinnMate 🇫🇮, an expert Finnish language tutor and AI companion.
You help learners at all CEFR levels (A1–C2) master Finnish in an engaging, supportive way.

YOUR CORE SKILLS:
• Finnish grammar: all 15 cases, verb types 1-6, conjugation, passive voice, word order, possessive suffixes
• Vocabulary: food, travel, emotions, work, relationships, numbers, time, Finnish culture
• Pronunciation guidance with phonetic help
• Real-life conversation practice
• YKI exam preparation strategies
• Translation between Finnish and any language

TEACHING STYLE:
• Warm, patient, encouraging — never condescending
• Give corrections immediately but kindly with a "✓ Great try! Here's the corrected form:"
• Always explain WHY a correction is needed, not just WHAT is wrong
• Include a real-life example for every grammar rule
• Celebrate progress with genuine encouragement
• Use relatable contexts (Finnish seasons, sauna culture, Helsinki life)

WHEN USER WRITES FINNISH:
1. Praise the attempt genuinely
2. Correct errors with explanation
3. Show the corrected version clearly
4. Suggest a practice follow-up`;

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    // Groq uses OpenAI-compatible API — just different baseURL and key
    this.groq = new OpenAI({
      apiKey: config.get<string>('groq.apiKey') || 'missing',
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async chat(userId: string, message: string, history: Array<{ role: string; content: string }> = []) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, finnishLevel: true, nativeLanguage: true },
    });

    const systemPrompt = `${this.FINNMATE_SYSTEM_PROMPT}

CURRENT LEARNER PROFILE:
- Name: ${user?.firstName || 'Friend'}
- Finnish level: ${user?.finnishLevel || 'A1'}
- Native language: ${user?.nativeLanguage || 'ENGLISH'}
Tailor ALL explanations and vocabulary to this exact level.`;

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-12).map((m) => ({ role: m.role as any, content: m.content })),
      { role: 'user', content: message },
    ];

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages,
      max_tokens: 1200,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content || '';

    await Promise.all([
      this.prisma.chatMessage.create({ data: { userId, role: 'user', content: message } }),
      this.prisma.chatMessage.create({
        data: { userId, role: 'assistant', content: reply, tokens: completion.usage?.total_tokens || 0 },
      }),
    ]);

    return { message: reply, tokens: completion.usage?.total_tokens || 0 };
  }

  async correctGrammar(text: string, level: string, nativeLang: string) {
    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a highly qualified Finnish language teacher and YKI (Yleinen kielitutkinto) examiner. The learner's current level is ${level || 'A2'} and their native language is ${nativeLang || 'English'}.

Your task is to carefully analyze, correct, and evaluate the Finnish text with a professional, pedagogical approach.

For every submission you MUST:
1. Produce a fully corrected standard written Finnish (kirjakieli) version.
2. List every mistake with: the exact wrong phrase, the correct phrase, a clear explanation covering grammar case / verb conjugation / vocabulary / word order as applicable, and the CEFR level of the mistake (A1/A2/B1/B2/C1).
3. Evaluate naturalness honestly: "natural", "slightly unnatural", or "unnatural". If not fully natural, provide a more native-like alternative.
4. Detect puhekieli (spoken Finnish): if present, explain it and give the kirjakieli equivalent.
5. Give a score 0–100 based on: accuracy (50 pts), vocabulary (25 pts), naturalness (25 pts).
6. Write overallFeedback in an encouraging but honest examiner tone — 2–3 sentences max.

Respond ONLY with valid JSON matching this exact schema (no extra keys, no markdown):
{
  "hasErrors": boolean,
  "correctedText": "kirjakieli corrected version",
  "naturalVersion": "more native-like version if different from correctedText, else same as correctedText",
  "errors": [
    {
      "original": "exact wrong text from the input",
      "correction": "correct replacement",
      "explanation": "clear pedagogical explanation",
      "type": "grammar | vocabulary | structure | puhekieli",
      "level": "A1 | A2 | B1 | B2 | C1"
    }
  ],
  "naturalness": "natural | slightly unnatural | unnatural",
  "naturalnessNote": "one sentence explaining the naturalness rating",
  "puhekieli": "explanation of spoken Finnish used, or null if none detected",
  "overallFeedback": "2-3 sentence examiner-style feedback",
  "score": number
}`,
        },
        { role: 'user', content: `Analyze this Finnish text: "${text}"` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  async translate(text: string, from: string, to: string, context?: string) {
    const isFinnish = from === 'fi';
    const contextBlock = context ? `\n\nThe word appears in this sentence (use it to resolve ambiguity): "${context}"` : '';
    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: isFinnish
            ? `You are a Finnish grammar and translation expert. The user gives you a single Finnish word that may be grammatically inflected (Finnish has 15 cases plus possessive suffixes).

Step 1 – use the sentence context (if provided) to resolve ambiguity.
Step 2 – identify the base/dictionary form.
Step 3 – identify the grammatical case or form being used.
Step 4 – provide both the base meaning AND the meaning in this specific inflected form.

Examples:
- "koulusta": baseForm="koulu", translation="school", form="from school", grammaticalCase="elative case (-sta/-stä)"
- "talossa": baseForm="talo", translation="house", form="in the house", grammaticalCase="inessive case (-ssa/-ssä)"
- "kirjoja": baseForm="kirja", translation="book", form="books (some books)", grammaticalCase="partitive plural (-ja/-jä)"
- "lohikeiton": baseForm="lohikeitto", translation="salmon soup", form="of the salmon soup", grammaticalCase="genitive case (-n)"
- "luokseen": baseForm="luokse", translation="to (someone's presence)", form="to him/her/them", grammaticalCase="allative + 3rd person possessive suffix (-en)"
- "koulu": baseForm="koulu", translation="school", form="school", grammaticalCase="nominative"

Rules:
- Always fill in all four fields.
- If the word is already in nominative (base form), grammaticalCase = "nominative".
- Never invent meanings.

Respond ONLY with valid JSON:
{
  "translation": "base form English meaning (e.g. school)",
  "form": "meaning in this inflected form (e.g. from school)",
  "baseForm": "Finnish dictionary/base form",
  "grammaticalCase": "case name and suffix (e.g. elative case (-sta/-stä))"
}`
            : `Translate from ${from} to ${to}. Respond ONLY with valid JSON:
{
  "translation": "string",
  "notes": "string"
}`,
        },
        { role: 'user', content: `${text}${contextBlock}` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0,
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  private addNaturalPauses(text: string): string {
    return '<speak>' +
      text
        .replace(/\n\n+/g, '<break time="900ms"/>')
        .replace(/\n/g, '<break time="500ms"/>')
        .replace(/([.!?])\s+/g, '$1<break time="650ms"/> ')
        .replace(/,\s+/g, ',<break time="200ms"/> ')
      + '</speak>';
  }

  async textToSpeech(text: string): Promise<Buffer> {
    const apiKey = this.config.get<string>('elevenlabs.apiKey');
    if (!apiKey) throw new Error('ELEVENLABS_API_KEY is not configured');
    const voiceId = this.config.get<string>('elevenlabs.voiceId') || 'pNInz6obpgDQGcFmaJgB';

    const body = JSON.stringify({
      text: this.addNaturalPauses(text),
      model_id: 'eleven_multilingual_v2',
      enable_ssml_parsing: true,
      voice_settings: { stability: 0.5, similarity_boost: 0.75, speed: 0.9 },
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'api.elevenlabs.io',
          path: `/v1/text-to-speech/${voiceId}`,
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => {
            const buf = Buffer.concat(chunks);
            if (res.statusCode !== 200) {
              reject(new Error(`ElevenLabs TTS error ${res.statusCode}: ${buf.toString()}`));
            } else {
              resolve(buf);
            }
          });
        },
      );
      req.on('error', reject);
      req.write(body);
      req.end();
    });
  }

  async speechToText(audioBuffer: Buffer): Promise<string> {
    // Groq's Whisper is free and fast
    const file = new File([new Uint8Array(audioBuffer)], 'audio.webm', { type: 'audio/webm' });
    const transcription = await this.groq.audio.transcriptions.create({
      file,
      model: this.config.get<string>('groq.whisperModel') || 'whisper-large-v3',
      language: 'fi',
    });
    return transcription.text;
  }

  async scorePronunciation(targetText: string, audioBuffer: Buffer) {
    const transcribed = await this.speechToText(audioBuffer);

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a Finnish pronunciation evaluator. Compare what was said vs what should have been said.
All scores MUST be integers from 0 to 100 (not decimals, not fractions — whole numbers only).
Respond ONLY with valid JSON:
{
  "pronunciationScore": integer 0-100,
  "fluencyScore": integer 0-100,
  "accuracyScore": integer 0-100,
  "transcribed": "string",
  "feedback": "string",
  "improvements": ["string"]
}`,
        },
        {
          role: 'user',
          content: `Target: "${targetText}" | Transcribed: "${transcribed}"`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  private readonly READING_TOPICS = [
    // Finland & Nordic
    'Finland\'s road to independence in 1917 and the civil war that followed',
    'The Winter War of 1939–1940 between Finland and the Soviet Union',
    'Finland joining NATO in 2023 and the geopolitical shift it caused',
    'The Finnish education system and why it consistently ranks among the best in the world',
    'The Sámi people: Finland\'s indigenous population, their language, and land rights',
    'Finnish immigration and integration policy in the 2020s',
    'The right to roam (jokamiehenoikeus) and Finnish everyman\'s rights under law',
    'Nokia\'s rise and fall, and Finland\'s pivot to a startup economy',
    'Finnish gender equality milestones: the first female president and prime minister',
    'Helsinki\'s urban development and its plan to be carbon-neutral by 2030',
    'The Russian invasion of Ukraine and how Finland has responded diplomatically and militarily',
    'Finland\'s social security and welfare state: how it works and its funding challenges',
    'The Swedish-speaking minority in Finland and the status of Swedish as an official language',
    'Finnish media freedom: why Finland consistently ranks first in the World Press Freedom Index',
    'The Continuation War (1941–1944) and the Moscow Armistice',
    'Artificial intelligence regulation in the European Union and its impact on Finnish tech companies',
    'Climate change in the Arctic and its effects on Finnish Lapland',
    'The history of Finnish sauna culture and its UNESCO recognition',
    'Finland\'s healthcare system: strengths, regional disparities, and reform debates',
    'Supercell, Rovio, and the Finnish gaming industry\'s global impact',
    'The Finnish language: its Uralic roots and why it is unrelated to most European languages',
    'Food security and agriculture policy in Finland amid global supply chain disruptions',
    'Finland\'s forest industry: balancing economic value with biodiversity protection',
    'The EU AI Act and what it means for technology companies in Finland',
    'Finnish alcohol policy and the history of Alko as a state monopoly',
    'The aging population crisis in Finland and its impact on pension policy',
    'Cybersecurity threats facing Nordic countries and Finland\'s national cyber strategy',
    'The history of the Finnish parliament (Eduskunta) and democratic reforms',
    'Finland\'s participation in UN peacekeeping missions around the world',
    'The rise of populism in Finland and the Finns Party\'s electoral success',
    // Global Politics & Geopolitics
    'The rise of BRICS and its challenge to Western economic and political dominance',
    'The long-term impact of the Cold War on today\'s military alliances and global order',
    'China\'s Belt and Road Initiative and its role in global infrastructure diplomacy',
    'The future of NATO in a multipolar world after Russia\'s invasion of Ukraine',
    'The geopolitics of rare earth minerals and how they shape global supply chains',
    'The role of the United Nations in modern armed conflicts and its effectiveness',
    // Technology & AI
    'The rise of generative AI and tools like ChatGPT: opportunities and risks',
    'Ethical concerns around AI bias, surveillance, and automated decision-making',
    'The global race for semiconductor dominance and the role of TSMC',
    'Ransomware attacks on critical infrastructure and national cybersecurity strategies',
    'The future of quantum computing and its potential to break modern encryption',
    'Regulation of Big Tech companies like Google and Meta in the EU and beyond',
    // Economy & Work
    'The gig economy and how companies like Uber are reshaping labor rights',
    'Inflation crises and central bank policies: the role of the European Central Bank',
    'Remote work vs return-to-office: how the pandemic permanently changed workplaces',
    'Universal Basic Income: economic solution or fiscal risk?',
    'Wealth inequality and the global debate over taxing billionaires',
    'The impact of automation and robotics on the future of jobs',
    // Environment & Climate
    'Global warming and the ambitions and failures of the Paris Agreement',
    'Climate migration: communities displaced by rising seas and extreme weather',
    'The renewable energy transition and resistance from fossil fuel industries',
    'The melting Arctic: new shipping routes and territorial disputes',
    'Deforestation in the Amazon rainforest and the international response',
    'Corporate greenwashing: how companies misrepresent their sustainability efforts',
    // Society & Culture
    'Social media algorithms and how platforms like TikTok shape political opinion',
    'Cancel culture and the tension between accountability and freedom of speech',
    'Mental health in the digital age: rising anxiety among young people',
    'Gender identity, evolving social norms, and policy debates across Europe',
    'Immigration and multiculturalism: integration challenges in Europe and North America',
    'The growing influence of social media influencers on consumer behavior and politics',
    // Education & Knowledge
    'Online learning platforms like Coursera and the future of higher education',
    'University degrees vs skills-based learning: which prepares workers better?',
    'AI in education: personalized learning tools and the risk of academic dishonesty',
    'Global education inequality: access gaps between rich and poor countries',
    'Language extinction and efforts to preserve endangered languages and cultures',
    'Standardized testing vs alternative assessments in modern school systems',
    // Health & Science
    'Lessons learned from the COVID-19 pandemic for global health preparedness',
    'Vaccine hesitancy and the spread of medical misinformation online',
    'CRISPR gene editing: breakthroughs in medicine and ethical red lines',
    'The ethics of human cloning, synthetic biology, and biotechnology regulation',
    'Aging populations and the strain on pension and healthcare systems worldwide',
    'The rise of personalized medicine and genomic data in treatment decisions',
    // Media, Entertainment & Trends
    'The global dominance of streaming platforms like Netflix and the decline of traditional TV',
    'The impact of video games on youth culture, mental health, and education',
    'The evolution of music consumption: how Spotify changed the music industry',
    'Hollywood vs global cinema: the rise of Korean, Indian, and Scandinavian film',
    'Esports as a professional career: the industry\'s growth and legitimacy debate',
    'Deepfakes and AI-generated media: the threat to truth and democratic elections',
    // Security & Future Risks
    'Nuclear deterrence in the 21st century and the risk of new arms races',
    'Autonomous weapons and the ethics of AI-driven warfare',
    'Space militarization and the role of private companies like SpaceX',
    'Data privacy vs national security: the surveillance debate in democratic countries',
    'Digital identity systems and the risks of biometric mass surveillance',
    'Global pandemic preparedness after COVID-19: what still needs to change',
  ];

  private readonly TOPICS_BY_LEVEL: Record<string, string[]> = {
    A1: [
      'Finnish breakfast foods and morning routines',
      'Shopping at a Finnish supermarket like Prisma or K-Market',
      'The four seasons and weather in Finland',
      'A typical day at a Finnish primary school',
      'Finnish homes: apartments and houses in cities',
      'Coffee culture and coffee breaks in Finland',
      'Popular hobbies in Finland: fishing, hiking, and reading',
      'Helsinki city centre: main streets and famous sights',
      'Public buses and trams in Helsinki',
      'Finnish lakes and summer swimming',
      'Christmas in Finland: traditions and food',
      'The Finnish sauna: what it is and how it works',
      'Finnish animals: moose, bear, and reindeer',
      'Eating at a Finnish café or restaurant',
      'Ice hockey: Finland\'s most popular sport',
      'Finnish national parks and outdoor walking',
      'Finnish music: folk songs and popular bands',
      'Midsummer celebrations in Finland',
      'Finnish markets and open-air fairs in summer',
      'Finnish libraries: free and open to everyone',
      'Pets in Finnish families',
      'Finnish fruit and berries: strawberries, blueberries, and lingonberries',
      'A visit to a Finnish pharmacy',
      'Finnish parks and playgrounds for families',
      'Cross-country skiing in Finnish winter',
    ],
    A2: [
      'The Finnish healthcare system and how to visit a doctor',
      'Finnish education: from kindergarten to university',
      'Lapland and the northern lights',
      'Finnish food culture: specialties and holiday dishes',
      'Midsummer festival traditions in Finland',
      'The Finnish sauna culture and its UNESCO recognition',
      'Women\'s rights and equality in Finland',
      'Winter sports in Finland: skiing and ice skating',
      'The Finnish social security and benefit system',
      'Who moves to Finland and why: immigration basics',
      'What makes the Finnish language unique',
      'Finland\'s trains, buses, and ferries',
      'Helsinki as a capital city: a short history',
      'The Swedish minority in Finland',
      'Finnish rock and metal music scene',
      'Recycling and environmental values in Finland',
      'How Finnish schools differ from other countries',
      'Life in Finnish cities versus the countryside',
      'Finnish design: Marimekko, Iittala, and Artek',
      'Finland\'s summer cottages and lake culture',
      'Finnish alcohol policy and the Alko store',
      'Finnish public holidays and how they are celebrated',
      'Finnish housing: renting and buying an apartment',
      'Volunteering and community life in Finland',
      'Finnish reading culture and public libraries',
    ],
    B1: [
      'Finland joining NATO in 2023 and its geopolitical significance',
      'The Finnish education system and why it ranks among the world\'s best',
      'The Sámi people: Finland\'s indigenous population and land rights',
      'Nokia\'s rise and fall, and Finland\'s pivot to a startup economy',
      'Finnish gender equality: first female president and prime minister',
      'Helsinki\'s plan to be carbon-neutral by 2030',
      'How Finland\'s welfare state works and its funding challenges',
      'The Swedish-speaking minority in Finland',
      'Finnish media freedom: top of the World Press Freedom Index',
      'Supercell, Rovio, and the Finnish gaming industry',
      'Finland\'s healthcare: strengths and regional disparities',
      'Climate change in the Arctic and effects on Lapland',
      'The history of Finnish sauna culture',
      'Universal Basic Income pilot in Finland: results and debate',
      'Mental health awareness and youth wellbeing in Finland',
      'AI\'s impact on Finnish workplaces and employment',
      'Finland\'s forest industry: economy vs biodiversity',
      'The aging population crisis and Finnish pension policy',
      'Finland in UN peacekeeping missions',
      'Remote work and its impact on Finnish cities and regions',
      'Finnish immigration and integration policy in the 2020s',
      'The Russian invasion of Ukraine and Finland\'s diplomatic response',
      'Finnish food security and agriculture amid global disruptions',
      'The rise of populism and the Finns Party in Finnish politics',
      'Finland\'s cybersecurity strategy and Nordic cooperation',
    ],
  };

  async generateReadingStory(level: string, topic?: string) {
    const pool = this.TOPICS_BY_LEVEL[level] || this.READING_TOPICS;
    const chosenTopic = topic || pool[Math.floor(Math.random() * pool.length)];

    const levelConfig: Record<string, { temperature: number; rules: string }> = {
      A1: {
        temperature: 0.25,
        rules: `══════════════════════════════════════════════
CEFR A1 — ABSOLUTE BEGINNER. THIS IS THE MOST IMPORTANT INSTRUCTION.
══════════════════════════════════════════════

The reader has studied Finnish for only 1–2 months. Every sentence MUST pass ALL of these rules:

SENTENCE LENGTH: MAXIMUM 9 WORDS PER SENTENCE.
→ Count every word. If a sentence has 10 or more words, split it into two sentences immediately.

ALLOWED VERBS (present tense only):
on, ovat, ei ole, asuu, asuvat, tekee, tekevät, menee, menevät, tulee, tulevat,
myy, maksaa, syö, juo, pitää, rakastaa, haluaa, voi, tarvitsee, alkaa, loppuu, on

ABSOLUTELY FORBIDDEN — do not use these EVER:
✗ Passive voice: ANY word ending in -taan, -daan, -llaan, -ssaan, -ään, -aan
  Bad examples: myydään, tehdään, käytetään, järjestetään, kutsutaan — ALL FORBIDDEN
✗ Conditional: ANY word ending in -isi
  Bad examples: olisi, voisi, pitäisi, tulisi, saisi — ALL FORBIDDEN
✗ Perfect tense: "on + past participle"
  Bad examples: on tullut, on mennyt, on ollut, on saanut — ALL FORBIDDEN
✗ Subordinate clauses: NEVER use joka, jotta, kun, koska, vaikka, että, jos
✗ Long compound words (over 10 letters)
✗ Any word not in the 500 most common Finnish words

ALLOWED connectors (and ONLY these): ja, mutta, myös, tai, siksi, ensin, sitten, nyt

EXAMPLE OF PERFECT A1 TEXT — copy this sentence style exactly:
"Helsinki on Suomen pääkaupunki. Se on meren rannalla Etelä-Suomessa. Helsingissä asuu yli 600 000 ihmistä. Kaupungissa on paljon puistoja ja kahviloita. Turistit rakastavat Helsinkiä. Helsinki on moderni ja kaunis kaupunki."

Notice: every sentence is short, clear, present tense, no passive, no subordinate clauses.

SELF-CHECK: After writing each sentence, count its words. If count ≥ 10, split it.`,
      },
      A2: {
        temperature: 0.40,
        rules: `══════════════════════════════════════════════
CEFR A2 — ELEMENTARY. THIS IS THE MOST IMPORTANT INSTRUCTION.
══════════════════════════════════════════════

The reader has studied Finnish for about 6 months. Rules MUST be followed strictly:

SENTENCE LENGTH: 10–14 words per sentence on average. Max 15 words.

ALLOWED GRAMMAR:
✓ Present tense (main tense throughout)
✓ Simple past tense (imperfect) for historical facts ONLY: oli, tuli, meni, alkoi, sai
✓ Passive past for historical establishment: "perustettiin vuonna...", "rakennettiin..." — ONLY for founding/historical facts
✓ Conjunctions: ja, mutta, koska, kun, jos, myös, siksi, tai, sen takia
✓ One short subordinate clause per sentence at most (keep it under 6 words)

ABSOLUTELY FORBIDDEN:
✗ Conditional mood: olisi, voisi, pitäisi, tulisi, saisi — FORBIDDEN
✗ Perfect tense: "on tullut", "on ollut", "oli mennyt" — FORBIDDEN
✗ Complex participle constructions: "lukemalla oppien", "tehty päätös" — FORBIDDEN
✗ Three or more clauses in one sentence — FORBIDDEN
✗ Academic, technical, or rare vocabulary — FORBIDDEN

EXAMPLE OF PERFECT A2 TEXT:
"Suomi itsenäistyi Venäjästä vuonna 1917. Se oli suuri hetki Suomen historiassa. Suomalaiset juhlivat itsenäisyyspäivää joka vuosi 6. joulukuuta. Helsingissä on paraati ja presidentti pitää vastaanoton. Monet suomalaiset katsovat vastaanottoa televisiosta. Itsenäisyyspäivä on tärkeä juhlapäivä kaikille suomalaisille."`,
      },
      B1: {
        temperature: 0.55,
        rules: `CEFR B1 — INTERMEDIATE.
Write like a clear Finnish magazine article. Mix short and medium sentences (12–18 words).
Use all tenses naturally. Passive voice is fine occasionally. Subordinate clauses (joka, koska, vaikka, kun, jotta) are welcome.
Include topic-specific vocabulary but explain very rare terms briefly in context.
Example: "Suomen NATO-jäsenyys muutti maan turvallisuuspolitiikkaa merkittävästi, koska aiemmin Suomi oli sotilaallisesti liittoutumaton maa. Venäjän hyökkäys Ukrainaan vuonna 2022 nopeutti tätä historiallista päätöstä huomattavasti."`,
      },
      B2: {
        temperature: 0.65,
        rules: `CEFR B2 — UPPER-INTERMEDIATE.
Write like a Finnish newspaper or academic magazine. Rich, varied sentence structures (15–25 words).
Full grammar: all tenses, passive, conditional, participles, complex subordinate clauses.
Precise academic and topic-specific vocabulary. Nuanced analysis and argumentation.
Example: "Tekoälyn nopea kehitys on herättänyt laajaa yhteiskunnallista keskustelua siitä, miten sen käyttöä tulisi säännellä kansainvälisellä tasolla, erityisesti kun vaikutukset ulottuvat yhä useammille elämänalueille."`,
      },
    };

    const config = levelConfig[level] || levelConfig['B1'];

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a Finnish language teacher writing graded reading texts for learners.

${config.rules}

TOPIC: "${chosenTopic}"
Write factual, informative content about this exact topic. Do NOT switch to a generic topic.
Adapt the COMPLEXITY OF IDEAS to the level: A1/A2 → only the simplest concrete facts; B1/B2 → include analysis and nuance.

STRUCTURE (mandatory):
- Exactly 3 or 4 paragraphs, separated by \\n\\n
- Each paragraph: minimum 4 sentences
- Questions for A1/A2: simple factual recall only. Questions for B1/B2: may require inference.

Respond ONLY with valid JSON:
{
  "title": "Finnish title",
  "titleEn": "English title",
  "category": "one of: History | Culture | Society | Current Events | Science | Economy | Nordic Life | Nature | Technology | Health | Sport | Education",
  "text": "full article text in Finnish, paragraphs separated by \\n\\n",
  "vocab": ["word1 (english1)", "word2 (english2)", "word3 (english3)", "word4 (english4)", "word5 (english5)", "word6 (english6)", "word7 (english7)", "word8 (english8)"],
  "questions": [
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 0 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 1 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 2 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 3 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 0 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 2 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 1 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 3 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 0 },
    { "q": "Question in English?", "options": ["A", "B", "C", "D"], "correct": 2 }
  ]
}
"correct" is the 0-based index. Include exactly 10 questions.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: config.temperature,
      max_tokens: 3200,
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  async generateExercises(topic: string, level: string, type: string, count = 5) {
    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Generate ${count} Finnish language exercises. Topic: "${topic}", CEFR Level: ${level}, Type: ${type}.
Respond ONLY with valid JSON: { "exercises": [{"question":"","options":[],"correctAnswer":"","explanation":"","hint":"","points":10}] }`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });
    const result = JSON.parse(completion.choices[0].message.content || '{"exercises":[]}');
    return result.exercises || [];
  }

  async getChatHistory(userId: string, limit = 50) {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
  }

  async generateTranslationTask(level: string, direction: 'en-fi' | 'fi-en' = 'en-fi') {
    const levelGuide: Record<string, string> = {
      A1: '2-3 very simple sentences, present tense only, max 8 words per sentence',
      A2: '3-4 simple sentences, present and simple past, max 12 words per sentence',
      B1: '4-5 sentences with varied tenses and connectors, max 16 words per sentence',
      B2: '5-6 sentences with complex structures, max 22 words per sentence',
    };

    const topicsByLevel: Record<string, string[]> = {
      A1: ['morning routine','food and drink','family members','colours and numbers','weather today','pets','home and rooms','shopping at a market','greetings','days of the week','favourite foods','getting dressed','a simple walk','the school','a birthday'],
      A2: ['weekend plans','a visit to the doctor','public transport','cooking a meal','describing a friend','a postcard from holiday','a supermarket trip','favourite hobby','the park','a phone call','learning languages','a café visit','a rainy day','a trip to the library','seasonal activities'],
      B1: ['a job interview','planning a trip abroad','an opinion about social media','describing a past holiday','environmental habits','renting an apartment','a news story','comparing cities','work and study balance','healthy lifestyle','a cultural event','learning a skill','volunteering','a book recommendation','city vs countryside'],
      B2: ['climate change policy','remote work trends','the role of AI in education','mental health awareness','urban development','digital privacy','immigration and integration','economic inequality','media literacy','renewable energy','cultural identity','the future of healthcare','political participation','globalisation','scientific research ethics'],
    };

    const topics = topicsByLevel[level] || topicsByLevel['A2'];
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const guide = levelGuide[level] || levelGuide['A2'];
    const isFiEn = direction === 'fi-en';

    const levelDescriptions: Record<string, string> = {
      A1: 'Write 2–3 short sentences about one simple everyday situation. Use present tense and basic vocabulary. Write casually and naturally — like a quick note jotted by a real person, not a textbook example.',
      A2: 'Write 3 sentences about a simple situation or small event. Mix present and past tense where it feels natural. Keep it casual and grounded — like something you would actually say to a friend.',
      B1: 'Write 5–6 sentences using varied tenses (present, past, future or conditional). Include at least one relative clause or subordinate clause. Give an opinion or explain something, like a short blog post or a personal email. Vocabulary can be moderately complex.',
      B2: 'Write 6–7 sentences with complex sentence structures, varied tenses (including passive or conditional), and precise vocabulary. The text should read like a polished paragraph from a quality news article or opinion piece.',
    };

    const systemPrompt = isFiEn
      ? `You are writing a short Finnish passage for a language learner (CEFR ${level}) to translate into English.

Topic: "${topic}"

HOW TO WRITE AT THIS LEVEL:
${levelDescriptions[level] || levelDescriptions['A2']}

NATURALNESS IS THE #1 PRIORITY. The text must sound like something a real Finnish person would actually write — not a grammar exercise. Use kirjakieli (standard written Finnish).

STRICTLY AVOID:
- Stacking short choppy sentences with no connection ("Aurinko paistaa. On lämmin. Pilvet tulevat.")
- Starting every sentence with the same subject
- Sentences that feel like isolated textbook examples

NAMING RULE: If people appear, use only: Matti, Liisa, Pekka, Anna, Juha, Mari, Timo, Sari, Eero, Aino, Ville, Hanna. NEVER use words that are also common Finnish nouns (e.g. "Sana", "Koulu", "Katu", "Talo").

Respond ONLY with valid JSON:
{
  "source": "the Finnish passage",
  "topic": "${topic}",
  "hints": ["English hint for a tricky Finnish word or grammatical form", "another hint if genuinely needed"]
}`
      : `You are writing a short English passage for a Finnish language learner (CEFR ${level}) to translate into Finnish.

Topic: "${topic}"

HOW TO WRITE AT THIS LEVEL:
${levelDescriptions[level] || levelDescriptions['A2']}

NATURALNESS IS THE #1 PRIORITY. The text must sound like something a real person would actually say or write — not a grammar exercise. Choose vocabulary that translates cleanly into Finnish (avoid idioms with no Finnish equivalent).

STRICTLY AVOID:
- Stacking short choppy sentences with no connection ("Sun shines. It is warm. Clouds come.")
- Starting every sentence with the same subject
- Sentences that feel like isolated textbook examples

Respond ONLY with valid JSON:
{
  "source": "the English passage",
  "topic": "${topic}",
  "hints": ["Finnish hint for a word or phrase that is tricky to translate", "another hint if genuinely needed"]
}`;

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: systemPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.9,
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  async checkTranslation(source: string, translation: string, level: string, direction: 'en-fi' | 'fi-en' = 'en-fi') {
    const isFiEn = direction === 'fi-en';
    const systemPrompt = isFiEn
      ? `You are a Finnish language expert evaluating an English translation of a Finnish text.

The learner (level ${level}) was given this Finnish text to translate into English:
"${source}"

CRITICAL rules — read carefully before scoring:
1. If the learner's translation is identical to, or semantically equivalent to, a correct translation, the score MUST be 100 (accuracy=40, grammar=30, vocabulary=20, naturalness=10) and errors MUST be [].
2. Any word capitalised mid-sentence in the Finnish source is a PROPER NOUN (person or place name) — keep it as-is, never translate it as a common noun.
3. Only add an entry to "errors" if the phrase is GRAMMATICALLY WRONG or CHANGES THE MEANING. Valid alternatives go in overallFeedback as tips, never in errors.
4. Do NOT deduct points for stylistic choices when the meaning is fully preserved and grammar is correct.

Evaluate the English translation on:
- Accuracy (0-40 pts): does it convey the full meaning of the Finnish, respecting proper nouns?
- Grammar (0-30 pts): correct English grammar and sentence structure
- Vocabulary (0-20 pts): appropriate English words that match the Finnish meaning
- Naturalness (0-10 pts): sounds like natural, fluent English

Respond ONLY with valid JSON:
{
  "score": number,
  "accuracy": number (0-40),
  "grammar": number (0-30),
  "vocabulary": number (0-20),
  "naturalness": number (0-10),
  "betterTranslation": "an ideal English translation of the Finnish text",
  "errors": [{ "original": "wrong English phrase", "correction": "better English", "explanation": "why" }],
  "overallFeedback": "2-3 sentences of honest, supportive feedback"
}`
      : `You are a YKI-certified Finnish language examiner evaluating a Finnish translation.

The learner (level ${level}) was given this English text to translate into Finnish:
"${source}"

CRITICAL rules — read carefully before scoring:
1. If the learner's translation is identical to, or semantically equivalent to, a correct translation, the score MUST be 100 (accuracy=40, grammar=30, vocabulary=20, naturalness=10) and errors MUST be [].
2. Finnish is a pro-drop language — subject pronouns (minä, sinä, se, hän, me, te, ne) are OPTIONAL. Never mark an included or omitted pronoun as an error.
3. Only add an entry to "errors" if the phrase is GRAMMATICALLY WRONG or CHANGES THE MEANING. Valid alternatives belong in overallFeedback as tips, never in errors.
4. Word order variations that preserve meaning are not errors.
5. Do NOT deduct points for stylistic choices when the meaning is fully preserved and the grammar is correct.

Evaluate on:
- Accuracy (0-40 pts): does it convey the full meaning?
- Grammar (0-30 pts): correct Finnish cases, conjugation, word order
- Vocabulary (0-20 pts): appropriate Finnish words chosen
- Naturalness (0-10 pts): sounds like natural written Finnish

Respond ONLY with valid JSON:
{
  "score": number,
  "accuracy": number (0-40),
  "grammar": number (0-30),
  "vocabulary": number (0-20),
  "naturalness": number (0-10),
  "betterTranslation": "an ideal Finnish translation of the English text",
  "errors": [{ "original": "wrong Finnish phrase", "correction": "correct Finnish", "explanation": "clear explanation" }],
  "overallFeedback": "2-3 sentences — confirm correctness first, then optionally mention stylistic alternatives as tips"
}`;

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Translation attempt: "${translation}"` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  async getUserStories(userId: string) {
    return this.prisma.userStory.findMany({
      where: { userId, source: 'reading' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveUserStory(userId: string, story: {
    title: string; titleEn: string; level: string; category: string;
    color: string; text: string; vocab: any; questions: any; xp: number;
  }) {
    return this.prisma.userStory.create({
      data: {
        userId,
        title: story.title,
        titleEn: story.titleEn || '',
        level: story.level as any,
        category: story.category || 'AI Generated',
        color: story.color,
        text: story.text,
        vocab: story.vocab,
        questions: story.questions,
        xp: story.xp || 40,
        source: 'reading',
      },
    });
  }

  async deleteUserStory(userId: string, storyId: string) {
    const story = await this.prisma.userStory.findFirst({ where: { id: storyId, userId } });
    if (!story) throw new Error('Story not found');
    await this.prisma.userStory.delete({ where: { id: storyId } });
    return { deleted: true };
  }

  async getUserListeningTracks(userId: string) {
    return this.prisma.userStory.findMany({
      where: { userId, source: 'listening' },
      orderBy: { createdAt: 'desc' },
    });
  }

  async saveListeningTrack(userId: string, track: {
    title: string; titleEn: string; level: string; category: string;
    color: string; transcript: string; questions: any; xp: number;
  }) {
    return this.prisma.userStory.create({
      data: {
        userId,
        title: track.title,
        titleEn: track.titleEn || '',
        level: track.level as any,
        category: track.category || 'AI Generated',
        color: track.color,
        text: track.transcript,
        vocab: [],
        questions: track.questions,
        xp: track.xp || 50,
        source: 'listening',
      },
    });
  }

  async deleteListeningTrack(userId: string, trackId: string) {
    const track = await this.prisma.userStory.findFirst({ where: { id: trackId, userId, source: 'listening' } });
    if (!track) throw new Error('Track not found');
    await this.prisma.userStory.delete({ where: { id: trackId } });
    return { deleted: true };
  }
}
