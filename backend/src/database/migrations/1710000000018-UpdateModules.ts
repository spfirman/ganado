import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateModules1710000000018 implements MigrationInterface {
    name = 'UpdateModules1710000000018';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE modules SET access_details = '{"brands": "CRUDL", "cattle": "CRUDL"}' WHERE code = 'FARM'`);
        await queryRunner.query(`UPDATE modules SET access_details = '{"cattle": "CRUDL", "receptions": "CRUDL"}' WHERE code = 'RECEPTION'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
