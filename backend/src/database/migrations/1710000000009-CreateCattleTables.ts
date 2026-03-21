import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCattleTables1710000000009 implements MigrationInterface {
    name = 'CreateCattleTables1710000000009';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      UPDATE modules SET access_details = '{"brands": "CRUDL", "cattles":"CRUDL"}' WHERE code = 'FARM';
    `);
        await queryRunner.query(`
      CREATE TABLE cattle (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        id_tenant UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        id_device UUID REFERENCES devices(id) ON DELETE SET NULL,
        sys_number VARCHAR(50) NOT NULL,
        number VARCHAR(50) NOT NULL,
        brand VARCHAR(50),
        color_description VARCHAR(100),
        color_main VARCHAR(25),
        color_feature VARCHAR(30),
        lot VARCHAR(10),
        received_at DATE NOT NULL,
        received_weight NUMERIC(6,2) NOT NULL,
        purchase_weight NUMERIC(6,2) NOT NULL,
        comments TEXT,
        purchased_from VARCHAR(100) NOT NULL,
        purchase_price NUMERIC(10,2) NOT NULL,
        purchase_commission NUMERIC(10,2),
        negotiated_price_per_kg NUMERIC(10,2),
        lot_price_per_weight NUMERIC(10,2),
        sale_price NUMERIC(10,2),
        sale_price_per_kg NUMERIC(10,2),
        sale_weight NUMERIC(6,2),
        average_gr NUMERIC(6,2),
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now()
      );
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_cattle_tenant_sys_number" ON "cattle" ("id_tenant", "sys_number");
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_cattle_tenant_number" ON "cattle" ("id_tenant", "number");
    `);
        await queryRunner.query(`
      CREATE TABLE cattle_device_assignments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        id_cattle UUID REFERENCES cattle(id) ON DELETE CASCADE NOT NULL,
        id_device UUID REFERENCES devices(id) NOT NULL,
        assigned_at TIMESTAMP DEFAULT now(),
        unassigned_at TIMESTAMP
      );
    `);
        await queryRunner.query(`
     CREATE INDEX "idx_id_cattle_id_device_assignments" ON "cattle_device_assignments" ("id_cattle", "id_device");
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX "unique_active_device_assignment" ON "cattle_device_assignments" ("id_device") WHERE "unassigned_at" IS NULL;
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_id_cattle_id_device_assignments";
    `);
        await queryRunner.query(`
      DROP INDEX IF EXISTS "unique_active_device_assignment";
    `);
        await queryRunner.query(`
      DROP TABLE IF EXISTS cattle_device_assignments;
    `);
        await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_cattle_tenant_sys_number";
    `);
        await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_cattle_tenant_number";
    `);
        await queryRunner.query(`
      DROP TABLE IF EXISTS cattle;
    `);
    }
}
