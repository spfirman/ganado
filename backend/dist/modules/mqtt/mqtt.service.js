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
var MqttService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = __importStar(require("mqtt"));
const config_1 = require("@nestjs/config");
const location_service_1 = require("../farm/services/location.service");
let MqttService = MqttService_1 = class MqttService {
    locationService;
    client;
    configService;
    logger;
    constructor(configService, locationService) {
        this.locationService = locationService;
        this.configService = configService;
        this.logger = new common_1.Logger(MqttService_1.name);
    }
    handleEvent(message) {
        this.logger.debug('Processing MQTT event:', message);
    }
    onModuleInit() {
        const mqttHost = this.configService.get('MQTT_BROKER_HOST');
        if (!mqttHost) {
            throw new Error('MQTT_BROKER_HOST is not defined in environment variables');
        }
        const mqttPort = this.configService.get('MQTT_BROKER_PORT');
        if (!mqttPort) {
            throw new Error('MQTT_BROKER_PORT is not defined in environment variables');
        }
        const mqttProtocol = this.configService.get('MQTT_BROKER_PROTOCOL');
        if (!mqttProtocol) {
            throw new Error('MQTT_BROKER_PROTOCOL is not defined in environment variables');
        }
        const mqttOptions = {
            host: mqttHost,
            port: parseInt(mqttPort),
            protocol: mqttProtocol,
            reconnectPeriod: 3000,
            connectTimeout: 15000,
            keepalive: 30,
        };
        this.logger.log(`MQTT_BROKER_URL=${mqttProtocol}://${mqttHost}:${mqttPort}`);
        this.client = mqtt.connect(mqttOptions);
        this.client.on('connect', () => {
            this.logger.log('Conectado al servidor MQTT');
            this.client.subscribe('application/#', (err) => {
                if (err) {
                    this.logger.error('Error al suscribirse:', err);
                }
                else {
                    this.logger.log('Suscripción exitosa a application/#');
                }
            });
        });
        this.client.on('message', (topic, message) => {
            this.logger.log(`Mensaje recibido en ${topic}`);
            this.logger.debug(message.toString());
            const parsedMessage = JSON.parse(message.toString());
            this.logger.debug(`Parsed message: ${JSON.stringify(parsedMessage)}`);
            const info = parsedMessage.rxInfo;
            this.logger.debug(info);
            if (info !== undefined) {
                const locationInfo = info[0].location;
                this.logger.debug(`Location info: ${JSON.stringify(locationInfo)}`);
                if (locationInfo !== undefined) {
                    const idTenant = parsedMessage.deviceInfo.tags.idTenant;
                    const idCattle = parsedMessage.deviceInfo.tags.idCattle;
                    const idDevice = parsedMessage.deviceInfo.tags.idDevice;
                    if (idCattle !== undefined && idDevice !== undefined && idTenant !== undefined) {
                        const locationDto = {
                            idTenant: idTenant,
                            idDevice: idDevice,
                            idCattle: idCattle,
                            latitude: locationInfo.latitude,
                            longitude: locationInfo.longitude,
                            altitude: locationInfo.altitude,
                            time: new Date(parsedMessage.time),
                        };
                        this.locationService.create(locationDto);
                    }
                }
            }
        });
        this.client.on('error', (err) => {
            this.logger.error('Error en MQTT:', err);
        });
    }
    onModuleDestroy() {
        if (this.client) {
            this.client.end();
        }
    }
};
exports.MqttService = MqttService;
exports.MqttService = MqttService = MqttService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        location_service_1.LocationService])
], MqttService);
//# sourceMappingURL=mqtt.service.js.map