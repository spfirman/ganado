import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './controllers/roles.controller';
import { RoleService } from './services/roles.service';
import { Role } from './entities/role.entity';
import { RoleModulePermission } from './entities/role-module-permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RoleModulePermission]),
  ],
  controllers: [RolesController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RolesModule {}
