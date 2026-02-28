"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = require("@nestjs/config");
let RedisService = RedisService_1 = class RedisService {
    configService;
    client;
    logger = new common_1.Logger(RedisService_1.name);
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const host = this.configService.get('FA_REDIS_HOST', 'localhost');
        const port = this.configService.get('FA_REDIS_PORT', 6379);
        const password = this.configService.get('FA_REDIS_PASSWORD');
        this.logger.log(`Initializing Redis connection to ${host}:${port}`);
        this.client = new ioredis_1.default({
            host,
            port,
            password,
            retryStrategy: (times) => {
                const delay = Math.min(times * 50, 2000);
                this.logger.log(`Retrying Redis connection in ${delay}ms (attempt ${times})`);
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
    async set(key, value, ttl) {
        try {
            this.logger.debug(`Setting key: ${key} with TTL: ${ttl || 'none'}`);
            if (ttl) {
                await this.client.set(key, value, 'EX', ttl);
            }
            else {
                await this.client.set(key, value);
            }
            this.logger.debug(`Successfully set key: ${key}`);
        }
        catch (error) {
            this.logger.error(`Error setting key ${key}:`, error);
            throw error;
        }
    }
    async get(key) {
        try {
            this.logger.debug(`Getting key: ${key}`);
            const value = await this.client.get(key);
            this.logger.debug(`Value for key ${key}: ${value ? 'found' : 'not found'}`);
            return value;
        }
        catch (error) {
            this.logger.error(`Error getting key ${key}:`, error);
            throw error;
        }
    }
    async del(key) {
        try {
            this.logger.debug(`Deleting key: ${key}`);
            const result = await this.client.del(key);
            this.logger.debug(`Delete result for key ${key}: ${result}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Error deleting key ${key}:`, error);
            throw error;
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map