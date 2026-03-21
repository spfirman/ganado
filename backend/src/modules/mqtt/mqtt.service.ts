import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { ConfigService } from '@nestjs/config';
import { LocationService } from '../farm/services/location.service';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private client: mqtt.MqttClient;
  private configService: ConfigService;
  private logger: Logger;

  constructor(
    configService: ConfigService,
    private readonly locationService: LocationService,
  ) {
    this.configService = configService;
    this.logger = new Logger(MqttService.name);
  }

  handleEvent(message: any): void {
    this.logger.debug('Processing MQTT event:', message);
  }

  onModuleInit(): void {
    const mqttHost = this.configService.get<string>('MQTT_BROKER_HOST');
    if (!mqttHost || mqttHost === 'localhost') {
      this.logger.warn('MQTT_BROKER_HOST not configured or set to localhost — MQTT disabled');
      return;
    }

    const mqttPort = this.configService.get<string>('MQTT_BROKER_PORT');
    if (!mqttPort) {
      this.logger.warn('MQTT_BROKER_PORT not defined — MQTT disabled');
      return;
    }

    const mqttProtocol = this.configService.get<string>('MQTT_BROKER_PROTOCOL');
    if (!mqttProtocol) {
      this.logger.warn('MQTT_BROKER_PROTOCOL not defined — MQTT disabled');
      return;
    }

    const mqttOptions: mqtt.IClientOptions = {
      host: mqttHost,
      port: parseInt(mqttPort),
      protocol: mqttProtocol as mqtt.IClientOptions['protocol'],
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
        } else {
          this.logger.log('Suscripcion exitosa a application/#');
        }
      });
    });

    this.client.on('message', (topic: string, message: Buffer) => {
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

    this.client.on('error', (err: Error) => {
      this.logger.error('Error en MQTT:', err);
    });
  }

  onModuleDestroy(): void {
    if (this.client) {
      this.client.end();
    }
  }
}
