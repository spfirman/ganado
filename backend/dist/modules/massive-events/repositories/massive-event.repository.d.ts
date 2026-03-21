import { DataSource, EntityManager } from 'typeorm';
import { MassiveEvent } from '../entities/massive-events.entity';
export declare class MassiveEventRepository {
    private readonly dataSource;
    private readonly logger;
    private readonly repository;
    constructor(dataSource: DataSource);
    createInstance(data: Partial<MassiveEvent>): MassiveEvent;
    save(entity: MassiveEvent): Promise<MassiveEvent>;
    saveWithManager(manager: EntityManager, entity: Partial<MassiveEvent>): Promise<MassiveEvent>;
    updateByIdWithManager(manager: EntityManager, id: string, idTenant: string, data: Partial<MassiveEvent>): Promise<void>;
    findById(idTenant: string, id: string, manager?: EntityManager): Promise<MassiveEvent | null>;
    findOneWithSimpleEvents(idTenant: string, idMassiveEvent: string, manager?: EntityManager): Promise<MassiveEvent | null>;
    findAllByTenant(idTenant: string): Promise<MassiveEvent[]>;
    deleteById(id: string, idTenant: string): Promise<void>;
    deleteByIdWithManager(manager: EntityManager, id: string, idTenant: string): Promise<void>;
}
