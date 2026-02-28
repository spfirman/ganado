import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class UpdateCattleForReception1710000000017 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
