"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedInitialData1710000000002 = void 0;
class SeedInitialData1710000000002 {
    constructor() {
        this.name = 'SeedInitialData1710000000002';
    }
    async up(queryRunner) {
        await queryRunner.query(`
      INSERT INTO roles (id, name, description) VALUES
      (uuid_generate_v4(), 'System Admin IT', 'Administrador del sistema con acceso total'),
      (uuid_generate_v4(), 'Manager', 'Gerente con acceso a gestión general'),
      (uuid_generate_v4(), 'Accountant', 'Contador con acceso a información financiera'),
      (uuid_generate_v4(), 'Farm Worker', 'Trabajador de campo con acceso básico')
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM "roles" WHERE "name" IN ('System Admin IT', 'Manager', 'Accountant', 'Farm Worker')`);
    }
}
exports.SeedInitialData1710000000002 = SeedInitialData1710000000002;
//# sourceMappingURL=1710000000002-SeedInitialData.js.map