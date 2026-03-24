import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyPasscodeDto {
  @ApiProperty({ example: 'usuario@ejemplo.com' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6, { message: 'El código debe tener 6 dígitos' })
  code: string;
}
