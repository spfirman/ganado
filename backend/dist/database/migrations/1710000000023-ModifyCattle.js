"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyCattle1710000000023 = void 0;
class ModifyCattle1710000000023 {
    constructor() {
        this.name = 'ModifyCattle1710000000023';
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.ModifyCattle1710000000023 = ModifyCattle1710000000023;
//# sourceMappingURL=1710000000023-ModifyCattle.js.map