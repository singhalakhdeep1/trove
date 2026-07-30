import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface CreateRestaurantDto {
  ownerId: string;
  name: string;
  description?: string;
  cuisine: string;
  address: string;
  phone: string;
  images?: string[];
  deliveryTime?: number;
  deliveryFee?: number;
  minimumOrder?: number;
}

interface CreateMenuItemDto {
  restaurantId: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  images?: string[];
  available?: boolean;
  vegetarian?: boolean;
  spicy?: boolean;
}

@Injectable()
export class FoodService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getRestaurants(filters: any = {}) {
    const { cuisine, city, minRating, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (cuisine) where.cuisine = { contains: cuisine, mode: 'insensitive' };
    if (city) where.address = { contains: city, mode: 'insensitive' };
    if (minRating) where.rating = { gte: minRating };

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        skip,
        take: limit,
        include: {
          menuItems: {
            where: { available: true },
            take: 5,
          },
          reviews: {
            select: { rating: true },
          },
        },
        orderBy: { rating: 'desc' },
      }),
      this.prisma.restaurant.count({ where }),
    ]);

    const restaurantsWithRating = restaurants.map(restaurant => ({
      ...restaurant,
      averageRating: restaurant.reviews.length > 0
        ? restaurant.reviews.reduce((sum, r) => sum + r.rating, 0) / restaurant.reviews.length
        : restaurant.rating || 0,
    }));

    return {
      data: restaurantsWithRating,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getRestaurant(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: {
        menuItems: {
          where: { available: true },
          orderBy: { category: 'asc' },
        },
        reviews: {
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
          take: 10,
        },
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async createRestaurant(dto: CreateRestaurantDto) {
    const restaurant = await this.prisma.restaurant.create({
      data: dto,
    });

    return restaurant;
  }

  async updateRestaurant(restaurantId: string, data: any) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.prisma.restaurant.update({
      where: { id: restaurantId },
      data,
    });
  }

  async deleteRestaurant(restaurantId: string) {
    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    await this.prisma.restaurant.delete({
      where: { id: restaurantId },
    });

    return { success: true };
  }

  async getMenuItems(restaurantId: string) {
    const menuItems = await this.prisma.menuItem.findMany({
      where: {
        restaurantId,
        available: true,
      },
      orderBy: { category: 'asc' },
    });

    return menuItems;
  }

  async getMenuItem(menuItemId: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
      include: {
        restaurant: true,
      },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return menuItem;
  }

  async createMenuItem(dto: CreateMenuItemDto) {
    const menuItem = await this.prisma.menuItem.create({
      data: dto,
    });

    return menuItem;
  }

  async updateMenuItem(menuItemId: string, data: any) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    return this.prisma.menuItem.update({
      where: { id: menuItemId },
      data,
    });
  }

  async deleteMenuItem(menuItemId: string) {
    const menuItem = await this.prisma.menuItem.findUnique({
      where: { id: menuItemId },
    });

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    await this.prisma.menuItem.delete({
      where: { id: menuItemId },
    });

    return { success: true };
  }

  async placeFoodOrder(userId: string, data: any) {
    const { restaurantId, items, address, deliveryFee } = data;

    const restaurant = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    // Calculate total
    let subtotal = 0;
    for (const item of items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      if (!menuItem) {
        throw new NotFoundException(`Menu item ${item.menuItemId} not found`);
      }

      subtotal += menuItem.price * item.quantity;
    }

    const total = subtotal + (deliveryFee || restaurant.deliveryFee || 0);

    const order = await this.prisma.order.create({
      data: {
        userId,
        restaurantId,
        status: 'PENDING',
        subtotal,
        tax: subtotal * 0.1,
        shipping: deliveryFee || restaurant.deliveryFee || 0,
        deliveryFee: deliveryFee || restaurant.deliveryFee || 0,
        total,
        shippingAddress: address,
        paymentMethod: 'CASH_ON_DELIVERY',
      },
    });

    // Create order items
    for (const item of items) {
      const menuItem = await this.prisma.menuItem.findUnique({
        where: { id: item.menuItemId },
      });

      await this.prisma.orderItem.create({
        data: {
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          price: menuItem.price,
        },
      });
    }

    return order;
  }

  async getFoodOrders(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: {
          userId,
          restaurantId: { not: null },
        },
        skip,
        take: limit,
        include: {
          restaurant: true,
          items: {
            include: {
              menuItem: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count({
        where: {
          userId,
          restaurantId: { not: null },
        },
      }),
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async trackFoodOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        restaurant: true,
        tracking: true,
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
}