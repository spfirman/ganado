import { DataSource } from 'typeorm';
import { Sale } from '../entities/sale.entity';
import { CattleDeviceHistoryRepository } from '../../farm/repositories/cattle-device-history.repository';
import { DevicesService } from '../../production-center/services/devices.service';
import { CattleRepository } from '../../farm/repositories/cattle.repository';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { GetSalesQueryDto } from '../dto/get-sales-query.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';
export declare class SalesService {
    private readonly dataSource;
    private readonly deviceService;
    private readonly cattleDeviceHistoryRepository;
    private readonly cattleRepository;
    private readonly logger;
    constructor(dataSource: DataSource, deviceService: DevicesService, cattleDeviceHistoryRepository: CattleDeviceHistoryRepository, cattleRepository: CattleRepository);
    createSale(dto: CreateSaleDto): Promise<Sale>;
    findAll(idTenant: string, query: GetSalesQueryDto): Promise<{
        items: Sale[];
        total: number;
    }>;
    findAll2(idTenant: string, query: GetSalesQueryDto): Promise<{
        items: Sale[];
        total: number;
    }>;
    findOne(idTenant: string, id: string): Promise<Sale>;
    update(idTenant: string, id: string, dto: UpdateSaleDto): Promise<void>;
}
