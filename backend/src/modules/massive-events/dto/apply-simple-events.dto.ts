import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsObject, IsOptional, IsDate, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SimpleEventType } from '../enums/simple-event-type.enum';

class SingleEventDto {
  @ApiProperty({ example: 'C-001', description: 'Cattle number to apply the event' })
  @IsString()
  cattleNumber: string;

  @ApiProperty({ enum: ['weight', 'eartag', 'tracker', 'brand', 'castration'], example: 'weight' })
  @IsEnum(SimpleEventType)
  type: string;

  @ApiProperty({ description: 'Event-specific data' })
  @IsObject()
  data: any;

  @ApiProperty({ required: false, description: 'Optional appliedBy user id' })
  @IsOptional()
  @IsString()
  appliedBy?: string;

  @ApiProperty({ required: false, description: 'Applied at' })
  @IsOptional()
  @IsDate()
  appliedAt?: Date;

  @ApiProperty({ required: true, description: 'Massive event id to link (idMassiveEvent)' })
  @IsString()
  idMassiveEvent: string;

  @ApiProperty({ required: true, description: 'Simple event id to link (idSimpleEvent)' })
  @IsString()
  idSimpleEvent: string;
}

export class ApplySimpleEventsDto {
  @ApiProperty({ type: [SingleEventDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleEventDto)
  events: SingleEventDto[];
}
