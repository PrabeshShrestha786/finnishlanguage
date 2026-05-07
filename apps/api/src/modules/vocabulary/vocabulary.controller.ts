import { Controller, Get, Post, Body, Query, UseGuards, Request, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VocabularyService } from './vocabulary.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('Vocabulary')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vocabulary')
export class VocabularyController {
  constructor(private vocabService: VocabularyService) {}

  @Get()
  getWords(@Query() query: any) {
    return this.vocabService.getWords(query);
  }

  @Get('categories')
  getCategories() {
    return this.vocabService.getCategories();
  }

  @Get('flashcards')
  getDueFlashcards(@Request() req: any, @Query('limit') limit?: number, @Query('category') category?: string) {
    return this.vocabService.getDueFlashcards(req.user.sub, limit, category);
  }

  @Get('stats')
  getStats(@Request() req: any) {
    return this.vocabService.getUserVocabStats(req.user.sub);
  }

  @Get('daily')
  getDailyWords(@Request() req: any, @Query('level') level: string, @Query('count') count?: number) {
    return this.vocabService.getDailyWords(req.user.sub, level, count);
  }

  @Post('review')
  reviewFlashcard(@Body() body: { wordId: string; quality: number }, @Request() req: any) {
    return this.vocabService.reviewFlashcard(req.user.sub, body.wordId, body.quality);
  }

  @Post(':wordId/favorite')
  toggleFavorite(@Param('wordId') wordId: string, @Request() req: any) {
    return this.vocabService.toggleFavorite(req.user.sub, wordId);
  }
}
