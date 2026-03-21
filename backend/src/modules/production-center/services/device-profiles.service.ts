import { Injectable, Logger, BadRequestException, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DeviceProfileRepository } from '../repositories/device-profile.repository';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { DevicesService } from './devices.service';
import { DeviceProfile } from '../entities/device-profile.entity';
import { CreateDeviceProfileDto } from '../dto/create-device-profile.dto';
import { UpdateDeviceProfileDto } from '../dto/update-device-profile.dto';

@Injectable()
export class DeviceProfilesService {
  private chirpstackUrl: string;
  private chirpstackToken: string;
  private readonly logger = new Logger(DeviceProfilesService.name);

  constructor(
    private readonly deviceProfileRepository: DeviceProfileRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly devicesService: DevicesService,
  ) {
    const chirpstackUrl = this.configService.get<string>('CHIRPSTACK_API_URL');
    const chirpstackToken = this.configService.get<string>('CHIRPSTACK_API_KEY');
    if (!chirpstackUrl || !chirpstackToken) {
      throw new Error('CHIRPSTACK_API_URL and CHIRPSTACK_API_KEY must be defined in environment variables');
    }
    this.chirpstackUrl = chirpstackUrl;
    this.chirpstackToken = chirpstackToken;
  }

  async create(createDeviceProfileDto: CreateDeviceProfileDto): Promise<DeviceProfile> {
    const existingProfile = await this.deviceProfileRepository
      .findByNameAndTenantId(createDeviceProfileDto.name, createDeviceProfileDto.idTenant)
      .catch(() => null);
    if (existingProfile) {
      throw new ConflictException(`Device profile with name ${createDeviceProfileDto.name} already exists`);
    }
    await this.validateChirpstackDeviceProfile(createDeviceProfileDto.idChipstack);
    await this.devicesService.existChirpstackApplicationId(createDeviceProfileDto.csApplicationId);
    const devProfile = await this.deviceProfileRepository.create(createDeviceProfileDto);
    this.logger.debug(`Device profile ${devProfile.name} created successfully`);
    this.logger.debug(devProfile);
    return devProfile;
  }

  async validateChirpstackDeviceProfile(idChipstack: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.chirpstackUrl}/api/device-profiles/${idChipstack}`, {
          headers: {
            accept: 'application/json',
            'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
          },
        }),
      );
      if (!response.data) {
        throw new BadRequestException(`Device profile with ID ${idChipstack} not found in Chirpstack`);
      }
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        throw new BadRequestException(`Device profile with ID ${idChipstack} not found in Chirpstack`);
      }
      this.logger.error(error.message);
      throw new BadRequestException('Error validating device profile with Chirpstack');
    }
  }

  async findAll(idTenant: string): Promise<DeviceProfile[]> {
    return await this.deviceProfileRepository.findAll(idTenant);
  }

  async findOne(id: string, idTenant: string): Promise<DeviceProfile> {
    return await this.deviceProfileRepository.findOne(id, idTenant);
  }

  async update(id: string, idTenant: string, updateDeviceProfileDto: UpdateDeviceProfileDto): Promise<DeviceProfile> {
    try {
      await this.deviceProfileRepository.findOne(id, idTenant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new ForbiddenException(`You don't have permission to update this device profile`);
      }
      throw error;
    }

    if (updateDeviceProfileDto.name) {
      const existingProfile = await this.deviceProfileRepository
        .findByNameAndTenantId(updateDeviceProfileDto.name, idTenant)
        .catch(() => null);
      if (existingProfile && existingProfile.id !== id) {
        throw new ConflictException(`Device profile with name ${updateDeviceProfileDto.name} already exists`);
      }
    }

    if (updateDeviceProfileDto.idChipstack) {
      await this.validateChirpstackDeviceProfile(updateDeviceProfileDto.idChipstack);
    }

    return await this.deviceProfileRepository.update(id, updateDeviceProfileDto);
  }

  async remove(id: string, idTenant: string): Promise<void> {
    try {
      await this.deviceProfileRepository.findOne(id, idTenant);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new ForbiddenException(`You don't have permission to delete this device profile`);
      }
      throw error;
    }
    await this.deviceProfileRepository.remove(id);
  }
}
