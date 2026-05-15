import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { StreakService } from '../streak/streak.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private leaderboard: LeaderboardService,
    private streak: StreakService,
  ) {}

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
    await this.streak.resetBrokenStreak(userId);
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
    await this.streak.updateStreak(userId, xpEarned);
    return { xpEarned };
  }
}
