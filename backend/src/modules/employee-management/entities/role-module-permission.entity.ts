import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';
import { ModuleEntity } from './module.entity';

@Entity('role_module_permissions')
export class RoleModulePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_role' })
  id_role: string;

  @Column({ name: 'id_module' })
  id_module: string;

  @Column({ name: 'tenant_id' })
  tenant_id: string;

  @Column({ name: 'can_create', default: false })
  can_create: boolean;

  @Column({ name: 'can_read', default: false })
  can_read: boolean;

  @Column({ name: 'can_update', default: false })
  can_update: boolean;

  @Column({ name: 'can_delete', default: false })
  can_delete: boolean;

  @Column({ name: 'can_list', default: false })
  can_list: boolean;

  @ManyToOne(() => Role, role => role.permissions)
  @JoinColumn({ name: 'id_role' })
  role: Role;

  @ManyToOne(() => ModuleEntity)
  @JoinColumn({ name: 'id_module' })
  module: ModuleEntity;
}
