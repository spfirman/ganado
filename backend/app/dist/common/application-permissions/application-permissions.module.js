"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationPermissionsModule = void 0;
const common_1 = require("@nestjs/common");
const redis_module_1 = require("../../modules/auth/redis/redis.module");
const application_permissions_service_1 = require("./application-permissions.service");
const application_permissions_guard_1 = require("./application-permissions.guard");
let ApplicationPermissionsModule = class ApplicationPermissionsModule {
};
exports.ApplicationPermissionsModule = ApplicationPermissionsModule;
exports.ApplicationPermissionsModule = ApplicationPermissionsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            redis_module_1.RedisModule
        ],
        providers: [
            application_permissions_service_1.ApplicationPermissionsService,
            application_permissions_guard_1.ApplicationPermissionsGuard
        ],
        exports: [application_permissions_service_1.ApplicationPermissionsService,
            application_permissions_guard_1.ApplicationPermissionsGuard]
    })
], ApplicationPermissionsModule);
//# sourceMappingURL=application-permissions.module.js.map