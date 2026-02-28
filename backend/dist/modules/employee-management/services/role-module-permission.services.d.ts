import { RoleModulePermissionRepository } from "../repositories/role-module-permission.repository";
import { RoleModulePermission } from "../entities/role-module-permission.entity";
import { CreatePermissionDto } from "../dto/create-permission.dto";
import { UpdatePermissionDto } from "../dto/update-permission.dto";
import { RoleReadPermissionDto } from "../dto/role-read-permission.dto";
import { EntityManager } from "typeorm";
export declare class RoleModulePermissionService {
    private readonly roleModulePermissionRepository;
    private readonly logger;
    constructor(roleModulePermissionRepository: RoleModulePermissionRepository);
    getByRolesAndTenant(roleIds: string[], tenantId: string): Promise<RoleModulePermission[]>;
    createPermission(tenantId: string, permissionDto: CreatePermissionDto, manager?: EntityManager): Promise<RoleModulePermission>;
    createPermissions(tenantId: string, permissionDtos: CreatePermissionDto[], manager?: EntityManager): Promise<RoleModulePermission[]>;
    updatePermission(roleId: string, tenantId: string, moduleId: string, permissionDto: UpdatePermissionDto, manager?: EntityManager): Promise<RoleModulePermission>;
    deletePermission(roleId: string, tenantId: string, moduleId: string, manager?: EntityManager): Promise<void>;
    listPermissions(roleId: string, tenantId: string, manager?: EntityManager): Promise<RoleReadPermissionDto[]>;
}
