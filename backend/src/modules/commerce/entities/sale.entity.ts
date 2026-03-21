import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Provider } from './provider.entity';
import { SaleDetail } from './sale-detail.entity';

@Entity('sales')
export class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_date', type: 'timestamp' })
  transactionDate: Date;

  @Column({ name: 'buyer_id', type: 'uuid' })
  buyerId: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'buyer_id' })
  buyer: Provider;

  @Column({ name: 'transporter_id', type: 'uuid', nullable: true })
  transporterId: string;

  @ManyToOne(() => Provider)
  @JoinColumn({ name: 'transporter_id' })
  transporter: Provider;

  @Column({ name: 'min_weight_config', type: 'numeric', precision: 10, scale: 2 })
  minWeightConfig: number;

  @Column({ name: 'value_per_kg_config', type: 'numeric', precision: 10, scale: 2 })
  valuePerKgConfig: number;

  @Column({ name: 'total_animal_count', type: 'int' })
  totalAnimalCount: number;

  @Column({ name: 'total_weight_kg', type: 'numeric', precision: 10, scale: 2 })
  totalWeightKg: number;

  @Column({ name: 'total_amount', type: 'numeric', precision: 12, scale: 2 })
  totalAmount: number;

  @Column({ name: 'notes', type: 'text', nullable: true })
  notes: string;

  @OneToMany(() => SaleDetail, (detail) => detail.sale)
  details: SaleDetail[];

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'created_by', type: 'uuid', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
