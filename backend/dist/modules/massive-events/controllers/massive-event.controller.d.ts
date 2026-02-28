import { MassiveEventService } from '../services/massive-event.service';
import { CreateMassiveEventDto } from '../dto/create-massive-event.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { MassiveEventResponseDto } from '../dto/massive-event-response.dto';
import { SyncMassiveEventsRequestDto } from '../dto/sync-massive-event.dto';
export declare class MassiveEventController {
    private readonly massiveEventService;
    constructor(massiveEventService: MassiveEventService);
    create(sessionUser: SessionUserDto, dto: CreateMassiveEventDto): Promise<MassiveEventResponseDto>;
    findOne(sessionUser: SessionUserDto, id: string): Promise<MassiveEventResponseDto>;
    getAppliedCattleIdsByMassiveEvent(idMassiveEvent: string, sessionUser: SessionUserDto): Promise<{
        id: string;
        number: string;
        idBrand: string | null;
        lastWeight: number;
        appliedAt: Date | undefined;
    }[]>;
    list(sessionUser: SessionUserDto): Promise<MassiveEventResponseDto[]>;
    close(sessionUser: SessionUserDto, id: string): Promise<void>;
    sync(user: SessionUserDto, body: SyncMassiveEventsRequestDto): Promise<import("../dto/sync-massive-event.dto").SyncMassiveEventResultDto[]>;
}
