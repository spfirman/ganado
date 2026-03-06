"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const os = __importStar(require("os"));
const startedAt = new Date();
let MetaController = class MetaController {
    getMeta() {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        return {
            hostname: os.hostname(),
            environment: process.env.NODE_ENV || process.env.ENVIRONMENT || 'development',
            version: process.env.APP_VERSION || '0.1.0',
            git: {
                commit: process.env.GIT_COMMIT || 'unknown',
                branch: process.env.GIT_BRANCH || 'unknown',
                tag: process.env.GIT_TAG || '',
            },
            docker: {
                image: process.env.DOCKER_IMAGE || '',
                containerId: os.hostname(),
            },
            runtime: {
                node: process.version,
                platform: process.platform,
                arch: process.arch,
                pid: process.pid,
            },
            uptime: {
                seconds: Math.floor(uptime),
                formatted: `${hours}h ${minutes}m ${seconds}s`,
                startedAt: startedAt.toISOString(),
            },
            features: {
                mqtt: process.env.MQTT_ENABLED === 'true',
                massEvents: process.env.MASS_EVENTS_ENABLED !== 'false',
            },
            timestamp: new Date().toISOString(),
        };
    }
    getMetrics() {
        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const cpus = os.cpus();
        const memUsage = process.memoryUsage();
        const uptimeSec = process.uptime();
        const d = Math.floor(uptimeSec / 86400);
        const h = Math.floor((uptimeSec % 86400) / 3600);
        const m = Math.floor((uptimeSec % 3600) / 60);
        const uptimeHuman = d > 0 ? `${d}d ${h}h ${m}m` : h > 0 ? `${h}h ${m}m` : `${m}m`;
        return {
            success: true,
            data: {
                timestamp: new Date().toISOString(),
                system: {
                    hostname: os.hostname(),
                    platform: os.platform(),
                    arch: os.arch(),
                    cpuCount: cpus.length,
                    cpuModel: cpus[0]?.model,
                    loadAverage: os.loadavg(),
                    memoryTotal: totalMem,
                    memoryFree: freeMem,
                    memoryUsedPercent: ((totalMem - freeMem) / totalMem * 100).toFixed(1),
                    osUptime: os.uptime(),
                    osUptimeHuman: uptimeHuman,
                },
                process: {
                    pid: process.pid,
                    nodeVersion: process.version,
                    uptime: uptimeSec,
                    uptimeHuman,
                    memoryRss: memUsage.rss,
                    memoryHeapUsed: memUsage.heapUsed,
                    memoryHeapTotal: memUsage.heapTotal,
                    memoryExternal: memUsage.external,
                },
                environment: {
                    nodeEnv: process.env.NODE_ENV || 'development',
                    appVersion: process.env.APP_VERSION || '0.0.1',
                    gitCommit: process.env.GIT_COMMIT || 'dev',
                    gitBranch: process.env.GIT_BRANCH || 'unknown',
                    buildTime: process.env.BUILD_TIME || 'unknown',
                },
            },
        };
    }
};
exports.MetaController = MetaController;
__decorate([
    (0, common_1.Get)('/__meta'),
    (0, swagger_1.ApiOperation)({ summary: 'Runtime metadata (public for monitoring)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "getMeta", null);
__decorate([
    (0, common_1.Get)('api/v1/admin/metrics'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Admin system metrics' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "getMetrics", null);
exports.MetaController = MetaController = __decorate([
    (0, swagger_1.ApiTags)('System'),
    (0, common_1.Controller)()
], MetaController);
