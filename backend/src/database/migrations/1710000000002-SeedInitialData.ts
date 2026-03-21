import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedInitialData1710000000002 implements MigrationInterface {
    name = 'SeedInitialData1710000000002';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      INSERT INTO roles (id, name, description) VALUES
      (uuid_generate_v4(), 'System Admin IT', 'Administrador del sistema con acceso total'),
      (uuid_generate_v4(), 'Manager', 'Gerente con acceso a gestión general'),
      (uuid_generate_v4(), 'Accountant', 'Contador con acceso a información financiera'),
      (uuid_generate_v4(), 'Farm Worker', 'Trabajador de campo con acceso básico')
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "roles" WHERE "name" IN ('System Admin IT', 'Manager', 'Accountant', 'Farm Worker')`);
    }
}
