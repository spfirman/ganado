import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsObject, IsOptional, IsDate } from 'class-validator';
import { SimpleEventType } from '../enums/simple-event-type.enum';

export class ApplySimpleEventsResponseDto {
  @ApiProperty({ example: 'uuid', description: 'id' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'uuid', description: 'idTenant' })
  @IsString()
  idTenant: string;

  @ApiProperty({ example: 'uuid', description: 'idAnimal' })
  @IsString()
  idAnimal: string;

  @ApiProperty({ example: 'C-001', description: 'Cattle number to apply the event' })
  @IsString()
  animalNumber: string;

  @ApiProperty({ example: 'weight', description: 'Event type', enum: SimpleEventType })
  @IsEnum(SimpleEventType)
  type: string;

  @ApiProperty({ description: 'Event-specific data' })
  @IsObject()
  data: any;

  @ApiProperty({ required: false, description: 'Optional appliedBy user id' })
  @IsOptional()
  @IsString()
  appliedBy?: string;

  @ApiProperty({ example: '2021-01-01', description: 'Applied at' })
  @IsDate()
  appliedAt: Date;

  @ApiProperty({ required: true, description: 'Massive event id to link (idMassiveEvent)' })
  @IsString()
  idMassiveEvent: string;

  @ApiProperty({ required: true, description: 'Simple event id to link (idSimpleEvent)' })
  @IsString()
  idSimpleEvent: string;
}
