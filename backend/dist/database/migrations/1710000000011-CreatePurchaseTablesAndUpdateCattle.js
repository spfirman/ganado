"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePurchaseTablesAndUpdateCattle1710000000011 = void 0;
class CreatePurchaseTablesAndUpdateCattle1710000000011 {
    constructor() {
        this.name = 'CreatePurchaseTablesAndUpdateCattle1710000000011';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "providers" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "name" varchar(150) NOT NULL,
        "nit" varchar(20) NOT NULL,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        CONSTRAINT "pk_provider_id" PRIMARY KEY ("id"),
        CONSTRAINT "uq_provider_tenant_nit" UNIQUE ("id_tenant", "nit")
      );
    `);
        await queryRunner.query(`
      CREATE TABLE "purchases" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "purchase_date" date NOT NULL,
        "id_provider" uuid,
        "total_cattle" integer NOT NULL DEFAULT 0,
        "total_weight" numeric(10,2) NOT NULL DEFAULT 0,
        "created_by" uuid,
        "updated_by" uuid,
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        CONSTRAINT "pk_purchase_id" PRIMARY KEY ("id"),
        CONSTRAINT "fk_purchase_provider" FOREIGN KEY ("id_provider") REFERENCES "providers"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_purchase_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "fk_purchase_updated_by" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE SET NULL
      );
    `);
        await queryRunner.query(`
      CREATE TABLE "lots" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "id_tenant" UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        "id_purchase" uuid,
        "lot_number" varchar(5) NOT NULL,
        "origin_place" varchar(150),
        "purchased_cattle_count" integer NOT NULL,
        "average_weight" numeric(8,2),
        "total_weight" numeric(10,2),
        "price_per_kg" numeric(10,2),
        "total_value" numeric(12,2),
        "age" varchar(50),
        "sex" varchar(20),
        "created_at" TIMESTAMP DEFAULT now(),
        "updated_at" TIMESTAMP DEFAULT now(),
        CONSTRAINT "pk_lot_id" PRIMARY KEY ("id"),
        CONSTRAINT "fk_lot_purchase" FOREIGN KEY ("id_purchase") REFERENCES "purchases"("id") ON DELETE CASCADE,
        CONSTRAINT "uq_lot_number_per_purchase" UNIQUE ("id_purchase", "lot_number")
      );
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      ADD COLUMN "id_purchase" uuid,
      ADD COLUMN "id_lot" uuid,
      ADD COLUMN "id_provider" uuid,
      ADD CONSTRAINT "fk_cattle_purchase" FOREIGN KEY ("id_purchase") REFERENCES "purchases"("id") ON DELETE SET NULL,
      ADD CONSTRAINT "fk_cattle_lot" FOREIGN KEY ("id_lot") REFERENCES "lots"("id") ON DELETE SET NULL,
      ADD CONSTRAINT "fk_cattle_provider" FOREIGN KEY ("id_provider") REFERENCES "providers"("id") ON DELETE SET NULL;
    `);
        await queryRunner.query(`
      INSERT INTO modules (id, code, name, description, access_details) VALUES
      (uuid_generate_v4(), 'COMMERCE', 'Commerce', 'Gestión de compras y ventas', '{"providers":"CRUDL", "purchases":"CRUDL", "lots":"CRUDL"}')
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "cattle"
      DROP CONSTRAINT "fk_cattle_provider",
      DROP CONSTRAINT "fk_cattle_lot",
      DROP CONSTRAINT "fk_cattle_purchase",
      DROP COLUMN "id_provider",
      DROP COLUMN "id_lot",
      DROP COLUMN "id_purchase";
    `);
        await queryRunner.query(`DROP TABLE "lots";`);
        await queryRunner.query(`DROP TABLE "purchases";`);
        await queryRunner.query(`DROP TABLE "providers";`);
        await queryRunner.query(`
      DELETE FROM modules WHERE code = 'COMMERCE';
    `);
    }
}
exports.CreatePurchaseTablesAndUpdateCattle1710000000011 = CreatePurchaseTablesAndUpdateCattle1710000000011;
//# sourceMappingURL=1710000000011-CreatePurchaseTablesAndUpdateCattle.js.map