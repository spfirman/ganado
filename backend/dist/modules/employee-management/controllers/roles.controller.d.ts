import { RoleService } from '../services/roles.service';
import { RoleModulePermission } from '../entities/role-module-permission.entity';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { RoleModulePermissionService } from '../services/role-module-permission.services';
import { RoleReadDto } from '../dto/role-read.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
export declare class RolesController {
    private readonly roleService;
    private readonly roleModulePermissionService;
    private readonly logger;
    constructor(roleService: RoleService, roleModulePermissionService: RoleModulePermissionService);
    findAll(requestUser: SessionUserDto): Promise<RoleReadDto[]>;
    findOne(id: string): Promise<RoleReadDto>;
    createPermission(requestUser: SessionUserDto, createPermissionDto: CreatePermissionDto): Promise<RoleModulePermission>;
    updatePermission(sessionUser: SessionUserDto, roleId: string, moduleId: string, updatePermissionDto: UpdatePermissionDto): Promise<RoleModulePermission>;
    removePermission(sessionUser: SessionUserDto, roleId: string, moduleId: string): Promise<{
        message: string;
        roleId: string;
        moduleId: string;
    }>;
    listPermissions(sessionUser: SessionUserDto, roleId: string): Promise<RoleModulePermission[]>;
}
