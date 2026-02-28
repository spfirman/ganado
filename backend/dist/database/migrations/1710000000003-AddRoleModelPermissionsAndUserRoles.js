"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRoleModulePermissionsAndUserRoles1710000000003 = void 0;
class AddRoleModulePermissionsAndUserRoles1710000000003 {
    name = 'AddRoleModulePermissionsAndUserRoles1710000000003';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE "users" 
      ALTER COLUMN "id_tenant" SET NOT NULL,
      DROP CONSTRAINT IF EXISTS "users_id_role_fkey",
      DROP COLUMN IF EXISTS "id_role"
    `);
        await queryRunner.query(`
      ALTER TABLE "roles"
      ADD CONSTRAINT "roles_name_key" UNIQUE ("name")
    `);
        await queryRunner.query(`
      CREATE TABLE "modules" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "description" varchar(250),
        CONSTRAINT "modules_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "modules_name_key" UNIQUE ("name")
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "role_model_permissions" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "id_role" uuid NOT NULL,
        "id_module" uuid NOT NULL,
        "tenant_id" uuid NOT NULL,
        "can_create" boolean NOT NULL DEFAULT false,
        "can_read" boolean NOT NULL DEFAULT false,
        "can_update" boolean NOT NULL DEFAULT false,
        "can_delete" boolean NOT NULL DEFAULT false,
        CONSTRAINT "role_model_permissions_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "role_model_permissions_role_module_tenant_key" UNIQUE ("id_role", "id_module", "tenant_id"),
        CONSTRAINT "role_model_permissions_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id") ON DELETE CASCADE,
        CONSTRAINT "role_model_permissions_id_module_fkey" FOREIGN KEY ("id_module") REFERENCES "modules"("id") ON DELETE CASCADE,
        CONSTRAINT "role_model_permissions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE
      )
    `);
        await queryRunner.query(`
      CREATE TABLE "user_roles" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "id_user" uuid NOT NULL,
        "id_role" uuid NOT NULL,
        CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "user_roles_user_role_key" UNIQUE ("id_user", "id_role"),
        CONSTRAINT "user_roles_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "users"("id") ON DELETE CASCADE,
        CONSTRAINT "user_roles_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id") ON DELETE CASCADE
      )
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP TABLE "user_roles"`);
        await queryRunner.query(`DROP TABLE "role_model_permissions"`);
        await queryRunner.query(`DROP TABLE "modules"`);
        await queryRunner.query(`
      ALTER TABLE "roles"
      DROP CONSTRAINT "roles_name_key"
    `);
        await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "id_role" uuid,
      ALTER COLUMN "id_tenant" DROP NOT NULL,
      ADD CONSTRAINT "users_id_role_fkey" FOREIGN KEY ("id_role") REFERENCES "roles"("id")
    `);
    }
}
exports.AddRoleModulePermissionsAndUserRoles1710000000003 = AddRoleModulePermissionsAndUserRoles1710000000003;
//# sourceMappingURL=1710000000003-AddRoleModelPermissionsAndUserRoles.js.map