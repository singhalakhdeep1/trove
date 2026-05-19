import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    constructor(private configService: ConfigService) {
        this.client = new Redis(this.configService.get('REDIS_URL'));
    }

    async onModuleInit() {
        console.log('✅ Redis connected');
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    getClient(): Redis {
        return this.client;
    }

    async get(key: string): Promise<string | null> {
        return this.client.get(key);
    }

    async set(
        key: string,
        value: string,
        ttl?: number,
    ): Promise<'OK'> {
        if (ttl) {
            return this.client.setex(key, ttl, value);
        }
        return this.client.set(key, value);
    }

    async del(key: string): Promise<number> {
        return this.client.del(key);
    }

    async exists(key: string): Promise<number> {
        return this.client.exists(key);
    }

    async expire(key: string, seconds: number): Promise<number> {
        return this.client.expire(key, seconds);
    }

    async incr(key: string): Promise<number> {
        return this.client.incr(key);
    }

    async decr(key: string): Promise<number> {
        return this.client.decr(key);
    }

    async hset(key: string, field: string, value: string): Promise<number> {
        return this.client.hset(key, field, value);
    }

    async hget(key: string, field: string): Promise<string | null> {
        return this.client.hget(key, field);
    }

    async hgetall(key: string): Promise<Record<string, string>> {
        return this.client.hgetall(key);
    }

    async sadd(key: string, ...members: string[]): Promise<number> {
        return this.client.sadd(key, ...members);
    }

    async smembers(key: string): Promise<string[]> {
        return this.client.smembers(key);
    }

    async sismember(key: string, member: string): Promise<number> {
        return this.client.sismember(key, member);
    }

    async zadd(key: string, score: number, member: string): Promise<number> {
        return this.client.zadd(key, score, member);
    }

    async zrange(
        key: string,
        start: number,
        stop: number,
    ): Promise<string[]> {
        return this.client.zrange(key, start, stop);
    }

    async zrangebyscore(
        key: string,
        min: number,
        max: number,
    ): Promise<string[]> {
        return this.client.zrangebyscore(key, min, max);
    }
}
