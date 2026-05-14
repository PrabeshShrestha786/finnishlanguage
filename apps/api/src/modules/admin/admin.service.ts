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

  async getUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        subscription: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
        _count: { select: { attempts: true, vocabularyProgress: true } },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async updateUserRole(adminId: string, userId: string, role: string) {
    const updated = await this.prisma.user.update({ where: { id: userId }, data: { role: role as any } });
    await this.prisma.adminLog.create({ data: { adminId, action: 'UPDATE_ROLE', targetId: userId, details: { role } } });
    const { passwordHash: _, ...safe } = updated;
    return safe;
  }

  async getSubscriptions(query: { page?: number; limit?: number; plan?: string; status?: string }) {
    const { page = 1, limit = 20, plan, status } = query;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (plan) where.plan = plan;
    if (status) where.status = status;
    const [subs, total] = await Promise.all([
      this.prisma.subscription.findMany({
        where,
        skip,
        take: limit,
        include: { user: { select: { id: true, email: true, username: true, finnishLevel: true, createdAt: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.subscription.count({ where }),
    ]);
    return { subscriptions: subs, total, page, totalPages: Math.ceil(total / limit) };
  }

  async getCoupons() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async toggleCoupon(id: string, isActive: boolean) {
    return this.prisma.coupon.update({ where: { id }, data: { isActive } });
  }

  async getCourses() {
    return this.prisma.course.findMany({
      include: {
        _count: { select: { modules: true } },
        modules: { include: { _count: { select: { lessons: true } } } },
      },
      orderBy: { order: 'asc' },
    });
  }

  async toggleCoursePublished(id: string, isPublished: boolean) {
    return this.prisma.course.update({ where: { id }, data: { isPublished } });
  }

  async toggleLessonPublished(id: string, isPublished: boolean) {
    return this.prisma.lesson.update({ where: { id }, data: { isPublished } });
  }

  async getAnalytics() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [signupsRaw, paymentsRaw, xpRaw, topUsers, levelBreakdown] = await Promise.all([
      this.prisma.user.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      this.prisma.payment.findMany({
        where: { status: 'COMPLETED', createdAt: { gte: thirtyDaysAgo } },
        select: { amount: true, createdAt: true },
      }),
      this.prisma.attempt.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { xpEarned: true, createdAt: true },
      }),
      this.prisma.user.findMany({
        orderBy: { totalXP: 'desc' },
        take: 5,
        select: { username: true, totalXP: true, finnishLevel: true },
      }),
      this.prisma.user.groupBy({ by: ['finnishLevel'], _count: { id: true } }),
    ]);

    // Build 30-day buckets
    const days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date(thirtyDaysAgo);
      d.setDate(d.getDate() + i);
      return d.toISOString().slice(0, 10);
    });

    const bucket = (items: { createdAt: Date }[], key: string) =>
      days.map((day) => ({ date: day, [key]: items.filter((r) => r.createdAt.toISOString().slice(0, 10) === day).length }));

    const signups = bucket(signupsRaw, 'count');
    const revenue = days.map((day) => ({
      date: day,
      amount: paymentsRaw.filter((p) => p.createdAt.toISOString().slice(0, 10) === day).reduce((s, p) => s + p.amount, 0),
    }));
    const activity = days.map((day) => ({
      date: day,
      xp: xpRaw.filter((a) => a.createdAt.toISOString().slice(0, 10) === day).reduce((s, a) => s + (a.xpEarned || 0), 0),
    }));

    return { signups, revenue, activity, topUsers, levelBreakdown };
  }
}
