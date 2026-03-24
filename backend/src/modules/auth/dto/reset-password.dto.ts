import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'El token es requerido' })
  token: string;

  @ApiProperty()
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/(?=.*[a-z])/, {
    message: 'La contraseña debe contener al menos una letra minúscula',
  })
  @Matches(/(?=.*[A-Z])/, {
    message: 'La contraseña debe contener al menos una letra mayúscula',
  })
  @Matches(/(?=.*\d)/, {
    message: 'La contraseña debe contener al menos un número',
  })
  password: string;
}
