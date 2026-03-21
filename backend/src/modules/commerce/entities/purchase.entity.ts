import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Lot } from './lot.entity';
import { Cattle } from '../../farm/entities/cattle.entity';

@Entity('purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'purchase_date', type: 'date' })
  purchaseDate: Date;

  @Column({ name: 'total_cattle', type: 'int', default: 0 })
  totalCattle: number;

  @Column({ name: 'total_weight', type: 'numeric', precision: 10, scale: 2, default: 0 })
  totalWeight: number;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'RECEIVED'],
    default: 'OPEN',
  })
  status: string;

  @Column({ name: 'id_provider', type: 'uuid', nullable: true })
  idProvider: string;

  @OneToMany(() => Lot, (lot) => lot.purchase)
  lots: Lot[];

  @OneToMany(() => Cattle, (cattle) => cattle.purchase)
  cattle: Cattle[];

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  idCreatedBy: string;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  idUpdatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
