import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async getCourses(level?: string) {
    return this.prisma.course.findMany({
      where: { isPublished: true, ...(level && { level: level as any }) },
      include: {
        modules: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
              select: { id: true, title: true, xpReward: true, estimatedMinutes: true, isFree: true, level: true, type: true },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async getLesson(id: string, userId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, isPublished: true },
      include: { exercises: { orderBy: { order: 'asc' } } },
    });
    if (!lesson) throw new NotFoundException('Lesson not found');

    const lastAttempt = await this.prisma.attempt.findFirst({
      where: { userId, lessonId: id },
      orderBy: { completedAt: 'desc' },
    });

    return { ...lesson, lastAttempt };
  }

  async getLessons(query: { type?: string; level?: string; page?: number; limit?: number }) {
    const { type, level, page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const where: any = { isPublished: true };
    if (type) where.type = type;
    if (level) where.level = level;

    const [lessons, total] = await Promise.all([
      this.prisma.lesson.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ level: 'asc' }, { order: 'asc' }],
      }),
      this.prisma.lesson.count({ where }),
    ]);

    return { lessons, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async submitAttempt(userId: string, lessonId: string, data: {
    exerciseId?: string;
    answer: any;
    timeSpentSec: number;
  }) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let isCorrect = false;
    let score = 0;
    let xpEarned = 0;

    if (data.exerciseId) {
      const exercise = await this.prisma.exercise.findUnique({ where: { id: data.exerciseId } });
      if (exercise) {
        isCorrect = JSON.stringify(exercise.correctAnswer) === JSON.stringify(data.answer);
        score = isCorrect ? exercise.points : 0;
        xpEarned = isCorrect ? Math.ceil(exercise.points * 0.5) : 0;
      }
    } else {
      score = data.answer?.score || 0;
      isCorrect = score > 0;
      xpEarned = Math.ceil(score * 0.3);
    }

    const attempt = await this.prisma.attempt.create({
      data: {
        userId,
        lessonId,
        exerciseId: data.exerciseId,
        answer: data.answer,
        isCorrect,
        score,
        timeSpentSec: data.timeSpentSec,
        xpEarned,
      },
    });

    if (xpEarned > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { totalXP: { increment: xpEarned }, lastActiveAt: new Date() },
      });
    }

    return { attempt, isCorrect, score, xpEarned };
  }

  async getUserProgress(userId: string) {
    const [attempts, streaks] = await Promise.all([
      this.prisma.attempt.groupBy({
        by: ['lessonId'],
        where: { userId },
        _count: { id: true },
        _max: { score: true },
      }),
      this.prisma.streakRecord.findMany({
        where: { userId },
        orderBy: { date: 'desc' },
        take: 30,
      }),
    ]);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { totalXP: true, currentStreak: true, longestStreak: true, finnishLevel: true },
    });

    return { attempts, streaks, ...user };
  }
}
