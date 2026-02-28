import { User } from './user.entity';
import { RoleModulePermission } from './role-module-permission.entity';
export declare class Role {
    id: string;
    code: string;
    name: string;
    description: string;
    users: User[];
    permissions: RoleModulePermission[];
}
