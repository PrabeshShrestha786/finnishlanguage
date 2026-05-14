import { Module } from '@nestjs/common';
import { CacheModule } from '../../common/cache.module';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';

@Module({
  imports: [CacheModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
