import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Sale } from './sale.entity';
import { Cattle } from '../../farm/entities/cattle.entity';

@Entity('sale_details')
export class SaleDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sale_id', type: 'uuid' })
  saleId: string;

  @ManyToOne(() => Sale)
  @JoinColumn({ name: 'sale_id' })
  sale: Sale;

  @Column({ name: 'cattle_id', type: 'uuid' })
  cattleId: string;

  @ManyToOne(() => Cattle)
  @JoinColumn({ name: 'cattle_id' })
  cattle: Cattle;

  @Column({ name: 'measured_weight', type: 'numeric', precision: 6, scale: 2 })
  measuredWeight: number;

  @Column({ name: 'is_approved', type: 'boolean' })
  isApproved: boolean;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'tracker_removed', type: 'boolean', default: false })
  trackerRemoved: boolean;

  @Column({ name: 'calculated_price', type: 'numeric', precision: 10, scale: 2 })
  calculatedPrice: number;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
