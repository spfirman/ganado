export declare class UpdatePermissionDto {
    can_create?: boolean;
    can_read?: boolean;
    can_update?: boolean;
    can_delete?: boolean;
    can_list?: boolean;
}
export declare class UpdatePermissionResponseDto {
    id: string;
    id_role: string;
    id_module: string;
    tenant_id: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_list: boolean;
    module: {
        id: string;
        name: string;
        description: string;
    };
}
