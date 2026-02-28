import { Repository, EntityManager } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RoleModulePermission } from '../entities/role-module-permission.entity';
import { ModuleEntity } from '../entities/module.entity';
import { User } from '../entities/user.entity';
import { RoleRepository } from '../repositories/role.repository';
import { RoleReadDto } from '../dto/role-read.dto';
import { RoleModulePermissionService } from './role-module-permission.services';
export declare class RoleService {
    private readonly roleRepository_2;
    private readonly roleRepository;
    private readonly permissionRepository;
    private readonly roleModulePermissionService;
    private readonly moduleRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(roleRepository_2: Repository<Role>, roleRepository: RoleRepository, permissionRepository: Repository<RoleModulePermission>, roleModulePermissionService: RoleModulePermissionService, moduleRepository: Repository<ModuleEntity>, userRepository: Repository<User>);
    findAll(idTenant: string, manager?: EntityManager): Promise<RoleReadDto[]>;
    findOne(id: string): Promise<RoleReadDto>;
    findByCode(code: string, manager?: EntityManager): Promise<Role>;
}
