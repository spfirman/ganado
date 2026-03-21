"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location1710000000010 = void 0;
class Location1710000000010 {
    constructor() {
        this.name = 'Location1710000000010';
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_location_tenant_id_tenant"`);
        await queryRunner.query(`DROP INDEX "idx_location_tenant_id_device"`);
        await queryRunner.query(`DROP INDEX "idx_location_tenant_id_cattle"`);
        await queryRunner.query(`DROP TABLE location`);
    }
}
exports.Location1710000000010 = Location1710000000010;
//# sourceMappingURL=1710000000010-Location.js.map