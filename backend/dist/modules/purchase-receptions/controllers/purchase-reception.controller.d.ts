import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { ReceptionsService } from '../services/receptions.service';
import { ReceptionResponseDto } from '../dto/reception-response.dto';
import { ReceiveCattleRequestDto, UpdateLotCattleRequestDto } from '../dto/receive-cattle-request.dto';
import { ReceiveCattleResponseDto } from '../dto/receive-cattle-response.dto';
import { Device } from '../../production-center/entities/device.entity';
import { CattleService } from '../../farm/services/cattle.service';
import { SimpleEvent } from '../../massive-events/entities/simple-event.entity';
import { SimpleEventService } from '../../massive-events/services/simple-event.service';
import { UpdateSimpleEventDto } from '../../massive-events/dto/update-simple-events.dto';
import { PurchaseResponseDto } from '../../commerce/dto/purchase-response.dto';
import { UpdatePurchaseStatusDto } from '../../commerce/dto/update-purchase-status.dto';
import { PurchaseService } from '../../commerce/services/purchase.service';
export declare class ReceptionController {
    private readonly receptionsService;
    private readonly cattleService;
    private readonly simpleEventService;
    private readonly purchaseService;
    constructor(receptionsService: ReceptionsService, cattleService: CattleService, simpleEventService: SimpleEventService, purchaseService: PurchaseService);
    numberExists(sessionUser: SessionUserDto, number: string): Promise<{
        exists: boolean;
    }>;
    eartagExists(sessionUser: SessionUserDto, eartag: string): Promise<{
        exists: boolean;
    }>;
    findOrCreateReception(sessionUser: SessionUserDto, idPurchase: string): Promise<ReceptionResponseDto>;
    searchDevices(sessionUser: SessionUserDto, q: string): Promise<Device[]>;
    receiveCattle(sessionUser: SessionUserDto, dto: ReceiveCattleRequestDto): Promise<ReceiveCattleResponseDto>;
    assignLotCattle(sessionUser: SessionUserDto, dto: UpdateLotCattleRequestDto): Promise<any>;
    nextNumber(sessionUser: SessionUserDto, number: string): Promise<any>;
    updateStatus(id: string, dto: UpdatePurchaseStatusDto, user: SessionUserDto): Promise<PurchaseResponseDto>;
    updateSimpleEvent(sessionUser: SessionUserDto, id: string, dto: UpdateSimpleEventDto): Promise<SimpleEvent>;
}
