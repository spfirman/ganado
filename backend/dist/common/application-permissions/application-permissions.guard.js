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
var ApplicationPermissionsGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationPermissionsGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const application_permissions_service_1 = require("./application-permissions.service");
const common_2 = require("@nestjs/common");
let ApplicationPermissionsGuard = ApplicationPermissionsGuard_1 = class ApplicationPermissionsGuard {
    reflector;
    applicationPermissionsService;
    logger = new common_2.Logger(ApplicationPermissionsGuard_1.name);
    constructor(reflector, applicationPermissionsService) {
        this.reflector = reflector;
        this.applicationPermissionsService = applicationPermissionsService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const tokenUser = request.user;
        this.logger.debug('User from request:', tokenUser);
        if (!tokenUser || !tokenUser.sub) {
            throw new common_1.UnauthorizedException('User not authenticated');
        }
        console.log('User from request:', tokenUser);
        console.log('request:', request);
        let module = this.reflector.get('requireModule', context.getHandler());
        if (!module) {
            module = this.reflector.get('requireModule', context.getClass());
        }
        let entity = this.reflector.get('requireEntity', context.getHandler());
        if (!entity) {
            entity = this.reflector.get('requireEntity', context.getClass());
        }
        const action = this.reflector.get('requireAction', context.getHandler());
        this.logger.debug('Permission check:', { module, entity, action });
        if (!module || !entity || !action) {
            throw new common_1.ForbiddenException('Not Authorized');
        }
        if (entity === 'roles' && (action === 'create' || action === 'update' || action === 'delete')) {
            throw new common_1.ForbiddenException('Not Authorized');
        }
        if (entity === 'modules' && (action === 'create' || action === 'update' || action === 'delete')) {
            throw new common_1.ForbiddenException('Not Authorized');
        }
        if (entity === 'tenants' && action === 'create') {
            return true;
        }
        if (entity === 'tenants' && action === 'list') {
            return false;
        }
        const redisSessionData = await this.applicationPermissionsService.getSessionFromRedis(tokenUser.sub, tokenUser.sessionId);
        if (!redisSessionData) {
            throw new common_1.ForbiddenException('No permissions found');
        }
        if (redisSessionData.permissionsHash !== tokenUser.permissionsHash) {
            throw new common_1.ForbiddenException('Invalid permissions');
        }
        if (!redisSessionData.permissions) {
            throw new common_1.ForbiddenException('No permissions found');
        }
        const hasAccess = await this.applicationPermissionsService.canAccessModuleEntity(module, entity, action, redisSessionData.permissions);
        if (!hasAccess) {
            if (entity === 'users' && action === 'update' && tokenUser.sub === request.params.id) {
                const restrictedFields = ['roleIds', 'tenantId', 'active'];
                const updateData = request.body;
                const hasRestrictedFields = restrictedFields.some(field => updateData.hasOwnProperty(field));
                if (!hasRestrictedFields) {
                    return true;
                }
                throw new common_1.ForbiddenException('No tienes permisos para modificar estos campos: roleIds, tenantId, active');
            }
            else {
                throw new common_1.ForbiddenException(`Access denied this action`);
            }
        }
        return true;
    }
};
exports.ApplicationPermissionsGuard = ApplicationPermissionsGuard;
exports.ApplicationPermissionsGuard = ApplicationPermissionsGuard = ApplicationPermissionsGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        application_permissions_service_1.ApplicationPermissionsService])
], ApplicationPermissionsGuard);
//# sourceMappingURL=application-permissions.guard.js.map