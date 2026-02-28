import { User } from './user.entity';
export declare class Tenant {
    id: string;
    name: string;
    company_username: string;
    status: boolean;
    users: User[];
}
