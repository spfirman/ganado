import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsDate, Length } from 'class-validator';

export class UpdateDeviceProfileDto {
  @IsString()
  @IsOptional()
  idTenant: string;

  @ApiProperty({ description: 'Nombre del perfil de dispositivo', required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Descripcion del perfil de dispositivo', required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: 'ID del perfil en Chirpstack', required: false })
  @IsOptional()
  @IsUUID()
  idChipstack: string;

  @ApiProperty({ description: 'ID de la aplicacion en Chirpstack', required: false })
  @IsOptional()
  @IsUUID()
  csApplicationId: string;

  @ApiProperty({ description: 'Join EUI en Chirpstack', required: false })
  @IsOptional()
  @IsString()
  @Length(16, 16)
  csJoineui: string;

  @ApiProperty({ description: 'App Key en Chirpstack', required: false })
  @IsOptional()
  @IsString()
  @Length(32, 32)
  csAppKey: string;

  @ApiProperty({ description: 'NWK Key en Chirpstack', required: false })
  @IsOptional()
  @IsString()
  @Length(32, 32)
  csNwkKey: string;

  @ApiProperty({ description: 'FCC ID', required: false })
  @IsOptional()
  @IsString()
  fccId: string;

  @ApiProperty({ description: 'Regiones', required: false })
  @IsOptional()
  @IsString()
  regions: string;

  @ApiProperty({ description: 'Modelo', required: false })
  @IsOptional()
  @IsString()
  model: string;

  @ApiProperty({ description: 'Input', required: false })
  @IsOptional()
  @IsString()
  input: string;

  @IsDate()
  @IsOptional()
  updatedAt: Date;
}
