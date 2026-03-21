import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('contacts')
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ length: 150 })
  name: string;

  @Column({ name: 'phone_1', length: 50, nullable: true })
  phone1: string;

  @Column({ name: 'phone_2', length: 50, nullable: true })
  phone2: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
