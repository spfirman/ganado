import { Role } from './role.entity';
import { ModuleEntity } from './module.entity';
export declare class RoleModulePermission {
    id: string;
    id_role: string;
    id_module: string;
    tenant_id: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_list: boolean;
    role: Role;
    module: ModuleEntity;
}
