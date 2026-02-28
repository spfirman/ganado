import { DataSource } from 'typeorm';
import { PurchaseRepository } from '../repositories/purchase.repository';
import { LotRepository } from '../repositories/lot.repository';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { Purchase } from '../entities/purchase.entity';
import { PurchaseListQueryDto } from '../dto/purchase-list.query.dto';
import { PurchaseListItemDto } from '../dto/purchase-list.item.dto';
export declare class PurchaseService {
    private readonly dataSource;
    private readonly purchaseRepository;
    private readonly lotRepository;
    private readonly logger;
    constructor(dataSource: DataSource, purchaseRepository: PurchaseRepository, lotRepository: LotRepository);
    createPurchase(data: CreatePurchaseDto, idTenant: string, createdBy: string): Promise<Purchase>;
    updateStatus(id: string, status: string, idTenant: string, updatedBy: string): Promise<Purchase>;
    updatePurchase(id: string, data: UpdatePurchaseDto, idTenant: string, updatedBy: string): Promise<Purchase>;
    findById(id: string, idTenant: string): Promise<Purchase>;
    findAll(idTenant: string): Promise<Purchase[]>;
    deleteById(id: string, idTenant: string): Promise<void>;
    listPaged(tenantId: string, q: PurchaseListQueryDto): Promise<{
        page: number;
        limit: number;
        total: number;
        items: PurchaseListItemDto[];
    }>;
}
