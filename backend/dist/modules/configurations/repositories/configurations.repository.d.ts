import { Configuration } from '../entities/configuration.entity';
import { Repository, EntityManager } from 'typeorm';
export declare class ConfigurationsRepository {
    private readonly repository;
    constructor(repository: Repository<Configuration>);
    createTenantDefaults(idTenant: string, manager?: EntityManager): Promise<Configuration[]>;
    create(idTenant: string, configuration: Partial<Configuration>, manager?: EntityManager): Promise<Configuration>;
    update(idTenant: string, id: string, configuration: Partial<Configuration>, manager?: EntityManager): Promise<Configuration>;
    updateTenantConfiguration(idTenant: string, code: string, value: string, manager?: EntityManager): Promise<void>;
    delete(idTenant: string, id: string, manager?: EntityManager): Promise<void>;
    findOneByCode(idTenant: string, code: string, manager?: EntityManager): Promise<Configuration | null>;
    findAll(idTenant: string, manager?: EntityManager): Promise<Configuration[]>;
}
