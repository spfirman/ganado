import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SimpleEventType } from '../enums/simple-event-type.enum';

export class SyncSimpleEventInputDto {
  @ApiProperty({
    description: 'UUID of simpleEvent (generated in frontend)',
    example: 'uuid-simple-event-123',
  })
  id: string;

  @ApiProperty({
    description: 'Simple event type',
    enum: ['weight', 'eartag', 'tracker', 'brand', 'castration', 'medication'],
    example: 'medication',
  })
  @IsEnum(SimpleEventType)
  type: string;

  @ApiPropertyOptional({
    description: 'Specific data of simple event (JSON)',
    example: '{"medicationName":"m1","dosage":"1ml","route":"oral","lot":"123"}',
  })
  dataJson?: string;

  @ApiPropertyOptional({
    description: 'Creation date',
    example: '2025-07-24T10:00:00Z',
  })
  createdAt?: string;
}

export class SyncMassiveEventDto {
  @ApiProperty({
    description: 'UUID of massiveEvent (generated in frontend)',
    example: 'uuid-massive-event-123',
  })
  id: string;

  @ApiProperty({
    description: 'UUID of tenant',
    example: 'tenant-uuid',
  })
  idTenant: string;

  @ApiProperty({
    description: 'Event date',
    example: '2025-07-24T00:00:00Z',
  })
  eventDate: string;

  @ApiProperty({
    description: 'Status',
    example: 'open',
  })
  status: string;

  @ApiPropertyOptional({
    description: 'Creator user',
    example: 'user-uuid-123',
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Creation date',
    example: '2025-07-24T00:00:00Z',
  })
  createdAt?: string;

  @ApiPropertyOptional({
    description: 'Update date',
    example: '2025-07-24T00:00:00Z',
  })
  updatedAt?: string;

  @ApiPropertyOptional({
    description: 'List of simpleEvents to synchronize',
    type: [SyncSimpleEventInputDto],
  })
  simpleEvents?: SyncSimpleEventInputDto[];
}

export class SyncMassiveEventsRequestDto {
  @ApiProperty({ type: [SyncMassiveEventDto] })
  massiveEvents: SyncMassiveEventDto[];
}

export class SyncMassiveEventResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'synced' })
  status: string;

  @ApiPropertyOptional({ example: 'Additional message if applies' })
  message?: string;
}

export class SyncMassiveEventsResponseDto {
  @ApiProperty({ type: [SyncMassiveEventResultDto] })
  results: SyncMassiveEventResultDto[];
}
