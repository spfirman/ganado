"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddContextToCattleWeightHistory1710000000014 = void 0;
class AddContextToCattleWeightHistory1710000000014 {
    constructor() {
        this.name = 'AddContextToCattleWeightHistory1710000000014';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."weight_context_enum" AS ENUM('SALE', 'PURCHASE', 'EVENT', 'MANUAL')`);
        await queryRunner.query(`ALTER TABLE "cattle_weight_history" ADD "context" "public"."weight_context_enum" NOT NULL DEFAULT 'EVENT'`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "cattle_weight_history" DROP COLUMN "context"`);
        await queryRunner.query(`DROP TYPE "public"."weight_context_enum"`);
    }
}
exports.AddContextToCattleWeightHistory1710000000014 = AddContextToCattleWeightHistory1710000000014;
//# sourceMappingURL=1710000000014-AddContextToCattleWeightHistory.js.map