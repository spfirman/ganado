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
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const config_1 = require("@nestjs/config");
const users_service_1 = require("../../employee-management/services/users.service");
const application_permissions_service_1 = require("../../../common/application-permissions/application-permissions.service");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, usersService, permissionsService) {
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET no está configurado en las variables de entorno');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        this.configService = configService;
        this.usersService = usersService;
        this.permissionsService = permissionsService;
    }
    async validate(payload) {
        if (!payload || !payload.sub) {
            throw new common_1.UnauthorizedException();
        }
        const sessionData = await this.permissionsService.getSessionFromRedis(payload.sub, payload.sessionId);
        if (!sessionData) {
            throw new common_1.UnauthorizedException('Session expired or invalid.');
        }
        if (sessionData.permissionsHash !== payload.permissionsHash) {
            throw new common_1.UnauthorizedException('Permissions outdated. Please refresh your session.');
        }
        return sessionData;
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService,
        application_permissions_service_1.ApplicationPermissionsService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map