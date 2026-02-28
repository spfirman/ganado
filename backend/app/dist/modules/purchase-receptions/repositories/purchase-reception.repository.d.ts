import { DataSource, EntityManager, Repository } from 'typeorm';
import { PurchaseReception } from '../entities/purchase-reception.entity';
export declare class PurchaseReceptionRepository extends Repository<PurchaseReception> {
    private readonly ds;
    private readonly repository;
    constructor(ds: DataSource);
    findByPurchase(idTenant: string, idPurchase: string, manager?: EntityManager): Promise<PurchaseReception | null>;
    createInstance(data: Partial<PurchaseReception>, manager?: EntityManager): Promise<PurchaseReception>;
    insertUnique(pr: Partial<PurchaseReception>, m: EntityManager): Promise<import("typeorm").InsertResult>;
}
