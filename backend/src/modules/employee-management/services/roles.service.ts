import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RoleModulePermission } from '../entities/role-module-permission.entity';
import { ModuleEntity } from '../entities/module.entity';
import { User } from '../entities/user.entity';
import { RoleRepository } from '../repositories/role.repository';
import { RoleReadDto } from '../dto/role-read.dto';
import { RoleModulePermissionService } from './role-module-permission.services';

@Injectable()
export class RoleService {
  private readonly logger = new Logger(RoleService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository_2: Repository<Role>,
    private readonly roleRepository: RoleRepository,
    @InjectRepository(RoleModulePermission)
    private readonly permissionRepository: Repository<RoleModulePermission>,
    private readonly roleModulePermissionService: RoleModulePermissionService,
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(
    idTenant: string,
    manager?: EntityManager,
  ): Promise<RoleReadDto[]> {
    const roles = await this.roleRepository.findAllByTenantID(
      idTenant,
      manager,
    );
    if (roles.length > 0) {
      const rolesDto = roles.map((role) => RoleReadDto.transformToDto(role));
      return rolesDto;
    } else {
      throw new NotFoundException('No roles found for tenant');
    }
  }

  async findOne(id: string): Promise<RoleReadDto> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }
    return RoleReadDto.transformToDto(role);
  }

  async findByCode(code: string, manager?: EntityManager): Promise<Role> {
    const roleRepo =
      manager?.getRepository(Role) || this.roleRepository;
    const role = await roleRepo.findOne({ where: { code } });
    if (!role) {
      throw new NotFoundException(`Role with code '${code}' not found`);
    }
    return role;
  }
}
