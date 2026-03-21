import { Repository, EntityManager } from 'typeorm';
import { CattleEartagHistory } from '../entities/cattle-eartag-history.entity';
export declare class CattleEartagHistoryRepository {
    private readonly repo;
    constructor(repo: Repository<CattleEartagHistory>);
    create(entity: Partial<CattleEartagHistory>): Promise<CattleEartagHistory>;
    createWithManager(manager: EntityManager, entity: Partial<CattleEartagHistory>): Promise<CattleEartagHistory>;
    findByCattle(idTenant: string, idCattle: string): Promise<CattleEartagHistory[]>;
    findOneById(idTenant: string, id: string): Promise<CattleEartagHistory | null>;
    update(entity: CattleEartagHistory): Promise<CattleEartagHistory>;
    updateWithManager(manager: EntityManager, entity: CattleEartagHistory): Promise<CattleEartagHistory>;
    deleteById(idTenant: string, id: string): Promise<void>;
    deleteByIdWithManager(idTenant: string, id: string, manager: EntityManager): Promise<void>;
}
