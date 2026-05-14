import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IssuesService {
  constructor(private prisma: PrismaService) {}

  async createReport(userId: string, description: string, imageData?: string, page?: string) {
    return this.prisma.issueReport.create({
      data: { userId, description, imageData, page },
    });
  }

  async getAllReports(status?: string) {
    return this.prisma.issueReport.findMany({
      where: status ? { status } : undefined,
      include: {
        user: { select: { username: true, email: true, finnishLevel: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.issueReport.update({ where: { id }, data: { status } });
  }
}
