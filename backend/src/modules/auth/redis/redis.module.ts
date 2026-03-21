import { Module } from '@nestjs/common';
import { RedisModule as NestRedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Module({
  imports: [
    NestRedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get('FA_REDIS_HOST', 'localhost');
        const port = configService.get('FA_REDIS_PORT', 6379);
        const password = configService.get('FA_REDIS_PASSWORD', '');
        return {
          type: 'single',
          url: password
            ? `redis://:${password}@${host}:${port}`
            : `redis://${host}:${port}`,
        };
      },
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
