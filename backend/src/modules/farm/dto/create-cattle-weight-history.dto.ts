import { IsUUID, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCattleWeightHistoryDto {
  @IsUUID()
  idCattle: string;

  @IsNumber()
  weight: number;

  @IsOptional()
  @IsString()
  recordedBy?: string;

  @IsOptional()
  @IsString()
  idMassiveEvent?: string;

  @IsOptional()
  date?: Date;
}
