export declare class ModuleReadDto {
    id: string;
    code: string;
    name: string;
    access_details: any;
}
export declare class RoleReadPermissionDto {
    id: string;
    can_create: boolean;
    can_read: boolean;
    can_update: boolean;
    can_delete: boolean;
    can_list: boolean;
    module: ModuleReadDto;
    static transformToDto(permission: any): RoleReadPermissionDto;
}
