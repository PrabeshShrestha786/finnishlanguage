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
