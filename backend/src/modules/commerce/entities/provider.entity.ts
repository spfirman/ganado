import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { IsNotEmpty } from 'class-validator';
import { Contact } from './contact.entity';

export enum ProviderType {
  BUYER = 'BUYER',
  TRANSPORTER = 'TRANSPORTER',
  VET = 'VET',
  OTHER = 'OTHER',
  PROVIDER = 'PROVIDER',
}

@Unique(['nit', 'idTenant'])
@Entity('providers')
export class Provider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ length: 150 })
  name: string;

  @Column({ length: 20, nullable: false })
  @IsNotEmpty()
  nit: string;

  @Column({
    type: 'enum',
    enum: ProviderType,
    default: ProviderType.OTHER,
  })
  type: string;

  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ name: 'contact_person_id', type: 'uuid', nullable: true })
  contactPersonId: string;

  @ManyToOne(() => Contact, { nullable: true })
  @JoinColumn({ name: 'contact_person_id' })
  contactPerson: Contact;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
