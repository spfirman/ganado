import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { ModuleEntity } from '../entities/module.entity';
import { ApiOperation } from '@nestjs/swagger';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(ModuleEntity)
    private moduleRepository: Repository<ModuleEntity>,
  ) {}

  @ApiOperation({ summary: 'Obtener todos los modulos' })
  async findAll(manager?: EntityManager): Promise<ModuleEntity[]> {
    const moduleRepo = manager
      ? manager.getRepository(ModuleEntity)
      : this.moduleRepository;
    return moduleRepo.find();
  }

  @ApiOperation({ summary: 'Buscar un modulo por nombre' })
  async findByName(
    name: string,
    manager?: EntityManager,
  ): Promise<ModuleEntity> {
    const moduleRepo = manager
      ? manager.getRepository(ModuleEntity)
      : this.moduleRepository;
    const module = await moduleRepo.findOne({
      where: { name },
    });
    if (!module) {
      throw new NotFoundException(`Module "${name}" not found`);
    }
    return module;
  }

  @ApiOperation({ summary: 'Buscar un modulo por ID' })
  async findById(
    id: string,
    manager?: EntityManager,
  ): Promise<ModuleEntity> {
    const moduleRepo = manager
      ? manager.getRepository(ModuleEntity)
      : this.moduleRepository;
    const module = await moduleRepo.findOne({
      where: { id },
    });
    if (!module) {
      throw new NotFoundException(`Module with ID "${id}" not found`);
    }
    return module;
  }
}
