import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDualEartagsToCattle1710000000022 implements MigrationInterface {
    name = 'AddDualEartagsToCattle1710000000022';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'cattle'
            AND column_name = 'eartag'
        ) THEN
          ALTER TABLE "cattle" RENAME COLUMN "eartag" TO "eartag_left";
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle"
      ADD COLUMN IF NOT EXISTS "eartag_right" varchar(50);
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_eartag_history"
      ADD COLUMN IF NOT EXISTS "data" jsonb;
    `);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'cattle_eartag_history'
            AND column_name = 'eartag_number'
        ) THEN
          UPDATE "cattle_eartag_history"
          SET "data" = jsonb_build_object('eartagLeft', "eartag_number")
          WHERE "eartag_number" IS NOT NULL;
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      UPDATE "cattle_eartag_history"
      SET "data" = '{}'::jsonb
      WHERE "data" IS NULL;
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_eartag_history"
      ALTER COLUMN "data" SET NOT NULL;
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_eartag_history"
      DROP COLUMN IF EXISTS "eartag_number";
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      ALTER TABLE "cattle"
      DROP COLUMN IF EXISTS "eartag_right";
    `);
        await queryRunner.query(`
      DO $$
      BEGIN
        IF EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = 'cattle'
            AND column_name = 'eartag_left'
        ) THEN
          ALTER TABLE "cattle" RENAME COLUMN "eartag_left" TO "eartag";
        END IF;
      END $$;
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_eartag_history"
      ADD COLUMN IF NOT EXISTS "eartag_number" varchar(50);
    `);
        await queryRunner.query(`
      UPDATE "cattle_eartag_history"
      SET "eartag_number" = COALESCE("data"->>'eartagLeft', "data"->>'eartagRight')
      WHERE "data" IS NOT NULL;
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_eartag_history"
      ALTER COLUMN "eartag_number" SET NOT NULL;
    `);
        await queryRunner.query(`
      ALTER TABLE "cattle_eartag_history"
      DROP COLUMN IF EXISTS "data";
    `);
    }
}
