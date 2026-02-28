"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDevicesAndDeviceProfilesTables1710000000007 = void 0;
class CreateDevicesAndDeviceProfilesTables1710000000007 {
    name = 'CreateDevicesAndDeviceProfilesTables1710000000007';
    async up(queryRunner) {
        await queryRunner.query(`
      UPDATE modules SET access_details = '{"device_profiles":"CRUDL", "devices":"CRUDL"}' WHERE code = 'PROD_CENTER';
    `);
        await queryRunner.query(`
      CREATE TABLE "device_profiles" (
        "id" uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
        "id_tenant" uuid NOT NULL,
        "name" varchar(50) NOT NULL,
        "description" varchar(255),
        "id_chipstack" uuid,
        "cs_application_id" uuid,
        "cs_joineui" varchar(16),
        "cs_app_key" varchar(32),
        "cs_nwk_key" varchar(32),
        "fcc_id" varchar(40),
        "regions" varchar(50),
        "model" varchar(50),
        "input" varchar(100),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "device_profiles_tenant_fkey" FOREIGN KEY ("id_tenant") REFERENCES "tenants"("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "devices" (
        "id" uuid NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
        "id_tenant" uuid NOT NULL,
        "id_chipstack" uuid,
        "id_device_profile" uuid NOT NULL,
        "deveui" varchar(32) UNIQUE NOT NULL,
        "name" varchar(50) NOT NULL,
        "description" varchar(255),
        "tags" jsonb,
        "variables" jsonb,
        "battery_status" varchar(100),
        "battery_update" TIMESTAMP,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "devices_device_profile_fkey" FOREIGN KEY ("id_device_profile") REFERENCES "device_profiles"("id"),
        CONSTRAINT "devices_tenant_fkey" FOREIGN KEY ("id_tenant") REFERENCES "tenants"("id")
      )
    `);
        await queryRunner.query(`
      CREATE UNIQUE INDEX idx_device_profiles_tenant_name ON "public".device_profiles ( id_tenant, name );
    `);
        await queryRunner.query(`
      CREATE INDEX "idx_devices_deveui" ON "devices" ("deveui")
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX "idx_device_profiles_tenant_name"`);
        await queryRunner.query(`DROP INDEX "idx_devices_deveui"`);
        await queryRunner.query(`DROP TABLE "devices"`);
        await queryRunner.query(`DROP TABLE "device_profiles"`);
        await queryRunner.query(`UPDATE modules SET access_details = '{}' WHERE code = 'PROD_CENTER';`);
    }
}
exports.CreateDevicesAndDeviceProfilesTables1710000000007 = CreateDevicesAndDeviceProfilesTables1710000000007;
//# sourceMappingURL=1710000000007-CreateDevicesAndDeviceProfilesTables.js.map