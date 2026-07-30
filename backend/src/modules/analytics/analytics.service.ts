import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class AnalyticsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getDashboardStats() {
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      conversionRate,
      topSellingProducts,
      topCategories,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
      }),
      this.prisma.order.aggregate({
        _avg: { total: true },
      }),
      this.calculateConversionRate(),
      this.getTopSellingProducts(5),
      this.getTopCategories(5),
    ]);

    return {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      averageOrderValue: averageOrderValue._avg.total || 0,
      conversionRate,
      topSellingProducts,
      topCategories,
    };
  }

  async getSalesAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const startDate = this.getStartDate(period);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'DELIVERED',
      },
      orderBy: { createdAt: 'asc' },
    });

    const grouped = this.groupByDate(orders, period);

    return {
      period,
      data: grouped,
      total: orders.reduce((sum, order) => sum + order.total, 0),
      orders: orders.length,
    };
  }

  async getRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    const startDate = this.getStartDate(period);

    const result = await this.prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
        status: 'DELIVERED',
      },
      _sum: {
        total: true,
      },
    });

    return {
      period,
      data: result.map(item => ({
        date: item.createdAt,
        revenue: item._sum.total || 0,
      })),
    };
  }

  async getUserAnalytics() {
    const [
      totalUsers,
      activeUsers,
      newUsers,
      userRetention,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.getActiveUsersCount(),
      this.getNewUsersCount(),
      this.calculateRetentionRate(),
    ]);

    return {
      totalUsers,
      activeUsers,
      newUsers,
      userRetention,
    };
  }

  async getProductAnalytics(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        seller: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const [orders, reviews, views] = await Promise.all([
      this.prisma.order.count({
        where: {
          items: {
            some: { productId },
          },
        },
      }),
      this.prisma.review.count({
        where: { productId },
      }),
      this.prisma.product.findUnique({
        where: { id: productId },
        select: { views: true },
      }),
    ]);

    return {
      product,
      totalOrders: orders,
      totalReviews: reviews,
      views: views?.views || 0,
      rating: product.rating,
    };
  }

  async getCategoryAnalytics() {
    const categories = await this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
        products: {
          include: {
            _count: {
              select: { orders: true },
            },
          },
        },
      },
    });

    const categoryStats = categories.map(category => {
      const totalOrders = category.products.reduce(
        (sum, product) => sum + product._count.orders,
        0
      );

      return {
        id: category.id,
        name: category.name,
        productCount: category._count.products,
        totalOrders,
      };
    }).sort((a, b) => b.totalOrders - a.totalOrders);

    return categoryStats;
  }

  async getTopSellingProducts(limit = 10) {
    const products = await this.prisma.product.findMany({
      take: limit,
      orderBy: { sales: 'desc' },
      include: {
        category: true,
        seller: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return products;
  }

  async getTopCategories(limit = 10) {
    const categories = await this.prisma.category.findMany({
      take: limit,
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: {
        products: {
          _count: 'desc',
        },
      },
    });

    return categories;
  }

  private getStartDate(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'daily':
        now.setDate(now.getDate() - 7);
        break;
      case 'weekly':
        now.setDate(now.getDate() - 30);
        break;
      case 'monthly':
        now.setMonth(now.getMonth() - 12);
        break;
    }
    return now;
  }

  private groupByDate(orders: any[], period: string) {
    const grouped = new Map();

    orders.forEach(order => {
      const date = this.formatDate(order.createdAt, period);
      const existing = grouped.get(date) || { count: 0, total: 0 };
      grouped.set(date, {
        count: existing.count + 1,
        total: existing.total + order.total,
      });
    });

    return Array.from(grouped.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));
  }

  private formatDate(date: Date, period: string): string {
    switch (period) {
      case 'daily':
        return date.toISOString().split('T')[0];
      case 'weekly':
        const week = Math.floor(date.getDate() / 7);
        return `${date.getFullYear()}-W${week}`;
      case 'monthly':
        return `${date.getFullYear()}-${date.getMonth() + 1}`;
      default:
        return date.toISOString().split('T')[0];
    }
  }

  private async calculateConversionRate(): Promise<number> {
    const totalUsers = await this.prisma.user.count();
    const usersWithOrders = await this.prisma.user.count({
      where: {
        orders: {
          some: {},
        },
      },
    });

    return totalUsers > 0 ? (usersWithOrders / totalUsers) * 100 : 0;
  }

  private async getActiveUsersCount(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.prisma.user.count({
      where: {
        orders: {
          some: {
            createdAt: { gte: thirtyDaysAgo },
          },
        },
      },
    });
  }

  private async getNewUsersCount(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return this.prisma.user.count({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    });
  }

  private async calculateRetentionRate(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const usersFromMonthAgo = await this.prisma.user.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lte: thirtyDaysAgo },
      },
    });

    const retainedUsers = await this.prisma.user.count({
      where: {
        createdAt: { gte: sixtyDaysAgo, lte: thirtyDaysAgo },
        orders: {
          some: {
            createdAt: { gte: thirtyDaysAgo },
          },
        },
      },
    });

    return usersFromMonthAgo > 0 ? (retainedUsers / usersFromMonthAgo) * 100 : 0;
  }
}