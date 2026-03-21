import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tenants')
export class Tenant {
  @ApiProperty({
    description: 'ID unico del tenant',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Nombre del tenant',
    example: 'Finca Los Alamos',
    required: false,
  })
  @Column({ length: 150, nullable: true })
  name: string;

  @ApiProperty({
    description: 'Nombre de usuario de la compania',
    example: 'finca_alamos',
    required: true,
  })
  @Column({ length: 50, unique: true, nullable: false })
  company_username: string;

  @ApiProperty({
    description: 'Estado del tenant',
    example: true,
    required: false,
    default: true,
  })
  @Column({ default: true, nullable: true })
  status: boolean;

  @OneToMany(() => User, user => user.tenant)
  users: User[];
}
