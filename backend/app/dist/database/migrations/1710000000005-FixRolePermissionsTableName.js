"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixRolePermissionsTableName1710000000005 = void 0;
class FixRolePermissionsTableName1710000000005 {
    name = 'FixRolePermissionsTableName1710000000005';
    async up(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE IF EXISTS "role_model_permissions"
      RENAME TO "role_module_permissions"
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      ALTER TABLE IF EXISTS "role_module_permissions"
      RENAME TO "role_model_permissions"
    `);
    }
}
exports.FixRolePermissionsTableName1710000000005 = FixRolePermissionsTableName1710000000005;
//# sourceMappingURL=1710000000005-FixRolePermissionsTableName.js.map