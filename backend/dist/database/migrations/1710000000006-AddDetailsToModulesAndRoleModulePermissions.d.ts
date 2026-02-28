import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class AddDetailsToModulesAndRoleModulePermissions1710000000006 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
