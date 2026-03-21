import { Repository, EntityManager } from 'typeorm';
import { Cattle, CattleStatus } from '../entities/cattle.entity';
export declare class CattleRepository {
    private readonly repository;
    constructor(repository: Repository<Cattle>);
    create(cattleDto: Partial<Cattle>, manager?: EntityManager): Promise<Cattle>;
    save(cattle: Cattle): Promise<Cattle>;
    saveWithManager(manager: EntityManager, cattle: Cattle): Promise<Cattle>;
    findOne(idTenant: string, id: string, manager?: EntityManager): Promise<Cattle | null>;
    findOneWithManager(manager: EntityManager, idTenant: string, id: string): Promise<Cattle | null>;
    unsetDevice(idTenant: string, idDevice: string, manager?: EntityManager): Promise<void>;
    findById(idTenant: string, id: string, manager?: EntityManager): Promise<Cattle | null>;
    findByIds(idTenant: string, ids: string[]): Promise<Cattle[]>;
    findByIdPurchaseWithoutLot(idTenant: string, idPurchase: string, manager?: EntityManager): Promise<Cattle[]>;
    findByIdLot(idTenant: string, idLot: string, manager?: EntityManager): Promise<Cattle[]>;
    findAll(idTenant: string): Promise<Cattle[]>;
    update(idTenant: string, id: string, cattleDto: any, manager?: EntityManager): Promise<Cattle | null>;
    delete(idTenant: string, id: string): Promise<void>;
    findBySysNumberAndTenantId(idTenant: string, sysNumber: string, manager?: EntityManager): Promise<Cattle | null>;
    findByNumberAndTenantId(idTenant: string, number: string, manager?: EntityManager): Promise<Cattle | null>;
    findOneForUpdateByNumber(idTenant: string, number: string, manager: EntityManager): Promise<Cattle | null>;
    findByAnyEartag(idTenant: string, eartag: string, manager?: EntityManager): Promise<Cattle | null>;
    getBasicInfo(idTenant: string, manager?: EntityManager): Promise<Cattle[]>;
    listPaged(idTenant: string, query: any, page: number, limit: number, manager?: EntityManager): Promise<{
        rows: Cattle[];
        total: number;
    }>;
    getBasicInfoPaged(input: {
        idTenant: string;
        limit: number;
        cursor?: string;
        updatedAfter?: Date;
    }): Promise<{
        items: {
            idTenant: string;
            id: string;
            number: string;
            sysNumber: string;
        }[];
        nextCursor: string;
        hasMore: boolean;
        total: any;
    }>;
    nextCandidateCattleNumber(number: string): string;
    getSuggestNextNumber(idTenant: string, number: string, manager?: EntityManager): Promise<string>;
    lockForTenant(tenantId: string, manager?: EntityManager): Promise<void>;
    search(idTenant: string, query: string, statuses: CattleStatus[], manager?: EntityManager): Promise<Cattle[]>;
}
