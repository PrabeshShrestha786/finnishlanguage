import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VocabularyService {
  constructor(private prisma: PrismaService) {}

  async getWords(query: { category?: string; level?: string; page?: number; limit?: number }) {
    const { category, level, page = 1, limit = 20 } = query;
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
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    progress = await this.prisma.vocabProgress.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { easeFactor, interval, repetitions, nextReview, lastReview: new Date(), isLearned: repetitions >= 3 },
      create: { userId, wordId, easeFactor, interval, repetitions, nextReview, lastReview: new Date() },
    });

    if (quality >= 3) {
      await this.prisma.user.update({ where: { id: userId }, data: { totalXP: { increment: 2 } } });
    }

    return { progress, nextReview, interval };
  }

  async getUserVocabStats(userId: string) {
    const [total, learned, due] = await Promise.all([
      this.prisma.vocabProgress.count({ where: { userId } }),
      this.prisma.vocabProgress.count({ where: { userId, isLearned: true } }),
      this.prisma.vocabProgress.count({ where: { userId, nextReview: { lte: new Date() } } }),
    ]);
    return { totalStudied: total, learned, dueForReview: due };
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

  async getFavorites(userId: string) {
    const favorites = await this.prisma.vocabProgress.findMany({
      where: { userId, isFavorite: true },
      include: { word: true },
    });
    return favorites.map((f) => f.word);
  }

  async getCategories() {
    const counts = await this.prisma.vocabWord.groupBy({
      by: ['category'],
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
