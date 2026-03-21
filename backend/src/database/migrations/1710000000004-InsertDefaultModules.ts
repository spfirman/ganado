import { MigrationInterface, QueryRunner } from 'typeorm';

export class InsertDefaultModules1710000000004 implements MigrationInterface {
    name = 'InsertDefaultModules1710000000004';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      INSERT INTO modules (id, name, description) VALUES
      (uuid_generate_v4(), 'Accountant', 'Gestión contable'),
      (uuid_generate_v4(), 'Employee Management', 'Gestión de empleados'),
      (uuid_generate_v4(), 'Employee Work Management', 'Gestión de trabajo de empleados'),
      (uuid_generate_v4(), 'Farm', 'Gestión de granjas y fincas'),
      (uuid_generate_v4(), 'Production Center', 'Gestión de centros de producción')
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
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
