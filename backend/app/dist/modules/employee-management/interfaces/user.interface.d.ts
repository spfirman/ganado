import { Role } from '../entities/role.entity';
export interface User {
    id: string;
    id_tenant: string;
    username: string;
    roles: Role[];
    first_name: string;
    last_name: string;
    pass_word: string;
    email: string;
}
