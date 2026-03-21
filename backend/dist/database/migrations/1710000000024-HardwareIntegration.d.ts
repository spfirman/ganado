import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class HardwareIntegration1710000000024 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
