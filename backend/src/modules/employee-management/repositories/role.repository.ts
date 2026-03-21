import { DataSource, EntityManager } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Role } from '../entities/role.entity';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class RoleRepository extends Repository<Role> {
  private readonly logger = new Logger(RoleRepository.name);

  constructor(private dataSource: DataSource) {
    super(Role, dataSource.createEntityManager());
  }

  async findAllByTenantID(
    tenantId: string,
    manager?: EntityManager,
  ): Promise<Role[]> {
    const repo = manager?.getRepository(Role) ?? this.dataSource.getRepository(Role);
    try {
      const query = repo
        .createQueryBuilder('role')
        .leftJoinAndSelect(
          'role.permissions',
          'permissions',
          'permissions.tenant_id = :tenantId',
          { tenantId },
        )
        .leftJoinAndSelect('permissions.module', 'module')
        .where(
          '(permissions.tenant_id = :tenantId OR permissions.id IS NULL)',
          { tenantId: tenantId },
        );
      const roles = await query.getMany();
      this.logger.debug('Roles encontrados:', roles.length);
      return roles;
    } catch (error) {
      this.logger.error('Error searching roles by tenantId:', error);
      throw new InternalServerErrorException('Error searching roles');
    }
  }

  async findById(id: string): Promise<Role | null> {
    try {
      return await this.findOne({
        where: { id },
        relations: ['permissions', 'permissions.module'],
      });
    } catch (error) {
      this.logger.error(`Error searching role by ID ${id}:`, error);
      throw new InternalServerErrorException('Error searching role');
    }
  }

  async findByCode(code: string): Promise<Role | null> {
    try {
      return await this.findOne({
        where: { code },
        relations: ['permissions', 'permissions.module'],
      });
    } catch (error) {
      this.logger.error(`Error searching role by code ${code}:`, error);
      throw new InternalServerErrorException('Error searching role');
    }
  }
}
