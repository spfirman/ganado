import { Provider, ProviderType } from '../entities/provider.entity';
export declare class ProviderResponseDto {
    id: string;
    name: string;
    nit: string;
    type: ProviderType;
    created_at: Date;
    updated_at: Date;
    static toProviderResponse(provider: Provider): ProviderResponseDto;
}
