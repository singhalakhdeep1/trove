/**
 * Cache Service for Marketplace
 * Implements distributed caching with Redis
 */
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class CacheService {
  private redis: Redis;
  private defaultTTL: number = 3600; // 1 hour

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  /**
   * Get value from cache
   */
  async get(key: string): Promise<string | null> {
    const value = await this.redis.get(key);
    if (value === null) {
      console.debug(`Cache miss for key: ${key}`);
    } else {
      console.debug(`Cache hit for key: ${key}`);
    }
    return value;
  }

  /**
   * Set value in cache
   */
  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiration = ttl || this.defaultTTL;
    await this.redis.setex(key, expiration, value);
    console.debug(`Set cache for key: ${key} with TTL: ${expiration}`);
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    await this.redis.del(key);
    console.debug(`Deleted cache for key: ${key}`);
  }

  /**
   * Get or set pattern
   */
  async getOrSet(key: string, factory: () => Promise<string>, ttl?: number): Promise<string> {
    const cachedValue = await this.get(key);
    if (cachedValue !== null) {
      return cachedValue;
    }

    const value = await factory();
    await this.set(key, value, ttl);
    return value;
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string): Promise<void> {
    const keys = await this.redis.keys(pattern);
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    console.log(`Invalidated cache pattern: ${pattern}`);
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    const keys = await this.redis.keys('*');
    if (keys.length > 0) {
      await this.redis.del(...keys);
    }
    console.log('Cleared all cache');
  }

  /**
   * Increment counter
   */
  async increment(key: string, value: number = 1): Promise<number> {
    return await this.redis.incrby(key, value);
  }

  /**
   * Decrement counter
   */
  async decrement(key: string, value: number = 1): Promise<number> {
    return await this.redis.decrby(key, value);
  }

  /**
   * Set with expiration
   */
  async setWithExpire(key: string, value: string, expireInSeconds: number): Promise<void> {
    await this.redis.setex(key, expireInSeconds, value);
  }

  /**
   * Get TTL of key
   */
  async getTTL(key: string): Promise<number> {
    return await this.redis.ttl(key);
  }
}
