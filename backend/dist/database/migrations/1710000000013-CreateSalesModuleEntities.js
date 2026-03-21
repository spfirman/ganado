"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSalesModuleEntities1710000000013 = void 0;
class CreateSalesModuleEntities1710000000013 {
    constructor() {
        this.name = 'CreateSalesModuleEntities1710000000013';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "contacts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "id_tenant" uuid NOT NULL, "name" character varying(150) NOT NULL, "phone_1" character varying(50), "phone_2" character varying(50), "email" character varying(150), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b99cd40cfd66a99f1571f4f72e6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sales" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_date" TIMESTAMP NOT NULL, "buyer_id" uuid NOT NULL, "transporter_id" uuid, "min_weight_config" numeric(10,2) NOT NULL, "value_per_kg_config" numeric(10,2) NOT NULL, "total_animal_count" integer NOT NULL, "total_weight_kg" numeric(10,2) NOT NULL, "total_amount" numeric(12,2) NOT NULL, "notes" text, "id_tenant" uuid NOT NULL, "created_by" uuid, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4f0bc990ae81dba46da680895ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "sale_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "sale_id" uuid NOT NULL, "cattle_id" uuid NOT NULL, "measured_weight" numeric(6,2) NOT NULL, "is_approved" boolean NOT NULL, "rejection_reason" text, "tracker_removed" boolean NOT NULL DEFAULT false, "calculated_price" numeric(10,2) NOT NULL, "id_tenant" uuid NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a8e8b6d243f38e3587378d401f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."cattle_status_enum" AS ENUM('ACTIVE', 'SOLD', 'DEAD', 'LOST')`);
        await queryRunner.query(`ALTER TABLE "cattle" ADD "status" "public"."cattle_status_enum" NOT NULL DEFAULT 'ACTIVE'`);
        await queryRunner.query(`CREATE TYPE "public"."providers_type_enum" AS ENUM('BUYER', 'TRANSPORTER', 'VET', 'PROVIDER', 'OTHER')`);
        await queryRunner.query(`ALTER TABLE "providers" ADD "type" "public"."providers_type_enum" NOT NULL DEFAULT 'OTHER'`);
        await queryRunner.query(`ALTER TABLE "providers" ADD "address" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "providers" ADD "contact_person_id" uuid`);
        await queryRunner.query(`ALTER TABLE "providers" ADD CONSTRAINT "FK_providers_contact_person" FOREIGN KEY ("contact_person_id") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_fb465726b1745ecff7eea073e0e" FOREIGN KEY ("buyer_id") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sales" ADD CONSTRAINT "FK_1dce894d11886cb53ef56f43e7c" FOREIGN KEY ("transporter_id") REFERENCES "providers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_details" ADD CONSTRAINT "FK_245bcd4eb6fe045d6925d9a0a29" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sale_details" ADD CONSTRAINT "FK_bba7b25a998e3210bbf1b5d19c0" FOREIGN KEY ("cattle_id") REFERENCES "cattle"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        const commerceParams = await queryRunner.query(`SELECT access_details FROM modules WHERE code = 'COMMERCE'`);
        if (commerceParams && commerceParams.length > 0) {
            let details = commerceParams[0].access_details;
            if (typeof details === 'string') {
                details = JSON.parse(details);
            }
            details['sales'] = 'CRUDL';
            await queryRunner.query(`UPDATE modules SET access_details = '${JSON.stringify(details)}' WHERE code = 'COMMERCE'`);
        }
    }
    async down(queryRunner) {
        const commerceParams = await queryRunner.query(`SELECT access_details FROM modules WHERE code = 'COMMERCE'`);
        if (commerceParams && commerceParams.length > 0) {
            let details = commerceParams[0].access_details;
            if (typeof details === 'string') {
                details = JSON.parse(details);
            }
            if (details['sales']) {
                delete details['sales'];
                await queryRunner.query(`UPDATE modules SET access_details = '${JSON.stringify(details)}' WHERE code = 'COMMERCE'`);
            }
        }
        await queryRunner.query(`ALTER TABLE "sale_details" DROP CONSTRAINT "FK_bba7b25a998e3210bbf1b5d19c0"`);
        await queryRunner.query(`ALTER TABLE "sale_details" DROP CONSTRAINT "FK_245bcd4eb6fe045d6925d9a0a29"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_1dce894d11886cb53ef56f43e7c"`);
        await queryRunner.query(`ALTER TABLE "sales" DROP CONSTRAINT "FK_fb465726b1745ecff7eea073e0e"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP CONSTRAINT IF EXISTS "FK_providers_contact_person"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN IF EXISTS "contact_person_id"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "providers" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."providers_type_enum"`);
        await queryRunner.query(`ALTER TABLE "cattle" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."cattle_status_enum"`);
        await queryRunner.query(`DROP TABLE "sale_details"`);
        await queryRunner.query(`DROP TABLE "sales"`);
        await queryRunner.query(`DROP TABLE IF EXISTS "contacts"`);
    }
}
exports.CreateSalesModuleEntities1710000000013 = CreateSalesModuleEntities1710000000013;
//# sourceMappingURL=1710000000013-CreateSalesModuleEntities.js.map