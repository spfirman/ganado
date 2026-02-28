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
exports.RoleModulePermissionRepository = void 0;
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const role_module_permission_entity_1 = require("../entities/role-module-permission.entity");
let RoleModulePermissionRepository = class RoleModulePermissionRepository extends typeorm_1.Repository {
    dataSource;
    constructor(dataSource) {
        super(role_module_permission_entity_1.RoleModulePermission, dataSource.createEntityManager());
        this.dataSource = dataSource;
    }
    async findByRolesAndTenant(roleIds, tenantId, manager) {
        const repository = manager?.getRepository(role_module_permission_entity_1.RoleModulePermission) || this;
        try {
            const permissions = await repository.find({
                where: {
                    id_role: (0, typeorm_1.In)(roleIds),
                    tenant_id: tenantId
                },
                relations: ['module']
            });
            return permissions;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error en la base de datos', { cause: error.message });
        }
    }
    async findByRoleAndModuleAndTenant(roleId, moduleId, tenantId, manager) {
        const repository = manager?.getRepository(role_module_permission_entity_1.RoleModulePermission) || this;
        try {
            const permission = await repository.findOne({
                where: {
                    tenant_id: tenantId,
                    id_role: roleId,
                    id_module: moduleId
                }
            });
            return permission;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error in data base', { cause: error.message });
        }
    }
    async createRoleModulePermission(tenantId, createPermissionDto, manager) {
        const repository = manager?.getRepository(role_module_permission_entity_1.RoleModulePermission) || this;
        try {
            const permission = repository.create({
                tenant_id: tenantId,
                id_role: createPermissionDto.roleId,
                id_module: createPermissionDto.moduleId,
                can_create: createPermissionDto.can_create,
                can_read: createPermissionDto.can_read,
                can_update: createPermissionDto.can_update,
                can_delete: createPermissionDto.can_delete,
                can_list: createPermissionDto.can_list
            });
            return repository.save(permission);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error in data base', { cause: error.message });
        }
    }
    async createRoleModulePermissions(tenantId, createPermissionDtos, manager) {
        const repository = manager?.getRepository(role_module_permission_entity_1.RoleModulePermission) || this;
        try {
            const permissions = createPermissionDtos.map(dto => repository.create({
                tenant_id: tenantId,
                id_role: dto.roleId,
                id_module: dto.moduleId,
                can_create: dto.can_create,
                can_read: dto.can_read,
                can_update: dto.can_update,
                can_delete: dto.can_delete,
                can_list: dto.can_list
            }));
            return repository.save(permissions);
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Error in data base', { cause: error.message });
        }
    }
    async updateRoleModulePermission(permission, updatePermissionDto, manager) {
        const repository = manager?.getRepository(role_module_permission_entity_1.RoleModulePermission) || this;
        this.merge(permission, updatePermissionDto);
        return repository.save(permission);
    }
    async deleteRoleModulePermission(roleId, moduleId, tenantId, manager) {
        const repository = manager?.getRepository(role_module_permission_entity_1.RoleModulePermission) || this;
        const result = await repository.delete({
            id_role: roleId,
            tenant_id: tenantId,
            id_module: moduleId
        });
        return result;
    }
    async findByRoleAndTenant(roleId, tenantId, manager) {
        const repository = manager?.getRepository(role_module_permission_entity_1.RoleModulePermission) || this;
        return repository.find({
            where: {
                id_role: roleId,
                tenant_id: tenantId
            },
            relations: ['module']
        });
    }
};
exports.RoleModulePermissionRepository = RoleModulePermissionRepository;
exports.RoleModulePermissionRepository = RoleModulePermissionRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], RoleModulePermissionRepository);
//# sourceMappingURL=role-module-permission.repository.js.map