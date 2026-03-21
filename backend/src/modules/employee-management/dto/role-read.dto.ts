import { ApiProperty } from '@nestjs/swagger';
import { RoleReadPermissionDto } from './role-read-permission.dto';

export class RoleReadDto {
  @ApiProperty({
    description: 'ID del rol',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Codigo del rol',
    example: 'ADMIN',
  })
  code: string;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
  })
  name: string;

  @ApiProperty({
    description: 'Lista de permisos asociados al rol',
    type: [RoleReadPermissionDto],
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        can_create: true,
        can_read: true,
        can_update: true,
        can_delete: false,
        can_list: true,
        module: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          code: 'EMP_MGMT',
          name: 'Gestion de Empleados',
          access_details: {
            roles: '0R00L',
            users: 'CRUDL',
            permissions: 'CRUDL',
          },
        },
      },
    ],
  })
  permissions: RoleReadPermissionDto[];

  static transformToDto(role: any): RoleReadDto {
    const roleDto = new RoleReadDto();
    roleDto.id = role.id;
    roleDto.code = role.code;
    roleDto.name = role.name;
    roleDto.permissions = role.permissions?.map((permission: any) => ({
      id: permission.id,
      can_create: permission.can_create,
      can_read: permission.can_read,
      can_update: permission.can_update,
      can_delete: permission.can_delete,
      can_list: permission.can_list,
      module: {
        id: permission.module.id,
        code: permission.module.code,
        name: permission.module.name,
        access_details: permission.module.access_details,
      },
    }));
    return roleDto;
  }
}
