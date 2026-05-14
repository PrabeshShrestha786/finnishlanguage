import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../../common/cache.service';

const TTL_LEADERBOARD = 300; // 5 minutes

@Injectable()
export class LeaderboardService {
  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  private sevenDaysAgo(): Date {
    return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  }

  async getWeeklyLeaderboard(limit = 50) {
    const KEY = 'leaderboard:weekly';
    const cached = await this.cache.get<any[]>(KEY);
    if (cached) return cached;

    const since = this.sevenDaysAgo();

    const grouped = await this.prisma.attempt.groupBy({
      by: ['userId'],
      where: { completedAt: { gte: since }, xpEarned: { gt: 0 } },
      _sum: { xpEarned: true },
      orderBy: { _sum: { xpEarned: 'desc' } },
      take: limit,
    });

    if (grouped.length === 0) {
      await this.cache.set(KEY, [], TTL_LEADERBOARD);
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: { id: { in: grouped.map((g) => g.userId) } },
      select: { id: true, username: true, firstName: true, avatar: true, currentStreak: true, finnishLevel: true, nativeLanguage: true },
    });

    const userMap = new Map(users.map((u) => [u.id, u]));

    const result = grouped.map((g, i) => ({
      rank: i + 1,
      xp: g._sum.xpEarned ?? 0,
      user: userMap.get(g.userId) ?? null,
    }));

    await this.cache.set(KEY, result, TTL_LEADERBOARD);
    return result;
  }

  async getAllTimeLeaderboard(limit = 50) {
    const KEY = 'leaderboard:all-time';
    const cached = await this.cache.get<any[]>(KEY);
    if (cached) return cached;

    const result = await this.prisma.user.findMany({
      select: {
        id: true, username: true, firstName: true, avatar: true,
        totalXP: true, currentStreak: true, finnishLevel: true, nativeLanguage: true,
      },
      orderBy: { totalXP: 'desc' },
      take: limit,
    });

    await this.cache.set(KEY, result, TTL_LEADERBOARD);
    return result;
  }

  async getUserRank(userId: string) {
    const KEY = `leaderboard:user-rank:${userId}`;
    const cached = await this.cache.get<{ weeklyRank: number | null; weeklyXP: number; allTimeRank: number }>(KEY);
    if (cached) return cached;

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

    const result = { weeklyRank, weeklyXP, allTimeRank };
    await this.cache.set(KEY, result, TTL_LEADERBOARD);
    return result;
  }

  async invalidateUserRank(userId: string) {
    await this.cache.del('leaderboard:weekly', `leaderboard:user-rank:${userId}`);
  }

  async addXP(_userId: string, _xp: number) {
    // Weekly XP is now derived directly from the attempt table (rolling 7-day window)
  }
}
