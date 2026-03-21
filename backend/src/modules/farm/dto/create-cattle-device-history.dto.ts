import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateCattleDeviceHistoryDto {
  @IsUUID()
  idCattle: string;

  @IsUUID()
  idDevice: string;

  @IsOptional()
  @IsString()
  assignedBy?: string;

  @IsOptional()
  @IsString()
  idMassiveEvent?: string;
}
