import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddPurchaseStatus1710000000021 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
