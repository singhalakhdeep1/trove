import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { RedisService } from '../../redis/redis.service';

interface CalculateShippingDto {
  weight: number;
  distance: number;
  carrier: string;
  service: string;
}

interface CreateShipmentDto {
  orderId: string;
  carrier: string;
  service: string;
  trackingNumber: string;
  estimatedDelivery: Date;
  cost: number;
}

@Injectable()
export class ShippingService {
  constructor(
    private prisma: PrismaService,
    private redis: RedisService,
  ) {}

  async calculateShipping(dto: CalculateShippingDto) {
    const { weight, distance, carrier, service } = dto;

    // Base rates by carrier
    const carrierRates = {
      fedex: { base: 5.99, weightRate: 0.5, distanceRate: 0.1 },
      ups: { base: 6.99, weightRate: 0.6, distanceRate: 0.12 },
      dhl: { base: 7.99, weightRate: 0.7, distanceRate: 0.15 },
      usps: { base: 4.99, weightRate: 0.4, distanceRate: 0.08 },
    };

    const rates = carrierRates[carrier.toLowerCase()] || carrierRates.fedex;

    // Service multipliers
    const serviceMultipliers = {
      standard: 1,
      express: 1.5,
      overnight: 2.5,
      same_day: 3,
    };

    const multiplier = serviceMultipliers[service.toLowerCase()] || 1;

    const baseCost = rates.base;
    const weightCost = weight * rates.weightRate;
    const distanceCost = distance * rates.distanceRate;
    const total = (baseCost + weightCost + distanceCost) * multiplier;

    return {
      carrier,
      service,
      baseCost,
      weightCost,
      distanceCost,
      total,
      estimatedDays: this.getEstimatedDays(service),
    };
  }

  async getShippingRates(weight: number, distance: number) {
    const carriers = ['fedex', 'ups', 'dhl', 'usps'];
    const services = ['standard', 'express', 'overnight'];

    const rates = [];

    for (const carrier of carriers) {
      for (const service of services) {
        const rate = await this.calculateShipping({ weight, distance, carrier, service });
        rates.push(rate);
      }
    }

    return rates.sort((a, b) => a.total - b.total);
  }

  async createShipment(dto: CreateShipmentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const shipment = await this.prisma.delivery.create({
      data: {
        orderId: dto.orderId,
        carrier: dto.carrier,
        service: dto.service,
        trackingNumber: dto.trackingNumber,
        estimatedDelivery: dto.estimatedDelivery,
        cost: dto.cost,
        status: 'PROCESSING',
      },
    });

    // Update order status
    await this.prisma.order.update({
      where: { id: dto.orderId },
      data: { status: 'PROCESSING' },
    });

    return shipment;
  }

  async trackShipment(trackingNumber: string) {
    const shipment = await this.prisma.delivery.findFirst({
      where: { trackingNumber },
      include: {
        order: {
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

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    // Get tracking history
    const tracking = await this.prisma.orderTracking.findMany({
      where: { orderId: shipment.orderId },
      orderBy: { createdAt: 'desc' },
    });

    return {
      shipment,
      tracking,
    };
  }

  async updateShipmentStatus(shipmentId: string, status: string, location?: string) {
    const shipment = await this.prisma.delivery.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const updated = await this.prisma.delivery.update({
      where: { id: shipmentId },
      data: { status },
    });

    // Create tracking entry
    await this.prisma.orderTracking.create({
      data: {
        orderId: shipment.orderId,
        status,
        location: location || 'In Transit',
        trackingNumber: shipment.trackingNumber,
      },
    });

    // Update order status if needed
    if (status === 'DELIVERED') {
      await this.prisma.order.update({
        where: { id: shipment.orderId },
        data: { status: 'DELIVERED' },
      });
    }

    return updated;
  }

  async getShipments(orderId?: string) {
    const where = orderId ? { orderId } : {};

    return this.prisma.delivery.findMany({
      where,
      include: {
        order: {
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
    });
  }

  async getCarrierEstimates(carrier: string, weight: number, distance: number) {
    const services = ['standard', 'express', 'overnight'];
    const estimates = [];

    for (const service of services) {
      const rate = await this.calculateShipping({ weight, distance, carrier, service });
      estimates.push(rate);
    }

    return estimates;
  }

  private getEstimatedDays(service: string): number {
    const days = {
      standard: 5,
      express: 2,
      overnight: 1,
      same_day: 0,
    };

    return days[service.toLowerCase()] || 5;
  }
}