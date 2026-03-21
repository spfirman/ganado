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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tenants_service_1 = require("../services/tenants.service");
const create_tenant_dto_1 = require("../dto/create-tenant.dto");
const tenant_entity_1 = require("../entities/tenant.entity");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
let TenantsController = class TenantsController {
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    async create(createTenantDto) {
        return this.tenantsService.create(createTenantDto);
    }
    async read(sessionUser, id) {
        if (sessionUser.tenant_id !== id) {
            throw new common_1.ForbiddenException('No tienes permisos para acceder a este tenant');
        }
        return this.tenantsService.findOne(id);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Crear un nuevo tenant con usuario administrador',
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'El tenant ha sido creado exitosamente con su usuario administrador',
        type: create_tenant_dto_1.CreateTenantDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Datos invalidos' }),
    (0, swagger_1.ApiResponse)({
        status: 409,
        description: 'El nombre de usuario de la compania ya existe',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tenant_dto_1.CreateTenantDto]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    (0, application_permissions_decorator_1.RequireModule)('EMP_MGMT'),
    (0, application_permissions_decorator_1.RequireEntity)('tenants'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un tenant por ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'El tenant ha sido encontrado',
        type: tenant_entity_1.Tenant,
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Tenant no encontrado' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], TenantsController.prototype, "read", null);
exports.TenantsController = TenantsController = __decorate([
    (0, swagger_1.ApiTags)('Tenants'),
    (0, common_1.Controller)('tenants'),
    __metadata("design:paramtypes", [tenants_service_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map