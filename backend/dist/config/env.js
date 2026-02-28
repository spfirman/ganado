"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = exports.reqInt = exports.req = void 0;
const req = (k) => {
    const v = process.env[k];
    if (!v)
        throw new Error(`Missing env ${k}`);
    return v;
};
exports.req = req;
const reqInt = (k) => {
    const n = parseInt((0, exports.req)(k), 10);
    if (Number.isNaN(n))
        throw new Error(`Env ${k} must be an integer`);
    return n;
};
exports.reqInt = reqInt;
exports.ENV = {
    ENVIRONMENT: (0, exports.req)('ENVIRONMENT'),
    BASE_URL: (0, exports.req)('BASE_URL'),
    APP_PORT_EXTERNAL: (0, exports.reqInt)('APP_PORT_EXTERNAL'),
    FA_DB_PORT_EXTERNAL: (0, exports.reqInt)('FA_DB_PORT_EXTERNAL'),
    FA_REDIS_PORT_EXTERNAL: (0, exports.reqInt)('FA_REDIS_PORT_EXTERNAL'),
    APP_PORT: (0, exports.reqInt)('APP_PORT'),
    CORS_ORIGINS: (0, exports.req)('CORS_ORIGINS'),
    CORS_ALLOWED_LOCAL: (0, exports.req)('CORS_ALLOWED_LOCAL'),
    FA_DB_HOST: (0, exports.req)('FA_DB_HOST'),
    FA_DB_PORT: (0, exports.reqInt)('FA_DB_PORT'),
    FA_DB_NAME: (0, exports.req)('FA_DB_NAME'),
    FA_DB_USER: (0, exports.req)('FA_DB_USER'),
    FA_DB_PASSWORD: (0, exports.req)('FA_DB_PASSWORD'),
    DB_SCHEMA: process.env.DB_SCHEMA ?? 'public',
    DB_MAX_CONNECTIONS: (0, exports.reqInt)('DB_MAX_CONNECTIONS'),
    DB_IDLE_TIMEOUT: (0, exports.reqInt)('DB_IDLE_TIMEOUT'),
    CHIRPSTACK_API_URL: (0, exports.req)('CHIRPSTACK_API_URL'),
    CHIRPSTACK_API_KEY: (0, exports.req)('CHIRPSTACK_API_KEY'),
    JWT_SECRET: (0, exports.req)('JWT_SECRET'),
    JWT_EXPIRATION: (0, exports.req)('JWT_EXPIRATION'),
    FA_REDIS_HOST: (0, exports.req)('FA_REDIS_HOST'),
    FA_REDIS_PORT: (0, exports.reqInt)('FA_REDIS_PORT'),
    FA_REDIS_PASSWORD: (0, exports.req)('FA_REDIS_PASSWORD'),
    MQTT_BROKER_URL: (0, exports.req)('MQTT_BROKER_URL'),
    MQTT_BROKER_HOST: (0, exports.req)('MQTT_BROKER_HOST'),
    MQTT_BROKER_PORT: (0, exports.reqInt)('MQTT_BROKER_PORT'),
    MQTT_BROKER_PROTOCOL: (0, exports.req)('MQTT_BROKER_PROTOCOL'),
};
//# sourceMappingURL=env.js.map