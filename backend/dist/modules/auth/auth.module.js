"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const auth_service_1 = require("./services/auth.service");
const auth_controller_1 = require("./auth.controller");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const config_1 = require("@nestjs/config");
const employee_management_module_1 = require("../employee-management/employee-management.module");
const application_permissions_service_1 = require("../../common/application-permissions/application-permissions.service");
const core_1 = require("@nestjs/core");
const all_exception_filter_1 = require("../../common/filters/all-exception.filter");
const application_permissions_module_1 = require("../../common/application-permissions/application-permissions.module");
const redis_module_1 = require("./redis/redis.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: configService.get('JWT_EXPIRATION') || '24h',
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            employee_management_module_1.EmployeeManagementModule,
            application_permissions_module_1.ApplicationPermissionsModule,
            redis_module_1.RedisModule,
        ],
        providers: [
            auth_service_1.AuthService,
            jwt_strategy_1.JwtStrategy,
            application_permissions_service_1.ApplicationPermissionsService,
            {
                provide: core_1.APP_FILTER,
                useClass: all_exception_filter_1.AllExceptionFilter,
            },
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService, application_permissions_service_1.ApplicationPermissionsService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map