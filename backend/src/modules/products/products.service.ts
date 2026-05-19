import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ElasticsearchService } from '../../elasticsearch/elasticsearch.service';
import { RedisService } from '../../redis/redis.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
    constructor(
        private prisma: PrismaService,
        private elasticsearch: ElasticsearchService,
        private redis: RedisService,
    ) { }

    async create(sellerId: string, dto: CreateProductDto) {
        // Generate slug
        const slug = dto.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Create product
        const product = await this.prisma.product.create({
            data: {
                ...dto,
                slug: `${slug}-${Date.now()}`,
                sellerId,
                images: dto.images || [],
                tags: dto.tags || [],
            },
            include: {
                category: true,
                seller: {
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
                },
            },
        });

        // Index in Elasticsearch
        await this.elasticsearch.indexDocument('products', product.id, {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category.name,
            tags: product.tags,
            rating: product.rating,
            createdAt: product.createdAt,
        });

        return product;
    }

    async findAll(filters: ProductFilterDto) {
        const {
            page = 1,
            limit = 20,
            categoryId,
            minPrice,
            maxPrice,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            status = 'PUBLISHED',
        } = filters;

        const skip = (page - 1) * limit;

        // Build where clause
        const where: any = {
            status,
            isActive: true,
        };

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price.gte = minPrice;
            if (maxPrice) where.price.lte = maxPrice;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { tags: { has: search } },
            ];
        }

        // Fetch products
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: true,
                    seller: {
                        select: {
                            id: true,
                            businessName: true,
                            rating: true,
                            isVerified: true,
                        },
                    },
                    _count: {
                        select: {
                            reviews: true,
                            wishlistItems: true,
                        },
                    },
                },
                orderBy: { [sortBy]: sortOrder },
            }),
            this.prisma.product.count({ where }),
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

    async findOne(id: string) {
        // Try cache first
        const cached = await this.redis.get(`product:${id}`);
        if (cached) {
            return JSON.parse(cached);
        }

        const product = await this.prisma.product.findUnique({
            where: { id },
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
                variants: true,
                attributes: true,
                reviews: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
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
                _count: {
                    select: {
                        reviews: true,
                        wishlistItems: true,
                    },
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Increment views
        await this.prisma.product.update({
            where: { id },
            data: { views: { increment: 1 } },
        });

        // Cache for 1 hour
        await this.redis.set(`product:${id}`, JSON.stringify(product), 3600);

        return product;
    }

    async findBySlug(slug: string) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
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
                variants: true,
                attributes: true,
                reviews: {
                    take: 10,
                    orderBy: { createdAt: 'desc' },
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

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Increment views
        await this.prisma.product.update({
            where: { slug },
            data: { views: { increment: 1 } },
        });

        return product;
    }

    async update(id: string, sellerId: string, dto: UpdateProductDto) {
        // Verify ownership
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.sellerId !== sellerId) {
            throw new ForbiddenException('Not authorized to update this product');
        }

        // Update product
        const updated = await this.prisma.product.update({
            where: { id },
            data: dto,
            include: {
                category: true,
                seller: true,
            },
        });

        // Update Elasticsearch
        await this.elasticsearch.updateDocument('products', id, {
            name: updated.name,
            description: updated.description,
            price: updated.price,
            tags: updated.tags,
        });

        // Invalidate cache
        await this.redis.del(`product:${id}`);

        return updated;
    }

    async remove(id: string, sellerId: string) {
        // Verify ownership
        const product = await this.prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.sellerId !== sellerId) {
            throw new ForbiddenException('Not authorized to delete this product');
        }

        // Soft delete - mark as inactive
        await this.prisma.product.update({
            where: { id },
            data: { isActive: false, status: 'DISCONTINUED' },
        });

        // Remove from Elasticsearch
        await this.elasticsearch.deleteDocument('products', id);

        // Invalidate cache
        await this.redis.del(`product:${id}`);

        return { success: true };
    }

    async getSellerProducts(sellerId: string, filters: ProductFilterDto) {
        const { page = 1, limit = 20, status } = filters;
        const skip = (page - 1) * limit;

        const where: any = { sellerId };
        if (status) {
            where.status = status;
        }

        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                skip,
                take: limit,
                include: {
                    category: true,
                    _count: {
                        select: {
                            reviews: true,
                            orderItems: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.product.count({ where }),
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

    async getFeaturedProducts(limit = 10) {
        return this.prisma.product.findMany({
            where: {
                isFeatured: true,
                isActive: true,
                status: 'PUBLISHED',
            },
            take: limit,
            include: {
                category: true,
                seller: {
                    select: {
                        businessName: true,
                        rating: true,
                    },
                },
            },
            orderBy: { sales: 'desc' },
        });
    }

    async getPopularProducts(limit = 10) {
        return this.prisma.product.findMany({
            where: {
                isActive: true,
                status: 'PUBLISHED',
            },
            take: limit,
            include: {
                category: true,
                seller: {
                    select: {
                        businessName: true,
                        rating: true,
                    },
                },
            },
            orderBy: [{ sales: 'desc' }, { rating: 'desc' }],
        });
    }

    async getRelatedProducts(productId: string, limit = 6) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId },
            select: { categoryId: true, tags: true },
        });

        if (!product) {
            return [];
        }

        return this.prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: productId },
                isActive: true,
                status: 'PUBLISHED',
            },
            take: limit,
            include: {
                category: true,
                seller: {
                    select: {
                        businessName: true,
                        rating: true,
                    },
                },
            },
            orderBy: { rating: 'desc' },
        });
    }

    async updateStock(id: string, quantity: number) {
        const product = await this.prisma.product.update({
            where: { id },
            data: {
                stock: { increment: quantity },
            },
        });

        // Check low stock
        if (product.stock <= product.lowStockAlert) {
            // TODO: Send low stock notification
        }

        // Update status if out of stock
        if (product.stock <= 0) {
            await this.prisma.product.update({
                where: { id },
                data: { status: 'OUT_OF_STOCK' },
            });
        }

        await this.redis.del(`product:${id}`);

        return product;
    }

    async searchProducts(query: string, filters: any = {}) {
        const { page = 1, limit = 20, categoryId, minPrice, maxPrice } = filters;

        // Build Elasticsearch query
        const must: any[] = [
            {
                multi_match: {
                    query,
                    fields: ['name^3', 'description', 'tags^2'],
                    fuzziness: 'AUTO',
                },
            },
        ];

        if (categoryId) {
            must.push({ term: { 'category.keyword': categoryId } });
        }

        if (minPrice || maxPrice) {
            const range: any = {};
            if (minPrice) range.gte = minPrice;
            if (maxPrice) range.lte = maxPrice;
            must.push({ range: { price: range } });
        }

        const result = await this.elasticsearch.search('products', {
            from: (page - 1) * limit,
            size: limit,
            query: {
                bool: { must },
            },
            sort: [{ _score: 'desc' }, { rating: 'desc' }],
        });

        const productIds = result.hits.hits.map((hit: any) => hit._source.id);

        // Fetch full products from database
        const products = await this.prisma.product.findMany({
            where: { id: { in: productIds } },
            include: {
                category: true,
                seller: {
                    select: {
                        businessName: true,
                        rating: true,
                    },
                },
            },
        });

        return {
            data: products,
            meta: {
                total: result.hits.total.value,
                page,
                limit,
            },
        };
    }
}
