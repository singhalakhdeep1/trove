import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface CreateServiceDto {
  providerId: string;
  title: string;
  description: string;
  category: string;
  price: number;
  duration: number;
  location: string;
  images?: string[];
  tags?: string[];
}

interface CreateBookingDto {
  serviceId: string;
  userId: string;
  scheduledDate: Date;
  notes?: string;
}

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getServices(filters: any = {}) {
    const { category, location, minRating, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { status: 'ACTIVE' };
    if (category) where.category = category;
    if (location) where.location = { contains: location, mode: 'insensitive' };
    if (minRating) where.rating = { gte: minRating };

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip,
        take: limit,
        include: {
          provider: {
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
          },
          reviews: {
            select: { rating: true },
          },
        },
        orderBy: { rating: 'desc' },
      }),
      this.prisma.service.count({ where }),
    ]);

    const servicesWithRating = services.map(service => ({
      ...service,
      averageRating: service.reviews.length > 0
        ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
        : service.rating || 0,
    }));

    return {
      data: servicesWithRating,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getService(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        provider: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                email: true,
              },
            },
          },
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
        bookings: {
          take: 10,
          orderBy: { scheduledDate: 'desc' },
        },
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async createService(dto: CreateServiceDto) {
    const service = await this.prisma.service.create({
      data: dto,
    });

    return service;
  }

  async updateService(serviceId: string, data: any) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.service.update({
      where: { id: serviceId },
      data,
    });
  }

  async deleteService(serviceId: string) {
    const service = await this.prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    await this.prisma.service.delete({
      where: { id: serviceId },
    });

    return { success: true };
  }

  async createBooking(dto: CreateBookingDto) {
    const service = await this.prisma.service.findUnique({
      where: { id: dto.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    if (service.status !== 'ACTIVE') {
      throw new BadRequestException('Service is not available');
    }

    const booking = await this.prisma.booking.create({
      data: {
        serviceId: dto.serviceId,
        userId: dto.userId,
        scheduledDate: dto.scheduledDate,
        notes: dto.notes,
        status: 'PENDING',
        price: service.price,
      },
    });

    return booking;
  }

  async getBookings(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          service: {
            include: {
              provider: {
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
        orderBy: { scheduledDate: 'desc' },
      }),
      this.prisma.booking.count({ where: { userId } }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('You can only view your own bookings');
    }

    return booking;
  }

  async cancelBooking(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestException('Booking is already cancelled');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });
  }

  async getProviderBookings(providerId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where: {
          service: {
            providerId,
          },
        },
        skip,
        take: limit,
        include: {
          service: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: { scheduledDate: 'desc' },
      }),
      this.prisma.booking.count({
        where: {
          service: {
            providerId,
          },
        },
      }),
    ]);

    return {
      data: bookings,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateBookingStatus(bookingId: string, status: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });
  }
}