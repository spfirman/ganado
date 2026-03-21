import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Cattle } from '../../farm/entities/cattle.entity';
import { WeighingSource } from '../enums/weighing-source.enum';
import { WeighingMedia } from './weighing-media.entity';

@Entity('weighings')
@Index(['idTenant', 'createdAt'])
@Index(['idTenant', 'idCattle'])
export class Weighing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'id_cattle', type: 'uuid' })
  idCattle: string;

  @ManyToOne(() => Cattle, { nullable: false })
  @JoinColumn({ name: 'id_cattle' })
  cattle: Cattle;

  @Column({ name: 'eid_tag', type: 'varchar', length: 30, nullable: true })
  eidTag: string | null;

  @Column({ name: 'gross_weight_kg', type: 'numeric', precision: 8, scale: 2 })
  grossWeightKg: number;

  @Column({ name: 'net_weight_kg', type: 'numeric', precision: 8, scale: 2, nullable: true })
  netWeightKg: number | null;

  @Column({ name: 'tare_kg', type: 'numeric', precision: 8, scale: 2, nullable: true })
  tareKg: number | null;

  @Column({ name: 'stable_at', type: 'timestamp with time zone', nullable: true })
  stableAt: Date | null;

  @Column({ name: 'operator_id', type: 'uuid', nullable: true })
  operatorId: string | null;

  @Column({
    type: 'enum',
    enum: WeighingSource,
    enumName: 'weighing_source_enum',
    default: WeighingSource.MANUAL,
  })
  source: WeighingSource;

  @Column({ name: 'bridge_device_id', type: 'uuid', nullable: true })
  bridgeDeviceId: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @OneToMany(() => WeighingMedia, (media) => media.weighing)
  media: WeighingMedia[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
