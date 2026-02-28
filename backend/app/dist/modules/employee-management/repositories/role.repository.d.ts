import { DataSource, EntityManager } from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Role } from '../entities/role.entity';
export declare class RoleRepository extends Repository<Role> {
    private dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    findAllByTenantID(tenantId: string, manager?: EntityManager): Promise<Role[]>;
    findById(id: string): Promise<Role | null>;
    findByCode(code: string): Promise<Role | null>;
}
