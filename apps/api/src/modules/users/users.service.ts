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
    username?: string;
    avatar?: string;
    nativeLanguage?: string;
    finnishLevel?: string;
    targetLevel?: string;
    dailyGoalMinutes?: number;
    timezone?: string;
  }) {
    // Explicitly pick only fields that exist in the schema
    const allowed: Record<string, unknown> = {};
    if (data.firstName    !== undefined) allowed.firstName    = data.firstName;
    if (data.lastName     !== undefined) allowed.lastName     = data.lastName;
    if (data.username     !== undefined) allowed.username     = data.username;
    if (data.avatar       !== undefined) allowed.avatar       = data.avatar;
    if (data.nativeLanguage !== undefined) allowed.nativeLanguage = data.nativeLanguage;
    if (data.finnishLevel !== undefined) allowed.finnishLevel = data.finnishLevel;
    if (data.targetLevel  !== undefined) allowed.targetLevel  = data.targetLevel;
    if (data.dailyGoalMinutes !== undefined) allowed.dailyGoalMinutes = data.dailyGoalMinutes;
    if (data.timezone     !== undefined) allowed.timezone     = data.timezone;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: allowed as any,
    });
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async getDashboardStats(userId: string) {
    await this.resetBrokenStreak(userId);
    const [user, weeklyAttempts, recentLessons, vocabStats, lessonsCompleted] = await Promise.all([
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
      this.prisma.attempt.count({
        where: { userId, lessonId: { not: null }, isCorrect: true },
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
      lessonsCompleted,
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
    await this.updateStreak(userId);
    return { xpEarned };
  }

  // Returns midnight of today in Finland time (Europe/Helsinki) as a plain UTC-stored Date.
  // Ensures streak day boundaries match the Finnish calendar day, not the server's UTC day.
  private todayFinland(): Date {
    const now = new Date();
    const localStr = now.toLocaleString('en-CA', { timeZone: 'Europe/Helsinki' }); // "YYYY-MM-DD, HH:MM:SS"
    const dateStr = localStr.split(',')[0]; // "YYYY-MM-DD"
    return new Date(`${dateStr}T00:00:00.000Z`);
  }

  async updateStreak(userId: string) {
    const today = this.todayFinland();
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const existing = await this.prisma.streakRecord.findUnique({
      where: { userId_date: { userId, date: today } },
    });
    if (existing) return;

    await this.prisma.streakRecord.create({ data: { userId, date: today, completed: true } });

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

  // Resets streak to 0 if the user has no activity record for today or yesterday.
  // Called on dashboard fetch so the UI never shows a stale streak.
  async resetBrokenStreak(userId: string) {
    const today = this.todayFinland();
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    const recent = await this.prisma.streakRecord.findFirst({
      where: { userId, date: { gte: yesterday } },
    });
    if (!recent) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { currentStreak: 0 },
      });
    }
  }
}
