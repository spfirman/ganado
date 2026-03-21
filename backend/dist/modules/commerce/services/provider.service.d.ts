import { Repository, DataSource } from 'typeorm';
import { ProviderRepository } from '../repositories/provider.repository';
import { Provider } from '../entities/provider.entity';
import { Contact } from '../entities/contact.entity';
export declare class ProviderService {
    private readonly providerRepository;
    private readonly contactRepository;
    private readonly dataSource;
    private readonly logger;
    constructor(providerRepository: ProviderRepository, contactRepository: Repository<Contact>, dataSource: DataSource);
    createProvider(data: {
        name: string;
        nit: string;
        type: string;
        idTenant: string;
        address?: string;
        contactPersonName?: string;
        phone1?: string;
        phone2?: string;
        email?: string;
    }): Promise<Provider>;
    private isValidEmail;
    findByNit(nit: string, idTenant: string): Promise<Provider>;
    searchProvidersByNit(nitFragment: string, idTenant: string): Promise<Provider[]>;
    findById(id: string, idTenant: string): Promise<Provider>;
    findAll(idTenant: string): Promise<Provider[]>;
    searchByName(name: string, idTenant: string): Promise<Provider[]>;
    updateById(id: string, idTenant: string, data: Partial<Provider>): Promise<void>;
    updateByNit(nit: string, idTenant: string, data: Partial<Provider>): Promise<void>;
    deleteById(id: string, idTenant: string): Promise<void>;
    deleteByNit(nit: string, idTenant: string): Promise<void>;
}
