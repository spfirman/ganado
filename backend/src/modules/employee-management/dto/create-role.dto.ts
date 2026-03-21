import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    example: 'Administrador',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Descripcion del rol',
    example: 'Rol con acceso total al sistema',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 250)
  description: string;
}
