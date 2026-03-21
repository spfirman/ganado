import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContextToCattleWeightHistory1710000000014 implements MigrationInterface {
    name = 'AddContextToCattleWeightHistory1710000000014';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."weight_context_enum" AS ENUM('SALE', 'PURCHASE', 'EVENT', 'MANUAL')`);
        await queryRunner.query(`ALTER TABLE "cattle_weight_history" ADD "context" "public"."weight_context_enum" NOT NULL DEFAULT 'EVENT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cattle_weight_history" DROP COLUMN "context"`);
        await queryRunner.query(`DROP TYPE "public"."weight_context_enum"`);
    }
}
