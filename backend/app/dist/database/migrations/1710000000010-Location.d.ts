import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class Location1710000000010 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
