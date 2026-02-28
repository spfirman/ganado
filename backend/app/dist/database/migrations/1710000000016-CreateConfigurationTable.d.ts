import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateConfigurationTable1710000000016 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
