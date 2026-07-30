import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface UpdateStockDto {
  productId: string;
  quantity: number;
  reason?: string;
}

interface AddStockDto {
  productId: string;
  quantity: number;
  reason?: string;
}

@Injectable()
export class InventoryService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async getInventory(sellerId?: string, filters: any = {}) {
    const { lowStock, outOfStock, page = 1, limit = 20 } = filters;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (sellerId) {
      where.product = { sellerId };
    }
    if (lowStock) {
      where.stock = { gt: 0, lte: 10 };
    }
    if (outOfStock) {
      where.stock = 0;
    }

    const [inventory, total] = await Promise.all([
      this.prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        include: {
          product: {
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
          },
        },
        orderBy: { stock: 'asc' },
      }),
      this.prisma.inventory.count({ where }),
    ]);

    return {
      data: inventory,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInventoryItem(productId: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
      include: {
        product: true,
        logs: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    return inventory;
  }

  async updateStock(dto: UpdateStockDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId: dto.productId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    const previousStock = inventory.stock;
    const updated = await this.prisma.inventory.update({
      where: { productId: dto.productId },
      data: { stock: dto.quantity },
    });

    // Log the change
    await this.prisma.inventoryLog.create({
      data: {
        productId: dto.productId,
        previousStock,
        newStock: dto.quantity,
        change: dto.quantity - previousStock,
        reason: dto.reason || 'Manual update',
      },
    });

    // Check for low stock alert
    if (dto.quantity <= 10) {
      await this.sendLowStockAlert(dto.productId, dto.quantity);
    }

    // Invalidate cache
    await this.redis.del(`inventory:${dto.productId}`);

    return updated;
  }

  async addStock(dto: AddStockDto) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId: dto.productId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    const previousStock = inventory.stock;
    const newStock = previousStock + dto.quantity;

    const updated = await this.prisma.inventory.update({
      where: { productId: dto.productId },
      data: { stock: newStock },
    });

    // Log the change
    await this.prisma.inventoryLog.create({
      data: {
        productId: dto.productId,
        previousStock,
        newStock,
        change: dto.quantity,
        reason: dto.reason || 'Stock added',
      },
    });

    // Invalidate cache
    await this.redis.del(`inventory:${dto.productId}`);

    return updated;
  }

  async removeStock(productId: string, quantity: number, reason?: string) {
    const inventory = await this.prisma.inventory.findUnique({
      where: { productId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    if (inventory.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const previousStock = inventory.stock;
    const newStock = previousStock - quantity;

    const updated = await this.prisma.inventory.update({
      where: { productId },
      data: { stock: newStock },
    });

    // Log the change
    await this.prisma.inventoryLog.create({
      data: {
        productId,
        previousStock,
        newStock,
        change: -quantity,
        reason: reason || 'Stock removed',
      },
    });

    // Check for low stock alert
    if (newStock <= 10) {
      await this.sendLowStockAlert(productId, newStock);
    }

    // Invalidate cache
    await this.redis.del(`inventory:${productId}`);

    return updated;
  }

  async getLowStockItems(sellerId?: string, threshold = 10) {
    const where: any = {
      stock: { lte: threshold },
    };

    if (sellerId) {
      where.product = { sellerId };
    }

    return this.prisma.inventory.findMany({
      where,
      include: {
        product: {
          include: {
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
        },
      },
      orderBy: { stock: 'asc' },
    });
  }

  async getOutOfStockItems(sellerId?: string) {
    return this.getLowStockItems(sellerId, 0);
  }

  async getInventoryLogs(productId: string, page = 1, limit = 50) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      this.prisma.inventoryLog.findMany({
        where: { productId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.inventoryLog.count({ where: { productId } }),
    ]);

    return {
      data: logs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getInventoryValue(sellerId?: string) {
    const where = sellerId ? { product: { sellerId } } : {};

    const inventories = await this.prisma.inventory.findMany({
      where,
      include: {
        product: true,
      },
    });

    const totalValue = inventories.reduce((sum, inv) => {
      return sum + (inv.stock * inv.product.price);
    }, 0);

    const totalStock = inventories.reduce((sum, inv) => sum + inv.stock, 0);

    return {
      totalValue,
      totalStock,
      totalItems: inventories.length,
    };
  }

  private async sendLowStockAlert(productId: string, currentStock: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          include: {
            user: true,
          },
        },
      },
    });

    if (product) {
      await this.prisma.notification.create({
        data: {
          userId: product.seller.userId,
          type: 'LOW_STOCK',
          title: 'Low Stock Alert',
          message: `Product "${product.name}" is running low on stock (${currentStock} remaining)`,
          data: { productId, currentStock },
        },
      });
    }
  }
}