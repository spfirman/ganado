import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('device_profiles')
export class DeviceProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid', nullable: false })
  idTenant: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ name: 'id_chipstack', type: 'uuid', nullable: false })
  idChipstack: string;

  @Column({ name: 'cs_application_id', type: 'uuid', nullable: false })
  csApplicationId: string;

  @Column({ name: 'cs_joineui', type: 'varchar', length: 16, nullable: false })
  csJoineui: string;

  @Column({ name: 'cs_app_key', type: 'varchar', length: 32, nullable: true })
  csAppKey: string;

  @Column({ name: 'cs_nwk_key', type: 'varchar', length: 32, nullable: false })
  csNwkKey: string;

  @Column({ name: 'fcc_id', type: 'varchar', length: 40, nullable: false })
  fccId: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  regions: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  model: string;

  @Column({ length: 100, nullable: true })
  input: string;

  @CreateDateColumn({ name: 'created_at', type: 'date', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'date', nullable: false })
  updatedAt: Date;
}
