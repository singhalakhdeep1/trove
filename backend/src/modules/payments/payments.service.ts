import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface ProcessPaymentDto {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentDetails: any;
}

interface RefundDto {
  paymentId: string;
  amount: number;
  reason: string;
}

@Injectable()
export class PaymentsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async processPayment(dto: ProcessPaymentDto) {
    // Check if order exists
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== 'PENDING') {
      throw new BadRequestException('Order is not in payable state');
    }

    // Create payment record
    const payment = await this.prisma.payment.create({
      data: {
        orderId: dto.orderId,
        userId: order.userId,
        amount: dto.amount,
        currency: dto.currency,
        method: dto.paymentMethod,
        status: 'PROCESSING',
        paymentDetails: dto.paymentDetails,
      },
    });

    // Simulate payment processing (in real app, integrate with Stripe/PayPal)
    const isSuccessful = await this.processWithProvider(dto.paymentMethod, dto.paymentDetails);

    if (isSuccessful) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'COMPLETED' },
      });

      // Update order status
      await this.prisma.order.update({
        where: { id: dto.orderId },
        data: { status: 'CONFIRMED' },
      });

      // Cache payment
      await this.redis.set(`payment:${payment.id}`, JSON.stringify(payment), 3600);

      return { ...payment, status: 'COMPLETED' };
    } else {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      });

      throw new BadRequestException('Payment processing failed');
    }
  }

  async refundPayment(dto: RefundDto) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: dto.paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'COMPLETED') {
      throw new BadRequestException('Can only refund completed payments');
    }

    if (dto.amount > payment.amount) {
      throw new BadRequestException('Refund amount cannot exceed payment amount');
    }

    // Create refund record
    const refund = await this.prisma.refund.create({
      data: {
        paymentId: dto.paymentId,
        orderId: payment.orderId,
        amount: dto.amount,
        reason: dto.reason,
        status: 'PROCESSING',
      },
    });

    // Process refund with provider
    const isSuccessful = await this.processRefundWithProvider(payment.method, dto.amount);

    if (isSuccessful) {
      await this.prisma.refund.update({
        where: { id: refund.id },
        data: { status: 'COMPLETED' },
      });

      await this.prisma.payment.update({
        where: { id: dto.paymentId },
        data: { status: 'REFUNDED' },
      });

      return { ...refund, status: 'COMPLETED' };
    } else {
      await this.prisma.refund.update({
        where: { id: refund.id },
        data: { status: 'FAILED' },
      });

      throw new BadRequestException('Refund processing failed');
    }
  }

  async capturePayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'AUTHORIZED') {
      throw new BadRequestException('Payment is not in authorized state');
    }

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'COMPLETED' },
    });

    // Update order status
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { status: 'CONFIRMED' },
    });

    return updated;
  }

  async voidPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'AUTHORIZED') {
      throw new BadRequestException('Payment is not in authorized state');
    }

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: { status: 'VOIDED' },
    });
  }

  async getPayment(paymentId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
        refunds: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  async getPayments(filters: any = {}) {
    const { userId, orderId, status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (userId) where.userId = userId;
    if (orderId) where.orderId = orderId;
    if (status) where.status = status;

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take: limit,
        include: {
          order: true,
          refunds: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.payment.count({ where }),
    ]);

    return {
      data: payments,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async savePaymentMethod(userId: string, paymentDetails: any) {
    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type: paymentDetails.type,
        provider: paymentDetails.provider,
        details: paymentDetails,
        isDefault: false,
      },
    });
  }

  async getPaymentMethods(userId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { userId },
      orderBy: { isDefault: 'desc' },
    });
  }

  async setDefaultPaymentMethod(userId: string, methodId: string) {
    // Remove default from all methods
    await this.prisma.paymentMethod.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Set new default
    return this.prisma.paymentMethod.update({
      where: { id: methodId },
      data: { isDefault: true },
    });
  }

  async deletePaymentMethod(userId: string, methodId: string) {
    const method = await this.prisma.paymentMethod.findUnique({
      where: { id: methodId },
    });

    if (!method) {
      throw new NotFoundException('Payment method not found');
    }

    if (method.userId !== userId) {
      throw new BadRequestException('You can only delete your own payment methods');
    }

    return this.prisma.paymentMethod.delete({
      where: { id: methodId },
    });
  }

  private async processWithProvider(method: string, details: any): Promise<boolean> {
    // Simulate payment processing
    // In real app, integrate with Stripe, PayPal, etc.
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.1; // 90% success rate
  }

  private async processRefundWithProvider(method: string, amount: number): Promise<boolean> {
    // Simulate refund processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Math.random() > 0.1; // 90% success rate
  }
}