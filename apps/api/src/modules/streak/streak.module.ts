import { Module } from '@nestjs/common';
import { StreakService } from './streak.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  providers: [StreakService, PrismaService],
  exports: [StreakService],
})
export class StreakModule {}
