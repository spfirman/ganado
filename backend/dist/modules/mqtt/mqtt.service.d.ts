import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LocationService } from '../farm/services/location.service';
export declare class MqttService implements OnModuleInit, OnModuleDestroy {
    private readonly locationService;
    private client;
    private configService;
    private logger;
    constructor(configService: ConfigService, locationService: LocationService);
    handleEvent(message: any): void;
    onModuleInit(): void;
    onModuleDestroy(): void;
}
