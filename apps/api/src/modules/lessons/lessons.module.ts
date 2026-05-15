import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { StreakModule } from '../streak/streak.module';

@Module({
  imports: [LeaderboardModule, StreakModule],
  controllers: [LessonsController],
  providers: [LessonsService, PrismaService, LeaderboardService],
  exports: [LessonsService],
})
export class LessonsModule {}
