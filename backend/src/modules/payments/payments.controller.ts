import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  Headers,
  Header,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import Stripe from 'stripe';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  private stripe: Stripe;

  constructor(private readonly paymentsService: PaymentsService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2023-10-16',
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  findAll(@Query() filters: any) {
    return this.paymentsService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payments by id' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payments' })
  create(@Body() dto: any) {
    return this.paymentsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payments' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.paymentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete payments' })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }

  // Feature-specific endpoints

  @Post('process-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'processPayment' })
  async processPayment(@Body() dto: any) {
    return this.paymentsService.processPayment(dto);
  }

  @Post('refund-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'refundPayment' })
  async refundPayment(@Body() dto: any) {
    return this.paymentsService.refundPayment(dto);
  }

  @Post('capture-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'capturePayment' })
  async capturePayment(@Body() dto: any) {
    return this.paymentsService.capturePayment(dto);
  }

  @Post('void-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'voidPayment' })
  async voidPayment(@Body() dto: any) {
    return this.paymentsService.voidPayment(dto);
  }

  @Post('create-payment-intent')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'createPaymentIntent' })
  async createPaymentIntent(@Body() dto: any) {
    return this.paymentsService.createPaymentIntent(dto);
  }

  @Post('confirm-payment')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'confirmPayment' })
  async confirmPayment(@Body() dto: any) {
    return this.paymentsService.confirmPayment(dto);
  }

  @Post('get-payment-methods')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'getPaymentMethods' })
  async getPaymentMethods(@Body() dto: any) {
    return this.paymentsService.getPaymentMethods(dto);
  }

  @Post('save-payment-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'savePaymentMethod' })
  async savePaymentMethod(@Body() dto: any) {
    return this.paymentsService.savePaymentMethod(dto);
  }

  @Post('delete-payment-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'deletePaymentMethod' })
  async deletePaymentMethod(@Body() dto: any) {
    return this.paymentsService.deletePaymentMethod(dto);
  }

  @Post('set-default-payment-method')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'setDefaultPaymentMethod' })
  async setDefaultPaymentMethod(@Body() dto: any) {
    return this.paymentsService.setDefaultPaymentMethod(dto);
  }

  // Stripe Webhook Handler
  @Post('webhook')
  @Header('Content-Type', 'application/json')
  async webhook(@Req() req: any, @Headers('stripe-signature') sig: string) {
    const event = this.stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || '',
    );

    // PostgreSQL advisory lock to prevent duplicate processing
    await this.paymentsService['prisma'].$executeRaw`SELECT pg_try_advisory_xact_lock(hashtext(${event.id}))`;
    
    const existing = await this.paymentsService['prisma'].processedWebhook.findUnique({
      where: { stripeEventId: event.id },
    });
    
    if (existing) return { received: true }; // idempotent

    switch (event.type) {
      case 'payment_intent.succeeded':
        await this.handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await this.handlePaymentFailed(event.data.object);
        break;
      case 'account.updated':
        await this.handleSellerAccountUpdated(event.data.object);
        break;
    }

    await this.paymentsService['prisma'].processedWebhook.create({
      data: { stripeEventId: event.id, eventType: event.type },
    });

    return { received: true };
  }

  private async handlePaymentSuccess(paymentIntent: any) {
    await this.paymentsService['prisma'].payment.updateMany({
      where: { transactionId: paymentIntent.id },
      data: { status: 'CAPTURED' as any },
    });

    const order = await this.paymentsService['prisma'].order.update({
      where: { orderNumber: paymentIntent.metadata.orderId },
      data: { status: 'CONFIRMED' as any },
    });

    console.log(`[payments:webhook] payment succeeded for order ${order.orderNumber}`);
    return order;
  }

  private async handlePaymentFailed(paymentIntent: any) {
    await this.paymentsService['prisma'].payment.updateMany({
      where: { transactionId: paymentIntent.id },
      data: { status: 'FAILED' as any },
    });

    console.warn(`[payments:webhook] payment failed for payment intent ${paymentIntent.id}`);
    return paymentIntent;
  }

  private async handleSellerAccountUpdated(account: any) {
    const seller = await this.paymentsService['prisma'].sellerProfile.findFirst({
      where: { stripeAccountId: account.id },
    });

    if (seller) {
      await this.paymentsService['prisma'].sellerProfile.update({
        where: { id: seller.id },
        data: {
          payoutsEnabled: account.payouts_enabled,
          chargesEnabled: account.charges_enabled,
        },
      });
    }
  }
}
