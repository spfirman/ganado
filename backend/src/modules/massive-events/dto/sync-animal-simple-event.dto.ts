import { ApiProperty } from '@nestjs/swagger';

export class SyncAnimalSimpleEventDto {
  @ApiProperty({ example: 'uuid-local-animal-simple-event' })
  id: string;

  @ApiProperty({ example: 'tenant-uuid' })
  idTenant: string;

  @ApiProperty({ example: 'C-123' })
  cattleNumber: string;

  @ApiProperty({ example: 'weight' })
  type: string;

  @ApiProperty({ example: '{"weight":350}', required: false })
  dataJson?: string;

  @ApiProperty({ example: '2025-07-24T10:00:00Z' })
  appliedAt: string;

  @ApiProperty({ example: 'user-123', required: false })
  appliedBy?: string;

  @ApiProperty({ example: 'uuid-massive-event', required: false })
  idMassiveEvent?: string;

  @ApiProperty({ example: 'uuid-simple-event', required: false })
  idSimpleEvent?: string;
}

export class SyncAnimalSimpleEventRequestDto {
  @ApiProperty({ type: [SyncAnimalSimpleEventDto] })
  animalSimpleEvent: SyncAnimalSimpleEventDto[];
}

export class SyncAnimalSimpleEventResultDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'synced' })
  status: string;

  @ApiProperty({ example: 'uuid-animal-real', required: false })
  animalServerId?: string;

  @ApiProperty({ example: 'Animal number not found', required: false })
  message?: string;
}

export class SyncAnimalSimpleEventResponseDto {
  @ApiProperty({ type: [SyncAnimalSimpleEventResultDto] })
  results: SyncAnimalSimpleEventResultDto[];
}
