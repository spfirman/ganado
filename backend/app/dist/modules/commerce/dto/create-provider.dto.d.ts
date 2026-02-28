import { ProviderType } from '../entities/provider.entity';
export declare class CreateProviderDto {
    name: string;
    nit: string;
    type: ProviderType;
    address?: string;
    contactPersonName?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
}
