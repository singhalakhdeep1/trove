import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface SendMessageDto {
  chatId: string;
  senderId: string;
  content: string;
  attachment?: string;
}

interface CreateChatRoomDto {
  participantIds: string[];
  type: 'DIRECT' | 'GROUP';
  name?: string;
}

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async sendMessage(dto: SendMessageDto) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: dto.chatId },
      include: {
        participants: true,
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if sender is a participant
    const isParticipant = chat.participants.some(p => p.userId === dto.senderId);
    if (!isParticipant) {
      throw new BadRequestException('You are not a participant in this chat');
    }

    const message = await this.prisma.message.create({
      data: {
        chatId: dto.chatId,
        senderId: dto.senderId,
        content: dto.content,
        attachment: dto.attachment,
        read: false,
      },
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });

    // Update chat's last message
    await this.prisma.chat.update({
      where: { id: dto.chatId },
      data: {
        lastMessage: dto.content,
        lastMessageAt: new Date(),
      },
    });

    // Invalidate cache
    await this.redis.del(`messages:${dto.chatId}`);

    return message;
  }

  async getMessages(chatId: string, userId: string, page = 1, limit = 50) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: true,
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new BadRequestException('You are not a participant in this chat');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { chatId },
        skip,
        take: limit,
        include: {
          sender: {
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
      this.prisma.message.count({ where: { chatId } }),
    ]);

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        chatId,
        senderId: { not: userId },
        read: false,
      },
      data: { read: true },
    });

    return {
      data: messages.reverse(),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getChatRooms(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      include: {
        participants: {
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
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    return chats;
  }

  async createChatRoom(dto: CreateChatRoomDto) {
    if (dto.participantIds.length < 2) {
      throw new BadRequestException('Chat must have at least 2 participants');
    }

    // Check if direct chat already exists between these users
    if (dto.type === 'DIRECT' && dto.participantIds.length === 2) {
      const existingChat = await this.prisma.chat.findFirst({
        where: {
          type: 'DIRECT',
          participants: {
            every: {
              userId: { in: dto.participantIds },
            },
          },
        },
        include: {
          participants: true,
        },
      });

      if (existingChat && existingChat.participants.length === 2) {
        return existingChat;
      }
    }

    const chat = await this.prisma.chat.create({
      data: {
        type: dto.type,
        name: dto.name,
        participants: {
          create: dto.participantIds.map(userId => ({
            userId,
          })),
        },
      },
      include: {
        participants: {
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
      },
    });

    return chat;
  }

  async markMessageAsRead(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId === userId) {
      throw new BadRequestException('Cannot mark your own message as read');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { read: true },
    });
  }

  async getUnreadCount(userId: string) {
    const chats = await this.prisma.chat.findMany({
      where: {
        participants: {
          some: {
            userId,
          },
        },
      },
      select: { id: true },
    });

    const chatIds = chats.map(c => c.id);

    const unreadCount = await this.prisma.message.count({
      where: {
        chatId: { in: chatIds },
        senderId: { not: userId },
        read: false,
      },
    });

    return { unreadCount };
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new BadRequestException('You can only delete your own messages');
    }

    await this.prisma.message.delete({
      where: { id: messageId },
    });

    return { success: true };
  }

  async leaveChat(chatId: string, userId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    if (chat.type === 'DIRECT') {
      throw new BadRequestException('Cannot leave direct chats');
    }

    await this.prisma.chatParticipant.delete({
      where: {
        chatId_userId: {
          chatId,
          userId,
        },
      },
    });

    return { success: true };
  }

  async addParticipant(chatId: string, userId: string, newParticipantId: string) {
    const chat = await this.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: true,
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    // Check if user is a participant
    const isParticipant = chat.participants.some(p => p.userId === userId);
    if (!isParticipant) {
      throw new BadRequestException('You are not a participant in this chat');
    }

    // Check if new participant is already in chat
    const alreadyInChat = chat.participants.some(p => p.userId === newParticipantId);
    if (alreadyInChat) {
      throw new BadRequestException('User is already a participant');
    }

    await this.prisma.chatParticipant.create({
      data: {
        chatId,
        userId: newParticipantId,
      },
    });

    return { success: true };
  }
}