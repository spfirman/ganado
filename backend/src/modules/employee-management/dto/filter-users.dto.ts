import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsString } from 'class-validator';

export class FilterUsersDto {
  @ApiProperty({
    description: 'ID del tenant para filtrar usuarios',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  tenantId: string;

  @ApiProperty({
    description: 'ID del rol para filtrar usuarios',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  roleId: string;

  @ApiProperty({
    description: 'Buscar por nombre o apellido',
    example: 'Juan',
    required: false,
  })
  @IsString()
  @IsOptional()
  searchTerm: string;
}
