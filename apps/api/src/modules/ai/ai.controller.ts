import {
  Controller, Post, Get, Delete, Body, Param, UseGuards, Request,
  UploadedFile, UseInterceptors, Query, UsePipes, ValidationPipe, Res,
} from '@nestjs/common';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('AI Tutor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('chat')
  @ApiOperation({ summary: 'Chat with FinnMate AI tutor' })
  chat(@Body() body: { message: string; history?: any[] }, @Request() req: any) {
    return this.aiService.chat(req.user.sub, body.message, body.history);
  }

  @Get('chat/history')
  getChatHistory(@Request() req: any, @Query('limit') limit?: number) {
    return this.aiService.getChatHistory(req.user.sub, limit);
  }

  @Post('grammar/correct')
  @ApiOperation({ summary: 'AI grammar correction' })
  correctGrammar(@Body() body: { text: string; level: string; nativeLang: string }) {
    return this.aiService.correctGrammar(body.text, body.level, body.nativeLang);
  }

  @Post('translate')
  @ApiOperation({ summary: 'Translate text' })
  translate(@Body() body: { text: string; from: string; to: string; context?: string }) {
    return this.aiService.translate(body.text, body.from, body.to, body.context);
  }

  @Post('tts')
  @ApiOperation({ summary: 'Text to speech with native Finnish voice (ElevenLabs)' })
  async textToSpeech(@Body() body: { text: string }, @Res() res: Response) {
    const audio = await this.aiService.textToSpeech(body.text);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audio.length);
    res.send(audio);
  }

  @Post('stt')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiOperation({ summary: 'Speech to text' })
  async stt(@UploadedFile() file: Express.Multer.File) {
    const text = await this.aiService.speechToText(file.buffer);
    return { text };
  }

  @Post('pronunciation/score')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('audio'))
  @ApiOperation({ summary: 'Score pronunciation' })
  async scorePronunciation(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { targetText: string; userText: string },
  ) {
    return this.aiService.scorePronunciation(body.targetText, file.buffer);
  }

  @Post('exercises/generate')
  @ApiOperation({ summary: 'Generate AI exercises' })
  generateExercises(@Body() body: { topic: string; level: string; type: string; count?: number }) {
    return this.aiService.generateExercises(body.topic, body.level, body.type, body.count);
  }

  @Post('reading/generate')
  @ApiOperation({ summary: 'Generate an AI reading story with comprehension questions' })
  generateReading(@Body() body: { level: string; topic?: string }) {
    return this.aiService.generateReadingStory(body.level, body.topic);
  }

  @Post('writing/generate-task')
  @ApiOperation({ summary: 'Generate a translation task (English → Finnish)' })
  generateTranslationTask(@Body() body: { level: string; direction?: 'en-fi' | 'fi-en' }) {
    return this.aiService.generateTranslationTask(body.level, body.direction);
  }

  @Post('writing/check-translation')
  @ApiOperation({ summary: 'Check a translation' })
  checkTranslation(@Body() body: { source: string; translation: string; level: string; direction?: 'en-fi' | 'fi-en' }) {
    return this.aiService.checkTranslation(body.source, body.translation, body.level, body.direction);
  }

  @Get('stories')
  @ApiOperation({ summary: 'Get all saved AI stories for the current user' })
  getUserStories(@Request() req: any) {
    return this.aiService.getUserStories(req.user.sub);
  }

  @Get('listening-tracks')
  @ApiOperation({ summary: 'Get saved AI listening tracks for the current user' })
  getUserListeningTracks(@Request() req: any) {
    return this.aiService.getUserListeningTracks(req.user.sub);
  }

  @Post('listening-tracks')
  @ApiOperation({ summary: 'Save a generated listening track' })
  saveListeningTrack(@Body() body: any, @Request() req: any) {
    return this.aiService.saveListeningTrack(req.user.sub, body);
  }

  @Delete('listening-tracks/:id')
  @ApiOperation({ summary: 'Delete a saved listening track' })
  deleteListeningTrack(@Param('id') id: string, @Request() req: any) {
    return this.aiService.deleteListeningTrack(req.user.sub, id);
  }

  @Post('stories')
  @UsePipes(new ValidationPipe({ whitelist: false }))
  @ApiOperation({ summary: 'Save an AI-generated story to the user library' })
  saveUserStory(@Body() body: any, @Request() req: any) {
    return this.aiService.saveUserStory(req.user.sub, body);
  }

  @Delete('stories/:id')
  @ApiOperation({ summary: 'Delete a saved story from the user library' })
  deleteUserStory(@Param('id') id: string, @Request() req: any) {
    return this.aiService.deleteUserStory(req.user.sub, id);
  }
}
