import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface CreateHotelBookingDto {
  hotelId: string;
  userId: string;
  roomId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  specialRequests?: string;
}

@Injectable()
export class TravelService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getHotels(filters: any = {}) {
    const { city, country, minRating, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };
    if (city) where.city = { contains: city, mode: 'insensitive' };
    if (country) where.country = country;
    if (minRating) where.rating = { gte: minRating };

    const [hotels, total] = await Promise.all([
      this.prisma.hotel.findMany({
        where,
        skip,
        take: limit,
        include: {
          rooms: {
            where: { isActive: true },
          },
        },
        orderBy: { rating: 'desc' },
      }),
      this.prisma.hotel.count({ where }),
    ]);

    return {
      data: hotels,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getHotel(hotelId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        rooms: {
          where: { isActive: true },
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

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async createHotel(data: any) {
    return this.prisma.hotel.create({
      data,
    });
  }

  async updateHotel(hotelId: string, data: any) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return this.prisma.hotel.update({
      where: { id: hotelId },
      data,
    });
  }

  async deleteHotel(hotelId: string) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: hotelId },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    await this.prisma.hotel.delete({
      where: { id: hotelId },
    });

    return { success: true };
  }

  async getHotelRooms(hotelId: string) {
    const rooms = await this.prisma.hotelRoom.findMany({
      where: {
        hotelId,
        isActive: true,
      },
    });

    return rooms;
  }

  async createHotelRoom(hotelId: string, data: any) {
    return this.prisma.hotelRoom.create({
      data: {
        ...data,
        hotelId,
      },
    });
  }

  async updateHotelRoom(roomId: string, data: any) {
    const room = await this.prisma.hotelRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    return this.prisma.hotelRoom.update({
      where: { id: roomId },
      data,
    });
  }

  async deleteHotelRoom(roomId: string) {
    const room = await this.prisma.hotelRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    await this.prisma.hotelRoom.delete({
      where: { id: roomId },
    });

    return { success: true };
  }

  async createBooking(dto: CreateHotelBookingDto) {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id: dto.hotelId },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    const room = await this.prisma.hotelRoom.findUnique({
      where: { id: dto.roomId },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    // Calculate total price
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * room.pricePerNight;

    const booking = await this.prisma.hotelBooking.create({
      data: {
        hotelId: dto.hotelId,
        userId: dto.userId,
        roomId: dto.roomId,
        checkIn: dto.checkIn,
        checkOut: dto.checkOut,
        guests: dto.guests,
        specialRequests: dto.specialRequests,
        totalPrice,
        status: 'PENDING',
      },
    });

    return booking;
  }

  async getBookings(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      this.prisma.hotelBooking.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          hotel: true,
          room: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.hotelBooking.count({ where: { userId } }),
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
    const booking = await this.prisma.hotelBooking.findUnique({
      where: { id: bookingId },
      include: {
        hotel: true,
        room: true,
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
    const booking = await this.prisma.hotelBooking.findUnique({
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

    return this.prisma.hotelBooking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });
  }

  async checkAvailability(hotelId: string, roomId: string, checkIn: Date, checkOut: Date) {
    const conflictingBookings = await this.prisma.hotelBooking.count({
      where: {
        hotelId,
        roomId,
        status: { in: ['PENDING', 'CONFIRMED'] },
        OR: [
          {
            checkIn: { lte: checkOut },
            checkOut: { gte: checkIn },
          },
        ],
      },
    });

    return {
      available: conflictingBookings === 0,
      conflictingBookings,
    };
  }
}