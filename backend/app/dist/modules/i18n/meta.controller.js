"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const passport_1 = require("@nestjs/passport");
const os = require("os");
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
            git: { commit: process.env.GIT_COMMIT || 'unknown', branch: process.env.GIT_BRANCH || 'unknown', tag: process.env.GIT_TAG || '' },
            docker: { image: process.env.DOCKER_IMAGE || '', containerId: os.hostname() },
            runtime: { node: process.version, platform: process.platform, arch: process.arch, pid: process.pid },
            uptime: { seconds: Math.floor(uptime), formatted: `${hours}h ${minutes}m ${seconds}s`, startedAt: startedAt.toISOString() },
            features: { mqtt: process.env.MQTT_ENABLED === 'true', massEvents: process.env.MASS_EVENTS_ENABLED !== 'false' },
            timestamp: new Date().toISOString(),
        };
    }
};
exports.MetaController = MetaController;
__decorate([
    (0, common_1.Get)('/__meta'),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)('jwt')),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Runtime metadata (admin only)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MetaController.prototype, "getMeta", null);
exports.MetaController = MetaController = __decorate([
    (0, swagger_1.ApiTags)('System'),
    (0, common_1.Controller)()
], MetaController);
