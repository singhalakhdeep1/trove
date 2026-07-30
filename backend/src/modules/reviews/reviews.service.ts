import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface CreateReviewDto {
  userId: string;
  productId?: string;
  serviceId?: string;
  hotelId?: string;
  restaurantId?: string;
  rating: number;
  comment: string;
}

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async createReview(dto: CreateReviewDto) {
    // Check if user already reviewed this item
    const where: any = { userId };
    if (dto.productId) where.productId = dto.productId;
    if (dto.serviceId) where.serviceId = dto.serviceId;
    if (dto.hotelId) where.hotelId = dto.hotelId;
    if (dto.restaurantId) where.restaurantId = dto.restaurantId;

    const existingReview = await this.prisma.review.findFirst({ where });
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this item');
    }

    const review = await this.prisma.review.create({
      data: dto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Update average rating for the item
    if (dto.productId) {
      await this.updateProductRating(dto.productId);
    } else if (dto.serviceId) {
      await this.updateServiceRating(dto.serviceId);
    } else if (dto.hotelId) {
      await this.updateHotelRating(dto.hotelId);
    } else if (dto.restaurantId) {
      await this.updateRestaurantRating(dto.restaurantId);
    }

    // Invalidate cache
    await this.redis.del(`reviews:${dto.productId || dto.serviceId || dto.hotelId || dto.restaurantId}`);

    return review;
  }

  async updateReview(reviewId: string, userId: string, dto: Partial<CreateReviewDto>) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You can only update your own reviews');
    }

    const updated = await this.prisma.review.update({
      where: { id: reviewId },
      data: dto,
    });

    // Update average rating
    if (review.productId) {
      await this.updateProductRating(review.productId);
    } else if (review.serviceId) {
      await this.updateServiceRating(review.serviceId);
    }

    return updated;
  }

  async deleteReview(reviewId: string, userId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    // Update average rating
    if (review.productId) {
      await this.updateProductRating(review.productId);
    } else if (review.serviceId) {
      await this.updateServiceRating(review.serviceId);
    }

    return { success: true };
  }

  async getReviews(filters: any = {}) {
    const { productId, serviceId, hotelId, restaurantId, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (productId) where.productId = productId;
    if (serviceId) where.serviceId = serviceId;
    if (hotelId) where.hotelId = hotelId;
    if (restaurantId) where.restaurantId = restaurantId;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReview(reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async getUserReviews(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          product: true,
          service: true,
          hotel: true,
          restaurant: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.count({ where: { userId } }),
    ]);

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAverageRating(itemId: string, itemType: string) {
    const where: any = {};
    if (itemType === 'product') where.productId = itemId;
    if (itemType === 'service') where.serviceId = itemId;
    if (itemType === 'hotel') where.hotelId = itemId;
    if (itemType === 'restaurant') where.restaurantId = itemId;

    const result = await this.prisma.review.aggregate({
      where,
      _avg: { rating: true },
      _count: true,
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count,
    };
  }

  private async updateProductRating(productId: string) {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    await this.prisma.product.update({
      where: { id: productId },
      data: { rating: result._avg.rating || 0 },
    });
  }

  private async updateServiceRating(serviceId: string) {
    const result = await this.prisma.review.aggregate({
      where: { serviceId },
      _avg: { rating: true },
    });

    await this.prisma.service.update({
      where: { id: serviceId },
      data: { rating: result._avg.rating || 0 },
    });
  }

  private async updateHotelRating(hotelId: string) {
    const result = await this.prisma.review.aggregate({
      where: { hotelId },
      _avg: { rating: true },
    });

    await this.prisma.hotel.update({
      where: { id: hotelId },
      data: { rating: result._avg.rating || 0 },
    });
  }

  private async updateRestaurantRating(restaurantId: string) {
    const result = await this.prisma.review.aggregate({
      where: { restaurantId },
      _avg: { rating: true },
    });

    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: { rating: result._avg.rating || 0 },
    });
  }
}