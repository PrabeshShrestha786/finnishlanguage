import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

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
      await this.prisma.subscription.upsert({
        where: { userId },
        create: { userId, stripeCustomerId: customerId },
        update: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: priceIdMap[plan], quantity: 1 }],
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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === 'paid' && session.metadata?.userId && session.metadata?.plan) {
        const { userId, plan } = session.metadata;
        await this.prisma.subscription.upsert({
          where: { userId },
          create: { userId, plan: plan as any, status: 'ACTIVE' },
          update: { plan: plan as any, status: 'ACTIVE' },
        });
        await this.prisma.payment.create({
          data: {
            userId,
            amount: (session.amount_total || 0) / 100,
            currency: session.currency?.toUpperCase() || 'EUR',
            status: 'COMPLETED',
            provider: 'STRIPE',
            providerPaymentId: session.payment_intent as string,
            description: `FinnMate ${plan} plan`,
          },
        });
      }
    }

    return { received: true };
  }

  async getSubscription(userId: string) {
    return this.prisma.subscription.findUnique({ where: { userId } });
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
