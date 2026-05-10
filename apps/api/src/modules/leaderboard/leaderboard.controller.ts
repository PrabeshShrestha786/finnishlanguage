import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LeaderboardService } from './leaderboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Leaderboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('leaderboard')
export class LeaderboardController {
  constructor(private leaderboardService: LeaderboardService) {}

  @Public()
  @Get('weekly')
  @ApiOperation({ summary: 'Weekly leaderboard' })
  getWeekly(@Query('limit') limit?: string) {
    const n = parseInt(limit ?? '', 10);
    return this.leaderboardService.getWeeklyLeaderboard(isNaN(n) ? undefined : n);
  }

  @Public()
  @Get('all-time')
  @ApiOperation({ summary: 'All-time leaderboard' })
  getAllTime(@Query('limit') limit?: string) {
    const n = parseInt(limit ?? '', 10);
    return this.leaderboardService.getAllTimeLeaderboard(isNaN(n) ? undefined : n);
  }

  @Get('my-rank')
  @ApiOperation({ summary: 'Get current user rank' })
  getMyRank(@Request() req: any) {
    return this.leaderboardService.getUserRank(req.user.sub);
  }
}
