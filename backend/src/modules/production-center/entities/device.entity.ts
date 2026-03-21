import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DeviceProfile } from './device-profile.entity';

@Entity('devices')
export class Device {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 32, nullable: false, unique: true })
  deveui: string;

  @Column({ name: 'id_tenant', type: 'uuid', nullable: false })
  idTenant: string;

  @Column({ name: 'id_device_profile', type: 'uuid', nullable: false })
  idDeviceProfile: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb', default: {} })
  tags: Record<string, any>;

  @Column({ type: 'jsonb', default: {} })
  variables: Record<string, any>;

  @Column({ name: 'id_chirpstack_profile', type: 'uuid', nullable: true })
  idChirpstackProfile: string;

  @Column({ name: 'cs_application_id', type: 'uuid', nullable: false })
  csApplicationId: string;

  @Column({ name: 'cs_joineui', type: 'varchar', length: 16, nullable: true })
  csJoineui: string;

  @Column({ name: 'cs_app_key', type: 'varchar', length: 32, nullable: true })
  csAppKey: string;

  @Column({ name: 'cs_nwk_key', type: 'varchar', length: 32, nullable: true })
  csNwkKey: string;

  @Column({ name: 'battery_status', length: 100, nullable: true })
  batteryStatus: string;

  @Column({ name: 'battery_update', nullable: true })
  batteryUpdate: Date;

  @Column({ name: 'is_active', type: 'boolean', default: true, nullable: false })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: false })
  updatedAt: Date;

  @ManyToOne(() => DeviceProfile)
  @JoinColumn({ name: 'id_device_profile' })
  deviceProfile: DeviceProfile;
}
