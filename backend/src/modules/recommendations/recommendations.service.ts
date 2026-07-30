import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class RecommendationsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getRecommendedProducts(limit = 10) {
    // Get top-rated and trending products
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        rating: { gte: 4 },
      },
      take: limit,
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
      orderBy: [
        { rating: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return products;
  }

  async getPersonalizedRecommendations(userId: string, limit = 10) {
    // Get user's order history
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      take: 20,
    });

    // Extract categories and tags from user's purchases
    const purchasedCategories = new Set<string>();
    const purchasedTags = new Set<string>();

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.product.categoryId) {
          purchasedCategories.add(item.product.categoryId);
        }
        item.product.tags?.forEach(tag => purchasedTags.add(tag));
      });
    });

    // Find similar products
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { categoryId: { in: Array.from(purchasedCategories) } },
          { tags: { hasSome: Array.from(purchasedTags) } },
        ],
      },
      take: limit,
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
      orderBy: { rating: 'desc' },
    });

    return products;
  }

  async getSimilarProducts(productId: string, limit = 10) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const similarProducts = await this.prisma.product.findMany({
      where: {
        id: { not: productId },
        isActive: true,
        OR: [
          { categoryId: product.categoryId },
          { tags: { hasSome: product.tags || [] } },
        ],
      },
      take: limit,
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
      orderBy: { rating: 'desc' },
    });

    return similarProducts;
  }

  async getFrequentlyBoughtTogether(productId: string, limit = 5) {
    // Find orders that contain this product
    const orders = await this.prisma.order.findMany({
      where: {
        items: {
          some: {
            productId,
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      take: 50,
    });

    // Count frequency of other products
    const productFrequency = new Map<string, number>();

    orders.forEach(order => {
      order.items.forEach(item => {
        if (item.productId !== productId) {
          const count = productFrequency.get(item.productId) || 0;
          productFrequency.set(item.productId, count + 1);
        }
      });
    });

    // Get top frequently bought products
    const sortedProductIds = Array.from(productFrequency.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([productId]) => productId);

    if (sortedProductIds.length === 0) {
      return this.getSimilarProducts(productId, limit);
    }

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: sortedProductIds },
        isActive: true,
      },
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
    });

    // Sort by frequency
    const productsWithFrequency = products.map(product => ({
      ...product,
      frequency: productFrequency.get(product.id) || 0,
    })).sort((a, b) => b.frequency - a.frequency);

    return productsWithFrequency;
  }

  async getTrendingProducts(limit = 10) {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Last 7 days

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        orders: {
          some: {
            createdAt: { gte: date },
          },
        },
      },
      take: limit,
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
        _count: {
          select: {
            orders: {
              where: {
                createdAt: { gte: date },
              },
            },
          },
        },
      },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
    });

    return products;
  }

  async getNewArrivals(limit = 10) {
    const date = new Date();
    date.setDate(date.getDate() - 30); // Last 30 days

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        createdAt: { gte: date },
      },
      take: limit,
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
      orderBy: { createdAt: 'desc' },
    });

    return products;
  }

  async getBestSellers(limit = 10) {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
      },
      take: limit,
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
        _count: {
          select: {
            orders: true,
          },
        },
      },
      orderBy: {
        orders: {
          _count: 'desc',
        },
      },
    });

    return products;
  }
}