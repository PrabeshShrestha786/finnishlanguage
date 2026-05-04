import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Leaderboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Get('weekly')
  @ApiOperation({ summary: 'Weekly leaderboard' })
  getWeekly(@Query('limit') limit?: number) {
    return this.leaderboardService.getWeeklyLeaderboard(limit);
  }

  @Get('all-time')
  @ApiOperation({ summary: 'All-time leaderboard' })
  getAllTime(@Query('limit') limit?: number) {
    return this.leaderboardService.getAllTimeLeaderboard(limit);
  }

  @Get('my-rank')
  @ApiOperation({ summary: 'Get current user rank' })
  getMyRank(@Request() req: any) {
    return this.leaderboardService.getUserRank(req.user.sub);
  }
}
