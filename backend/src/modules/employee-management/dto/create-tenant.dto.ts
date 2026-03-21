import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length, IsBoolean, IsEmail } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({
    description: 'Nombre del tenant',
    example: 'Finca Los Alamos',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  name: string;

  @ApiProperty({
    description: 'Nombre de usuario de la compania',
    example: 'finca_alamos',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  company_username: string;

  @ApiProperty({
    description: 'Estado del tenant',
    example: true,
    required: true,
    default: true,
  })
  @IsBoolean()
  status: boolean;

  @ApiProperty({
    description: 'Nombre de usuario del administrador',
    example: 'admin.finca_alamos',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  admin_username: string;

  @ApiProperty({
    description: 'Nombre del administrador',
    example: 'Juan',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  admin_first_name: string;

  @ApiProperty({
    description: 'Apellido del administrador',
    example: 'Perez',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  admin_last_name: string;

  @ApiProperty({
    description: 'Contrasena del administrador',
    example: 'Contrasena123!',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 50)
  admin_password: string;

  @ApiProperty({
    description: 'Correo electronico del administrador',
    example: 'admin@fincaalamos.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Length(1, 150)
  admin_email: string;
}
