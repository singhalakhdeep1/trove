import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';
import { ElasticsearchService } from '../../elasticsearch/elasticsearch.service';

interface SearchFilters {
  query: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  location?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class SearchService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
    private elasticsearch: ElasticsearchService,
  ) {}

  async searchProducts(filters: SearchFilters) {
    const { query, category, minPrice, maxPrice, rating, page = 1, limit = 20 } = filters;

    // Try Elasticsearch first
    try {
      const esResults = await this.elasticsearch.search('products', {
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query,
                  fields: ['name^3', 'description^2', 'tags^2', 'category'],
                },
              },
            ],
            filter: [
              { term: { isActive: true } },
              ...(category ? [{ term: { category } }] : []),
              ...(minPrice ? [{ range: { price: { gte: minPrice } } }] : []),
              ...(maxPrice ? [{ range: { price: { lte: maxPrice } } }] : []),
              ...(rating ? [{ range: { rating: { gte: rating } } }] : []),
            ],
          },
        },
        from: (page - 1) * limit,
        size: limit,
        sort: [
          { _score: { order: 'desc' } },
          { createdAt: { order: 'desc' } },
        ],
      });

      if (esResults.hits.total.value > 0) {
        const productIds = esResults.hits.hits.map(hit => hit._id);
        const products = await this.prisma.product.findMany({
          where: {
            id: { in: productIds },
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
                  },
                },
              },
            },
          },
        });

        return {
          data: products,
          meta: {
            total: esResults.hits.total.value,
            page,
            limit,
            totalPages: Math.ceil(esResults.hits.total.value / limit),
          },
        };
      }
    } catch (error) {
      console.error('Elasticsearch error, falling back to Prisma:', error);
    }

    // Fallback to Prisma
    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
      ],
    };

    if (category) where.categoryId = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (rating) where.rating = { gte: rating };

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
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

  async searchServices(filters: SearchFilters) {
    const { query, category, minPrice, maxPrice, location, page = 1, limit = 20 } = filters;

    const where: any = {
      status: 'ACTIVE',
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } },
      ],
    };

    if (category) where.category = category;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = minPrice;
      if (maxPrice) where.price.lte = maxPrice;
    }
    if (location) where.location = { contains: location, mode: 'insensitive' };

    const [services, total] = await Promise.all([
      this.prisma.service.findMany({
        where,
        skip: (page - 1) * limit,
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
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.service.count({ where }),
    ]);

    const servicesWithRating = services.map(service => ({
      ...service,
      averageRating: service.reviews.length > 0
        ? service.reviews.reduce((sum, r) => sum + r.rating, 0) / service.reviews.length
        : 0,
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

  async searchRestaurants(filters: SearchFilters) {
    const { query, cuisine, location, minRating, page = 1, limit = 20 } = filters;

    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { cuisine: { contains: query, mode: 'insensitive' } },
      ],
    };

    if (cuisine) where.cuisine = cuisine;
    if (location) where.address = { contains: location, mode: 'insensitive' };
    if (minRating) where.rating = { gte: minRating };

    const [restaurants, total] = await Promise.all([
      this.prisma.restaurant.findMany({
        where,
        skip: (page - 1) * limit,
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

  async searchUsers(query: string, page = 1, limit = 20) {
    const where: any = {
      isActive: true,
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          avatar: true,
          role: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
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

  async getAutocompleteSuggestions(query: string, type: 'products' | 'services' | 'restaurants' | 'all') {
    const suggestions: any = {
      products: [],
      services: [],
      restaurants: [],
    };

    if (type === 'products' || type === 'all') {
      suggestions.products = await this.prisma.product.findMany({
        where: {
          isActive: true,
          name: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          images: true,
        },
      });
    }

    if (type === 'services' || type === 'all') {
      suggestions.services = await this.prisma.service.findMany({
        where: {
          status: 'ACTIVE',
          title: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: {
          id: true,
          title: true,
          images: true,
        },
      });
    }

    if (type === 'restaurants' || type === 'all') {
      suggestions.restaurants = await this.prisma.restaurant.findMany({
        where: {
          isActive: true,
          name: { contains: query, mode: 'insensitive' },
        },
        take: 5,
        select: {
          id: true,
          name: true,
          images: true,
        },
      });
    }

    return suggestions;
  }

  async getRecentSearches(userId: string) {
    const recent = await this.redis.get(`recent_searches:${userId}`);
    return recent ? JSON.parse(recent) : [];
  }

  async saveRecentSearch(userId: string, query: string) {
    const recent = await this.getRecentSearches(userId);
    const updated = [query, ...recent.filter((q: string) => q !== query)].slice(0, 10);
    await this.redis.set(`recent_searches:${userId}`, JSON.stringify(updated), 86400);
    return updated;
  }

  async clearRecentSearches(userId: string) {
    await this.redis.del(`recent_searches:${userId}`);
    return { success: true };
  }
}