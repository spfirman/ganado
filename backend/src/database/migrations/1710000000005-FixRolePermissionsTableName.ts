import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixRolePermissionsTableName1710000000005 implements MigrationInterface {
    name = 'FixRolePermissionsTableName1710000000005';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE IF EXISTS "role_model_permissions"
      RENAME TO "role_module_permissions"
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE IF EXISTS "role_module_permissions"
      RENAME TO "role_model_permissions"
    `);
    }
}
