export declare class CreatePermissionDto {
    roleId: string;
    moduleId: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_list: boolean;
}
export declare class CreatePermissionResponseDto {
    id: string;
    id_role: string;
    id_module: string;
    tenant_id: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_list: boolean;
}
