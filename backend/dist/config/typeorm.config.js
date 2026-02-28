"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const data_source_1 = require("../database/data-source");
exports.typeOrmConfig = {
    ...data_source_1.dataSourceOptions,
    autoLoadEntities: true,
};
//# sourceMappingURL=typeorm.config.js.map