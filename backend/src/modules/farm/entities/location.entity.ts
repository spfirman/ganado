import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('location')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant' })
  idTenant: string;

  @Column({ name: 'id_device' })
  idDevice: string;

  @Column({ name: 'id_cattle' })
  idCattle: string;

  @Column('numeric', { precision: 10, scale: 6 })
  latitude: number;

  @Column('numeric', { precision: 10, scale: 6 })
  longitude: number;

  @Column('numeric', { precision: 10, scale: 6, nullable: true })
  altitude: number;

  @Column({ name: 'time' })
  time: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
