import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

export enum WeightContext {
  SALE = 'SALE',
  PURCHASE = 'PURCHASE',
  EVENT = 'EVENT',
  MANUAL = 'MANUAL',
  RECEIVED = 'RECEIVED',
}

@Entity('cattle_weight_history')
export class CattleWeightHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'id_cattle', type: 'uuid' })
  idCattle: string;

  @Column({ type: 'numeric', precision: 6, scale: 2 })
  weight: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({
    type: 'enum',
    enum: WeightContext,
    default: WeightContext.MANUAL,
  })
  context: string;

  @Column({ name: 'idMassiveEvent', type: 'uuid', nullable: true })
  idMassiveEvent: string;

  @Column({ name: 'recorded_by', type: 'uuid', nullable: true })
  recordedBy: string;
}
