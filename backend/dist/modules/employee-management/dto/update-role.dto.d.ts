export declare class UpdateRoleDto {
    name?: string;
    description?: string;
}
export declare class UpdateRoleResponseDto {
    id: string;
    name: string;
    description: string;
    permissions: Array<{
        id: string;
        can_create: boolean;
        can_read: boolean;
        can_update: boolean;
        can_delete: boolean;
        module: {
            id: string;
            name: string;
            description: string;
        };
    }>;
}
