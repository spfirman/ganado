import { Role } from "../entities/role.entity";
import { RoleReadPermissionDto } from './role-read-permission.dto';
export declare class RoleReadDto {
    id: string;
    code: string;
    name: string;
    permissions: RoleReadPermissionDto[];
    static transformToDto(role: Role): RoleReadDto;
}
