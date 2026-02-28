"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ApplicationPermissionsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationPermissionsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto = __importStar(require("crypto"));
const redis_service_1 = require("../../modules/auth/redis/redis.service");
let ApplicationPermissionsService = class ApplicationPermissionsService {
    static { ApplicationPermissionsService_1 = this; }
    redisService;
    configService;
    logger = new common_1.Logger(ApplicationPermissionsService_1.name);
    static DEFAULT_SESSION_TTL_SECONDS = 86400;
    static DEFAULT_REFRESH_TTL_SECONDS = 604800;
    constructor(redisService, configService) {
        this.redisService = redisService;
        this.configService = configService;
    }
    parseDurationToSeconds(raw) {
        if (!raw)
            return null;
        const value = raw.trim().toLowerCase();
        const match = /^(\d+)\s*([smhd])?$/.exec(value);
        if (!match)
            return null;
        const amount = Number.parseInt(match[1], 10);
        if (!Number.isFinite(amount) || amount <= 0)
            return null;
        const unit = match[2] ?? 's';
        const unitSeconds = {
            s: 1,
            m: 60,
            h: 3600,
            d: 86400,
        };
        return amount * unitSeconds[unit];
    }
    resolveTtlFromConfig(key, fallbackSeconds) {
        const configuredExpiration = this.configService.get(key);
        const parsedTtlSeconds = this.parseDurationToSeconds(configuredExpiration);
        if (parsedTtlSeconds == null) {
            this.logger.warn(`Invalid ${key} value "${configuredExpiration}". Falling back to ${fallbackSeconds} seconds.`);
            return fallbackSeconds;
        }
        return parsedTtlSeconds;
    }
    computePermissionsHash(permissions) {
        const permissionsString = JSON.stringify(permissions);
        return crypto.createHash('sha256').update(permissionsString).digest('hex');
    }
    async saveSessionData(userId, sessionId, sessionData) {
        const key = `session:${userId}:${sessionId}`;
        const accessTtlSeconds = this.resolveTtlFromConfig('JWT_EXPIRATION', ApplicationPermissionsService_1.DEFAULT_SESSION_TTL_SECONDS);
        const refreshTtlSeconds = this.resolveTtlFromConfig('JWT_REFRESH_EXPIRATION', ApplicationPermissionsService_1.DEFAULT_REFRESH_TTL_SECONDS);
        const ttlSeconds = Math.max(accessTtlSeconds, refreshTtlSeconds);
        await this.redisService.set(key, JSON.stringify(sessionData), ttlSeconds);
    }
    async saveRefreshToken(refreshToken, userId, sessionId) {
        const ttlSeconds = this.resolveTtlFromConfig('JWT_REFRESH_EXPIRATION', ApplicationPermissionsService_1.DEFAULT_REFRESH_TTL_SECONDS);
        const refreshKey = `refresh:${refreshToken}`;
        const sessionRefreshKey = `refresh_session:${userId}:${sessionId}`;
        const existingRefreshToken = await this.redisService.get(sessionRefreshKey);
        if (existingRefreshToken) {
            await this.redisService.del(`refresh:${existingRefreshToken}`);
        }
        const payload = {
            userId,
            sessionId,
            createdAt: new Date().toISOString(),
        };
        await this.redisService.set(refreshKey, JSON.stringify(payload), ttlSeconds);
        await this.redisService.set(sessionRefreshKey, refreshToken, ttlSeconds);
    }
    async getRefreshTokenData(refreshToken) {
        const raw = await this.redisService.get(`refresh:${refreshToken}`);
        if (!raw)
            return null;
        try {
            const parsed = JSON.parse(raw);
            if (!parsed.userId || !parsed.sessionId)
                return null;
            return { userId: parsed.userId, sessionId: parsed.sessionId };
        }
        catch (error) {
            this.logger.warn(`Invalid refresh token payload for key refresh:${refreshToken}`);
            return null;
        }
    }
    async deleteRefreshToken(refreshToken) {
        const tokenData = await this.getRefreshTokenData(refreshToken);
        await this.redisService.del(`refresh:${refreshToken}`);
        if (tokenData) {
            await this.redisService.del(`refresh_session:${tokenData.userId}:${tokenData.sessionId}`);
        }
    }
    async deleteRefreshTokenBySession(userId, sessionId) {
        const sessionRefreshKey = `refresh_session:${userId}:${sessionId}`;
        const refreshToken = await this.redisService.get(sessionRefreshKey);
        if (refreshToken) {
            await this.redisService.del(`refresh:${refreshToken}`);
        }
        await this.redisService.del(sessionRefreshKey);
    }
    async getSessionFromRedis(userId, sessionId) {
        let sessionDataString = null;
        if (sessionId) {
            sessionDataString = await this.redisService.get(`session:${userId}:${sessionId}`);
        }
        else {
            sessionDataString = await this.redisService.get(`session:${userId}`);
        }
        if (!sessionDataString) {
            this.logger.debug(`No session data found for user ${userId} and session ${sessionId}`);
            return null;
        }
        const sessionData = JSON.parse(sessionDataString);
        this.logger.debug(`Found session data for user ${userId}:`, sessionData);
        return sessionData;
    }
    async deleteUserSession(userId, sessionId) {
        this.logger.debug(`Deleting session for user ${userId}`);
        if (sessionId) {
            await this.redisService.del(`session:${userId}:${sessionId}`);
        }
        else {
            await this.redisService.del(`session:${userId}`);
        }
    }
    async canAccessModuleEntity(module_code, entity, action, permissions) {
        this.logger.debug(`Checking permission for ${module_code} ${entity} ${action}`);
        if (permissions[module_code] == undefined) {
            return false;
        }
        if (permissions[module_code][entity] == undefined) {
            return false;
        }
        const entity_permission = permissions[module_code][entity];
        const actions = ['create', 'read', 'update', 'delete', 'list'];
        const actionIndex = actions.indexOf(action);
        const action_permission = entity_permission[actionIndex];
        this.logger.debug(`Action permission for ${module_code} ${entity} ${action}: ${action_permission}`);
        return action_permission == '1';
    }
    getSimplefiedModulePermissionsByRolesAndModuleAndTenant(roleModulePermissions) {
        const permissions = {};
        if (!roleModulePermissions) {
            return permissions;
        }
        this.logger.debug(`Role module permissions: ${JSON.stringify(roleModulePermissions)}`);
        for (const permission of roleModulePermissions) {
            var role_permission = [
                permission.can_create,
                permission.can_read,
                permission.can_update,
                permission.can_delete,
                permission.can_list
            ].map(value => value ? '1' : '0').join('');
            ;
            if (permissions[permission.module.code] == undefined) {
                permissions[permission.module.code] = {};
            }
            for (const entity in permission.module.access_details) {
                var entity_permission = "00000";
                if (Object.prototype.hasOwnProperty.call(permission.module.access_details, entity)) {
                    entity_permission = permission.module.access_details[entity].replace(/[^0]/g, '1');
                    entity_permission.split('').map((char, index) => (char === '1' && role_permission[index] === '1' ? '1' : '0')).join('');
                }
                const combined_entity_permission = entity_permission.split('').map((char, index) => (char === '1' && role_permission[index] === '1' ? '1' : '0')).join('');
                if (permissions[permission.module.code][entity] == undefined) {
                    permissions[permission.module.code][entity] = combined_entity_permission;
                }
                else {
                    const stored_entity_permission = permissions[permission.module.code][entity];
                    permissions[permission.module.code][entity] = stored_entity_permission.split('')
                        .map((char, index) => (char === '1' || combined_entity_permission[index] === '1' ? '1' : '0'))
                        .join('');
                }
            }
        }
        return permissions;
    }
};
exports.ApplicationPermissionsService = ApplicationPermissionsService;
exports.ApplicationPermissionsService = ApplicationPermissionsService = ApplicationPermissionsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [redis_service_1.RedisService,
        config_1.ConfigService])
], ApplicationPermissionsService);
//# sourceMappingURL=application-permissions.service.js.map