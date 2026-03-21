import { ApiProperty } from '@nestjs/swagger';
import { SimpleEventResponseDto } from './simple-event-response.dto';

export class MassiveEventResponseDto {
  @ApiProperty({ example: 'uuid-massive-event', description: 'Unique ID of the massive event' })
  id: string;

  @ApiProperty({ example: 'uuid-tenant', description: 'Tenant identifier' })
  idTenant: string;

  @ApiProperty({ example: 'open', description: 'Status of the massive event' })
  status: string;

  @ApiProperty({ example: '2022-01-01', description: 'Event date' })
  eventDate: Date;

  @ApiProperty({ example: '2025-07-24T12:00:00Z', description: 'Date when the massive event was created' })
  createdAt: Date;

  @ApiProperty({ example: '2025-07-24T12:00:00Z', description: 'Date when the massive event was last updated' })
  updatedAt: Date;

  @ApiProperty({
    type: [SimpleEventResponseDto],
    description: 'List of simple events associated with this massive event',
  })
  simpleEvents: SimpleEventResponseDto[];

  static toResponseDto(entity: any, simpleEvents?: any[]): MassiveEventResponseDto {
    return {
      id: entity.id,
      idTenant: entity.idTenant,
      status: entity.status,
      eventDate: entity.eventDate,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      simpleEvents: simpleEvents
        ? simpleEvents.map(SimpleEventResponseDto.toResponseDto)
        : [],
    };
  }
}
