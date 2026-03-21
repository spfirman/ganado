import { Tenant } from '../entities/tenant.entity';
export declare class UserResponseDto {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    tenantId: string;
    tenant: Tenant;
    roles: any[];
    constructor(partial: Partial<UserResponseDto>);
}
