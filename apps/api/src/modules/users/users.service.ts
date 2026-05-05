import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService, private leaderboard: LeaderboardService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
        achievements: { include: { achievement: true }, orderBy: { earnedAt: 'desc' } },
        certificates: { orderBy: { issueDate: 'desc' } },
        _count: { select: { attempts: true, chatMessages: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: string, data: {
    firstName?: string;
    lastName?: string;
    avatar?: string;
    nativeLanguage?: string;
    finnishLevel?: string;
    targetLevel?: string;
    dailyGoalMinutes?: number;
    timezone?: string;
  }) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: data as any,
    });
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async getDashboardStats(userId: string) {
    const [user, weeklyAttempts, recentLessons, vocabStats] = await Promise.all([
      this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          totalXP: true, currentStreak: true, longestStreak: true,
          finnishLevel: true, targetLevel: true, dailyGoalMinutes: true,
        },
      }),
      this.prisma.attempt.findMany({
        where: {
          userId,
          completedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
        select: { completedAt: true, xpEarned: true },
      }),
      this.prisma.attempt.findMany({
        where: { userId, lessonId: { not: null } },
        distinct: ['lessonId'],
        orderBy: { completedAt: 'desc' },
        take: 5,
        include: { lesson: { select: { title: true, type: true, level: true } } },
      }),
      this.prisma.vocabProgress.aggregate({
        where: { userId },
        _count: { id: true },
      }),
    ]);

    const todayXP = await this.prisma.attempt.aggregate({
      where: { userId, completedAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
      _sum: { xpEarned: true, timeSpentSec: true },
    });

    // Build a 7-element array [Mon..Sun] with XP totals per day
    const dailyXP = [0, 0, 0, 0, 0, 0, 0];
    for (const a of weeklyAttempts) {
      const d = new Date(a.completedAt);
      // getDay() returns 0=Sun..6=Sat; shift to Mon=0..Sun=6
      const dayIdx = (d.getDay() + 6) % 7;
      dailyXP[dayIdx] += a.xpEarned || 0;
    }

    return {
      ...user,
      todayXP: todayXP._sum.xpEarned || 0,
      todayMinutes: Math.ceil((todayXP._sum.timeSpentSec || 0) / 60),
      weeklyXP: dailyXP,
      recentLessons,
      wordsStudied: vocabStats._count.id,
    };
  }

  async awardXP(userId: string, xpEarned: number, source?: string) {
    if (xpEarned <= 0) return { xpEarned: 0 };
    await Promise.all([
      this.prisma.user.update({
        where: { id: userId },
        data: { totalXP: { increment: xpEarned }, lastActiveAt: new Date() },
      }),
      this.prisma.attempt.create({
        data: {
          userId,
          answer: { source: source || 'activity' },
          isCorrect: true,
          score: xpEarned,
          xpEarned,
        },
      }),
      this.leaderboard.addXP(userId, xpEarned),
    ]);
    return { xpEarned };
  }

  async updateStreak(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await this.prisma.streakRecord.findUnique({
      where: { userId_date: { userId, date: today } },
    });

    if (!existing) {
      await this.prisma.streakRecord.create({ data: { userId, date: today, completed: true } });
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yest = await this.prisma.streakRecord.findUnique({
        where: { userId_date: { userId, date: yesterday } },
      });

      const user = await this.prisma.user.findUnique({ where: { id: userId } });
      const newStreak = yest ? (user?.currentStreak || 0) + 1 : 1;
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          currentStreak: newStreak,
          longestStreak: { set: Math.max(user?.longestStreak || 0, newStreak) },
          lastActiveAt: new Date(),
        },
      });
    }
  }
}
