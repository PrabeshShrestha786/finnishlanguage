import { Controller, Get, Query } from '@nestjs/common';
import { ContentService } from './content.service';
import { Public } from '../../common/decorators/public.decorator';

@Public()
@Controller('content')
export class ContentController {
  constructor(private content: ContentService) {}

  @Get('speaking-sets')
  getSpeakingSets(@Query('level') level?: string) {
    return this.content.getSpeakingSets(level);
  }

  @Get('stories')
  getStories(@Query('level') level?: string) {
    return this.content.getReadingStories(level);
  }
}
