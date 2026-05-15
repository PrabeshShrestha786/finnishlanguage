import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { LeaderboardModule } from '../leaderboard/leaderboard.module';
import { LeaderboardService } from '../leaderboard/leaderboard.service';
import { StreakModule } from '../streak/streak.module';

@Module({
  imports: [LeaderboardModule, StreakModule],
  controllers: [UsersController],
  providers: [UsersService, PrismaService, LeaderboardService],
  exports: [UsersService],
})
export class UsersModule {}
