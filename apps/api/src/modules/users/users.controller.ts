import { Controller, Get, Patch, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  getProfile(@Request() req: any) {
    return this.usersService.getProfile(req.user.sub);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  updateProfile(@Body() body: any, @Request() req: any) {
    return this.usersService.updateProfile(req.user.sub, body);
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Get dashboard stats' })
  getDashboard(@Request() req: any) {
    return this.usersService.getDashboardStats(req.user.sub);
  }

  @Post('xp')
  @ApiOperation({ summary: 'Award XP for an activity (reading, listening, etc.)' })
  awardXP(@Body() body: { xpEarned: number; source?: string }, @Request() req: any) {
    return this.usersService.awardXP(req.user.sub, body.xpEarned, body.source);
  }
}
