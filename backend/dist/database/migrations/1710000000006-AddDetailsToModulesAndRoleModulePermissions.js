"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddDetailsToModulesAndRoleModulePermissions1710000000006 = void 0;
const typeorm_1 = require("typeorm");
class AddDetailsToModulesAndRoleModulePermissions1710000000006 {
    constructor() {
        this.name = 'AddDetailsToModulesAndRoleModulePermissions1710000000006';
    }
    async up(queryRunner) {
        await queryRunner.addColumn('modules', new typeorm_1.TableColumn({
            name: 'code',
            type: 'varchar',
            length: '20',
            isNullable: true
        }));
        await queryRunner.addColumn('modules', new typeorm_1.TableColumn({
            name: 'access_details',
            type: 'jsonb',
            isNullable: true
        }));
        await queryRunner.addColumn('roles', new typeorm_1.TableColumn({
            name: 'code',
            type: 'varchar',
            length: '20',
            isNullable: true
        }));
        await queryRunner.addColumn('role_module_permissions', new typeorm_1.TableColumn({
            name: 'can_list',
            type: 'boolean',
            isNullable: false,
            default: true
        }));
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: 'active',
            type: 'boolean',
            isNullable: false,
            default: true
        }));
        await queryRunner.query(`
      ALTER TABLE role_module_permissions ALTER COLUMN can_list SET DEFAULT false;
    `);
        await queryRunner.query(`
      UPDATE modules SET code = 'ACC' WHERE name = 'Accountant';
    `);
        await queryRunner.query(`
      UPDATE modules SET code = 'EMP_MGMT',
       access_details = '{"tenants":"CRUD0", "users":"CRUDL", "roles":"0R00L",  "modules":"0R00L", "permissions":"CRUDL"}'::jsonb
       WHERE name = 'Employee Management';
    `);
        await queryRunner.query(`
      UPDATE modules SET code = 'EMP_WRK_MGMT' WHERE name = 'Employee Work Management';
    `);
        await queryRunner.query(`
      UPDATE modules SET code = 'FARM' WHERE name = 'Farm';
    `);
        await queryRunner.query(`
      UPDATE modules SET code = 'PROD_CENTER' WHERE name = 'Production Center';
    `);
        await queryRunner.query(`
      ALTER TABLE modules ALTER COLUMN code SET NOT NULL;
    `);
        await queryRunner.query(`
      UPDATE roles SET code = 'SYS_ADMIN' WHERE name = 'System Admin IT';
    `);
        await queryRunner.query(`
      UPDATE roles SET code = 'MANAGER' WHERE name = 'Manager';
    `);
        await queryRunner.query(`
      UPDATE roles SET code = 'ACCOUNTANT' WHERE name = 'Accountant';
    `);
        await queryRunner.query(`
      UPDATE roles SET code = 'FARM_WORKER' WHERE name = 'Farm Worker';
    `);
        await queryRunner.query(`
      ALTER TABLE roles ALTER COLUMN code SET NOT NULL;
    `);
        await queryRunner.query(`
      ALTER TABLE public.role_module_permissions
      DROP CONSTRAINT role_model_permissions_role_module_tenant_key;
    `);
        await queryRunner.query(`
      ALTER TABLE public.role_module_permissions
      ADD CONSTRAINT role_module_permissions_tenat_role_module_uniq
      UNIQUE (tenant_id, id_role, id_module);
    `);
        await queryRunner.query(`ALTER TABLE user_roles DROP CONSTRAINT user_roles_pkey`);
        await queryRunner.query(`ALTER TABLE user_roles DROP CONSTRAINT user_roles_user_role_key`);
        await queryRunner.query(`ALTER TABLE user_roles DROP COLUMN id`);
        await queryRunner.query(`ALTER TABLE user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id_user, id_role)`);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn('modules', 'code');
        await queryRunner.dropColumn('modules', 'access_details');
        await queryRunner.dropColumn('roles', 'code');
        await queryRunner.dropColumn('role_module_permissions', 'can_list');
        await queryRunner.dropColumn('users', 'active');
        await queryRunner.query(`
      ALTER TABLE public.role_module_permissions
      DROP CONSTRAINT role_module_permissions_tenat_role_module_uniq;
    `);
        await queryRunner.query(`
      ALTER TABLE public.role_module_permissions
      ADD CONSTRAINT role_model_permissions_role_module_tenant_key
      UNIQUE (id_role, id_module, tenant_id);
    `);
        await queryRunner.query(`ALTER TABLE user_roles DROP CONSTRAINT user_roles_pkey`);
        await queryRunner.query(`ALTER TABLE user_roles ADD COLUMN id UUID DEFAULT uuid_generate_v4() NOT NULL`);
        await queryRunner.query(`ALTER TABLE user_roles ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id)`);
        await queryRunner.query(`ALTER TABLE user_roles ADD CONSTRAINT user_roles_user_role_key UNIQUE (id_user, id_role)`);
    }
}
exports.AddDetailsToModulesAndRoleModulePermissions1710000000006 = AddDetailsToModulesAndRoleModulePermissions1710000000006;
//# sourceMappingURL=1710000000006-AddDetailsToModulesAndRoleModulePermissions.js.map