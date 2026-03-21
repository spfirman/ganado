import { Repository, EntityManager } from 'typeorm';
import { CattleMedicationHistory } from '../entities/cattle-medication-history.entity';
export declare class CattleMedicationHistoryRepository {
    private readonly repo;
    constructor(repo: Repository<CattleMedicationHistory>);
    create(entity: Partial<CattleMedicationHistory>): Promise<CattleMedicationHistory>;
    createWithManager(manager: EntityManager, entity: Partial<CattleMedicationHistory>): Promise<CattleMedicationHistory>;
    findByCattle(idTenant: string, idCattle: string, manager?: EntityManager): Promise<CattleMedicationHistory[]>;
    findOneById(idTenant: string, id: string): Promise<CattleMedicationHistory | null>;
    update(entity: CattleMedicationHistory): Promise<CattleMedicationHistory>;
    updateWithManager(manager: EntityManager, entity: CattleMedicationHistory): Promise<CattleMedicationHistory>;
    deleteById(idTenant: string, id: string): Promise<void>;
    deleteByIdWithManager(idTenant: string, id: string, manager: EntityManager): Promise<void>;
}
