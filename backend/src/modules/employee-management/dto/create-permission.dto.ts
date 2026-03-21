import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({
    description: 'ID del modulo al que se le asigna el permiso',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({
    description: 'ID del modulo al que se le asigna el permiso',
    example: '123e4567-e89b-12d3-a456-426614174002',
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  moduleId: string;

  @ApiProperty({
    description: 'Permiso para crear',
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  can_create: boolean;

  @ApiProperty({
    description: 'Permiso para leer',
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  can_read: boolean;

  @ApiProperty({
    description: 'Permiso para actualizar',
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  can_update: boolean;

  @ApiProperty({
    description: 'Permiso para eliminar',
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  can_delete: boolean;

  @ApiProperty({
    description: 'Permiso para listar',
    example: true,
    required: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  can_list: boolean;
}

export class CreatePermissionResponseDto {
  @ApiProperty({
    description: 'ID del permiso creado',
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
    example: true,
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
}
