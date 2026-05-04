import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LeaderboardService {
  constructor(private prisma: PrismaService) {}

  private getCurrentWeek(): string {
    const now = new Date();
    const year = now.getFullYear();
    const week = Math.ceil((now.getDate() + new Date(year, now.getMonth(), 1).getDay()) / 7);
    return `${year}-W${String(week).padStart(2, '0')}`;
  }

  async getWeeklyLeaderboard(limit = 50) {
    const week = this.getCurrentWeek();
    const entries = await this.prisma.leaderboardEntry.findMany({
      where: { week },
      include: {
        user: { select: { username: true, firstName: true, avatar: true, currentStreak: true, finnishLevel: true } },
      },
      orderBy: { xp: 'desc' },
      take: limit,
    });
    return entries.map((e, i) => ({ ...e, rank: i + 1 }));
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
    const week = this.getCurrentWeek();
    const userEntry = await this.prisma.leaderboardEntry.findUnique({ where: { userId_week: { userId, week } } });
    const rank = userEntry
      ? await this.prisma.leaderboardEntry.count({ where: { week, xp: { gt: userEntry.xp } } }) + 1
      : null;
    const allTimeRank = await this.prisma.user.count({
      where: { totalXP: { gt: (await this.prisma.user.findUnique({ where: { id: userId }, select: { totalXP: true } }))?.totalXP || 0 } },
    }) + 1;
    return { weeklyRank: rank, weeklyXP: userEntry?.xp || 0, allTimeRank };
  }

  async addXP(userId: string, xp: number) {
    const week = this.getCurrentWeek();
    return this.prisma.leaderboardEntry.upsert({
      where: { userId_week: { userId, week } },
      update: { xp: { increment: xp } },
      create: { userId, week, xp },
    });
  }
}
