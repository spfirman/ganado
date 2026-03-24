import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, Length } from 'class-validator';

export class OtpVerifyDto {
  @ApiProperty({
    example: '123456',
    description: 'Código TOTP de 6 dígitos o código de respaldo',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class OtpLoginDto {
  @ApiProperty({
    description: 'Token temporal recibido en el login',
  })
  @IsString()
  @IsNotEmpty()
  tempToken: string;

  @ApiProperty({
    example: '123456',
    description: 'Código TOTP de 6 dígitos o código de respaldo',
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
