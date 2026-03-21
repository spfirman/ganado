import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { BridgeDeviceType, BridgeDeviceStatus } from '../enums/weighing-source.enum';

@Entity('bridge_devices')
@Index(['idTenant'])
export class BridgeDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ length: 100 })
  name: string;

  @Column({
    type: 'enum',
    enum: BridgeDeviceType,
    enumName: 'bridge_device_type_enum',
  })
  type: BridgeDeviceType;

  @Column({ name: 'ip_address', type: 'varchar', length: 45, nullable: true })
  ipAddress: string | null;

  @Column({
    type: 'enum',
    enum: BridgeDeviceStatus,
    enumName: 'bridge_device_status_enum',
    default: BridgeDeviceStatus.OFFLINE,
  })
  status: BridgeDeviceStatus;

  @Column({ name: 'last_seen_at', type: 'timestamp with time zone', nullable: true })
  lastSeenAt: Date | null;

  @Column({ name: 'config_json', type: 'jsonb', default: '{}' })
  configJson: Record<string, any>;

  @Column({ name: 'api_key', type: 'varchar', length: 128, nullable: true })
  apiKey: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
