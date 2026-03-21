import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsBoolean, IsDate, IsObject, Length } from 'class-validator';

export class UpdateDeviceDto {
  @ApiProperty({
    description: 'DevEUI del dispositivo LoRaWAN',
    example: '0000000000000001',
    required: false,
  })
  @IsString()
  @IsOptional()
  deveui: string;

  @ApiProperty({
    description: 'ID del perfil de dispositivo en Chirpstack',
    example: 'e7c68b4f-0c09-472a-8b9b-44ca8f074c73',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  idDeviceProfile: string;

  @ApiProperty({
    description: 'Nombre del dispositivo',
    example: 'Sensor de temperatura #1',
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Descripcion del dispositivo',
    example: 'Sensor de temperatura ubicado en el invernadero principal',
    required: false,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'ID de la aplicacion de ChipStack',
    example: 'e7c68b4f-0c09-472a-8b9b-44ca8f074c73',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  csApplicationId: string;

  @ApiProperty({
    description: 'JoinEUI del dispositivo',
    example: '0000000000000001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(16, 16)
  csJoineui: string;

  @ApiProperty({
    description: 'AppKey del dispositivo',
    example: '00000000000000000000000000000001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(32, 32)
  csAppKey: string;

  @ApiProperty({
    description: 'NwkKey del dispositivo',
    example: '00000000000000000000000000000001',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(32, 32)
  csNwkKey: string;

  @ApiProperty({
    description: 'Tags del dispositivo',
    example: { cattle: 'cattleI' },
    required: false,
  })
  @IsObject()
  @IsOptional()
  tags: Record<string, any>;

  @ApiProperty({
    description: 'Variables del dispositivo',
    example: {},
    required: false,
  })
  @IsObject()
  @IsOptional()
  variables: Record<string, any>;

  @ApiProperty({
    description: 'Estado del dispositivo',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
