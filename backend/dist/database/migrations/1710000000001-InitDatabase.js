"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitDatabase1710000000001 = void 0;
class InitDatabase1710000000001 {
    constructor() {
        this.name = 'InitDatabase1710000000001';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(150),
        "company_username" varchar(50) NOT NULL,
        "status" boolean DEFAULT true,
        CONSTRAINT "tenants_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "tenants_company_username_key" UNIQUE ("company_username")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "description" varchar(250),
        CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "id_tenant" uuid,
        "username" varchar(50) NOT NULL,
        "id_role" uuid,
        "first_name" varchar(50),
        "last_name" varchar(50),
        "pass_word" varchar(60) NOT NULL,
        "email" varchar(150) NOT NULL,
        CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "users_id_tenant_username_key" UNIQUE ("id_tenant", "username"),
        CONSTRAINT "users_id_tenant_fkey" FOREIGN KEY ("id_tenant") REFERENCES "tenants"("id"),
        CONSTRAINT "users_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id")
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
    }
}
exports.InitDatabase1710000000001 = InitDatabase1710000000001;
//# sourceMappingURL=1710000000001-InitDatabase.js.map