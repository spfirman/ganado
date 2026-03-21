import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Purchase } from './purchase.entity';
import { CattleGender } from '../../farm/enums/cattle-gender.enum';

@Entity('lots')
export class Lot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'lot_number', length: 5 })
  lotNumber: string;

  @Column({ name: 'origin_place', length: 150, nullable: true })
  originPlace: string;

  @Column({ name: 'purchased_cattle_count', type: 'int', default: 0 })
  purchasedCattleCount: number;

  @Column({ name: 'received_cattle_count', type: 'int', default: 0 })
  receivedCattleCount: number;

  @Column({ name: 'average_weight', type: 'numeric', precision: 8, scale: 2, nullable: true })
  averageWeight: number;

  @Column({ name: 'total_weight', type: 'numeric', precision: 10, scale: 2, nullable: true })
  totalWeight: number;

  @Column({ name: 'received_total_weight', type: 'numeric', precision: 10, scale: 2, nullable: true })
  receivedTotalWeight: number;

  @Column({ name: 'price_per_kg', type: 'numeric', precision: 10, scale: 2, nullable: true })
  pricePerKg: number;

  @Column({ name: 'total_value', type: 'numeric', precision: 12, scale: 2, nullable: true })
  totalValue: number;

  @Column({
    type: 'enum',
    enum: CattleGender,
    enumName: 'gender_enum',
    default: CattleGender.MALE,
  })
  gender: string;

  @Column({ name: 'id_purchase', type: 'uuid', nullable: true })
  idPurchase: string;

  @ManyToOne(() => Purchase, (purchase) => purchase.lots, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_purchase' })
  purchase: Purchase;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
