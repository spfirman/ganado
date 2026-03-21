import { MigrationInterface, QueryRunner } from 'typeorm';

export class Location1710000000010 implements MigrationInterface {
    name = 'Location1710000000010';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      CREATE TABLE location (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_tenant UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        id_device UUID REFERENCES devices(id) ON DELETE SET NULL,
        id_cattle UUID REFERENCES cattle(id) ON DELETE SET NULL,
        latitude NUMERIC(10,6) NOT NULL,
        longitude NUMERIC(10,6) NOT NULL,
        altitude NUMERIC(10,6),
        time TIMESTAMP,
        created_at TIMESTAMP DEFAULT now()
      );
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_location_tenant_id_tenant" ON "location" ("id_tenant");
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_location_tenant_id_device" ON "location" ("id_device");
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_location_tenant_id_cattle" ON "location" ("id_cattle");
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "idx_location_tenant_id_tenant"`);
        await queryRunner.query(`DROP INDEX "idx_location_tenant_id_device"`);
        await queryRunner.query(`DROP INDEX "idx_location_tenant_id_cattle"`);
        await queryRunner.query(`DROP TABLE location`);
    }
}
