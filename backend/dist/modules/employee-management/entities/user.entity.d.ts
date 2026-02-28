import { Tenant } from './tenant.entity';
import { Role } from './role.entity';
export declare class User {
    id: string;
    username: string;
    password: string;
    active: boolean;
    firstName: string;
    lastName: string;
    email: string;
    tenantId: string;
    tenant: Tenant;
    roles: Role[];
}
