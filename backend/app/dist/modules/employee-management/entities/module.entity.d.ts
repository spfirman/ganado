import { RoleModulePermission } from './role-module-permission.entity';
export declare class ModuleEntity {
    id: string;
    code: string;
    name: string;
    description: string;
    access_details: Record<string, string>;
    permissions: RoleModulePermission[];
}
