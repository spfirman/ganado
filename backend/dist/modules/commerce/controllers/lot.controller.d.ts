import { LotService } from '../services/lot.service';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { LotResponseDto } from '../dto/lot-response.dto';
export declare class LotController {
    private readonly lotService;
    constructor(lotService: LotService);
    findOne(id: string, user: SessionUserDto): Promise<LotResponseDto>;
    findByPurchase(idPurchase: string, user: SessionUserDto): Promise<LotResponseDto[]>;
}
