import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { IssuesModule } from '../issues/issues.module';

@Module({
  imports: [IssuesModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService],
})
export class AdminModule {}
