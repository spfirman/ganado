import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin.finca_alamos',
    description: 'El nombre de usuario',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'Contraseña123!',
    description: 'La contraseña del usuario',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'finca_alamos',
    description: 'El nombre de usuario de la compañía',
  })
  @IsString()
  @IsNotEmpty()
  company_username: string;
}
