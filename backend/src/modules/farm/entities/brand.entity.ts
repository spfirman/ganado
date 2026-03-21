import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('brands')
export class Brand {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ name: 'id_tenant', type: 'uuid' })
  idTenant: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @Column({ type: 'bytea', nullable: false })
  image: Buffer;

  @Column({ type: 'varchar', length: 50, nullable: false })
  imageMimeType: string;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;
}
