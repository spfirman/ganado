import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../employee-management/entities/user.entity';

@Entity('login_passcodes')
export class LoginPasscode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'code_hash', length: 64 })
  codeHash: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  used: boolean;

  @Column({ default: 0 })
  attempts: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
