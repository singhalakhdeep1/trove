/**
 * Event Bus Service for Marketplace Events
 * Implements publish-subscribe pattern for event-driven architecture
 */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

export interface EventPayload {
  eventType: string;
  data: any;
  timestamp: Date;
  correlationId?: string;
}

export interface EventHandler {
  eventType: string;
  handler: (payload: EventPayload) => Promise<void>;
}

@Injectable()
export class EventBusService implements OnModuleInit, OnModuleDestroy {
  private redis: Redis;
  private subscribers: Map<string, EventHandler[]> = new Map();
  private channel: string = 'marketplace_events';

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  async onModuleInit() {
    await this.subscribeToEvents();
    console.log('Event Bus Service initialized');
  }

  async onModuleDestroy() {
    await this.redis.quit();
  }

  /**
   * Publish an event to the event bus
   */
  async publish(eventType: string, data: any, correlationId?: string): Promise<void> {
    const payload: EventPayload = {
      eventType,
      data,
      timestamp: new Date(),
      correlationId,
    };

    await this.redis.publish(this.channel, JSON.stringify(payload));
    console.log(`Published event: ${eventType}`);
  }

  /**
   * Subscribe to events of a specific type
   */
  subscribe(eventType: string, handler: (payload: EventPayload) => Promise<void>): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType)!.push({ eventType, handler });
    console.log(`Subscribed to event: ${eventType}`);
  }

  /**
   * Unsubscribe from events
   */
  unsubscribe(eventType: string, handler: (payload: EventPayload) => Promise<void>): void {
    const handlers = this.subscribers.get(eventType);
    if (handlers) {
      const index = handlers.findIndex((h) => h.handler === handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Subscribe to Redis pub/sub channel
   */
  private async subscribeToEvents(): Promise<void> {
    const subscriber = this.redis.duplicate();
    await subscriber.subscribe(this.channel);

    subscriber.on('message', (channel, message) => {
      if (channel === this.channel) {
        this.handleMessage(message);
      }
    });
  }

  /**
   * Handle incoming message from Redis
   */
  private async handleMessage(message: string): Promise<void> {
    try {
      const payload: EventPayload = JSON.parse(message);
      const handlers = this.subscribers.get(payload.eventType);

      if (handlers) {
        for (const handler of handlers) {
          try {
            await handler.handler(payload);
          } catch (error) {
            console.error(`Error handling event ${payload.eventType}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing event message:', error);
    }
  }
}
