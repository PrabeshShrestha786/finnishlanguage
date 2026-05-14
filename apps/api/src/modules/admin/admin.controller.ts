import {
  Controller, Get, Post, Patch, Delete, Body,
  Param, Query, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { IssuesService } from '../issues/issues.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService, private issuesService: IssuesService) {}

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

  @Get('users/:id')
  getUser(@Param('id') id: string) {
    return this.adminService.getUser(id);
  }

  @Patch('users/:id/role')
  updateRole(@Param('id') id: string, @Body() body: { role: string }, @Request() req: any) {
    return this.adminService.updateUserRole(req.user.sub, id, body.role);
  }

  @Get('subscriptions')
  getSubscriptions(@Query() query: any) {
    return this.adminService.getSubscriptions(query);
  }

  @Get('coupons')
  getCoupons() {
    return this.adminService.getCoupons();
  }

  @Patch('coupons/:id/toggle')
  toggleCoupon(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.adminService.toggleCoupon(id, body.isActive);
  }

  @Get('courses')
  getCourses() {
    return this.adminService.getCourses();
  }

  @Patch('courses/:id/publish')
  toggleCoursePublished(@Param('id') id: string, @Body() body: { isPublished: boolean }) {
    return this.adminService.toggleCoursePublished(id, body.isPublished);
  }

  @Patch('lessons/:id/publish')
  toggleLessonPublished(@Param('id') id: string, @Body() body: { isPublished: boolean }) {
    return this.adminService.toggleLessonPublished(id, body.isPublished);
  }

  @Get('analytics')
  getAnalytics() {
    return this.adminService.getAnalytics();
  }

  @Get('issues')
  getIssues(@Query('status') status?: string) {
    return this.issuesService.getAllReports(status);
  }

  @Patch('issues/:id/status')
  updateIssueStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.issuesService.updateStatus(id, body.status);
  }
}
