import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Public()
  @Get('courses')
  getCourses(@Query('level') level?: string) {
    return this.lessonsService.getCourses(level);
  }

  @Get()
  getLessons(@Query() query: any) {
    return this.lessonsService.getLessons(query);
  }

  @Get('progress')
  getUserProgress(@Request() req: any) {
    return this.lessonsService.getUserProgress(req.user.sub);
  }

  @Get(':id')
  getLesson(@Param('id') id: string, @Request() req: any) {
    return this.lessonsService.getLesson(id, req.user.sub);
  }

  @Post(':id/attempt')
  submitAttempt(@Param('id') id: string, @Body() body: any, @Request() req: any) {
    return this.lessonsService.submitAttempt(req.user.sub, id, body);
  }
}
