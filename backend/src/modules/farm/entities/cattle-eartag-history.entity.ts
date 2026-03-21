import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('cattle_eartag_history')
export class CattleEartagHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'id_cattle', type: 'uuid' })
  idCattle: string;

  @Column({ name: 'data', type: 'jsonb' })
  data: any;

  @CreateDateColumn({ name: 'assigned_at', type: 'timestamp' })
  assignedAt: Date;

  @Column({ name: 'assigned_by', type: 'uuid', nullable: true })
  assignedBy: string;

  @Column({ name: 'idMassiveEvent', type: 'uuid', nullable: true })
  idMassiveEvent: string;
}
