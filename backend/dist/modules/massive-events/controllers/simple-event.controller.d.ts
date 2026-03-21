import { SimpleEventService } from '../services/simple-event.service';
import { CreateSimpleEventDto } from '../dto/create-simple-event.dto';
import { SyncSimpleEventsRequestDto, SyncSimpleEventsResponseDto } from '../dto/sync-simple-events.dto';
import { UpdateSimpleEventDto } from '../dto/update-simple-events.dto';
import { AnimalSimpleEventRepository } from '../repositories/animal-simple-event.repository';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
export declare class SimpleEventController {
    private readonly simpleEventService;
    private readonly simpleEventCattleRepository;
    constructor(simpleEventService: SimpleEventService, simpleEventCattleRepository: AnimalSimpleEventRepository);
    create(sessionUser: SessionUserDto, dto: CreateSimpleEventDto): Promise<import("../entities/simple-event.entity").SimpleEvent>;
    sync(sessionUser: SessionUserDto, dto: SyncSimpleEventsRequestDto): Promise<SyncSimpleEventsResponseDto>;
    list(sessionUser: SessionUserDto, idMassiveEvent: string): Promise<import("../entities/simple-event.entity").SimpleEvent[]>;
    findById(sessionUser: SessionUserDto, id: string): Promise<import("../entities/simple-event.entity").SimpleEvent>;
    getAppliedCattleIdsBySimpleEvent(id: string): Promise<any[]>;
    update(sessionUser: SessionUserDto, id: string, dto: UpdateSimpleEventDto): Promise<import("../entities/simple-event.entity").SimpleEvent>;
}
