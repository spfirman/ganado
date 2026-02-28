import { SimpleEventService } from '../services/simple-event.service';
import { CreateSimpleEventDto } from '../dto/create-simple-event.dto';
import { SyncSimpleEventsRequestDto } from '../dto/sync-simple-events.dto';
import { AnimalSimpleEventRepository } from '../repositories/animal-simple-event.repository';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { UpdateSimpleEventDto } from '../dto/update-simple-events.dto';
export declare class SimpleEventController {
    private readonly simpleEventService;
    private readonly simpleEventCattleRepository;
    constructor(simpleEventService: SimpleEventService, simpleEventCattleRepository: AnimalSimpleEventRepository);
    create(sessionUser: SessionUserDto, dto: CreateSimpleEventDto): Promise<import("../entities/simple-event.entity").SimpleEvent>;
    sync(sessionUser: SessionUserDto, dto: SyncSimpleEventsRequestDto): Promise<{
        results: import("../dto/sync-simple-events.dto").SyncSimpleEventResultDto[];
    }>;
    list(sessionUser: SessionUserDto, idMassiveEvent: string): Promise<import("../entities/simple-event.entity").SimpleEvent[]>;
    findById(sessionUser: SessionUserDto, id: string): Promise<import("../entities/simple-event.entity").SimpleEvent>;
    getAppliedCattleIdsBySimpleEvent(id: string): Promise<{
        idCattle: string | undefined;
        appliedAt: Date;
        appliedBy: string | undefined;
    }[]>;
    update(sessionUser: SessionUserDto, id: string, dto: UpdateSimpleEventDto): Promise<import("../entities/simple-event.entity").SimpleEvent>;
}
