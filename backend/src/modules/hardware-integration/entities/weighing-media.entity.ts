import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Weighing } from './weighing.entity';
import { WeighingMediaType } from '../enums/weighing-source.enum';

@Entity('weighing_media')
export class WeighingMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ name: 'weighing_id', type: 'uuid' })
  weighingId: string;

  @ManyToOne(() => Weighing, (weighing) => weighing.media, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'weighing_id' })
  weighing: Weighing;

  @Column({
    type: 'enum',
    enum: WeighingMediaType,
    enumName: 'weighing_media_type_enum',
  })
  type: WeighingMediaType;

  @Column({ type: 'text' })
  url: string;

  @Column({ name: 'thumbnail_url', type: 'text', nullable: true })
  thumbnailUrl: string | null;

  @Column({ name: 'captured_at', type: 'timestamp with time zone', nullable: true })
  capturedAt: Date | null;

  @Column({ name: 'file_size_bytes', type: 'integer', nullable: true })
  fileSizeBytes: number | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
