"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateModules1710000000018 = void 0;
class UpdateModules1710000000018 {
    name = 'UpdateModules1710000000018';
    async up(queryRunner) {
        await queryRunner.query(`UPDATE modules SET access_details = '{"brands": "CRUDL", "cattle": "CRUDL"}' WHERE code = 'FARM'`);
        await queryRunner.query(`UPDATE modules SET access_details = '{"cattle": "CRUDL", "receptions": "CRUDL"}' WHERE code = 'RECEPTION'`);
    }
    async down(queryRunner) {
    }
}
exports.UpdateModules1710000000018 = UpdateModules1710000000018;
//# sourceMappingURL=1710000000018-UpdateModules%20copy.js.map