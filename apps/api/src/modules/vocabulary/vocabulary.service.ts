import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  async getWords(query: { category?: string; level?: string; page?: number; limit?: number }) {
    const { category, level } = query;
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (category) where.category = category;
    if (level) where.level = level;

    const [words, total] = await Promise.all([
      this.prisma.vocabWord.findMany({ where, skip, take: limit, orderBy: { finnish: 'asc' } }),
      this.prisma.vocabWord.count({ where }),
    ]);
    return { words, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getDueFlashcards(userId: string, limit = 20, category?: string, level?: string) {
    const wordFilter: any = {};
    if (category && category !== 'all') wordFilter.category = category;
    if (level && level !== 'all') wordFilter.level = level;
    const hasFilter = Object.keys(wordFilter).length > 0;

    const due = await this.prisma.vocabProgress.findMany({
      where: {
        userId,
        nextReview: { lte: new Date() },
        ...(hasFilter ? { word: wordFilter } : {}),
      },
      include: { word: true },
      orderBy: { nextReview: 'asc' },
      take: limit,
    });

    if (due.length < limit) {
      const learnedIds = due.map((d) => d.wordId);
      const unstarted = await this.prisma.vocabWord.findMany({
        where: {
          id: { notIn: learnedIds },
          progress: { none: { userId } },
          ...(hasFilter ? wordFilter : {}),
        },
        take: limit - due.length,
      });
      return { flashcards: due, newWords: unstarted };
    }
    return { flashcards: due, newWords: [] };
  }

  async reviewFlashcard(userId: string, wordId: string, quality: number) {
    let progress = await this.prisma.vocabProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });

    let easeFactor = progress?.easeFactor || 2.5;
    let interval = progress?.interval || 1;
    let repetitions = progress?.repetitions || 0;

    // SM-2 Spaced Repetition Algorithm
    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Failed cards (Again/Hard) become due immediately so they show up in "Due for Review" right away.
    const nextReview = new Date();
    if (quality >= 3) nextReview.setDate(nextReview.getDate() + interval);

    // "Easy" (5) explicitly signals mastery regardless of repetition count.
    const isLearned = quality === 5 || repetitions >= 3;

    progress = await this.prisma.vocabProgress.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { easeFactor, interval, repetitions, nextReview, lastReview: new Date(), isLearned },
      create: { userId, wordId, easeFactor, interval, repetitions, nextReview, lastReview: new Date(), isLearned },
    });

    if (quality >= 3) {
      await Promise.all([
        this.prisma.user.update({
          where: { id: userId },
          data: { totalXP: { increment: 2 }, lastActiveAt: new Date() },
        }),
        this.prisma.attempt.create({
          data: { userId, answer: { source: 'vocabulary' }, isCorrect: true, score: 2, xpEarned: 2 },
        }),
      ]);
    }

    return { progress, nextReview, interval };
  }

  async getUserVocabStats(userId: string) {
    const now = new Date();
    const [total, learned, due] = await Promise.all([
      this.prisma.vocabProgress.count({ where: { userId } }),
      this.prisma.vocabProgress.count({ where: { userId, isLearned: true } }),
      this.prisma.vocabProgress.count({ where: { userId, nextReview: { lte: now } } }),
    ]);
    const scheduled = total - learned - due;
    return { totalStudied: total, learned, dueForReview: due, scheduled };
  }

  async getDailyWords(userId: string, level: string, count = 10) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { nativeLanguage: true } });
    const words = await this.prisma.vocabWord.findMany({
      where: { level: level as any },
      take: count,
      skip: Math.floor(Math.random() * 50),
      orderBy: { finnish: 'asc' },
    });
    return { words, nativeLanguage: user?.nativeLanguage || 'ENGLISH' };
  }

  async getDueWords(userId: string) {
    const due = await this.prisma.vocabProgress.findMany({
      where: { userId, nextReview: { lte: new Date() } },
      include: { word: true },
      orderBy: { nextReview: 'asc' },
    });
    return due.map((p) => p.word);
  }

  async getLearnedWords(userId: string) {
    const progress = await this.prisma.vocabProgress.findMany({
      where: { userId, isLearned: true },
      include: { word: true },
      orderBy: { lastReview: 'desc' },
    });
    return progress.map((p) => p.word);
  }

  async getFavorites(userId: string, level?: string) {
    const favorites = await this.prisma.vocabProgress.findMany({
      where: {
        userId,
        isFavorite: true,
        ...(level && level !== 'all' ? { word: { level: level as any } } : {}),
      },
      include: { word: true },
    });
    return favorites.map((f) => f.word);
  }

  async getCategories(level?: string) {
    const where: any = {};
    if (level && level !== 'all') where.level = level;
    const counts = await this.prisma.vocabWord.groupBy({
      by: ['category'],
      where,
      _count: { id: true },
      orderBy: { category: 'asc' },
    });
    return counts.map((c) => ({ category: c.category, count: c._count.id }));
  }

  async toggleFavorite(userId: string, wordId: string) {
    const existing = await this.prisma.vocabProgress.findUnique({
      where: { userId_wordId: { userId, wordId } },
    });
    if (!existing) {
      return this.prisma.vocabProgress.create({ data: { userId, wordId, isFavorite: true } });
    }
    return this.prisma.vocabProgress.update({
      where: { userId_wordId: { userId, wordId } },
      data: { isFavorite: !existing.isFavorite },
    });
  }
}
