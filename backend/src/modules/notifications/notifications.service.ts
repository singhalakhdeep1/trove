import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface SendNotificationDto {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
}

@Injectable()
export class NotificationsService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async sendNotification(dto: SendNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: dto,
    });

    // Invalidate cache
    await this.redis.del(`notifications:${dto.userId}`);

    return notification;
  }

  async sendBulkNotifications(userIds: string[], dto: Omit<SendNotificationDto, 'userId'>) {
    const notifications = await Promise.all(
      userIds.map(userId =>
        this.prisma.notification.create({
          data: {
            ...dto,
            userId,
          },
        })
      )
    );

    // Invalidate cache for all users
    for (const userId of userIds) {
      await this.redis.del(`notifications:${userId}`);
    }

    return notifications;
  }

  async getNotifications(userId: string, filters: any = {}) {
    const { unreadOnly, type, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (unreadOnly) where.read = false;
    if (type) where.type = type;

    // Check cache first
    const cacheKey = `notifications:${userId}:${page}:${limit}`;
    const cached = await this.redis.get(cacheKey);
    if (cached && !type && !unreadOnly) {
      return JSON.parse(cached);
    }

    const [notifications, total, unreadCount] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where }),
      this.prisma.notification.count({
        where: { userId, read: false },
      }),
    ]);

    const result = {
      data: notifications,
      meta: {
        total,
        unreadCount,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Cache result
    if (!type && !unreadOnly) {
      await this.redis.set(cacheKey, JSON.stringify(result), 300);
    }

    return result;
  }

  async getNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new BadRequestException('You can only view your own notifications');
    }

    return notification;
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new BadRequestException('You can only mark your own notifications');
    }

    const updated = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { read: true, readAt: new Date() },
    });

    // Invalidate cache
    await this.redis.del(`notifications:${userId}`);

    return updated;
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: {
        userId,
        read: false,
      },
      data: {
        read: true,
        readAt: new Date(),
      },
    });

    // Invalidate cache
    await this.redis.del(`notifications:${userId}`);

    return { success: true };
  }

  async deleteNotification(notificationId: string, userId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.userId !== userId) {
      throw new BadRequestException('You can only delete your own notifications');
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });

    // Invalidate cache
    await this.redis.del(`notifications:${userId}`);

    return { success: true };
  }

  async clearAllNotifications(userId: string) {
    await this.prisma.notification.deleteMany({
      where: { userId },
    });

    // Invalidate cache
    await this.redis.del(`notifications:${userId}`);

    return { success: true };
  }

  async getUnreadCount(userId: string) {
    const count = await this.prisma.notification.count({
      where: {
        userId,
        read: false,
      },
    });

    return { unreadCount: count };
  }

  async getNotificationSettings(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        notificationPreferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.notificationPreferences || {
      email: true,
      push: true,
      sms: false,
      marketing: false,
    };
  }

  async updateNotificationSettings(userId: string, settings: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        notificationPreferences: settings,
      },
    });
  }
}