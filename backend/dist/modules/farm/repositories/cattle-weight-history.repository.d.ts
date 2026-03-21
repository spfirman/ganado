import { Repository, EntityManager } from 'typeorm';
import { CattleWeightHistory, WeightContext } from '../entities/cattle-weight-history.entity';
export declare class CattleWeightHistoryRepository {
    private readonly repo;
    private readonly logger;
    constructor(repo: Repository<CattleWeightHistory>);
    create(entity: Partial<CattleWeightHistory>, manager?: EntityManager): Promise<CattleWeightHistory>;
    createWithManager(manager: EntityManager, entity: Partial<CattleWeightHistory>): Promise<CattleWeightHistory>;
    findByCattle(idTenant: string, idCattle: string, manager?: EntityManager, context?: WeightContext): Promise<CattleWeightHistory[]>;
    findLastByCattle(idTenant: string, idCattle: string, manager?: EntityManager): Promise<CattleWeightHistory | null>;
    findOneById(idTenant: string, id: string): Promise<CattleWeightHistory | null>;
    update(entity: CattleWeightHistory, manager?: EntityManager): Promise<CattleWeightHistory>;
    updateWithManager(manager: EntityManager, entity: CattleWeightHistory): Promise<CattleWeightHistory>;
    deleteById(idTenant: string, id: string): Promise<void>;
    deleteByIdWithManager(idTenant: string, id: string, manager: EntityManager): Promise<void>;
}
