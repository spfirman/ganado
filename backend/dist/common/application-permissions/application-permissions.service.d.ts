import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../modules/auth/redis/redis.service';
export declare class ApplicationPermissionsService {
    private readonly redisService;
    private readonly configService;
    private readonly logger;
    static readonly DEFAULT_SESSION_TTL_SECONDS = 86400;
    static readonly DEFAULT_REFRESH_TTL_SECONDS = 604800;
    constructor(redisService: RedisService, configService: ConfigService);
    private parseDurationToSeconds;
    private resolveTtlFromConfig;
    computePermissionsHash(permissions: any): string;
    saveSessionData(userId: string, sessionId: string, sessionData: any): Promise<void>;
    saveRefreshToken(refreshToken: string, userId: string, sessionId: string): Promise<void>;
    getRefreshTokenData(refreshToken: string): Promise<{
        userId: string;
        sessionId: string;
    } | null>;
    deleteRefreshToken(refreshToken: string): Promise<void>;
    deleteRefreshTokenBySession(userId: string, sessionId: string): Promise<void>;
    getSessionFromRedis(userId: string, sessionId?: string): Promise<any | null>;
    deleteUserSession(userId: string, sessionId?: string): Promise<void>;
    canAccessModuleEntity(module_code: string, entity: string, action: string, permissions: any): Promise<boolean>;
    getSimplefiedModulePermissionsByRolesAndModuleAndTenant(roleModulePermissions: any[]): Record<string, Record<string, string>>;
}
