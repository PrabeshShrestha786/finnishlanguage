import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  private sevenDaysAgo(): Date {
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  async getWeeklyLeaderboard(limit = 50) {
    const since = this.sevenDaysAgo();

    const grouped = await this.prisma.attempt.groupBy({
      by: ['userId'],
      where: { completedAt: { gte: since }, xpEarned: { gt: 0 } },
      _sum: { xpEarned: true },
      orderBy: { _sum: { xpEarned: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) return [];

    const users = await this.prisma.user.findMany({
      where: { id: { in: grouped.map((g) => g.userId) } },
      select: { id: true, username: true, firstName: true, avatar: true, currentStreak: true, finnishLevel: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    return grouped.map((g, i) => ({
      rank: i + 1,
      xp: g._sum.xpEarned ?? 0,
      user: userMap.get(g.userId) ?? null,
    }));
  }

  async getAllTimeLeaderboard(limit = 50) {
    return this.prisma.user.findMany({
      select: {
        id: true, username: true, firstName: true, avatar: true,
        totalXP: true, currentStreak: true, finnishLevel: true,
      },
      orderBy: { totalXP: 'desc' },
      take: limit,
    });
  }

  async getUserRank(userId: string) {
    const since = this.sevenDaysAgo();

    const userAgg = await this.prisma.attempt.aggregate({
      where: { userId, completedAt: { gte: since }, xpEarned: { gt: 0 } },
      _sum: { xpEarned: true },
    });
    const weeklyXP = userAgg._sum.xpEarned ?? 0;

    const allGroups = await this.prisma.attempt.groupBy({
      by: ['userId'],
      where: { completedAt: { gte: since }, xpEarned: { gt: 0 } },
      _sum: { xpEarned: true },
      having: { xpEarned: { _sum: { gt: weeklyXP } } },
    });
    const weeklyRank = weeklyXP > 0 ? allGroups.length + 1 : null;

    const me = await this.prisma.user.findUnique({ where: { id: userId }, select: { totalXP: true } });
    const allTimeRank = await this.prisma.user.count({ where: { totalXP: { gt: me?.totalXP ?? 0 } } }) + 1;

    return { weeklyRank, weeklyXP, allTimeRank };
  }

  async addXP(_userId: string, _xp: number) {
    // Weekly XP is now derived directly from the attempt table (rolling 7-day window)
  }
}
