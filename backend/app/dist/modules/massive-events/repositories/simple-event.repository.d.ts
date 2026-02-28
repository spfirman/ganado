import { DataSource, EntityManager } from 'typeorm';
import { SimpleEvent } from '../entities/simple-event.entity';
import { UpdateSimpleEventDto } from '../dto/update-simple-events.dto';
export declare class SimpleEventRepository {
    private readonly dataSource;
    private readonly logger;
    private readonly repository;
    constructor(dataSource: DataSource);
    createInstance(data: Partial<SimpleEvent>): SimpleEvent;
    save(entity: SimpleEvent): Promise<SimpleEvent>;
    saveWithManager(manager: EntityManager, entity: SimpleEvent): Promise<SimpleEvent>;
    findById(idTenant: string, id: string, manager?: EntityManager): Promise<SimpleEvent | null>;
    findByMassiveEvent(idTenant: string, idMassiveEvent: string, manager?: EntityManager): Promise<SimpleEvent[]>;
    deleteById(id: string): Promise<void>;
    deleteByIdWithManager(manager: EntityManager, id: string): Promise<void>;
    deleteByMassiveEvent(manager: EntityManager, idMassiveEvent: string): Promise<void>;
    deleteUnappliedByMassiveEvent(manager: EntityManager, idTenant: string, idMassiveEvent: string): Promise<number>;
    findByIds(idTenant: string, ids: string[], manager?: EntityManager): Promise<SimpleEvent[]>;
    updateSimpleEvent(id: string, dto: UpdateSimpleEventDto, manager: EntityManager): Promise<SimpleEvent>;
}
