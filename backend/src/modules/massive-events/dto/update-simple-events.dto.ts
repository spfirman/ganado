import { IsObject, IsOptional, IsBoolean } from 'class-validator';

export class UpdateSimpleEventDto {
  @IsObject()
  @IsOptional()
  data?: any;

  @IsBoolean()
  isActive: boolean;
}
