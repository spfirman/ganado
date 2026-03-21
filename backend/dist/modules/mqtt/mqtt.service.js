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
var MqttService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MqttService = void 0;
const common_1 = require("@nestjs/common");
const mqtt = require("mqtt");
const config_1 = require("@nestjs/config");
const location_service_1 = require("../farm/services/location.service");
let MqttService = MqttService_1 = class MqttService {
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
        if (!mqttHost || mqttHost === 'localhost') {
            this.logger.warn('MQTT_BROKER_HOST not configured or set to localhost — MQTT disabled');
            return;
        }
        const mqttPort = this.configService.get('MQTT_BROKER_PORT');
        if (!mqttPort) {
            this.logger.warn('MQTT_BROKER_PORT not defined — MQTT disabled');
            return;
        }
        const mqttProtocol = this.configService.get('MQTT_BROKER_PROTOCOL');
        if (!mqttProtocol) {
            this.logger.warn('MQTT_BROKER_PROTOCOL not defined — MQTT disabled');
            return;
        }
        const mqttOptions = {
            host: mqttHost,
            port: parseInt(mqttPort),
            protocol: mqttProtocol,
            reconnectPeriod: 30000,
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
                    this.logger.log('Suscripcion exitosa a application/#');
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