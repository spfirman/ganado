"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPurchaseStatus1710000000021 = void 0;
class AddPurchaseStatus1710000000021 {
    constructor() {
        this.name = 'AddPurchaseStatus1710000000021';
    }
    async up(queryRunner) {
        await queryRunner.query(`CREATE TYPE "public"."purchases_status_enum" AS ENUM('OPEN', 'RECEIVED')`);
        await queryRunner.query(`ALTER TABLE "purchases" ADD "status" "public"."purchases_status_enum" NOT NULL DEFAULT 'OPEN'`);
        await queryRunner.query(`UPDATE "cattle_weight_history" SET "context" = 'RECEIVED' WHERE "context" = 'PURCHASE';`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "purchases" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."purchases_status_enum"`);
        await queryRunner.query(`UPDATE "cattle_weight_history" SET "context" = 'PURCHASE' WHERE "context" = 'RECEIVED';`);
    }
}
exports.AddPurchaseStatus1710000000021 = AddPurchaseStatus1710000000021;
//# sourceMappingURL=1710000000021-AddPurchaseStatus.js.map