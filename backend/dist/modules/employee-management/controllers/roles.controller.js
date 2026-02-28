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
var RolesController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const application_permissions_guard_1 = require("../../../common/application-permissions/application-permissions.guard");
const application_permissions_decorator_1 = require("../../../common/application-permissions/application-permissions.decorator");
const roles_service_1 = require("../services/roles.service");
const role_module_permission_entity_1 = require("../entities/role-module-permission.entity");
const swagger_1 = require("@nestjs/swagger");
const session_user_dto_1 = require("../../auth/dto/session-user.dto");
const session_user_decorator_1 = require("../../../common/decorators/session-user.decorator");
const create_permission_dto_1 = require("../dto/create-permission.dto");
const role_module_permission_services_1 = require("../services/role-module-permission.services");
const role_read_dto_1 = require("../dto/role-read.dto");
const update_permission_dto_1 = require("../dto/update-permission.dto");
let RolesController = RolesController_1 = class RolesController {
    roleService;
    roleModulePermissionService;
    logger = new common_1.Logger(RolesController_1.name);
    constructor(roleService, roleModulePermissionService) {
        this.roleService = roleService;
        this.roleModulePermissionService = roleModulePermissionService;
    }
    async findAll(requestUser) {
        return this.roleService.findAll(requestUser.tenant_id);
    }
    findOne(id) {
        return this.roleService.findOne(id);
    }
    createPermission(requestUser, createPermissionDto) {
        return this.roleModulePermissionService.createPermission(requestUser.tenant_id, createPermissionDto);
    }
    updatePermission(sessionUser, roleId, moduleId, updatePermissionDto) {
        this.logger.debug(`Actualizando permiso para el rol ${roleId} y el módulo ${moduleId} con los datos: ${JSON.stringify(updatePermissionDto)}`);
        return this.roleModulePermissionService.updatePermission(roleId, sessionUser.tenant_id, moduleId, updatePermissionDto);
    }
    async removePermission(sessionUser, roleId, moduleId) {
        await this.roleModulePermissionService.deletePermission(roleId, sessionUser.tenant_id, moduleId);
        return {
            message: 'Permiso eliminado exitosamente',
            roleId,
            moduleId
        };
    }
    listPermissions(sessionUser, roleId) {
        const permissions = this.roleModulePermissionService.listPermissions(roleId, sessionUser.tenant_id);
        return permissions;
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)(),
    (0, application_permissions_decorator_1.RequireAction)('list'),
    (0, application_permissions_decorator_1.RequireEntity)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todos los roles' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de roles obtenida exitosamente',
        type: [role_read_dto_1.RoleReadDto]
    }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'No tienes permisos para ver roles' }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, application_permissions_decorator_1.RequireAction)('read'),
    (0, application_permissions_decorator_1.RequireEntity)('roles'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener un rol por ID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Rol encontrado exitosamente',
        type: role_read_dto_1.RoleReadDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Rol no encontrado' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('permissions'),
    (0, application_permissions_decorator_1.RequireAction)('create'),
    (0, application_permissions_decorator_1.RequireEntity)('permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Crear permiso para un rol' }),
    (0, swagger_1.ApiBody)({
        type: create_permission_dto_1.CreatePermissionDto,
        description: 'Datos del permiso a crear',
        required: true
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Permiso creado exitosamente', type: create_permission_dto_1.CreatePermissionResponseDto }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, create_permission_dto_1.CreatePermissionDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Put)(':roleId/permissions/:moduleId'),
    (0, application_permissions_decorator_1.RequireAction)('update'),
    (0, application_permissions_decorator_1.RequireEntity)('permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar permiso de un rol' }),
    (0, swagger_1.ApiBody)({
        type: update_permission_dto_1.UpdatePermissionDto,
        description: 'Datos del permiso a actualizar',
        required: true,
        examples: {
            example1: {
                summary: 'Actualizar todos los permisos de un rol',
                value: {
                    can_create: true,
                    can_read: true,
                    can_update: true,
                    can_delete: true,
                    can_list: true
                },
            },
            example2: {
                summary: 'Actualizar solo el permiso de creación',
                value: {
                    can_create: true,
                },
            },
            example3: {
                summary: 'Actualizar solo el permiso de lectura y actualización',
                value: {
                    can_read: true,
                    can_update: true,
                },
            },
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permiso actualizado exitosamente',
        type: create_permission_dto_1.CreatePermissionResponseDto
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Param)('moduleId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String, String, update_permission_dto_1.UpdatePermissionDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "updatePermission", null);
__decorate([
    (0, common_1.Delete)(':roleId/permissions/:moduleId'),
    (0, application_permissions_decorator_1.RequireAction)('delete'),
    (0, application_permissions_decorator_1.RequireEntity)('permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar permiso de un rol' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Permiso eliminado exitosamente',
        schema: {
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Permiso eliminado exitosamente'
                },
                roleId: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174000'
                },
                moduleId: {
                    type: 'string',
                    example: '123e4567-e89b-12d3-a456-426614174001'
                }
            }
        }
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('roleId')),
    __param(2, (0, common_1.Param)('moduleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "removePermission", null);
__decorate([
    (0, common_1.Get)('permissions/:roleId'),
    (0, application_permissions_decorator_1.RequireAction)('list'),
    (0, application_permissions_decorator_1.RequireEntity)('permissions'),
    (0, swagger_1.ApiOperation)({ summary: 'Listar permisos de un rol' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Lista de permisos obtenida exitosamente',
        type: [role_module_permission_entity_1.RoleModulePermission]
    }),
    __param(0, (0, session_user_decorator_1.SessionUser)()),
    __param(1, (0, common_1.Param)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [session_user_dto_1.SessionUserDto, String]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "listPermissions", null);
exports.RolesController = RolesController = RolesController_1 = __decorate([
    (0, swagger_1.ApiTags)('Roles'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Controller)('roles'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, application_permissions_guard_1.ApplicationPermissionsGuard),
    (0, application_permissions_decorator_1.RequireModule)('EMP_MGMT'),
    __metadata("design:paramtypes", [roles_service_1.RoleService, role_module_permission_services_1.RoleModulePermissionService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map