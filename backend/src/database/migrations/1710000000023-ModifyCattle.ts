import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifyCattle1710000000023 implements MigrationInterface {
    name = 'ModifyCattle1710000000023';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "cattle"
      DROP COLUMN IF EXISTS "lot";
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      DROP COLUMN IF EXISTS "age";
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      ADD COLUMN IF NOT EXISTS "birth_date_aprx" date;
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      ADD COLUMN IF NOT EXISTS "new_feed_start_date" date;
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      ADD COLUMN IF NOT EXISTS "average_daily_gain" numeric(6,3);
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "cattle"
      DROP COLUMN IF EXISTS "average_daily_gain";
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      DROP COLUMN IF EXISTS "new_feed_start_date";
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      DROP COLUMN IF EXISTS "birth_date_aprx";
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      ADD COLUMN IF NOT EXISTS "lot" varchar(10);
    `);
    }
}
