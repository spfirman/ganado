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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
let MqttController = class MqttController {
    handleChirpstackEvent(message) {
        console.log('Received ChirpStack event:', message);
        return { ack: true };
    }
    handleGatewayCommand(message) {
        console.log('Received gateway command:', message);
        return { ack: true };
    }
};
exports.MqttController = MqttController;
__decorate([
    (0, microservices_1.MessagePattern)('application/#'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MqttController.prototype, "handleChirpstackEvent", null);
__decorate([
    (0, microservices_1.MessagePattern)('au915_0/gateway/+/command/+'),
    __param(0, (0, microservices_1.Payload)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MqttController.prototype, "handleGatewayCommand", null);
exports.MqttController = MqttController = __decorate([
    (0, common_1.Controller)()
], MqttController);
//# sourceMappingURL=mqtt.controller.js.map