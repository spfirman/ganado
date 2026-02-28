"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMassiveEventTablesAndHistories1710000000012 = void 0;
class CreateMassiveEventTablesAndHistories1710000000012 {
    name = 'CreateMassiveEventTablesAndHistories1710000000012';
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "massive_events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "name" varchar(100),
        "event_date" timestamp NOT NULL,
        "status" varchar(20) NOT NULL DEFAULT 'open',
        "created_by" uuid REFERENCES users(id),
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "pk_massive_events" PRIMARY KEY ("id"),
        CONSTRAINT "fk_massive_events_tenant" FOREIGN KEY ("id_tenant") REFERENCES "tenants"("id") ON DELETE CASCADE
      );
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_device_assignments"
      RENAME TO "cattle_device_history";
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_device_history"
      ADD COLUMN "id_tenant" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      ADD COLUMN "assigned_by" uuid NULL REFERENCES users(id),
      ADD COLUMN "idMassiveEvent" uuid NULL REFERENCES massive_events(id),
      ADD CONSTRAINT "fk_cattle_device_assignments_tenant" FOREIGN KEY ("id_tenant") REFERENCES "tenants"("id") ON DELETE CASCADE,
      ADD CONSTRAINT "fk_cattle_device_cattle_id" FOREIGN KEY ("idMassiveEvent") REFERENCES "massive_events"("id") ON DELETE CASCADE;
    `);
        await queryRunner.query(`CREATE TYPE "simple_event_type_enum" AS ENUM (
      'weight', 'eartag', 'tracker', 'brand', 'castration', 'medication');
    `);
        await queryRunner.query(`
      CREATE TABLE "simple_events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "id_massive_event" uuid NOT NULL REFERENCES massive_events(id) ON DELETE CASCADE,
        "type" simple_event_type_enum NOT NULL, -- medication, weight, castration, brand, tracker, eartag
        "data" jsonb,
        "created_at" timestamp DEFAULT now(),
        CONSTRAINT "pk_simple_events" PRIMARY KEY ("id")
      );
    `);
        await queryRunner.query(`
      CREATE TABLE "animal_simple_event" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "id_massive_event" uuid NOT NULL REFERENCES massive_events(id) ON DELETE CASCADE,
        "id_simple_event" uuid NOT NULL REFERENCES simple_events(id) ON DELETE CASCADE,
        "id_animal" uuid,
        "provisional_number" varchar(50),
        "data" jsonb,
        "applied_at" timestamp DEFAULT now(),
        "applied_by" uuid REFERENCES users(id),
        CONSTRAINT "pk_simple_event_cattle" PRIMARY KEY ("id")
      );
    `);
        await queryRunner.query(`
      CREATE TABLE "cattle_medication_history" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "id_cattle" uuid NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
        "medication_name" varchar(100) NOT NULL,
        "route" varchar(50) NOT NULL,
        "dosage" varchar(50),
        "lot" varchar(50),
        "applied_at" timestamp NOT NULL,
        "idMassiveEvent" uuid REFERENCES massive_events(id),
        "recorded_by" uuid REFERENCES users(id),
        CONSTRAINT "pk_cattle_medication_history" PRIMARY KEY ("id")
      );
    `);
        await queryRunner.query(`
      CREATE TABLE "cattle_weight_history" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "id_cattle" uuid NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
        "weight" numeric(6,2) NOT NULL,
        "date" timestamp NOT NULL,
        "idMassiveEvent" uuid REFERENCES massive_events(id),
        "recorded_by" uuid REFERENCES users(id),
        CONSTRAINT "pk_cattle_weight_history" PRIMARY KEY ("id")
      );
    `);
        await queryRunner.query(`
      CREATE TABLE "cattle_eartag_history" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "id_cattle" uuid NOT NULL REFERENCES cattle(id) ON DELETE CASCADE,
        "eartag_number" varchar(50) NOT NULL,
        "assigned_at" timestamp DEFAULT now(),
        "assigned_by" uuid REFERENCES users(id),
        "idMassiveEvent" uuid REFERENCES massive_events(id),
        CONSTRAINT "pk_cattle_eartag_history" PRIMARY KEY ("id")
      );
    `);
        await queryRunner.query(`
      CREATE TABLE "brands" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "name" varchar(100) NOT NULL,
        "image_url" text,
        "image" BYTEA NOT NULL,
        "imageMimeType" varchar(50) NOT NULL,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "pk_brands" PRIMARY KEY ("id")
      );
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      DROP COLUMN "brand",
      ADD COLUMN "id_brand" uuid REFERENCES brands(id),
      ADD COLUMN "last_weight" numeric(6,2),
      ADD COLUMN "eartag" varchar(50),
      ADD COLUMN "castrated" boolean DEFAULT false,
      ADD COLUMN "castration_date" timestamp;
    `);
        await queryRunner.query(`
      INSERT INTO modules (id, code, name, description, access_details) VALUES
      (uuid_generate_v4(), 'MASSIVE_EVENTS', 'Eventos Masivos', 'Gestión de eventos masivos', '{"massive_events":"CRUDL","cattle": "0RU0L", "simple_events":"CRUDL", "animal_simple_events":"CRUDL"}');
    `);
        await queryRunner.query(`ALTER TABLE devices RENAME COLUMN id_chipstack TO id_chirpstack_profile;`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE devices RENAME COLUMN id_chirpstack_profile TO id_chipstack;`);
        await queryRunner.query(`
      ALTER TABLE "cattle_device_history"
      DROP COLUMN "id_tenant",
      DROP COLUMN "assigned_by",
      DROP COLUMN "idMassiveEvent";
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_device_history"
      RENAME TO "cattle_device_assignments";
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      ADD COLUMN "brand" varchar(50),
      DROP COLUMN "id_brand",
      DROP COLUMN "last_weight",
      DROP COLUMN "eartag",
      DROP COLUMN "castrated",
      DROP COLUMN "castration_date";
    `);
        await queryRunner.query(`DROP TABLE IF EXISTS "cattle_eartag_history";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "cattle_weight_history";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "cattle_medication_history";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "animal_simple_event";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "simple_events";`);
        await queryRunner.query(`DROP TYPE IF EXISTS "simple_event_type_enum";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "massive_events";`);
        await queryRunner.query(`DROP TABLE IF EXISTS "brands";`);
        await queryRunner.query(`DELETE FROM modules WHERE code = 'MASSIVE_EVENTS';`);
    }
}
exports.CreateMassiveEventTablesAndHistories1710000000012 = CreateMassiveEventTablesAndHistories1710000000012;
//# sourceMappingURL=1710000000012-CreateMassiveEventTablesAndHistories.js.map