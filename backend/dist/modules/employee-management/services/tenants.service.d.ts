import { Repository } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { RoleService } from './roles.service';
import { UsersService } from './users.service';
import { ModulesService } from './modules.service';
import { RoleModulePermissionService } from './role-module-permission.services';
import { DataSource } from 'typeorm';
import { ConfigurationsService } from 'src/modules/configurations/services/configurations.service';
export declare class TenantsService {
    private readonly dataSource;
    private readonly tenantRepository;
    private readonly rolesService;
    private readonly RoleModulePermissionService;
    private readonly usersService;
    private readonly modulesService;
    private readonly configurationsService;
    constructor(dataSource: DataSource, tenantRepository: Repository<Tenant>, rolesService: RoleService, RoleModulePermissionService: RoleModulePermissionService, usersService: UsersService, modulesService: ModulesService, configurationsService: ConfigurationsService);
    create(createTenantDto: CreateTenantDto): Promise<Tenant>;
    findAll(): Promise<Tenant[]>;
    findOne(id: string): Promise<Tenant>;
    update(id: string, updateTenantDto: Partial<CreateTenantDto>): Promise<Tenant>;
    findByCompanyUsername(company_username: string): Promise<Tenant>;
}
