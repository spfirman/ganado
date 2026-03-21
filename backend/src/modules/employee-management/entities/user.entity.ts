import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinColumn, JoinTable } from 'typeorm';
import { Tenant } from './tenant.entity';
import { Role } from './role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  username: string;

  @Column({ name: 'pass_word', length: 60, nullable: false })
  password: string;

  @Column({ name: 'active', type: 'boolean', default: true })
  active: boolean;

  @Column({ name: 'first_name', length: 50, nullable: true })
  firstName: string;

  @Column({ name: 'last_name', length: 50, nullable: true })
  lastName: string;

  @Column({ length: 150, nullable: false })
  email: string;

  @Column({ name: 'id_tenant', nullable: false })
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'id_tenant' })
  tenant: Tenant;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'id_user',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'id_role',
      referencedColumnName: 'id',
    },
  })
  roles: Role[];
}
