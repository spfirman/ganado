import { CattleService } from '../services/cattle.service';
import { CreateCattleDto } from '../dto/create-cattle.dto';
import { UpdateCattleDto } from '../dto/update-cattle.dto';
import { CreateCattleMedicationHistoryDto } from '../dto/create-cattle-medication-history.dto';
import { CattleBasicQueryDto } from '../dto/cattle-basic-query.dto';
import { CattleListQueryDto } from '../dto/cattle-list.query.dto';
import { PagedResponseDto } from '../../../shared/dto/paged-response.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { ApplySimpleEventsDto } from '../../massive-events/dto/apply-simple-events.dto';
import { AnimalSimpleEventRepository } from '../../massive-events/repositories/animal-simple-event.repository';
import { SyncAnimalSimpleEventRequestDto } from '../../massive-events/dto/sync-animal-simple-event.dto';
export declare class CattleController {
    private readonly cattleService;
    private readonly simpleEventCattleRepository;
    private readonly logger;
    constructor(cattleService: CattleService, simpleEventCattleRepository: AnimalSimpleEventRepository);
    create(sessionUser: SessionUserDto, dto: CreateCattleDto): Promise<import("../entities/cattle.entity").Cattle>;
    search(sessionUser: SessionUserDto, query: string): Promise<import("../entities/cattle.entity").Cattle[]>;
    findOne(id: string, sessionUser: SessionUserDto): Promise<import("../entities/cattle.entity").Cattle>;
    update(id: string, sessionUser: SessionUserDto, dto: UpdateCattleDto): Promise<any>;
    addMedication(id: string, sessionUser: SessionUserDto, dto: CreateCattleMedicationHistoryDto): Promise<import("../entities/cattle-medication-history.entity").CattleMedicationHistory>;
    remove(id: string, sessionUser: SessionUserDto): void;
    list(sessionUser: SessionUserDto, query: CattleListQueryDto): Promise<PagedResponseDto<any>>;
    getBasicInfo(sessionUser: SessionUserDto): Promise<any[]>;
    getBasicInfoPaged(sessionUser: SessionUserDto, query: CattleBasicQueryDto): Promise<any>;
    findSimpleEventsByCattle(id: string, sessionUser: SessionUserDto): Promise<any[]>;
    applyEventsToSingleCattle(sessionUser: SessionUserDto, cattleNumber: string, applied: any): Promise<any[]>;
    applySimpleEventsToSeveralCattle(sessionUser: SessionUserDto, body: ApplySimpleEventsDto): Promise<any>;
    syncSimpleEventCattle(sessionUser: SessionUserDto, body: SyncAnimalSimpleEventRequestDto): Promise<{
        results: any[];
    }>;
    import(sessionUser: SessionUserDto, file: Express.Multer.File): Promise<any>;
    validateCattleByNumber(number: string, user: SessionUserDto): Promise<import("../entities/cattle.entity").Cattle>;
    recordWeightHistory(id: string, dto: any, user: SessionUserDto): Promise<import("../entities/cattle-weight-history.entity").CattleWeightHistory>;
    updateCattleWeight(id: string, dto: any, user: SessionUserDto): Promise<any>;
    bulkUpdateStatus(dto: any, user: SessionUserDto): Promise<any>;
}
