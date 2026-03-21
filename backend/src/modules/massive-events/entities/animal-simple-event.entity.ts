import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'animal_simple_event' })
@Index(['idTenant', 'idMassiveEvent'])
export class AnimalSimpleEvent {
  @ApiProperty({ format: 'uuid', description: 'Record ID in animal_simple_event', example: 'uuid-animal-simple-event' })
  @PrimaryColumn('uuid')
  id: string;

  @ApiProperty({ format: 'uuid', description: 'Tenant ID', example: 'uuid-tenant' })
  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @ApiProperty({ format: 'uuid', description: 'Simple event ID', example: 'uuid-simple-event' })
  @Column({ name: 'id_simple_event', type: 'uuid' })
  idSimpleEvent: string;

  @ApiProperty({ format: 'uuid', description: 'Massive event ID', example: 'uuid-massive-event' })
  @Column({ name: 'id_massive_event', type: 'uuid' })
  idMassiveEvent: string;

  @ApiProperty({ format: 'uuid', description: 'Animal ID', example: 'uuid-animal' })
  @Column({ name: 'id_animal', type: 'uuid', nullable: true })
  idAnimal: string;

  @ApiProperty({
    description: 'Provisional number of the animal, if not created in the cattle table',
    example: 'TEMP-001',
    required: false,
  })
  @Column({ name: 'provisional_number', type: 'varchar', length: 50, nullable: true })
  provisionalNumber: string;

  @ApiProperty({
    description: 'Additional data applied by the simple_event',
    example: { medication: 'ivermectina', dosage: '10ml' },
    required: false,
  })
  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data: any;

  @ApiProperty({ description: 'Date/time when the event was applied', type: String, format: 'date-time', example: '2025-01-01T00:00:00Z' })
  @CreateDateColumn({ name: 'applied_at', type: 'timestamp' })
  appliedAt: Date;

  @ApiProperty({ required: false, description: 'User ID that applied the event', example: 'uuid-user' })
  @Column({ name: 'applied_by', type: 'uuid', nullable: true })
  appliedBy: string;
}
