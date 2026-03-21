import { DataSource, EntityManager } from 'typeorm';
import { MassiveEventRepository } from '../repositories/massive-event.repository';
import { SimpleEventRepository } from '../repositories/simple-event.repository';
import { AnimalSimpleEventRepository } from '../repositories/animal-simple-event.repository';
import { CattleRepository } from '../../farm/repositories/cattle.repository';
import { MassiveEvent } from '../entities/massive-events.entity';
import { CreateMassiveEventDto } from '../dto/create-massive-event.dto';
export declare class MassiveEventService {
    private readonly dataSource;
    private readonly massiveEventRepo;
    private readonly simpleEventRepo;
    private readonly simpleEventCattleRepository;
    private readonly cattleRepository;
    private readonly logger;
    constructor(dataSource: DataSource, massiveEventRepo: MassiveEventRepository, simpleEventRepo: SimpleEventRepository, simpleEventCattleRepository: AnimalSimpleEventRepository, cattleRepository: CattleRepository);
    saveMassiveAndSimples(manager: EntityManager, payload: any): Promise<MassiveEvent>;
    createMassiveEvent(idTenant: string, createdBy: string, dto: CreateMassiveEventDto): Promise<MassiveEvent>;
    syncMassiveEvents(idTenant: string, dtos: any[]): Promise<any[]>;
    createMassiveEvent1(idTenant: string, createdBy: string, dto: CreateMassiveEventDto): Promise<MassiveEvent>;
    findByIdOrFail(idTenant: string, idMassiveEvent: string, manager?: EntityManager): Promise<MassiveEvent>;
    findWithSimpleEventsByIdOrFail(idTenant: string, idMassiveEvent: string, manager?: EntityManager): Promise<MassiveEvent>;
    findCattleByMassiveEvent(idTenant: string, idMassiveEvent: string): Promise<any[]>;
    findAll(idTenant: string): Promise<MassiveEvent[]>;
    closeMassiveEvent(idTenant: string, id: string): Promise<void>;
    deleteMassiveEvent(idTenant: string, id: string): Promise<void>;
}
