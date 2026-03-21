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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../../employee-management/services/users.service");
const application_permissions_service_1 = require("../../../common/application-permissions/application-permissions.service");
const role_module_permission_services_1 = require("../../employee-management/services/role-module-permission.services");
let AuthService = AuthService_1 = class AuthService {
    constructor(usersService, jwtService, configService, applicationPermissionsService, roleModulePermissionsService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.applicationPermissionsService = applicationPermissionsService;
        this.roleModulePermissionsService = roleModulePermissionsService;
        this.logger = new common_1.Logger(AuthService_1.name);
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
    getAccessTokenExpirationSeconds() {
        const configured = this.configService.get('JWT_EXPIRATION');
        return this.parseDurationToSeconds(configured) ?? 86400;
    }
    buildAccessPayload(sessionData) {
        return {
            username: sessionData.username,
            sub: sessionData.sub,
            tenant_id: sessionData.tenant_id,
            permissionsHash: sessionData.permissionsHash,
            sessionId: sessionData.sessionId,
        };
    }
    async issueAccessAndRefreshTokens(sessionData) {
        const payload = this.buildAccessPayload(sessionData);
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = crypto.randomBytes(48).toString('hex');
        await this.applicationPermissionsService.saveRefreshToken(refreshToken, sessionData.sub, sessionData.sessionId);
        return { accessToken, refreshToken };
    }
    async validateUser(username, company_username, password) {
        const user = await this.usersService.findByUsernameAndPasswordAndCompanyUsername(username, password, company_username);
        this.logger.debug('User:', user);
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        return user;
    }
    async login(user) {
        const roleIds = user.roles.map((role) => role.id);
        const roleModulePermissions = await this.roleModulePermissionsService.getByRolesAndTenant(roleIds, user.tenantId);
        const permissions = this.applicationPermissionsService.getSimplefiedModulePermissionsByRolesAndModuleAndTenant(roleModulePermissions);
        this.logger.debug('Permissions:', permissions);
        const permissionsHash = this.applicationPermissionsService.computePermissionsHash(permissions);
        const sessionId = crypto.randomUUID();
        const sessionData = {
            username: user.username,
            sub: user.id,
            tenant_id: user.tenantId,
            date: new Date().toISOString(),
            permissionsHash: permissionsHash,
            permissions: permissions,
            sessionId: sessionId,
        };
        await this.applicationPermissionsService.saveSessionData(user.id, sessionId, sessionData);
        const { accessToken, refreshToken } = await this.issueAccessAndRefreshTokens(sessionData);
        this.logger.debug('Access token generated for user:', user.id);
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: this.getAccessTokenExpirationSeconds(),
            user: {
                id: user.id,
                username: user.username,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                tenant_id: user.tenantId,
                roles: user.roles,
            },
            permissions: permissions,
        };
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is required');
        }
        const tokenData = await this.applicationPermissionsService.getRefreshTokenData(refreshToken);
        if (!tokenData) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        const sessionData = await this.applicationPermissionsService.getSessionFromRedis(tokenData.userId, tokenData.sessionId);
        if (!sessionData) {
            await this.applicationPermissionsService.deleteRefreshToken(refreshToken);
            throw new common_1.UnauthorizedException('Session expired or invalid');
        }
        await this.applicationPermissionsService.deleteRefreshToken(refreshToken);
        const { accessToken, refreshToken: rotatedRefreshToken } = await this.issueAccessAndRefreshTokens(sessionData);
        return {
            access_token: accessToken,
            refresh_token: rotatedRefreshToken,
            expires_in: this.getAccessTokenExpirationSeconds(),
            permissions: sessionData.permissions,
            user: {
                id: sessionData.sub,
                username: sessionData.username,
                tenant_id: sessionData.tenant_id,
            },
        };
    }
    async logout(userId, sessionId, refreshToken) {
        await this.applicationPermissionsService.deleteUserSession(userId, sessionId);
        await this.applicationPermissionsService.deleteRefreshTokenBySession(userId, sessionId);
        if (refreshToken) {
            await this.applicationPermissionsService.deleteRefreshToken(refreshToken);
        }
        return { message: 'Session closed' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        application_permissions_service_1.ApplicationPermissionsService,
        role_module_permission_services_1.RoleModulePermissionService])
], AuthService);
//# sourceMappingURL=auth.service.js.map