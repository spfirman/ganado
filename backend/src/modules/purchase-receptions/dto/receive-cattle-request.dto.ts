import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID, IsArray, IsDateString } from 'class-validator';

export class ReceiveCattleRequestDto {
  @IsUUID()
  idPurchase: string;

  @IsString()
  number: string;

  @IsNumber()
  receivedWeight: number;

  @IsOptional()
  @IsNumber()
  purchaseWeight: number;

  @IsOptional()
  @IsNumber()
  purchasePrice: number;

  @IsOptional()
  @IsBoolean()
  hasHorn: boolean;

  @IsOptional()
  @IsBoolean()
  castrated: boolean;

  @IsOptional()
  @IsUUID()
  idLot: string;

  @IsOptional()
  @IsUUID()
  idBrand: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  characteristics: string[];

  @IsOptional()
  @IsString()
  eartagLeft: string;

  @IsOptional()
  @IsString()
  eartagRight: string;

  @IsOptional()
  @IsUUID()
  idDevice: string;

  @IsOptional()
  @IsString()
  comments: string;

  @IsOptional()
  @IsUUID()
  idProvider: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  idSimpleEvents: string[];

  @IsOptional()
  @IsString()
  gender: string;

  @IsOptional()
  @IsDateString()
  birthDateAprx: string;
}

export class UpdateLotCattleRequestDto {
  @IsUUID()
  idLot: string;

  @IsUUID()
  idCattle: string;
}
