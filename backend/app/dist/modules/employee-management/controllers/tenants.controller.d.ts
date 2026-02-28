import { TenantsService } from '../services/tenants.service';
import { CreateTenantDto } from '../dto/create-tenant.dto';
import { Tenant } from '../entities/tenant.entity';
import { SessionUserDto } from 'src/modules/auth/dto/session-user.dto';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    create(createTenantDto: CreateTenantDto): Promise<Tenant>;
    read(sessionUser: SessionUserDto, id: string): Promise<Tenant>;
}
