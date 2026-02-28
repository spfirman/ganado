"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourceOptions = void 0;
const typeorm_1 = require("typeorm");
const config_1 = require("@nestjs/config");
const dotenv_1 = require("dotenv");
const path_1 = require("path");
(0, dotenv_1.config)();
const configService = new config_1.ConfigService();
exports.dataSourceOptions = {
    type: 'postgres',
    host: configService.get('FA_DB_HOST'),
    port: configService.get('FA_DB_PORT'),
    username: configService.get('FA_DB_USER'),
    password: configService.get('FA_DB_PASSWORD'),
    database: configService.get('FA_DB_NAME'),
    schema: configService.get('DB_SCHEMA'),
    entities: [(0, path_1.join)(__dirname, '..', '**', '*.entity.{ts,js}')],
    migrations: [(0, path_1.join)(__dirname, 'migrations/*.{ts,js}')],
    migrationsRun: true,
    synchronize: false,
};
const dataSource = new typeorm_1.DataSource(exports.dataSourceOptions);
exports.default = dataSource;
//# sourceMappingURL=data-source.js.map