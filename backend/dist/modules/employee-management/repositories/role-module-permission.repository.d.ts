import { DataSource, DeleteResult, EntityManager, Repository } from 'typeorm';
import { RoleModulePermission } from '../entities/role-module-permission.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
export declare class RoleModulePermissionRepository extends Repository<RoleModulePermission> {
    private dataSource;
    constructor(dataSource: DataSource);
    findByRolesAndTenant(roleIds: string[], tenantId: string, manager?: EntityManager): Promise<RoleModulePermission[]>;
    findByRoleAndModuleAndTenant(roleId: string, moduleId: string, tenantId: string, manager?: EntityManager): Promise<RoleModulePermission | null>;
    createRoleModulePermission(tenantId: string, createPermissionDto: CreatePermissionDto, manager?: EntityManager): Promise<RoleModulePermission>;
    createRoleModulePermissions(tenantId: string, createPermissionDtos: CreatePermissionDto[], manager?: EntityManager): Promise<RoleModulePermission[]>;
    updateRoleModulePermission(permission: RoleModulePermission, updatePermissionDto: UpdatePermissionDto, manager?: EntityManager): Promise<RoleModulePermission>;
    deleteRoleModulePermission(roleId: string, moduleId: string, tenantId: string, manager?: EntityManager): Promise<DeleteResult>;
    findByRoleAndTenant(roleId: string, tenantId: string, manager?: EntityManager): Promise<RoleModulePermission[]>;
}
