import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async create(data: any) {
        const slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        return this.prisma.category.create({
            data: {
                ...data,
                slug,
            },
        });
    }

    async findAll() {
        return this.prisma.category.findMany({
            where: { isActive: true },
            include: {
                parent: true,
                children: true,
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { order: 'asc' },
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.category.findUnique({
            where: { id },
            include: {
                parent: true,
                children: true,
                products: {
                    take: 10,
                    where: { isActive: true, status: 'PUBLISHED' },
                },
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async findBySlug(slug: string) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                parent: true,
                children: true,
            },
        });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async getTopLevel() {
        return this.prisma.category.findMany({
            where: {
                parentId: null,
                isActive: true,
            },
            include: {
                children: {
                    where: { isActive: true },
                },
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { order: 'asc' },
        });
    }

    async update(id: string, data: any) {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        // Check if has products
        const count = await this.prisma.product.count({
            where: { categoryId: id },
        });

        if (count > 0) {
            // Soft delete
            return this.prisma.category.update({
                where: { id },
                data: { isActive: false },
            });
        }

        return this.prisma.category.delete({
            where: { id },
        });
    }
}
