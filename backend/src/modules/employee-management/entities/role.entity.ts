import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { RoleModulePermission } from './role-module-permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, nullable: false, unique: true })
  code: string;

  @Column({ length: 100, nullable: false, unique: true })
  name: string;

  @Column({ length: 250, nullable: true })
  description: string;

  @ManyToMany(() => User, user => user.roles)
  users: User[];

  @OneToMany(() => RoleModulePermission, permission => permission.role)
  permissions: RoleModulePermission[];
}
