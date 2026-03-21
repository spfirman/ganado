import { Repository, ILike, EntityManager } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Provider } from '../entities/provider.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProviderRepository {
  constructor(
    @InjectRepository(Provider)
    private readonly repository: Repository<Provider>,
  ) {}

  async createProvider(data: Partial<Provider>): Promise<Provider> {
    const provider = this.repository.create(data);
    return this.repository.save(provider);
  }

  async findByNit(nit: string, idTenant: string): Promise<Provider | null> {
    return this.repository.findOne({
      where: {
        nit,
        idTenant,
      },
    });
  }

  async findByNitLike(nitFragment: string, idTenant: string): Promise<Provider[]> {
    return this.repository.find({
      where: {
        nit: ILike(`%${nitFragment}%`),
        idTenant,
      },
      order: {
        nit: 'ASC',
        name: 'ASC',
      },
    });
  }

  async findById(
    id: string,
    idTenant: string,
    manager?: EntityManager,
  ): Promise<Provider | null> {
    const repo = manager?.getRepository(Provider) ?? this.repository;
    return repo.findOne({
      where: {
        id,
        idTenant,
      },
    });
  }

  async findAll(idTenant: string): Promise<Provider[]> {
    return this.repository.find({ where: { idTenant } });
  }

  async findAllWithRelations(idTenant: string): Promise<Provider[]> {
    return this.repository.find({
      where: { idTenant },
      relations: ['contactPerson'],
    });
  }

  async updateById(id: string, idTenant: string, data: Partial<Provider>): Promise<void> {
    await this.repository.update({ id, idTenant }, data);
  }

  async updateByNit(nit: string, idTenant: string, data: Partial<Provider>): Promise<void> {
    await this.repository.update({ nit, idTenant }, data);
  }

  async deleteById(id: string, idTenant: string): Promise<void> {
    await this.repository.delete({ id, idTenant });
  }

  async deleteByNit(nit: string, idTenant: string): Promise<void> {
    await this.repository.delete({ nit, idTenant });
  }
}
