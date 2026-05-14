import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { IssuesService } from './issues.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('issues')
export class IssuesController {
  constructor(private issues: IssuesService) {}

  @Post()
  report(
    @Request() req: any,
    @Body() body: { description: string; imageData?: string; page?: string },
  ) {
    return this.issues.createReport(req.user.sub, body.description, body.imageData, body.page);
  }
}
