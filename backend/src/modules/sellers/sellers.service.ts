import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface RegisterSellerDto {
  userId: string;
  businessName: string;
  businessType: string;
  taxId: string;
  address: string;
  phone: string;
  description?: string;
}

interface UpdateSellerDto {
  businessName?: string;
  description?: string;
  address?: string;
  phone?: string;
}

@Injectable()
export class SellersService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async registerSeller(dto: RegisterSellerDto) {
    // Check if user already has seller profile
    const existing = await this.prisma.sellerProfile.findUnique({
      where: { userId: dto.userId },
    });

    if (existing) {
      throw new BadRequestException('User already has a seller profile');
    }

    // Create seller profile
    const seller = await this.prisma.sellerProfile.create({
      data: {
        userId: dto.userId,
        businessName: dto.businessName,
        businessType: dto.businessType,
        taxId: dto.taxId,
        address: dto.address,
        phone: dto.phone,
        description: dto.description,
        status: 'PENDING',
      },
    });

    // Update user role
    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { role: 'SELLER' },
    });

    // Cache seller profile
    await this.redis.set(`seller:${seller.id}`, JSON.stringify(seller), 3600);

    return seller;
  }

  async verifySeller(sellerId: string, verifiedBy: string) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    const updated = await this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: {
        status: 'VERIFIED',
        verifiedAt: new Date(),
        verifiedBy,
      },
    });

    // Update cache
    await this.redis.set(`seller:${sellerId}`, JSON.stringify(updated), 3600);

    return updated;
  }

  async getSellers(filters: any = {}) {
    const { status, businessType, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (businessType) where.businessType = businessType;

    const [sellers, total] = await Promise.all([
      this.prisma.sellerProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              avatar: true,
            },
          },
          products: {
            select: { id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.sellerProfile.count({ where }),
    ]);

    return {
      data: sellers,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSeller(sellerId: string) {
    // Check cache first
    const cached = await this.redis.get(`seller:${sellerId}`);
    if (cached) {
      return JSON.parse(cached);
    }

    const seller = await this.prisma.sellerProfile.findUnique({
      where: { id: sellerId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
          },
        },
        products: {
          include: {
            category: true,
          },
        },
        payouts: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    // Cache result
    await this.redis.set(`seller:${sellerId}`, JSON.stringify(seller), 3600);

    return seller;
  }

  async updateSeller(sellerId: string, userId: string, dto: UpdateSellerDto) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.userId !== userId) {
      throw new BadRequestException('You can only update your own profile');
    }

    const updated = await this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: dto,
    });

    // Update cache
    await this.redis.set(`seller:${sellerId}`, JSON.stringify(updated), 3600);

    return updated;
  }

  async getSellerDashboard(sellerId: string) {
    const seller = await this.getSeller(sellerId);

    const [totalRevenue, totalOrders, totalProducts, recentOrders] = await Promise.all([
      this.prisma.order.aggregate({
        where: {
          items: {
            some: {
              product: {
                sellerId,
              },
            },
          },
          status: 'DELIVERED',
        },
        _sum: { total: true },
      }),
      this.prisma.order.count({
        where: {
          items: {
            some: {
              product: { sellerId },
            },
          },
        },
      }),
      this.prisma.product.count({
        where: { sellerId },
      }),
      this.prisma.order.findMany({
        where: {
          items: {
            some: {
              product: { sellerId },
            },
          },
        },
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      seller,
      stats: {
        totalRevenue: totalRevenue._sum.total || 0,
        totalOrders,
        totalProducts,
      },
      recentOrders,
    };
  }

  async requestPayout(sellerId: string, amount: number) {
    const seller = await this.prisma.sellerProfile.findUnique({
      where: { id: sellerId },
    });

    if (!seller) {
      throw new NotFoundException('Seller not found');
    }

    if (seller.status !== 'VERIFIED') {
      throw new BadRequestException('Seller must be verified to request payouts');
    }

    const payout = await this.prisma.payout.create({
      data: {
        sellerId,
        amount,
        status: 'PENDING',
      },
    });

    return payout;
  }

  async getPayouts(sellerId: string) {
    return this.prisma.payout.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSellerProducts(sellerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { sellerId },
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: { sellerId } }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async suspendSeller(sellerId: string, reason: string) {
    return this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: {
        status: 'SUSPENDED',
        suspensionReason: reason,
      },
    });
  }

  async activateSeller(sellerId: string) {
    return this.prisma.sellerProfile.update({
      where: { id: sellerId },
      data: {
        status: 'VERIFIED',
        suspensionReason: null,
      },
    });
  }
}