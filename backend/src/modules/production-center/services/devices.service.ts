import { Injectable, Logger, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { DeviceRepository } from '../repositories/device.repository';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { DeviceProfileRepository } from '../repositories/device-profile.repository';
import * as ExcelJS from 'exceljs';
import { promises as fs } from 'fs';
import { Device } from '../entities/device.entity';
import { DeviceProfile } from '../entities/device-profile.entity';
import { CreateDeviceDto } from '../dto/create-device.dto';
import { UpdateDeviceDto } from '../dto/update-device.dto';
import { EntityManager } from 'typeorm';
import { ChirpstackDevice, ChirpstackDeviceKeys } from '../interfaces/chirpstack-device.interface';

@Injectable()
export class DevicesService {
  private chirpstackUrl: string;
  private chirpstackToken: string;
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly deviceProfileRepository: DeviceProfileRepository,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    const chirpstackUrl = this.configService.get<string>('CHIRPSTACK_API_URL');
    const chirpstackToken = this.configService.get<string>('CHIRPSTACK_API_KEY');
    if (!chirpstackUrl || !chirpstackToken) {
      throw new Error('CHIRPSTACK_API_URL and CHIRPSTACK_API_KEY must be defined in environment variables');
    }
    this.chirpstackUrl = chirpstackUrl;
    this.chirpstackToken = chirpstackToken;
  }

  async create(createDeviceDto: CreateDeviceDto): Promise<Device> {
    const deviceProfile = await this.deviceProfileRepository.findOne(createDeviceDto.idDeviceProfile, createDeviceDto.idTenant);
    if (!deviceProfile) {
      throw new BadRequestException(`Device profile with ID ${createDeviceDto.idDeviceProfile} not found`);
    }

    const deviceChirpstack: ChirpstackDevice = {
      applicationId: deviceProfile.csApplicationId,
      description: createDeviceDto.description,
      devEui: createDeviceDto.deveui,
      deviceProfileId: deviceProfile.idChipstack,
      isDisabled: false,
      joinEui: deviceProfile.csJoineui,
      name: createDeviceDto.name,
      skipFcntCheck: false,
      tags: {},
      variables: {},
    };

    const deviceKeys: ChirpstackDeviceKeys = {
      appKey: deviceProfile.csAppKey,
      nwkKey: deviceProfile.csNwkKey,
    };

    if (createDeviceDto.csJoineui) {
      deviceChirpstack.joinEui = createDeviceDto.csJoineui;
    } else {
      createDeviceDto.csJoineui = deviceProfile.csJoineui;
    }

    if (createDeviceDto.csApplicationId) {
      deviceChirpstack.applicationId = createDeviceDto.csApplicationId;
    } else {
      createDeviceDto.csApplicationId = deviceProfile.csApplicationId;
    }

    if (createDeviceDto.csAppKey) {
      deviceKeys.appKey = createDeviceDto.csAppKey;
    } else {
      createDeviceDto.csAppKey = deviceProfile.csAppKey;
    }

    if (createDeviceDto.csNwkKey) {
      deviceKeys.nwkKey = createDeviceDto.csNwkKey;
    } else {
      createDeviceDto.csNwkKey = deviceProfile.csNwkKey;
    }

    return await this.createDevice(createDeviceDto, deviceProfile, deviceChirpstack, deviceKeys);
  }

  async createDevice(
    createDeviceDto: CreateDeviceDto,
    deviceProfile: DeviceProfile,
    deviceChirpstack: ChirpstackDevice,
    deviceKeys: ChirpstackDeviceKeys,
  ): Promise<Device> {
    const existingDevice = await this.deviceRepository
      .findByDevEuiAndTenantId(createDeviceDto.deveui, createDeviceDto.idTenant)
      .catch(() => null);
    if (existingDevice) {
      throw new ConflictException(`Device with DevEUI ${createDeviceDto.deveui} already exists`);
    }

    const data = await this.createDeviceInChirpstack(deviceChirpstack, deviceKeys);
    if (!data) {
      throw new BadRequestException(`Error creating device in Chirpstack`);
    }

    return await this.deviceRepository.create(createDeviceDto);
  }

  async getDeviceFromChirpstack(deveui: string): Promise<boolean> {
    try {
      const response = await this.httpService.axiosRef.get(`${this.chirpstackUrl}/api/devices/${deveui}`, {
        headers: {
          accept: 'application/json',
          'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
        },
      });
      this.logger.debug(response.data);
      if (response.status === 200) {
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(error.response?.data);
      if (error.response?.status === 401) {
        return false;
      }
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message || 'Unknown error';
      throw new BadRequestException(`Error validating device ${deveui} with Chirpstack, error: ${errorMsg}`);
    }
  }

  async createDeviceInChirpstack(chirpstackDevice: ChirpstackDevice, deviceKeys: ChirpstackDeviceKeys): Promise<boolean> {
    try {
      const deviceExists = await this.getDeviceFromChirpstack(chirpstackDevice.devEui);

      if (!deviceExists) {
        const response = await this.httpService.axiosRef.post(
          `${this.chirpstackUrl}/api/devices`,
          { device: chirpstackDevice },
          {
            headers: {
              accept: 'application/json',
              'Content-Type': 'application/json',
              'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
            },
          },
        );

        if (response.status === 200) {
          await this.httpService.axiosRef.post(
            `${this.chirpstackUrl}/api/devices/${chirpstackDevice.devEui}/keys`,
            { deviceKeys: deviceKeys },
            {
              headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
              },
            },
          );
        }
        return true;
      } else {
        const response = await this.callUpdateDeviceInChirpstack(chirpstackDevice.devEui, chirpstackDevice, deviceKeys);
        return response;
      }
    } catch (error) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message || 'Unknown error';
      this.logger.error(`Error creating device ${chirpstackDevice.devEui} in Chirpstack: ${errorMsg}`, error.stack);
      throw new BadRequestException(`Error creating device ${chirpstackDevice.devEui} with Chirpstack, error: ${errorMsg}`);
    }
  }

  async findOne(deveui: string, idTenant: string, manager?: EntityManager): Promise<Device> {
    return await this.deviceRepository.findByDevEuiAndTenantId(deveui, idTenant, manager);
  }

  async findById(id: string, idTenant: string, manager?: EntityManager): Promise<Device> {
    return await this.deviceRepository.findByIdAndTenantId(id, idTenant, manager);
  }

  async update(deveui: string, idTenant: string, updateDeviceDto: UpdateDeviceDto, manager?: EntityManager): Promise<Device> {
    const existingDevice = await this.deviceRepository.findByDevEuiAndTenantId(deveui, idTenant, manager).catch(() => null);
    if (!existingDevice) {
      throw new BadRequestException(`Device with DevEUI ${deveui} not found`);
    }
    return await this.updateWithDevice(existingDevice, updateDeviceDto, manager);
  }

  async updateWithDevice(device: Device, updateDeviceDto: Partial<UpdateDeviceDto>, manager?: EntityManager): Promise<Device> {
    this.logger.debug(`log_device 1: Updating device ${device.deveui} with device tags: ${JSON.stringify(updateDeviceDto)}`);
    try {
      const deviceChirpstack = await this.updateDeviceInChirpstack(device.deveui, updateDeviceDto, device);
      if (!deviceChirpstack) {
        this.logger.debug(`log_device 2: Error updating device in Chirpstack`);
        throw new BadRequestException(`Error updating device in Chirpstack`);
      }
      this.logger.debug(`log_device 3: Device updated in Chirpstack: ${deviceChirpstack}`);

      const deviceUpdated = await this.deviceRepository.update(device.id, updateDeviceDto, manager);
      if (!deviceUpdated) {
        this.logger.debug(`log_device 4: Error updating device ${device.deveui}`);
        throw new BadRequestException(`Error updating device ${device.deveui}`);
      }
      this.logger.debug(`log_device 5: Device updated: ${deviceUpdated.id}`);
      return deviceUpdated;
    } catch (error) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message || 'Unknown error';
      this.logger.error(`log_device 6: Error updating device ${device.deveui} with Chirpstack, message: ${error.message}, error: ${errorMsg}`);
      this.logger.debug(`log_device 7: ------------------------------------------------------------`);
      this.logger.debug(`log_device 7:${JSON.stringify(error)}`);
      this.logger.debug(`log_device 7: +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++`);
      throw new BadRequestException(`Error updating device ${device.deveui} with Chirpstack, message: ${error.message}, error: ${errorMsg}`);
    }
  }

  async updateDeviceInChirpstack(deveui: string, updateDeviceDto: Partial<UpdateDeviceDto>, device: Device): Promise<boolean> {
    const deviceChirpstack: ChirpstackDevice = {};

    if (updateDeviceDto.csApplicationId) {
      deviceChirpstack.applicationId = updateDeviceDto.csApplicationId;
    } else {
      deviceChirpstack.applicationId = device.csApplicationId;
    }

    if (updateDeviceDto.description) {
      deviceChirpstack.description = updateDeviceDto.description;
    }
    if (updateDeviceDto.deveui) {
      deviceChirpstack.devEui = updateDeviceDto.deveui;
    }
    if (updateDeviceDto.idDeviceProfile) {
      deviceChirpstack.deviceProfileId = updateDeviceDto.idDeviceProfile;
    } else {
      deviceChirpstack.deviceProfileId = device.idChirpstackProfile;
    }
    if (updateDeviceDto.csJoineui) {
      deviceChirpstack.joinEui = updateDeviceDto.csJoineui;
    }
    if (updateDeviceDto.name) {
      deviceChirpstack.name = updateDeviceDto.name;
    } else {
      deviceChirpstack.name = device.name;
    }
    if (updateDeviceDto.tags) {
      deviceChirpstack.tags = updateDeviceDto.tags;
    }
    if (updateDeviceDto.variables) {
      deviceChirpstack.variables = updateDeviceDto.variables;
    }

    const deviceKeys: ChirpstackDeviceKeys = {};
    if (updateDeviceDto.csAppKey) {
      deviceKeys.appKey = updateDeviceDto.csAppKey;
    }
    if (updateDeviceDto.csNwkKey) {
      deviceKeys.nwkKey = updateDeviceDto.csNwkKey;
    }

    const response = await this.callUpdateDeviceInChirpstack(deveui, deviceChirpstack, deviceKeys);
    return response;
  }

  async callUpdateDeviceInChirpstack(deveui: string, deviceChirpstack: ChirpstackDevice, deviceKeys: ChirpstackDeviceKeys): Promise<boolean> {
    try {
      this.logger.debug(`log_device 8: ${JSON.stringify(deviceChirpstack)}`);
      this.logger.debug(`log_device 8: fin ------------------------------------------------------------`);

      const response = await this.httpService.axiosRef.put(
        `${this.chirpstackUrl}/api/devices/${deveui}`,
        { device: deviceChirpstack },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
          },
        },
      );

      if (response.status === 200) {
        this.logger.debug(`log_device 9: OK ------------------------------------------------------------`);
        if (deviceKeys.appKey || deviceKeys.nwkKey) {
          try {
            await this.httpService.axiosRef.post(
              `${this.chirpstackUrl}/api/devices/${deveui}/keys`,
              { deviceKeys: deviceKeys },
              {
                headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
                },
              },
            );
          } catch (error) {
            this.logger.error('Response Chirpstack data:', error.response?.data);
            const putResponse = await this.httpService.axiosRef.put(
              `${this.chirpstackUrl}/api/devices/${deveui}/keys`,
              { deviceKeys: deviceKeys },
              {
                headers: {
                  accept: 'application/json',
                  'Content-Type': 'application/json',
                  'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
                },
              },
            );
            if (putResponse.status === 200) {
              return true;
            } else {
              return false;
            }
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      const errorMsg = error.response?.data ? JSON.stringify(error.response.data) : error.message || 'Unknown error';
      throw new BadRequestException(`Error updating device ${deveui} with Chirpstack, message: ${error.message}, error: ${errorMsg}`);
    }
  }

  async remove(id: string, idTenant: string): Promise<void> {
    const device = await this.deviceRepository.findByDevEuiAndTenantId(id, idTenant);
    if (!device) {
      throw new BadRequestException(`Device with ID ${id} not found`);
    }

    const response = await this.httpService.axiosRef.delete(`${this.chirpstackUrl}/api/devices/${device.deveui}`, {
      headers: {
        accept: 'application/json',
        'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
      },
    });

    if (response.status === 200) {
      await this.deviceRepository.remove(id);
    }
    throw new BadRequestException(`Error removing device ${device.deveui} from Chirpstack`);
  }

  async existChirpstackApplicationId(idApplication: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.chirpstackUrl}/api/applications/${idApplication}`, {
          headers: {
            accept: 'application/json',
            'Grpc-Metadata-Authorization': `Bearer ${this.chirpstackToken}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 404) {
        throw new BadRequestException(
          `Application with ID ${idApplication} not found in Chirpstack, message: ${error.message}, error: ${error.response?.data}`,
        );
      }
      throw new BadRequestException(
        `Error validating application with Chirpstack, message: ${error.message}, error: ${error.response?.data}`,
      );
    }
  }

  async findAll(idTenant: string): Promise<Device[]> {
    return await this.deviceRepository.findAll(idTenant);
  }

  async importDevicesFromExcel(file: any, idTenant: string, deviceProfileId: string): Promise<any> {
    try {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(file.path);
      const worksheet = workbook.worksheets[0];

      if (!worksheet) {
        throw new BadRequestException('The Excel sheet does not exist or is empty');
      }

      let deviceProfile: DeviceProfile | null = null;
      if (deviceProfileId) {
        deviceProfile = await this.deviceProfileRepository.findOne(deviceProfileId, idTenant);
        if (!deviceProfile) {
          throw new BadRequestException(`Device profile with ID ${deviceProfileId} not found`);
        }
      }

      const datos = await this.processSheet(worksheet, idTenant, deviceProfile);
      return datos;
    } catch (error) {
      throw new InternalServerErrorException('Error processing the Excel file');
    } finally {
      fs.unlink(file.path)
        .then(() => this.logger.debug(`File ${file.originalname} deleted from ${file.path}`))
        .catch((err) => this.logger.error(`Error deleting file ${file.path}: ${err.message}`));
    }
  }

  async processSheet(worksheet: ExcelJS.Worksheet, idTenant: string, deviceProfile: DeviceProfile | null): Promise<any> {
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
      try {
        const row = worksheet.getRow(rowNumber);
        const rowValues = Array.isArray(row.values)
          ? row.values.slice(1).map((v: any) => (typeof v === 'object' && v?.result !== undefined ? v.result : v))
          : [];

        if (rowValues.length === 0) {
          results.errors.push(`Row ${rowNumber} is empty`);
          results.failed++;
          continue;
        }

        const deveui = rowValues[0];

        if (!deviceProfile && rowValues.length < 3) {
          results.errors.push(`Row ${rowNumber}, ${deveui}, has not the required columns: devEui, deviceName, deviceProfileId.`);
          results.failed++;
          continue;
        }

        if (rowValues.length < 2) {
          results.errors.push(`Row ${rowNumber}, ${deveui}, has not the required columns: devEui, deviceName.`);
          results.failed++;
          continue;
        }

        let currentDeviceProfile = deviceProfile;
        if (!currentDeviceProfile) {
          try {
            currentDeviceProfile = await this.deviceProfileRepository.findOne(rowValues[2], idTenant);
            if (!currentDeviceProfile) {
              throw new Error(`Device profile with ID ${rowValues[2]} not found`);
            }
          } catch (error) {
            results.errors.push(`Row ${rowNumber}, ${deveui}, ${error.message}`);
            results.failed++;
            continue;
          }
        }

        try {
          const device = await this.processExcelRow(rowValues, rowNumber, idTenant, currentDeviceProfile);
          results.success++;
        } catch (error) {
          results.errors.push(`Row ${rowNumber}, ${deveui}, ${error.message}`);
          results.failed++;
        }
      } catch (error) {
        results.errors.push(`Row ${rowNumber}, ${error.message}`);
        results.failed++;
      }
    }

    return results;
  }

  async processExcelRow(rowValues: any[], rowNumber: number, idTenant: string, deviceProfile: DeviceProfile): Promise<Device> {
    const createDeviceDto: any = {
      idTenant: idTenant,
      idDeviceProfile: deviceProfile.id,
      deveui: rowValues[0],
      name: rowValues[1],
      description: '',
      csApplicationId: deviceProfile.csApplicationId,
      csJoineui: deviceProfile.csJoineui,
      csAppKey: deviceProfile.csAppKey,
      csNwkKey: deviceProfile.csNwkKey,
      tags: {},
      variables: {},
    };

    const deviceChirpstack: ChirpstackDevice = {
      applicationId: deviceProfile.csApplicationId,
      description: createDeviceDto.description,
      devEui: createDeviceDto.deveui,
      deviceProfileId: deviceProfile.idChipstack,
      isDisabled: false,
      joinEui: deviceProfile.csJoineui,
      name: createDeviceDto.name,
      skipFcntCheck: false,
      tags: {},
      variables: {},
    };

    const deviceKeys: ChirpstackDeviceKeys = {
      appKey: deviceProfile.csAppKey,
      nwkKey: deviceProfile.csNwkKey,
    };

    if (rowValues.length >= 4) {
      createDeviceDto.description = rowValues[3];
      deviceChirpstack.description = rowValues[3];
    }
    if (rowValues.length >= 5) {
      createDeviceDto.csJoineui = rowValues[4];
      deviceChirpstack.joinEui = rowValues[4];
    }
    if (rowValues.length >= 6) {
      createDeviceDto.csNwkKey = rowValues[5];
      deviceKeys.nwkKey = rowValues[5];
    }
    if (rowValues.length >= 7) {
      createDeviceDto.tags = rowValues[6];
      deviceChirpstack.tags = rowValues[6];
    }
    if (rowValues.length >= 8) {
      createDeviceDto.variables = rowValues[7];
      deviceChirpstack.variables = rowValues[7];
    }

    try {
      const device = await this.createDevice(createDeviceDto, deviceProfile, deviceChirpstack, deviceKeys);
      return device;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
