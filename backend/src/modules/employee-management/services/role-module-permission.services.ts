import {
  Injectable,
  Logger,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RoleModulePermissionRepository } from '../repositories/role-module-permission.repository';
import { RoleModulePermission } from '../entities/role-module-permission.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { EntityManager, DeleteResult } from 'typeorm';

@Injectable()
export class RoleModulePermissionService {
  private readonly logger = new Logger(RoleModulePermissionService.name);

  constructor(
    private readonly roleModulePermissionRepository: RoleModulePermissionRepository,
  ) {}

  async getByRolesAndTenant(
    roleIds: string[],
    tenantId: string,
  ): Promise<RoleModulePermission[]> {
    const roleModulePermissions =
      await this.roleModulePermissionRepository.findByRolesAndTenant(
        roleIds,
        tenantId,
      );
    return roleModulePermissions;
  }

  async createPermission(
    tenantId: string,
    permissionDto: CreatePermissionDto,
    manager?: EntityManager,
  ): Promise<RoleModulePermission> {
    const existingPermission =
      await this.roleModulePermissionRepository.findByRoleAndModuleAndTenant(
        tenantId,
        permissionDto.roleId,
        permissionDto.moduleId,
        manager,
      );

    if (existingPermission) {
      throw new ConflictException(
        'The permission exist for this role and module',
      );
    }

    return this.roleModulePermissionRepository.createRoleModulePermission(
      tenantId,
      permissionDto,
      manager,
    );
  }

  async createPermissions(
    tenantId: string,
    permissionDtos: CreatePermissionDto[],
    manager?: EntityManager,
  ): Promise<RoleModulePermission[]> {
    return this.roleModulePermissionRepository.createRoleModulePermissions(
      tenantId,
      permissionDtos,
      manager,
    );
  }

  async updatePermission(
    roleId: string,
    tenantId: string,
    moduleId: string,
    permissionDto: UpdatePermissionDto,
    manager?: EntityManager,
  ): Promise<RoleModulePermission> {
    const permission =
      await this.roleModulePermissionRepository.findByRoleAndModuleAndTenant(
        roleId,
        moduleId,
        tenantId,
        manager,
      );

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    this.logger.debug(
      '********************************************************',
    );
    this.logger.debug(permission);
    this.logger.debug(permissionDto);

    const permissionUpdated =
      await this.roleModulePermissionRepository.updateRoleModulePermission(
        permission,
        permissionDto,
      );

    this.logger.debug(permissionUpdated);
    return permissionUpdated;
  }

  async deletePermission(
    roleId: string,
    tenantId: string,
    moduleId: string,
    manager?: EntityManager,
  ): Promise<void> {
    const deleteResult =
      await this.roleModulePermissionRepository.deleteRoleModulePermission(
        roleId,
        moduleId,
        tenantId,
        manager,
      );
    if (deleteResult.affected === 0) {
      throw new NotFoundException('Permission not found');
    }
    return;
  }

  async listPermissions(
    roleId: string,
    tenantId: string,
    manager?: EntityManager,
  ): Promise<RoleModulePermission[]> {
    const permissions =
      await this.roleModulePermissionRepository.findByRoleAndTenant(
        roleId,
        tenantId,
        manager,
      );
    return permissions;
  }
}
