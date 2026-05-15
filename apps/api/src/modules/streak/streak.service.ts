import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StreakService {
  constructor(private prisma: PrismaService) {}

  private todayUTC(): Date {
    const now = new Date();
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  }

  async updateStreak(userId: string, xpEarned = 0) {
    const today = this.todayUTC();
    const yesterday = new Date(today);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);

    // createMany with skipDuplicates is atomic — no race condition between concurrent requests
    const { count } = await this.prisma.streakRecord.createMany({
      data: [{ userId, date: today, completed: true, xpEarned }],
      skipDuplicates: true,
    });

    if (count === 0) {
      // Record already existed for today; just accumulate XP
      if (xpEarned > 0) {
        await this.prisma.streakRecord.update({
          where: { userId_date: { userId, date: today } },
          data: { xpEarned: { increment: xpEarned } },
        });
      }
      return;
    }

    // First activity today — compute new streak and persist
    const [yest, user] = await Promise.all([
      this.prisma.streakRecord.findUnique({ where: { userId_date: { userId, date: yesterday } } }),
      this.prisma.user.findUnique({ where: { id: userId }, select: { currentStreak: true, longestStreak: true } }),
    ]);

    const newStreak = yest ? (user?.currentStreak ?? 0) + 1 : 1;
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: { set: Math.max(user?.longestStreak ?? 0, newStreak) },
        lastActiveAt: new Date(),
      },
    });
  }

  async resetBrokenStreak(userId: string) {
    const today = this.todayUTC();
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
