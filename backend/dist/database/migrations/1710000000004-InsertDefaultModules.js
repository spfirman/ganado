"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertDefaultModules1710000000004 = void 0;
class InsertDefaultModules1710000000004 {
    constructor() {
        this.name = 'InsertDefaultModules1710000000004';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      INSERT INTO modules (id, name, description) VALUES
      (uuid_generate_v4(), 'Accountant', 'Gestión contable'),
      (uuid_generate_v4(), 'Employee Management', 'Gestión de empleados'),
      (uuid_generate_v4(), 'Employee Work Management', 'Gestión de trabajo de empleados'),
      (uuid_generate_v4(), 'Farm', 'Gestión de granjas y fincas'),
      (uuid_generate_v4(), 'Production Center', 'Gestión de centros de producción')
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
      DELETE FROM modules
      WHERE name IN (
        'Accountant',
        'Employee Management',
        'Employee Work Management',
        'Farm',
        'Production Center'
      );
    `);
    }
}
exports.InsertDefaultModules1710000000004 = InsertDefaultModules1710000000004;
//# sourceMappingURL=1710000000004-InsertDefaultModules.js.map