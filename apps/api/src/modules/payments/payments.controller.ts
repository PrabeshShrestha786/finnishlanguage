import {
  Controller, Post, Get, Delete, Body, Headers,
  UseGuards, Request, RawBodyRequest, Req, HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Request as ExpressRequest } from 'express';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createCheckout(@Body() body: { plan: 'PRO' | 'PREMIUM' | 'TEAM' }, @Request() req: any) {
    return this.paymentsService.createCheckoutSession(req.user.sub, body.plan);
  }

  @Public()
  @Post('webhook')
  @HttpCode(200)
  webhook(@Req() req: RawBodyRequest<ExpressRequest>, @Headers('stripe-signature') sig: string) {
    return this.paymentsService.handleWebhook(req.rawBody as Buffer, sig);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getSubscription(@Request() req: any) {
    return this.paymentsService.getSubscription(req.user.sub);
  }

  @Delete('subscription')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  cancelSubscription(@Request() req: any) {
    return this.paymentsService.cancelSubscription(req.user.sub);
  }

  @Post('coupon/apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  applyCoupon(@Body() body: { code: string }, @Request() req: any) {
    return this.paymentsService.applyCoupon(req.user.sub, body.code);
  }
}
