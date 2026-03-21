import { Configuration } from '../entities/configuration.entity';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigurationsRepository {
  constructor(
    @InjectRepository(Configuration)
    private readonly repository: Repository<Configuration>,
  ) {}

  async createTenantDefaults(idTenant: string, manager?: EntityManager): Promise<Configuration[]> {
    const configurationRepository = manager?.getRepository(Configuration) || this.repository;
    const configurations: Configuration[] = [];

    const nextCattleSysNumberConfig = new Configuration();
    nextCattleSysNumberConfig.idTenant = idTenant;
    nextCattleSysNumberConfig.code = 'next_cattle_sysnumber';
    nextCattleSysNumberConfig.isSystemConfig = true;
    nextCattleSysNumberConfig.name = 'Next Cattle SysNumber';
    nextCattleSysNumberConfig.value = '1';
    nextCattleSysNumberConfig.valueType = 'number';
    nextCattleSysNumberConfig.description = 'Next sysnumber assignment for new cattle';
    configurations.push(nextCattleSysNumberConfig);

    const averageDailyGainConfig = new Configuration();
    averageDailyGainConfig.idTenant = idTenant;
    averageDailyGainConfig.code = 'average_daily_gain';
    averageDailyGainConfig.isSystemConfig = true;
    averageDailyGainConfig.name = 'Average Daily Gain (kg)';
    averageDailyGainConfig.value = '0.462';
    averageDailyGainConfig.valueType = 'number';
    averageDailyGainConfig.description = 'Average daily gain  in kg for new cattle';
    configurations.push(averageDailyGainConfig);

    return configurationRepository.save(configurations);
  }

  async create(idTenant: string, configuration: Partial<Configuration>, manager?: EntityManager): Promise<Configuration> {
    const configurationRepository = manager?.getRepository(Configuration) || this.repository;
    return configurationRepository.save({ ...configuration, idTenant });
  }

  async update(idTenant: string, id: string, configuration: Partial<Configuration>, manager?: EntityManager): Promise<Configuration> {
    const configurationRepository = manager?.getRepository(Configuration) || this.repository;
    return configurationRepository.save({ ...configuration, idTenant, id });
  }

  async updateTenantConfiguration(idTenant: string, code: string, value: string, manager?: EntityManager): Promise<void> {
    const configurationRepository = manager?.getRepository(Configuration) || this.repository;
    await configurationRepository.update({ idTenant, code }, { value });
  }

  async delete(idTenant: string, id: string, manager?: EntityManager): Promise<void> {
    const configurationRepository = manager?.getRepository(Configuration) || this.repository;
    await configurationRepository.delete({ idTenant, id });
  }

  async findOneByCode(idTenant: string, code: string, manager?: EntityManager): Promise<Configuration | null> {
    const configurationRepository = manager?.getRepository(Configuration) || this.repository;
    return configurationRepository.findOne({ where: { idTenant, code } });
  }

  async findAll(idTenant: string, manager?: EntityManager): Promise<Configuration[]> {
    const configurationRepository = manager?.getRepository(Configuration) || this.repository;
    return configurationRepository.find({ where: { idTenant } });
  }
}
