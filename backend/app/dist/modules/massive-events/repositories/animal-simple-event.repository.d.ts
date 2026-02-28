import { DataSource, EntityManager } from 'typeorm';
import { AnimalSimpleEvent } from '../entities/animal-simple-event.entity';
export declare class AnimalSimpleEventRepository {
    private readonly dataSource;
    private readonly logger;
    private readonly repository;
    constructor(dataSource: DataSource);
    createInstance(data: Partial<AnimalSimpleEvent>): AnimalSimpleEvent;
    saveAnimalSimpleEvent(entity: AnimalSimpleEvent): Promise<AnimalSimpleEvent>;
    saveWithManager(manager: EntityManager, entity: AnimalSimpleEvent): Promise<AnimalSimpleEvent>;
    findById(idTenant: string, id: string): Promise<AnimalSimpleEvent | null>;
    findByCattle(idTenant: string, idCattle: string, manager?: EntityManager): Promise<AnimalSimpleEvent[]>;
    findBySimpleEvent(idSimpleEvent: string): Promise<AnimalSimpleEvent[]>;
    findBySimpleEvents(idTenant: string, simpleEventIds: string[]): Promise<AnimalSimpleEvent[]>;
    deleteById(idTenant: string, id: string): Promise<void>;
    deleteByIdWithManager(manager: EntityManager, idTenant: string, id: string): Promise<void>;
    insertMany(rows: Partial<AnimalSimpleEvent>[], manager?: EntityManager): Promise<void>;
}
