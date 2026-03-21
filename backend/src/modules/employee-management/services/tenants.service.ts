import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import { Tenant } from '../entities/tenant.entity';
import { RoleService } from './roles.service';
import { UsersService } from './users.service';
import { ModulesService } from './modules.service';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { RoleModulePermissionService } from './role-module-permission.services';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { ConfigurationsService } from '../../configurations/services/configurations.service';

@Injectable()
export class TenantsService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    private readonly rolesService: RoleService,
    private readonly RoleModulePermissionService: RoleModulePermissionService,
    private readonly usersService: UsersService,
    private readonly modulesService: ModulesService,
    private readonly configurationsService: ConfigurationsService,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      console.log('createTenantDto', createTenantDto);

      const tenantRepo = manager.getRepository(Tenant);
      const existingTenant = await tenantRepo.findOne({
        where: {
          name: createTenantDto.name,
          company_username: createTenantDto.company_username,
        },
      });

      if (existingTenant) {
        throw new ConflictException(
          'Ya existe un tenant con ese nombre o username de compania',
        );
      }

      const tenant = tenantRepo.create(createTenantDto);
      await tenantRepo.save(tenant);

      const adminUser = await this.usersService.createAdminUser(
        {
          username: createTenantDto.admin_username,
          password: createTenantDto.admin_password,
          email: createTenantDto.admin_email,
          firstName: createTenantDto.admin_first_name,
          lastName: createTenantDto.admin_last_name,
          tenantId: tenant.id,
        },
        manager,
      );

      const allModules = await this.modulesService.findAll(manager);
      const roles = await this.rolesService.findAll(tenant.id, manager);
      const permissionsToCreate: CreatePermissionDto[] = [];

      for (const role of roles) {
        for (const module of allModules) {
          switch (role.code) {
            case 'SYS_ADMIN':
              const sysAdminPermission = new CreatePermissionDto();
              sysAdminPermission.moduleId = module.id;
              sysAdminPermission.roleId = role.id;
              sysAdminPermission.can_create = true;
              sysAdminPermission.can_read = true;
              sysAdminPermission.can_update = true;
              sysAdminPermission.can_delete = true;
              sysAdminPermission.can_list = true;
              permissionsToCreate.push(sysAdminPermission);
              break;

            case 'MANAGER':
              if (
                module.code == 'EMP_MGMT' ||
                module.code == 'COMMERCE'
              ) {
                const managerPermission = new CreatePermissionDto();
                managerPermission.moduleId = module.id;
                managerPermission.roleId = role.id;
                managerPermission.can_create = true;
                managerPermission.can_read = true;
                managerPermission.can_update = true;
                managerPermission.can_delete = true;
                managerPermission.can_list = true;
                permissionsToCreate.push(managerPermission);
              }
              break;

            case 'ACCOUNTANT':
              if (module.code == 'COMMERCE') {
                const accountantPermission = new CreatePermissionDto();
                accountantPermission.moduleId = module.id;
                accountantPermission.roleId = role.id;
                accountantPermission.can_create = true;
                accountantPermission.can_read = true;
                accountantPermission.can_update = true;
                accountantPermission.can_delete = true;
                accountantPermission.can_list = true;
                permissionsToCreate.push(accountantPermission);
              }
              break;

            case 'FARM_WORKER':
              if (
                module.code == 'MASSIVE_EVENTS' ||
                module.code == 'FARM' ||
                module.code == 'RECEPTION' ||
                module.code == 'PROD_CENTER'
              ) {
                const workerPermission = new CreatePermissionDto();
                workerPermission.moduleId = module.id;
                workerPermission.roleId = role.id;
                workerPermission.can_create = true;
                workerPermission.can_read = true;
                workerPermission.can_update = true;
                workerPermission.can_delete = true;
                workerPermission.can_list = true;
                permissionsToCreate.push(workerPermission);
              }
              if (module.code == 'COMMERCE') {
                const workerCommercePermission = new CreatePermissionDto();
                workerCommercePermission.moduleId = module.id;
                workerCommercePermission.roleId = role.id;
                workerCommercePermission.can_create = false;
                workerCommercePermission.can_read = true;
                workerCommercePermission.can_update = false;
                workerCommercePermission.can_delete = false;
                workerCommercePermission.can_list = true;
                permissionsToCreate.push(workerCommercePermission);
              }
              break;

            default:
              break;
          }
        }
      }

      if (permissionsToCreate.length > 0) {
        await this.RoleModulePermissionService.createPermissions(
          tenant.id,
          permissionsToCreate,
          manager,
        );
      }

      await this.configurationsService.createTenantDefaults(
        tenant.id,
        manager,
      );

      return tenant;
    });
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: Partial<Tenant>): Promise<Tenant> {
    const tenant = await this.findOne(id);
    this.tenantRepository.merge(tenant, updateTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async findByCompanyUsername(company_username: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { company_username },
    });
    if (!tenant) {
      throw new NotFoundException(
        `Tenant with company_username ${company_username} not found`,
      );
    }
    return tenant;
  }
}
