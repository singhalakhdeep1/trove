import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto, CreateAddressDto } from './dto/users.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                skip,
                take: limit,
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                    role: true,
                    isVerified: true,
                    isActive: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.user.count(),
        ]);

        return {
            data: users,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                addresses: true,
                sellerProfile: true,
                serviceProvider: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Remove sensitive data
        const { passwordHash, ...result } = user;
        return result;
    }

    async update(id: string, dto: UpdateUserDto) {
        const user = await this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                avatar: true,
                phone: true,
                dateOfBirth: true,
                gender: true,
                role: true,
                updatedAt: true,
            },
        });

        return user;
    }

    async remove(id: string) {
        await this.prisma.user.delete({
            where: { id },
        });

        return { success: true };
    }

    async addAddress(userId: string, dto: CreateAddressDto) {
        // If this is the first address, make it default
        const existingAddresses = await this.prisma.address.count({
            where: { userId },
        });

        const address = await this.prisma.address.create({
            data: {
                ...dto,
                userId,
                isDefault: existingAddresses === 0 ? true : dto.isDefault,
            },
        });

        // If setting as default, unset others
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: {
                    userId,
                    id: { not: address.id },
                },
                data: { isDefault: false },
            });
        }

        return address;
    }

    async getAddresses(userId: string) {
        return this.prisma.address.findMany({
            where: { userId },
            orderBy: { isDefault: 'desc' },
        });
    }

    async updateAddress(userId: string, addressId: string, dto: any) {
        const address = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        const updated = await this.prisma.address.update({
            where: { id: addressId },
            data: dto,
        });

        // If setting as default, unset others
        if (dto.isDefault) {
            await this.prisma.address.updateMany({
                where: {
                    userId,
                    id: { not: addressId },
                },
                data: { isDefault: false },
            });
        }

        return updated;
    }

    async deleteAddress(userId: string, addressId: string) {
        const address = await this.prisma.address.findFirst({
            where: { id: addressId, userId },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        await this.prisma.address.delete({
            where: { id: addressId },
        });

        return { success: true };
    }

    async getStats(userId: string) {
        const [totalOrders, totalSpent, totalReviews, wishlistCount] =
            await Promise.all([
                this.prisma.order.count({ where: { userId } }),
                this.prisma.order.aggregate({
                    where: { userId, status: 'DELIVERED' },
                    _sum: { total: true },
                }),
                this.prisma.review.count({ where: { userId } }),
                this.prisma.wishlistItem.count({ where: { userId } }),
            ]);

        return {
            totalOrders,
            totalSpent: totalSpent._sum.total || 0,
            totalReviews,
            wishlistCount,
        };
    }
}
