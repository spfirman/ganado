import { SimpleEventRepository } from '../repositories/simple-event.repository';
import { DataSource, EntityManager } from 'typeorm';
import { SimpleEvent } from '../entities/simple-event.entity';
import { MassiveEventService } from './massive-event.service';
import { CreateSimpleEventDto } from '../dto/create-simple-event.dto';
import { UpdateSimpleEventDto } from '../dto/update-simple-events.dto';
export declare class SimpleEventService {
    private readonly dataSource;
    private readonly simpleEventRepo;
    private readonly massiveEventSevice;
    constructor(dataSource: DataSource, simpleEventRepo: SimpleEventRepository, massiveEventSevice: MassiveEventService);
    createSimpleEvent12(idTenant: string, dto: CreateSimpleEventDto): Promise<SimpleEvent>;
    saveNewSimpleEvent(manager: EntityManager, payload: any): Promise<SimpleEvent>;
    createSimpleEvent(idTenant: string, dto: CreateSimpleEventDto): Promise<SimpleEvent>;
    syncSimpleEvents(idTenant: string, dtos: any[]): Promise<any[]>;
    findByIdOrFail(idTenant: string, id: string, manager?: EntityManager): Promise<SimpleEvent>;
    findByMassiveEvent(idTenant: string, idMassiveEvent: string): Promise<SimpleEvent[]>;
    delete(id: string): Promise<void>;
    deleteByMassiveEvent(manager: EntityManager, idMassiveEvent: string): Promise<void>;
    validateDataFields(type: string, dataInput: any): void;
    updateSimpleEvent(idTenant: string, id: string, dto: UpdateSimpleEventDto): Promise<SimpleEvent>;
    findByIds(idTenant: string, ids: string[], manager?: EntityManager): Promise<SimpleEvent[]>;
}
