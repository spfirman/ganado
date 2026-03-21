import { DataSource, EntityManager } from 'typeorm';
import { Purchase } from '../entities/purchase.entity';
import { PurchaseListQueryDto } from '../dto/purchase-list.query.dto';
export declare class PurchaseRepository {
    private readonly dataSource;
    private readonly repository;
    constructor(dataSource: DataSource);
    createInstance(data: Partial<Purchase>): Purchase;
    save(purchase: Purchase): Promise<Purchase>;
    saveWithManager(manager: EntityManager, purchase: Partial<Purchase>): Promise<Purchase>;
    findById(id: string, idTenant: string, manager?: EntityManager): Promise<Purchase | null>;
    deleteById(id: string, idTenant: string): Promise<void>;
    listPaged(tenantId: string, q: PurchaseListQueryDto, page: number, limit: number): Promise<{
        total: number;
        rows: any[];
    }>;
}
