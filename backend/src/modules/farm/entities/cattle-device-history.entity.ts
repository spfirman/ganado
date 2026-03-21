import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('cattle_device_history')
export class CattleDeviceHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'id_cattle', type: 'uuid' })
  idCattle: string;

  @Column({ name: 'id_device', type: 'uuid' })
  idDevice: string;

  @CreateDateColumn({ name: 'assigned_at', type: 'timestamp' })
  assignedAt: Date;

  @Column({ name: 'unassigned_at', type: 'timestamp', nullable: true })
  unassignedAt: Date;

  @Column({ name: 'assigned_by', type: 'uuid', nullable: true })
  assignedBy: string;

  @Column({ name: 'idMassiveEvent', type: 'uuid', nullable: true })
  idMassiveEvent: string;
}
