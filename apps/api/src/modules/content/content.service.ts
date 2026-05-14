import { Injectable } from '@nestjs/common';
import { CacheService } from '../../common/cache.service';
import { SPEAKING_SETS, READING_STORIES } from './content.data';

const TTL_CONTENT = 3600;

@Injectable()
export class ContentService {
  constructor(private cache: CacheService) {}

  async getSpeakingSets(level?: string) {
    const KEY = level ? `content:speaking:${level}` : 'content:speaking';
    const cached = await this.cache.get<any[]>(KEY);
    if (cached) return cached;

    const result = level ? SPEAKING_SETS.filter((s) => s.level === level) : SPEAKING_SETS;
    await this.cache.set(KEY, result, TTL_CONTENT);
    return result;
  }

  async getReadingStories(level?: string) {
    const KEY = level ? `content:stories:${level}` : 'content:stories';
    const cached = await this.cache.get<any[]>(KEY);
    if (cached) return cached;

    const result = level ? READING_STORIES.filter((s) => s.level === level) : READING_STORIES;
    await this.cache.set(KEY, result, TTL_CONTENT);
    return result;
  }
}
