import { Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { StreakModule } from '../streak/streak.module';

@Module({
  imports: [StreakModule],
  controllers: [VocabularyController],
  providers: [VocabularyService, PrismaService],
  exports: [VocabularyService],
})
export class VocabularyModule {}
