import { DataSource, EntityManager } from 'typeorm';
import { Lot } from '../entities/lot.entity';
export declare class LotRepository {
    private dataSource;
    private readonly logger;
    private readonly repository;
    constructor(dataSource: DataSource);
    createInstance(data: Partial<Lot>): Lot;
    save(lot: Lot): Promise<Lot>;
    saveWithManager(manager: EntityManager, lot: Lot): Promise<Lot>;
    deleteByPurchaseId(idPurchase: string, idTenant: string): Promise<void>;
    deleteByPurchaseIdWithManager(manager: EntityManager, idPurchase: string, idTenant: string): Promise<void>;
    findByPurchaseId(idPurchase: string, idTenant: string, manager?: EntityManager): Promise<Lot[]>;
    findById(idTenant: string, id: string, manager?: EntityManager): Promise<Lot | null>;
}
