import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

const PLAN_PRICES: Record<string, { name: string; xp: string }> = {
  PRO: { name: 'FinnMate Pro', xp: 'price_pro' },
  PREMIUM: { name: 'FinnMate Premium', xp: 'price_premium' },
  TEAM: { name: 'FinnMate Team', xp: 'price_team' },
};

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private config: ConfigService, private prisma: PrismaService) {
    this.stripe = new Stripe(config.get<string>('stripe.secretKey') || '', {
      apiVersion: '2024-04-10',
    });
  }

  async createCheckoutSession(userId: string, plan: 'PRO' | 'PREMIUM' | 'TEAM') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });
    if (!user) throw new NotFoundException('User not found');

    const priceIdMap: Record<string, string> = {
      PRO: this.config.get('stripe.proPriceId') || '',
      PREMIUM: this.config.get('stripe.premiumPriceId') || '',
      TEAM: this.config.get('stripe.teamPriceId') || '',
    };

    let customerId = user.subscription?.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: { userId },
      });
      customerId = customer.id;
      await this.prisma.subscription.update({
        where: { userId },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceIdMap[plan], quantity: 1 }],
      subscription_data: { trial_period_days: 7 },
      success_url: `${this.config.get('app.url')}/dashboard?upgraded=true`,
      cancel_url: `${this.config.get('app.url')}/pricing?canceled=true`,
      metadata: { userId, plan },
    });

    return { url: session.url, sessionId: session.id };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.config.get('stripe.webhookSecret') || '',
      );
    } catch {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.metadata?.userId && session.metadata?.plan) {
          await this.prisma.subscription.update({
            where: { userId: session.metadata.userId },
            data: {
              plan: session.metadata.plan as any,
              status: 'ACTIVE',
              stripeSubscriptionId: session.subscription as string,
            },
          });
        }
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: {
            status: sub.status.toUpperCase() as any,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
          },
        });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await this.prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id },
          data: { plan: 'FREE', status: 'CANCELED', canceledAt: new Date() },
        });
        break;
      }
    }

    return { received: true };
  }

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId } });
  }

  async cancelSubscription(userId: string) {
    const sub = await this.prisma.subscription.findUnique({ where: { userId } });
    if (!sub?.stripeSubscriptionId) throw new BadRequestException('No active subscription');

    await this.stripe.subscriptions.update(sub.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });
    return { message: 'Subscription will cancel at period end' };
  }

  async applyCoupon(userId: string, code: string) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { code: code.toUpperCase(), isActive: true },
    });
    if (!coupon) throw new BadRequestException('Invalid or expired coupon');
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Coupon usage limit reached');
    }
    if (coupon.validUntil && coupon.validUntil < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }
    await this.prisma.coupon.update({ where: { id: coupon.id }, data: { usedCount: { increment: 1 } } });
    return { discountPercent: coupon.discountPercent, code: coupon.code };
  }
}
