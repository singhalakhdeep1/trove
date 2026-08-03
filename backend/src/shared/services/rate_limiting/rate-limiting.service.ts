/**
 * Rate Limiting Service for Marketplace API
 * Implements token bucket algorithm for API rate limiting
 */
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

@Injectable()
export class RateLimitingService {
  private redis: Redis;
  private bucketCapacity: number = 100;
  private refillRate: number = 1; // tokens per second

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
    });
  }

  /**
   * Check if request is allowed
   */
  async isAllowed(key: string, tokensRequested: number = 1): Promise<boolean> {
    const bucket = await this.getOrCreateBucket(key);

    const now = Date.now();
    const timeSinceLastRefill = (now - bucket.lastRefill) / 1000;

    // Refill tokens based on time elapsed
    const tokensToAdd = Math.floor(timeSinceLastRefill * this.refillRate);
    bucket.tokens = Math.min(bucket.tokens + tokensToAdd, this.bucketCapacity);
    bucket.lastRefill = now;

    // Check if enough tokens available
    if (bucket.tokens >= tokensRequested) {
      bucket.tokens -= tokensRequested;
      await this.saveBucket(key, bucket);
      console.debug(`Request allowed for key: ${key} (Tokens remaining: ${bucket.tokens})`);
      return true;
    } else {
      console.warn(`Request rate limited for key: ${key} (Tokens needed: ${tokensRequested}, Available: ${bucket.tokens})`);
      return false;
    }
  }

  /**
   * Get remaining tokens for a key
   */
  async getRemainingTokens(key: string): Promise<number> {
    const bucket = await this.getOrCreateBucket(key);

    const now = Date.now();
    const timeSinceLastRefill = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = Math.floor(timeSinceLastRefill * this.refillRate);
    bucket.tokens = Math.min(bucket.tokens + tokensToAdd, this.bucketCapacity);
    bucket.lastRefill = now;

    await this.saveBucket(key, bucket);
    return bucket.tokens;
  }

  /**
   * Reset bucket for a key
   */
  async resetBucket(key: string): Promise<void> {
    await this.redis.del(`rate_limit:${key}`);
    console.debug(`Reset bucket for key: ${key}`);
  }

  /**
   * Get or create bucket
   */
  private async getOrCreateBucket(key: string): Promise<TokenBucket> {
    const data = await this.redis.get(`rate_limit:${key}`);

    if (data) {
      return JSON.parse(data);
    }

    const bucket: TokenBucket = {
      tokens: this.bucketCapacity,
      lastRefill: Date.now(),
    };

    await this.saveBucket(key, bucket);
    return bucket;
  }

  /**
   * Save bucket to Redis
   */
  private async saveBucket(key: string, bucket: TokenBucket): Promise<void> {
    await this.redis.setex(`rate_limit:${key}`, 3600, JSON.stringify(bucket));
  }
}
