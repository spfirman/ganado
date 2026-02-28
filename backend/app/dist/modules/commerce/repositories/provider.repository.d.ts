import { Repository } from 'typeorm';
import { Provider } from '../entities/provider.entity';
import { EntityManager } from 'typeorm';
export declare class ProviderRepository {
    private readonly repository;
    constructor(repository: Repository<Provider>);
    createProvider(data: Partial<Provider>): Promise<Provider>;
    findByNit(nit: string, idTenant: string): Promise<Provider | null>;
    findByNitLike(nitFragment: string, idTenant: string): Promise<Provider[]>;
    findById(id: string, idTenant: string, manager?: EntityManager): Promise<Provider | null>;
    findAll(idTenant: string): Promise<Provider[]>;
    findAllWithRelations(idTenant: string): Promise<Provider[]>;
    updateById(id: string, idTenant: string, data: Partial<Provider>): Promise<void>;
    updateByNit(nit: string, idTenant: string, data: Partial<Provider>): Promise<void>;
    deleteById(id: string, idTenant: string): Promise<void>;
    deleteByNit(nit: string, idTenant: string): Promise<void>;
}
