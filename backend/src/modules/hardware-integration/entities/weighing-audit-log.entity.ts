import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('weighing_audit_log')
export class WeighingAuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'weighing_id', type: 'uuid' })
  weighingId: string;

  @Column({ name: 'field_changed', type: 'varchar', length: 50 })
  fieldChanged: string;

  @Column({ name: 'old_value', type: 'text', nullable: true })
  oldValue: string | null;

  @Column({ name: 'new_value', type: 'text', nullable: true })
  newValue: string | null;

  @Column({ name: 'changed_by', type: 'uuid' })
  changedBy: string;

  @CreateDateColumn({ name: 'changed_at' })
  changedAt: Date;
}
