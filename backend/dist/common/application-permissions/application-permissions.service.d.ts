import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/modules/auth/redis/redis.service';
import { RoleModulePermission } from 'src/modules/employee-management/entities/role-module-permission.entity';
export declare class ApplicationPermissionsService {
    private readonly redisService;
    private readonly configService;
    private readonly logger;
    private static readonly DEFAULT_SESSION_TTL_SECONDS;
    private static readonly DEFAULT_REFRESH_TTL_SECONDS;
    constructor(redisService: RedisService, configService: ConfigService);
    private parseDurationToSeconds;
    private resolveTtlFromConfig;
    computePermissionsHash(permissions: Record<string, Record<string, string>>): string;
    saveSessionData(userId: string, sessionId: string, sessionData: Record<string, any>): Promise<void>;
    saveRefreshToken(refreshToken: string, userId: string, sessionId: string): Promise<void>;
    getRefreshTokenData(refreshToken: string): Promise<{
        userId: string;
        sessionId: string;
    } | null>;
    deleteRefreshToken(refreshToken: string): Promise<void>;
    deleteRefreshTokenBySession(userId: string, sessionId: string): Promise<void>;
    getSessionFromRedis(userId: string, sessionId?: string): Promise<any>;
    deleteUserSession(userId: string, sessionId?: string): Promise<void>;
    canAccessModuleEntity(module_code: string, entity: string, action: string, permissions: Record<string, Record<string, string>>): Promise<boolean>;
    getSimplefiedModulePermissionsByRolesAndModuleAndTenant(roleModulePermissions: RoleModulePermission[]): Record<string, Record<string, string>>;
}
