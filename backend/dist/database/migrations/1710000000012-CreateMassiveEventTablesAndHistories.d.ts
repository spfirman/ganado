import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class CreateMassiveEventTablesAndHistories1710000000012 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
