import { ConfigurationsRepository } from '../repositories/configurations.repository';
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Configuration } from '../entities/configuration.entity';

@Injectable()
export class ConfigurationsService {
  constructor(
    private readonly configurationsRepository: ConfigurationsRepository,
  ) {}

  async createTenantDefaults(idTenant: string, manager?: EntityManager): Promise<void> {
    this.configurationsRepository.createTenantDefaults(idTenant, manager);
  }

  async getTenantConfiguration(idTenant: string, code: string, manager?: EntityManager): Promise<Configuration | null> {
    return this.configurationsRepository.findOneByCode(idTenant, code, manager);
  }

  async updateTenantConfiguration(idTenant: string, code: string, value: string, manager?: EntityManager): Promise<void> {
    this.configurationsRepository.updateTenantConfiguration(idTenant, code, value, manager);
  }
}
