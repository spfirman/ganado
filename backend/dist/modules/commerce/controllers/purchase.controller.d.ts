import { PurchaseService } from '../services/purchase.service';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { PurchaseResponseDto } from '../dto/purchase-response.dto';
import { PagedResponseDto } from '../../../shared/dto/paged-response.dto';
import { PurchaseListQueryDto } from '../dto/purchase-list.query.dto';
export declare class PurchaseController {
    private readonly purchaseService;
    private readonly logger;
    constructor(purchaseService: PurchaseService);
    createPurchase(dto: CreatePurchaseDto, user: SessionUserDto): Promise<PurchaseResponseDto>;
    updatePurchase(id: string, dto: UpdatePurchaseDto, user: SessionUserDto): Promise<PurchaseResponseDto>;
    list(user: SessionUserDto, q: PurchaseListQueryDto): Promise<PagedResponseDto<any>>;
    findById(id: string, user: SessionUserDto): Promise<PurchaseResponseDto>;
    deleteById(id: string, user: SessionUserDto): Promise<void>;
}
