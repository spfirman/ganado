import { EntityManager } from "typeorm";
import { ConfigurationsRepository } from "../repositories/configurations.repository";
import { Configuration } from "../entities/configuration.entity";
export declare class ConfigurationsService {
    private configurationsRepository;
    constructor(configurationsRepository: ConfigurationsRepository);
    createTenantDefaults(idTenant: string, manager?: EntityManager): Promise<void>;
    getTenantConfiguration(idTenant: string, code: string, manager?: EntityManager): Promise<Configuration | null>;
    updateTenantConfiguration(idTenant: string, code: string, value: string, manager?: EntityManager): Promise<void>;
}
