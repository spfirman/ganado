import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class UpdateCattleAndLots1710000000020 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("simple_events", new TableColumn({
            name: "is_active",
            type: "boolean",
            default: true,
            isNullable: false
        }));
        await queryRunner.addColumn("cattle", new TableColumn({
            name: "has_horns",
            type: "boolean",
            default: false,
            isNullable: false
        }));
        await queryRunner.query(`CREATE TYPE "gender_enum" AS ENUM (
            'MALE', 'FEMALE'
          );`);
        await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "sex";`);
        await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "age";`);
        await queryRunner.query(`ALTER TABLE "lots" ADD COLUMN "gender" "gender_enum";`);
        await queryRunner.query(`ALTER TABLE "cattle" ADD COLUMN "gender" "gender_enum" NOT NULL DEFAULT 'MALE';`);
        await queryRunner.query(`ALTER TABLE "cattle" ADD COLUMN "age" numeric(4,2);`);
        await queryRunner.query(`ALTER TABLE "purchase_receptions" ADD COLUMN "next_cattle_number" VARCHAR(50);`);
        await queryRunner.query(`UPDATE "cattle" SET "lot" = "lots"."lot_number" FROM "lots" WHERE "cattle"."id_lot" = "lots"."id";`);
        await queryRunner.query(`
            DO $$
            BEGIN
            IF EXISTS (
                SELECT 1 FROM pg_constraint
                WHERE conrelid = 'public.cattle'::regclass
                AND conname = 'chk_cattle_number_no_leading_zero'
            ) THEN
                ALTER TABLE public.cattle DROP CONSTRAINT chk_cattle_number_no_leading_zero;
            END IF;
            END $$;
        `);
        await queryRunner.commitTransaction();
        await queryRunner.query(`ALTER TYPE "weight_context_enum" ADD VALUE 'RECEIVED';`);
        await queryRunner.startTransaction();
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("simple_events", "is_active");
        await queryRunner.dropColumn("cattle", "has_horns");
        await queryRunner.dropColumn("cattle", "gender");
        await queryRunner.dropColumn("cattle", "age");
        await queryRunner.query(`ALTER TABLE "lots" DROP COLUMN "gender";`);
        await queryRunner.query(`ALTER TABLE "lots" ADD COLUMN "sex" varchar(20);`);
        await queryRunner.query(`ALTER TABLE "lots" ADD COLUMN "age" varchar(50);`);
        await queryRunner.query(`DROP TYPE IF EXISTS "gender_enum";`);
        await queryRunner.query(`ALTER TABLE "purchase_receptions" DROP COLUMN "next_cattle_number";`);
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                SELECT 1 FROM pg_constraint
                WHERE conrelid = 'public.cattle'::regclass
                    AND conname = 'chk_cattle_number_no_leading_zero'
                ) THEN
                ALTER TABLE public.cattle
                ADD CONSTRAINT chk_cattle_number_no_leading_zero
                CHECK (number ~ '^[1-9][0-9]*$');
                END IF;
            END $$;
        `);
        await queryRunner.commitTransaction();
        await queryRunner.query(`ALTER TYPE "weight_context_enum" DROP VALUE 'RECEIVED';`);
        await queryRunner.startTransaction();
    }
}
