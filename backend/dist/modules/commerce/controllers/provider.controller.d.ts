import { ProviderService } from '../services/provider.service';
import { SessionUserDto } from '../../auth/dto/session-user.dto';
import { CreateProviderDto } from '../dto/create-provider.dto';
import { UpdateProviderDto } from '../dto/update-provider.dto';
import { ProviderResponseDto } from '../dto/provider-response.dto';
export declare class ProviderController {
    private readonly providerService;
    constructor(providerService: ProviderService);
    create(body: CreateProviderDto, user: SessionUserDto): Promise<ProviderResponseDto>;
    searchByName(user: SessionUserDto, name: string, type?: string): Promise<ProviderResponseDto[]>;
    searchByNit(query: string, session: SessionUserDto): Promise<ProviderResponseDto[]>;
    findById(id: string, user: SessionUserDto): Promise<ProviderResponseDto>;
    findByNit(nit: string, user: SessionUserDto): Promise<ProviderResponseDto>;
    findAll(user: SessionUserDto, type?: string): Promise<ProviderResponseDto[]>;
    updateById(id: string, data: UpdateProviderDto, user: SessionUserDto): Promise<void>;
    updateByNit(nit: string, data: UpdateProviderDto, user: SessionUserDto): Promise<void>;
    deleteById(id: string, user: SessionUserDto): Promise<void>;
    deleteByNit(nit: string, user: SessionUserDto): Promise<void>;
}
