import { Provider } from '../entities/provider.entity';
export declare class ProviderResponseDto {
    id: string;
    name: string;
    nit: string;
    type: string;
    created_at: Date;
    updated_at: Date;
    static toProviderResponse(provider: Provider): ProviderResponseDto;
}
