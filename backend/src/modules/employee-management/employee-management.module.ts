import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantsController } from './controllers/tenants.controller';
import { RolesController } from './controllers/roles.controller';
import { UsersController } from './controllers/users.controller';
import { TenantsService } from './services/tenants.service';
import { RoleService } from './services/roles.service';
import { UsersService } from './services/users.service';
import { ModulesService } from './services/modules.service';
import { Tenant } from './entities/tenant.entity';
import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { RoleModulePermission } from './entities/role-module-permission.entity';
import { ModuleEntity } from './entities/module.entity';
import { UserRepository } from './repositories/user.repository';
import { RoleModulePermissionRepository } from './repositories/role-module-permission.repository';
import { RoleModulePermissionService } from './services/role-module-permission.services';
import { ApplicationPermissionsModule } from '../../common/application-permissions/application-permissions.module';
import { RoleRepository } from './repositories/role.repository';
import { ConfigurationModule } from '../configurations/configuration.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Tenant,
      Role,
      User,
      RoleModulePermission,
      ModuleEntity,
    ]),
    ApplicationPermissionsModule,
    ConfigurationModule,
  ],
  controllers: [TenantsController, RolesController, UsersController],
  providers: [
    TenantsService,
    RoleService,
    UsersService,
    ModulesService,
    RoleModulePermissionService,
    UserRepository,
    RoleModulePermissionRepository,
    RoleRepository,
  ],
  exports: [
    UsersService,
    RoleService,
    ModulesService,
    TenantsService,
    RoleModulePermissionService,
  ],
})
export class EmployeeManagementModule {}
