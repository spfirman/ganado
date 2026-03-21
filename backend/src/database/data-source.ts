import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { join } from 'path';

config();

const configService = new ConfigService();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: configService.get('FA_DB_HOST'),
  port: configService.get('FA_DB_PORT'),
  username: configService.get('FA_DB_USER'),
  password: configService.get('FA_DB_PASSWORD'),
  database: configService.get('FA_DB_NAME'),
  schema: configService.get('DB_SCHEMA'),
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
  migrationsRun: true,
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
