import { Repository, EntityManager } from 'typeorm';
import { CattleDeviceHistory } from '../entities/cattle-device-history.entity';
export declare class CattleDeviceHistoryRepository {
    private readonly repo;
    constructor(repo: Repository<CattleDeviceHistory>);
    create(entity: CattleDeviceHistory): Promise<CattleDeviceHistory>;
    createWithManager(manager: EntityManager, entity: CattleDeviceHistory): Promise<CattleDeviceHistory>;
    findByCattle(idTenant: string, idCattle: string): Promise<CattleDeviceHistory[]>;
    findOneById(idTenant: string, id: string): Promise<CattleDeviceHistory | null>;
    update(entity: CattleDeviceHistory): Promise<CattleDeviceHistory>;
    updateWithManager(manager: EntityManager, entity: CattleDeviceHistory): Promise<CattleDeviceHistory>;
    deleteById(idTenant: string, id: string): Promise<void>;
    deleteByIdWithManager(idTenant: string, id: string, manager: EntityManager): Promise<void>;
    assignDeviceToCattle(idDevice: string, idCattle: string, idTenant: string, assignedBy?: string, assignedAt?: Date, idMassiveEvent?: string, manager?: EntityManager): Promise<CattleDeviceHistory>;
    unassignDeviceByidDevice(idTenant: string, idDevice: string, manager?: EntityManager, unassignedAt?: Date): Promise<void>;
    unassignDeviceByidCattle(idTenant: string, idCattle: string, manager?: EntityManager, unassignedAt?: Date): Promise<void>;
}
