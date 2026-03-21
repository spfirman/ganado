"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModifyDeviceTable1710000000008 = void 0;
class ModifyDeviceTable1710000000008 {
    constructor() {
        this.name = 'ModifyDeviceTable1710000000008';
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.ModifyDeviceTable1710000000008 = ModifyDeviceTable1710000000008;
//# sourceMappingURL=1710000000008-ModifyDeviceTable.js.map