import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { Tenant } from '../../employee-management/entities/tenant.entity';
import { Cattle } from './cattle.entity';
import { CattleCharacteristicEnum } from '../enums/cattle-characteristic.enum';

@Entity({ name: 'cattle_characteristics' })
@Unique('ux_cattle_characteristics_unique', ['cattle', 'characteristic'])
export class CattleCharacteristic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Tenant, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_tenant' })
  idTenant: Tenant;

  @Column({ name: 'id_cattle', type: 'uuid', nullable: false })
  idCattle: string;

  @ManyToOne(() => Cattle, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id_cattle' })
  cattle: Cattle;

  @Column({
    type: 'enum',
    enum: CattleCharacteristicEnum,
    enumName: 'characteristics_enum',
  })
  characteristic: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;
}
