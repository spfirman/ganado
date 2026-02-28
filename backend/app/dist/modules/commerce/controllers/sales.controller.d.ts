import { SalesService } from '../services/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { GetSalesQueryDto } from '../dto/get-sales-query.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { PaginatedResponseDto } from '../../../common/dto/paginated-response.dto';
import { Sale } from '../entities/sale.entity';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto, user: SessionUserDto): Promise<Sale>;
    findAll(query: GetSalesQueryDto, user: SessionUserDto): Promise<PaginatedResponseDto<Sale>>;
    findOne(id: string, user: SessionUserDto): Promise<Sale>;
    update(id: string, updateSaleDto: UpdateSaleDto, user: SessionUserDto): Promise<void>;
}
