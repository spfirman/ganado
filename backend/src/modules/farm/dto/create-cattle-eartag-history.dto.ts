import { IsUUID, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCattleEartagHistoryDto {
  @IsUUID()
  idCattle: string;

  @IsObject()
  data: any;

  @IsOptional()
  @IsString()
  assignedBy?: string;

  @IsOptional()
  @IsString()
  idMassiveEvent?: string;
}
