import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyDeviceTable1710000000008 implements MigrationInterface {
    name = 'ModifyDeviceTable1710000000008';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "public".devices ADD cs_application_id uuid NOT NULL;
    `);
        await queryRunner.query(`
      ALTER TABLE "public".devices ADD cs_joineui varchar(16);
    `);
        await queryRunner.query(`
      ALTER TABLE "public".devices ADD cs_app_key varchar(32);
    `);
        await queryRunner.query(`
      ALTER TABLE "public".devices ADD cs_nwk_key varchar(32);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "public".devices DROP COLUMN cs_application_id;
    `);
        await queryRunner.query(`
      ALTER TABLE "public".devices DROP COLUMN cs_joineui;
    `);
        await queryRunner.query(`
      ALTER TABLE "public".devices DROP COLUMN cs_app_key;
    `);
        await queryRunner.query(`
      ALTER TABLE "public".devices DROP COLUMN cs_nwk_key;
    `);
    }
}
