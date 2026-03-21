import { Repository, DataSource, In, DeleteResult, EntityManager } from 'typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { RoleModulePermission } from '../entities/role-module-permission.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';

@Injectable()
export class RoleModulePermissionRepository extends Repository<RoleModulePermission> {
  constructor(private dataSource: DataSource) {
    super(RoleModulePermission, dataSource.createEntityManager());
  }

  async findByRolesAndTenant(
    roleIds: string[],
    tenantId: string,
    manager?: EntityManager,
  ): Promise<RoleModulePermission[]> {
    const repository = manager?.getRepository(RoleModulePermission) || this;
    try {
      const permissions = await repository.find({
        where: {
          id_role: In(roleIds),
          tenant_id: tenantId,
        },
        relations: ['module'],
      });
      return permissions;
    } catch (error) {
      throw new InternalServerErrorException('Error en la base de datos', {
        cause: error.message,
      });
    }
  }

  async findByRoleAndModuleAndTenant(
    roleId: string,
    moduleId: string,
    tenantId: string,
    manager?: EntityManager,
  ): Promise<RoleModulePermission | null> {
    const repository = manager?.getRepository(RoleModulePermission) || this;
    try {
      const permission = await repository.findOne({
        where: {
          tenant_id: tenantId,
          id_role: roleId,
          id_module: moduleId,
        },
      });
      return permission;
    } catch (error) {
      throw new InternalServerErrorException('Error in data base', {
        cause: error.message,
      });
    }
  }

  async createRoleModulePermission(
    tenantId: string,
    createPermissionDto: CreatePermissionDto,
    manager?: EntityManager,
  ): Promise<RoleModulePermission> {
    const repository = manager?.getRepository(RoleModulePermission) || this;
    try {
      const permission = repository.create({
        tenant_id: tenantId,
        id_role: createPermissionDto.roleId,
        id_module: createPermissionDto.moduleId,
        can_create: createPermissionDto.can_create,
        can_read: createPermissionDto.can_read,
        can_update: createPermissionDto.can_update,
        can_delete: createPermissionDto.can_delete,
        can_list: createPermissionDto.can_list,
      });
      return repository.save(permission);
    } catch (error) {
      throw new InternalServerErrorException('Error in data base', {
        cause: error.message,
      });
    }
  }

  async createRoleModulePermissions(
    tenantId: string,
    createPermissionDtos: CreatePermissionDto[],
    manager?: EntityManager,
  ): Promise<RoleModulePermission[]> {
    const repository = manager?.getRepository(RoleModulePermission) || this;
    try {
      const permissions = createPermissionDtos.map((dto) =>
        repository.create({
          tenant_id: tenantId,
          id_role: dto.roleId,
          id_module: dto.moduleId,
          can_create: dto.can_create,
          can_read: dto.can_read,
          can_update: dto.can_update,
          can_delete: dto.can_delete,
          can_list: dto.can_list,
        }),
      );
      return repository.save(permissions);
    } catch (error) {
      throw new InternalServerErrorException('Error in data base', {
        cause: error.message,
      });
    }
  }

  async updateRoleModulePermission(
    permission: RoleModulePermission,
    updatePermissionDto: UpdatePermissionDto,
    manager?: EntityManager,
  ): Promise<RoleModulePermission> {
    const repository = manager?.getRepository(RoleModulePermission) || this;
    this.merge(permission, updatePermissionDto);
    return repository.save(permission);
  }

  async deleteRoleModulePermission(
    roleId: string,
    moduleId: string,
    tenantId: string,
    manager?: EntityManager,
  ): Promise<DeleteResult> {
    const repository = manager?.getRepository(RoleModulePermission) || this;
    const result = await repository.delete({
      id_role: roleId,
      tenant_id: tenantId,
      id_module: moduleId,
    });
    return result;
  }

  async findByRoleAndTenant(
    roleId: string,
    tenantId: string,
    manager?: EntityManager,
  ): Promise<RoleModulePermission[]> {
    const repository = manager?.getRepository(RoleModulePermission) || this;
    return repository.find({
      where: {
        id_role: roleId,
        tenant_id: tenantId,
      },
      relations: ['module'],
    });
  }
}
