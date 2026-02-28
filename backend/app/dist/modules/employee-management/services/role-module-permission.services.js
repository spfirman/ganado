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
var RoleModulePermissionService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModulePermissionService = void 0;
const common_1 = require("@nestjs/common");
const role_module_permission_repository_1 = require("../repositories/role-module-permission.repository");
let RoleModulePermissionService = RoleModulePermissionService_1 = class RoleModulePermissionService {
    roleModulePermissionRepository;
    logger = new common_1.Logger(RoleModulePermissionService_1.name);
    constructor(roleModulePermissionRepository) {
        this.roleModulePermissionRepository = roleModulePermissionRepository;
    }
    async getByRolesAndTenant(roleIds, tenantId) {
        const roleModulePermissions = await this.roleModulePermissionRepository.findByRolesAndTenant(roleIds, tenantId);
        return roleModulePermissions;
    }
    async createPermission(tenantId, permissionDto, manager) {
        const existingPermission = await this.roleModulePermissionRepository.findByRoleAndModuleAndTenant(tenantId, permissionDto.roleId, permissionDto.moduleId, manager);
        if (existingPermission) {
            throw new common_1.ConflictException('The permission exist for this role and module');
        }
        return this.roleModulePermissionRepository.createRoleModulePermission(tenantId, permissionDto, manager);
    }
    async createPermissions(tenantId, permissionDtos, manager) {
        return this.roleModulePermissionRepository.createRoleModulePermissions(tenantId, permissionDtos, manager);
    }
    async updatePermission(roleId, tenantId, moduleId, permissionDto, manager) {
        const permission = await this.roleModulePermissionRepository.findByRoleAndModuleAndTenant(roleId, moduleId, tenantId, manager);
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        this.logger.debug("********************************************************");
        this.logger.debug(permission);
        this.logger.debug(permissionDto);
        const permissionUpdated = await this.roleModulePermissionRepository.updateRoleModulePermission(permission, permissionDto);
        this.logger.debug(permissionUpdated);
        return permissionUpdated;
    }
    async deletePermission(roleId, tenantId, moduleId, manager) {
        const deleteResult = await this.roleModulePermissionRepository.deleteRoleModulePermission(roleId, moduleId, tenantId, manager);
        if (deleteResult.affected === 0) {
            throw new common_1.NotFoundException('Permission not found');
        }
        return;
    }
    async listPermissions(roleId, tenantId, manager) {
        const permissions = await this.roleModulePermissionRepository.findByRoleAndTenant(roleId, tenantId, manager);
        return permissions;
    }
};
exports.RoleModulePermissionService = RoleModulePermissionService;
exports.RoleModulePermissionService = RoleModulePermissionService = RoleModulePermissionService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [role_module_permission_repository_1.RoleModulePermissionRepository])
], RoleModulePermissionService);
//# sourceMappingURL=role-module-permission.services.js.map