import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('cattle_medication_history')
export class CattleMedicationHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'id_cattle', type: 'uuid' })
  idCattle: string;

  @Column({ name: 'medication_name', type: 'varchar', length: 100 })
  medicationName: string;

  @Column({ type: 'varchar', length: 50 })
  route: string;

  @Column({ name: 'dosage', type: 'varchar', length: 50, nullable: true })
  dosage: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lot: string;

  @Column({ name: 'applied_at', type: 'timestamp' })
  appliedAt: Date;

  @Column({ name: 'idMassiveEvent', type: 'uuid', nullable: true })
  idMassiveEvent: string;

  @Column({ name: 'recorded_by', type: 'uuid', nullable: true })
  recordedBy: string;
}
