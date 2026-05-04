import {
  Controller, Get, Post, Patch, Delete, Body,
  Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Admin dashboard stats' })
  getStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  getUsers(@Query() query: any) {
    return this.adminService.getUsers(query);
  }

  @Post('users/:id/ban')
  banUser(@Param('id') id: string, @Body() body: { reason: string }, @Request() req: any) {
    return this.adminService.banUser(req.user.sub, id, body.reason);
  }

  @Post('users/:id/unban')
  unbanUser(@Param('id') id: string, @Request() req: any) {
    return this.adminService.unbanUser(req.user.sub, id);
  }

  @Post('lessons')
  createLesson(@Body() body: any) {
    return this.adminService.createLesson(body);
  }

  @Patch('lessons/:id')
  updateLesson(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateLesson(id, body);
  }

  @Delete('lessons/:id')
  deleteLesson(@Param('id') id: string, @Request() req: any) {
    return this.adminService.deleteLesson(req.user.sub, id);
  }

  @Post('coupons')
  createCoupon(@Body() body: any) {
    return this.adminService.createCoupon(body);
  }

  @Get('logs')
  getLogs(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getLogs(page, limit);
  }
}
