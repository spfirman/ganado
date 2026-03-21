import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ProviderRepository } from '../repositories/provider.repository';
import { Provider } from '../entities/provider.entity';
import { Contact } from '../entities/contact.entity';

@Injectable()
export class ProviderService {
  private readonly logger = new Logger(ProviderService.name);

  constructor(
    private readonly providerRepository: ProviderRepository,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly dataSource: DataSource,
  ) {}

  async createProvider(data: {
    name: string;
    nit: string;
    type: string;
    idTenant: string;
    address?: string;
    contactPersonName?: string;
    phone1?: string;
    phone2?: string;
    email?: string;
  }): Promise<Provider> {
    if (!data.name || data.name.trim() === '') {
      throw new BadRequestException('Provider name is required');
    }
    if (!data.nit || data.nit.trim() === '') {
      throw new BadRequestException('NIT is required');
    }
    if (!data.type) {
      throw new BadRequestException('Provider type is required');
    }

    const existing = await this.providerRepository.findByNit(data.nit, data.idTenant);
    if (existing) {
      return existing;
    }

    return await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
      let contactPersonId: string | undefined;

      if (data.contactPersonName || data.phone1 || data.phone2 || data.email) {
        if (data.email && !this.isValidEmail(data.email)) {
          throw new BadRequestException('Invalid email format');
        }

        const contactRepo = transactionalEntityManager.getRepository(Contact);
        const contact = contactRepo.create({
          idTenant: data.idTenant,
          name: data.contactPersonName || '',
          phone1: data.phone1,
          phone2: data.phone2,
          email: data.email,
        });
        const savedContact = await contactRepo.save(contact);
        contactPersonId = savedContact.id;
      }

      const providerRepo = transactionalEntityManager.getRepository(Provider);
      const provider = providerRepo.create({
        name: data.name,
        nit: data.nit,
        idTenant: data.idTenant,
        type: data.type,
        address: data.address,
        contactPersonId,
      });
      return await providerRepo.save(provider);
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async findByNit(nit: string, idTenant: string): Promise<Provider> {
    const provider = await this.providerRepository.findByNit(nit, idTenant);
    if (!provider) {
      throw new NotFoundException('Provider not found by NIT');
    }
    return provider;
  }

  async searchProvidersByNit(nitFragment: string, idTenant: string): Promise<Provider[]> {
    return this.providerRepository.findByNitLike(nitFragment, idTenant);
  }

  async findById(id: string, idTenant: string): Promise<Provider> {
    const provider = await this.providerRepository.findById(id, idTenant);
    if (!provider) {
      throw new NotFoundException('Provider not found by ID');
    }
    return provider;
  }

  async findAll(idTenant: string): Promise<Provider[]> {
    return this.providerRepository.findAll(idTenant);
  }

  async searchByName(name: string, idTenant: string): Promise<Provider[]> {
    this.logger.debug(`Searching providers by name: "${name}" for tenant: ${idTenant}`);
    const allProviders = await this.providerRepository.findAllWithRelations(idTenant);
    this.logger.debug(`Found ${allProviders.length} total providers for tenant`);

    if (!name || name.trim() === '') {
      return allProviders;
    }

    const searchTerm = name.toLowerCase();
    const filtered = allProviders.filter((p) => p.name.toLowerCase().includes(searchTerm));
    this.logger.debug(`Filtered to ${filtered.length} providers matching "${searchTerm}"`);
    return filtered;
  }

  async updateById(id: string, idTenant: string, data: Partial<Provider>): Promise<void> {
    const existing = await this.findById(id, idTenant);
    if (data.nit && data.nit !== existing.nit) {
      const existingByNit = await this.providerRepository.findByNit(data.nit, idTenant);
      if (existingByNit) {
        throw new ConflictException('NIT already exists for this tenant');
      }
    }
    await this.providerRepository.updateById(existing.id, idTenant, data);
  }

  async updateByNit(nit: string, idTenant: string, data: Partial<Provider>): Promise<void> {
    const existing = await this.findByNit(nit, idTenant);
    await this.providerRepository.updateByNit(existing.nit, idTenant, data);
  }

  async deleteById(id: string, idTenant: string): Promise<void> {
    const existing = await this.findById(id, idTenant);
    await this.providerRepository.deleteById(existing.id, idTenant);
  }

  async deleteByNit(nit: string, idTenant: string): Promise<void> {
    const existing = await this.findByNit(nit, idTenant);
    await this.providerRepository.deleteByNit(existing.nit, idTenant);
  }
}
