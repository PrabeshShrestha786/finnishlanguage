import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Exercises')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('exercises')
export class ExercisesController {
  constructor(private exercisesService: ExercisesService) {}

  @Get(':id')
  getExercise(@Param('id') id: string) {
    return this.exercisesService.getExercise(id);
  }

  @Post(':id/submit')
  submitAnswer(
    @Param('id') id: string,
    @Body() body: { answer: any; timeSpentSec: number },
    @Request() req: any,
  ) {
    return this.exercisesService.submitAnswer(req.user.sub, id, body.answer, body.timeSpentSec);
  }
}
