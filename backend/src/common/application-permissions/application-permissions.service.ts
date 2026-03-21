import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { RedisService } from '../../modules/auth/redis/redis.service';

@Injectable()
export class ApplicationPermissionsService {
  private readonly logger = new Logger(ApplicationPermissionsService.name);
  static readonly DEFAULT_SESSION_TTL_SECONDS = 86400;
  static readonly DEFAULT_REFRESH_TTL_SECONDS = 604800;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {}

  private parseDurationToSeconds(raw: string | undefined): number | null {
    if (!raw) return null;
    const value = raw.trim().toLowerCase();
    const match = /^(\d+)\s*([smhd])?$/.exec(value);
    if (!match) return null;
    const amount = Number.parseInt(match[1], 10);
    if (!Number.isFinite(amount) || amount <= 0) return null;
    const unit = match[2] ?? 's';
    const unitSeconds: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };
    return amount * unitSeconds[unit];
  }

  private resolveTtlFromConfig(key: string, fallbackSeconds: number): number {
    const configuredExpiration = this.configService.get<string>(key);
    const parsedTtlSeconds = this.parseDurationToSeconds(configuredExpiration);
    if (parsedTtlSeconds == null) {
      this.logger.warn(
        `Invalid ${key} value "${configuredExpiration}". Falling back to ${fallbackSeconds} seconds.`,
      );
      return fallbackSeconds;
    }
    return parsedTtlSeconds;
  }

  computePermissionsHash(permissions: any): string {
    const permissionsString = JSON.stringify(permissions);
    return crypto
      .createHash('sha256')
      .update(permissionsString)
      .digest('hex');
  }

  async saveSessionData(
    userId: string,
    sessionId: string,
    sessionData: any,
  ): Promise<void> {
    const key = `session:${userId}:${sessionId}`;
    const accessTtlSeconds = this.resolveTtlFromConfig(
      'JWT_EXPIRATION',
      ApplicationPermissionsService.DEFAULT_SESSION_TTL_SECONDS,
    );
    const refreshTtlSeconds = this.resolveTtlFromConfig(
      'JWT_REFRESH_EXPIRATION',
      ApplicationPermissionsService.DEFAULT_REFRESH_TTL_SECONDS,
    );
    const ttlSeconds = Math.max(accessTtlSeconds, refreshTtlSeconds);
    await this.redisService.set(key, JSON.stringify(sessionData), ttlSeconds);
  }

  async saveRefreshToken(
    refreshToken: string,
    userId: string,
    sessionId: string,
  ): Promise<void> {
    const ttlSeconds = this.resolveTtlFromConfig(
      'JWT_REFRESH_EXPIRATION',
      ApplicationPermissionsService.DEFAULT_REFRESH_TTL_SECONDS,
    );
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
    await this.redisService.set(
      refreshKey,
      JSON.stringify(payload),
      ttlSeconds,
    );
    await this.redisService.set(
      sessionRefreshKey,
      refreshToken,
      ttlSeconds,
    );
  }

  async getRefreshTokenData(
    refreshToken: string,
  ): Promise<{ userId: string; sessionId: string } | null> {
    const raw = await this.redisService.get(`refresh:${refreshToken}`);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.userId || !parsed.sessionId) return null;
      return { userId: parsed.userId, sessionId: parsed.sessionId };
    } catch (error) {
      this.logger.warn(
        `Invalid refresh token payload for key refresh:${refreshToken}`,
      );
      return null;
    }
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    const tokenData = await this.getRefreshTokenData(refreshToken);
    await this.redisService.del(`refresh:${refreshToken}`);
    if (tokenData) {
      await this.redisService.del(
        `refresh_session:${tokenData.userId}:${tokenData.sessionId}`,
      );
    }
  }

  async deleteRefreshTokenBySession(
    userId: string,
    sessionId: string,
  ): Promise<void> {
    const sessionRefreshKey = `refresh_session:${userId}:${sessionId}`;
    const refreshToken = await this.redisService.get(sessionRefreshKey);
    if (refreshToken) {
      await this.redisService.del(`refresh:${refreshToken}`);
    }
    await this.redisService.del(sessionRefreshKey);
  }

  async getSessionFromRedis(
    userId: string,
    sessionId?: string,
  ): Promise<any | null> {
    let sessionDataString: string | null = null;

    if (sessionId) {
      sessionDataString = await this.redisService.get(
        `session:${userId}:${sessionId}`,
      );
    } else {
      sessionDataString = await this.redisService.get(`session:${userId}`);
    }

    if (!sessionDataString) {
      this.logger.debug(
        `No session data found for user ${userId} and session ${sessionId}`,
      );
      return null;
    }

    const sessionData = JSON.parse(sessionDataString);
    this.logger.debug(
      `Found session data for user ${userId}:`,
      sessionData,
    );
    return sessionData;
  }

  async deleteUserSession(userId: string, sessionId?: string): Promise<void> {
    this.logger.debug(`Deleting session for user ${userId}`);
    if (sessionId) {
      await this.redisService.del(`session:${userId}:${sessionId}`);
    } else {
      await this.redisService.del(`session:${userId}`);
    }
  }

  async canAccessModuleEntity(
    module_code: string,
    entity: string,
    action: string,
    permissions: any,
  ): Promise<boolean> {
    this.logger.debug(
      `Checking permission for ${module_code} ${entity} ${action}`,
    );

    if (permissions[module_code] == undefined) {
      return false;
    }

    if (permissions[module_code][entity] == undefined) {
      return false;
    }

    const entity_permission: string = permissions[module_code][entity];
    const actions = ['create', 'read', 'update', 'delete', 'list'];
    const actionIndex = actions.indexOf(action);
    const action_permission = entity_permission[actionIndex];

    this.logger.debug(
      `Action permission for ${module_code} ${entity} ${action}: ${action_permission}`,
    );
    return action_permission == '1';
  }

  getSimplefiedModulePermissionsByRolesAndModuleAndTenant(
    roleModulePermissions: any[],
  ): Record<string, Record<string, string>> {
    const permissions: Record<string, Record<string, string>> = {};

    if (!roleModulePermissions) {
      return permissions;
    }

    this.logger.debug(
      `Role module permissions: ${JSON.stringify(roleModulePermissions)}`,
    );

    for (const permission of roleModulePermissions) {
      const role_permission = [
        permission.can_create,
        permission.can_read,
        permission.can_update,
        permission.can_delete,
        permission.can_list,
      ]
        .map((value) => (value ? '1' : '0'))
        .join('');

      if (permissions[permission.module.code] == undefined) {
        permissions[permission.module.code] = {};
      }

      for (const entity in permission.module.access_details) {
        let entity_permission = '00000';

        if (
          Object.prototype.hasOwnProperty.call(
            permission.module.access_details,
            entity,
          )
        ) {
          entity_permission = permission.module.access_details[entity].replace(
            /[^0]/g,
            '1',
          );
          entity_permission
            .split('')
            .map((char, index) =>
              char === '1' && role_permission[index] === '1' ? '1' : '0',
            )
            .join('');
        }

        const combined_entity_permission = entity_permission
          .split('')
          .map((char, index) =>
            char === '1' && role_permission[index] === '1' ? '1' : '0',
          )
          .join('');

        if (permissions[permission.module.code][entity] == undefined) {
          permissions[permission.module.code][entity] =
            combined_entity_permission;
        } else {
          const stored_entity_permission =
            permissions[permission.module.code][entity];
          permissions[permission.module.code][entity] = stored_entity_permission
            .split('')
            .map((char, index) =>
              char === '1' || combined_entity_permission[index] === '1'
                ? '1'
                : '0',
            )
            .join('');
        }
      }
    }

    return permissions;
  }
}
