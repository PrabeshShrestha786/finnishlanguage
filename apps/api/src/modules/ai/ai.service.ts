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
          content: `You are a Finnish grammar expert. Learner level: ${level}, native language: ${nativeLang}.
Analyze the Finnish text for errors. Respond ONLY with valid JSON matching this exact schema:
{
  "hasErrors": boolean,
  "correctedText": "string",
  "errors": [{"original": "string", "correction": "string", "explanation": "string", "type": "string"}],
  "overallFeedback": "string",
  "score": number
}`,
        },
        { role: 'user', content: `Check this Finnish text: "${text}"` },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
  }

  async translate(text: string, from: string, to: string) {
    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `Translate from ${from} to ${to}. Respond ONLY with valid JSON:
{
  "translation": "string",
  "alternatives": ["string"],
  "pronunciation": "string",
  "notes": "string"
}`,
        },
        { role: 'user', content: text },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });
    return JSON.parse(completion.choices[0].message.content || '{}');
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
Respond ONLY with valid JSON:
{
  "pronunciationScore": number,
  "fluencyScore": number,
  "accuracyScore": number,
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

  async generateReadingStory(level: string, topic?: string) {
    const chosenTopic = topic || this.READING_TOPICS[Math.floor(Math.random() * this.READING_TOPICS.length)];
    const topicLine = `Topic: "${chosenTopic}". Write specifically about this — do NOT substitute it with a generic topic about Finnish nature, seasons, or forests.`;
    const levelGuide: Record<string, string> = {
      A1: `LANGUAGE RULES FOR A1 (absolute beginner):
- 8–10 words per sentence. Simple and clear, but not so short that sentences are meaningless.
- Only present tense (olla, asua, tehdä, mennä, tulla, voida, saada). No past or future tense.
- Basic connecting words allowed: ja, mutta, myös, tai, siksi. Use them to connect ideas naturally.
- Only the most common everyday Finnish words (~600 words). Avoid all technical or rare vocabulary.
- No subordinate clauses starting with joka, jotta, vaikka, kun, koska.
- No passive voice. No conditional. No participles.
- IMPORTANT: Each sentence must state a real, meaningful fact about the topic. Do NOT write empty filler sentences.
- IMPORTANT: Vary sentence starters. Do NOT begin every sentence with the same subject or "Se". Use the topic name, pronouns, place names, and numbers naturally.
- IMPORTANT: Even simple topics need real information. Include concrete facts: numbers, names, places, what something does, why it matters.
- Example of GOOD A1 style: "Alko on valtion omistama kauppa. Suomessa alkoholia myydään vain Alkossa. Alko perustettiin vuonna 1932. Suomessa on yli 350 Alko-myymälää."
- Example of BAD A1 style (forbidden): "Alko myy viiniä. Se myy olutta. Alko on suuri. Se on kallista." — this is too empty and repetitive.`,
      A2: `LANGUAGE RULES FOR A2 (elementary):
- 10–14 words per sentence on average. Simple but with natural flow between ideas.
- Use present tense primarily; simple past tense (imperfect) is allowed for historical facts.
- Basic conjunctions allowed: ja, mutta, koska, kun, jos, myös, siksi, sen takia.
- Vocabulary: approximately 1000–1500 most common Finnish words. Avoid rare or technical words.
- No passive voice. No complex participle constructions.
- One simple subordinate clause per sentence at most.
- Each sentence must carry meaningful information. Vary sentence structure and starters.
- Example sentence style: "Suomi liittyi NATOon vuonna 2023, ja se oli historiallinen päätös. Venäjä hyökkäsi Ukrainaan vuonna 2022, ja se muutti Suomen turvallisuuspolitiikkaa."`,
      B1: `LANGUAGE RULES FOR B1 (intermediate):
- 12–18 words per sentence. Mix of simple and compound sentences.
- All tenses allowed (present, past, future, perfect). Passive voice used occasionally.
- Wider vocabulary including topic-specific words, but explain difficult terms in context.
- Subordinate clauses with joka, jotta, vaikka, koska, jos are all fine.
- Avoid rare idiomatic expressions or highly technical jargon.
- Example sentence style: "Suomen NATO-jäsenyys muutti maan turvallisuuspolitiikkaa merkittävästi, koska aiemmin Suomi oli sotilaallisesti liittoutumaton maa."`,
      B2: `LANGUAGE RULES FOR B2 (upper-intermediate):
- Rich, varied sentence structures. 15–25 words per sentence is fine.
- Full range of tenses, passive voice, conditional, and participle constructions.
- Broad academic and topic-specific vocabulary. Use precise terminology naturally.
- Complex subordinate clauses and nuanced argumentation.
- The text should read like a real Finnish newspaper or magazine article.
- Example sentence style: "Tekoälyn nopea kehitys on herättänyt laajaa yhteiskunnallista keskustelua siitä, miten sen käyttöä tulisi säännellä kansainvälisellä tasolla."`,
    };

    const guide = levelGuide[level] || levelGuide['B1'];

    const completion = await this.groq.chat.completions.create({
      model: this.config.get<string>('groq.model') || 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You generate Finnish reading practice articles for language learners. Write factual, informative content — not fictional stories.
Topic: ${topicLine}
Target CEFR level: ${level}.

${guide}

STRUCTURE RULES:
- Write exactly 3 or 4 paragraphs. Never fewer.
- Each paragraph must have at least 4 complete sentences. Never fewer.
- Separate paragraphs with \\n\\n.
- Base the content on real facts about the topic. Adapt the complexity of ideas — not just words — to the level. For A1/A2, cover only the simplest key facts about the topic. For B1/B2, include analysis and detail.
- The text should feel like a short educational passage or newspaper article.

Respond ONLY with valid JSON matching this exact schema:
{
  "title": "Finnish title of the article",
  "titleEn": "English title of the article",
  "category": "one of: History | Culture | Law & Society | Current Events | Science | Economy | Nordic Life | Nature | Technology | Health | Media",
  "text": "3–4 paragraphs in Finnish separated by \\n\\n, each with at least 4 sentences, written strictly at ${level} level",
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
"correct" is the 0-based index of the correct answer in "options". You MUST include exactly 10 questions — no more, no fewer. Questions for A1/A2 should be simple factual recall. Questions for B1/B2 may require inference and understanding of details.`,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.75,
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
}
