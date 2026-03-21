import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Descripcion del rol',
    example: 'Rol con acceso total al sistema',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;
}

export class UpdateRoleResponseDto {
  @ApiProperty({
    description: 'ID del rol actualizado',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
  })
  name: string;

  @ApiProperty({
    description: 'Descripcion del rol',
    example: 'Rol con acceso total al sistema',
  })
  description: string;

  @ApiProperty({
    description: 'Permisos del rol',
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        can_create: true,
        can_read: true,
        can_update: true,
        can_delete: true,
        module: {
          id: '123e4567-e89b-12d3-a456-426614174002',
          name: 'Employee Management',
          description: 'Gestion de empleados y roles',
        },
      },
    ],
  })
  permissions: any[];
}
