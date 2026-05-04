import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExercisesService {
  constructor(private prisma: PrismaService) {}

  async getExercise(id: string) {
    const exercise = await this.prisma.exercise.findUnique({ where: { id } });
    if (!exercise) throw new NotFoundException('Exercise not found');
    return exercise;
  }

  async submitAnswer(userId: string, exerciseId: string, answer: any, timeSpentSec: number) {
    const exercise = await this.prisma.exercise.findUnique({ where: { id: exerciseId } });
    if (!exercise) throw new NotFoundException('Exercise not found');

    const isCorrect = JSON.stringify(exercise.correctAnswer) === JSON.stringify(answer) ||
      String(exercise.correctAnswer).toLowerCase() === String(answer).toLowerCase();

    const score = isCorrect ? exercise.points : 0;
    const xpEarned = isCorrect ? Math.ceil(exercise.points * 0.5) : 0;

    const attempt = await this.prisma.attempt.create({
      data: { userId, exerciseId, lessonId: exercise.lessonId, answer, isCorrect, score, xpEarned, timeSpentSec },
    });

    if (xpEarned > 0) {
      await this.prisma.user.update({ where: { id: userId }, data: { totalXP: { increment: xpEarned } } });
    }

    return {
      isCorrect,
      score,
      xpEarned,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
      attempt,
    };
  }
}
