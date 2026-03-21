import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;
  private readonly logger = new Logger(RedisService.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get('FA_REDIS_HOST', 'localhost');
    const port = this.configService.get<number>('FA_REDIS_PORT', 6379);
    const password = this.configService.get('FA_REDIS_PASSWORD');

    this.logger.log(`Initializing Redis connection to ${host}:${port}`);

    this.client = new Redis({
      host,
      port,
      password,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        this.logger.log(
          `Retrying Redis connection in ${delay}ms (attempt ${times})`,
        );
        return delay;
      },
    });

    this.client.on('connect', () => {
      this.logger.log('Successfully connected to Redis');
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis connection error:', err);
    });
  }

  onModuleDestroy() {
    this.logger.log('Disconnecting from Redis');
    this.client.disconnect();
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      this.logger.debug(`Setting key: ${key} with TTL: ${ttl || 'none'}`);
      if (ttl) {
        await this.client.set(key, value, 'EX', ttl);
      } else {
        await this.client.set(key, value);
      }
      this.logger.debug(`Successfully set key: ${key}`);
    } catch (error) {
      this.logger.error(`Error setting key ${key}:`, error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      this.logger.debug(`Getting key: ${key}`);
      const value = await this.client.get(key);
      this.logger.debug(
        `Value for key ${key}: ${value ? 'found' : 'not found'}`,
      );
      return value;
    } catch (error) {
      this.logger.error(`Error getting key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<number> {
    try {
      this.logger.debug(`Deleting key: ${key}`);
      const result = await this.client.del(key);
      this.logger.debug(`Delete result for key ${key}: ${result}`);
      return result;
    } catch (error) {
      this.logger.error(`Error deleting key ${key}:`, error);
      throw error;
    }
  }
}
