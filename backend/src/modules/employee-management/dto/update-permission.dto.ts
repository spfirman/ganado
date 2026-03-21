import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePermissionDto {
  @ApiProperty({
    description: 'Permiso para crear',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  can_create: boolean;

  @ApiProperty({
    description: 'Permiso para leer',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  can_read: boolean;

  @ApiProperty({
    description: 'Permiso para actualizar',
    example: false,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  can_update: boolean;

  @ApiProperty({
    description: 'Permiso para eliminar',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  can_delete: boolean;

  @ApiProperty({
    description: 'Permiso para  Listar',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  can_list: boolean;
}

export class UpdatePermissionResponseDto {
  @ApiProperty({
    description: 'ID del permiso actualizado',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  id: string;

  @ApiProperty({
    description: 'ID del rol al que pertenece el permiso',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id_role: string;

  @ApiProperty({
    description: 'ID del modulo al que pertenece el permiso',
    example: '123e4567-e89b-12d3-a456-426614174002',
  })
  id_module: string;

  @ApiProperty({
    description: 'ID del tenant al que pertenece el permiso',
    example: '123e4567-e89b-12d3-a456-426614174003',
  })
  tenant_id: string;

  @ApiProperty({
    description: 'Permiso para crear',
    example: true,
  })
  can_create: boolean;

  @ApiProperty({
    description: 'Permiso para leer',
    example: true,
  })
  can_read: boolean;

  @ApiProperty({
    description: 'Permiso para actualizar',
    example: false,
  })
  can_update: boolean;

  @ApiProperty({
    description: 'Permiso para eliminar',
    example: true,
  })
  can_delete: boolean;

  @ApiProperty({
    description: 'Permiso para listar',
    example: true,
  })
  can_list: boolean;

  @ApiProperty({
    description: 'Informacion del modulo',
    example: {
      id: '123e4567-e89b-12d3-a456-426614174002',
      name: 'Employee Management',
      description: 'Gestion de empleados y roles',
    },
  })
  module: any;
}
