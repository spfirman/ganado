import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class FixRolePermissionsTableName1710000000005 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
