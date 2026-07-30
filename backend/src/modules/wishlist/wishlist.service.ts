import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class WishlistService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async addToWishlist(userId: string, productId: string) {
    // Check if product exists
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already in wishlist
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      throw new BadRequestException('Product already in wishlist');
    }

    const wishlistItem = await this.prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });

    // Invalidate cache
    await this.redis.del(`wishlist:${userId}`);

    return wishlistItem;
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlistItem = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (!wishlistItem) {
      throw new NotFoundException('Item not found in wishlist');
    }

    await this.prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    // Invalidate cache
    await this.redis.del(`wishlist:${userId}`);

    return { success: true };
  }

  async getWishlist(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    // Check cache first
    const cached = await this.redis.get(`wishlist:${userId}`);
    if (cached && page === 1) {
      return JSON.parse(cached);
    }

    const [items, total] = await Promise.all([
      this.prisma.wishlistItem.findMany({
        where: { userId },
        skip,
        take: limit,
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
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.wishlistItem.count({ where: { userId } }),
    ]);

    const result = {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache result
    if (page === 1) {
      await this.redis.set(`wishlist:${userId}`, JSON.stringify(result), 3600);
    }

    return result;
  }

  async clearWishlist(userId: string) {
    await this.prisma.wishlistItem.deleteMany({
      where: { userId },
    });

    // Invalidate cache
    await this.redis.del(`wishlist:${userId}`);

    return { success: true };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const item = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    return !!item;
  }

  async moveWishlistToCart(userId: string, productIds: string[]) {
    for (const productId of productIds) {
      // Check if in wishlist
      const wishlistItem = await this.prisma.wishlistItem.findUnique({
        where: {
          userId_productId: {
            userId,
            productId,
          },
        },
      });

      if (wishlistItem) {
        // Add to cart
        const existingCartItem = await this.prisma.cartItem.findUnique({
          where: {
            userId_productId: {
              userId,
              productId,
            },
          },
        });

        if (existingCartItem) {
          await this.prisma.cartItem.update({
            where: {
              userId_productId: {
                userId,
                productId,
              },
            },
            data: {
              quantity: { increment: 1 },
            },
          });
        } else {
          await this.prisma.cartItem.create({
            data: {
              userId,
              productId,
              quantity: 1,
            },
          });
        }

        // Remove from wishlist
        await this.removeFromWishlist(userId, productId);
      }
    }

    return { success: true };
  }
}