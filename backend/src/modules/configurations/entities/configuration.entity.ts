import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('configurations')
@Index(['idTenant', 'code'])
@Index(['idTenant'])
export class Configuration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid', nullable: false })
  idTenant: string;

  @Column({ name: 'code', type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'is_system_config', type: 'boolean', nullable: false })
  isSystemConfig: boolean;

  @Column({ name: 'name', type: 'varchar', nullable: false })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description: string;

  @Column({ name: 'value', type: 'varchar', nullable: false })
  value: string;

  @Column({ name: 'value_type', type: 'varchar', nullable: false })
  valueType: string;

  @Column({ name: 'created_at', type: 'timestamp', nullable: false })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', nullable: false })
  updatedAt: Date;

  @Column({ name: 'updated_by', type: 'uuid', nullable: true })
  updatedBy: string;
}
