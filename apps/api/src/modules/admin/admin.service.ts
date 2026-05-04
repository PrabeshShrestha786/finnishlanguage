import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [users, activeSubscriptions, totalRevenue, lessonsCount, attemptCount] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.subscription.count({ where: { status: 'ACTIVE', plan: { not: 'FREE' } } }),
      this.prisma.payment.aggregate({ where: { status: 'COMPLETED' }, _sum: { amount: true } }),
      this.prisma.lesson.count({ where: { isPublished: true } }),
      this.prisma.attempt.count(),
    ]);

    const newUsersThisWeek = await this.prisma.user.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    });

    const planBreakdown = await this.prisma.subscription.groupBy({
      by: ['plan'],
      _count: { id: true },
    });

    return {
      totalUsers: users,
      newUsersThisWeek,
      activeSubscriptions,
      totalRevenue: totalRevenue._sum.amount || 0,
      totalLessons: lessonsCount,
      totalAttempts: attemptCount,
      planBreakdown,
    };
  }

  async getUsers(query: { page?: number; limit?: number; search?: string; plan?: string }) {
    const { page = 1, limit = 20, search, plan } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) where.OR = [{ email: { contains: search } }, { username: { contains: search } }];
    if (plan) where.subscription = { plan };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { subscription: { select: { plan: true, status: true } }, _count: { select: { attempts: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users: users.map(({ passwordHash: _, ...u }) => u), total, page, totalPages: Math.ceil(total / limit) };
  }

  async banUser(adminId: string, userId: string, reason: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { isBanned: true, banReason: reason } });
    await this.prisma.adminLog.create({ data: { adminId, action: 'BAN_USER', targetId: userId, details: { reason } } });
    return { success: true };
  }

  async unbanUser(adminId: string, userId: string) {
    await this.prisma.user.update({ where: { id: userId }, data: { isBanned: false, banReason: null } });
    await this.prisma.adminLog.create({ data: { adminId, action: 'UNBAN_USER', targetId: userId } });
    return { success: true };
  }

  async createLesson(data: any) {
    return this.prisma.lesson.create({ data });
  }

  async updateLesson(id: string, data: any) {
    return this.prisma.lesson.update({ where: { id }, data });
  }

  async deleteLesson(adminId: string, id: string) {
    await this.prisma.lesson.delete({ where: { id } });
    await this.prisma.adminLog.create({ data: { adminId, action: 'DELETE_LESSON', targetId: id } });
    return { success: true };
  }

  async createCoupon(data: { code: string; discountPercent: number; maxUses?: number; validUntil?: Date }) {
    return this.prisma.coupon.create({ data: { ...data, code: data.code.toUpperCase() } });
  }

  async getLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.adminLog.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.adminLog.count(),
    ]);
    return { logs, total, page, totalPages: Math.ceil(total / limit) };
  }
}
