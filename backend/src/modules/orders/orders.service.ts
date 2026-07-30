import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface CreateOrderDto {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  shippingAddress: string;
  billingAddress?: string;
  paymentMethod: string;
  notes?: string;
}

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    // Verify all products exist and calculate total
    let subtotal = 0;
    const orderItems = [];

    for (const item of dto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
        include: {
          seller: true,
        },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Insufficient stock for ${product.name}`);
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });

      // Update stock
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    const tax = subtotal * 0.1;
    const shipping = 10;
    const total = subtotal + tax + shipping;

    const order = await this.prisma.order.create({
      data: {
        userId: dto.userId,
        status: 'PENDING',
        subtotal,
        tax,
        shipping,
        total,
        shippingAddress: dto.shippingAddress,
        billingAddress: dto.billingAddress,
        paymentMethod: dto.paymentMethod,
        notes: dto.notes,
      },
    });

    // Create order items
    for (const item of orderItems) {
      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        },
      });
    }

    // Clear user's cart
    await this.prisma.cartItem.deleteMany({
      where: { userId: dto.userId },
    });

    // Invalidate cache
    await this.redis.del(`orders:${dto.userId}`);

    return order;
  }

  async getOrders(userId: string, filters: any = {}) {
    const { status, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (status) where.status = status;

    // Check cache first
    const cacheKey = `orders:${userId}:${page}:${limit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached && !status) {
      return JSON.parse(cached);
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: {
                include: {
                  category: true,
                },
              },
            },
          },
          tracking: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    const result = {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache result
    if (!status) {
      await this.redis.set(cacheKey, JSON.stringify(result), 300);
    }

    return result;
  }

  async getOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                seller: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                      },
                  },
                },
              },
            },
          },
        },
        tracking: true,
        payment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You can only view your own orders');
    }

    return order;
  }

  async updateOrderStatus(orderId: string, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    // Create tracking entry
    await this.prisma.orderTracking.create({
      data: {
        orderId,
        status,
        location: 'Processing',
      },
    });

    return updated;
  }

  async cancelOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You can only cancel your own orders');
    }

    if (order.status === 'DELIVERED' || order.status === 'CANCELLED') {
      throw new BadRequestException('Cannot cancel this order');
    }

    // Restore stock
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
    });

    for (const item of items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { increment: item.quantity } },
      });
    }

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED' },
    });

    // Invalidate cache
    await this.redis.del(`orders:${userId}`);

    return { success: true };
  }

  async trackOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        tracking: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new BadRequestException('You can only track your own orders');
    }

    return order;
  }

  async getOrderStats(userId: string) {
    const [totalOrders, pendingOrders, deliveredOrders, totalSpent] = await Promise.all([
      this.prisma.order.count({ where: { userId } }),
      this.prisma.order.count({
        where: { userId, status: 'PENDING' },
      }),
      this.prisma.order.count({
        where: { userId, status: 'DELIVERED' },
      }),
      this.prisma.order.aggregate({
        where: {
          userId,
          status: 'DELIVERED',
        },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalSpent: totalSpent._sum.total || 0,
    };
  }
}