import { SalesService } from '../services/sales.service';
import { CreateSaleDto } from '../dto/create-sale.dto';
import { GetSalesQueryDto } from '../dto/get-sales-query.dto';
import { UpdateSaleDto } from '../dto/update-sale.dto';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
export declare class SalesController {
    private readonly salesService;
    constructor(salesService: SalesService);
    create(createSaleDto: CreateSaleDto, user: SessionUserDto): Promise<any>;
    findAll(query: GetSalesQueryDto, user: SessionUserDto): Promise<any>;
    findOne(id: string, user: SessionUserDto): Promise<any>;
    update(id: string, updateSaleDto: UpdateSaleDto, user: SessionUserDto): Promise<any>;
}
