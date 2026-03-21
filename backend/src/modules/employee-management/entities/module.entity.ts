import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RoleModulePermission } from './role-module-permission.entity';

@Entity('modules')
export class ModuleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, nullable: false, unique: true })
  code: string;

  @Column({ length: 100, nullable: false, unique: true })
  name: string;

  @Column({ length: 250, nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  access_details: any;

  @OneToMany(() => RoleModulePermission, permission => permission.module)
  permissions: RoleModulePermission[];
}
