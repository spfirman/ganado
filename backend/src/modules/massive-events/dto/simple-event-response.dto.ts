import { ApiProperty } from '@nestjs/swagger';

export class SimpleEventResponseDto {
  @ApiProperty({ example: 'uuid-simple-event', description: 'Unique ID of the simple event' })
  id: string;

  @ApiProperty({ example: 'uuid-tenant', description: 'ID of the tenant' })
  idTenant: string;

  @ApiProperty({ example: 'medication', description: 'Type of simple event' })
  type: string;

  @ApiProperty({ example: 'uuid-massive-event', description: 'Massive event ID this simple event belongs to' })
  idMassiveEvent: string;

  @ApiProperty({ example: '2025-07-24T12:00:00Z', description: 'Date when the simple event was created' })
  createdAt: Date;

  @ApiProperty({ example: "{  medicationName: 'med123', dosage: '1ml/50kg', lot: '123' }" })
  data: string;

  @ApiProperty({ example: true, description: 'Whether the simple event is active' })
  isActive: boolean;

  static toResponseDto(entity: any): SimpleEventResponseDto {
    return {
      id: entity.id,
      idTenant: entity.idTenant,
      idMassiveEvent: entity.idMassiveEvent,
      type: entity.type,
      data: entity.data,
      createdAt: entity.createdAt,
      isActive: entity.isActive,
    };
  }
}
