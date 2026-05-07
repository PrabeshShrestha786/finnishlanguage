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

  private buildSsml(text: string): string {
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return '<speak>' +
      escaped
        .replace(/\n\n+/g, '<break time="900ms"/>')
        .replace(/\n/g, '<break time="500ms"/>')
        .replace(/([.!?])\s+/g, '$1<break time="650ms"/> ')
        .replace(/,\s+/g, ',<break time="200ms"/> ')
      + '</speak>';
  }

  async textToSpeech(text: string): Promise<Buffer> {
    const apiKey = this.config.get<string>('google.ttsApiKey');
    if (!apiKey) throw new Error('GOOGLE_TTS_API_KEY is not configured');
    const voiceName = this.config.get<string>('google.ttsVoice') || 'fi-FI-Wavenet-A';

    const body = JSON.stringify({
      input: { ssml: this.buildSsml(text) },
      voice: { languageCode: 'fi-FI', name: voiceName },
      audioConfig: { audioEncoding: 'MP3', speakingRate: 0.9 },
    });

    return new Promise((resolve, reject) => {
      const req = https.request(
        {
          hostname: 'texttospeech.googleapis.com',
          path: `/v1/text:synthesize?key=${apiKey}`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => {
            const raw = Buffer.concat(chunks).toString();
            if (res.statusCode !== 200) {
              reject(new Error(`Google TTS error ${res.statusCode}: ${raw}`));
              return;
            }
            const json = JSON.parse(raw);
            resolve(Buffer.from(json.audioContent, 'base64'));
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

  private async buildStoryPlan(topic: string, level: string): Promise<{
    angle: string;
    topicType: string;
    template: string;
    scene: { setting: string; season: string; characters: string[]; sensory: string[]; emotionalTone: string };
    outline: string[];
    keyFacts: string[];
    vocabFocus: string;
  }> {
    const levelHints: Record<string, string> = {
      A1: 'Pick a concrete everyday scenario a beginner can visualise. A child, a family, or a tourist doing ONE simple thing. Focus on physical actions and direct observations — zero abstract concepts.',
      A2: 'Simple personal narrative. One person experiences something related to the topic with clear cause-and-effect. Beginning, middle, and end.',
      B1: 'Magazine-style article with a clear angle: historical context, a comparison, or a personal story that leads to a broader cultural insight.',
      B2: 'In-depth analytical feature. A nuanced angle: societal impact, controversy, historical significance, or cultural paradox. Include differing viewpoints.',
    };

    const topicTemplates = `
Topic type → narrative template:
  place      → arrival → exploration → highlight → departure/reflection
  activity   → preparation → experience → reaction → what-was-learned
  food       → origin/context → preparation → eating/sharing → cultural meaning
  tradition  → history/origin → how it is celebrated → family/community role → modern relevance
  person     → early life → achievement → impact → legacy
  nature     → setting the scene → characteristics → human relationship → conservation/importance
  daily_life → morning routine → key events → challenges → evening/resolution
  travel     → journey start → arrival/discovery → interaction → departure feeling`;

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a Finnish language curriculum designer. Plan an engaging, well-structured Finnish learning text. Do NOT write the text — only plan it.

Level ${level} guidance: ${levelHints[level] || levelHints['B1']}

${topicTemplates}

Rules for an EXCELLENT plan:
- Classify the topic type first, then choose the matching narrative template.
- Choose ONE specific angle. Bad: "saunas in general". Good: "a family's Saturday sauna ritual at their summer cottage".
- Scene must be vivid and specific: real setting, named season, concrete characters, sensory details.
- Outline must follow narrative PROGRESSION matching the template. No random fact listing.
- Key facts must be CONCRETE and CULTURALLY INTERESTING — things a learner would actually remember.
- The scene and angle must FORCE varied sentence subjects (people do things, not just "X is Y").

Respond ONLY with valid JSON:
{
  "topicType": "one of: place | activity | food | tradition | person | nature | daily_life | travel",
  "template": "the narrative template steps for this topic type, e.g. preparation → experience → reaction → reflection",
  "angle": "specific narrative angle or scenario (one sentence)",
  "scene": {
    "setting": "exact physical location",
    "season": "season or time of day",
    "characters": ["character 1", "character 2"],
    "sensory": ["sensory detail 1", "sensory detail 2", "sensory detail 3"],
    "emotionalTone": "the mood/feeling of the text"
  },
  "outline": [
    "Paragraph 1: what happens and why it matters narratively",
    "Paragraph 2: how the story develops",
    "Paragraph 3: the key moment or cultural insight",
    "Paragraph 4: resolution and what the reader takes away"
  ],
  "keyFacts": ["concrete fact 1", "concrete fact 2", "concrete fact 3", "concrete fact 4", "concrete fact 5"],
  "vocabFocus": "domain of vocabulary to use naturally"
}`,
      }, {
        role: 'user',
        content: `Topic: "${topic}"\nLevel: ${level}`,
      }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    try {
      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch {
      return {
        angle: topic, topicType: 'activity', template: 'preparation → experience → reaction → reflection',
        scene: { setting: '', season: '', characters: [], sensory: [], emotionalTone: '' },
        outline: [], keyFacts: [], vocabFocus: '',
      };
    }
  }

  private async evaluateStory(text: string, level: string): Promise<{
    overallScore: number; passesLevel: boolean; repetitionScore: number;
    flowScore: number; problems: string[];
  }> {
    const levelExpectations: Record<string, string> = {
      A1: `Exactly 3 paragraphs, 4 sentences each. Max 8 words per sentence. Present tense action verbs only.
No passive, no conditional, no perfect tense, no subordinate clauses.
Each adjective must appear AT MOST ONCE in the entire text.
No two consecutive sentences start with the same word.
Characters (people) must appear in every paragraph doing actions — not just "X on Y" fact sentences.`,
      A2: 'Max 15 words per sentence. Present tense main, simple past allowed. No conditional, no perfect tense, max one subordinate clause per sentence.',
      B1: 'Mixed sentence lengths 12-18 words. All tenses allowed. Passive occasional. Subordinate clauses welcome.',
      B2: 'Rich varied sentences 15-25 words. Full grammar. Complex structures, argumentation, nuanced vocabulary.',
    };

    const a1ExtraChecks = level === 'A1' ? `
EXTRA CHECKS FOR A1:
- Count how many times each adjective appears. Any adjective used 2+ times is a CRITICAL problem.
- List any adjective that repeats (e.g. "hyvää appears 3 times" is a critical error).
- Count paragraphs. If not exactly 3, that is a critical problem.
- Check if topic noun (e.g. "kahvi", "sauna") is the subject of more than 2 sentences — if yes, flag it.
- Check if any two consecutive sentences start with the same word.` : '';

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a STRICT Finnish language education quality checker. Evaluate this Finnish text for a CEFR ${level} learner.

CEFR ${level} requirements:
${levelExpectations[level] || levelExpectations['B1']}
${a1ExtraChecks}

Check for these problems:
1. Grammar level violations (wrong tense, passive, conditional for the level)
2. Any adjective repeated more than once in the full text
3. Topic noun used as subject in 3+ sentences (e.g. "Kahvi on... Kahvi on... Kahvi on...")
4. Two or more consecutive sentences starting with the same word
5. Disconnected fact-listing instead of narrative flow
6. Sentences too long for the level
7. Wrong paragraph count (A1 must have exactly 3)

Scoring:
- repetitionScore: adjective variety + sentence opening variety (1-10)
- flowScore: logical sentence-to-sentence connection (1-10)
- overallScore: weighted quality score — weight repetition heavily for A1

Be STRICT. For A1: any repeated adjective = overallScore max 5. Any 3+ consecutive "X on Y" sentences = overallScore max 4.
Score of 7+ = acceptable. Below 7 = rewrite needed.

Respond ONLY with valid JSON:
{
  "overallScore": 7,
  "passesLevel": true,
  "repetitionScore": 6,
  "flowScore": 8,
  "problems": ["Specific problem 1", "Specific problem 2"]
}`,
      }, {
        role: 'user',
        content: `Evaluate this CEFR ${level} Finnish text:\n\n${text}`,
      }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    try {
      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch {
      return { overallScore: 8, passesLevel: true, repetitionScore: 7, flowScore: 7, problems: [] };
    }
  }

  private async repairStory(text: string, problems: string[], level: string, levelRules: string): Promise<string> {
    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a Finnish language editor. Rewrite the given Finnish text to fix ONLY the listed problems.
Keep the same story, same facts, same structure — only fix what is broken.

${levelRules}

Fix these specific problems:
${problems.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Rules for rewriting:
- Do not change the story angle or content
- Do not add new facts
- Fix sentence openings so no two consecutive sentences start with the same word
- Ensure each sentence connects logically to the previous one
- Maintain the CEFR ${level} grammar constraints above

Return ONLY the rewritten Finnish text, no JSON, no explanation.`,
      }, {
        role: 'user',
        content: text,
      }],
      temperature: 0.3,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content?.trim() || text;
  }

  async generateReadingStory(level: string, topic?: string) {
    const pool = this.TOPICS_BY_LEVEL[level] || this.READING_TOPICS;
    const chosenTopic = topic || pool[Math.floor(Math.random() * pool.length)];

    const plan = await this.buildStoryPlan(chosenTopic, level);

    const levelConfig: Record<string, { temperature: number; rules: string }> = {
      A1: {
        temperature: 0.3,
        rules: `══════════════════════════════════════════════
CEFR A1 — ABSOLUTE BEGINNER. FOLLOW EVERY RULE BELOW.
══════════════════════════════════════════════

The reader has studied Finnish for only 1–2 months.

PARAGRAPH COUNT: Write EXACTLY 3 paragraphs separated by \\n\\n. Not 4. Not 5. Exactly 3.
PARAGRAPH LENGTH: Each paragraph = exactly 4 sentences. No more, no less.
SENTENCE LENGTH: MAXIMUM 8 WORDS PER SENTENCE. Count every word. Split if needed.

ALLOWED ACTION VERBS (present tense only — these make stories, use them):
menee, tulee, tekee, ottaa, laittaa, avaa, sulkee, katsoo, kuuntelee, sanoo,
nauraa, juoksee, istuu, seisoo, syö, juo, pitää, haluaa, herää, lähtee,
vie, saa, antaa, kysyy, vastaa, löytää, nukkuu, leikkii, työskentelee, kävelee

STATE VERBS (use sparingly — max 2 "on/ovat" sentences per paragraph):
on, ovat, ei ole, asuu

ABSOLUTELY FORBIDDEN:
✗ Passive voice (-taan, -daan, -llaan, -ssaan, -ään endings)
✗ Conditional (-isi endings: olisi, voisi, pitäisi)
✗ Perfect tense (on tullut, on mennyt, on ollut)
✗ Subordinate clauses (joka, jotta, kun, koska, vaikka, että, jos)
✗ Compound words over 10 letters

ALLOWED connectors: ja, mutta, myös, tai, sitten, ensin, nyt

ADJECTIVE REPETITION RULE (critical):
→ Each adjective may appear AT MOST ONCE in the entire text.
→ Do not use "hyvä/hyvää", "tärkeä/tärkeää", "lämmin/lämmintä" more than once total.
→ After finishing, scan every adjective. If repeated — delete or replace it.

CHARACTER RULE:
→ The main character(s) from the scene must appear in EVERY paragraph.
→ Begin most sentences with the character's name or pronoun (hän, he), not with the topic noun.
→ BAD: "Kahvi on hyvää. Kahvi on lämmin. Kahvi on tärkeää." (topic as subject every time)
→ GOOD: "Anna juo kahvia. Hän pitää siitä. Se maistuu hyvältä." (character acts, then reaction)

SENTENCE VARIETY RULE:
→ No two consecutive sentences may start with the same word.
→ Mix openings: character name, pronoun (hän/he/se), time word (sitten/ensin/nyt), verb first.

EXAMPLE OF PERFECT A1 NARRATIVE (3 paragraphs, 4 sentences each, character-driven):
"Anna herää aamulla aikaisin. Hän menee keittiöön. Anna laittaa kahvia. Se tuoksuu hyvältä.

Anna ottaa kupin pöydältä. Hän juo kahvia hitaasti. Mikko tulee keittiöön. He istuvat yhdessä.

Sitten he lähtevät töihin. Anna kävelee bussipysäkille. Mikko ajaa autolla. He näkevät taas iltapäivällä."

Notice: character does things in every sentence, 3 different adjectives total, no sentence starts the same way twice in a row.

SELF-CHECK before finishing:
1. Count paragraphs → must be exactly 3
2. Count sentences per paragraph → must be exactly 4
3. Count words per sentence → must be ≤ 8
4. List all adjectives used → each must appear only once
5. Check consecutive sentence openings → no two in a row start the same`,
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

    const characters = (plan.scene?.characters || []).join(', ') || 'a Finnish person';
    const sceneBlock = `
SCENE — YOU MUST USE THIS IN THE TEXT:
  Setting:         ${plan.scene?.setting || 'everyday Finnish location'}
  Season/Time:     ${plan.scene?.season || 'morning'}
  Characters:      ${characters}
  Sensory details: ${(plan.scene?.sensory || []).join(' | ') || 'sights and sounds of the setting'}
  Emotional tone:  ${plan.scene?.emotionalTone || 'warm and natural'}

CHARACTER MANDATE: The character(s) listed above MUST appear in every paragraph doing actions.
The first sentence of the text MUST introduce a character by name doing an action.
Do NOT let the topic noun (e.g. "kahvi", "sauna") be the subject of more than 2 sentences total.`;

    const planContext = plan.angle ? `
══════════════════════════════════════════════
STORY PLAN — FOLLOW THIS STRUCTURE PRECISELY
══════════════════════════════════════════════
Topic type: ${plan.topicType || 'activity'}
Narrative template: ${plan.template || 'preparation → experience → reaction → reflection'}
Angle: ${plan.angle}
${sceneBlock}

Paragraph outline:
${plan.outline.map((p, i) => `  Para ${i + 1}: ${p}`).join('\n')}

Key facts to weave in naturally:
${plan.keyFacts.map((f) => `  • ${f}`).join('\n')}

Vocabulary focus: ${plan.vocabFocus}

SEMANTIC PROGRESSION RULE (most important writing rule):
→ Each sentence MUST connect logically to the previous sentence.
→ Prefer actions and their consequences over disconnected facts.
→ Good: "Isä lämmittää kiuasta. Lapset odottavat ulkona. Kiuas lämpenee hitaasti."
→ Bad:  "Sauna on kuuma. Sauna on terveellinen. Sauna on suomalainen."

ANTI-REPETITION RULES:
✗ No two consecutive sentences may begin with the same word or subject.
✗ Do NOT list properties of the topic (X is Y, X is Z, X is W).
✓ Vary sentence openings: verbs, time words, character names, locations, sensory words.
✓ Each paragraph MUST match its planned theme — no drifting.
══════════════════════════════════════════════` : '';

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a Finnish language teacher writing graded reading texts for learners.

${config.rules}
${planContext}

TOPIC: "${chosenTopic}"
Write engaging content using the scene and narrative plan above. Do NOT switch to a generic topic.
Adapt COMPLEXITY OF IDEAS to the level: A1/A2 → simple concrete facts only; B1/B2 → include analysis and nuance.

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
      temperature: 0.5,
      max_tokens: 3200,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Call 3: Evaluate
    if (result.text) {
      const evaluation = await this.evaluateStory(result.text, level);

      // Call 4: Repair only if quality is below threshold
      if (evaluation.overallScore < 7 && evaluation.problems?.length > 0) {
        const repairedText = await this.repairStory(result.text, evaluation.problems, level, config.rules);
        result.text = repairedText;
      }
    }

    return result;
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

  private async buildSpeakingScenario(topic: string | undefined, level: string, count: number): Promise<{
    scenario: string;
    subSituations: string[];
    communicativeGoal: string;
    phraseTypes: string[];
  }> {
    const levelContext: Record<string, string> = {
      A1: 'Basic survival communication. Phrases are 2–4 words. Focus on greetings, simple requests, and reactions.',
      A2: 'Simple everyday interaction. Phrases are 4–6 words. Focus on asking for things, expressing simple opinions, and short exchanges.',
      B1: 'Practical conversation. Phrases are 6–9 words. Focus on discussing plans, expressing feelings, giving opinions, and asking for clarification.',
      B2: 'Fluent natural expression. Phrases are 8–12 words. Focus on nuanced opinions, hypothetical situations, and complex requests.',
    };

    const topicLine = topic
      ? `The phrases will be set in the context of: "${topic}".`
      : 'Choose a natural everyday Finnish context that is culturally relevant and practical.';

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a Finnish language speaking practice designer. Plan a conversational scenario for ${count} practice phrases at CEFR ${level}.

${topicLine}
Level context: ${levelContext[level] || levelContext['A2']}

Rules:
- The scenario must be ONE specific real-life situation, not a vague theme.
  Bad: "things about sauna"  Good: "arriving at a friend's cottage and preparing for sauna together"
- Sub-situations must represent DIFFERENT moments within the scenario so phrases don't all sound the same.
- Phrase types must be varied: mix questions, suggestions, exclamations, requests, reactions, descriptions.
- Communicative goal is what the learner practices functionally (e.g. "making suggestions and expressing enthusiasm").

Respond ONLY with valid JSON:
{
  "scenario": "one specific real-life situation (one sentence)",
  "subSituations": ["moment 1 in the scenario", "moment 2", "moment 3", "moment 4", "moment 5", "moment 6"],
  "communicativeGoal": "what communication skill this practices",
  "phraseTypes": ["question", "suggestion", "exclamation", "request", "reaction", "description"]
}`,
      }, {
        role: 'user',
        content: `Topic: "${topic || 'everyday Finnish life'}"\nLevel: ${level}\nPhrase count: ${count}`,
      }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    try {
      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch {
      return {
        scenario: topic || 'everyday conversation',
        subSituations: [],
        communicativeGoal: 'general communication',
        phraseTypes: ['question', 'statement', 'exclamation', 'request', 'suggestion', 'reaction'],
      };
    }
  }

  private async evaluatePhrases(phrases: any[], level: string): Promise<{
    overallScore: number; problems: string[];
  }> {
    const levelLengths: Record<string, string> = {
      A1: '2–4 words', A2: '4–6 words', B1: '6–9 words', B2: '8–12 words',
    };

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a Finnish language quality checker for speaking practice phrases at CEFR ${level}.
Expected phrase length: ${levelLengths[level] || '4–8 words'}.

Check for these problems:
1. Descriptive facts instead of speakable utterances ("Sauna on kuuma" is a fact, not something you say TO someone)
2. Two or more phrases with identical sentence structure (e.g. all starting with "Haluatko...")
3. Phrases too long or too short for the level
4. Unnatural Finnish that a native speaker would not say
5. Phrases that don't relate to a coherent scenario (random disconnected topics)

Score 1–10 (10 = perfect). Below 7 means regeneration is needed.

Respond ONLY with valid JSON:
{ "overallScore": 8, "problems": ["specific problem 1", "specific problem 2"] }`,
      }, {
        role: 'user',
        content: `Evaluate these CEFR ${level} Finnish speaking phrases:\n${JSON.stringify(phrases, null, 2)}`,
      }],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    try {
      return JSON.parse(completion.choices[0].message.content || '{}');
    } catch {
      return { overallScore: 8, problems: [] };
    }
  }

  async generateSpeakingPhrases(level: string, count = 6, topic?: string) {
    const levelGuide: Record<string, string> = {
      A1: 'very simple, 2-4 words each — greetings, reactions, one-word-plus-verb',
      A2: 'simple everyday utterances, 4-6 words each',
      B1: 'practical conversational phrases, 6-9 words each',
      B2: 'natural complex expressions, 8-12 words each',
    };
    const guide = levelGuide[level] || levelGuide['A2'];

    // Call 1: Scenario Planner
    const scenario = await this.buildSpeakingScenario(topic, level, count);

    const scenarioBlock = `
SCENARIO: ${scenario.scenario}
Communicative goal: ${scenario.communicativeGoal}

Generate exactly one phrase per sub-situation below:
${scenario.subSituations.map((s, i) => `  Phrase ${i + 1}: ${s}`).join('\n')}

Phrase type variety required: ${scenario.phraseTypes.join(', ')}`;

    // Call 2: Generator
    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `Generate ${count} Finnish speaking practice phrases at CEFR ${level} (${guide}).
${scenarioBlock}

Strict rules:
- Every phrase must be something a PERSON SAYS — a real utterance, not a fact statement.
  Bad: "Sauna on kuuma." (description)  Good: "Onko kiuas jo kuuma?" (utterance in context)
- Match the phrase type for each sub-situation (question, suggestion, exclamation, etc.)
- No two phrases may have the same sentence structure or opening word.
- Pronunciation tip: show EVERY syllable separated by hyphens.

Respond ONLY with valid JSON:
{"phrases":[{"fi":"Finnish phrase","en":"English translation","tip":"syl-la-ble guide"}]}`,
      }],
      response_format: { type: 'json_object' },
      temperature: 0.8,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{"phrases":[]}');
    let phrases: any[] = (result.phrases || []).map((p: any) => ({ ...p, level }));

    // Call 3: Evaluator — regenerate once if quality is poor
    if (phrases.length > 0) {
      const evaluation = await this.evaluatePhrases(phrases, level);
      if (evaluation.overallScore < 7 && evaluation.problems?.length > 0) {
        const retry = await this.groq.chat.completions.create({
          model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
          messages: [{
            role: 'system',
            content: `Generate ${count} Finnish speaking practice phrases at CEFR ${level} (${guide}).
${scenarioBlock}

The previous attempt had these quality problems — fix ALL of them:
${evaluation.problems.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Strict rules:
- Every phrase must be a real utterance, not a description of a concept.
- No two phrases may share the same sentence structure.
- Pronunciation tip: show EVERY syllable separated by hyphens.

Respond ONLY with valid JSON:
{"phrases":[{"fi":"Finnish phrase","en":"English translation","tip":"syl-la-ble guide"}]}`,
          }],
          response_format: { type: 'json_object' },
          temperature: 0.75,
        });
        const retryResult = JSON.parse(retry.choices[0].message.content || '{"phrases":[]}');
        if ((retryResult.phrases || []).length > 0) {
          phrases = retryResult.phrases.map((p: any) => ({ ...p, level }));
        }
      }
    }

    return phrases;
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

    // Call 1: Mini arc planner — who, what happens, in what order
    const plannerCompletion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a language exercise designer. Plan a short coherent passage for a translation exercise.
Topic: "${topic}"
Level: CEFR ${level}
Direction: ${isFiEn ? 'Finnish → English' : 'English → Finnish'}

Rules:
- Pick ONE specific situation within the topic. Not "morning routine" in general — "Matti oversleeps and rushes to make coffee before work".
- The arc must have logical progression: each sentence leads naturally to the next.
- Characters (if any) should use Finnish names: Matti, Liisa, Pekka, Anna, Juha, Mari.
- Sentence count must match the level: A1=2-3, A2=3-4, B1=5-6, B2=6-7.

Respond ONLY with valid JSON:
{
  "who": "character name or 'no character'",
  "situation": "specific situation (one sentence)",
  "arc": ["sentence 1 event/action", "sentence 2 event/action", "sentence 3 event/action"],
  "keyVocab": ["word1", "word2", "word3"]
}`,
      }, {
        role: 'user',
        content: `Topic: "${topic}"\nLevel: ${level}`,
      }],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    let arc: { who: string; situation: string; arc: string[]; keyVocab: string[] } = {
      who: '', situation: topic, arc: [], keyVocab: [],
    };
    try {
      arc = JSON.parse(plannerCompletion.choices[0].message.content || '{}');
    } catch { /* use defaults */ }

    const arcBlock = arc.arc?.length > 0 ? `
PASSAGE PLAN — follow this arc exactly, in this order:
${arc.arc.map((step, i) => `  Sentence ${i + 1}: ${step}`).join('\n')}
Character: ${arc.who || 'no specific character'}
Key vocabulary to use: ${(arc.keyVocab || []).join(', ')}

SEMANTIC PROGRESSION: Each sentence MUST connect logically to the previous one.
Do NOT write disconnected isolated sentences about the same topic.` : '';

    const enrichedPrompt = systemPrompt + (arcBlock ? `\n\n${arcBlock}` : '');

    // Call 2: Writer
    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [{ role: 'system', content: enrichedPrompt }],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const result = JSON.parse(completion.choices[0].message.content || '{}');

    // Call 3: Evaluator
    if (result.source) {
      const evalCompletion = await this.groq.chat.completions.create({
        model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
        messages: [{
          role: 'system',
          content: `You are a quality checker for CEFR ${level} language exercise passages.
Check this passage intended for a translation exercise:

Problems to detect:
1. Sentences do not connect logically to each other (no causal/narrative flow)
2. Two or more sentences start with the same subject
3. Passage feels like isolated textbook examples rather than natural writing
4. Grammar or vocabulary too advanced or too simple for CEFR ${level}
5. Sentences too short (choppy) or too long for the level

Score 1-10. Below 7 needs rewriting.
Respond ONLY with valid JSON: { "overallScore": 8, "problems": ["problem 1"] }`,
        }, {
          role: 'user',
          content: `CEFR ${level} passage:\n"${result.source}"`,
        }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      let evalScore = 8;
      let evalProblems: string[] = [];
      try {
        const ev = JSON.parse(evalCompletion.choices[0].message.content || '{}');
        evalScore = ev.overallScore ?? 8;
        evalProblems = ev.problems ?? [];
      } catch { /* use defaults */ }

      // Call 4: Rewriter (conditional)
      if (evalScore < 7 && evalProblems.length > 0) {
        const repairPrompt = enrichedPrompt + `\n\nThe previous attempt had these problems — fix ALL of them:\n${evalProblems.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\nRewrite the passage completely, keeping the same topic and arc.`;
        const repairCompletion = await this.groq.chat.completions.create({
          model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
          messages: [{ role: 'system', content: repairPrompt }],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        });
        try {
          const repaired = JSON.parse(repairCompletion.choices[0].message.content || '{}');
          if (repaired.source) result.source = repaired.source;
          if (repaired.hints) result.hints = repaired.hints;
        } catch { /* keep original */ }
      }
    }

    return result;
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
